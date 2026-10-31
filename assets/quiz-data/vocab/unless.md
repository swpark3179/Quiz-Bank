"**~가 아닌 한, ~하지 않으면**"이라는 조건을 거는 접속사로, *if ... not* 과 거의 같습니다. 기본은 앞 문장대로 하되 **예외 조건 하나만 따로 열어 두는** 구조라, 규칙·정책 문장에서 "원칙 + 예외"를 표현할 때 자주 나옵니다.

## 문제 속 쓰임
> ...add a PreToolUse hook on process_refund that denies the call **unless** a verified customer ID from get_customer has been recorded
> ...`get_customer` 에서 확인된 고객 ID 가 기록돼 있지 **않으면** 호출을 거부하는 PreToolUse 훅을 `process_refund` 에 추가한다

## 함께 쓰는 표현
- **A unless B** : B 가 아니면 A (기본은 A, 예외는 B)
- **unless otherwise specified** : 따로 명시하지 않는 한
- **unless explicitly configured** : 명시적으로 설정하지 않으면

## 비슷한 말
- **if ... not** — ~하지 않으면 (거의 같은 뜻)
- **except when** — ~인 경우를 빼고

## 시험 포인트
*deny ... unless* (기록이 없으면 거부) 구조는 **실행 전에 코드로 막는 선행 게이트**입니다. 프롬프트 지시는 실패율이 0 이 되지 않으므로, 돈·신원이 걸린 순서는 PreToolUse 훅으로 강제하는 것이 정답입니다.
