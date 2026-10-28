import React, { useMemo, useState } from 'react';
import { createVocabMatcher, type VocabEntry } from '@/lib/vocab/matcher';
import { hapticSelection } from '@/lib/utils/haptics';
import { VocabContext, type VocabLookup } from './VocabContext';
import { VocabPopover, type VocabTarget } from './VocabPopover';

interface VocabProviderProps {
  /** 등록 단어 목록. null 이거나 비어 있으면 꺼짐 */
  entries: VocabEntry[] | null;
  children: React.ReactNode;
}

/**
 * 감싼 영역(문제 본문·보기)의 등록 단어를 누를 수 있게 하고, 누르면 뜻 팝업을 띄운다.
 * 해설 시트처럼 감싸지 않은 영역은 영향을 받지 않는다.
 */
export function VocabProvider({ entries, children }: VocabProviderProps) {
  const [target, setTarget] = useState<VocabTarget | null>(null);

  const lookup = useMemo<VocabLookup | null>(() => {
    if (!entries || entries.length === 0) return null;
    return {
      matcher: createVocabMatcher(entries),
      open: (entry, anchor) => {
        hapticSelection();
        setTarget({ entry, anchor });
      },
    };
  }, [entries]);

  return (
    <>
      <VocabContext.Provider value={lookup}>{children}</VocabContext.Provider>
      {/* 팝업은 Provider 바깥 — 상세 설명 안의 단어까지 다시 표시하지 않는다 */}
      <VocabPopover target={target} onDismissed={() => setTarget(null)} />
    </>
  );
}
