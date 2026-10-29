여러 개 중 "**어느 것이든**"이라는 뜻입니다. 고르는 기준을 정하지 않고 **아무거나 하나**라는 뉘앙스입니다.

## 문제 속 쓰임
> Set tool_choice to "any" so the subagent must use some tool on the opening turn, **whichever one it prefers**.
> `tool_choice` 를 `"any"` 로 설정해, 서브에이전트가 첫 턴에 **어떤 도구든 원하는 것 하나**를 반드시 사용하게 한다.

## 함께 쓰는 표현
- **whichever comes first** : 어느 쪽이든 먼저 오는 것
- **whichever one you prefer** : 원하는 어느 것이든

## 시험 포인트
`tool_choice: "any"` 는 **도구를 쓰게만** 할 뿐 어느 도구인지는 고정하지 못합니다. 첫 단계가 항상 특정 도구라면 `{"type":"tool","name":...}` 로 **이름을 지정해 강제**해야 합니다.
