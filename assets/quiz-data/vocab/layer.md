겹겹이 쌓인 것 가운데 **한 층**입니다. 소프트웨어에서는 특정 역할을 맡은 **계층**(예: 데이터 접근 계층, 변환 계층)을 말합니다.

## 문제 속 쓰임
> Production runs show the final plan omits an entire 'dunning' subsystem and a currency-conversion **layer** that no subagent was ever assigned.
> 운영 실행 결과를 보면 최종 계획에서, 어떤 서브에이전트에도 배정되지 않았던 'dunning'(연체 독촉) 하위 시스템 전체와 통화 변환 **계층**이 빠져 있다.

## 함께 쓰는 표현
- **abstraction layer** : 추상화 계층
- **add a layer of** ~ : ~을 한 겹 더하다
- **layered** (형) 여러 층으로 된

## 시험 포인트
구조를 미리 알 수 없는 코드베이스에서 사람이 정한 고정 분할은 이런 **빠진 계층**을 남깁니다. 실제 모듈을 먼저 훑은 뒤 발견한 구성 요소마다 서브에이전트를 **동적으로** 띄우는 것이 정답입니다.
