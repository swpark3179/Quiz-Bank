원래 가던 곳에 닿기 전에 **도중에 가로채** 살펴보거나 바꾼 뒤 넘기는 것입니다. 소프트웨어에서는 훅·미들웨어가 요청이나 결과를 중간에서 처리할 때 씁니다.

## 문제 속 쓰임
> Use a PostToolUse hook to **intercept** tool results and apply formatting transformations before agent processing
> PostToolUse 훅으로 도구 결과를 **가로채**, 에이전트가 처리하기 전에 형식 변환을 적용한다.

## 함께 쓰는 표현
- **intercept requests / calls** : 요청·호출을 가로채다
- **interceptor** (명) 인터셉터 — 요청·응답을 중간에서 처리하는 코드

## 시험 포인트
수정할 수 없는 서드파티 도구까지 포함해 **모든 도구 출력을 한곳에서 결정적으로** 바꿔야 한다면, 결과를 가로채는 훅이 정답 쪽입니다. 프롬프트로 형식을 설명하거나 에이전트가 변환 도구를 직접 부르게 하는 방식은 모델이 빠뜨릴 수 있습니다.
