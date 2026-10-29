1. **치환** — 찾은 문자열을 다른 문자열로 바꿔 넣기 (`sed 's/old/new/g'` 의 `s` 가 substitute)
2. **대체** — 어떤 것 대신 다른 것을 쓰기

## 문제 속 쓰임
> Switch to a Bash sed global **substitution** that rewrites every occurrence and bypasses the Edit tool entirely.
> `Bash` 의 `sed` 전역 **치환**으로 바꿔 모든 위치를 다시 쓰고, `Edit` 도구는 완전히 우회한다

## 함께 쓰는 표현
- **global substitution** : 전역 치환 — 일치하는 곳을 모두 바꿈
- **substitute A for B** : B 대신 A를 쓰다
- **substitute** (동) 대신 넣다, 바꿔 넣다

## 시험 포인트
`Edit` 이 고유 일치를 못 찾을 때 `sed` 치환으로 우회하는 보기는 오답입니다. 정답은 `Read` 로 파일 전체를 읽고 바꾼 내용을 `Write` 로 다시 쓰는 폴백입니다.
