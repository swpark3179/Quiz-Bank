사고에 쓸 토큰 수를 `budget_tokens` 로 미리 정하는 대신, **모델이 요청마다 사고할지와 얼마나 깊이 할지를 스스로 정하는** 방식입니다. 대략적인 깊이는 `output_config.effort` 로 조절합니다.

## 문제 속 쓰임
> Remove `budget_tokens`, use **adaptive thinking** (or omit `thinking`), and steer depth with `output_config.effort`.
> `budget_tokens`를 없애고 **적응형 사고**를 쓰거나 `thinking`을 생략한 뒤, `output_config.effort`로 사고 깊이를 조절한다.

## 함께 쓰는 표현
- **effort** : 들일 노력 수준 — 사고 깊이를 조절하는 설정
- **omit `thinking`** : `thinking` 필드를 아예 빼다

## 비슷한 말 · 반대말
- **extended thinking (`budget_tokens`)** — 사고 예산을 직접 정하던 이전 방식

## 시험 포인트
Claude 4.7 이후 모델(예: Opus 5.5)로 옮긴 뒤 `budget_tokens` 설정 때문에 400이 나면, 답은 **"`budget_tokens` 제거 → adaptive(또는 생략) + effort"** 입니다. 예산 숫자를 줄이거나 늘리는 보기는 모두 오답입니다.
