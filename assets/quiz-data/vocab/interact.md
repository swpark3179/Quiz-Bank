둘 이상이 **서로 영향을 주고받는** 것입니다. *interacting changes* 는 따로 떼어 처리하면 서로 어긋나는, **얽혀 있는 변경**을 말합니다.

## 문제 속 쓰임
> Batch the three **interacting** changes into a single message so Claude edits the enum and all dependent switch sites together
> 서로 **얽힌** 세 변경을 하나의 메시지로 묶어, Claude가 enum과 이에 의존하는 모든 switch 지점을 함께 수정하게 한다

## 함께 쓰는 표현
- **interact with** ~ : ~와 상호 작용하다
- **interaction** (명) 상호 작용, 주고받기

## 시험 포인트
같은 코드를 건드리는 **상호작용하는 변경**은 한 메시지에 묶어 함께 처리하는 것이 정답입니다. 서로 **독립적인** 작업이라면 반대로 나누거나 병렬로 처리합니다.
