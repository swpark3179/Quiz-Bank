요청에 대해 **돌아오는 답**입니다. API 에서는 모델이 돌려준 결과 전체(내용, `stop_reason`, 사용량 등)를 가리킵니다.

## 문제 속 쓰임
> Switch to a streaming **response** to detect completion earlier
> 스트리밍 **응답**으로 바꿔 완료를 더 빨리 감지한다.

## 함께 쓰는 표현
- **in response to** ~ : ~에 대한 응답으로, ~에 반응해
- **streaming response** : 생성되는 대로 조금씩 받는 응답
- **response time** : 응답 시간

## 시험 포인트
루프를 계속할지 끝낼지는 응답의 **텍스트가 아니라 `stop_reason` 필드**로 판단합니다(`tool_use` → 계속, `end_turn` → 종료). 스트리밍으로 바꾸는 것은 완료 판단과 무관합니다.
