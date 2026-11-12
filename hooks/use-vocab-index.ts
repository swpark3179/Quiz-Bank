import { useEffect, useState } from 'react';
import { fetchVocabIndex, peekVocabIndex } from '@/lib/local/vocab';
import type { VocabEntry } from '@/lib/vocab/matcher';

/** 등록 단어 목록. 불러오는 동안은 null (이미 불러왔으면 첫 렌더부터 목록) */
export function useVocabIndex(): VocabEntry[] | null {
  const [entries, setEntries] = useState<VocabEntry[] | null>(peekVocabIndex);

  useEffect(() => {
    let active = true;
    fetchVocabIndex()
      // 같은 배열이면 상태가 그대로라 다시 그리지 않는다
      .then((list) => {
        if (active) setEntries(list);
      })
      .catch(() => {
        if (active) setEntries((prev) => prev ?? []);
      });
    return () => {
      active = false;
    };
  }, []);

  return entries;
}
