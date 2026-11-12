/**
 * 단어장 앱(Quiz Word)의 등록 단어 목록 읽기 + 단어 상세 열기 (플랫폼별 부분).
 *
 * 단어장 앱은 켜질 때 등록 단어 목록(lexicon.json)을 두 앱이 함께 읽는 곳에 써 둔다.
 * - iOS: App Group(SHARED_APP_GROUP) 공유 폴더의 quiz-word/lexicon.json.
 *   단어장 앱을 지워도 공유 폴더는 이 앱이 남아 있는 한 남으므로, 단어장 앱이 실제로 있는지(canOpenURL)도 본다
 *   (app.json 의 LSApplicationQueriesSchemes 에 quizword 가 있어야 한다).
 * - Android: 단어장 앱의 읽기 전용 ContentProvider (content://<패키지>.lexicon/lexicon.json).
 *   단어장 앱이 없으면 읽기가 실패한다. Android 11+ 에서 provider 를 보려면 plugins/withWordAppQueries.js 의 <queries> 가 필요하다.
 * - 웹·데스크탑: 없음.
 * 단어장 앱이 없거나 목록을 못 읽으면 null — 이 앱은 단어장 앱 기능을 아예 보여 주지 않는다.
 */

import { Alert, AppState, Linking, Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as LegacyFileSystem from 'expo-file-system/legacy';
import { parseLexicon, wordAppLookupUrl, WORD_APP_SCHEME, type WordAppLexicon } from '../vocab/wordApp';

/** 단어장 앱과 함께 쓰는 App Group (app.json 의 ios.entitlements 와 같아야 한다) */
export const SHARED_APP_GROUP = 'group.com.swpark3179.shared';
const IOS_DIR = 'quiz-word';
const LEXICON_FILE = 'lexicon.json';
/** 단어장 앱 정식 · 미리보기 빌드의 provider 주소 (plugins/withWordAppQueries.js 의 패키지와 짝) */
const ANDROID_URIS = [
  'content://com.swpark3179.quizword2.lexicon/lexicon.json',
  'content://com.swpark3179.quizword2.preview.lexicon/lexicon.json',
];

async function readIos(): Promise<string | null> {
  if (!(await Linking.canOpenURL(`${WORD_APP_SCHEME}://`))) return null;
  const group = Paths.appleSharedContainers?.[SHARED_APP_GROUP];
  if (!group) return null;
  const file = new File(group, IOS_DIR, LEXICON_FILE);
  return file.exists ? await file.text() : null;
}

async function readAndroidUri(uri: string): Promise<string> {
  try {
    // 새 API 는 content:// 를 contentResolver 로 바로 읽는다
    return await new File(uri).text();
  } catch {
    // 안 되면 캐시로 복사해 읽는다 (legacy copyAsync 는 content:// 를 받는다)
    const tmp = `${LegacyFileSystem.cacheDirectory}word-app-lexicon.json`;
    await LegacyFileSystem.copyAsync({ from: uri, to: tmp });
    try {
      return await LegacyFileSystem.readAsStringAsync(tmp);
    } finally {
      await LegacyFileSystem.deleteAsync(tmp, { idempotent: true });
    }
  }
}

async function readAndroid(): Promise<string | null> {
  for (const uri of ANDROID_URIS) {
    try {
      return await readAndroidUri(uri);
    } catch {
      // 이 빌드가 없다 — 다음 주소
    }
  }
  return null;
}

async function load(): Promise<WordAppLexicon | null> {
  try {
    const text = Platform.OS === 'ios' ? await readIos() : Platform.OS === 'android' ? await readAndroid() : null;
    return text ? parseLexicon(JSON.parse(text)) : null;
  } catch (error) {
    console.warn('단어장 앱 단어 목록을 읽지 못했어요:', error);
    return null;
  }
}

let cache: Promise<WordAppLexicon | null> | null = null;
/** 다 읽은 목록 (읽는 중·아직 안 읽었으면 undefined) — peekWordAppLexicon 이 동기로 돌려준다 */
let loaded: WordAppLexicon | null | undefined;
let watching = false;

/** 이미 읽은 단어장 앱 목록 (아직이면 undefined, 단어장 앱이 없으면 null) */
export function peekWordAppLexicon(): WordAppLexicon | null | undefined {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return null;
  return loaded;
}

/**
 * 단어장 앱의 등록 단어 목록 (없으면 null). 앱 세션 동안 기억하고,
 * 앱이 다시 앞으로 오면 새로 읽는다 — 그사이 단어장 앱을 설치·삭제했거나 단어 세트를 바꿨을 수 있다.
 */
export function fetchWordAppLexicon(): Promise<WordAppLexicon | null> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return Promise.resolve(null);
  if (!watching) {
    watching = true;
    AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        cache = null;
        loaded = undefined;
      }
    });
  }
  if (!cache) {
    const request = load();
    cache = request;
    request.then((l) => {
      // 그사이 백그라운드로 가서 새로 읽기 시작했으면 옛 결과는 남기지 않는다
      if (cache === request) loaded = l;
    });
  }
  return cache;
}

/** 단어장 앱에서 단어 상세 열기 — 단어장 앱에 없으면 단어장 앱이 quizbank://word-lookup-result 로 알려 온다 */
export function openInWordApp(word: string): void {
  Linking.openURL(wordAppLookupUrl(word)).catch(() => {
    // 목록을 읽은 뒤 단어장 앱이 지워졌을 때
    cache = null;
    loaded = undefined;
    Alert.alert('단어장', '단어장 앱을 열 수 없어요.');
  });
}
