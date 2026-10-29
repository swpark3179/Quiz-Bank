값 여러 개를 **순서대로 담은 자료 구조**입니다. JSON 에서는 대괄호 `[ ]` 로 씁니다.

## 문제 속 쓰임
> Register the conventions in a `.claude/config.json` commands **array** so that they sync with the repository on clone
> 저장소를 클론할 때 함께 동기화되도록 규칙을 `.claude/config.json` 의 commands **배열**에 등록한다

## 함께 쓰는 표현
- **an array of strings / objects** : 문자열 / 객체 배열
- **`"type": "array"`** : JSON 스키마의 배열 타입

## 시험 포인트
Claude Code 에는 `.claude/config.json` 의 commands 배열 같은 메커니즘이 없습니다. 이렇게 **그럴듯하게 지어낸 설정**을 쓰는 보기는 오답이고, 팀 공유 지침은 커밋되는 **CLAUDE.md** 에 둡니다.
