1. **(순서·위치가) ~보다 앞에** — *ahead of X in the array* 배열에서 X 앞에
2. **(시간상) ~에 앞서, 미리** — *ahead of time* 사전에, 미리

## 문제 속 쓰임
> The number of logs, services, and code paths to inspect cannot be known **ahead of** time.
> 살펴볼 로그, 서비스, 코드 경로의 수는 **미리** 알 수 없다.

> Move the new web tool **ahead of** analyze_content in the tools array so Claude considers it first
> 새 웹 도구를 `tools` 배열에서 `analyze_content` **앞으로** 옮겨 Claude가 먼저 고려하게 한다

## 함께 쓰는 표현
- **ahead of time** : 미리, 사전에
- **ahead of schedule** : 예정보다 일찍

## 시험 포인트
*cannot be known ahead of time* 은 하위 작업을 미리 정할 수 없다는 신호라, 발견에 따라 계획을 고치는 **오케스트레이터(적응형 분해)** 가 정답입니다. 반대로 도구를 배열에서 *ahead of* 로 옮기는 보기는 오답입니다. 배열 순서는 도구 선택 신호가 아닙니다.
