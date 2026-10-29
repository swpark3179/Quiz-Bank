어떤 값이 **넘을 수 없는 최대 한도**입니다. 반대말은 *lower bound*(하한)입니다.

## 문제 속 쓰임
> Retry get_customer automatically in a tight loop until the database answers, with no **upper bound** on attempts or backoff delay.
> 데이터베이스가 응답할 때까지 시도 횟수 **상한**이나 백오프 지연 없이 `get_customer` 를 촘촘한 루프로 자동 재시도한다.

## 함께 쓰는 표현
- **set an upper bound on** ~ : ~에 상한을 두다
- **cap** (명·동) 상한(을 두다) — *max-iteration cap* 최대 반복 횟수 상한

## 시험 포인트
상한 없는 재시도는 장애를 키우는 오답입니다. 재시도에는 **횟수 상한과 백오프**를 두고, 도구는 재시도 가능 여부를 알리는 구조화된 오류를 돌려줘야 합니다.
