조사·검토·분석을 해서 **알아낸 결과**입니다. 보통 복수형 *findings* 로 쓰며, 리서치에서는 **발견 사항**, 코드 리뷰에서는 리뷰가 찾아낸 **지적 사항**을 가리킵니다.

## 문제 속 쓰임
> After turn 25, response quality degrades — the model starts forgetting earlier **findings** and repeating tool calls it already made.
> 25턴 이후 응답 품질이 떨어져, 모델이 **앞서 찾은 내용**을 잊고 이미 했던 도구 호출을 반복한다.

## 함께 쓰는 표현
- **key findings** : 핵심 발견 사항
- **security findings** : 보안 지적 사항
- **pass findings to** ~ : 발견 사항을 ~에게 넘기다

## 시험 포인트
서브에이전트는 부모 대화를 물려받지 않으므로, 이전 **findings** 가 필요하면 **Task 프롬프트에 명시적으로** 넣어야 합니다. 컨텍스트 창을 키워 "더 많이 남게" 하는 보기는 오답입니다.
