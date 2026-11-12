import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  type LayoutChangeEvent,
  type ViewStyle,
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
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type PanGesture,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { Motion } from '@/lib/theme/motion';
import { fetchVocabDetail, peekVocabDetail, type VocabDetail } from '@/lib/local/vocab';
import { openInWordApp } from '@/lib/local/wordApp';
import { findInLexicon } from '@/lib/vocab/wordApp';
import { useWordAppLexicon } from '@/hooks/use-word-app-lexicon';
import type { VocabEntry } from '@/lib/vocab/matcher';
import {
  clamp,
  clampOffset,
  dragBounds,
  maximizedFrame,
  type DragBounds,
} from '@/lib/vocab/popoverLayout';
import { hapticSelection } from '@/lib/utils/haptics';
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
// 최대화했을 때 카드 최대 너비 — 데스크탑처럼 넓은 화면에서 한 줄이 지나치게 길어지지 않게
const MAXIMIZED_MAX_WIDTH = 720;
// 머리를 이만큼 꾹 눌러야 잡힌다 (네이티브) — 그냥 탭하거나 닫기를 누를 때 움직이지 않게
const DRAG_LONG_PRESS_MS = 250;
// 잡혀 있는 동안 살짝 들어 올린 느낌
const LIFT_SCALE = 0.02;
const NO_BOUNDS: DragBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

/**
 * 단어 뜻 팝업 — 누른 단어 바로 위/아래에 꼬리 달린 카드로 뜬다.
 * 머리(단어·발음·품사·한 줄 뜻)는 index.json 에서 바로 그리고,
 * 상세 설명(vocab/{id}.md)은 열면서 받아 아래에 이어 붙인다.
 * 머리를 꾹 눌러 끌면 옮길 수 있고(웹은 바로 끈다), 머리의 버튼으로 화면 가득 펼칠 수 있다.
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
  const [maximized, setMaximized] = useState(false);

  // 머리를 끌어 옮긴 거리 — 레이아웃은 그대로 두고 transform 으로만 옮긴다
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const bounds = useSharedValue<DragBounds>(NO_BOUNDS);
  const lift = useSharedValue(0);
  // 옮긴 뒤에는 꼬리가 누른 단어를 가리키지 않으므로 숨긴다
  const moved = useSharedValue(false);
  const caret = useSharedValue(1);

  useEffect(() => {
    if (!target) return;
    setClosing(false);
    // 새 단어는 누른 자리에서, 원래 크기로 연다
    setMaximized(false);
    dragX.set(0);
    dragY.set(0);
    lift.set(0);
    moved.set(false);
    caret.set(1);
    fade.set(0);
    pop.set(0);
    fade.set(withTiming(1, { duration: Motion.duration.color, easing: Motion.easing.standard }));
    pop.set(withSpring(1, Motion.spring.popover));
  }, [target, fade, pop, dragX, dragY, lift, moved, caret]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    const out = { duration: Motion.duration.fast, easing: Motion.easing.exit };
    pop.set(withTiming(0, out));
    // 끝났는지와 상관없이 정리한다 — 중간에 끊겨도 투명한 모달이 화면을 막고 남지 않게
    fade.set(withTiming(0, out, () => runOnJS(onDismissed)()));
  };

  const toggleMaximize = () => {
    setMaximized((m) => !m);
    // 크기가 바뀌는 순간을 등장 스프링으로 짧게 이어 준다 (레이아웃 애니메이션은 웹에서 불안정)
    pop.set(0.6);
    pop.set(withSpring(1, Motion.spring.popover));
  };

  // Android 뒤로 가기: 펼쳐 둔 상태면 먼저 원래 크기로
  const handleBack = () => {
    if (maximized) toggleMaximize();
    else requestClose();
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
  const full = maximizedFrame({
    screenW,
    screenH,
    insets,
    edge: EDGE,
    maxWidth: MAXIMIZED_MAX_WIDTH,
  });

  // 카드 크기가 바뀔 때마다(설명 로드, 화면 회전, 최대화 해제) 옮길 수 있는 범위를 다시 잰다.
  // 이미 옮겨 둔 카드가 커져도 화면 밖으로 밀려나지 않게 현재 위치도 범위 안으로 당긴다.
  const handleCardLayout = (e: LayoutChangeEvent) => {
    if (maximized) return;
    const next = dragBounds({ frame: e.nativeEvent.layout, screenW, screenH, insets, edge: EDGE });
    bounds.set(next);
    const offset = clampOffset({ x: dragX.get(), y: dragY.get() }, next);
    dragX.set(offset.x);
    dragY.set(offset.y);
  };

  const dragGesture = useMemo<PanGesture>(() => {
    const pan = Gesture.Pan()
      .enabled(!maximized)
      .activeCursor('grabbing')
      .onStart(() => {
        startX.set(dragX.get());
        startY.set(dragY.get());
        lift.set(withTiming(1, { duration: Motion.duration.fast, easing: Motion.easing.standard }));
        runOnJS(hapticSelection)();
      })
      .onUpdate((e) => {
        const b = bounds.get();
        dragX.set(Math.min(Math.max(startX.get() + e.translationX, b.minX), b.maxX));
        dragY.set(Math.min(Math.max(startY.get() + e.translationY, b.minY), b.maxY));
        if (!moved.get() && (e.translationX !== 0 || e.translationY !== 0)) {
          moved.set(true);
          caret.set(withTiming(0, { duration: Motion.duration.color }));
        }
      })
      .onFinalize(() => {
        lift.set(withTiming(0, { duration: Motion.duration.fast, easing: Motion.easing.standard }));
      });
    // 웹(데스크탑)은 창 제목줄처럼 바로 끌고, 터치 화면은 꾹 눌러야 잡힌다
    return Platform.OS === 'web' ? pan : pan.activateAfterLongPress(DRAG_LONG_PRESS_MS);
  }, [maximized, dragX, dragY, startX, startY, bounds, lift, moved, caret]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: fade.get() }));
  const cardStyle = useAnimatedStyle(() => {
    // 펼친 동안에는 옮긴 거리를 쓰지 않는다 — 되돌리면 옮겨 둔 자리로 돌아간다
    const free = maximized ? 0 : 1;
    return {
      opacity: fade.get(),
      transform: [
        { translateX: dragX.get() * free },
        { translateY: dragY.get() * free + (placeBelow ? -6 : 6) * (1 - pop.get()) },
        { scale: (0.92 + 0.08 * pop.get()) * (1 + LIFT_SCALE * lift.get()) },
      ],
    };
  });
  const caretStyle = useAnimatedStyle(() => ({ opacity: caret.get() }));

  return (
    <Modal
      visible={target !== null}
      transparent
      animationType="none"
      onRequestClose={handleBack}
      statusBarTranslucent
      navigationBarTranslucent={Platform.OS === 'android'}
    >
      {/* Android 의 Modal 은 앱의 제스처 루트 밖이라, 뜻 본문의 표·코드 가로 스크롤(제스처 핸들러)이
          동작하도록 모달 안에 루트를 따로 둔다 */}
      <GestureHandlerRootView style={styles.gestureRoot}>
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
              maximized
                ? { ...full, transformOrigin: '50% 50%' }
                : [
                    { width: cardW, left, maxHeight },
                    placeBelow ? { top: anchor.y + GAP } : { bottom: screenH - (anchor.y - GAP) },
                    // 누른 자리(꼬리)에서 커져 나오도록 변형 기준점을 꼬리에 둔다
                    { transformOrigin: `${caretX}px ${placeBelow ? '0%' : '100%'}` },
                  ],
              cardStyle,
            ]}
            onLayout={handleCardLayout}
            accessibilityViewIsModal
          >
            {!maximized && (
              <Animated.View
                style={[
                  styles.caret,
                  { left: caretX - CARET / 2 },
                  placeBelow ? styles.caretTop : styles.caretBottom,
                  caretStyle,
                ]}
              />
            )}
            <PopoverBody
              key={target.entry.id}
              entry={target.entry}
              onClose={requestClose}
              headerGesture={dragGesture}
              maximized={maximized}
              onToggleMaximize={toggleMaximize}
            />
          </Animated.View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

interface PopoverBodyProps {
  entry: VocabEntry;
  onClose: () => void;
  /** 머리를 끌어 카드를 옮기는 제스처 */
  headerGesture: PanGesture;
  maximized: boolean;
  onToggleMaximize: () => void;
}

function PopoverBody({
  entry,
  onClose,
  headerGesture,
  maximized,
  onToggleMaximize,
}: PopoverBodyProps) {
  // 단어장 앱에서 온 단어는 이 앱에 상세 설명이 없다 — 자세히는 단어장 앱에서 본다
  const fromWordApp = entry.source === 'wordApp';
  // 한 번 열어 본 단어는 캐시에서 바로 그린다 (undefined = 받는 중)
  const [detail, setDetail] = useState<VocabDetail | undefined>(() =>
    fromWordApp ? { status: 'none' } : peekVocabDetail(entry.id)
  );
  // '단어장에서 자세히' — 단어장 앱이 있고 그 앱에 이 단어가 있을 때만 (없으면 버튼 자체가 없다)
  const wordAppLexicon = useWordAppLexicon();
  const wordAppWord = fromWordApp
    ? entry.word
    : wordAppLexicon
    ? findInLexicon(wordAppLexicon, entry.word)?.word
    : undefined;

  useEffect(() => {
    if (detail || fromWordApp) return;
    let active = true;
    fetchVocabDetail(entry.id).then((d) => {
      if (active) setDetail(d);
    });
    return () => {
      active = false;
    };
  }, [entry.id, detail, fromWordApp]);

  const ipa = entry.ipa?.replace(/^\/|\/$/g, '');

  return (
    <>
      {/* 머리 전체가 잡는 곳 — 단어 글자는 꾹 누르면 텍스트 선택이 먼저 가져가므로 선택 불가로 둔다 */}
      <GestureDetector gesture={headerGesture}>
        <View style={[styles.header, !maximized && webGrabCursor]}>
          {/* 읽기 묶음은 글자 쪽에만 — 머리 전체를 묶으면 iOS 에서 버튼에 초점이 가지 않는다 */}
          <View
            style={styles.headerText}
            accessible
            accessibilityLabel={[entry.word, entry.pos, entry.meaning].filter(Boolean).join(', ')}
          >
            <Text style={styles.word}>{entry.word}</Text>
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
          <View style={styles.headerActions}>
            <Pressable
              onPress={onToggleMaximize}
              hitSlop={6}
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel={maximized ? '원래 크기로' : '크게 보기'}
            >
              <Ionicons
                name={maximized ? 'contract-outline' : 'expand-outline'}
                size={17}
                color={Colors.text.secondary}
              />
            </Pressable>
            <Pressable
              onPress={onClose}
              hitSlop={6}
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <Ionicons name="close" size={18} color={Colors.text.secondary} />
            </Pressable>
          </View>
        </View>
      </GestureDetector>

      <Text style={[styles.meaning, wordAppWord && styles.meaningWithAction]} selectable>
        {entry.meaning}
      </Text>

      {wordAppWord && (
        <Pressable
          onPress={() => openInWordApp(wordAppWord)}
          hitSlop={4}
          style={({ pressed }) => [styles.wordAppButton, pressed && styles.headerButtonPressed]}
          accessibilityRole="link"
          accessibilityLabel="단어장 앱에서 자세히 보기"
        >
          <Ionicons name="book-outline" size={15} color={Colors.accent.primary} />
          <Text style={styles.wordAppButtonText}>단어장에서 자세히</Text>
          <Ionicons name="open-outline" size={13} color={Colors.accent.primary} />
        </Pressable>
      )}

      {detail === undefined && (
        <View style={styles.loading} accessibilityLabel="설명 불러오는 중">
          <SkeletonBlock style={[styles.skeletonLine, { width: '92%' }]} />
          <SkeletonBlock style={[styles.skeletonLine, { width: '78%' }]} />
          <SkeletonBlock style={[styles.skeletonLine, { width: '54%' }]} />
        </View>
      )}

      {detail?.status === 'ok' && (
        <Animated.View
          entering={FadeIn.duration(Motion.duration.base)}
          style={[styles.detail, maximized && styles.fill]}
        >
          <DetailScroll markdown={detail.markdown} fill={maximized} />
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

/**
 * 상세 설명 — 카드보다 길면 안에서 스크롤하고, 끝에 닿기 전까지 아래쪽을 옅게 흐려 더 있음을 알린다.
 * @param fill 카드를 펼쳤을 때 남은 높이를 모두 스크롤 영역으로 쓴다
 */
function DetailScroll({ markdown, fill = false }: { markdown: string; fill?: boolean }) {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const overflows = viewHeight > 0 && contentHeight > viewHeight + 1;

  return (
    <View style={[styles.detailScrollWrap, fill && styles.fill]}>
      <ScrollView
        style={[styles.detailScroll, fill && styles.fill]}
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

// 웹: 머리에 마우스를 올리면 잡을 수 있다는 커서 ('grab' 은 RN 스타일 타입에 없어 웹에서만 넘긴다).
// 끄는 동안의 'grabbing' 과 글자 선택 막기는 제스처 핸들러가 웹에서 직접 처리한다.
const webGrabCursor = Platform.OS === 'web' ? ({ cursor: 'grab' } as unknown as ViewStyle) : null;

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
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
  headerActions: {
    flexDirection: 'row',
    gap: 2,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    // 웹: 머리의 잡기 커서 위에서도 버튼은 손가락 커서
    cursor: 'pointer',
  },
  headerButtonPressed: {
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
  meaningWithAction: {
    paddingBottom: Spacing.sm,
  },
  // 단어장 앱에서 단어 상세 열기 — 뜻 아래 작은 링크 버튼
  wordAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    marginHorizontal: Spacing.base - Spacing.xs,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  wordAppButtonText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.accent.primary,
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
  // 펼친 카드의 남은 높이 채우기 — `flex: 1` 은 detailScroll 의 flexGrow: 0 과 섞이면
  // 기준 크기 0 에 늘어나지 않는 상태가 되어 본문이 사라지므로 개별 속성으로 덮어쓴다
  fill: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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
