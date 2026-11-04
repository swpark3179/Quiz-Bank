import React, { useMemo, useState, type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  type LayoutChangeEvent,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
// 가로 스크롤(코드블록·표)은 제스처 핸들러의 ScrollView 를 쓴다.
// 해설 바텀시트(@gorhom/bottom-sheet) 안에서 react-native 기본 ScrollView 를 쓰면
// Android 에서 시트의 팬 제스처가 가로 드래그를 가져가 옆으로 스크롤되지 않는다.
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
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
  // 표는 QuizRenderer.table() 이 직접 그린다 (MarkdownTable). 여기 값은 그쪽으로 전달된다.
  table: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableCell: {
    padding: Spacing.sm + 1,
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

/** 표 열의 최소 너비 — 카드에 다 들어가면 열을 균등하게 늘리고, 넘치면 이 너비로 두고 가로 스크롤 */
const MIN_COL_WIDTH = 120;
/** 표 바깥 테두리 두께 (좌우 합 = 2) */
const TABLE_BORDER = 1;

interface MarkdownTableProps {
  header: ReactNode[][];
  rows: ReactNode[][][];
  borderColor?: string;
  cellStyle?: ViewStyle;
}

/**
 * 마크다운 표.
 * 라이브러리 기본 표는 열마다 '창 너비 × 1.3/3' 고정 폭이라(렌더러 생성 시 한 번 계산)
 * 2열만 돼도 카드보다 넓어 오른쪽이 잘리고, 회전해도 폭이 바뀌지 않는다.
 * 여기서는 표가 놓인 자리의 실제 폭(onLayout)을 열 수로 나눠 열 너비를 정한다.
 * 회전·창 크기 변경 시 onLayout 이 다시 불려 자동으로 맞춰진다.
 * (flex 비율로 나누면 웹(CSS)에서는 가장 긴 행의 내용 폭만큼 표가 넓어져 플랫폼마다 결과가 달라진다)
 */
const MarkdownTable = React.memo(function MarkdownTable({
  header,
  rows,
  borderColor = Colors.border,
  cellStyle,
}: MarkdownTableProps) {
  const [viewportWidth, setViewportWidth] = useState(0);
  const allRows = [header, ...rows];
  const lastRow = allRows.length - 1;
  const colCount = Math.max(1, header.length);
  const colWidth = Math.max(
    MIN_COL_WIDTH,
    Math.floor((viewportWidth - TABLE_BORDER * 2) / colCount)
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (Math.abs(width - viewportWidth) >= 1) setViewportWidth(width);
  };

  return (
    <GestureScrollView
      horizontal
      bounces={false}
      onLayout={handleLayout}
      // 폭을 재기 전 첫 프레임(최소 너비 배치)은 감춘다
      style={[tb.scroll, viewportWidth === 0 && tb.measuring]}
    >
      <View style={[tb.table, { borderColor }]}>
        {allRows.map((cells, rowIdx) => (
          <View key={rowIdx} style={[tb.row, rowIdx === 0 && tb.headerRow]}>
            {cells.map((cell, colIdx) => (
              <View
                key={colIdx}
                style={[
                  tb.cell,
                  cellStyle,
                  { width: colWidth },
                  colIdx < cells.length - 1 && tb.cellDividerRight,
                  rowIdx < lastRow && tb.cellDividerBottom,
                ]}
              >
                <View style={tb.cellContent}>{cell}</View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </GestureScrollView>
  );
});

/**
 * 다중 행 코드블록을 인라인 코드와 같은 웜 클레이 배경 + 언어 라벨 헤더로 렌더링하고,
 * 표는 화면 폭에 맞춰 직접 그린다 (MarkdownTable).
 */
class QuizRenderer extends Renderer implements RendererInterface {
  code(text: string, language?: string) {
    return (
      <View key={this.getKey()} style={cb.wrap}>
        <View style={cb.header}>
          <Text style={cb.lang}>{language || 'code'}</Text>
        </View>
        <GestureScrollView
          horizontal
          bounces={false}
          style={cb.body}
          contentContainerStyle={cb.bodyContent}
        >
          {/* Text 를 View 로 감싼다 — "Cannot add a child that doesn't have a YogaNode" 회피 (RN #18773) */}
          <View>
            <Text style={cb.code}>{text}</Text>
          </View>
        </GestureScrollView>
      </View>
    );
  }

  table(
    header: ReactNode[][],
    rows: ReactNode[][][],
    tableStyle?: ViewStyle,
    _rowStyle?: ViewStyle,
    cellStyle?: ViewStyle,
  ) {
    return (
      <MarkdownTable
        key={this.getKey()}
        header={header}
        rows={rows}
        borderColor={tableStyle?.borderColor as string | undefined}
        cellStyle={cellStyle}
      />
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
  },
  // 여백은 contentContainerStyle 에 — ScrollView style 에 두면 Android 에서 끝까지 밀었을 때 오른쪽 여백이 사라진다
  bodyContent: {
    padding: 14,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13.5,
    lineHeight: 22,
    color: Colors.code.base,
  },
});

const tb = StyleSheet.create({
  scroll: {
    marginVertical: Spacing.sm,
  },
  measuring: {
    opacity: 0,
  },
  table: {
    borderWidth: TABLE_BORDER,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surface.card,
  },
  row: {
    flexDirection: 'row',
  },
  headerRow: {
    backgroundColor: Colors.surface.sheet,
  },
  cell: {
    justifyContent: 'center',
    // 인라인 코드 하나뿐인 칸이 칸 전체로 늘어나지 않고 글자 폭만큼만 차지하게
    alignItems: 'flex-start',
  },
  // 글자 폭만큼 줄이되 칸보다 넓어지지는 않게 — 긴 인라인 코드는 칸 안에서 줄바꿈
  cellContent: {
    maxWidth: '100%',
  },
  cellDividerRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: Colors.border,
  },
  cellDividerBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
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
