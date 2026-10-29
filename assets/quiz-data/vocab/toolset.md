에이전트에게 주어진 **도구 전체 묶음**입니다. 어떤 도구를 넣고 빼느냐로 에이전트가 할 수 있는 일의 범위가 정해집니다.

## 문제 속 쓰임
> Remove process_refund from the agent's **toolset** entirely so that every refund, large or small, is handled by a human.
> 에이전트의 **도구 목록**에서 `process_refund` 를 완전히 제거해, 금액과 관계없이 모든 환불을 사람이 처리하게 한다

## 함께 쓰는 표현
- **minimal toolset** : 꼭 필요한 도구만 담은 묶음 (최소 권한)
- **tool definitions** : 도구 정의

## 시험 포인트
정책 한도만 지키면 되는데 도구를 통째로 빼는 것은 정상 흐름까지 막는 **과잉 조치**입니다. 한도를 넘는 호출만 `PreToolUse` 훅으로 막는 것이 정답입니다.
