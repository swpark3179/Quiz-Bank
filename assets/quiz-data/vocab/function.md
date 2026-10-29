1. **(프로그래밍) 함수** — 입력을 받아 일을 처리하고 값을 돌려주는 코드 단위
2. **기능, 역할 / (동) 작동하다** — *function properly* 제대로 작동하다

## 문제 속 쓰임
> A developer needs three changes that all touch the shared `PaymentStatus` enum and the several **functions** that switch on it.
> 개발자에게 필요한 세 가지 변경이 모두 공유 `PaymentStatus` enum과 이 enum을 기준으로 분기(switch)하는 여러 **함수**를 건드린다.

## 함께 쓰는 표현
- **function call** : 함수 호출 (LLM 에서는 *tool use* 와 같은 뜻으로도 씀)
- **helper function** : 보조 함수

## 시험 포인트
여러 변경이 **같은 enum 과 그 enum 을 쓰는 함수들**을 함께 건드리면, 따로따로 보내지 말고 **한 메시지로 묶어** 한꺼번에 고치게 하는 보기가 정답입니다.
