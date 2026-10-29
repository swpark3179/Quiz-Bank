1. **권한, 처리 한도** — 스스로 결정·처리할 수 있는 범위 (*the agent's $500 authority*)
2. **권위, 권위 있는 출처** — 믿을 만한 기준이 되는 사람·기관 (형용사 *authoritative*)

## 문제 속 쓰임
> For refunds above the agent's $500 **authority**, process_refund correctly declines, but it returns a generic isError response.
> 에이전트의 환불 **권한**($500)을 넘는 환불에 대해 `process_refund` 는 올바르게 거절하지만, 구분 없는 일반 `isError` 응답을 반환합니다.

## 함께 쓰는 표현
- **have the authority to** ~ : ~할 권한이 있다
- **beyond one's authority** : 권한 밖의

## 시험 포인트
권한(한도) 초과는 다시 해도 결과가 같은 **비즈니스 오류**입니다. `errorCategory: "business"`, `isRetryable: false` 로 알려 재시도 대신 **에스컬레이션**하게 해야 합니다.
