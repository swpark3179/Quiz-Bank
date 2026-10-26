**어떤 조건이 맞을 때만** 적용·실행되는 것입니다. 설정 문제에서는 파일 경로 같은 **조건에 따라 규칙을 골라 적용**하는 방식을 말합니다.

## 문제 속 쓰임
> Create rule files in `.claude/rules/` with YAML frontmatter specifying glob patterns to **conditionally** apply conventions based on file paths.
> `.claude/rules/` 에 glob 패턴을 지정한 YAML frontmatter 규칙 파일을 만들어, 파일 경로에 따라 컨벤션을 **조건부로** 적용한다.

## 함께 쓰는 표현
- **conditional logic** : 조건 분기 로직
- **conditional on** ~ : ~을 조건으로 하는
- **conditionally** (부) 조건에 따라

## 시험 포인트
파일 위치·종류에 따라 규칙을 **조건부로 자동 적용**하려면 `.claude/rules/` 의 glob 패턴이 정답으로 나옵니다. 반대로 공유 스킬에 사용자 이름 같은 **조건 로직을 끼워 넣는** 선택지는 공유 파일을 오염시켜 오답입니다.
