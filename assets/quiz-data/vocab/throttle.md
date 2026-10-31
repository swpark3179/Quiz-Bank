원래 엔진의 연료 밸브를 조여 속도를 줄인다는 뜻으로, 시스템에서는 **처리 속도나 요청 수를 일부러 제한해 늦추는 것**을 말합니다. 아예 막는 것(*block*)과 달리 "받기는 받되 천천히" 처리한다는 느낌입니다.

## 문제 속 쓰임
> It is accepted but **throttled** to 1,000 requests per hour, so the team should spread the work across several nights
> 받아들여지지만 시간당 1,000건으로 **제한되므로**, 작업을 여러 밤에 나눠야 한다.

## 함께 쓰는 표현
- **throttle requests** : 요청 속도를 제한하다
- **get throttled** : 속도 제한에 걸리다
- **throttling or banning** : 속도 제한 또는 차단

## 비슷한 말
- **rate-limit** — 일정 시간당 요청 수를 제한하다
- **ban** — 아예 차단하다

## 시험 포인트
이 보기는 오답입니다. Message Batches 에는 **시간당 처리 건수 상한이 없고**, 배치 하나가 요청 100,000건 또는 256 MB 중 먼저 닿는 쪽까지입니다. 반면 같은 거절을 반복 유발하는 계정에는 경고 후 *throttling*·차단 같은 계정 단위 조치가 정답입니다.
