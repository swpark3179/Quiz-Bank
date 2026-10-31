*tenant* 는 '세입자'입니다. 한 건물에 여러 세입자가 살듯 **하나의 앱·서버를 여러 고객(조직)이 함께 쓰는** 구조이며, 고객끼리 데이터와 대화는 **반드시 분리**되어야 합니다.

## 문제 속 쓰임
> A **multi-tenant** support app built on the Agent SDK serves many customers from the same working directory...
> Agent SDK로 만든 **멀티테넌트** 지원 앱이 같은 작업 디렉터리에서 많은 고객을 상대합니다.

## 함께 쓰는 표현
- **tenant** : 테넌트 (시스템을 쓰는 고객·조직 하나)
- **tenant isolation** : 테넌트 간 데이터 분리

## 비슷한 말 · 반대말
- **single-tenant** — 한 고객 전용 (반대말)

## 시험 포인트
대화가 여러 개면 **고객별 세션 ID 를 저장해 `resume` 에 넘기는** 것이 정답입니다. `continue` 는 디렉터리의 가장 최근 세션을 이어 가므로, 멀티테넌트에서는 남의 대화를 잇는 함정입니다.
