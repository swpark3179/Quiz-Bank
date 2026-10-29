요청·작업·메시지를 내용에 따라 **알맞은 곳으로 보내는** 것입니다. 명사로는 "경로"이고, *router* 는 보낼 곳을 정해 주는 구성 요소입니다. 미국에서는 /raʊt/ 로도 읽습니다.

## 문제 속 쓰임
> ...**route** simple classification queries to Haiku while keeping Opus for complex analysis
> 단순 질의는 Haiku로 **라우팅하되** 복잡한 분석은 Opus를 유지한다
> Treat every unsuccessful get_customer response, whatever its cause, as an escalation trigger and **route** all of them to escalate_to_human.
> 원인과 관계없이 실패한 `get_customer` 응답을 모두 에스컬레이션 트리거로 보고, 전부 `escalate_to_human` 으로 **보낸다**

## 함께 쓰는 표현
- **route A to B** : A를 B로 보내다
- **routing rules / logic** : 라우팅 규칙 / 로직

## 시험 포인트
실패를 원인과 상관없이 **전부 사람에게 보내는** 보기는 과잉 에스컬레이션이라 오답입니다. 도구가 `errorCategory`·`isRetryable` 같은 구조화된 오류를 돌려주게 해, 일시 장애는 재시도하고 사람이 필요한 경우만 넘기는 쪽이 정답입니다.
