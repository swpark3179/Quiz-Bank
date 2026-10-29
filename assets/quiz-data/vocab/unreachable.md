네트워크·서버 등에 **접속이 닿지 않는** 상태입니다. 데이터가 없는 것이 아니라 **지금 가져올 수 없는** 것이라는 점이 핵심입니다.

## 문제 속 쓰임
> When the customer database is briefly **unreachable**, get_customer returns a plain empty result...
> 고객 데이터베이스에 잠시 **접속할 수 없을** 때 `get_customer` 가 그냥 빈 결과를 반환하면...

## 함께 쓰는 표현
- **server / host is unreachable** : 서버·호스트에 연결할 수 없다
- **reachable** (형) 접속 가능한 · **reach** (동) 닿다, 연결되다

## 시험 포인트
"접속 불가"를 "빈 결과"로 돌려주면 에이전트는 **결과 없음**으로 오해합니다. 일시적 오류임을 알리는 **구조화된 오류**(오류 종류·재시도 가능 여부)를 반환하는 보기가 정답입니다.
