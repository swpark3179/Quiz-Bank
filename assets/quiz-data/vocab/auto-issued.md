사람의 확인·승인 없이 **시스템이 자동으로 지급·발급한** 것을 말합니다. *issue a refund* 는 "환불을 지급하다"입니다.

## 문제 속 쓰임
> Company policy states that any refund above $500 must be approved by a manager rather than **auto-issued**.
> 회사 정책에 따르면 $500 초과 환불은 **자동으로 지급하지** 않고 반드시 관리자 승인을 받아야 합니다.

## 함께 쓰는 표현
- **issue a refund / credit** : 환불 / 크레딧을 지급하다
- **auto-approve** : 자동 승인하다

## 시험 포인트
이렇게 **반드시** 지켜야 하는 한도는 프롬프트가 아니라 `process_refund` 에 거는 **PreToolUse hook** 으로 막고 `escalate_to_human` 으로 넘기는 것이 정답입니다.
