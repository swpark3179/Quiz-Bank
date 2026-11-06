// Android 릴리스 빌드의 R8(코드 축소·최적화·난독화) 설정을 마무리한다.
// minify 자체는 app.json 의 expo-build-properties(enableMinifyInReleaseBuilds)에서 켠다.
//
// 1. Expo SDK 54 의 android/app/build.gradle 템플릿은 release 빌드에
//      proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
//    를 쓴다. proguard-android.txt 에는 `-dontoptimize` 가 들어 있어서 R8 의 코드 최적화가
//    꺼지고, Play Console 의 "DEX 코드 최적화" 측정(r8.json)에서 최적화 비율이 0% 가 된다.
//    이를 proguard-android-optimize.txt 로 바꾼다. (SDK 58 템플릿의 기본값과 같다)
// 2. plugins/android-r8-rules.pro 의 보완 keep 규칙을 android/app/proguard-rules.pro 에
//    덧붙인다. SDK 54 의 expo-modules-core 에 빠져 있어 R8 을 켜면 Record 인자 변환이
//    NPE 로 깨지는 문제를 막는다. (v1.6.2~v1.6.5 의 DB 열기 실패, 자세한 내용은 규칙 파일)
//
// CI 의 scripts/verify-android-r8.sh 가 prebuild 결과에 두 가지가 모두 들어갔는지 확인한다.
const fs = require('fs');
const path = require('path');
const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');

const RULES_FILE = path.join(__dirname, 'android-r8-rules.pro');
const BLOCK_TAG = 'quiz-bank-r8';
const BLOCK_BEGIN = `# @generated begin ${BLOCK_TAG} (plugins/withAndroidR8.js, DO NOT MODIFY)`;
const BLOCK_END = `# @generated end ${BLOCK_TAG}`;

const DEFAULT_PROGUARD_FILE = /getDefaultProguardFile\(\s*["']proguard-android\.txt["']\s*\)/g;
const OPTIMIZE_PROGUARD_FILE = /getDefaultProguardFile\(\s*["']proguard-android-optimize\.txt["']\s*\)/;

/** build.gradle 의 기본 ProGuard 파일을 proguard-android-optimize.txt 로 바꾼다. */
function applyOptimizeProguardFile(contents) {
  const next = contents.replace(
    DEFAULT_PROGUARD_FILE,
    'getDefaultProguardFile("proguard-android-optimize.txt")'
  );
  if (!OPTIMIZE_PROGUARD_FILE.test(next)) {
    // 템플릿이 바뀌어 교체할 줄을 찾지 못하면 최적화가 꺼진 채 조용히 빌드되므로 멈춘다.
    throw new Error(
      'withAndroidR8: getDefaultProguardFile("proguard-android.txt") not found in android/app/build.gradle'
    );
  }
  return next;
}

/** proguard-rules.pro 에 보완 규칙 블록을 넣는다. 블록이 이미 있으면 새 내용으로 바꾼다. */
function applyR8Rules(contents, rules) {
  const block = `${BLOCK_BEGIN}\n${rules.trim()}\n${BLOCK_END}\n`;
  const begin = contents.indexOf(BLOCK_BEGIN);
  if (begin !== -1) {
    const end = contents.indexOf(BLOCK_END, begin);
    if (end === -1) {
      throw new Error(`withAndroidR8: "${BLOCK_END}" missing in proguard-rules.pro`);
    }
    let after = end + BLOCK_END.length;
    if (contents[after] === '\n') after += 1;
    return contents.slice(0, begin) + block + contents.slice(after);
  }
  const separator = contents === '' || contents.endsWith('\n') ? '' : '\n';
  return `${contents}${separator}\n${block}`;
}

function withOptimizeProguardFile(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error('withAndroidR8: only groovy build.gradle is supported');
    }
    cfg.modResults.contents = applyOptimizeProguardFile(cfg.modResults.contents);
    return cfg;
  });
}

function withR8Rules(config) {
  return withDangerousMod(config, [
    'android',
    async (cfg) => {
      const rulesPath = path.join(cfg.modRequest.platformProjectRoot, 'app', 'proguard-rules.pro');
      const rules = await fs.promises.readFile(RULES_FILE, 'utf8');
      const contents = await fs.promises.readFile(rulesPath, 'utf8');
      const next = applyR8Rules(contents, rules);
      if (next !== contents) {
        await fs.promises.writeFile(rulesPath, next);
      }
      return cfg;
    },
  ]);
}

module.exports = function withAndroidR8(config) {
  return withR8Rules(withOptimizeProguardFile(config));
};
module.exports.applyOptimizeProguardFile = applyOptimizeProguardFile;
module.exports.applyR8Rules = applyR8Rules;
module.exports.BLOCK_BEGIN = BLOCK_BEGIN;
module.exports.BLOCK_END = BLOCK_END;
