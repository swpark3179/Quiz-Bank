앞의 일이 끝나야 다음 일을 시작하는, **하나씩 차례로** 진행하는 방식입니다. 동시에 처리하는 *parallel*(병렬)과 짝을 이룹니다.

## 문제 속 쓰임
> ...requests `get_customer` and `lookup_order` in separate **sequential** turns even when both are needed upfront.
> 둘 다 처음부터 필요한데도 `get_customer` 와 `lookup_order` 를 별도의 **순차** 턴으로 나눠 요청한다.

## 함께 쓰는 표현
- **sequential execution / processing** : 순차 실행 / 처리
- **sequentially** (부) 차례로, 순서대로

## 반대말
- **parallel** — 병렬의, 동시에 처리하는
- **concurrent** — 동시에 진행되는

## 시험 포인트
지연·중복 문제에서 **순차 처리로 바꾸는** 선택지는 병렬성의 속도 이점을 버리기 때문에 대개 오답입니다. 서로 의존하지 않는 일은 한 번에(병렬로) 요청하는 쪽이 정답 방향입니다.
