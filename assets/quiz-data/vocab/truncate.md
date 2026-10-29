정해진 길이에 맞추려고 **뒷부분을 잘라 내는** 것입니다. 출력 한도에 걸려 응답이 **중간에 끊기는** 상황에 자주 씁니다.

## 문제 속 쓰임
> The `max_tokens` limit is too low, **truncating** the tool call
> `max_tokens` 한도가 너무 낮아 도구 호출이 **잘린다**

## 함께 쓰는 표현
- **truncated output / response** : 잘린 출력 / 응답
- **truncation** (명) 잘림, 절단

## 비교
- **truncate** — 길이 제한 때문에 뒤를 잘라 냄 (정보 손실)
- **summarize** — 내용을 줄이되 핵심은 남김

## 시험 포인트
응답이 `max_tokens` 때문에 잘리면 `stop_reason` 이 `"max_tokens"` 로 옵니다. 증상이 정말 잘림인지 `stop_reason` 으로 먼저 확인하는 것이 진단의 기본입니다.
