서버·DB·API 같은 곳에 가서 데이터를 **가져오는** 것입니다. *get*, *retrieve* 와 비슷하며, *refetch / re-fetch* 는 이미 가져온 것을 **다시 가져오는** 것입니다.

## 문제 속 쓰임
> Call get_customer and lookup_order again on every turn to **refetch** the numbers, then overwrite the stored summary with the fresh results.
> 매 턴 `get_customer` 와 `lookup_order` 를 다시 호출해 숫자를 **새로 가져온** 뒤, 저장된 요약을 새 결과로 덮어쓴다

## 함께 쓰는 표현
- **fetch data / records** : 데이터·레코드를 가져오다
- **refetch** : 다시 가져오다
- **prefetch** : 필요해지기 전에 미리 가져오다

## 시험 포인트
*Gets user information* / *Fetches account details* 처럼 **동사만 다른 도구 설명**은 모델이 두 도구를 구분할 단서가 못 되므로, 언제 부르는지·무엇을 돌려주는지를 적는 보기가 정답입니다. 요약 뒤 숫자가 틀어질 때 **매 턴 다시 조회**하는 보기는 원인(손실 요약)을 고치지 못하는 오답입니다.
