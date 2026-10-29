`*`(아무 문자열), `**`(하위 폴더 전체) 같은 **와일드카드 패턴으로 파일 경로를 고르는** 방식입니다. Claude Code 의 **Glob** 도구는 이름·경로 패턴으로 파일을 찾고, 파일 내용 검색은 **Grep** 도구가 맡습니다.

## 문제 속 쓰임
> Declare `allowed-tools` in the skill's SKILL.md frontmatter limited to Read/**Glob**/Write so the harness blocks Edit and Bash
> 스킬의 SKILL.md frontmatter에 `allowed-tools` 를 `Read`, **`Glob`**, `Write` 로 제한해 선언하고, 하네스가 `Edit` 과 `Bash` 를 차단하게 한다

## 함께 쓰는 표현
- **glob pattern** : 글롭 패턴 (예: `src/**/*.test.ts`)
- **globbing** : 글롭 패턴으로 파일 목록을 펼치는 것

## 비교
- **Glob** — 파일 **이름·경로** 패턴으로 찾기
- **Grep** — 파일 **내용**에서 문자열·정규식 찾기
