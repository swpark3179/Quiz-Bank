import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Markdown, { MarkdownProps, Renderer } from 'react-native-marked';
import type { RendererInterface } from 'react-native-marked';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

interface MarkdownViewerProps {
  content: string;
  scrollable?: boolean;
}

const markdownStyles: MarkdownProps['styles'] = {
  text: {
    color: Colors.text.primary,
    lineHeight: Typography.size.base * 1.72, // 본문 행간 명시
  },
  paragraph: {
    marginVertical: Spacing.sm,
  },
  strong: {
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  em: {
    fontStyle: 'italic',
    color: Colors.text.primary,
  },
  h1: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginVertical: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  h2: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginVertical: Spacing.xs,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  h3: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginVertical: Spacing.xs,
  },
  code: {
    backgroundColor: Colors.code.bg,
    borderRadius: Radius.sm,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.code.border,
  },
  codespan: {
    backgroundColor: Colors.code.bg,
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.code.border,
    fontFamily: 'monospace',
    fontSize: Typography.size.sm,
    color: Colors.code.text,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent.light, // #88C0D0 프로스트
    backgroundColor: '#EFF4F8',
    borderRadius: 8,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  list: {
    marginVertical: Spacing.xs,
  },
  li: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    lineHeight: Typography.size.base * 1.6,
  },
  hr: {
    backgroundColor: Colors.border,
    height: 1,
    marginVertical: Spacing.md,
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  tableCell: {
    padding: Spacing.sm + 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.divider,
  },
};

/**
 * 다중 행 코드블록을 인라인 코드와 같은 웜 클레이 배경 + 언어 라벨 헤더로 렌더링.
 * react-native-marked 의 기본 code() 만 오버라이드한다.
 */
class QuizRenderer extends Renderer implements RendererInterface {
  code(text: string, language?: string) {
    return (
      <View key={this.getKey()} style={cb.wrap}>
        <View style={cb.header}>
          <Text style={cb.lang}>{language || 'code'}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={cb.body}>
          <Text style={cb.code}>{text}</Text>
        </ScrollView>
      </View>
    );
  }
}

const renderer = new QuizRenderer();

const cb = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: Colors.code.border,
    borderRadius: 9,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  header: {
    backgroundColor: Colors.code.bgHeader,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.code.border,
  },
  lang: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.code.text,
  },
  body: {
    backgroundColor: Colors.code.bg,
    padding: 14,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13.5,
    lineHeight: 22,
    color: Colors.code.base,
  },
});

export const MarkdownViewer = React.memo(function MarkdownViewer({ content, scrollable = false }: MarkdownViewerProps) {
  const markdown = (
    <Markdown
      value={content}
      renderer={renderer}
      styles={markdownStyles}
      flatListProps={{ scrollEnabled: false, style: { backgroundColor: 'transparent' } }}
      theme={{ colors: { background: 'transparent', code: Colors.code.bg, link: Colors.text.link, text: Colors.text.primary, border: Colors.border } }}
    />
  );

  if (scrollable) {
    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{markdown}</View>
      </ScrollView>
    );
  }

  return <View style={styles.content}>{markdown}</View>;
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingVertical: Spacing.xs,
    backgroundColor: 'transparent',
  },
});
