허용 범위를 **좁혀서 그 밖의 것은 못 하게** 막는다는 뜻입니다. 도구·권한 이야기에서는 "필요한 것만 쓰게 한다"(최소 권한)는 뜻이 됩니다.

## 문제 속 쓰임
> ...use `context: fork` to isolate execution, and **restrict** `allowed-tools` to file write operations.
> `context: fork` 로 실행을 격리하고, `allowed-tools` 를 파일 쓰기 작업으로 **제한한다**.

## 함께 쓰는 표현
- **restrict A to B** : A를 B로만 제한하다
- **restrict access / scope** : 접근 / 범위를 제한하다
- **restriction** (명) 제한 · **restrictive** (형) 제한적인, 엄격한

## 비슷한 말
- **limit** — 제한하다 (가장 일반적)
- **constrain** — 제약하다, 틀 안에 묶다

## 시험 포인트
위험한 작업을 막아야 할 때는 "하지 말라"는 프롬프트 지시보다 **도구 자체를 제한하는** 설정(`allowed-tools` 등)이 정답입니다. 반대로 리뷰 범위를 최근 파일로만 좁혀 철저함을 잃는 제한은 오답이 됩니다.
