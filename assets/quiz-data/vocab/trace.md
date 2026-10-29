1. **추적 기록, 트레이스** — 요청이 시스템을 지나며 거친 단계(호출, 입력·출력)를 차례로 남긴 기록
2. **추적하다, 따라가 보다** — *tracing* 은 실행 흐름을 기록하며 따라가는 것

## 문제 속 쓰임
> Implement structured **trace** logging at each step: request payload, `stop_reason`, tool calls with inputs/outputs, and final response
> 각 단계마다 구조화된 **트레이스** 로그를 남긴다: 요청 페이로드, `stop_reason`, 도구 호출의 입력/출력, 최종 응답
> **Tracing** shows the Task prompt sent to the synthesis subagent contains only the report topic and formatting instructions.
> **추적해 보니** 합성 서브에이전트에 보내는 Task 프롬프트에는 보고서 주제와 형식 지시만 들어 있다.

## 함께 쓰는 표현
- **trace logging** : 트레이스 로깅
- **trace back to** ~ : ~까지 거슬러 올라가 원인을 찾다
- **correlation ID** : 한 세션·요청의 로그를 묶어 주는 식별자

## 시험 포인트
에이전트가 왜 그렇게 행동했는지 진단하려면 단계별 **구조화된 트레이스**(상관 ID 포함)가 정답입니다.
