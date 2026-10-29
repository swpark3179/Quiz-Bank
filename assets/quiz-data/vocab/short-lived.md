**잠깐만 존재하고 곧 사라지는** 것을 말합니다. 캐시·토큰·자격 증명처럼 유효 시간이 짧은 것에 붙습니다.

## 문제 속 쓰임
> Add a **short-lived** cache in front of the query tool so that repeated schema probes return faster on later calls.
> 쿼리 도구 앞에 **수명이 짧은** 캐시를 두어, 반복되는 스키마 탐색이 이후 호출에서 더 빨리 반환되게 한다

## 함께 쓰는 표현
- **short-lived token / credential** : 짧은 시간만 유효한 토큰 / 자격 증명

## 반대말
- **long-lived** — 오래 유지되는

## 시험 포인트
캐시는 반복 탐색을 **빠르게** 할 뿐 탐색 호출 자체를 없애지 못합니다. 거의 안 바뀌는 스키마는 **MCP 리소스로 한 번에 노출**하는 보기가 정답입니다.
