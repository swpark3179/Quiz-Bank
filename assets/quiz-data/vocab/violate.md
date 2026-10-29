규칙·제약·정책을 **지키지 않고 어기는** 것입니다. 형식은 맞는데 의미상 규칙을 어기는 경우를 말할 때 자주 나옵니다.

## 문제 속 쓰임
> Extractions pass the JSON schema but sometimes **violate** a business rule (invoice_date later than due_date).
> 추출 결과가 JSON 스키마는 통과하지만 가끔 비즈니스 규칙(`invoice_date` 가 `due_date` 보다 늦음)을 **위반한다**.

## 함께 쓰는 표현
- **violate a rule / constraint** : 규칙·제약을 어기다
- **rule violation** : 규칙 위반 · **violation** (명) 위반

## 시험 포인트
스키마 검증은 형식만 보장하고 **값 사이의 논리 규칙**은 잡지 못합니다. 위반이 나오면 실패한 출력과 **구체적인 오류 내용**을 다시 보내 해당 필드만 고치게 하는 재시도가 정답입니다.
