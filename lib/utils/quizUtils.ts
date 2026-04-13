import type { Choice } from '../parser/quizParser';

export function stripChoiceSymbol(label: string): string {
  return label.replace(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)\s*/, '');
}

/**
 * Reorders the explanation blocks based on shuffled choices and maps the original choice symbols
 * to their new display numbers.
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
    lines: string[];
  };

  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  for (const line of lines) {
    let isChoiceLine = false;
    let matchedChoiceIndex = -1;

    for (const choice of originalChoices) {
      // Extract the symbol from the original label
      const symMatch = choice.label.match(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)\s*/);
      if (!symMatch) continue;

      const sym = symMatch[1];
      const escapedSym = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Regex to match if the line starts with the choice symbol.
      // - Allows optional leading whitespace.
      // - Allows optional markdown list markers (-, *, +, etc.).
      // - Allows optional bold markers (**).
      // - Must be followed by space, punctuation, or end of string.
      const regex = new RegExp(
        `^\\s*(?:[\\-\\+\\*]\\s*)?(?:\\*\\*)?${escapedSym}(?:\\*\\*)?(?:\\s+|\\.|$)`
      );

      if (regex.test(line)) {
        isChoiceLine = true;
        matchedChoiceIndex = choice.index;
        break;
      }
    }

    if (isChoiceLine) {
      currentBlock = { type: 'choice', choiceIndex: matchedChoiceIndex, lines: [line] };
      blocks.push(currentBlock);
    } else {
      if (currentBlock) {
        currentBlock.lines.push(line);
      } else {
        currentBlock = { type: 'general', lines: [line] };
        blocks.push(currentBlock);
      }
    }
  }

  // Find all choice blocks
  const choiceBlocks = blocks.filter((b) => b.type === 'choice');

  // Sort the choice blocks based on the new shuffled order
  const sortedChoiceBlocks = [...choiceBlocks].sort((a, b) => {
    const indexA = shuffledChoices.findIndex((c) => c.index === a.choiceIndex);
    const indexB = shuffledChoices.findIndex((c) => c.index === b.choiceIndex);
    return indexA - indexB;
  });

  // Reconstruct the explanation with reordered choice blocks in their original positions
  const finalBlocks: Block[] = [];
  let choiceBlockIndex = 0;

  for (const block of blocks) {
    if (block.type === 'choice') {
      finalBlocks.push(sortedChoiceBlocks[choiceBlockIndex]);
      choiceBlockIndex++;
    } else {
      finalBlocks.push(block);
    }
  }

  let mappedExplanation = finalBlocks.map((b) => b.lines.join('\n')).join('\n');

  for (const origChoice of originalChoices) {
    const symMatch = origChoice.label.match(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)\s*/);
    if (!symMatch) continue;

    const sym = symMatch[1];

    const newDisplayIndex = shuffledChoices.findIndex((c) => c.index === origChoice.index);
    if (newDisplayIndex === -1) continue;

    const newSym = `${newDisplayIndex + 1}`;
    const escapedSym = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(escapedSym, 'g');
    mappedExplanation = mappedExplanation.replace(regex, newSym);
  }

  return mappedExplanation;
}
