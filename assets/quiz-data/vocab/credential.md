시스템에 **접근할 자격이 있음을 증명하는 정보**입니다. 비밀번호·API 키·액세스 토큰 등을 묶어 부르는 말로, 보통 복수형 *credentials* 로 씁니다.

## 문제 속 쓰임
> You want consistent tooling across the team without committing **credentials** to version control.
> **자격 증명**을 버전 관리에 커밋하지 않으면서 팀 전체에 일관된 도구를 제공하고 싶다.

## 함께 쓰는 표현
- **store / manage credentials** : 자격 증명을 보관·관리하다
- **leaked credentials** : 유출된 자격 증명
- **personal access token (PAT)** : 개인 액세스 토큰 — 대표적인 credential

## 시험 포인트
공유 설정 파일은 버전 관리에 두고, **자격 증명만 환경 변수로 주입**하는 방식이 정석입니다(예: `.mcp.json` 의 `${GITHUB_TOKEN}`). 토큰을 파일에 직접 넣거나 플레이스홀더 토큰을 커밋하는 보기는 오답입니다.
