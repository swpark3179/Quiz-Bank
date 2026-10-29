큰 시스템 안에서 **한 가지 기능을 따로 맡은 부분**입니다. 레거시 모놀리스를 나눌 때 각 영역(청구, 세금, 인증 등)을 이렇게 부릅니다.

## 문제 속 쓰임
> Production runs show the final plan omits an entire 'dunning' **subsystem** and a currency-conversion layer that no subagent was ever assigned.
> 최종 계획에서, 어떤 서브에이전트에도 배정되지 않았던 'dunning'(연체 독촉) **하위 시스템** 전체와 통화 변환 계층이 빠져 있다.

## 함께 쓰는 표현
- **subsystem / module / component** : 하위 시스템 / 모듈 / 구성 요소 (비슷한 단위)
- **layer** : 계층 — 위아래로 쌓인 단위

## 시험 포인트
분할을 처음부터 하드코딩하면 목록에 없던 하위 시스템이 통째로 빠집니다. 구조를 모르는 코드베이스는 **먼저 매핑해서 실제 모듈을 찾고**, 발견된 단위마다 서브에이전트를 동적으로 띄우는 것이 정답입니다.
