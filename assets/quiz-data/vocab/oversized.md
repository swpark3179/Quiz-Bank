정해진 **크기 한도보다 커서 받아들여지지 않는** 것을 말합니다. API 문맥에서는 요청 본문이 엔드포인트의 최대 바이트 수를 넘은 경우입니다.

## 문제 속 쓰임
> A 413 request_too_large caused by an **oversized** request body
> **너무 큰** 요청 본문 때문에 생긴 413 request_too_large

## 함께 쓰는 표현
- **oversized request body** : 너무 큰 요청 본문
- **request_too_large** : 413 오류의 이름
- **size limit** : 크기 한도

## 비슷한 말 · 반대말
- **too large** — 너무 큰 (일반적인 말)
- **undersized** — 너무 작은 (반대말)

## 시험 포인트
413 은 요청 **바이트** 한도를 넘은 것이라 SDK 자동 재시도 대상이 아니고, **본문을 줄이는 것**만이 해결책입니다. 재시도, 더 큰 컨텍스트 창(토큰 한도), 스트리밍(응답을 나눠 받는 기능)은 모두 오답입니다.
