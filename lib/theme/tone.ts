import { Colors } from './colors';

/**
 * 정답률 등급 — 앱 전체에서 같은 기준과 색을 쓴다.
 * 세 색은 밝기가 비슷하므로 색만으로 구분하지 말고 숫자·문구와 함께 표시한다.
 */
export type AccuracyToneKey = 'good' | 'fair' | 'low';

export interface AccuracyTone {
  key: AccuracyToneKey;
  label: string;
  /** 글자·아이콘·막대 색 */
  color: string;
  /** 옅은 배경 (배지·칩) */
  bg: string;
  /** NordBadge variant */
  badge: 'success' | 'warning' | 'error';
}

const TONES: Record<AccuracyToneKey, AccuracyTone> = {
  good: { key: 'good', label: '좋음', color: Colors.status.correct, bg: Colors.status.correctBg, badge: 'success' },
  fair: { key: 'fair', label: '보통', color: Colors.status.warning, bg: Colors.status.warningBg, badge: 'warning' },
  low: { key: 'low', label: '부족', color: Colors.status.wrong, bg: Colors.status.wrongBg, badge: 'error' },
};

/** @param pct 정답률 (0–100) */
export function accuracyTone(pct: number): AccuracyTone {
  if (pct >= 80) return TONES.good;
  if (pct >= 60) return TONES.fair;
  return TONES.low;
}
