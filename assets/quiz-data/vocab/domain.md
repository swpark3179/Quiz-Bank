1. **분야, 영역** — 주제나 지식을 나눈 한 부분 (*domain knowledge* 처럼)
2. **(인터넷) 도메인** — `example.com` 같은 사이트 주소

## 문제 속 쓰임
> ...resulting in subagent assignments that don't cover all relevant **domains** of the topic.
> 그 결과 하위 에이전트 배정이 주제의 관련 **영역**을 모두 다루지 못한다.
> Implement filtering that blocks `fetch_url` calls to known search engine **domains** while allowing other URLs.
> 알려진 검색 엔진 **도메인**으로 가는 `fetch_url` 호출만 막고 다른 URL 은 허용하는 필터를 만든다.

## 함께 쓰는 표현
- **domain knowledge / expert** : 해당 분야의 지식·전문가
- **problem domain** : 소프트웨어가 다루는 업무 영역
- **block a domain** : 특정 도메인 접속을 막다

## 시험 포인트
검색 엔진 **도메인 차단** 같은 블랙리스트는 새 도메인으로 쉽게 우회됩니다. 도구가 할 수 있는 일 자체를 좁히는(문서 URL 만 받는 전용 도구) 보기가 더 근본적인 해결입니다.
