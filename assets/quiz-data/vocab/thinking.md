1. **(모델의) 사고** — Claude 가 **답을 내기 전에 거치는 내부 추론 과정**입니다. 응답에 `thinking` 블록으로 담기며, 요청의 `thinking` 설정과 effort 로 깊이를 조절합니다
2. **생각, 판단** — 일반적인 "생각하기" (*mislead A into thinking* ~ : A 가 ~라고 잘못 생각하게 만들다)

## 문제 속 쓰임
> Setting `isRetryable` to `true` misleads the agent into **thinking** the same request can be retried as-is.
> `isRetryable` 을 `true` 로 두면 에이전트가 같은 요청을 그대로 다시 보내도 된다고 **생각하게** 만든다.

> Every request now returns a 400 error about the **thinking** configuration.
> 이제 모든 요청이 **thinking**(사고) 설정에 관한 400 오류를 반환합니다.

## 함께 쓰는 표현
- **adaptive thinking** : 적응형 사고 — 모델이 깊이를 스스로 조절
- **thinking block** : 응답 속 사고 내용 블록
- **mislead** ~ **into thinking** : ~가 잘못 생각하게 만들다

## 시험 포인트
고정 예산 방식(`type: "enabled"` + `budget_tokens`)은 Claude 4.7 이후 모델에서 **400 오류**가 납니다. Opus 5.5 로 옮길 때는 `budget_tokens` 를 빼고 adaptive thinking(또는 생략)을 쓰며, 깊이는 `output_config.effort` 로 조절합니다.
