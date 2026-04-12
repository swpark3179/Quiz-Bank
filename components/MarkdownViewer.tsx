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
    backgroundColor: '#f6f8fa',
    borderRadius: Radius.sm,
    padding: Spacing.base,
  },
  codespan: {
    backgroundColor: '#f6f8fa',
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.xs,
    fontFamily: 'monospace',
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
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

export function MarkdownViewer({ content, scrollable = false }: MarkdownViewerProps) {
  const markdown = (
    <Markdown
      value={content}
      styles={markdownStyles}
      flatListProps={{ scrollEnabled: false }}
      theme={{ colors: { background: 'transparent', code: '#f6f8fa', link: '#58a6ff', text: Colors.text.primary, border: '#d0d7de' } }}
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
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.bg.primary,
  },
});
