사용자가 비밀번호를 앱에 넘기지 않고, **인가 서버가 발급한 액세스 토큰으로 필요한 범위(*scope*)의 권한만 위임**하는 표준입니다. "Google 계정으로 로그인" 같은 흐름이 대표적이며, *OAuth2* 는 지금 널리 쓰는 2.0 버전입니다.

## 문제 속 쓰임
> After an expensive codebase analysis that ended with a JWT proposal, an engineer wants to try **OAuth2** on a separate branch.
> JWT 방안으로 끝난 비싼 코드베이스 분석 뒤, 엔지니어가 **OAuth2** 를 별도 갈래에서 시도해 보려 합니다.

## 함께 쓰는 표현
- **OAuth authorization server** : OAuth 인가 서버 (토큰을 발급하는 곳)
- **OAuth scope** : 토큰이 허용하는 권한 범위

## 비슷한 말 · 반대말
- **OIDC** — OAuth 위에 '누구인지(신원)' 확인을 더한 표준
- **API key** — 고정된 비밀 문자열. 위임·범위 개념이 없습니다

## 시험 포인트
"OAuth 인가 서버가 관여하지 않는" Kerberos 인증에 `oauth` 블록(`authServerMetadataUrl`)을 쓰는 보기는 오답이고, 연결마다 헤더를 만들어 내는 `headersHelper` 가 정답이었습니다.
