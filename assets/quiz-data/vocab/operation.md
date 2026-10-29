1. **작업, 연산, 동작** — 프로그램이 수행하는 하나의 처리 단위 (*git operations* git 작업, *write operation* 쓰기 작업)
2. **운영, 가동** — 시스템을 실제로 돌리는 일 (*operations team* 운영팀, 줄여서 *ops*)

## 문제 속 쓰임
> Add 'Always run fraud check before payment **operations**' to the system prompt
> 시스템 프롬프트에 "결제 **작업** 전에는 항상 사기 검사를 실행하라"를 추가한다

## 함께 쓰는 표현
- **read / write operation** : 읽기 / 쓰기 작업
- **destructive operation** : 되돌릴 수 없는 파괴적 작업
- **operational** (형) 운영(상)의, 가동 중인

## 시험 포인트
"결제 **작업** 전에 반드시 사기 검사" 같은 순서 보장은 프롬프트 지시가 아니라 **훅으로 강제**해야 합니다. 시스템 프롬프트에 규칙을 추가하는 보기는 확률적이라 오답입니다.
