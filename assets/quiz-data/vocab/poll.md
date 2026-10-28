1. **(상태를) 주기적으로 확인하다, 폴링하다** — 작업이 끝났는지 일정 간격으로 계속 물어보는 것
2. **여론 조사(하다), 투표** — 일상 영어에서 흔한 뜻

## 문제 속 쓰임
> You want to reduce costs using the Message Batches API (50% savings, requires **polling**, up to 24 hours).
> Message Batches API(50% 절감, **폴링** 필요, 최대 24시간)를 써서 비용을 줄이고 싶다.

## 함께 쓰는 표현
- **poll for completion** : 끝났는지 계속 확인하다
- **status polling** : 상태 폴링
- **polling interval** : 확인 간격

## 비교
- **polling** — 내가 주기적으로 물어본다
- **webhook / callback** — 끝나면 상대가 알려 준다

## 시험 포인트
폴링이 필요하다는 건 **결과를 바로 받지 못한다**는 뜻입니다. 이미 야간에 돌며 완료를 폴링하는 작업은 배치 처리와 잘 맞지만, 머지를 막고 기다리는 검사에는 맞지 않습니다.
