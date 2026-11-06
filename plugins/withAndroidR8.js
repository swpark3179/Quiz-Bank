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
// 3. edge-to-edge 가 켜져 있으면(app.json 의 android.edgeToEdgeEnabled 가 false 가 아니면)
//    plugins/android-r8-edge-to-edge.pro 도 별도 블록으로 덧붙인다. edge-to-edge 앱에서는
//    실행되지 않는 React Native 의 상태 표시줄 색 코드를 R8 이 지워, Play Console 의
//    "지원 중단된 API" 경고에 잡히는 호출을 줄인다. edge-to-edge 를 끄면 블록을 넣지 않는다.
//
// CI 의 scripts/verify-android-r8.sh 가 prebuild 결과에 모두 들어갔는지 확인한다.
const fs = require('fs');
const path = require('path');
const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');

const RULES_FILE = path.join(__dirname, 'android-r8-rules.pro');
const EDGE_TO_EDGE_RULES_FILE = path.join(__dirname, 'android-r8-edge-to-edge.pro');

const BLOCK_TAG = 'quiz-bank-r8';
const EDGE_TO_EDGE_BLOCK_TAG = 'quiz-bank-edge-to-edge';

const blockBegin = (tag) => `# @generated begin ${tag} (plugins/withAndroidR8.js, DO NOT MODIFY)`;
const blockEnd = (tag) => `# @generated end ${tag}`;

const BLOCK_BEGIN = blockBegin(BLOCK_TAG);
const BLOCK_END = blockEnd(BLOCK_TAG);
const EDGE_TO_EDGE_BLOCK_BEGIN = blockBegin(EDGE_TO_EDGE_BLOCK_TAG);
const EDGE_TO_EDGE_BLOCK_END = blockEnd(EDGE_TO_EDGE_BLOCK_TAG);

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

/** tag 블록의 [시작, 끝 다음) 위치를 찾는다. 없으면 null, 끝 표시가 없으면 오류. */
function findBlock(contents, tag) {
  const begin = contents.indexOf(blockBegin(tag));
  if (begin === -1) return null;
  const endMarker = blockEnd(tag);
  const end = contents.indexOf(endMarker, begin);
  if (end === -1) {
    throw new Error(`withAndroidR8: "${endMarker}" missing in proguard-rules.pro`);
  }
  let after = end + endMarker.length;
  if (contents[after] === '\n') after += 1;
  return { begin, after };
}

/** proguard-rules.pro 에 tag 규칙 블록을 넣는다. 블록이 이미 있으면 새 내용으로 바꾼다. */
function applyR8Rules(contents, rules, tag = BLOCK_TAG) {
  const block = `${blockBegin(tag)}\n${rules.trim()}\n${blockEnd(tag)}\n`;
  const found = findBlock(contents, tag);
  if (found) {
    return contents.slice(0, found.begin) + block + contents.slice(found.after);
  }
  const separator = contents === '' || contents.endsWith('\n') ? '' : '\n';
  return `${contents}${separator}\n${block}`;
}

/** applyR8Rules 가 넣은 tag 블록(과 그 앞에 넣은 빈 줄)을 지운다. 없으면 그대로 둔다. */
function removeR8Rules(contents, tag) {
  const found = findBlock(contents, tag);
  if (!found) return contents;
  let begin = found.begin;
  if (begin >= 2 && contents.slice(begin - 2, begin) === '\n\n') begin -= 1;
  return contents.slice(0, begin) + contents.slice(found.after);
}

/** edge-to-edge 가 켜져 있는가. Expo 와 같은 기준: app.json 에서 명시적으로 false 일 때만 꺼진다. */
function isEdgeToEdgeEnabled(config) {
  return config.android?.edgeToEdgeEnabled !== false;
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
      let next = applyR8Rules(contents, rules);
      if (isEdgeToEdgeEnabled(cfg)) {
        const edgeToEdgeRules = await fs.promises.readFile(EDGE_TO_EDGE_RULES_FILE, 'utf8');
        next = applyR8Rules(next, edgeToEdgeRules, EDGE_TO_EDGE_BLOCK_TAG);
      } else {
        next = removeR8Rules(next, EDGE_TO_EDGE_BLOCK_TAG);
      }
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
module.exports.removeR8Rules = removeR8Rules;
module.exports.isEdgeToEdgeEnabled = isEdgeToEdgeEnabled;
module.exports.BLOCK_BEGIN = BLOCK_BEGIN;
module.exports.BLOCK_END = BLOCK_END;
module.exports.EDGE_TO_EDGE_BLOCK_TAG = EDGE_TO_EDGE_BLOCK_TAG;
module.exports.EDGE_TO_EDGE_BLOCK_BEGIN = EDGE_TO_EDGE_BLOCK_BEGIN;
module.exports.EDGE_TO_EDGE_BLOCK_END = EDGE_TO_EDGE_BLOCK_END;
