요청을 보낸 뒤 **응답을 기다려 주는 제한 시간**, 또는 그 시간이 지나 **끊기는 것**입니다.

## 문제 속 쓰임
> Raise the get_customer connection **timeout** so slow database responses are no longer cut off in the middle of a request.
> `get_customer` 의 연결 **타임아웃**을 늘려, 느린 데이터베이스 응답이 요청 도중에 끊기지 않게 한다

## 함께 쓰는 표현
- **raise / increase the timeout** : 타임아웃을 늘리다
- **time out** (동사구) 시간 초과로 끊기다 — *the request timed out*
- **connection timeout** : 연결 대기 제한 시간

## 시험 포인트
도구가 장애를 빈 결과로 숨겨 "계정 없음"으로 오판하는 문제는 타임아웃 조정으로 풀리지 않습니다. 실패를 **`isError` + 오류 종류·재시도 가능 여부**로 돌려주는 것이 정답입니다.
