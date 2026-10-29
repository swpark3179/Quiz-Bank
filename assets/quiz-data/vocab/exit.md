1. **(프로그램·과정이) 종료하다, 빠져나오다**
2. **종료 (코드)** — 프로그램이 끝나며 돌려주는 숫자 (*exit code*)

## 문제 속 쓰임
> Add a `PreToolUse` hook that checks the command and **exits** with code 2 to block it
> 명령을 검사해 종료 코드 2로 **끝내** 차단하는 `PreToolUse` 훅을 추가한다

## 함께 쓰는 표현
- **exit code** : 종료 코드 (0 = 성공, 그 밖 = 오류 등)
- **exit with code 2** : 종료 코드 2로 끝나다
- **exit the loop** : 루프를 빠져나오다

## 시험 포인트
Claude Code 의 `PreToolUse` 훅이 **종료 코드 2** 로 끝나면 그 도구 호출이 **차단**됩니다. 프롬프트 지시와 달리 확실하게 막는 결정적(deterministic) 수단입니다.
