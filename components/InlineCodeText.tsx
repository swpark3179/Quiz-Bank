import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Colors, Typography } from '@/lib/theme';

interface InlineCodeTextProps {
  /** 백틱(`)으로 감싼 구간을 인라인 코드 블록으로 렌더할 텍스트 */
  text: string;
  /** 기본 텍스트 스타일 (상태 색상 등) */
  style?: StyleProp<TextStyle>;
  /** 코드 구간 스타일 override */
  codeStyle?: StyleProp<TextStyle>;
}

/**
 * 마크다운을 거치지 않는 영역(보기 등)에서 인라인 코드(`code`)만
 * Claude 웜 클레이 파스텔 블록으로 표시한다.
 * 백틱 구간을 분리해 중첩 <Text>로 렌더한다.
 */
export function InlineCodeText({ text, style, codeStyle }: InlineCodeTextProps) {
  // 백틱이 없으면 일반 텍스트로 단순 렌더
  if (!text.includes('`')) {
    return <Text style={style}>{text}</Text>;
  }

  // `code` 구간과 일반 구간을 번갈아 분리
  const segments = text.split(/(`[^`]+`)/g).filter((s) => s.length > 0);

  return (
    <Text style={style}>
      {segments.map((seg, i) => {
        const isCode = seg.length >= 2 && seg.startsWith('`') && seg.endsWith('`');
        if (isCode) {
          return (
            <Text key={i} style={[styles.code, codeStyle]}>
              {seg.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={i}>{seg}</Text>;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  code: {
    backgroundColor: Colors.code.bg,
    color: Colors.code.text,
    fontFamily: 'monospace',
    fontSize: Typography.size.sm,
  },
});
