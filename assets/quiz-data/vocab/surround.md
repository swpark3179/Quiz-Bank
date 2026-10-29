어떤 것의 **둘레를 감싸는** 것입니다. 문제에서는 주로 **surrounding**(주변의, 앞뒤의) 형태로, 대상 문자열이나 정보 **주위의 문맥**을 가리킵니다.

## 문제 속 쓰임
> ...and no single **surrounding** context makes one occurrence unique.
> 어떤 **주변** 문맥으로도 한 곳만 고유하게 특정할 수 없다.

## 함께 쓰는 표현
- **surrounding context / lines** : 주변 문맥 / 앞뒤 줄
- **surrounded by** ~ : ~에 둘러싸인

## 시험 포인트
`Edit` 은 대상 문자열이 파일에서 **한 곳만** 일치해야 합니다. 앞뒤 문맥을 더 넣어도 고유해지지 않으면 `Read` + `Write` 로 파일 전체를 다시 씁니다. 원문에 아예 없는 값을 주변 단서로 "재구성"하게 하는 보기는 오답입니다.
