고객이 주문은 그대로 두되 배송 지연 같은 작은 불편이 있었을 때, **전액 환불 대신 일부 금액만 보상으로 주는 크레딧**입니다. 문제에서는 *goodwill credit*(호의 차원의 보상)의 한 형태로 나옵니다.

## 문제 속 쓰임
> Add three few-shot **partial-credit** conversations to the system prompt and keep the single process_refund tool unchanged.
> **부분 크레딧** 대화 세 개를 few-shot 예시로 시스템 프롬프트에 넣고, 단일 `process_refund` 도구는 그대로 둔다.

## 함께 쓰는 표현
- **issue a partial credit** : 부분 크레딧을 지급하다
- **goodwill credit** : 호의 차원의 보상 크레딧
- **full refund** : 전액 환불

## 시험 포인트
한 도구가 전액 환불과 부분 크레딧을 뭉뚱그려 오용되면, few-shot 예시보다 **도구를 동작별로 나누고(또는 동작을 명시하는 파라미터를 두고) description 에 사용 경계를 적는** 보기가 정답입니다.
