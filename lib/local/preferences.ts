/**
 * 사용자 설정 (기기 내 저장)
 *
 * - 네이티브(iOS/Android): 앱 문서 폴더의 `preferences.json`
 * - 웹(데스크탑 Electron 포함): localStorage
 *
 * 화면이 첫 렌더부터 저장된 값으로 그려지도록 동기로 읽는다.
 * 설정은 부가 기능이므로 모든 I/O 오류는 무시하고 기본값을 쓴다.
 */

import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

export interface Preferences {
  /** 퀴즈 풀이 중 등록 단어를 눌러 뜻 보기 */
  vocabMode: boolean;
}

const DEFAULTS: Preferences = {
  vocabMode: false,
};

const FILE_NAME = 'preferences.json';
const WEB_KEY = 'quiz-bank:preferences';

let memory: Preferences | null = null;

function load(): Preferences {
  if (memory) return memory;
  let stored: Partial<Preferences> = {};
  try {
    const raw =
      Platform.OS === 'web'
        ? localStorage.getItem(WEB_KEY)
        : (() => {
            const file = new File(Paths.document, FILE_NAME);
            return file.exists ? file.textSync() : null;
          })();
    if (raw) stored = JSON.parse(raw);
  } catch {
    // 읽기 실패·손상된 파일은 기본값으로
  }
  memory = { ...DEFAULTS, ...stored };
  return memory;
}

export function getPreference<K extends keyof Preferences>(key: K): Preferences[K] {
  return load()[key];
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]): void {
  memory = { ...load(), [key]: value };
  try {
    const raw = JSON.stringify(memory);
    if (Platform.OS === 'web') {
      localStorage.setItem(WEB_KEY, raw);
    } else {
      new File(Paths.document, FILE_NAME).write(raw);
    }
  } catch {
    // 저장 실패는 무시 (이번 실행 동안은 메모리 값이 유지된다)
  }
}
