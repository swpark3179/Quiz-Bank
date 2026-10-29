1. **사용법, 쓰는 방식** — 도구·명령을 올바르게 쓰는 방법
2. **사용량** — API 응답의 `usage`(입력·출력 토큰 수)처럼 얼마나 썼는지

## 문제 속 쓰임
> Document the correct **usage** in the project CLAUDE.md so it is always loaded into the model's context at startup
> 프로젝트 CLAUDE.md에 올바른 **사용법**을 문서화해, 시작 시 항상 모델의 컨텍스트에 로드되게 한다

## 함께 쓰는 표현
- **correct usage** : 올바른 사용법
- **token usage** : 토큰 사용량

## 시험 포인트
사람이 스킬을 호출할 때 인자 형식을 헷갈린다면, CLAUDE.md 에 사용법을 적기보다 SKILL.md frontmatter 의 **`argument-hint`** 로 호출 시점에 안내가 보이게 하는 것이 정답입니다.
