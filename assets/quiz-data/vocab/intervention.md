저절로 진행되던 일에 **다른 주체가 끼어들어** 처리하거나 조정하는 것입니다. 사람뿐 아니라 시스템 안의 상위 에이전트(코디네이터)가 개입하는 경우에도 씁니다.

## 문제 속 쓰임
> Report both the timeout and "0 results" as failures requiring coordinator **intervention**.
> 타임아웃과 "0 results"를 모두 코디네이터의 **개입**이 필요한 실패로 보고한다.

## 함께 쓰는 표현
- **human intervention** : 사람의 개입
- **manual intervention** : 수동 개입 (*without manual intervention* 사람 손을 거치지 않고)
- **intervene** (동) 개입하다, 끼어들다

## 시험 포인트
상위의 개입은 **꼭 필요할 때만** 일어나게 설계하는 선택지가 정답 쪽입니다. 정상적인 빈 결과까지 실패로 보고하거나 일시적인 오류까지 모두 올려 보내면 불필요한 개입만 늘어납니다.
