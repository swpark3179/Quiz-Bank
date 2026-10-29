1. **(규칙으로) 요구하다, 반드시 ~하게 하다** — *require approval* 승인을 받아야만 하게 하다
2. **필요로 하다** — *PDFs requiring parse_pdf* parse_pdf 가 필요한 PDF
3. **required** (형) 필수의 — 스키마에서 반드시 있어야 하는 필드

## 문제 속 쓰임
> A human-in-the-loop gate at the `payment_approve` tool call, **requiring** explicit human confirmation for payments above a threshold
> `payment_approve` 도구 호출 지점에, 임계값을 넘는 지급은 사람의 명시적 확인을 **요구하는** human-in-the-loop 게이트

## 함께 쓰는 표현
- **require A to do** : A가 ~하도록 요구하다
- **required field** : 필수 필드 (JSON 스키마의 `required`)
- **requirement** (명) 요구 사항

## 시험 포인트
스키마에서 모든 필드를 **required** 로 두면 값이 없을 때 모델이 그럴듯한 값을 지어낼 수 있습니다. 원문에 없을 수 있는 값은 **nullable(또는 optional)** 로 두는 보기가 정답 쪽입니다.
