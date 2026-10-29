여러 선택지 가운데 **어느 쪽을 더 좋아하거나 고르는** 것입니다. *whichever one it prefers* 는 "자기가 원하는 아무거나"라는 뜻입니다.

## 문제 속 쓰임
> Set tool_choice to "any" so the subagent must use some tool on the opening turn, whichever one it **prefers**.
> `tool_choice` 를 `"any"` 로 설정해, 서브에이전트가 첫 턴에 어떤 도구든 **원하는** 것 하나를 반드시 사용하게 한다.

## 함께 쓰는 표현
- **prefer A to / over B** : B보다 A를 선호하다
- **preferred** (형) 선호되는, 권장되는
- **preference** (명) 선호, 선호 설정

## 시험 포인트
`"any"` 는 도구를 **하나는 반드시** 부르게 할 뿐 *어떤* 도구인지는 정하지 못합니다. 첫 단계가 항상 특정 도구여야 하면 `{"type":"tool","name":...}` 로 강제합니다.
