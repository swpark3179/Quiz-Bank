한 번 생기면 **시간이 지나거나 다시 시도해도 바뀌지 않는** 상태를 말합니다. 오류 처리에서는 재시도로 풀리는 *일시적* 실패와 대비해 씁니다.

## 문제 속 쓰임
> The agent works out from `isError: true` that the failure is **permanent**, so it stops and correctly explains the refund policy to the customer.
> 에이전트가 `isError: true` 로부터 **영구적인** 실패임을 알아내고, 멈춘 뒤 고객에게 환불 정책을 올바르게 설명한다.

## 함께 쓰는 표현
- **permanent failure / error** : 재시도해도 풀리지 않는 실패
- **permanently** (부) : 영구히 — *permanently delete* 영구 삭제하다

## 비슷한 말 · 반대말
- **transient / temporary** — 일시적인 (잠시 뒤 재시도하면 풀릴 수 있음)
- **irreversible** — 되돌릴 수 없는

## 시험 포인트
이 보기는 오답입니다. `isError: true` 는 "실패했다"만 알릴 뿐 **영구적인지 일시적인지 구분하지 않습니다.** 재시도할지, 한계를 설명할지 고르려면 오류 내용에 실패 이유를 담아야 합니다.
