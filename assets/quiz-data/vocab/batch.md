1. **묶음, 일괄 처리 단위** — 여러 요청을 모아 한꺼번에 처리하는 것. *Message Batches API* 는 많은 요청을 비동기로, 더 싸게 처리합니다
2. **한데 묶다** — 여러 변경·요청을 하나로 모아 보내다

## 문제 속 쓰임
> **Batch** the three interacting changes into a single message so Claude edits the enum and all dependent switch sites together
> 서로 얽힌 세 변경을 하나의 메시지로 **묶어**, Claude가 enum과 이에 의존하는 모든 switch 지점을 함께 수정하게 한다

## 함께 쓰는 표현
- **batch processing** : 일괄 처리
- **in batches** : 여러 묶음으로 나눠서
- **batch job** : 일괄 작업

## 시험 포인트
서로 영향을 주는 변경은 **한 메시지로 묶고**, 독립적인 변경은 순차로 처리합니다. Batch API 는 지연을 견딜 수 있는 대량 작업용이며, 결과는 **`custom_id`** 로 맞춥니다.
