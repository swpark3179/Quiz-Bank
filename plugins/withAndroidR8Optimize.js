// Expo SDK 54 의 android/app/build.gradle 템플릿은 release 빌드에
//   proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
// 를 쓴다. AGP 기본 파일 proguard-android.txt 에는 `-dontoptimize` 가 들어 있어서
// minify 를 켜도 R8 의 코드 최적화가 꺼진 채로 빌드된다. 그러면 Play Console 의
// "DEX 코드 최적화" 측정에서 Optimization 비율이 25% 미만으로 남을 수 있다.
//
// 이 플러그인은 prebuild 때 이를 proguard-android-optimize.txt 로 바꿔 R8 최적화를 켠다.
// minify / shrinkResources 자체는 app.json 의 expo-build-properties 에서 켠다.
const { withAppBuildGradle } = require('expo/config-plugins');

const FROM = /getDefaultProguardFile\(\s*["']proguard-android\.txt["']\s*\)/g;
const TO = 'getDefaultProguardFile("proguard-android-optimize.txt")';

module.exports = function withAndroidR8Optimize(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error('withAndroidR8Optimize: only groovy build.gradle is supported');
    }
    cfg.modResults.contents = cfg.modResults.contents.replace(FROM, TO);
    return cfg;
  });
};
