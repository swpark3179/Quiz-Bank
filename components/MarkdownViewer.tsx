import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Markdown, { MarkdownProps } from 'react-native-marked';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

interface MarkdownViewerProps {
  content: string;
  scrollable?: boolean;
}

const markdownStyles: MarkdownProps['styles'] = {
  text: {
    color: Colors.text.primary,
  },
  paragraph: {
    marginVertical: Spacing.xs,
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
    borderBottomColor: '#d0d7de',
  },
  h2: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginVertical: Spacing.xs,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7de',
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
    borderLeftWidth: 4,
    borderLeftColor: '#d0d7de',
    paddingLeft: Spacing.md,
    marginVertical: Spacing.xs,
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
    backgroundColor: '#d0d7de',
    height: 2,
    marginVertical: Spacing.md,
  },
  table: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: Radius.sm,
  },
  tableCell: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
};

export const MarkdownViewer = React.memo(function MarkdownViewer({ content, scrollable = false }: MarkdownViewerProps) {
  const markdown = (
    <Markdown
      value={content}
      styles={markdownStyles}
      flatListProps={{ scrollEnabled: false, style: { backgroundColor: 'transparent' } }}
      theme={{ colors: { background: 'transparent', code: Colors.code.bg, link: '#58a6ff', text: Colors.text.primary, border: '#d0d7de' } }}
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
