import type { QuizSetup } from '../../../lib/quiz/retry';

type Store = typeof import('../../../lib/quiz/setupStore');

/** 매번 빈 보관소로 시작한다 (모듈 상태 초기화) */
function freshStore(): Store {
  let store!: Store;
  jest.isolateModules(() => {
    store = require('../../../lib/quiz/setupStore');
  });
  return store;
}

const setupFor = (categoryId: string): QuizSetup => ({
  shuffled: [],
  mode: 'immediate',
  categoryId,
  sourceFileIds: [`${categoryId}-file`],
});

/** 브라우저 sessionStorage 흉내 */
function fakeSessionStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
}

afterEach(() => {
  delete (globalThis as { sessionStorage?: Storage }).sessionStorage;
});

describe('setupStore', () => {
  it('맡긴 설정을 id 로 그대로 돌려받는다 (주소에는 짧은 id 만 실린다)', () => {
    const { stashQuizSetup, getQuizSetup } = freshStore();
    const setup = setupFor('a');
    const id = stashQuizSetup(setup);
    expect(id.length).toBeLessThan(20);
    expect(getQuizSetup(id)).toBe(setup);
  });

  it('모르는 id 나 id 가 없으면 undefined', () => {
    const { stashQuizSetup, getQuizSetup } = freshStore();
    stashQuizSetup(setupFor('a'));
    expect(getQuizSetup('nope')).toBeUndefined();
    expect(getQuizSetup(undefined)).toBeUndefined();
    expect(getQuizSetup('')).toBeUndefined();
  });

  it('설정마다 다른 id 를 주고, 최근 5개만 남긴다', () => {
    const { stashQuizSetup, getQuizSetup } = freshStore();
    const ids = ['a', 'b', 'c', 'd', 'e', 'f'].map((c) => stashQuizSetup(setupFor(c)));
    expect(new Set(ids).size).toBe(6);
    expect(getQuizSetup(ids[0])).toBeUndefined();
    expect(ids.slice(1).map((id) => getQuizSetup(id)?.categoryId)).toEqual(['b', 'c', 'd', 'e', 'f']);
  });

  it('웹: 새로고침해 메모리가 비어도 마지막 설정을 sessionStorage 에서 되찾는다', () => {
    const storage = fakeSessionStorage();
    (globalThis as { sessionStorage?: Storage }).sessionStorage = storage;
    const id = freshStore().stashQuizSetup(setupFor('a'));

    // 새로고침 = 모듈을 새로 읽는다 (sessionStorage 는 남는다)
    const reloaded = freshStore();
    expect(reloaded.getQuizSetup(id)).toEqual(setupFor('a'));
    // 다른 id 로는 돌려주지 않는다
    expect(reloaded.getQuizSetup('other')).toBeUndefined();
  });

  it('sessionStorage 가 막혀 있어도(접근 시 오류) 메모리로 동작한다', () => {
    const broken = fakeSessionStorage();
    broken.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    broken.getItem = () => {
      throw new Error('SecurityError');
    };
    (globalThis as { sessionStorage?: Storage }).sessionStorage = broken;
    const { stashQuizSetup, getQuizSetup } = freshStore();
    const setup = setupFor('a');
    const id = stashQuizSetup(setup);
    expect(getQuizSetup(id)).toBe(setup);
    expect(getQuizSetup('other')).toBeUndefined();
  });
});
