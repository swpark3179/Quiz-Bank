자동화된 흐름 **중간에 사람이 끼어들어 확인·승인하는** 방식입니다. 줄여서 **HITL** 이라고도 하며, 되돌리기 어려운 고위험 작업 앞에 둡니다.

## 문제 속 쓰임
> A **human-in-the-loop** gate at the `payment_approve` tool call, requiring explicit human confirmation for payments above a threshold
> `payment_approve` 도구 호출 지점에, 임계값을 넘는 지급은 사람의 명시적 확인을 요구하는 **human-in-the-loop(사람 확인)** 게이트

## 함께 쓰는 표현
- **human-in-the-loop gate / review** : 사람 승인 게이트 / 사람 검토 단계
- **human confirmation / approval** : 사람의 확인 / 승인

## 비교
- **human-in-the-loop** — 실행 *전에* 사람이 승인 (예방)
- **post-hoc audit** — 실행 *뒤에* 기록을 검토 (사후 발견)

## 시험 포인트
큰 금액 지급처럼 **되돌리기 어려운 작업**은 프롬프트 지시나 사후 로그가 아니라, 도구 호출 지점의 **사람 승인 게이트** 같은 구조적 통제가 정답입니다.
