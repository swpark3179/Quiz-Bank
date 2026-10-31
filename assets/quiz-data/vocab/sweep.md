빗자루로 쓸듯 **범위 전체를 빠짐없이 한 번 쭉 훑는 작업**입니다. 실험에서는 설정 값을 여러 단계로 바꿔 가며 모두 돌려 보는 것도 *sweep* 이라 합니다.

## 문제 속 쓰임
> What should happen to this discovery **sweep**?
> 이 **탐색**(전체 훑기) 작업은 어떻게 처리해야 합니까?

> Claude Opus 5.5 at xhigh effort, confirmed by an effort **sweep** on evals, ...
> 평가 기반 effort **스윕**으로 확인한 xhigh effort 의 Claude Opus 5.5...

## 함께 쓰는 표현
- **discovery sweep** : (코드베이스 등) 전체 탐색
- **effort sweep** : effort 수준을 바꿔 가며 평가해 보는 것
- **sweep through** ~ : ~을 쭉 훑다

## 시험 포인트
수백 개 파일을 훑는 *sweep* 은 메인 세션에서 하지 말고 **Explore 서브에이전트**에 맡겨, 자기 컨텍스트에서 읽고 요약만 돌려받게 합니다. effort 는 이전 모델 설정을 옮기지 말고 **자체 평가로 스윕**해 정합니다.
