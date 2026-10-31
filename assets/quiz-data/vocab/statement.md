1. **(코드의) 문, 구문** — 코드에서 하나의 동작을 하는 단위입니다 (*log statement* 로그를 찍는 문, *if statement* 조건문)
2. **진술, 서술** — 어떤 사실·주장을 말로 표현한 것 (*Which statement is correct?* 어느 설명이 옳은가?)
3. **(은행) 거래 내역서** — 계좌의 입출금을 정리한 문서 (*bank statement*)

## 문제 속 쓰임
> A developer wants Claude Code to update a deprecated log **statement** `logger.warn("legacy-path")` that appears twice in the same file...
> 개발자가 같은 파일에 두 번 나오는 폐기된 로그 **문** `logger.warn("legacy-path")` 를 Claude Code 로 고치려 합니다...

> A financial services firm uses a tool-based schema to extract transaction records from PDF **statements**...
> 한 금융 회사가 도구 기반 스키마로 PDF 거래 **내역서**에서 거래 레코드를 추출합니다...

## 함께 쓰는 표현
- **log statement** : 로그 출력 문
- **problem statement** : 문제 정의
- **bank statement** : 은행 거래 내역서

## 시험 포인트
같은 로그 문이 파일에 두 번 있으면 Edit 가 실패합니다. `old_string` 은 **정확히 한 번** 나와야 하므로 대상 함수의 이웃 줄을 덧붙여 고유하게 만든 뒤 다시 시도합니다. `replace_all` 은 두 곳을 모두 바꿉니다.
