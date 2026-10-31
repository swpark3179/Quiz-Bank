1. **(보안) 주체** — 권한을 받아 그 이름으로 행동하는 사용자·서비스 계정. "누구로서 요청하는가"의 그 *누구* 입니다
2. **주된, 주요한** — *the principal reason* 주된 이유

## 문제 속 쓰임
> (a) the non-human **principal** a federated token acts as; (b) registers a trusted OIDC identity provider; ...
> (a) 페더레이션 토큰이 그 자격으로 행동하는 비인간 **주체**, (b) 신뢰할 OIDC ID 제공자를 등록한다

## 함께 쓰는 표현
- **non-human principal** : 사람이 아닌 주체 (서비스 계정 등)
- **act as a principal** : 주체로서 행동하다

## 비슷한 말 · 반대말
- **identity** — 신원 (비슷한 뜻)
- **principle** — 원칙. 발음과 철자가 비슷하지만 전혀 다른 말입니다 (*least privilege principle*)

## 시험 포인트
워크로드 ID 페더레이션에서 **서비스 계정 = 행동 주체(principal)**, 발급자 = OIDC ID 제공자 등록, 규칙 = 토큰 클레임을 서비스 계정·OAuth 범위·토큰 수명에 연결합니다. 서비스 계정은 키가 아니라 **신원**입니다.
