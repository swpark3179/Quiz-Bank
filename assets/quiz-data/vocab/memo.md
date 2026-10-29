짧게 적은 **메모·사내 문서**, 또는 거래 금액을 조정할 때 발행하는 **전표**입니다. *credit memo* 는 판매자가 구매자에게 대금을 깎아 주거나 돌려줄 때 보내는 **대변 메모**입니다.

## 문제 속 쓰임
> A new vendor begins sending "credit **memo**" documents, which are not in the enum, and the model force-fits them to "invoice", ...
> 새 공급업체가 enum에 없는 "credit **memo**"(대변 메모) 문서를 보내기 시작했고, 모델은 이를 억지로 `"invoice"` 에 끼워 맞춥니다.

## 함께 쓰는 표현
- **credit memo** : 대변 메모 (대금 감액·환불 전표)
- **debit memo** : 차변 메모 (대금 추가 청구 전표)
- **internal memo** : 사내 메모

## 시험 포인트
enum 에 없는 새 유형이 기존 값으로 **억지 분류**되면 enum 에 `"other"` 값과 상세 문자열 필드를 두는 보기가 정답입니다.
