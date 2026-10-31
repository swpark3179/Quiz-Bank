진행되던 일이 **도중에 멎어 꼼짝 않는 상태**를 말합니다. 완전히 실패한 것이 아니라 *멈춘 채로 시간이 흘러가는* 느낌이라, 응답이 오래 안 오는 요청이나 진척이 없는 작업에 씁니다.

## 문제 속 쓰임
> During an overload incident, logs show far more attempts per job than expected and long **stalls**.
> 과부하 장애 중 로그를 보니 작업당 시도 횟수가 예상보다 훨씬 많고 **오래 멈춰** 있습니다.

## 함께 쓰는 표현
- **long stalls** : 오랜 멈춤
- **stall out** : 진행이 멎다
- **stalled request** : 응답 없이 멈춰 있는 요청

## 비슷한 말
- **hang** — (프로그램이) 응답 없이 멈추다
- **delay** — 지연 (*stall* 은 아예 멎은 느낌이 더 강함)

## 시험 포인트
SDK 는 5xx·429 같은 일시적 오류를 **기본 2회** 백오프로 자동 재시도합니다. 바깥에 재시도 루프를 또 감싸면 시도 횟수와 대기가 곱으로 늘어 *long stalls* 가 생기므로, 재시도는 `max_retries` 한 계층에서만 관리합니다.
