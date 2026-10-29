**Apache Kafka** — 서비스들이 **이벤트(메시지)를 발행하고 구독하며** 주고받게 해 주는 분산 이벤트 스트리밍 플랫폼입니다. 마이크로서비스가 많으면 "어떤 서비스가 어떤 이벤트를 내보내는지"가 여기저기 흩어져 추적하기 어렵습니다.

## 문제 속 쓰임
> An engineer asks the tool to determine which of 30 services emits a particular **Kafka** event.
> 한 엔지니어가 도구에게 30개 서비스 중 어느 서비스가 특정 **Kafka** 이벤트를 발행하는지 알아내 달라고 요청한다.

## 함께 쓰는 표현
- **Kafka topic** : 카프카 토픽 — 이벤트가 쌓이는 이름 붙은 채널
- **emit / publish an event** : 이벤트를 발행하다
- **producer / consumer** : 발행하는 쪽 / 받아 처리하는 쪽
