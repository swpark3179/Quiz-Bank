원래 뜻은 '떨림, 흔들림'입니다. 재시도에서는 모든 클라이언트가 똑같은 간격으로 다시 보내면 같은 순간에 몰리므로, **대기 시간에 무작위 값을 조금 섞어 흩어지게** 하는 것을 말합니다. 보통 지수 백오프와 짝을 이룹니다.

## 문제 속 쓰임
> Treat the 409 as a server-side outage and retry later with exponential backoff and **jitter**.
> 409를 서버 측 장애로 보고 **지터**를 섞은 지수 백오프로 나중에 재시도한다

## 함께 쓰는 표현
- **exponential backoff and jitter** : 지터를 섞은 지수 백오프
- **jittered backoff** : 지터를 섞은 백오프
- **add jitter** : 대기 시간에 무작위성을 더하다

## 시험 포인트
백오프·지터는 **일시적 오류에 맞는 처방**이지 만능이 아닙니다. 409 충돌은 충돌을 먼저 해소해야 하고, `enforced_spend_limit_reached` 인 429 는 재시도를 멈추고 등급 상향·대기로 넘겨야 해서, 두 문항 모두 지터 보기가 오답이었습니다.
