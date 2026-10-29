낡은 것을 **다시 새롭게(최신 상태로) 만드는** 것입니다. 화면 *새로 고침*, 캐시·토큰 *갱신*에 씁니다.

## 문제 속 쓰임
> Keep them sequential but ask Claude to re-read the enum definition before each message to **refresh** its memory
> 순차 방식은 유지하되, 메시지마다 Claude에게 enum 정의를 다시 읽게 해 기억을 **새로 고친다**.

## 함께 쓰는 표현
- **refresh one's memory** : 기억을 되살리다
- **refresh a cache / token** : 캐시·토큰을 갱신하다
- **refresh token** : 새 액세스 토큰을 받는 데 쓰는 토큰

## 시험 포인트
서로 얽힌 변경을 하나씩 보내다 깨지는 문제에서 "기억을 새로 고치게" 하는 보기는 오답입니다. 같은 enum 을 건드리는 변경은 **한 메시지로 묶어** 요청하는 것이 정답입니다.
