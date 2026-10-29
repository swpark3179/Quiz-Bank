여럿 가운데 **하나(또는 일부)를 고르는** 것입니다. *choose* 보다 문서체이고, 도구 사용 문맥에서 많이 씁니다.

## 문제 속 쓰임
> Set tool_choice to "any" so the model must **select** a tool on every refund turn and cannot answer without calling one.
> `tool_choice` 를 `"any"` 로 설정해, 모델이 환불 턴마다 반드시 도구를 **선택하고** 도구 호출 없이 답하지 못하게 한다

## 함께 쓰는 표현
- **select the right tool** : 알맞은 도구를 고르다
- **selected** (형) 선택된

## 시험 포인트
`tool_choice` 는 **"auto"**(호출할지 모델이 판단), **"any"**(어떤 도구든 반드시 호출), **{"type": "tool", "name": …}**(그 도구를 강제)로 나뉩니다. 도구를 *잘못* 고르는 문제는 "any" 로 바꾼다고 풀리지 않습니다.
