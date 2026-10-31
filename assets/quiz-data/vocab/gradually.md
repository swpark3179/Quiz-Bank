한꺼번에가 아니라 **조금씩 단계적으로** 바뀌는 것을 말합니다. 배포·트래픽 문맥에서는 급격한 변화를 피해 천천히 늘리거나 옮긴다는 뜻으로 씁니다.

## 문제 속 쓰임
> Shift traffic from the old version to the new one **gradually**, keeping both running side by side.
> 기존 버전과 새 버전을 함께 실행해 두고, 트래픽을 기존 버전에서 새 버전으로 **점진적으로** 옮긴다.

## 함께 쓰는 표현
- **ramp up gradually** : 서서히 늘리다
- **gradual rollout** : 점진적 배포

## 비슷한 말 · 반대말
- **incrementally / step by step** — 조금씩, 단계적으로
- **all at once / abruptly** — 한꺼번에 / 갑자기

## 시험 포인트
몇 시간씩 도는 상태 저장 에이전트에 새 코드를 배포할 때는 두 버전을 나란히 돌리며 트래픽을 *gradually* 옮기는 **레인보우 배포**가 정답입니다. 공개 한도 아래인데 급증 직후 429가 나면 가속 한도이므로, 이때도 트래픽을 서서히 늘립니다.
