처리되기를 **차례대로 기다리는 줄**입니다. 먼저 들어온 것이 먼저 나가는(FIFO) 구조를 뜻할 때가 많고, 업무에서는 "검토 대기 목록"처럼 씁니다.

## 문제 속 쓰임
> Route every comment through a human moderation **queue** before it is posted, so a reviewer approves each one first
> 모든 코멘트를 게시 전에 사람 검수 **대기열**로 보내, 리뷰어가 하나씩 먼저 승인하게 한다.

## 함께 쓰는 표현
- **review / moderation queue** : 검토·검수 대기열
- **message queue** : 메시지 큐 (시스템 사이에 작업을 넘기는 대기열)
- **queued** (형) 대기열에 들어간, 대기 중인

## 시험 포인트
특정 범주의 오탐 때문에 리뷰 봇이 신뢰를 잃었을 때 **모든 코멘트를 사람 검수 큐에 넣는** 보기는 과잉 대응이라 오답입니다. 그 범주만 잠시 끄고 명시적 기준으로 프롬프트를 고치는 것이 정답입니다.
