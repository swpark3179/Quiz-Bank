1. **(형) 새로운, 전에 없던** — 기존 범주·목록에 없던 처음 보는 것
2. **(명) 소설** — 일상어에서는 이 뜻이 더 흔합니다

## 문제 속 쓰임
> Add an "other" value to the enum plus an optional document_type_detail string so **novel** types are captured instead of misclassified.
> enum에 `"other"` 값과 선택적 `document_type_detail` 문자열을 추가해, **새로운** 유형이 잘못 분류되지 않고 포착되게 한다

## 함께 쓰는 표현
- **novel case / input** : 처음 보는 사례 / 입력
- **novelty** (명) 새로움

## 시험 포인트
enum 밖의 **새로운 유형**이 들어오면 enum 을 없애거나 모든 유형을 나열하지 말고, `"other"` 값과 상세 문자열 필드로 받아 내는 보기가 정답입니다.
