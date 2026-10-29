유닉스 명령 `grep` 에서 나온 말로, 파일 **내용에서 문자열·정규식 패턴을 찾는** 것입니다. 동사로 *grep the codebase*(코드베이스를 grep 하다)처럼 쓰며, Claude Code 에는 같은 일을 하는 **Grep** 도구가 있습니다.

## 문제 속 쓰임
> Your team's /investigate-flaky skill **greps** the entire test suite, reads dozens of files, and prints verbose exploration before it answers.
> 팀의 `/investigate-flaky` 스킬은 테스트 스위트 전체를 **grep으로 검색하고**, 수십 개 파일을 읽고, 답하기 전에 장황한 탐색 과정을 출력한다.

## 함께 쓰는 표현
- **grep for** ~ : ~을 grep 으로 찾다 (*greps stdout for "CRITICAL"*)
- **grep -r** : 하위 폴더까지 재귀적으로 검색

## 시험 포인트
스킬이 grep·파일 읽기로 **장황한 출력을 메인 세션에 쏟아낸다면**, SKILL.md frontmatter 에 `context: fork` 를 설정해 **격리된 컨텍스트**에서 실행하고 결과만 받는 보기가 정답입니다. 또 모델의 자연어 출력을 grep 해서 빌드를 판정하는 방식은 불안정합니다.
