한도가 있는 것을 **남김없이 다 써 버리는** 것입니다. 재시도 횟수·메모리·예산 같은 *자원*에 쓰며, 사람에게 쓰면 "지치게 하다"가 됩니다.

## 문제 속 쓰임
> ...returning a generic "search unavailable" status only after all retries are **exhausted**.
> 재시도를 모두 **소진한** 뒤에야 일반적인 "search unavailable" 상태만 반환한다.

## 함께 쓰는 표현
- **retries are exhausted** : 재시도 횟수를 다 썼다
- **exhaust the budget / resources** : 예산·자원을 다 쓰다
- **exhaustive** (형) 빠짐없는 · **exhaustive list** 전체 목록

## 시험 포인트
재시도를 다 쓴 뒤 **"unavailable" 같은 뭉뚱그린 상태만** 돌려주는 보기는 오답이 되기 쉽습니다. 상위에서 복구를 판단하려면 실패 유형·시도한 쿼리·부분 결과 같은 **구조화된 맥락**이 필요합니다.
