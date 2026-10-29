*Purchase Order* 의 약자로, 구매자가 공급업체에 보내는 **구매 주문서**입니다. *PO number* 는 그 주문서의 식별 번호입니다.

## 문제 속 쓰임
> ...audit logs show Claude inventing plausible-looking **PO** numbers about 11% of the time instead of signaling absence.
> 감사 로그를 보면 Claude가 약 11%의 경우 값이 없다고 알리는 대신 그럴듯해 보이는 **PO** 번호를 지어낸다.

## 함께 쓰는 표현
- **PO number** : 구매 주문 번호
- **invoice** : (공급업체가 보내는) 청구서

## 시험 포인트
값이 없는데 그럴듯한 값을 지어내면, 필드를 **nullable** 로 만들고 "원문에 없으면 null" 이라고 지시하는 보기가 정답입니다.
