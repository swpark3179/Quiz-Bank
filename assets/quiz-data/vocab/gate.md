조건을 통과해야만 **다음 단계로 넘어가게** 하는 확인 지점입니다. 테스트·리뷰·승인 같은 관문을 두어 진행을 통제하는 것을 *gating* 이라고 합니다.

## 문제 속 쓰임
> Add explicit verification **gates** between steps requiring the agent to checkpoint after resolving each concern.
> 단계 사이에 명시적인 검증 **게이트**를 두어, 에이전트가 우려 사항 하나를 해결할 때마다 체크포인트를 거치게 한다.

## 함께 쓰는 표현
- **quality gate** : 품질 기준을 넘어야 통과하는 관문
- **approval gate** : 승인을 받아야 넘어가는 관문
- **gated on** ~ : ~이 충족돼야 허용되는

## 시험 포인트
반드시 지켜야 할 **순서를 강제**할 때는 관문이 유용하지만, 비효율의 원인이 순차 처리라면 단계마다 게이트를 더하는 선택지는 호출 수와 지연만 늘려 오답이 되기 쉽습니다.
