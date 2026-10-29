액체가 틈으로 **새는** 것에서 나온 말로, 비밀·정보가 **허락 없이 밖으로 새어 나가는** 것을 말합니다.

## 문제 속 쓰임
> ...each engineer (and CI) must supply their own credential without **leaking** it.
> 각 엔지니어(와 CI)는 **유출** 없이 각자의 자격 증명을 제공해야 한다.

## 함께 쓰는 표현
- **leak a secret / credential** : 비밀 / 자격 증명을 유출하다
- **data leak** : 데이터 유출
- **memory leak** : 메모리 누수 — 해제되지 않은 메모리가 계속 쌓이는 버그

## 시험 포인트
공유·커밋되는 `.mcp.json` 에는 토큰 대신 **`${GITHUB_TOKEN}` 같은 환경 변수 참조**만 두고, 실제 값은 각 머신·CI 가 주입하게 하는 것이 정답입니다.
