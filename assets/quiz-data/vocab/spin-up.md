서버·컨테이너·에이전트 같은 것을 **새로 띄워 돌아가게 하는** 것입니다. 하이픈을 붙인 *spin-up* 은 명사(가동, 기동)로 씁니다.

## 문제 속 쓰임
> **Spin up** a dedicated formatting subagent that the coordinator calls after every backend lookup to rewrite the raw fields.
> 백엔드 조회가 끝날 때마다 코디네이터가 호출해 원본 필드를 다시 쓰게 하는 전용 포맷팅 서브에이전트를 **띄운다**

## 함께 쓰는 표현
- **spin up an instance / a container** : 인스턴스 / 컨테이너를 띄우다
- **spin down** : (돌던 것을) 내리다, 정지하다

## 시험 포인트
형식 정규화처럼 규칙이 정해진 일에 **서브에이전트를 새로 띄우는** 보기는 비용·지연만 늘리는 과잉 설계입니다. 도구 출력을 `PostToolUse` 훅에서 **코드로 정규화**하는 쪽이 정답입니다.
