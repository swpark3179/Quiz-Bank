import type { Choice } from '../parser/quizParser';

export function stripChoiceSymbol(label: string): string {
  return label.replace(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)\s*/, '');
}

/**
 * Maps the explanation text by replacing original choice symbols with the new display numbers.
 * Example: if '③' was mapped to display index 0, '③' in explanation becomes '1'.
 */
export function mapExplanationSymbols(
  explanation: string,
  originalChoices: Choice[],
  shuffledChoices: Choice[]
): string {
  let mappedExplanation = explanation;

  for (const origChoice of originalChoices) {
    // Extract the symbol from the original label
    const symMatch = origChoice.label.match(/^([①-⑧]|\d+[\.\)]?|[A-Za-z][\.\)]?)\s*/);
    if (!symMatch) continue;

    const sym = symMatch[1];

    // Find the new display index for this choice
    const newDisplayIndex = shuffledChoices.findIndex((c) => c.index === origChoice.index);
    if (newDisplayIndex === -1) continue;

    // The new display symbol is simply the display index + 1 (e.g. 1, 2, 3...)
    const newSym = `${newDisplayIndex + 1}`;

    // Replace the original symbol with the new symbol in the explanation text.
    // We escape the symbol to avoid regex parsing issues, especially for symbols like '.' or ')'
    const escapedSym = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // We replace occurrences of the symbol. Since some markdown might have bold formatting like **③**,
    // we just replace the symbol globally.
    // Caution: If the symbol is a common number like "1.", it might replace other "1."s in text.
    // However, the current standard uses special characters like ①, so it's generally safe.
    const regex = new RegExp(escapedSym, 'g');
    mappedExplanation = mappedExplanation.replace(regex, newSym);
  }

  return mappedExplanation;
}
