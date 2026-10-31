응급실에서 환자를 **위급한 순서대로 분류해 치료 순서를 정하는 것**에서 온 말입니다. 지원 티켓·버그·알림처럼 들어오는 건을 긴급도·종류별로 나눠 **누가, 얼마나 급하게, 어떤 절차로** 처리할지 정하는 첫 단계를 뜻합니다.

## 문제 속 쓰임
> A support-ticket **triage** system always invokes a full pipeline of five subagents ... for every incoming ticket, including simple one-line requests that only need classification.
> 지원 티켓 **분류** 시스템이 분류만 필요한 한 줄짜리 요청까지 포함해, 들어오는 모든 티켓에 다섯 서브에이전트의 전체 파이프라인을 항상 호출합니다.

## 함께 쓰는 표현
- **ticket triage** : 티켓 분류
- **triage step** : 뒤 처리를 정하는 분류 단계
- **triage alerts** : 알림을 분류해 우선순위를 정하다

## 비슷한 말
- **classify** — 분류하다 (*triage* 는 처리 순서·담당까지 정한다는 점이 다름)
- **prioritize** — 우선순위를 정하다

## 시험 포인트
모든 티켓에 전체 파이프라인을 돌리지 말고, 코디네이터가 가벼운 분류 프롬프트로 **복잡도와 필요한 서브에이전트**를 JSON 으로 받아 그것만 호출하는 것이 정답입니다. 배치 문제에서도 단일 패스 *triage* 단계만 배치로 돌리고 도구 호출 에이전트는 동기 API 에 둡니다.
