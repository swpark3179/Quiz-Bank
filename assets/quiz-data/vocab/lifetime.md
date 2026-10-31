원래는 사람의 '평생'입니다. 기술 문맥에서는 캐시 항목·토큰·키가 **유효하게 남아 있는 기간**을 말하며, *TTL* 과 거의 같은 개념입니다.

## 문제 속 쓰임
> The server stores the history for 5 minutes, so follow-ups fail only when students pause longer than the cache **lifetime**.
> 서버는 기록을 5분간 저장하므로, 학생이 캐시 **수명**보다 오래 쉬었을 때만 후속 질문이 실패한다

## 함께 쓰는 표현
- **cache lifetime** : 캐시 수명
- **token lifetime** : 토큰 유효 시간
- **default lifetime** : 기본 수명

## 비슷한 말 · 반대말
- **TTL** (time to live) — 유지 시간을 정하는 설정값
- **expiration** — 만료. 수명이 끝나는 시점

## 시험 포인트
프롬프트 캐시는 처리 비용을 줄일 뿐 **대화를 저장하지 않습니다**. Messages API 는 상태가 없어 매 요청에 전체 기록을 보내야 하므로 위 보기는 오답입니다. 기본 수명 5분을 늘리려면 브레이크포인트를 더하는 것이 아니라 `"ttl": "1h"` 를 줍니다.
