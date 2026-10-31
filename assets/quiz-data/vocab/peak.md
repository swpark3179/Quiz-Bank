양이나 정도가 **가장 높이 올라간 때·지점**을 말합니다. 서비스 문제에서는 *peak hours* 처럼 **사용량이 몰리는 시간대**를 가리킬 때가 많습니다.

## 문제 속 쓰임
> During **peak** hours, some streamed responses stop partway through and are never retried.
> **사용량이 많은 시간대**에 일부 스트리밍 응답이 중간에 멈추는데, 재시도되지 않는다.

## 함께 쓰는 표현
- **peak hours** : 사용량이 가장 많은 시간대
- **peak load / peak traffic** : 최대 부하, 최대 트래픽
- **reach a peak** : 정점에 이르다

## 비슷한 말 · 반대말
- **busy hours** — 바쁜 시간대 (비슷한 뜻)
- **off-peak** — 사용량이 적은 시간대

## 시험 포인트
*peak hours* 는 **과부하(`overloaded_error`, 529)** 가 날 수 있다는 단서입니다. 스트림이 HTTP 200으로 시작된 뒤에는 과부하가 스트림 안의 `error` 이벤트로 오므로, 상태 코드만 보는 재시도 로직이 놓칩니다.
