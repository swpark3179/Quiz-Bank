그래프에서 뾰족하게 솟은 모양처럼 **짧은 시간에 갑자기 크게 늘어나는 것**을 말합니다. 트래픽·지연 시간·비용 등이 평소보다 확 튈 때 씁니다.

## 문제 속 쓰임
> An acceleration limit from a traffic **spike**, which clears within a few retries once traffic steadies.
> 트래픽 **급증**으로 생긴 가속 한도. 트래픽이 안정되면 몇 번의 재시도 안에 풀린다.

## 함께 쓰는 표현
- **traffic spike** : 트래픽 급증
- **latency spike** : 지연 시간 급등
- **a spike in** ~ : ~의 급증

## 비슷한 말 · 반대말
- **surge** — 급증 (조금 더 이어지는 증가에도 씀)
- **dip** — 일시적 하락

## 시험 포인트
가속 한도는 급증 **직후의 일시적** 제한이라, 몇 시간째 모든 요청이 막히는 상황과 맞지 않습니다. *429 + `retry-after` 없음 + 몇 시간째* 는 사용 등급의 월 지출 상한 신호입니다.
