무언가를 **설명하기 위한, 설명하는** 이라는 뜻입니다. 문제에서는 JSON 같은 결과물 주위에 붙는 **군더더기 설명 문장**을 가리킵니다.

## 문제 속 쓰임
> Lower max_tokens to a tight cap so the model has no room to add **explanatory** prose or code fences around the JSON.
> `max_tokens` 를 빠듯하게 낮춰, 모델이 JSON 주위에 **설명** 문장이나 코드 펜스를 붙일 여유가 없게 한다

## 함께 쓰는 표현
- **explanatory text / note** : 설명 문구·주석
- **self-explanatory** : 따로 설명할 필요 없이 뻔한

## 시험 포인트
출력 앞뒤의 설명 문장을 없애려고 `max_tokens` 를 줄이는 보기는 오답입니다. 응답이 중간에 잘릴 뿐이며, **도구 사용·스키마로 형식을 강제**하는 것이 정답입니다.
