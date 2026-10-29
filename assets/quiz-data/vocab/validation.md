값·출력이 **정해진 규칙·형식에 맞는지 확인하는** 일입니다. 입력 검증, 스키마 검증, 비즈니스 규칙 검증처럼 무엇을 기준으로 보는지가 함께 나옵니다.

## 문제 속 쓰임
> Asking Claude to "make the input **validation** more robust and idiomatic" yields inconsistent output across runs...
> Claude에게 "입력 **검증**을 더 견고하고 관용적으로 만들어 줘"라고 요청하면 실행할 때마다 결과가 들쭉날쭉하다...

## 함께 쓰는 표현
- **input validation** : 입력 검증
- **validation error** : 검증 오류 · **validation-retry loop** 검증 후 재시도 루프
- **validate** (동) 검증하다 · **validator** (명) 검증기

## 시험 포인트
재시도할 때는 같은 프롬프트를 다시 돌리지 말고 **실패한 출력 + 구체적인 검증 오류**를 붙여 해당 필드만 고치게 합니다. 단, 원문에 아예 없는 정보는 재시도로 복구되지 않으므로 null 로 두고 사람 검토로 보냅니다.
