사는 쪽이 파는 쪽에 **무엇을 얼마에 사겠다고 공식적으로 보내는 주문 문서**입니다. 줄여서 **PO** 라고 하며, 문서마다 붙는 *PO number*(발주 번호)로 송장·납품 내역과 맞춰 봅니다.

## 문제 속 쓰임
> For documents that lack a **purchase-order** number, audit logs show Claude inventing plausible-looking PO numbers about 11% of the time instead of signaling absence.
> **구매 주문(PO)** 번호가 없는 문서에 대해, 감사 로그를 보면 Claude가 약 11%의 경우 값이 없다고 알리는 대신 그럴듯해 보이는 PO 번호를 지어낸다.

## 함께 쓰는 표현
- **PO number** : 구매 주문 번호, 발주 번호
- **issue a purchase order** : 발주서를 내다

## 비교
- **purchase order** — 사는 쪽이 보내는 주문서
- **invoice** — 파는 쪽이 보내는 대금 청구서(송장)

## 시험 포인트
원문에 없는 값을 지어내는 문제에는 필드를 **nullable** 로 만들고 "없으면 null" 을 지시하는 보기가 정답입니다. 신뢰도 점수 필드나 정상 PO 번호만 보여 주는 예시는 오답입니다.
