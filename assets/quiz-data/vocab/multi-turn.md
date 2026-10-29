사용자와 모델이 **여러 번 주고받는, 여러 턴에 걸친** 대화를 말합니다. 한 번 주고받고 끝나는 것은 *single-turn* 입니다.

## 문제 속 쓰임
> The Message Batches API strips prior turns, so the **multi-turn** context was silently dropped from the trace
> Message Batches API가 이전 턴을 제거해, **여러 턴에 걸친** 컨텍스트가 추적 과정에서 조용히 빠졌다

## 함께 쓰는 표현
- **multi-turn conversation** : 여러 턴의 대화
- **single-turn** : (대비) 한 번 주고받는

## 시험 포인트
이 보기는 오답입니다. 서브에이전트가 이전 발견을 모르는 이유는 **부모 대화를 상속하지 않기 때문**이며, 발견 사항을 `Task` 프롬프트에 담아 넘기는 것이 정답입니다.
