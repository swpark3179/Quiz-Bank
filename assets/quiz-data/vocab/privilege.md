시스템에서 어떤 사용자·에이전트가 **무엇까지 할 수 있는지의 권한 수준**을 말합니다. 보안 문제에서는 *least privilege*(꼭 필요한 최소 권한만 주기)와 함께 자주 나옵니다.

## 문제 속 쓰임
> ...the primary controls isolate and screen the email in tool results and limit the agent's **privileges**.
> 주된 통제는 메일을 도구 결과 안에 격리·스크리닝하고 에이전트의 **권한**을 제한하는 것이다.

## 함께 쓰는 표현
- **least privilege** : 최소 권한 원칙
- **limit privileges** : 권한을 제한하다
- **privileged access** : 높은 권한의 접근

## 비슷한 말 · 반대말
- **permission** — 허가, 권한. 개별 항목 하나하나를 말할 때 더 자주 씁니다

## 시험 포인트
검증된 사용자 + 외부에서 온 메일 속 지시는 **간접 프롬프트 인젝션**입니다. 대책은 콘텐츠를 `tool_result` 에 격리·스크리닝하고, 인젝션이 성공해도 피해가 작도록 **권한을 최소로** 줄이는 것입니다.
