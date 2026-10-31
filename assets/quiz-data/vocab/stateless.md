**이전 요청에서 무슨 일이 있었는지 서버가 기억하지 않는** 성질입니다. 요청 하나하나가 독립적이라, 맥락이 필요하면 요청할 때마다 필요한 내용을 모두 실어 보내야 합니다. 반대로 상태를 기억하는 것은 *stateful* 입니다.

## 문제 속 쓰임
> The Messages API is **stateless**, so it dropped the older turns once the conversation passed a set length
> Messages API 가 **상태를 저장하지 않아서**, 대화가 일정 길이를 넘자 오래된 턴을 버렸다

## 함께 쓰는 표현
- **stateless API** : 상태를 저장하지 않는 API
- **resend the history** : 대화 기록을 다시 보내다
- **stateful session** : 상태를 유지하는 세션

## 비슷한 말 · 반대말
- **stateful** — 상태를 유지하는 (이전 요청 내용을 기억함)

## 시험 포인트
이 보기는 오답입니다. *stateless* 는 API 가 이전 요청을 **기억하지 않는다**는 뜻이지, 턴을 스스로 잘라 낸다는 뜻이 아닙니다. 그래서 멀티턴 대화는 클라이언트가 **매 요청에 전체 기록을 담아** 보내야 합니다.
