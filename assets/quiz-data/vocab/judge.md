1. **판단하다, 판정하다** — 기준에 비추어 옳고 그름·해당 여부를 가리다
2. **판정자** — 결과물을 평가하는 쪽 (*LLM-as-a-judge* 모델이 다른 모델의 출력을 채점하는 방식)

## 문제 속 쓰임
> Have a separate classifier **judge** after every assistant message whether the report is truly finished
> 별도의 분류기가 어시스턴트 메시지마다 보고서가 정말 끝났는지 **판단하게** 한다
> ...so they load on demand whenever the tool **judges** them relevant to the task
> 도구가 작업과 관련 있다고 **판단할** 때마다 필요 시 로드되게 한다

## 함께 쓰는 표현
- **judge whether** ~ : ~인지 판단하다
- **judgment** (명) 판단 (*model judgment* 모델의 판단)

## 시험 포인트
"모델·분류기가 **판단하게** 한다"는 보기는 확률적입니다. `stop_reason` 같은 결정적 신호가 이미 있거나 규칙이 **항상** 적용되어야 하는 경우(CLAUDE.md)라면, 판단에 맡기는 보기는 오답입니다.
