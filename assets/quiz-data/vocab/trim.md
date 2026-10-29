불필요한 부분을 **잘라 내서 깔끔하게 다듬는** 것입니다. 문제에서는 도구 출력·결과를 **넘기기 전에 필요한 부분만 남기는** 것을 말합니다.

## 문제 속 쓰임
> **Trim** each run's output to the failing-test lines before it accumulates, and keep the key constraints in a summary at the top of the context.
> 각 실행의 출력이 쌓이기 전에 실패한 테스트 관련 줄만 남도록 **잘라 내고**, 핵심 제약 조건은 컨텍스트 맨 앞의 요약에 유지한다

## 함께 쓰는 표현
- **trim A to B** : A를 B만 남게 줄이다
- **trim down** : 줄이다, 덜어 내다
- **untrimmed** (형) 잘라 내지 않은, 원본 그대로의

## 시험 포인트
장황한 출력 때문에 중요한 정보를 놓친다면 더 큰 컨텍스트 창이 아니라 "**쌓이기 전에 trim + 핵심은 앞쪽 요약에 고정**"이 정답 패턴입니다.
