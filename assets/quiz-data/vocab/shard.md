큰 데이터베이스를 **여러 서버에 나눠 담았을 때의 조각 하나**가 샤드입니다. 이렇게 나누는 것을 *sharding*, 나눠 저장한 상태를 *sharded* 라고 합니다. 한 서버가 감당하기 어려운 데이터를 분산하려고 씁니다.

## 문제 속 쓰임
> That the handler is written in Go and queries a **sharded** PostgreSQL cluster through an internal ORM.
> 핸들러가 Go 로 작성되었고 내부 ORM 을 통해 **샤딩된** PostgreSQL 클러스터를 조회한다는 것.

## 함께 쓰는 표현
- **sharded database / cluster** : 샤딩된 데이터베이스·클러스터
- **shard key** : 데이터를 어느 샤드에 넣을지 정하는 기준 값
- **across shards** : 여러 샤드에 걸쳐

## 비슷한 말
- **partition** — 데이터를 나눈 구획 (같은 서버 안의 분할까지 포함하는 더 넓은 말)

## 시험 포인트
이 보기가 정답, 즉 도구 설명에 넣을 **가장 쓸모없는 내용**입니다. 구현 언어나 *sharded* 저장 구조 같은 내부 세부는 Claude 가 도구를 언제·어떻게 쓸지 판단하는 데 도움이 안 되고 토큰만 씁니다.
