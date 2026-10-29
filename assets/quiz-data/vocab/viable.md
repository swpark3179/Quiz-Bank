**실제로 될 만한, 제 역할을 할 수 있는** 것입니다. *minimum viable* 은 "꼭 필요한 것만 갖춘 최소한의"라는 뜻으로 자주 쓰입니다.

## 문제 속 쓰임
> What is the minimum **viable** observability implementation?
> **최소한으로 필요한(minimum viable)** 관측성 구현은?

## 함께 쓰는 표현
- **minimum viable product (MVP)** : 최소 기능 제품
- **viable option / alternative** : 현실성 있는 선택지·대안
- **viability** (명) 실행 가능성

## 시험 포인트
관측성의 "최소한"은 로그 몇 줄이 아니라, 단계마다 **요청 내용·`stop_reason`·도구 호출 입출력·최종 응답**을 세션 상관 ID 와 함께 남기는 **구조화된 추적 로그**입니다.
