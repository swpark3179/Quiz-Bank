import React from 'react';
import { Text, StyleSheet, type GestureResponderEvent } from 'react-native';
import { Colors } from '@/lib/theme';
import type { VocabEntry } from '@/lib/vocab/matcher';
import type { VocabLookup } from './VocabContext';

interface VocabWordProps {
  text: string;
  entry: VocabEntry;
  lookup: VocabLookup;
}

/**
 * 누를 수 있는 등록 단어 (부모 <Text> 안에 중첩되는 인라인 텍스트).
 * 글자 색·굵기는 문장 그대로 두고, 단어 오른쪽 위에 작은 점 표시만 붙여
 * 읽는 흐름을 방해하지 않으면서 누를 수 있다는 것을 알린다.
 */
export function VocabWord({ text, entry, lookup }: VocabWordProps) {
  const handlePress = (e: GestureResponderEvent) => {
    lookup.open(entry, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
  };

  return (
    <Text
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityHint="뜻 보기"
      style={styles.word}
    >
      {text}
      <Text style={styles.marker} accessible={false}>
        {MARKER}
      </Text>
    </Text>
  );
}

// 위첨자처럼 글자 위쪽에 놓이는 작은 고리 (모든 시스템 글꼴에 있는 기호)
const MARKER = '°';

const styles = StyleSheet.create({
  word: {
    // 웹: 마우스를 올리면 손가락 커서
    cursor: 'pointer',
  },
  marker: {
    color: Colors.accent.secondary,
    fontWeight: '700',
    fontStyle: 'normal',
  },
});

/**
 * 문자열 속 등록 단어를 VocabWord 로 바꾼다. 매칭이 없으면 문자열을 그대로 돌려준다.
 * @param nextKey 형제 노드 key 생성기 (마크다운 렌더러는 자체 key 를 쓴다)
 */
export function renderVocabText(
  text: string,
  lookup: VocabLookup,
  nextKey: (index: number) => string = String
): string | React.ReactNode[] {
  const segments = lookup.matcher.split(text);
  if (segments.length === 1 && !segments[0].entry) return text;

  return segments.map((seg, i) =>
    seg.entry ? (
      <VocabWord key={nextKey(i)} text={seg.text} entry={seg.entry} lookup={lookup} />
    ) : (
      seg.text
    )
  );
}
