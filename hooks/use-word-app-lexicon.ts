import { useEffect, useState } from 'react';
import { fetchWordAppLexicon, peekWordAppLexicon } from '@/lib/local/wordApp';
import type { WordAppLexicon } from '@/lib/vocab/wordApp';

/**
 * 단어장 앱(Quiz Word)의 등록 단어 목록. 불러오는 동안은 undefined, 단어장 앱이 없으면 null
 * (null 이면 단어장 앱 관련 화면을 아예 보여 주지 않는다). 이미 읽었으면 첫 렌더부터 그 값이다.
 */
export function useWordAppLexicon(): WordAppLexicon | null | undefined {
  const [lexicon, setLexicon] = useState<WordAppLexicon | null | undefined>(peekWordAppLexicon);

  useEffect(() => {
    let active = true;
    // 같은 객체면 상태가 그대로라 다시 그리지 않는다
    fetchWordAppLexicon().then((l) => {
      if (active) setLexicon(l);
    });
    return () => {
      active = false;
    };
  }, []);

  return lexicon;
}
