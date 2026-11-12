import { useEffect, useState } from 'react';
import { fetchWordAppLexicon } from '@/lib/local/wordApp';
import type { WordAppLexicon } from '@/lib/vocab/wordApp';

/**
 * 단어장 앱(Quiz Word)의 등록 단어 목록. 불러오는 동안은 undefined, 단어장 앱이 없으면 null
 * (null 이면 단어장 앱 관련 화면을 아예 보여 주지 않는다).
 */
export function useWordAppLexicon(): WordAppLexicon | null | undefined {
  const [lexicon, setLexicon] = useState<WordAppLexicon | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchWordAppLexicon().then((l) => {
      if (active) setLexicon(l);
    });
    return () => {
      active = false;
    };
  }, []);

  return lexicon;
}
