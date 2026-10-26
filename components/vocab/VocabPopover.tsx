import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { Motion } from '@/lib/theme/motion';
import { fetchVocabDetail, peekVocabDetail, type VocabDetail } from '@/lib/local/vocab';
import type { VocabEntry } from '@/lib/vocab/matcher';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { SkeletonBlock } from '@/components/ui/Skeleton';
import type { VocabAnchor } from './VocabContext';

export interface VocabTarget {
  entry: VocabEntry;
  anchor: VocabAnchor;
}

interface VocabPopoverProps {
  target: VocabTarget | null;
  /** 닫힘 애니메이션이 끝난 뒤 호출 — 부모가 target 을 비운다 */
  onDismissed: () => void;
}

// 화면 가장자리 여백 · 카드 최대 너비 · 누른 줄과 카드 사이 간격(줄 높이의 절반 + 꼬리)
const EDGE = Spacing.base;
const MAX_WIDTH = 360;
const GAP = 20;
const CARET = 12;
// 아래쪽 공간이 이만큼 있으면 아래에 띄운다 (읽던 줄을 가리지 않는 쪽 우선)
const PREFERRED_SPACE = 280;

/**
 * 단어 뜻 팝업 — 누른 단어 바로 위/아래에 꼬리 달린 카드로 뜬다.
 * 머리(단어·발음·품사·한 줄 뜻)는 index.json 에서 바로 그리고,
 * 상세 설명(vocab/{id}.md)은 열면서 받아 아래에 이어 붙인다.
 */
export function VocabPopover({ target, onDismissed }: VocabPopoverProps) {
  const windowSize = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // 모달이 실제로 차지한 크기 — Android 전체 화면(상태 표시줄 포함)에서도 좌표가 맞도록 직접 잰다
  const [root, setRoot] = useState<{ width: number; height: number } | null>(null);
  const screenW = root?.width ?? windowSize.width;
  const screenH = root?.height ?? windowSize.height;

  // 등장: 투명도는 시간으로, 크기는 약한 스프링으로 (반동이 투명도에 섞이지 않게 분리)
  const fade = useSharedValue(0);
  const pop = useSharedValue(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!target) return;
    setClosing(false);
    fade.set(0);
    pop.set(0);
    fade.set(withTiming(1, { duration: Motion.duration.color, easing: Motion.easing.standard }));
    pop.set(withSpring(1, Motion.spring.popover));
  }, [target, fade, pop]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    const out = { duration: Motion.duration.fast, easing: Motion.easing.exit };
    pop.set(withTiming(0, out));
    // 끝났는지와 상관없이 정리한다 — 중간에 끊겨도 투명한 모달이 화면을 막고 남지 않게
    fade.set(withTiming(0, out, () => runOnJS(onDismissed)()));
  };

  // 위치 계산: 아래 공간이 충분하면 아래, 아니면 더 넓은 쪽
  const anchor = target?.anchor ?? { x: screenW / 2, y: screenH / 2 };
  const cardW = Math.min(screenW - EDGE * 2, MAX_WIDTH);
  const spaceBelow = screenH - insets.bottom - EDGE - (anchor.y + GAP);
  const spaceAbove = anchor.y - GAP - insets.top - EDGE;
  const placeBelow = spaceBelow >= PREFERRED_SPACE || spaceBelow >= spaceAbove;
  const maxHeight = Math.max(160, Math.min(placeBelow ? spaceBelow : spaceAbove, screenH * 0.6));
  const left = clamp(anchor.x - cardW / 2, EDGE, screenW - EDGE - cardW);
  const caretX = clamp(anchor.x - left, Radius.lg + CARET / 2, cardW - Radius.lg - CARET / 2);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: fade.get() }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: fade.get(),
    transform: [
      { translateY: (placeBelow ? -6 : 6) * (1 - pop.get()) },
      { scale: 0.92 + 0.08 * pop.get() },
    ],
  }));

  return (
    <Modal
      visible={target !== null}
      transparent
      animationType="none"
      onRequestClose={requestClose}
      statusBarTranslucent
      navigationBarTranslucent={Platform.OS === 'android'}
    >
      <View
        style={StyleSheet.absoluteFill}
        onLayout={(e) => setRoot({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        pointerEvents="none"
      />
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={requestClose}
          accessibilityRole="button"
          accessibilityLabel="뜻 닫기"
        />
      </Animated.View>

      {/* 모달 크기를 잰 뒤에 그려 첫 프레임부터 제자리에 뜬다 */}
      {target && root && (
        <Animated.View
          style={[
            styles.card,
            { width: cardW, left, maxHeight },
            placeBelow ? { top: anchor.y + GAP } : { bottom: screenH - (anchor.y - GAP) },
            // 누른 자리(꼬리)에서 커져 나오도록 변형 기준점을 꼬리에 둔다
            { transformOrigin: `${caretX}px ${placeBelow ? '0%' : '100%'}` },
            cardStyle,
          ]}
          accessibilityViewIsModal
        >
          <View
            style={[
              styles.caret,
              { left: caretX - CARET / 2 },
              placeBelow ? styles.caretTop : styles.caretBottom,
            ]}
          />
          <PopoverBody key={target.entry.id} entry={target.entry} onClose={requestClose} />
        </Animated.View>
      )}
    </Modal>
  );
}

function PopoverBody({ entry, onClose }: { entry: VocabEntry; onClose: () => void }) {
  // 한 번 열어 본 단어는 캐시에서 바로 그린다 (undefined = 받는 중)
  const [detail, setDetail] = useState<VocabDetail | undefined>(() => peekVocabDetail(entry.id));

  useEffect(() => {
    if (detail) return;
    let active = true;
    fetchVocabDetail(entry.id).then((d) => {
      if (active) setDetail(d);
    });
    return () => {
      active = false;
    };
  }, [entry.id, detail]);

  const ipa = entry.ipa?.replace(/^\/|\/$/g, '');

  return (
    <>
      <View
        style={styles.header}
        accessible
        accessibilityLabel={[entry.word, entry.pos, entry.meaning].filter(Boolean).join(', ')}
      >
        <View style={styles.headerText}>
          <Text style={styles.word} selectable>
            {entry.word}
          </Text>
          {(entry.pos || ipa) && (
            <View style={styles.metaRow}>
              {entry.pos && (
                <View style={styles.posChip}>
                  <Text style={styles.posText}>{entry.pos}</Text>
                </View>
              )}
              {ipa && <Text style={styles.ipa}>/{ipa}/</Text>}
            </View>
          )}
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={6}
          style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
          accessibilityRole="button"
          accessibilityLabel="닫기"
        >
          <Ionicons name="close" size={18} color={Colors.text.secondary} />
        </Pressable>
      </View>

      <Text style={styles.meaning} selectable>
        {entry.meaning}
      </Text>

      {detail === undefined && (
        <View style={styles.loading} accessibilityLabel="설명 불러오는 중">
          <SkeletonBlock style={[styles.skeletonLine, { width: '92%' }]} />
          <SkeletonBlock style={[styles.skeletonLine, { width: '78%' }]} />
          <SkeletonBlock style={[styles.skeletonLine, { width: '54%' }]} />
        </View>
      )}

      {detail?.status === 'ok' && (
        <Animated.View entering={FadeIn.duration(Motion.duration.base)} style={styles.detail}>
          <DetailScroll markdown={detail.markdown} />
        </Animated.View>
      )}

      {detail?.status === 'error' && (
        <View style={styles.notice}>
          <Ionicons name="cloud-offline-outline" size={15} color={Colors.text.tertiary} />
          <Text style={styles.noticeText}>자세한 설명은 연결되면 볼 수 있어요</Text>
        </View>
      )}
    </>
  );
}

/** 상세 설명 — 카드보다 길면 안에서 스크롤하고, 끝에 닿기 전까지 아래쪽을 옅게 흐려 더 있음을 알린다 */
function DetailScroll({ markdown }: { markdown: string }) {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const overflows = viewHeight > 0 && contentHeight > viewHeight + 1;

  return (
    <View style={styles.detailScrollWrap}>
      <ScrollView
        style={styles.detailScroll}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
        onLayout={(e) => setViewHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, h) => setContentHeight(h)}
        onScroll={(e) => {
          const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
          setAtEnd(contentOffset.y + layoutMeasurement.height >= contentSize.height - Spacing.sm);
        }}
        scrollEventThrottle={32}
      >
        <MarkdownViewer content={markdown} compact />
      </ScrollView>
      {overflows && !atEnd && (
        <Animated.View
          entering={FadeIn.duration(Motion.duration.color)}
          exiting={FadeOut.duration(Motion.duration.color)}
          style={styles.fade}
          pointerEvents="none"
        >
          {FADE_STEPS.map((opacity) => (
            <View key={opacity} style={[styles.fadeStep, { opacity }]} />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

// 아래로 갈수록 진해지는 띠 — 그라데이션 의존성 없이 카드 색으로 흐린다
const FADE_STEPS = [0.12, 0.3, 0.5, 0.7, 0.86, 0.96];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: Colors.bg.scrim,
  },
  card: {
    position: 'absolute',
    backgroundColor: Colors.surface.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingTop: Spacing.md,
    ...Shadow.lg,
  },
  // 45° 돌린 정사각형의 절반만 카드 밖으로 — 카드 테두리를 덮어 이음매 없이 이어진다
  caret: {
    position: 'absolute',
    width: CARET,
    height: CARET,
    backgroundColor: Colors.surface.card,
    borderColor: Colors.border,
    transform: [{ rotate: '45deg' }],
  },
  caretTop: {
    top: -CARET / 2,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  caretBottom: {
    bottom: -CARET / 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
    paddingTop: 2,
  },
  word: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  posChip: {
    backgroundColor: Colors.choice.selected,
    borderRadius: Radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  posText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.accent.deep,
  },
  ipa: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePressed: {
    backgroundColor: Colors.bg.secondary,
  },
  meaning: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.accent.deep,
    lineHeight: Typography.size.md * 1.5,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  loading: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  skeletonLine: {
    height: 12,
    borderRadius: Radius.xs,
  },
  detail: {
    flexShrink: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  detailScrollWrap: {
    flexShrink: 1,
  },
  detailScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderBottomLeftRadius: Radius.lg - 1,
    borderBottomRightRadius: Radius.lg - 1,
  },
  fadeStep: {
    height: 5,
    backgroundColor: Colors.surface.card,
  },
  detailContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  noticeText: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
  },
});
