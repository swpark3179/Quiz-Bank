import { accuracyTone } from '../../../lib/theme/tone';
import { Colors } from '../../../lib/theme/colors';

describe('accuracyTone', () => {
  it('80% 이상은 좋음', () => {
    expect(accuracyTone(80).key).toBe('good');
    expect(accuracyTone(100).badge).toBe('success');
  });

  it('60–79%는 보통', () => {
    expect(accuracyTone(60).key).toBe('fair');
    expect(accuracyTone(79).key).toBe('fair');
    expect(accuracyTone(72).color).toBe(Colors.status.warning);
  });

  it('60% 미만은 부족', () => {
    expect(accuracyTone(59).key).toBe('low');
    expect(accuracyTone(0).badge).toBe('error');
  });

  it('등급마다 문구와 배경색이 있다', () => {
    for (const pct of [95, 70, 30]) {
      const tone = accuracyTone(pct);
      expect(tone.label).toBeTruthy();
      expect(tone.bg).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});
