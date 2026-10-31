근무 시간 밖에도 장애가 나면 **바로 연락받고 대응하도록 대기하는 당번**입니다. *on-call engineer* 는 당직 엔지니어, *on-call handoff* 는 다음 당번에게 넘기는 인수인계입니다.

## 문제 속 쓰임
> A personal API key that belongs to the **on-call** engineer, rotated every 30 days by a scheduled script.
> **당직** 엔지니어 소유의 개인 API 키를 쓰고, 예약 스크립트로 30일마다 교체한다

## 함께 쓰는 표현
- **on-call engineer** : 당직(온콜) 엔지니어
- **on-call handoff** : 온콜 인수인계
- **be on call** : 당번으로 대기 중이다

## 시험 포인트
당직 엔지니어의 개인 키는 **사람의 신원**으로 동작하고 교체해도 장기 정적 키라 오답입니다(정답은 서비스 계정 + WIF). 교대 때만 쓰는 온콜 인수인계 절차는 CLAUDE.md 가 아니라 필요할 때만 로드되는 **스킬**(`/handoff`)로 만듭니다.
