**컨텍스트 창이 더 큰**, 즉 한 번에 더 많은 토큰을 담을 수 있는 모델을 말합니다. *a larger-context model* 처럼 명사 앞에서 하이픈으로 묶어 씁니다.

## 문제 속 쓰임
> Switch to a **larger-context** model so the whole 200-file list stays inside the window for the entire length of the session.
> **컨텍스트 창이 더 큰** 모델로 바꿔, 세션 내내 200개 파일 목록 전체가 창 안에 머물게 한다

## 함께 쓰는 표현
- **larger context window** : 더 큰 컨텍스트 창
- **context window** : 모델이 한 번에 볼 수 있는 토큰 범위

## 시험 포인트
"더 큰 컨텍스트 모델로 바꾼다"는 거의 항상 **오답**입니다. 창이 커져도 소음이 쌓이면 주의가 분산되므로, 출력 다듬기·요약·서브에이전트 위임·진행 기록 파일처럼 **넣는 내용을 관리하는** 보기가 정답입니다.
