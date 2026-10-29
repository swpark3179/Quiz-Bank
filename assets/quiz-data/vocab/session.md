대화나 작업이 **시작부터 끝까지 이어지는 한 단위**입니다. Claude Code 에서는 하나의 대화 기록(컨텍스트)을 공유하는 작업 단위를 말합니다.

## 문제 속 쓰임
> Production logs show that in 11% of **sessions** the loop terminates while a tool_use block is still pending...
> 운영 로그를 보면 **세션**의 11%에서 `tool_use` 블록이 아직 처리되지 않은 상태로 루프가 종료되어

## 함께 쓰는 표현
- **resume / fork a session** : 세션을 재개하다 / 갈라 새로 만들다
- **start a fresh session** : 새 세션을 시작하다
- **session correlation ID** : 한 세션의 로그를 묶는 추적 ID

## 시험 포인트
세션 문제에서는 **같은 세션이냐, 새 세션이냐**가 갈림길입니다. 낡은 도구 결과가 문제면 새 세션 + 요약 주입, 리뷰라면 생성과 다른 독립 세션이 정답 쪽입니다.
