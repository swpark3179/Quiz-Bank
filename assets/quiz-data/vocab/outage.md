서비스·시스템이 **잠시 멈춰 쓸 수 없는 상태**입니다. 데이터가 "없는" 것이 아니라 "닿지 않는" 상황이라는 점이 중요합니다.

## 문제 속 쓰임
> Real accounts are being turned away during transient **outages**.
> 일시적인 **장애** 동안 실제 계정이 있는 고객들이 돌려보내지고 있다.

## 함께 쓰는 표현
- **transient / partial outage** : 일시적 / 부분 장애
- **service outage** : 서비스 장애

## 비슷한 말
- **downtime** — 서비스가 멈춰 있는 시간

## 시험 포인트
장애 때 도구가 **빈 결과**를 돌려주면 에이전트는 "결과 없음"으로 오해합니다. `errorCategory`(예: transient)·`isRetryable` 을 담은 **구조화된 오류**로 접근 실패와 빈 결과를 구분하는 보기가 정답입니다.
