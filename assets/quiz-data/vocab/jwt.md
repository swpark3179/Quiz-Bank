**JSON Web Token** 의 줄임말로, 사용자 정보(클레임)를 JSON 으로 담고 **서명을 붙인 토큰**입니다. 받는 쪽은 서명만 확인하면 위조 여부를 알 수 있어 로그인·API 인증에 흔히 씁니다.

## 문제 속 쓰임
> After an expensive codebase analysis that ended with a **JWT** proposal, an engineer wants to try OAuth2 on a separate branch.
> **JWT** 방안으로 끝난 비싼 코드베이스 분석 뒤, 엔지니어가 OAuth2를 별도 갈래에서 시도해 보려 합니다.

## 함께 쓰는 표현
- **JWT-based auth** : JWT 기반 인증
- **claims** : 토큰에 담긴 정보 항목
- **bearer token** : 요청 헤더에 실어 보내는 토큰

## 비슷한 말 · 반대말
- **OAuth2** — 권한을 위임하는 절차(표준)입니다. JWT 는 토큰의 **형식**이라 층위가 다릅니다

## 시험 포인트
이 문항에서 JWT·OAuth2 는 두 설계안의 이름일 뿐이고 핵심은 세션 포크입니다. `fork_session()` 은 트랜스크립트를 복사하고 ID만 돌려주므로, 그 `session_id` 를 `resume` 에 넘겨야 OAuth2 갈래가 실행됩니다.
