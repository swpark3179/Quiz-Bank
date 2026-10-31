필요한 것을 **채워 넣어 주는** 것입니다. 설정·함수에서는 "값을 넘겨주다, 제공하다"라는 뜻으로 쓰고, 경제 기사에서는 *supply chain*(공급망)처럼 "공급"의 뜻으로 나옵니다.

## 문제 속 쓰임
> ...each time the coordinator invokes this subagent it **supplies** a different per-call prompt describing the specific table and migration at hand.
> 코디네이터는 이 서브에이전트를 호출할 때마다 해당 테이블과 마이그레이션을 설명하는 서로 다른 호출별 프롬프트를 **제공한다**.

> State the objective, the boundaries (2025 **supply** chains only; ...)
> 목표와 경계(2025년 **공급**망만 …)를 명시한다.

## 함께 쓰는 표현
- **supply a value / an argument** : 값·인자를 넘겨주다
- **user-supplied** : 사용자가 제공한
- **supply chain** : 공급망

## 시험 포인트
공유하는 `.mcp.json` 에는 비밀값을 직접 쓰지 않고 `${GITHUB_TOKEN}` 같은 **환경 변수 확장**으로 참조해, 각 머신·CI 가 자기 값을 넣게(supply) 하는 것이 정답입니다.
