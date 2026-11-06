import fs from 'fs';
import path from 'path';

// config plugin 은 prebuild 때 Node 가 바로 읽는 CommonJS 파일이다.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('../../plugins/withAndroidR8');

const applyOptimizeProguardFile: (contents: string) => string = plugin.applyOptimizeProguardFile;
const applyR8Rules: (contents: string, rules: string, tag?: string) => string = plugin.applyR8Rules;
const removeR8Rules: (contents: string, tag: string) => string = plugin.removeR8Rules;
const isEdgeToEdgeEnabled: (config: { android?: { edgeToEdgeEnabled?: boolean } }) => boolean =
  plugin.isEdgeToEdgeEnabled;
const BLOCK_BEGIN: string = plugin.BLOCK_BEGIN;
const BLOCK_END: string = plugin.BLOCK_END;
const EDGE_TO_EDGE_BLOCK_TAG: string = plugin.EDGE_TO_EDGE_BLOCK_TAG;
const EDGE_TO_EDGE_BLOCK_BEGIN: string = plugin.EDGE_TO_EDGE_BLOCK_BEGIN;
const EDGE_TO_EDGE_BLOCK_END: string = plugin.EDGE_TO_EDGE_BLOCK_END;

const RULES = fs.readFileSync(path.join(__dirname, '../../plugins/android-r8-rules.pro'), 'utf8');
const EDGE_TO_EDGE_RULES = fs.readFileSync(
  path.join(__dirname, '../../plugins/android-r8-edge-to-edge.pro'),
  'utf8'
);

const count = (haystack: string, needle: string) => haystack.split(needle).length - 1;

describe('applyOptimizeProguardFile', () => {
  it('release 빌드의 proguard-android.txt 를 proguard-android-optimize.txt 로 바꾼다', () => {
    const gradle = [
      '        release {',
      '            minifyEnabled enableMinifyInReleaseBuilds',
      '            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"',
      '        }',
    ].join('\n');

    const next = applyOptimizeProguardFile(gradle);

    expect(next).toContain(
      'proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"'
    );
    expect(next).not.toContain('"proguard-android.txt"');
  });

  it('작은따옴표로 쓴 줄도 바꾼다', () => {
    expect(applyOptimizeProguardFile("proguardFiles getDefaultProguardFile('proguard-android.txt')")).toBe(
      'proguardFiles getDefaultProguardFile("proguard-android-optimize.txt")'
    );
  });

  it('이미 proguard-android-optimize.txt 면 그대로 둔다', () => {
    const gradle = 'proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"';
    expect(applyOptimizeProguardFile(gradle)).toBe(gradle);
  });

  it('바꿀 줄을 찾지 못하면 최적화가 꺼진 채 빌드되지 않도록 오류를 낸다', () => {
    expect(() => applyOptimizeProguardFile('android { buildTypes { release { } } }')).toThrow(
      /proguard-android\.txt/
    );
  });
});

describe('applyR8Rules', () => {
  const TEMPLATE = '# Add any project specific keep options here:\n';

  it('보완 규칙을 표시 블록으로 감싸 덧붙인다', () => {
    const next = applyR8Rules(TEMPLATE, RULES);

    expect(next.startsWith(TEMPLATE)).toBe(true);
    expect(next).toContain(`${BLOCK_BEGIN}\n`);
    expect(next.endsWith(`${BLOCK_END}\n`)).toBe(true);
    expect(next).toContain('-keep class expo.modules.kotlin.records.** { *; }');
    expect(next).toContain('-keep interface expo.modules.kotlin.types.Enumerable');
  });

  it('여러 번 적용해도 블록은 하나만 남는다', () => {
    const once = applyR8Rules(TEMPLATE, RULES);
    const twice = applyR8Rules(once, RULES);

    expect(twice).toBe(once);
    expect(count(twice, BLOCK_BEGIN)).toBe(1);
  });

  it('규칙이 바뀌면 기존 블록을 새 내용으로 바꾼다', () => {
    const old = applyR8Rules(TEMPLATE, '-keep class old.Rule');
    const next = applyR8Rules(old, RULES);

    expect(next).not.toContain('old.Rule');
    expect(next).toBe(applyR8Rules(TEMPLATE, RULES));
  });

  it('expo-build-properties 가 넣은 블록과 블록 뒤의 내용은 그대로 둔다', () => {
    const buildProps = [
      '# @generated begin expo-build-properties - expo prebuild (DO NOT MODIFY)',
      '-keep class com.example.** { *; }',
      '# @generated end expo-build-properties',
      '',
    ].join('\n');
    const withBlock = applyR8Rules(TEMPLATE, RULES) + buildProps;

    const next = applyR8Rules(withBlock, RULES);

    expect(next).toBe(withBlock);
    expect(next).toContain(buildProps);
  });

  it('파일이 개행 없이 끝나도 규칙이 앞 줄에 붙지 않는다', () => {
    const next = applyR8Rules('-keep class a.B', RULES);
    expect(next.startsWith(`-keep class a.B\n\n${BLOCK_BEGIN}\n`)).toBe(true);
  });

  it('끝 표시가 없는 깨진 블록이면 오류를 낸다', () => {
    expect(() => applyR8Rules(`${TEMPLATE}${BLOCK_BEGIN}\n-keep class a.B\n`, RULES)).toThrow(/end quiz-bank-r8/);
  });
});

describe('android-r8-rules.pro', () => {
  it('scripts/verify-android-r8.sh 가 찾는 규칙 줄을 그대로 담고 있다', () => {
    const lines = RULES.split('\n');
    expect(lines).toContain('-keep class expo.modules.kotlin.records.** { *; }');
    expect(lines).toContain('-keep interface expo.modules.kotlin.types.Enumerable');
  });
});

describe('edge-to-edge 규칙 블록', () => {
  const TEMPLATE = '# Add any project specific keep options here:\n';
  const withMain = applyR8Rules(TEMPLATE, RULES);

  it('보완 규칙 블록과 따로 덧붙이고, 기존 블록은 건드리지 않는다', () => {
    const next = applyR8Rules(withMain, EDGE_TO_EDGE_RULES, EDGE_TO_EDGE_BLOCK_TAG);

    expect(next.startsWith(withMain)).toBe(true);
    expect(count(next, BLOCK_BEGIN)).toBe(1);
    expect(count(next, EDGE_TO_EDGE_BLOCK_BEGIN)).toBe(1);
    expect(next.endsWith(`${EDGE_TO_EDGE_BLOCK_END}\n`)).toBe(true);
    expect(next).toContain('-assumevalues class com.facebook.react.views.view.WindowUtilKt {');
  });

  it('여러 번 적용해도 블록은 하나씩만 남는다', () => {
    const once = applyR8Rules(withMain, EDGE_TO_EDGE_RULES, EDGE_TO_EDGE_BLOCK_TAG);
    const twice = applyR8Rules(applyR8Rules(once, RULES), EDGE_TO_EDGE_RULES, EDGE_TO_EDGE_BLOCK_TAG);

    expect(twice).toBe(once);
  });

  it('보완 규칙 블록이 뒤에 오더라도 서로의 끝 표시를 헷갈리지 않는다', () => {
    const edgeFirst = applyR8Rules(TEMPLATE, EDGE_TO_EDGE_RULES, EDGE_TO_EDGE_BLOCK_TAG);
    const both = applyR8Rules(edgeFirst, RULES);

    expect(applyR8Rules(both, '-keep class new.Rule')).toBe(
      applyR8Rules(edgeFirst, '-keep class new.Rule')
    );
    expect(applyR8Rules(both, '-dontwarn new.Rule', EDGE_TO_EDGE_BLOCK_TAG)).toContain(BLOCK_BEGIN);
  });

  it('edge-to-edge 를 끄면 블록만 지워 원래 내용으로 돌아간다', () => {
    const added = applyR8Rules(withMain, EDGE_TO_EDGE_RULES, EDGE_TO_EDGE_BLOCK_TAG);

    expect(removeR8Rules(added, EDGE_TO_EDGE_BLOCK_TAG)).toBe(withMain);
    expect(removeR8Rules(withMain, EDGE_TO_EDGE_BLOCK_TAG)).toBe(withMain);
  });

  it('끝 표시가 없는 깨진 블록이면 오류를 낸다', () => {
    const broken = `${withMain}${EDGE_TO_EDGE_BLOCK_BEGIN}\n-dontwarn a.B\n`;
    expect(() => removeR8Rules(broken, EDGE_TO_EDGE_BLOCK_TAG)).toThrow(/end quiz-bank-edge-to-edge/);
    expect(() => applyR8Rules(broken, EDGE_TO_EDGE_RULES, EDGE_TO_EDGE_BLOCK_TAG)).toThrow(
      /end quiz-bank-edge-to-edge/
    );
  });
});

describe('isEdgeToEdgeEnabled', () => {
  it('Expo 와 같이 app.json 에서 false 로 적었을 때만 꺼진 것으로 본다', () => {
    expect(isEdgeToEdgeEnabled({})).toBe(true);
    expect(isEdgeToEdgeEnabled({ android: {} })).toBe(true);
    expect(isEdgeToEdgeEnabled({ android: { edgeToEdgeEnabled: true } })).toBe(true);
    expect(isEdgeToEdgeEnabled({ android: { edgeToEdgeEnabled: false } })).toBe(false);
  });

  it('app.json 은 edge-to-edge 를 켜 두었다 (android-r8-edge-to-edge.pro 의 전제)', () => {
    const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../app.json'), 'utf8'));
    expect(isEdgeToEdgeEnabled(appJson.expo)).toBe(true);
  });
});

describe('android-r8-edge-to-edge.pro', () => {
  it('scripts/verify-android-r8.sh 가 찾는 규칙 줄을 그대로 담고 있다', () => {
    const lines = EDGE_TO_EDGE_RULES.split('\n');
    expect(lines).toContain('    boolean isEdgeToEdgeFeatureFlagOn() return true;');
    expect(lines).toContain('    boolean isEdgeToEdgeFeatureFlagOn return true;');
  });

  it('주석 말고는 WindowUtilKt 에 대한 -assumevalues 규칙만 담는다', () => {
    const rules = EDGE_TO_EDGE_RULES.split('\n').filter((line) => line.trim() && !line.trim().startsWith('#'));
    expect(rules).toEqual([
      '-assumevalues class com.facebook.react.views.view.WindowUtilKt {',
      '    boolean isEdgeToEdgeFeatureFlagOn return true;',
      '    boolean isEdgeToEdgeFeatureFlagOn() return true;',
      '}',
    ]);
  });
});
