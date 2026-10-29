코드가 왜 이상하게 동작하는지 **원인을 찾아 고치는** 작업입니다. 로그·테스트를 반복해 돌리며 범위를 좁혀 가는 과정 전체를 말합니다.

## 문제 속 쓰임
> In a long **debugging** session Claude repeatedly runs the full test suite; each run dumps roughly 2,000 lines of passing-test noise into the context.
> 긴 **디버깅** 세션에서 Claude가 전체 테스트 스위트를 반복해서 실행하는데, 실행할 때마다 통과한 테스트에 관한 소음이 약 2,000줄씩 컨텍스트에 쌓입니다.

## 함께 쓰는 표현
- **debugging session** : 디버깅 세션
- **debugger** (명) 디버거 — 코드를 한 줄씩 멈춰 보며 확인하는 도구
- **debug log** : 디버그용 상세 로그

## 시험 포인트
장황한 도구 출력에 핵심 정보가 묻히면, **출력이 쌓이기 전에 실패한 테스트 줄만 남기고** 핵심 제약은 컨텍스트 앞쪽 요약에 고정하는 것이 정답입니다.
