**하나를 얻으려면 다른 하나를 어느 정도 내줘야 하는 관계**입니다. 장점만 있는 선택은 없다는 전제에서 "무엇을 얻고 무엇을 잃는가"를 따질 때 씁니다. *tradeoff* 로 붙여 쓰기도 합니다.

## 문제 속 쓰임
> ...because this is the documented way to force the specific tool; the **trade-off** is that forced tool use suppresses natural-language text before the tool call
> ...특정 도구를 강제하는 문서화된 방법이다. **대가로**, 강제 도구 사용은 도구 호출 앞의 자연어 텍스트를 억제한다.

## 함께 쓰는 표현
- **the trade-off is that** ~ : 대신 치르는 대가는 ~이다
- **trade-off between A and B** : A 와 B 사이의 상충 관계
- **trade off A for B** : B 를 얻으려고 A 를 내주다

## 비슷한 말
- **cost** — 대가, 비용
- **pros and cons** — 장단점

## 시험 포인트
`tool_choice: {"type": "tool", "name": ...}` 는 특정 도구 호출을 **보장**하지만, 그 대가로 도구 호출 앞의 자연어 설명이 나오지 않습니다(`any` 도 같음). 호출 보장과 앞선 추론은 동시에 얻을 수 없습니다.
