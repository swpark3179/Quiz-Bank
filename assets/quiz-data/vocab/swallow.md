원래 뜻은 "삼키다"이고, 프로그래밍에서는 오류를 **잡아 놓고 기록·처리·재전달 없이 조용히 사라지게 하는 것**을 말합니다. 겉으로는 정상처럼 보이지만 문제가 숨겨지므로 대표적인 안티패턴입니다.

## 문제 속 쓰임
> ...and a `catch` around a payment write that **swallows** the error, marked as an issue, each with a one-line reason
> ...결제 쓰기를 감싸 오류를 **삼키는** `catch` 는 "문제"로 표시하고 각각 한 줄 이유를 붙인다.

## 함께 쓰는 표현
- **swallow an error / exception** : 오류·예외를 삼키다
- **silently swallowed** : 아무 흔적 없이 삼켜진
- **log and rethrow** : 기록하고 다시 던지다 (삼키지 않는 처리)

## 비슷한 말 · 반대말
- **suppress** — (경고·오류를) 억누르다, 표시하지 않다
- **rethrow / propagate** — 다시 던지다, 위로 전파하다

## 시험 포인트
겉모습이 같은 `catch` 라도 **오류가 드러나는가(log and rethrow), 사라지는가(swallow)** 가 판단 요인입니다. 이 한 가지만 다른 대비 예시 쌍에 이유를 달아 주는 퓨샷이 정답입니다.
