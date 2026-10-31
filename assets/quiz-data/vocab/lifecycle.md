무언가가 **생겨나서 쓰이다가 끝나기까지 거치는 단계 전체**입니다. 에이전트에서는 세션 시작, 도구 호출 전후, 종료 같은 시점을 말하고, *lifecycle hooks* 는 그 시점마다 실행되는 훅입니다.

## 문제 속 쓰임
> ...resume earlier sessions, and fire **lifecycle** hooks, and the team wants all of it to run inside a process it operates.
> ...이전 세션을 재개하고 **수명 주기** 훅을 실행할 수 있어야 하며, 팀은 이 모든 것이 자기들이 운영하는 프로세스 안에서 돌기를 원합니다.

## 함께 쓰는 표현
- **lifecycle hooks** : 수명 주기 훅
- **software life cycle** : 소프트웨어 수명주기 (Discover → Design → Build → Deploy → Support and scale)
- **life cycle / life-cycle** : 같은 말의 다른 표기

## 시험 포인트
파일 편집·셸·세션 재개·수명 주기 훅을 **자기 프로세스 안에서** 돌리려면 Agent SDK 입니다(호스팅은 Managed Agents, 루프를 직접 짜면 Client SDK). 수명주기 5단계 문항에서는 CI/CD 자동화·환경 구성·배포 관리가 **Deploy** 단계입니다.
