진짜 값이 들어갈 자리를 **임시로 채워 두는** 값이나 표시입니다. 예: `YOUR_TOKEN_HERE`, `xxx`, 빈칸 표시.

## 문제 속 쓰임
> Configure the server in project scope with a **placeholder** token.
> 프로젝트 범위에 **임시(플레이스홀더)** 토큰으로 서버를 설정한다.

## 함께 쓰는 표현
- **placeholder value / text** : 임시 값 / 자리 표시 텍스트
- **replace the placeholder with** ~ : 임시 값을 ~로 바꾸다

## 비슷한 말
- **dummy value** — 형식만 맞춘 가짜 값
- **stub** — (코드) 나중에 구현할 자리만 만들어 둔 함수

## 시험 포인트
팀이 공유하는 설정에 비밀값을 넣지 않으려면 **환경 변수 확장(`${GITHUB_TOKEN}`)** 을 쓰는 것이 정석입니다. 플레이스홀더 토큰을 커밋하고 각자 덮어쓰게 하는 방식은 번거롭고 실수가 잦아 오답으로 나옵니다.
