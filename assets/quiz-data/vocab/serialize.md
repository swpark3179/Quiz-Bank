1. **순서대로 하나씩 처리하다** — 동시에 실행하던 작업을 차례로 줄 세워, 서로 부딪히지 않게 한다
2. **(데이터를) 직렬화하다** — 객체를 JSON 같은 저장·전송용 형식으로 바꾼다

## 문제 속 쓰임
> Resolve the conflict first, for example by **serializing** the workers or choosing a unique value, then retry.
> 먼저 충돌을 해소한다. 예를 들어 워커를 **차례로 실행하게 하거나** 고유한 값을 고른 뒤 재시도한다.

## 함께 쓰는 표현
- **serialize the workers** : 워커들을 순차 실행하다
- **serialize to JSON** : JSON 으로 직렬화하다
- **serialization** (명) : 순차화, 직렬화

## 비슷한 말 · 반대말
- **sequential** — 순차적인 (1번 뜻과 비슷)
- **parallel / concurrent** — 병렬의 / 동시의

## 시험 포인트
이 보기가 정답입니다. 409 `conflict_error` 는 요청이 리소스의 **현재 상태와 충돌**한다는 뜻이라, 워커를 *serialize* 하거나 고유 값을 바꿔 충돌을 없앤 뒤 재시도해야 합니다. 재시도 횟수만 늘리면 같은 409 가 반복됩니다.
