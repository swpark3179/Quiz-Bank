큰 작업·요청을 **처리할 수 있는 작은 단위로 쪼개는** 것입니다. 에이전트 설계에서는 코디네이터가 주제를 하위 작업으로 나누는 것을 *task decomposition* 이라고 합니다.

## 문제 속 쓰임
> **Decompose** the request into distinct concerns, then investigate each in parallel using shared customer context.
> 요청을 별개의 사안으로 **분해한** 뒤, 공유 고객 컨텍스트로 각각을 병렬 조사한다.

## 함께 쓰는 표현
- **decompose A into B** : A를 B들로 쪼개다
- **task decomposition** : 작업 분해
- **break down** : 같은 뜻의 쉬운 말

## 시험 포인트
하위 에이전트가 모두 성공했는데 결과가 일부 영역만 다룬다면, 코디네이터의 **분해가 너무 좁은 것**이 근본 원인입니다. 다만 분해만을 위해 별도 모델 호출 단계를 붙이는 보기는 과한 해법으로 오답이 되기도 합니다.
