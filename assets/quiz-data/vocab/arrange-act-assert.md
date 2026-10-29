단위 테스트를 **준비(Arrange: 입력·초기 상태 준비) → 실행(Act: 대상 동작 실행) → 검증(Assert: 결과 확인)** 세 구획으로 나눠 쓰는 관례입니다. 줄여서 **AAA 패턴**이라고 합니다.

## 문제 속 쓰임
> Locally, the author's Claude generates tests that follow team conventions (naming, **arrange-act-assert** structure).
> 로컬에서는 작성자의 Claude가 팀 컨벤션(이름 규칙, **arrange-act-assert** 구조)을 따르는 테스트를 생성합니다.

## 비슷한 말
- **Given-When-Then** — BDD 에서 같은 구조를 부르는 말

## 시험 포인트
이런 팀 컨벤션이 작성자의 `~/.claude/CLAUDE.md`(사용자 범위)에만 있으면 CI·다른 팀원에게는 적용되지 않습니다. 커밋되는 **프로젝트 CLAUDE.md** 로 옮기는 것이 정답입니다.
