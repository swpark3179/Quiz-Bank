여러 조직·시스템이 서로의 **신원 확인 결과를 믿고 받아들이도록 연결**하는 방식입니다. *Workload Identity Federation*(WIF)은 클라우드·CI가 이미 발급한 ID 토큰을 단기 Claude 액세스 토큰으로 바꿔 주어, 보관하고 교체할 정적 API 키가 필요 없게 합니다.

## 문제 속 쓰임
> A service account plus Workload Identity **Federation**, with a federation rule that maps the job's identity token to that account and an OAuth scope.
> 서비스 계정과 워크로드 ID **페더레이션**을 쓰고, 작업의 ID 토큰을 그 계정과 OAuth 범위에 연결하는 페더레이션 규칙을 둔다.

## 함께 쓰는 표현
- **federation issuer** : 페더레이션 발급자 (신뢰할 OIDC 제공자)
- **federation rule** : 토큰 클레임을 서비스 계정·범위·수명에 연결하는 규칙
- **service account** : 사람이 아닌 워크로드용 계정

## 시험 포인트
"사람이 아닌 워크로드 + 장기 정적 키 금지"는 **서비스 계정 + WIF**의 신호입니다. 개인 키를 주기적으로 교체하거나 Admin API 키를 보관하는 방식은 여전히 정적 비밀이라 오답입니다.
