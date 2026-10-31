1. **신원, 본인** — 이 사람이 정말 그 사람인지 확인하는 대상 (*verify the customer's identity* 본인 확인)
2. **(시스템의) ID** — 요청을 보낸 계정·서비스가 누구인지 나타내는 신원 정보 (*identity provider*, *identity token*)

## 문제 속 쓰임
> Audits show that a small share of refunds still go out without the customer's **identity** being verified first.
> 감사 결과, 적은 비율이지만 여전히 고객 **본인 확인** 없이 환불이 나가고 있다.

## 함께 쓰는 표현
- **verify identity** : 본인 확인을 하다
- **identity token** : 신원을 증명하는 토큰
- **identity provider (IdP)** : ID 공급자

## 시험 포인트
본인 확인처럼 돈·신원이 걸린 순서는 프롬프트 강조나 더 큰 모델로는 **보장되지 않습니다**. 확인 기록이 없으면 호출을 거부하는 `process_refund` 의 **PreToolUse 훅**이 정답이고, PostToolUse 는 이미 환불된 뒤라 오답입니다.
