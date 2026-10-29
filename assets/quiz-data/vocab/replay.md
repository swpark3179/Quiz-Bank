녹화·기록해 둔 것을 **그대로 다시 재생하는** 것입니다. 문제에서는 재개한 세션이 **예전 도구 결과를 그대로 다시 쓰는** 상황을 가리킵니다.

## 문제 속 쓰임
> This week the report cites last week's prices as current, because the resumed session **replays** cached web-search tool results.
> 이번 주 보고서는 지난주 가격을 현재 가격처럼 인용했는데, 재개된 세션이 캐시된 웹 검색 도구 결과를 그대로 **되살렸기** 때문이다.

## 함께 쓰는 표현
- **replay a session / request** : 세션·요청을 다시 재생하다
- **replay attack** : (보안) 가로챈 요청을 그대로 다시 보내는 공격

## 시험 포인트
`--resume` 한 세션이 **낡은 결과를 그대로 재생해** 문제가 생기면, 재개나 포크가 아니라 **새 세션 + 이전 결론 요약 주입 + 다시 조회**가 정답입니다.
