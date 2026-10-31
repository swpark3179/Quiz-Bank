두 쪽 **사이에 끼어 대신 연결하거나 바꿔 주는** 사람·서비스입니다. 기술 문맥에서는 한 인증 방식을 다른 방식으로 바꿔 주는 중간 서버나 프록시를 가리킵니다.

## 문제 속 쓰임
> ...use an **intermediary** service that authenticates via Kerberos and then uses Anthropic-supported credentials such as API keys or OAuth tokens.
> Kerberos로 인증한 뒤 API 키나 OAuth 토큰 같은 Anthropic 지원 자격 증명을 쓰는 **중간** 서비스를 둔다

## 함께 쓰는 표현
- **intermediary service** : 중간 서비스
- **act as an intermediary** : 중개 역할을 하다

## 비슷한 말 · 반대말
- **proxy** — 요청을 대신 전달하는 대리 서버
- **middleman** — 중개인 (일상어)
- **intermediate** — '중간의'라는 형용사. 철자가 비슷하니 구분합니다

## 시험 포인트
이 보기는 **오답**입니다. 연결마다 새 Kerberos 토큰이 필요한 사내 MCP 서버는 중간 서비스 없이, 연결할 때마다 헤더를 만들어 내는 `headersHelper` 로 처리합니다. Anthropic API 키·OAuth 토큰은 사내 서버 인증과 무관하다는 점도 함정입니다.
