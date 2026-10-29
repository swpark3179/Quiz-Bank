1. **(처한) 상황, 상태** — 문제에서처럼 "이런 경우, 이 상황"을 가리킬 때
2. **조건** — 어떤 일이 일어나려면 맞아야 하는 것 (조건문, 종료 조건)

## 문제 속 쓰임
> How should the tool signal this **condition**?
> 도구는 이 **상황**을 어떻게 알려야 할까요?

## 함께 쓰는 표현
- **error condition** : 오류 상황
- **stop / exit condition** : 종료 조건
- **race condition** : 경쟁 상태 — 실행 순서에 따라 결과가 달라지는 버그
- **conditional** (형) 조건부의

## 시험 포인트
여기서 "이 상황"은 정책 한도를 넘어 생긴 **영구 거절**입니다. 구분 없는 `isError` 대신 `errorCategory: "business"` + `isRetryable: false` 처럼 **구조화해 알리는** 보기가 정답입니다.
