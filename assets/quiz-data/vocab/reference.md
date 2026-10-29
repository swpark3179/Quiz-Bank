1. **참조하다, 가리키다** — 값을 직접 쓰지 않고 다른 곳에 있는 것을 가리킨다
2. **참조, 참고 자료** — *reference docs*, *for reference*

## 문제 속 쓰임
> **Reference** `${GITHUB_TOKEN}` in .mcp.json so each machine and CI job injects its own value at load time.
> `.mcp.json` 에서 `${GITHUB_TOKEN}` 을 **참조해**, 각 머신과 CI 작업이 로드 시점에 자기 값을 주입하게 한다.

## 함께 쓰는 표현
- **reference an environment variable** : 환경 변수를 참조하다
- **reference documentation** : 참고 문서
- **by reference** : (값 복사가 아니라) 참조로

## 시험 포인트
공유·커밋되는 `.mcp.json` 에 비밀값이 필요하면 값을 직접 쓰지 말고 **`${ENV_VAR}` 로 참조**하는 보기가 정답입니다. 암호화한 파일을 커밋하거나 CLAUDE.md 에 토큰을 넣는 보기는 오답입니다.
