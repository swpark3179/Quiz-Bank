감당할 수 있는 양보다 많은 요청이 몰려 **지금은 처리하지 못하는 상태**입니다. 내 요청이 잘못된 것이 아니라 **서버 쪽의 일시적 상태**라서, 잠시 뒤 다시 보내면 풀리는 경우가 많습니다.

## 문제 속 쓰임
> Your news subagent gets an **overloaded** error from its search provider on the first call.
> 뉴스 서브에이전트가 첫 호출에서 검색 공급사의 **과부하** 오류를 받습니다.

> After a stream starts with HTTP 200, **overload** can arrive as an `error` event inside the stream, which a status check never sees.
> 스트림이 HTTP 200으로 시작된 뒤에는 **과부하**가 스트림 안의 `error` 이벤트로 올 수 있고, 상태 코드 검사는 이를 보지 못한다

## 함께 쓰는 표현
- **overloaded_error** : 과부하 오류 (HTTP 529)
- **under heavy load** : 부하가 높은 상태에서

## 시험 포인트
과부하는 **일시적 실패**라 서브에이전트가 제한된 횟수만 스스로 재시도하고, `authentication_failed` 처럼 재시도로 풀리지 않는 실패는 맥락과 함께 바로 코디네이터에 올립니다. 스트리밍에서는 상태 코드뿐 아니라 스트림 안의 `error` 이벤트도 확인해야 합니다.
