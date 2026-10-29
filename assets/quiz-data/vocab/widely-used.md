**널리 쓰이는**, 여러 곳에서 의존하는 것입니다. 코드에서는 호출하는 곳이 많아 **바꾸면 영향 범위가 넓다**는 뉘앙스가 있습니다.

## 문제 속 쓰임
> To rename a **widely-used** internal API, Claude must first locate every call site across a large monorepo.
> **널리 쓰이는** 내부 API의 이름을 바꾸려면 Claude가 먼저 대형 모노레포 전체에서 모든 호출 지점을 찾아야 한다.

## 함께 쓰는 표현
- **widely adopted** : 널리 채택된
- **commonly used** : 흔히 쓰이는

## 시험 포인트
호출 지점이 많아 탐색이 길어지면 **Explore 서브에이전트로 탐색을 격리하고 요약만 받아** 메인 컨텍스트를 편집용으로 남기는 것이 정답입니다.
