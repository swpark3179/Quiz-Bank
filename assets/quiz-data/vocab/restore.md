잃어버리거나 바뀐 것을 **원래 상태로 되돌려 놓는** 것입니다. 저장해 둔 기록·백업·세션이 있어야 할 수 있는 일이라는 전제가 담겨 있습니다.

## 문제 속 쓰임
> The stream is a websocket session; the client should reconnect with the same session ID to **restore** the history.
> 스트림은 웹소켓 세션이다. 클라이언트가 같은 세션 ID 로 다시 연결해 기록을 **복원해야** 한다.

## 함께 쓰는 표현
- **restore the history / state** : 기록·상태를 복원하다
- **restore from a backup** : 백업에서 복원하다

## 비슷한 말 · 반대말
- **recover** — 복구하다 (비슷한 뜻)
- **discard** — 버리다

## 시험 포인트
이 보기는 오답입니다. Messages API 는 **상태가 없어서(stateless)** 복원할 서버 측 세션이 없습니다. 스트리밍도 `"stream": true` 를 넣은 같은 POST 요청일 뿐이므로, 후속 턴마다 **전체 대화 기록을 담아** 새 요청을 보내야 합니다.
