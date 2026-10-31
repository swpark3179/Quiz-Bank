특정 분야에 대해 **오래 쌓은 전문 지식과 솜씨**입니다. 에이전트 설계에서는 서브에이전트가 늘 갖고 있어야 할 역할·규칙·노하우를 가리킵니다.

## 문제 속 쓰임
> AgentDefinition.prompt sets the subagent's persistent system prompt and **expertise**, while the per-call prompt passed at invocation supplies the specific task details for that run
> `AgentDefinition.prompt` 는 서브에이전트의 지속적인 시스템 프롬프트와 **전문성**을 정하고, 호출 시 넘기는 프롬프트는 그 실행의 구체적 작업 내용을 제공한다.

## 함께 쓰는 표현
- **domain expertise** : 분야 전문 지식
- **lack expertise** : 전문성이 부족하다

## 비슷한 말 · 반대말
- **expert** — 전문가 (사람)
- **know-how** — 실무 요령

## 시험 포인트
SQL 모범 사례처럼 매번 필요한 *expertise* 는 `AgentDefinition.prompt`(시스템 프롬프트)에, 어느 테이블을 바꿀지 같은 그때그때의 작업은 **호출별 프롬프트**에 둡니다. 둘 다 서브에이전트에 온전히 전달됩니다.
