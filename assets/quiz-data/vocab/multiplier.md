기준값에 **곱해지는 수**입니다. 가격 문서에서는 *1.25x*, *1.1x* 처럼 기본 단가에 곱하는 값을 말하고, 동사 *multiply* 는 '곱하다, 몇 배로 불어나다'입니다.

## 문제 속 쓰임
> ...so the two layers **multiply** attempts; remove the outer loop or tune the client's max_retries.
> ...두 계층의 시도가 **곱해진다**. 바깥 루프를 없애거나 클라이언트의 `max_retries` 를 조정한다

> The cache-read **multiplier**, the 50% batch discount, and the 1.1x data residency **multiplier** all stack on the base input price
> 캐시 읽기 **배수**, 50% 배치 할인, 1.1배 데이터 레지던시 **배수**가 모두 기본 입력 가격 위에 겹쳐 적용된다

## 함께 쓰는 표현
- **price multiplier** : 가격 배수
- **stack** : (할인·배수가) 겹쳐 적용되다
- **multiply attempts** : 시도 횟수를 몇 배로 늘리다

## 시험 포인트
SDK 가 이미 기본 2회 재시도하는데 바깥에서 5회를 또 감싸면 시도가 **곱해져** 크게 늘어나므로, 재시도는 `max_retries` 한 계층에서만 관리합니다. 가격 문항에서는 캐시 배수·배치 할인·데이터 레지던시 배수가 서로를 대체하지 않고 **겹쳐 적용**됩니다.
