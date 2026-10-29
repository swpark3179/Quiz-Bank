설정(configuration)이 **잘못되어 있는** 상태입니다. 코드 자체보다 **설정값·옵션을 틀리게 준 것**이 원인이라는 뜻입니다.

## 문제 속 쓰임
> The schema is **misconfigured**; adding "additionalProperties": false will force the line-item amounts to reconcile with the stated invoice total.
> 스키마 **설정이 잘못된** 것이며, `"additionalProperties": false` 를 추가하면 품목 금액이 명시된 인보이스 총액과 맞도록 강제된다

## 함께 쓰는 표현
- **misconfiguration** (명) 잘못된 설정, 설정 오류
- **misconfigured server / permission** : 설정이 잘못된 서버 / 권한

## 시험 포인트
이 보기는 오답입니다. 스키마는 **구문·타입**만 보장하고 값끼리 맞는지(의미)는 보장하지 못하므로, 합계 불일치에는 별도의 **산술 검사 단계**가 필요합니다.
