/**
 * 마크다운 퀴즈 파일 파서
 *
 * 지원 형식:
 * ## 문제 N
 * ### **...질문...**
 *
 * | 보기 | 설명 |
 * | ① text | desc |
 * | **②** text | desc |  ← 볼드 = 정답
 *
 * **정답: ②**
 * **해설:**
 * ...해설 내용...
 * ---   (또는 다음 ## 문제 / 파일 끝)
 */

export interface Choice {
  /** 0-based index (원래 보기 순서) */
  index: number;
  /** 원본 보기 텍스트 (기호 포함, 예: "① LLM (Large Language Model)") */
  label: string;
  /** 보기 설명 */
  description: string;
}

export interface QuizQuestion {
  /** 파일 내 원래 문제 번호 (1-indexed) */
  id: number;
  /** 문제 본문 (마크다운) */
  question: string;
  /** 보기 목록 */
  choices: Choice[];
  /** 정답 보기 0-based index (단일) */
  answer: number;
  /** 해설 (마크다운) */
  explanation: string;
  /** 출처 파일 ID */
  sourceFileId: string;
}

// 보기 기호 → 0-based index
const CHOICE_SYMBOLS: Record<string, number> = {
  '①': 0, '②': 1, '③': 2, '④': 3,
  '⑤': 4, '⑥': 5, '⑦': 6, '⑧': 7,
};

/** 보기 기호에서 0-based index 반환 */
function symbolToIndex(sym: string): number {
  const cleanSym = sym.replace(/[\.\)]$/, '').trim();

  if (CHOICE_SYMBOLS[cleanSym] !== undefined) {
    return CHOICE_SYMBOLS[cleanSym];
  }

  if (/^\d+$/.test(cleanSym)) {
    return parseInt(cleanSym, 10) - 1;
  }

  if (/^[A-Za-z]$/.test(cleanSym)) {
    return cleanSym.toUpperCase().charCodeAt(0) - 65;
  }

  return -1;
}

/** 볼드 마커 제거 */
function stripBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').trim();
}

/** 보기 테이블 행 파싱
 *  "| ① LLM ... | 설명 |" 또는 "| **②** LMM ... | 설명 |"
 *  반환: { index, label, description, isAnswer }
 */
function parseChoiceRow(row: string): {
  index: number;
  label: string;
  description: string;
  isAnswer: boolean;
} | null {
  // 셀 분리: "| a | b |" → ["a", "b"]
  const cells = row
    .split('|')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  if (cells.length < 1) return null;

  const rawLabel = cells[0];
  const rawDesc = cells[1] ?? '';

  // 볼드 여부 (정답 마킹)
  const isAnswer = /\*\*/.test(rawLabel);
  const cleanLabel = stripBold(rawLabel);

  // 보기 기호 추출 (①②③④ 또는 숫자)
  const symMatch = cleanLabel.match(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)])/);
  if (!symMatch) return null;

  const sym = symMatch[1];
  const index = symbolToIndex(sym);
  if (index < 0) return null;

  // 기호 제거한 순수 텍스트
  const label = cleanLabel.slice(sym.length).trim();

  return {
    index,
    label: `${sym} ${label}`.trim(),
    description: stripBold(rawDesc),
    isAnswer,
  };
}

/**
 * 마크다운 문자열 → QuizQuestion 배열로 파싱
 * @param markdown 원본 마크다운 문자열
 * @param sourceFileId 출처 파일 ID
 */
/** 메모리 캐시 (동일 마크다운 문자열 재파싱 방지) */
const parsedCache = new Map<string, QuizQuestion[]>();
const MAX_CACHE_SIZE = 50; // 메모리 릭 방지를 위한 최대 캐시 수

export function parseQuizMarkdown(
  markdown: string,
  sourceFileId: string
): QuizQuestion[] {
  // 마크다운 원본 문자열 자체를 키로 사용하여 해시 충돌을 원천 차단.
  // JS 엔진의 내부 string interning 덕분에 메모리나 성능 이슈가 없음.
  const cacheKey = `${sourceFileId}:${markdown}`;

  if (parsedCache.has(cacheKey)) {
    return parsedCache.get(cacheKey)!;
  }

  const questions: QuizQuestion[] = [];

  // "## 문제 N" 기준으로 블록 분리
  const blocks = markdown.split(/(?=^## 문제\s+\d+)/m).filter((b) => b.trim());

  for (const block of blocks) {
    const lines = block.split('\n');
    let questionId = 0;
    let questionText = '';
    const choices: Choice[] = [];
    let answer = -1;
    let explanation = '';

    let state: 'header' | 'question' | 'choices' | 'answer' | 'explanation' | 'done' | string =
      'header';
    const explLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // --- 구분선 → 블록 종료
      if (trimmed === '---') {
        state = 'done';
        break;
      }

      switch (state) {
        case 'header': {
          // "## 문제 N"
          const m = trimmed.match(/^## 문제\s+(\d+)/);
          if (m) {
            questionId = parseInt(m[1], 10);
            state = 'question';
          }
          break;
        }

        case 'question': {
          // "### **...질문...**" 또는 "### ...질문..."
          if (/^#{2,4}/.test(trimmed)) {
            questionText = stripBold(trimmed.replace(/^#{2,4}\s*/, ''));
            state = 'choices';
          }
          break;
        }

        case 'choices': {
          // 테이블 헤더/구분선은 건너뜀
          if (trimmed.startsWith('|') && /^\|[\s\-|]+\|$/.test(trimmed)) break;

          if (trimmed.startsWith('|')) {
            const parsed = parseChoiceRow(trimmed);
            if (parsed) {
              choices.push({
                index: parsed.index,
                label: parsed.label,
                description: parsed.description,
              });
              if (parsed.isAnswer) answer = parsed.index;
            }
          }

          // "**정답: ②**" 패턴
          if (/^\*\*정답[:：]/.test(trimmed)) {
            const ansMatch = trimmed.match(/([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)/);
            if (ansMatch) {
              answer = symbolToIndex(ansMatch[1]);
            }
            state = 'explanation';
          }
          break;
        }

        case 'explanation': {
          // "**해설:**" 또는 "**해설**:"은 설명 시작 마커
          if (/^\*\*해설[:：]?\*\*/.test(trimmed) || /^해설[:：]/.test(trimmed)) {
            // 같은 줄에 해설 내용이 있을 수도 있음
            const inline = trimmed.replace(/^\*\*해설[:：]?\*\*[:：]?\s*/, '').replace(/^해설[:：]\s*/, '');
            if (inline) explLines.push(inline);
          } else {
            explLines.push(line);
          }
          break;
        }

        case 'done':
          break;
      }
    }

    explanation = explLines.join('\n').trim();

    if (questionId > 0 && questionText && choices.length > 0 && answer >= 0) {
      questions.push({
        id: questionId,
        question: questionText,
        choices,
        answer,
        explanation,
        sourceFileId,
      });
    }
  }

  // 캐시 크기 제한 (LRU처럼 정교하지는 않지만 간단한 방어 로직)
  if (parsedCache.size >= MAX_CACHE_SIZE) {
    const firstKey = parsedCache.keys().next().value;
    if (firstKey) parsedCache.delete(firstKey);
  }

  parsedCache.set(cacheKey, questions);
  return questions;
}
