특정 부분이 아니라 **전체(모든 곳)에 걸쳐 적용되는** 것입니다. 프로그래밍에서는 어디서나 접근하는 **전역** 변수·설정을, 일반적으로는 "세계적인"을 뜻합니다.

## 문제 속 쓰임
> Add a **global** PreToolUse hook that inspects every Edit across all sessions and rejects any write outside the `docs/` folder
> 모든 세션의 모든 `Edit` 을 검사해 `docs/` 폴더 밖 쓰기를 거부하는 **전역** PreToolUse 훅을 추가한다

## 함께 쓰는 표현
- **global variable** : 전역 변수
- **global setting / config** : 전역 설정

## 반대말
- **local**, **scoped** — 특정 범위에만 적용되는

## 시험 포인트
한 스킬만 제한하면 되는 문제에서 **모든 세션에 거는 전역 훅**은 범위가 너무 넓어 오답입니다. "전역 변수로 서브에이전트에 자동 주입" 같은 보기도 오답이며, 서브에이전트에 필요한 정보는 **Task 프롬프트에 명시적으로** 넣어야 합니다.
