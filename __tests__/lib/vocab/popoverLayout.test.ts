import {
  clamp,
  clampOffset,
  dragBounds,
  maximizedFrame,
} from '../../../lib/vocab/popoverLayout';

const screen = { screenW: 400, screenH: 800, insets: { top: 40, bottom: 20 }, edge: 16 };

describe('clamp', () => {
  it('범위 안으로 자른다', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it('min 이 max 보다 크면 min 을 돌려준다', () => {
    expect(clamp(5, 10, 0)).toBe(10);
  });
});

describe('dragBounds', () => {
  it('카드가 safe area 와 가장자리 여백 안에 머무는 범위를 구한다', () => {
    const bounds = dragBounds({ ...screen, frame: { x: 20, y: 300, width: 360, height: 200 } });
    expect(bounds).toEqual({
      minX: 16 - 20, // 왼쪽 여백까지
      maxX: 400 - 16 - 380, // 오른쪽 여백까지
      minY: 40 + 16 - 300, // 위쪽 inset + 여백까지
      maxY: 800 - 20 - 16 - 500, // 아래쪽 inset + 여백까지
    });
  });

  it('카드가 영역보다 커도 제자리(0)는 항상 허용한다', () => {
    const bounds = dragBounds({ ...screen, frame: { x: 8, y: 30, width: 390, height: 780 } });
    expect(bounds.minX).toBeLessThanOrEqual(0);
    expect(bounds.maxX).toBeGreaterThanOrEqual(0);
    expect(bounds.minY).toBeLessThanOrEqual(0);
    expect(bounds.maxY).toBeGreaterThanOrEqual(0);
    expect(clampOffset({ x: 0, y: 0 }, bounds)).toEqual({ x: 0, y: 0 });
  });
});

describe('clampOffset', () => {
  it('각 축을 따로 범위 안으로 자른다', () => {
    const bounds = { minX: -10, maxX: 20, minY: -100, maxY: 50 };
    expect(clampOffset({ x: 99, y: -999 }, bounds)).toEqual({ x: 20, y: -100 });
    expect(clampOffset({ x: 5, y: 7 }, bounds)).toEqual({ x: 5, y: 7 });
  });
});

describe('maximizedFrame', () => {
  it('폰 화면에서는 여백을 뺀 전체 너비·높이를 채운다', () => {
    expect(maximizedFrame({ ...screen, maxWidth: 720 })).toEqual({
      left: 16,
      top: 56,
      width: 368,
      height: 800 - 20 - 16 - 56,
    });
  });

  it('넓은 화면에서는 maxWidth 로 줄이고 가운데에 둔다', () => {
    const frame = maximizedFrame({
      screenW: 1280,
      screenH: 800,
      insets: { top: 0, bottom: 0 },
      edge: 16,
      maxWidth: 720,
    });
    expect(frame.width).toBe(720);
    expect(frame.left).toBe((1280 - 720) / 2);
    expect(frame.top).toBe(16);
    expect(frame.height).toBe(800 - 32);
  });
});
