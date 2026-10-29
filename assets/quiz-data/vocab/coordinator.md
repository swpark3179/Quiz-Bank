멀티 에이전트 시스템에서 **일을 나눠 서브에이전트에게 맡기고, 결과를 모아 정리하는** 중앙 에이전트입니다. 허브 앤 스포크 구조의 *hub* 에 해당합니다.

## 문제 속 쓰임
> The **coordinator** has already run get_customer and confirmed the account, then spawns subagents to check order history and refund eligibility in parallel.
> **코디네이터**가 이미 `get_customer` 를 실행해 계정을 확인한 뒤, 주문 이력과 환불 자격을 병렬로 확인하는 서브에이전트들을 생성합니다.

## 함께 쓰는 표현
- **coordinator agent** : 조정(총괄) 에이전트
- **coordinate** (동) 조정하다, 맞춰 진행하다 · **coordination** (명) 조정

## 비슷한 말
- **orchestrator** — 같은 역할을 부르는 다른 이름
- **hub (agent)** — 허브 앤 스포크 구조에서의 중심 에이전트

## 시험 포인트
서브에이전트는 코디네이터의 맥락을 **자동으로 물려받지 않습니다**. 확인된 식별자·앞 단계 결과는 코디네이터가 **Task 프롬프트에 명시적으로** 넣어 줘야 합니다.
