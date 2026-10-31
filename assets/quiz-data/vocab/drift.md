물에 떠밀려 가듯 **정해 둔 기준에서 조금씩 벗어나는 것**입니다. *format drift* 는 출력 형식이 가끔 흐트러지는 것, *model drift* 는 시간이 지나며 모델 동작이 달라지는 것을 말합니다.

## 문제 속 쓰임
> The regression is unrelated to the examples and is caused by unrelated model **drift**
> 회귀는 예시와 무관하며, 관련 없는 모델 **드리프트** 때문이다.

> Instructions alone still produce occasional format **drift**.
> 지시만으로는 여전히 가끔 형식이 **흐트러진다**.

## 함께 쓰는 표현
- **format drift** : 출력 형식이 조금씩 흐트러짐
- **model drift** : 모델 동작이 시간에 따라 달라짐
- **drift from** ~ : ~에서 벗어나다

## 시험 포인트
성능 하락이 **예시를 추가한 시점과 정확히 겹치면** 모델 드리프트가 아니라 예시 구성이 원인입니다. "드리프트 때문"이라는 보기는 원인을 엉뚱한 데로 돌리는 오답입니다.
