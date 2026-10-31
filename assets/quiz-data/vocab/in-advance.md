어떤 일이 일어나거나 필요해지기 **전에 미리** 해 둔다는 말입니다. 문제에서는 상황을 확인하기도 전에 앞질러 조치하는 순서를 꼬집는 보기에 자주 나옵니다.

## 문제 속 쓰임
> Add a continuation prompt to every request **in advance** → detect the empty responses → remove text blocks after tool_result blocks → send the empty response back unchanged
> 모든 요청에 **미리** 계속 진행 요청을 넣는다 → 빈 응답을 감지한다 → tool_result 블록 뒤의 텍스트 블록을 제거한다 → 빈 응답을 바꾸지 않고 그대로 돌려보낸다

## 함께 쓰는 표현
- **in advance of** ~ : ~에 앞서
- **plan in advance** : 미리 계획하다
- **thanks in advance** : 미리 감사드립니다

## 비슷한 말 · 반대말
- **beforehand / ahead of time** — 미리 (거의 같은 뜻)
- **afterward** — 나중에, 그 뒤에

## 시험 포인트
빈 `end_turn` 은 **구조부터** 고칩니다(`tool_result` 뒤의 텍스트 블록 제거). 계속 진행 요청은 구조를 고친 뒤에도 비어 있을 때 쓰는 최후의 수단이라, *in advance* 로 먼저 넣는 순서는 오답입니다.
