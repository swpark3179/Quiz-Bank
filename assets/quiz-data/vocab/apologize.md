잘못에 대해 **미안하다고 말하는** 것입니다. 명사는 *apology*(사과)입니다.

## 문제 속 쓰임
> Instruct the agent in the system prompt to never retry a refund more than once and to **apologize** to the customer instead.
> 시스템 프롬프트에서 에이전트에게 환불을 한 번 넘게 재시도하지 말고 대신 고객에게 **사과하라고** 지시한다

## 함께 쓰는 표현
- **apologize to** (사람) **for** (일) : ~에게 ~에 대해 사과하다
- **apology** (명) 사과

## 시험 포인트
권한 초과 같은 **비즈니스 규칙 위반**은 프롬프트로 땜질하지 않습니다. 도구가 `errorCategory: "business"`, `isRetryable: false` 를 돌려줘 재시도 대신 **에스컬레이션**하게 하는 것이 정답입니다.
