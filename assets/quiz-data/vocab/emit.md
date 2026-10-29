기계·프로그램이 출력·신호·이벤트를 **내보내다, 생성해 내다** 라는 뜻입니다. LLM 문맥에서는 모델이 텍스트·도구 호출을 **응답으로 내놓는 것**을 말합니다.

## 문제 속 쓰임
> **Emit** all three Task calls together in a single assistant response so the regional subagents run concurrently
> 세 Task 호출을 하나의 어시스턴트 응답에 함께 **내보내**, 지역별 서브에이전트가 동시에 실행되게 한다

## 함께 쓰는 표현
- **emit an event / a log** : 이벤트·로그를 내보내다
- **emit a tool call** : (모델이) 도구 호출을 내놓다

## 비슷한 말
- **output**, **produce**, **generate** — 만들어 내다

## 시험 포인트
서로 독립적인 서브에이전트들은 Task 호출을 **한 응답에 함께 내보내면** 병렬로 실행됩니다. 하나씩 결과를 기다렸다가 보내면 지연 시간이 그대로 합산됩니다.
