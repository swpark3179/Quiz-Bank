물을 타서 묽게 하듯, 다른 것이 섞여 들어 **농도·효과를 약하게 만드는** 것입니다. 문제에서는 관계없는 내용이 컨텍스트에 섞여 **모델의 집중을 흐리는** 상황을 말합니다.

## 문제 속 쓰임
> ...it is now injected into every CI job — test generation, doc updates — inflating token cost and **diluting** the model's focus on those tasks.
> 지금은 테스트 생성이나 문서 업데이트 같은 모든 CI job에 주입되어 토큰 비용을 부풀리고 해당 작업에 대한 모델의 집중을 **흐리고** 있다.

## 함께 쓰는 표현
- **dilute focus / attention** : 집중을 흐트러뜨리다
- **diluted** (형) 묽어진, 약해진 · **dilution** (명) 희석

## 시험 포인트
항상 로드되는 `CLAUDE.md` 에 **특정 작업에만 필요한 긴 내용**을 넣으면 다른 모든 작업의 토큰 비용이 늘고 집중이 흐려집니다. 그런 내용은 **필요한 작업에서만 불러오도록** 분리하는 보기가 정답 쪽입니다.
