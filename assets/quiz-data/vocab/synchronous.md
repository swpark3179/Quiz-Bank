요청을 보내고 **결과가 올 때까지 기다린 뒤** 다음 단계로 넘어가는 방식입니다. 응답이 바로 필요한 작업에 맞습니다.

## 문제 속 쓰임
> Use **synchronous** calls for PR style checks; use the Message Batches API for weekly security audits and nightly test generation.
> PR 스타일 검사는 **동기** 호출로, 주간 보안 감사와 야간 테스트 생성은 Message Batches API로 처리한다.

## 함께 쓰는 표현
- **synchronous call / request** : 동기 호출 / 요청
- **synchronously** (부) 동기적으로

## 반대말
- **asynchronous** (async) — 비동기의: 요청만 보내 두고 결과는 나중에 받는

## 시험 포인트
기준은 **지연을 견딜 수 있느냐** 입니다. 머지를 막아 사람이 결과를 기다리는 작업은 동기 호출, 야간·주간처럼 늦어도 되는 작업은 Message Batches API(최대 24시간, 50% 절감)로 보냅니다.
