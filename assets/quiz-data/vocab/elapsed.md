어떤 일이 시작된 뒤로 **시간이 얼마나 흘렀는지**를 말합니다. 로그·모니터링에서 *elapsed time* 은 작업에 걸린 시간(소요 시간)을 기록하는 필드입니다.

## 문제 속 쓰임
> Retry count, call timestamp, **elapsed** time, and the identifier of the subagent that ran the failed task
> 재시도 횟수, 호출 시각, **경과** 시간, 실패한 작업을 실행한 서브에이전트 ID

## 함께 쓰는 표현
- **elapsed time** : 경과 시간, 소요 시간
- **time has elapsed** : 시간이 지났다
- **after 5 minutes have elapsed** : 5분이 지난 뒤

## 시험 포인트
횟수·시각·*elapsed time*·ID 는 기록용 메타데이터일 뿐, 코디네이터가 **다음에 무엇을 할지** 정하는 데는 도움이 안 됩니다. 실패 범주·시도한 작업·부분 결과·대안을 담은 보기가 정답입니다.
