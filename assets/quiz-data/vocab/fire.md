원래 "(총을) 쏘다"라는 뜻으로, 개발 문맥에서는 요청·호출을 **쏘아 보내다**, 이벤트·훅이 **발동하다**라는 뜻으로 씁니다. 사람에게 쓰면 "해고하다"입니다.

## 문제 속 쓰임
> Traces show that before every real query it **fires** 6-10 exploratory tool calls (list_tables, describe_table, sample_rows) to rediscover what exists...
> 트레이스를 보면 실제 쿼리를 할 때마다 그 전에 무엇이 있는지 다시 알아내려고 탐색용 도구 호출을 6번에서 10번씩 **실행한다**.

## 함께 쓰는 표현
- **fire a request / an API call** : 요청·API 호출을 보내다
- **the hook fires** : 훅이 발동하다(실행되다)
- **fire-and-forget** : 결과를 기다리지 않고 보내기만 하는 방식

## 시험 포인트
"무엇이 있는지 알아내려는 탐색 호출이 반복된다"면, 스키마 카탈로그를 **MCP 리소스**로 노출해 처음에 한 번 읽게 하는 보기가 정답입니다. 도구는 동작, 리소스는 읽을 데이터입니다.
