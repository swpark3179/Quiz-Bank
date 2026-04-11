import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Markdown, { MarkdownProps } from 'react-native-marked';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

interface MarkdownViewerProps {
  content: string;
  scrollable?: boolean;
}

const markdownStyles: MarkdownProps['styles'] = {
  paragraph: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    lineHeight: Typography.size.base * 1.7,
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
  },
  h2: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginVertical: Spacing.xs,
  },
  h3: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginVertical: Spacing.xs,
  },
  code: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.xs,
    fontFamily: 'monospace',
    fontSize: Typography.size.sm,
    color: Colors.accent.primary,
  },
  blockquote: {
    backgroundColor: Colors.bg.secondary,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent.secondary,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  list: {
    marginVertical: Spacing.xs,
  },
  listItem: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    lineHeight: Typography.size.base * 1.6,
  },
};

export function MarkdownViewer({ content, scrollable = false }: MarkdownViewerProps) {
  const markdown = (
    <Markdown
      value={content}
      styles={markdownStyles}
      flatListProps={{ scrollEnabled: false }}
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
  },
  content: {
    paddingVertical: Spacing.xs,
  },
});
