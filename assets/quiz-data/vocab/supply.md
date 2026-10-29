필요한 것을 **채워 넣어 주는** 것입니다. 설정·함수에서는 "값을 넘겨주다, 제공하다"라는 뜻으로 씁니다.

## 문제 속 쓰임
> ...but each engineer (and CI) must **supply** their own credential without leaking it.
> 각 엔지니어(와 CI)는 유출 없이 각자의 자격 증명을 **제공해야** 한다.

## 함께 쓰는 표현
- **supply a value / an argument** : 값·인자를 넘겨주다
- **user-supplied** : 사용자가 제공한
- **supply A with B** : A에게 B를 제공하다

## 시험 포인트
공유하는 `.mcp.json` 에는 비밀값을 직접 쓰지 않고 `${GITHUB_TOKEN}` 같은 **환경 변수 확장**으로 참조해, 각 머신·CI 가 자기 값을 넣게 하는 것이 정답입니다.
