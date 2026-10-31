잠깐 나타났다 사라지는 **사소하고 일시적인 오작동**입니다. 원인이 구조적이지 않고 우연히 생긴 것이라 다시 하면 대개 괜찮아진다는 뉘앙스가 담겨 있습니다.

## 문제 속 쓰임
> Claude produces the full answer, because an empty response is a one-off sampling **glitch**.
> Claude가 완전한 답을 낸다. 빈 응답은 일회성 샘플링 **오류**이기 때문이다.

## 함께 쓰는 표현
- **one-off glitch** : 한 번뿐인 오류
- **transient glitch** : 일시적 문제

## 비슷한 말 · 반대말
- **transient error** — 재시도하면 사라지는 일시적 오류
- **systematic error** — 구조적·반복적 오류

## 시험 포인트
도구 결과 뒤의 빈 `end_turn` 을 *glitch* 로 보는 보기는 오답입니다. 이미 끝났다고 판단된 턴을 그대로 다시 보내면 또 비므로, 원인(대개 `tool_result` 뒤의 텍스트 블록)을 고쳐야 합니다.
