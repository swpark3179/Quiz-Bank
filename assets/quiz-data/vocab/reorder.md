항목들의 **순서를 다시 정하는(바꾸는)** 것입니다. *re-order* 로 쓰면 "다시 주문하다"는 뜻으로도 씁니다.

## 문제 속 쓰임
> Move synthesis to a larger-context model so all 38k tokens fit comfortably in the prompt and nothing has to be trimmed or **reordered**.
> 종합 단계를 더 큰 컨텍스트의 모델로 옮겨, 38k 토큰 전체가 여유 있게 들어가고 아무것도 잘라 내거나 **재배치하지** 않아도 되게 한다.

## 함께 쓰는 표현
- **reorder by priority** : 우선순위대로 순서를 바꾸다
- **reordering** (명) 재배열

## 시험 포인트
lost-in-the-middle 은 용량이 아니라 **배치 문제**입니다. 더 큰 창으로 옮기는 보기 대신 출력을 다듬고 **핵심 요약을 맨 앞에 두는** 보기가 정답입니다.
