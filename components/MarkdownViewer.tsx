import React, { useMemo, type ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, type TextStyle } from 'react-native';
import Markdown, { MarkdownProps, Renderer } from 'react-native-marked';
import type { RendererInterface } from 'react-native-marked';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { useVocabLookup, type VocabLookup } from '@/components/vocab/VocabContext';
import { renderVocabText } from '@/components/vocab/VocabWord';

interface MarkdownViewerProps {
  content: string;
  scrollable?: boolean;
  /** 작은 카드(단어 팝업) 안에서 쓰는 촘촘한 스타일 — 제목을 작은 구역 라벨로 */
  compact?: boolean;
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

/** 단어 팝업용 제목 — 화면의 구역 라벨처럼 작은 회색 글씨 (라이브러리 기본 밑줄·큰 행간을 지운다) */
const compactHeading: TextStyle = {
  fontSize: Typography.size.sm,
  lineHeight: Typography.size.sm * 1.5,
  fontWeight: Typography.weight.semibold,
  color: Colors.text.secondary,
  marginTop: Spacing.md,
  marginBottom: 2,
  paddingBottom: 0,
  borderBottomWidth: 0,
};

/** 단어 팝업용: 본문은 한 단계 작게, 제목은 작은 구역 라벨로 */
const compactMarkdownStyles: MarkdownProps['styles'] = {
  ...markdownStyles,
  text: {
    color: Colors.text.primary,
    fontSize: Typography.size.sm + 1,
    lineHeight: (Typography.size.sm + 1) * 1.65,
  },
  paragraph: {
    marginVertical: Spacing.xs,
  },
  h1: compactHeading,
  h2: compactHeading,
  h3: compactHeading,
  li: {
    fontSize: Typography.size.sm + 1,
    color: Colors.text.primary,
    lineHeight: (Typography.size.sm + 1) * 1.6,
  },
  list: {
    marginVertical: 2,
  },
  blockquote: {
    ...markdownStyles.blockquote,
    paddingVertical: Spacing.xs,
    marginVertical: Spacing.xs,
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

/**
 * 단어장 모드: 일반 텍스트·굵게·기울임·제목 속 등록 단어를 누를 수 있게 바꾼다.
 * 인라인 코드·코드블록은 건드리지 않는다.
 */
class VocabRenderer extends QuizRenderer {
  constructor(private lookup: VocabLookup) {
    super();
  }

  private mark(children: string | ReactNode[]): string | ReactNode[] {
    return typeof children === 'string'
      ? renderVocabText(children, this.lookup, () => this.getKey())
      : children;
  }

  text(children: string | ReactNode[], styles?: TextStyle) {
    return super.text(this.mark(children), styles);
  }

  strong(children: string | ReactNode[], styles?: TextStyle) {
    return super.strong(this.mark(children), styles);
  }

  em(children: string | ReactNode[], styles?: TextStyle) {
    return super.em(this.mark(children), styles);
  }

  heading(children: string | ReactNode[], styles?: TextStyle) {
    return super.heading(this.mark(children), styles);
  }
}

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

export const MarkdownViewer = React.memo(function MarkdownViewer({
  content,
  scrollable = false,
  compact = false,
}: MarkdownViewerProps) {
  // 단어장 모드 영역(VocabProvider) 안에서만 단어 표시 렌더러를 쓴다
  const lookup = useVocabLookup();
  const activeRenderer = useMemo(() => (lookup ? new VocabRenderer(lookup) : renderer), [lookup]);

  const markdown = (
    <Markdown
      value={content}
      renderer={activeRenderer}
      styles={compact ? compactMarkdownStyles : markdownStyles}
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
