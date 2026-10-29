1. **(수치·한도를) 올리다** — 타임아웃, 한도, 상한값 등을 높인다
2. **(문제를) 제기하다 / (예외를) 발생시키다** — *raise a concern*, 코드에서 *raise an exception*

## 문제 속 쓰임
> **Raise** the agent's refund authority limit above $640 in the tool configuration so that the call no longer fails.
> 도구 설정에서 에이전트의 환불 권한 한도를 $640보다 높게 **올려**, 호출이 더 이상 실패하지 않게 한다.

## 함께 쓰는 표현
- **raise a limit / timeout / threshold** : 한도·타임아웃·임계값을 올리다
- **raise an error / exception** : 오류·예외를 발생시키다
- **raise a concern** : 우려를 제기하다

## 반대말
- **lower**, **reduce** — 낮추다, 줄이다

## 시험 포인트
한도·타임아웃·재시도 상한을 **올리는** 보기는 증상만 가리는 경우가 많아 오답이 되기 쉽습니다. 오류를 구조화해 돌려주는(errorCategory, isRetryable) 것처럼 원인을 바로잡는 보기를 먼저 보세요.
