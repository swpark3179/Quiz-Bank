import React, { useContext, useId } from 'react';
import { Text, StyleSheet, type GestureResponderEvent } from 'react-native';
import { Colors } from '@/lib/theme';
import type { VocabEntry } from '@/lib/vocab/matcher';
import { VocabActiveContext, type VocabLookup } from './VocabContext';

interface VocabWordProps {
  text: string;
  entry: VocabEntry;
  lookup: VocabLookup;
}

/**
 * 누를 수 있는 등록 단어 (부모 <Text> 안에 중첩되는 인라인 텍스트).
 * 글자 색·굵기·글꼴은 문장 그대로 두고 옅은 파랑 배경만 깔아, 읽는 흐름을 방해하지 않으면서
 * 누를 수 있다는 것을 알린다. 뜻 팝업이 열린 동안에는 누른 자리만 진한 파랑으로 바뀐다.
 * (중첩 Text 라 둥근 모서리·여백은 플랫폼마다 무시되므로 배경색만 쓴다)
 */
export function VocabWord({ text, entry, lookup }: VocabWordProps) {
  // 같은 단어가 한 화면에 여러 번 나와도 누른 자리만 강조하도록 자리마다 id 를 둔다
  const occurrence = useId();
  const active = useContext(VocabActiveContext) === occurrence;

  const handlePress = (e: GestureResponderEvent) => {
    lookup.open(entry, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY }, occurrence);
  };

  return (
    <Text
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityHint="뜻 보기"
      style={[styles.word, active && styles.active]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  word: {
    backgroundColor: Colors.vocab.highlight,
    // 웹: 마우스를 올리면 손가락 커서
    cursor: 'pointer',
  },
  active: {
    backgroundColor: Colors.vocab.active,
    color: Colors.vocab.activeText,
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
