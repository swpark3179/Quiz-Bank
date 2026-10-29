Claude Code·Agent SDK 의 훅 이벤트 중 하나로, **도구가 실행되기 직전에** 호출됩니다. 호출 내용을 검사해 **허용·차단하거나 입력을 고칠** 수 있어, 반드시 지켜야 할 규칙을 코드로 강제할 때 씁니다.

## 문제 속 쓰임
> Add a **PreToolUse** hook on process_refund that blocks any amount over $500 and redirects the flow to escalate_to_human.
> `process_refund` 에 **PreToolUse** 훅을 추가해 $500 초과 금액을 차단하고 흐름을 `escalate_to_human` 으로 돌린다.

## 함께 쓰는 표현
- **PreToolUse hook** : 도구 실행 전 훅
- **block a tool call** : 도구 호출을 차단하다
- **matcher** : 훅을 적용할 도구를 고르는 조건

## 비교
- **PreToolUse** — 실행 *전*: 차단, 정책 강제, 입력 수정
- **PostToolUse** — 실행 *후*: 출력 변환, 정규화

## 시험 포인트
'반드시', '절대', '보장' 이 금액 한도·금지 명령과 함께 나오면 프롬프트가 아니라 **PreToolUse 훅 같은 결정적 강제**가 정답입니다. 다만 모든 세션의 모든 `Edit` 을 검사하는 **전역 훅**처럼 범위가 문제보다 넓으면 오답이 됩니다.
