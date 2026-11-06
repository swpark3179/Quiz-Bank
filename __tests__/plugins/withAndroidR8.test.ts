import fs from 'fs';
import path from 'path';

// config plugin 은 prebuild 때 Node 가 바로 읽는 CommonJS 파일이다.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('../../plugins/withAndroidR8');

const applyOptimizeProguardFile: (contents: string) => string = plugin.applyOptimizeProguardFile;
const applyR8Rules: (contents: string, rules: string) => string = plugin.applyR8Rules;
const BLOCK_BEGIN: string = plugin.BLOCK_BEGIN;
const BLOCK_END: string = plugin.BLOCK_END;

const RULES = fs.readFileSync(path.join(__dirname, '../../plugins/android-r8-rules.pro'), 'utf8');

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
