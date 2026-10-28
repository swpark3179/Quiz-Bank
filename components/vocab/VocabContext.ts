import { createContext, useContext } from 'react';
import type { VocabEntry, VocabMatcher } from '@/lib/vocab/matcher';

/** 단어를 누른 화면 좌표 — 팝업을 그 근처에 띄운다 */
export interface VocabAnchor {
  x: number;
  y: number;
}

export interface VocabLookup {
  matcher: VocabMatcher;
  open: (entry: VocabEntry, anchor: VocabAnchor) => void;
}

/** null 이면 단어장 모드 꺼짐 — MarkdownViewer·InlineCodeText 가 평소대로 그린다 */
export const VocabContext = createContext<VocabLookup | null>(null);

export function useVocabLookup(): VocabLookup | null {
  return useContext(VocabContext);
}
