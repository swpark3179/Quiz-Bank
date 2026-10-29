어떤 상태·의도를 **겉으로 알려 주는** 것입니다. 명사로는 "신호, 징후"이고, 미국식 철자는 *signaled / signaling* 입니다.

## 문제 속 쓰임
> For documents that lack a purchase-order number, audit logs show Claude inventing plausible-looking PO numbers about 11% of the time instead of **signaling** absence.
> 구매 주문(PO) 번호가 없는 문서에 대해, Claude가 약 11%의 경우 값이 없다고 **알리는** 대신 그럴듯해 보이는 PO 번호를 지어냅니다.

## 함께 쓰는 표현
- **signal an error / absence** : 오류 / 값이 없음을 알리다
- **a strong signal** : 강한 신호 (판단 근거)

## 시험 포인트
도구는 실패를 그냥 빈 결과나 막연한 오류로 주지 말고 **`errorCategory`·`isRetryable` 같은 구조화된 정보로 알려야** 에이전트가 재시도할지 넘길지 정합니다. 추출에서 값이 없을 때는 **nullable 필드에 null** 로 알리게 하는 것이 정답입니다.
