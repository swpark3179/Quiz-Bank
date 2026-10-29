1. **(명령·함수에 넘기는) 인자** — 실행할 때 함께 전달하는 값 (*a `--system-prompt` argument*)
2. **논거, 주장 / 말다툼** — 일반 영어의 뜻

## 문제 속 쓰임
> A shared `/scaffold-component` skill expects a component-name **argument**, but telemetry shows teammates invoke it with no **argument** or a malformed one...
> 공유 `/scaffold-component` 스킬은 컴포넌트 이름 **인자**를 받도록 되어 있지만, 텔레메트리를 보면 팀원들이 **인자** 없이 또는 잘못된 형식의 인자로 호출해...

## 함께 쓰는 표현
- **pass an argument** : 인자를 넘기다
- **command-line argument** : 명령줄 인자
- **`$ARGUMENTS`** : 스킬·커맨드에 넘어온 인자 자리 표시자

## 시험 포인트
사람이 스킬을 **인자를 빠뜨리거나 틀리게** 호출한다면, 호출할 때 입력 형식 안내가 보이도록 SKILL.md frontmatter 에 **`argument-hint`** 를 추가하는 것이 정답입니다.
