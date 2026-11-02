/**
 * 홈 화면 로딩 실패를 단계별로 구분해 사용자에게 보여줄 정보로 바꾼다.
 *
 * 하나의 문구로 뭉뚱그리면 기기별 실패 원인을 알 수 없으므로, 어느 단계에서
 * 실패했는지와 실제 오류 메시지를 함께 보여주고 복사할 수 있게 한다.
 */

export type LoadStage = 'database' | 'categories' | 'stats';

export interface LoadErrorInfo {
  stage: LoadStage;
  title: string;
  /** 화면에 그대로 보여주고 복사할 수 있는 진단 정보 */
  detail: string;
}

const TITLES: Record<LoadStage, string> = {
  database: '학습 기록 저장소(DB)를 열지 못했습니다.',
  categories: '카테고리 목록을 불러오지 못했습니다.',
  stats: '학습 통계를 불러오지 못했습니다.',
};

const MAX_MESSAGE_LENGTH = 500;

/** 오류 객체에서 읽을 수 있는 메시지만 뽑는다 (제어 문자 제거, 길이 제한) */
export function errorMessageOf(error: unknown): string {
  const raw =
    error instanceof Error
      ? `${error.name !== 'Error' ? `${error.name}: ` : ''}${error.message}`
      : String(error);
  const cleaned = raw
    // expo-sqlite(Android)는 SQLite 오류 코드를 숫자가 아닌 문자 한 개로 붙인다
    // ("Error code \u000B: ..."). 숫자로 되돌려 "Error code 11: ..." 로 보이게 한다.
    // eslint-disable-next-line no-control-regex
    .replace(/Error code ([\u0000-\u001F]):/g, (_m, c: string) => `Error code ${c.charCodeAt(0)}:`)
    // 그 밖의 제어 문자는 지운다 (줄바꿈·탭은 유지)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
  return cleaned.length > MAX_MESSAGE_LENGTH
    ? `${cleaned.slice(0, MAX_MESSAGE_LENGTH)}…`
    : cleaned || '(메시지 없음)';
}

/**
 * @param environment 진단용 기기·앱 정보 (예: "Android 34 · v1.6.5")
 */
export function describeLoadError(
  stage: LoadStage,
  error: unknown,
  environment?: string
): LoadErrorInfo {
  const lines = [`[${stage}] ${errorMessageOf(error)}`];
  if (environment) lines.push(environment);
  return { stage, title: TITLES[stage], detail: lines.join('\n') };
}
