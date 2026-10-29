청구(billing) 업무 용어로, 대금이 **연체된 고객에게 결제를 독촉하는** 절차입니다. 독촉 메일, 결제 재시도, 서비스 정지 같은 단계가 포함됩니다.

## 문제 속 쓰임
> Production runs show the final plan omits an entire '**dunning**' subsystem and a currency-conversion layer that no subagent was ever assigned.
> 운영 실행 결과를 보면 최종 계획에서, 어떤 서브에이전트에도 배정되지 않았던 '**dunning**'(연체 독촉) 하위 시스템 전체와 통화 변환 계층이 빠져 있다.

## 함께 쓰는 표현
- **dunning email / notice** : 결제 독촉 메일·통지
- **dunning process** : 연체 독촉 절차

## 시험 포인트
작업 분할을 **미리 하드코딩**하면 예상하지 못한 하위 시스템(여기서는 dunning)이 통째로 빠집니다. 먼저 실제 모듈을 훑어본 뒤 **동적으로 나누는** 보기가 정답입니다.
