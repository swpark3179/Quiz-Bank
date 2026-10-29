이미 있는 결과나 기반을 쓰지 않고 **아무것도 없는 상태에서 처음부터** 다시 하는 것입니다. 명사 앞에서는 *a from-scratch rewrite*(처음부터 다시 쓰기)처럼 하이픈을 붙입니다.

## 문제 속 쓰임
> The current recovery discards the result and re-runs the identical prompt **from scratch**; 40% of retries still fail the rule.
> 현재 복구 방식은 결과를 버리고 똑같은 프롬프트를 **처음부터** 다시 실행하는데, 재시도의 40%가 여전히 규칙을 통과하지 못한다.

## 함께 쓰는 표현
- **start from scratch** : 처음부터 시작하다
- **rebuild / regenerate from scratch** : 처음부터 다시 만들다

## 시험 포인트
같은 프롬프트를 **처음부터 그대로 다시 돌리는** 재시도는 모델에게 새 정보를 주지 않아 오답입니다. **실패한 출력과 검증 오류를 피드백**해 문제 된 필드만 고치게 하는 것이 정답입니다.
