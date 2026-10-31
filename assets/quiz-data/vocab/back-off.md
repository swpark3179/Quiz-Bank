원래는 '한발 물러서다'라는 뜻이고, API 문맥에서는 실패 뒤 **바로 다시 보내지 않고 기다리는 간격을 점점 늘리는 것**을 말합니다. 명사 *backoff* 는 *exponential backoff*(지수 백오프)처럼 씁니다.

## 문제 속 쓰임
> Wait at least the retry-after interval before resending, and **back off** further if 429s repeat.
> 다시 보내기 전에 최소한 retry-after 시간만큼 기다리고, 429가 반복되면 더 **물러난다**(간격을 늘린다).

## 함께 쓰는 표현
- **exponential backoff** : 지수 백오프 (대기 시간을 점점 두 배씩 늘림)
- **back off and retry** : 물러섰다가 다시 시도하다

## 비슷한 말 · 반대말
- **retry in a tight loop** — 기다리지 않고 즉시 반복 재시도 (한도 문제를 악화)

## 시험 포인트
429에 `retry-after` 가 있으면 최소 그 시간만큼 기다리고, 반복되면 더 *back off* 하는 것이 정답입니다. 다만 `retry-after` 없이 `enforced_spend_limit_reached` 가 오는 429는 등급 지출 상한이라 재시도로 풀리지 않으므로, 등급을 올리거나 접근이 재개될 때까지 기다립니다.
