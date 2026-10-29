1. **실패하다, 제대로 되지 않다** — 작업·호출이 원하는 결과를 못 내다
2. **(검사를) 통과하지 못하다 / 실패 처리하다** — *fail the build* : 빌드를 실패시키다

## 문제 속 쓰임
> In production, subagents consistently **fail** because they claim they 'have no context' about the task.
> 운영에서 서브에이전트들이 작업에 대해 "맥락이 없다"고 하며 계속 **실패한다**.
> Raise the agent's refund authority limit above $640 in the tool configuration so that the call no longer **fails**.
> 도구 설정에서 에이전트의 환불 권한 한도를 $640보다 높게 올려, 호출이 더 이상 **실패하지** 않게 한다

## 함께 쓰는 표현
- **fail silently** : 오류를 알리지 않고 조용히 실패하다
- **fail fast** : 문제가 있으면 바로 실패시켜 드러내다
- **failure** (명) 실패, 장애

## 시험 포인트
정책상 거절을 "실패하지 않게" 하려고 **한도 자체를 올리는** 보기는 통제를 없애는 것이라 오답입니다. 거절 이유를 구조화된 오류로 알려 에이전트가 올바르게 대응(에스컬레이션 등)하게 해야 합니다.
