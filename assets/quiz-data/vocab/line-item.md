청구서·송장에서 **한 줄에 하나씩 적힌 개별 품목**(품명·수량·금액)입니다. *line-item amounts* 처럼 명사 앞에서 하이픈으로 묶으면 "품목별 ~"이 됩니다.

## 문제 속 쓰임
> However, reconciliation shows 6% of extracted invoices have **line-item** amounts that do not sum to the stated invoice total.
> 그런데 대사(reconciliation) 결과, 추출된 인보이스의 6%에서 **품목별** 금액의 합이 명시된 인보이스 총액과 맞지 않는다.

## 함께 쓰는 표현
- **line items** : (송장의) 품목 행들
- **sum to** ~ : 합계가 ~이 되다
- **invoice total** : 송장 총액

## 시험 포인트
스키마는 **모양(구조·타입)** 만 보장하고, "품목 합 = 총액" 같은 **의미 검증**은 해 주지 않습니다. 다운스트림에서 합계를 다시 계산해 불일치를 표시하거나 재시도하는 보기가 정답입니다.
