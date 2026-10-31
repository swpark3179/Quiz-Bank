서버가 **HTTP 응답 하나를 열어 둔 채 이벤트를 차례로 흘려보내는** 방식(SSE)입니다. 서버에서 클라이언트로만 가는 **단방향**이고, Claude API 스트리밍은 `"stream": true` 를 넣은 요청의 응답이 SSE 로 오는 것입니다.

## 문제 속 쓰임
> The batch is accepted, and each result is streamed as **server-sent events** to a webhook as it completes.
> 배치가 수락되고, 각 결과가 완료될 때마다 **서버 전송 이벤트**로 웹훅에 스트리밍된다.

## 함께 쓰는 표현
- **SSE stream** : SSE 스트림
- **event types** : `content_block_delta`, `error` 같은 이벤트 종류

## 비슷한 말 · 반대말
- **WebSocket** — 양방향 연결. SSE 는 요청 하나에 응답 스트림 하나입니다

## 시험 포인트
이 보기는 오답입니다. 배치 결과는 스트림이 아니라 **파일로** 돌아오므로 배치 요청에 `stream: true` 를 넣으면 검증 오류가 납니다. 또 SSE 는 HTTP 200 으로 시작한 뒤 오류가 스트림 안의 `error` 이벤트로 올 수 있고, 모르는 이벤트 유형은 건너뛰도록 파서를 짜야 합니다.
