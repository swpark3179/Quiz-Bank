**승인**, 즉 권한 있는 사람이 "해도 된다"고 허락하는 것입니다. 동사는 *approve*(승인하다)입니다.

## 문제 속 쓰임
> A bug causes the agent to **approve** $2.3M in duplicate payments before being caught.
> 버그로 인해 에이전트가 230만 달러의 중복 지급을 **승인했고**, 그 후에야 발견됐습니다.

## 함께 쓰는 표현
- **manager approval** : 관리자 승인
- **require approval** : 승인을 받아야 한다
- **human-in-the-loop approval** : 사람이 중간에 확인하는 승인 단계

## 시험 포인트
고위험 동작(대금 지급·고액 환불)은 에이전트가 스스로 승인하게 두지 말고, 해당 도구 호출 지점에 **사람 승인 게이트**나 **hook** 을 두어 기준을 넘으면 반드시 확인받게 합니다.
