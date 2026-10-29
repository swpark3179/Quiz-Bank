결제·환불을 처리하기 전에 **부정 거래인지 확인하는** 단계입니다. 하이픈으로 묶어 *fraud-check prerequisite*(사기 검사 선행 조건)처럼 다른 명사 앞에서 꾸미는 말로 씁니다.

## 문제 속 쓰임
> ...add PreToolCall hook enforcing **fraud-check** prerequisite before payment writes
> 결제 쓰기 전에 **사기 검사** 선행을 강제하는 PreToolCall 훅을 추가한다

## 함께 쓰는 표현
- **fraud-check prerequisite** : 사기 검사 선행 조건
- **run a fraud check** : 사기 검사를 실행하다

## 시험 포인트
도구가 너무 많아 엉뚱한 도구를 고르고 **필수 확인 단계를 건너뛴다면**, 전문 서브에이전트로 나누고(허브 앤 스포크) **훅으로 선행 조건(사기 검사 → 결제)을 강제**하는 보기가 정답입니다. Claude Code·Agent SDK 의 실제 훅 이름은 `PreToolUse` 입니다.
