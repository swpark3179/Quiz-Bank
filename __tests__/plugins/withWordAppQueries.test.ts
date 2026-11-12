// config plugin 은 prebuild 때 Node 가 바로 읽는 CommonJS 파일이다.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('../../plugins/withWordAppQueries');

const applyWordAppQueries: (manifest: any) => any = plugin.applyWordAppQueries;
const PACKAGES: string[] = plugin.WORD_APP_PACKAGES;

const names = (manifest: any) =>
  manifest.manifest.queries.flatMap((q: any) => q.package ?? []).map((p: any) => p.$['android:name']);

describe('withWordAppQueries', () => {
  it('기존 <queries> 를 지키며 단어장 앱 패키지를 더한다', () => {
    const intent = [{ action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }] }];
    const manifest = { manifest: { queries: [{ intent }] } };
    const next = applyWordAppQueries(manifest);
    expect(next.manifest.queries[0].intent).toBe(intent);
    expect(names(next)).toEqual(PACKAGES);
  });

  it('<queries> 가 없으면 만든다', () => {
    expect(names(applyWordAppQueries({ manifest: {} }))).toEqual(PACKAGES);
  });

  it('두 번 적용해도 중복되지 않는다', () => {
    const once = applyWordAppQueries({ manifest: {} });
    expect(names(applyWordAppQueries(once))).toEqual(PACKAGES);
  });
});
