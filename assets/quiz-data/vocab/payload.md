요청·메시지에서 헤더 같은 부가 정보를 뺀 **실제로 실어 나르는 데이터 본문**입니다.

## 문제 속 쓰임
> Implement structured trace logging at each step: request **payload**, `stop_reason`, tool calls with inputs/outputs, and final response...
> 각 단계마다 구조화된 트레이스 로그를 남긴다: 요청 **페이로드**, `stop_reason`, 도구 호출의 입력/출력, 최종 응답...

## 함께 쓰는 표현
- **request / response payload** : 요청 / 응답 본문
- **JSON payload** : JSON 형식의 본문
- **webhook payload** : 웹훅으로 전달되는 데이터

## 시험 포인트
에이전트 버그를 재현하기 위한 최소한의 관측성은 단계별 **구조화된 트레이스**(요청 페이로드, `stop_reason`, 도구 입출력, 최종 응답 + 세션 상관 ID)입니다.
