/**
 * 단어 뜻 팝업의 위치·크기 계산 — RN 의존성 없는 순수 함수 (테스트용으로 분리)
 */

export interface Insets {
  top: number;
  bottom: number;
}

export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 드래그로 옮길 수 있는 translate 범위 */
export interface DragBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * 카드가 safe area 안(가장자리 여백 포함)에 머무르는 translate 범위.
 * 카드가 이미 범위를 넘을 만큼 크면 그 축은 움직이지 않도록 0 을 항상 포함시킨다.
 * @param frame transform 적용 전 카드 프레임 (onLayout 값)
 */
export function dragBounds({
  frame,
  screenW,
  screenH,
  insets,
  edge,
}: {
  frame: Frame;
  screenW: number;
  screenH: number;
  insets: Insets;
  edge: number;
}): DragBounds {
  const minX = edge - frame.x;
  const maxX = screenW - edge - (frame.x + frame.width);
  const minY = insets.top + edge - frame.y;
  const maxY = screenH - insets.bottom - edge - (frame.y + frame.height);
  return {
    minX: Math.min(minX, 0),
    maxX: Math.max(maxX, 0),
    minY: Math.min(minY, 0),
    maxY: Math.max(maxY, 0),
  };
}

/** 오프셋을 범위 안으로 */
export function clampOffset(
  offset: { x: number; y: number },
  bounds: DragBounds
): { x: number; y: number } {
  return {
    x: clamp(offset.x, bounds.minX, bounds.maxX),
    y: clamp(offset.y, bounds.minY, bounds.maxY),
  };
}

/**
 * 최대화한 카드 프레임 — 높이는 safe area 를 가득 채우고, 너비는 maxWidth 까지 가운데 정렬
 * (데스크탑처럼 넓은 화면에서 한 줄이 지나치게 길어지지 않게)
 */
export function maximizedFrame({
  screenW,
  screenH,
  insets,
  edge,
  maxWidth,
}: {
  screenW: number;
  screenH: number;
  insets: Insets;
  edge: number;
  maxWidth: number;
}): { left: number; top: number; width: number; height: number } {
  const width = Math.max(0, Math.min(screenW - edge * 2, maxWidth));
  const top = insets.top + edge;
  const height = Math.max(0, screenH - insets.bottom - edge - top);
  return { left: (screenW - width) / 2, top, width, height };
}
