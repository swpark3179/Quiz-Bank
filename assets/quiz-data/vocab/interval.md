두 일 **사이에 비는 시간**(또는 거리)입니다. 반복 작업에서는 한 번 실행하고 다음 실행까지 기다리는 시간을 말합니다.

## 문제 속 쓰임
> Shorten the **interval** between summarization passes so each pass condenses fewer new messages into the running summary
> 요약 **간격**을 줄여, 한 번에 누적 요약으로 압축하는 새 메시지 수를 줄인다

## 함께 쓰는 표현
- **retry-after interval** : `retry-after` 헤더가 알려 준 대기 시간
- **polling interval** : 폴링(주기적 확인) 주기
- **at regular intervals** : 일정한 간격으로

## 비슷한 말 · 반대말
- **frequency** — 빈도. 간격이 짧을수록 빈도는 높아집니다

## 시험 포인트
요약 간격을 줄이면 재압축 횟수가 늘어 주문번호·금액이 더 빨리 흐려지므로 **오답**이고, 핵심 값을 구조화된 기록으로 따로 싣는 것이 정답이었습니다. 429 문제에서는 *retry-after interval* 이상 기다리고 반복되면 더 물러나는 보기가 정답입니다.
