import { createContext, useContext } from 'react';
import type { VocabEntry, VocabMatcher } from '@/lib/vocab/matcher';

/** 단어를 누른 화면 좌표 — 팝업을 그 근처에 띄운다 */
export interface VocabAnchor {
  x: number;
  y: number;
}

export interface VocabLookup {
  matcher: VocabMatcher;
  /** @param occurrence 누른 자리의 id — 같은 단어가 여러 번 나와도 그 자리만 강조한다 */
  open: (entry: VocabEntry, anchor: VocabAnchor, occurrence: string) => void;
}

/** null 이면 단어장 모드 꺼짐 — MarkdownViewer·InlineCodeText 가 평소대로 그린다 */
export const VocabContext = createContext<VocabLookup | null>(null);

export function useVocabLookup(): VocabLookup | null {
  return useContext(VocabContext);
}

/**
 * 뜻 팝업이 열린 단어 자리의 id (열린 팝업이 없으면 null).
 * VocabContext 와 나눠 둬야 팝업을 열고 닫을 때 단어 표시만 다시 그려진다
 * (VocabContext 가 바뀌면 MarkdownViewer 가 렌더러를 새로 만든다).
 */
export const VocabActiveContext = createContext<string | null>(null);
