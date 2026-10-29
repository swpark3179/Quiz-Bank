/**
 * 단어장 매칭 — 문제 텍스트에서 등록된 단어(구)를 찾아 조각으로 나눈다.
 *
 * - 대소문자를 구분하지 않는다.
 * - 긴 표현이 먼저 맞는다 ("exponential backoff" 가 "backoff" 보다 우선).
 * - 규칙 복수형·3인칭(-s, -es)은 자동으로 인식한다. 그 밖의 변형(-ed, -ing, 불규칙)은 forms 에 적는다.
 * - 영문자·숫자·하이픈으로 이어진 단어의 일부는 맞추지 않는다 ("tune" ↛ "fine-tuned").
 *   한글 조사가 바로 붙은 경우("fork를")는 맞춘다.
 *
 * React Native 의존성이 없어 Jest 에서 그대로 검증한다.
 */

/** vocab/index.json 의 한 항목 */
export interface VocabEntry {
  /** 상세 파일 이름 (vocab/{id}.md) */
  id: string;
  /** 표제어 — 팝업 제목이자 본문에서 찾는 기본 표현 */
  word: string;
  /** 한 줄 뜻 — 팝업을 열자마자 보인다 */
  meaning: string;
  /** 품사 (예: "동사") */
  pos?: string;
  /** 발음 기호 (예: "ˈeskəleɪt") */
  ipa?: string;
  /** 본문에서 함께 찾을 변형·구 (예: ["escalated", "escalation"]) */
  forms?: string[];
}

export interface VocabSegment {
  text: string;
  /** 등록된 단어면 해당 항목, 일반 텍스트면 undefined */
  entry?: VocabEntry;
}

export interface VocabMatcher {
  /** 텍스트를 일반 조각과 단어 조각으로 나눈다 (매칭이 없으면 조각 1개) */
  split(text: string): VocabSegment[];
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 공백을 한 칸으로, 소문자로 — 조회 키 */
const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();

/** 단어의 일부로 볼 문자 (이 문자에 닿아 있으면 경계가 아니다) */
const isWordChar = (ch: string | undefined) => ch !== undefined && /[A-Za-z0-9_-]/.test(ch);

/** 등록된 표현 목록 (표제어 + forms, 중복 제거) */
export function surfacesOf(entry: VocabEntry): string[] {
  const all = [entry.word, ...(entry.forms ?? [])].map(normalize).filter((s) => s.length > 0);
  return [...new Set(all)];
}

export function createVocabMatcher(entries: VocabEntry[]): VocabMatcher {
  const lookup = new Map<string, VocabEntry>();
  for (const entry of entries) {
    for (const surface of surfacesOf(entry)) {
      // 같은 표현이 여러 항목에 있으면 먼저 등록된 항목을 쓴다 (콘텐츠 테스트가 중복을 막는다)
      if (!lookup.has(surface)) lookup.set(surface, entry);
    }
  }

  if (lookup.size === 0) {
    return { split: (text) => [{ text }] };
  }

  // 표현을 첫 글자별 정규식으로 나눈다. 수천 개를 한 정규식에 넣으면 패턴이 커져
  // 엔진이 최적화를 포기하고 수백 배 느려진다 (V8 은 약 20KB 부터).
  // 한 위치에서 맞을 수 있는 표현은 첫 글자가 같으므로, 그룹 안에서만 긴 순서를 지키면 된다.
  const alternativesByFirst = new Map<string, string[]>();
  for (const surface of [...lookup.keys()].sort((a, b) => b.length - a.length)) {
    // 구 안의 공백은 줄바꿈·여러 칸도 허용, 글자로 끝나면 -s / -es 를 덧붙여 인식
    const body = surface.split(' ').map(escapeRegExp).join('\\s+');
    const alternative = /[a-z]$/.test(surface) ? `${body}(?:e?s)?` : body;
    const group = alternativesByFirst.get(surface[0]);
    if (group) group.push(alternative);
    else alternativesByFirst.set(surface[0], [alternative]);
  }
  // 뒤쪽 경계는 정규식 안에서 확인해, 긴 표현이 단어 중간에서 끊기면 짧은 표현을 이어서 시도하게 한다
  // ("context window" 가 "context windowing" 에서 실패하면 "context" 를 맞춘다).
  // 앞쪽 경계는 아래에서 직접 확인하고, sticky(y) 로 그 위치에서만 맞춘다.
  const patterns = new Map<string, RegExp>();
  for (const [first, alternatives] of alternativesByFirst) {
    patterns.set(first, new RegExp(`(?:${alternatives.join('|')})(?![A-Za-z0-9_-])`, 'iy'));
  }

  const findEntry = (matched: string): VocabEntry | undefined => {
    const key = normalize(matched);
    return (
      lookup.get(key) ??
      (key.endsWith('s') ? lookup.get(key.slice(0, -1)) : undefined) ??
      (key.endsWith('es') ? lookup.get(key.slice(0, -2)) : undefined)
    );
  };

  return {
    split(text) {
      const segments: VocabSegment[] = [];
      let cursor = 0;

      for (let start = 0; start < text.length; start++) {
        // 다른 단어 중간에서는 시작하지 않는다
        if (isWordChar(text[start - 1])) continue;
        const pattern = patterns.get(text[start].toLowerCase());
        if (!pattern) continue;

        pattern.lastIndex = start;
        const m = pattern.exec(text);
        const entry = m ? findEntry(m[0]) : undefined;
        if (!m || !entry) continue;

        if (start > cursor) segments.push({ text: text.slice(cursor, start) });
        segments.push({ text: m[0], entry });
        cursor = start + m[0].length;
        start = cursor - 1;
      }

      if (cursor < text.length || segments.length === 0) {
        segments.push({ text: text.slice(cursor) });
      }
      return segments;
    },
  };
}
