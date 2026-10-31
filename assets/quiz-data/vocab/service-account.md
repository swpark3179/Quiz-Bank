사람 직원이 아니라 **배치 작업·CI·에이전트 같은 프로그램이 쓰는 신원(계정)** 입니다. 특정 사람에게 묶이지 않으므로 담당자가 바뀌어도 작업이 멈추지 않고, 그 작업에 필요한 권한만 따로 줄 수 있습니다.

## 문제 속 쓰임
> A **service account** plus Workload Identity Federation, with a federation rule that maps the job's identity token to that account and an OAuth scope.
> **서비스 계정**과 워크로드 ID 페더레이션을 쓰고, 작업의 ID 토큰을 그 계정과 OAuth 범위에 연결하는 페더레이션 규칙을 둔다.

## 함께 쓰는 표현
- **non-human workload** : 사람이 아닌 워크로드 (야간 배치·CI 작업 등)
- **Workload Identity Federation (WIF)** : 플랫폼이 발급한 ID 토큰을 단기 액세스 토큰으로 바꿔 쓰는 방식
- **minimal IAM permissions** : 꼭 필요한 최소 권한

## 비슷한 말 · 반대말
- **personal API key** — 특정 사람의 신원으로 동작하는 키. 그 사람이 떠나면 멈춥니다

## 시험 포인트
"사람이 아닌 워크로드 + 장기 정적 키 금지" 조건이면 **서비스 계정 + 워크로드 ID 페더레이션**이 정답 신호입니다. 서비스 계정에 넓은 관리자 권한을 주는 보기는 오답이고, **최소 권한**만 주는 것이 원칙입니다.
