import type { Choice } from '../parser/quizParser';

export function stripChoiceSymbol(label: string): string {
  return label.replace(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)\s*/, '');
}

/** 0-based index → 동그라미 기호 (quizParser의 CHOICE_SYMBOLS 컨벤션과 동일) */
const CIRCLED_SYMBOLS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

/**
 * 한 줄이 어떤 보기(원본 index)의 시작 줄인지 판별한다.
 * 보기 라벨의 자체 기호(예: "1.")와 위치 기반 동그라미 기호(①②③④)를 모두 인식한다.
 *
 * 매칭되면 { choiceIndex, leadSymbol } 을 반환한다. leadSymbol 은 실제로 매칭된
 * 선두 기호(리스트 마커/볼드 제외)로, 이후 재번호 시 이 기호만 치환한다.
 */
function matchChoiceLine(
  line: string,
  originalChoices: Choice[]
): { choiceIndex: number; leadSymbol: string } | null {
  for (const choice of originalChoices) {
    const candidates: string[] = [];

    // (1) 라벨 자체 기호 (예: "1.", "①", "A.")
    const symMatch = choice.label.match(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)\s*/);
    if (symMatch) candidates.push(symMatch[1]);

    // (2) 위치 기반 동그라미 기호 (문제 번역 섹션 등에서 사용)
    const circled = CIRCLED_SYMBOLS[choice.index];
    if (circled) candidates.push(circled);

    for (const sym of candidates) {
      const escapedSym = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // 줄 시작 매칭:
      // - 선택적 선두 공백
      // - 선택적 마크다운 리스트 마커 (-, *, +)
      // - 선택적 볼드 마커 (**)
      // - 기호 뒤에는 공백/마침표/볼드/줄끝
      const regex = new RegExp(
        `^\\s*(?:[\\-\\+\\*]\\s*)?(?:\\*\\*)?${escapedSym}(?:\\*\\*)?(?:\\s+|\\.|\\*\\*|$)`
      );

      if (regex.test(line)) {
        return { choiceIndex: choice.index, leadSymbol: sym };
      }
    }
  }

  return null;
}

/**
 * 보기 줄의 선두 기호 한 개만 새 표시 번호로 치환한다.
 * 리스트 마커(- ), 볼드 마커(**) 등 주변 마크다운은 보존한다.
 */
function renumberLeadSymbol(line: string, leadSymbol: string, newSym: string): string {
  const escapedSym = leadSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 선두 공백 + 리스트 마커 + 볼드 마커 까지는 그대로 두고, 그 다음 첫 기호만 교체.
  const regex = new RegExp(`^(\\s*(?:[\\-\\+\\*]\\s*)?(?:\\*\\*)?)${escapedSym}`);
  return line.replace(regex, `$1${newSym}`);
}

/**
 * Reorders the explanation blocks based on shuffled choices and maps the original choice symbols
 * to their new display numbers.
 *
 * 보기 목록이 여러 개(예: "문제 번역"의 ①②③④ 목록 + 하단 "1.~4." 분석 목록)여도
 * 각 목록을 독립적으로 처리한다:
 * - 빈 줄을 만나면 현재 보기 블록을 닫아, 인용구·코드블록 같은 일반 콘텐츠가
 *   마지막 보기에 흡수되거나 함께 끌려가지 않게 한다.
 * - 재정렬은 연속한 보기 블록 run 단위로만 수행해 서로 다른 목록이 섞이지 않게 한다.
 * - 재번호는 각 보기 줄의 선두 기호 한 개만 셔플 표시 번호(숫자)로 교체한다.
 */
export function mapExplanationSymbols(
  explanation: string,
  originalChoices: Choice[],
  shuffledChoices: Choice[]
): string {
  if (!explanation) return explanation;

  const lines = explanation.split('\n');

  type Block = {
    type: 'general' | 'choice';
    choiceIndex?: number;
    leadSymbol?: string;
    lines: string[];
  };

  const blocks: Block[] = [];
  let currentBlock: Block | null = null;
  // 현재 보기 블록이 "열려 있어" 비-보기 라인을 이어받을 수 있는지 여부.
  // 빈 줄을 만나면 닫힌다.
  let choiceBlockOpen = false;

  for (const line of lines) {
    const match = matchChoiceLine(line, originalChoices);

    if (match) {
      currentBlock = {
        type: 'choice',
        choiceIndex: match.choiceIndex,
        leadSymbol: match.leadSymbol,
        lines: [line],
      };
      blocks.push(currentBlock);
      choiceBlockOpen = true;
      continue;
    }

    const isBlank = line.trim() === '';

    if (choiceBlockOpen && !isBlank && currentBlock) {
      // 보기 줄에 이어지는 연속(non-blank) 라인 → 같은 보기 블록에 포함
      currentBlock.lines.push(line);
    } else {
      // 빈 줄을 만나면 보기 블록을 닫는다.
      if (isBlank) choiceBlockOpen = false;

      if (currentBlock && currentBlock.type === 'general') {
        currentBlock.lines.push(line);
      } else {
        currentBlock = { type: 'general', lines: [line] };
        blocks.push(currentBlock);
      }
    }
  }

  // 연속한 보기 블록 run 단위로만 셔플 순서대로 재정렬한다.
  let i = 0;
  while (i < blocks.length) {
    if (blocks[i].type !== 'choice') {
      i++;
      continue;
    }

    let j = i;
    while (j < blocks.length && blocks[j].type === 'choice') j++;

    const run = blocks.slice(i, j);
    const sorted = [...run].sort((a, b) => {
      const ia = shuffledChoices.findIndex((c) => c.index === a.choiceIndex);
      const ib = shuffledChoices.findIndex((c) => c.index === b.choiceIndex);
      return ia - ib;
    });

    for (let k = 0; k < sorted.length; k++) {
      blocks[i + k] = sorted[k];
    }

    i = j;
  }

  // 각 보기 블록의 선두 기호를 새 표시 번호(숫자)로 재번호한다.
  for (const block of blocks) {
    if (block.type !== 'choice' || block.leadSymbol === undefined) continue;

    const newDisplayIndex = shuffledChoices.findIndex((c) => c.index === block.choiceIndex);
    if (newDisplayIndex === -1) continue;

    const newSym = `${newDisplayIndex + 1}`;
    block.lines[0] = renumberLeadSymbol(block.lines[0], block.leadSymbol, newSym);
  }

  return blocks.map((b) => b.lines.join('\n')).join('\n');
}
