무엇을 **해 보려고 하는 것**, 즉 시도입니다. 결과가 성공인지 실패인지는 따로 따집니다.

## 문제 속 쓰임
> Generate a structured handoff summary: issue, verified identifiers, tool results, actions **attempted**, and recommended next step.
> 문제 내용, 확인된 식별자, 도구 결과, **시도한** 조치, 권장 다음 단계를 담은 구조화된 핸드오프 요약을 생성한다
> ...with no upper bound on **attempts** or backoff delay.
> **시도** 횟수 상한이나 백오프 지연 없이...

## 함께 쓰는 표현
- **retry attempt** : 재시도
- **max attempts** : 최대 시도 횟수
- **attempt to** ~ : ~하려고 시도하다

## 시험 포인트
재시도에는 **횟수 상한과 백오프**가 있어야 합니다. 상한 없이 촘촘하게 재시도하는 보기는 오답입니다.
