물건을 **실어 나르는 운송·배송 회사**입니다(*shipping carrier*). "무언가를 맡아 나르는 회사"라는 뜻으로 넓게 써서, 보험 문맥의 *insurance carrier* 는 '보험사', 통신 문맥에서는 '통신사'가 됩니다.

## 문제 속 쓰임
> A returns-processing agent calls an order-lookup tool that returns a JSON payload with 40+ fields (shipping **carrier** metadata, internal warehouse codes, marketing tags, etc.)...
> 반품 처리 에이전트가 주문 조회 도구를 호출하면 40개가 넘는 필드(**배송사** 메타데이터, 내부 창고 코드, 마케팅 태그 등)가 담긴 JSON이 돌아온다...

## 함께 쓰는 표현
- **shipping carrier** : 배송사, 택배사
- **carrier rates** : 운송 요금
- **insurance carrier** : 보험사

## 시험 포인트
도구 결과에 *carrier* 메타데이터처럼 필요 없는 필드가 많으면 **코드로 파싱해 필요한 필드만** 컨텍스트에 넣습니다. *carrier* API가 시간 초과일 때는 `is_error: true` 에 "30초 뒤 재시도하거나 캐시된 요금 사용"처럼 구체적인 메시지를 돌려줘야 같은 호출 반복이 멈춥니다.
