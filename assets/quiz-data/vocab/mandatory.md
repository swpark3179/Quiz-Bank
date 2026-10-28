선택이 아니라 **반드시 해야 하는** 것입니다. 규정이나 절차에서 *빠뜨리면 안 되는 단계*를 말할 때 씁니다.

## 문제 속 쓰임
> Enhance the system prompt to state that customer verification via `get_customer` is **mandatory** before any order operations.
> 주문 작업 전에는 `get_customer` 로 고객을 확인하는 것이 **필수**라고 시스템 프롬프트에 명시한다.

## 함께 쓰는 표현
- **mandatory step / field** : 필수 단계 / 필수 입력 항목
- **make ~ mandatory** : ~을 의무화하다

## 비슷한 말 · 반대말
- **required**, **compulsory** — 필수의, 의무적인
- **optional** — 선택적인

## 시험 포인트
프롬프트에 "**필수**"라고 적는 것만으로는 모델이 가끔 어길 수 있습니다. 순서가 반드시 지켜져야 한다면, 앞 단계가 끝나기 전에는 다음 도구 호출을 **프로그램으로 막는** 선택지가 정답 쪽입니다.
