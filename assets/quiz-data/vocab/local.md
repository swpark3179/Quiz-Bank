원격 서버나 CI가 아니라 **지금 쓰는 내 컴퓨터·환경**에 있는 것을 말합니다. 부사 *locally* 는 "로컬에서, 내 머신에서".

## 문제 속 쓰임
> **Locally**, the author's Claude generates tests that follow team conventions (naming, arrange-act-assert structure).
> **로컬에서는** 작성자의 Claude가 팀 컨벤션(이름 규칙, arrange-act-assert 구조)을 따르는 테스트를 생성합니다.

## 함께 쓰는 표현
- **local machine / environment** : 로컬 머신 / 환경
- **run locally** : 로컬에서 실행하다
- **local scope** : (Claude Code 설정) 이 프로젝트에서 나에게만 적용되는 범위

## 반대말
- **remote** — 원격의 (*remote server*)

## 시험 포인트
"**로컬에서는 되는데 CI·팀원 환경에서는 안 된다**"는 증상은 설정이 `~/.claude/` 같은 사용자 범위에만 있다는 신호입니다. 커밋되는 프로젝트 범위로 옮기는 보기가 정답입니다.
