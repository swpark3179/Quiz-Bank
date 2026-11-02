import { describeLoadError, errorMessageOf } from '../../../lib/utils/loadError';

describe('errorMessageOf', () => {
  it('expo-sqlite(Android)가 문자로 붙인 오류 코드를 숫자로 되돌린다', () => {
    const e = new Error(
      "Call to function 'NativeDatabase.execAsync' has been rejected.\n→ Caused by: Error code \u000B: database disk image is malformed"
    );
    expect(errorMessageOf(e)).toBe(
      "Call to function 'NativeDatabase.execAsync' has been rejected.\n→ Caused by: Error code 11: database disk image is malformed"
    );
  });

  it('숫자로 된 오류 코드(iOS)는 그대로 둔다', () => {
    expect(errorMessageOf(new Error('Error code 5: database is locked'))).toBe(
      'Error code 5: database is locked'
    );
  });

  it('Error 가 아닌 값과 빈 메시지도 처리한다', () => {
    expect(errorMessageOf('boom')).toBe('boom');
    expect(errorMessageOf(new Error(''))).toBe('(메시지 없음)');
  });

  it('Error 하위 타입은 이름을 앞에 붙인다', () => {
    expect(errorMessageOf(new TypeError('config.map is not a function'))).toBe(
      'TypeError: config.map is not a function'
    );
  });

  it('너무 긴 메시지는 자른다', () => {
    const msg = errorMessageOf(new Error('x'.repeat(1000)));
    expect(msg).toHaveLength(501);
    expect(msg.endsWith('…')).toBe(true);
  });
});

describe('describeLoadError', () => {
  it('단계별 제목과 단계·메시지·환경을 담은 진단 정보를 만든다', () => {
    const info = describeLoadError('database', new Error('no such table: sessions'), 'Android API 34 · 앱 v1.6.5');
    expect(info).toEqual({
      stage: 'database',
      title: '학습 기록 저장소(DB)를 열지 못했습니다.',
      detail: '[database] no such table: sessions\nAndroid API 34 · 앱 v1.6.5',
    });
  });

  it('카테고리 단계는 목록 실패 문구를 쓴다', () => {
    const info = describeLoadError('categories', new Error('Network request failed'));
    expect(info.title).toBe('카테고리 목록을 불러오지 못했습니다.');
    expect(info.detail).toBe('[categories] Network request failed');
  });
});
