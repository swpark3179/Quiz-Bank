// 단어장 앱(Quiz Word)의 등록 단어 목록 ContentProvider 를 읽으려면 Android 11(API 30)+ 의 패키지 가시성 선언이 필요하다.
// 선언이 없으면 단어장 앱이 설치돼 있어도 provider 를 찾지 못해 단어장 앱 활용 모드가 보이지 않는다.
// (lib/local/wordApp.ts 의 ANDROID_URIS 와 짝 — 정식 빌드와 미리보기 빌드)
const { withAndroidManifest } = require('expo/config-plugins');

const WORD_APP_PACKAGES = ['com.swpark3179.quizword2', 'com.swpark3179.quizword2.preview'];

/** AndroidManifest(JSON) 의 <queries> 에 단어장 앱 패키지를 더한다. 이미 있으면 그대로 둔다 */
function applyWordAppQueries(manifest) {
  const root = manifest.manifest;
  if (!Array.isArray(root.queries)) root.queries = [];
  if (root.queries.length === 0) root.queries.push({});
  const queries = root.queries[0];
  if (!Array.isArray(queries.package)) queries.package = [];
  const existing = new Set(
    root.queries.flatMap((q) => (Array.isArray(q.package) ? q.package : [])).map((p) => p.$ && p.$['android:name'])
  );
  for (const name of WORD_APP_PACKAGES) {
    if (!existing.has(name)) queries.package.push({ $: { 'android:name': name } });
  }
  return manifest;
}

function withWordAppQueries(config) {
  return withAndroidManifest(config, (cfg) => {
    cfg.modResults = applyWordAppQueries(cfg.modResults);
    return cfg;
  });
}

module.exports = withWordAppQueries;
module.exports.applyWordAppQueries = applyWordAppQueries;
module.exports.WORD_APP_PACKAGES = WORD_APP_PACKAGES;
