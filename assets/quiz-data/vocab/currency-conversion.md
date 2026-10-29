금액을 **한 통화에서 다른 통화로 바꿔 계산하는** 것(환전, 환율 적용)입니다. 하이픈으로 묶이면 뒤 명사를 꾸며 "통화 변환을 맡는 ~"이 됩니다.

## 문제 속 쓰임
> Production runs show the final plan omits an entire 'dunning' subsystem and a **currency-conversion** layer that no subagent was ever assigned.
> 운영 실행 결과를 보면 최종 계획에서, 어떤 서브에이전트에도 배정되지 않았던 'dunning'(연체 독촉) 하위 시스템 전체와 **통화 변환** 계층이 빠져 있습니다.

## 함께 쓰는 표현
- **exchange rate** : 환율
- **convert currency** : 통화를 변환하다

## 시험 포인트
미리 정해 둔 분할 목록에서 이런 하위 시스템이 통째로 빠진다면, **먼저 실제 모듈을 매핑하고 발견된 구성 요소 기준으로 동적 분할**하는 것이 정답입니다.
