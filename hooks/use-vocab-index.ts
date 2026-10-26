import { useEffect, useState } from 'react';
import { fetchVocabIndex } from '@/lib/local/vocab';
import type { VocabEntry } from '@/lib/vocab/matcher';

/** 등록 단어 목록. 불러오는 동안은 null */
export function useVocabIndex(): VocabEntry[] | null {
  const [entries, setEntries] = useState<VocabEntry[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchVocabIndex()
      .then((list) => {
        if (active) setEntries(list);
      })
      .catch(() => {
        if (active) setEntries([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return entries;
}
