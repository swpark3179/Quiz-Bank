1. **크레딧, 적립금** — 환불 대신 다음 결제에 쓰도록 주는 금액 (*goodwill credit*: 호의로 주는 보상 크레딧)
2. **(회계) 대변** — *credit memo* 는 금액을 차감·환급해 주는 전표(대변 메모)
3. **공로, 인정** — *give credit*: 공을 인정하다

## 문제 속 쓰임
> process_refund handles both full order refunds and small partial goodwill **credits**.
> `process_refund` 는 주문 전액 환불과 소액 부분 호의 **크레딧**(goodwill credit)을 모두 처리합니다.

## 함께 쓰는 표현
- **partial credit** : 부분 크레딧 (일부 금액만 보상)
- **store credit** : 매장(계정)에서 쓸 수 있는 적립금

## 시험 포인트
한 도구가 전액 환불과 부분 크레딧처럼 **다른 동작을 뭉뚱그리면** 오용이 생깁니다. `process_full_refund` / `process_partial_credit` 처럼 도구를 나누고 설명에 사용 경계를 적는 것이 정답입니다.
