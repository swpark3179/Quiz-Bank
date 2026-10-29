프로그래밍에서 **소수점이 있는 숫자 타입**(예: `0.87`)을 가리킵니다. *floating-point number*(부동소수점 수)의 줄임말이고, 정수형은 *integer(int)* 입니다. 일상어로는 "(물에) 뜨다"입니다.

## 문제 속 쓰임
> Add a required confidence **float** to every field so downstream code can discard PO numbers below a chosen threshold.
> 모든 필드에 필수 신뢰도 **float**(실수 값)를 추가해, 다운스트림 코드가 정해 둔 임계값 미만의 PO 번호를 버리게 한다

## 함께 쓰는 표현
- **floating-point number** : 부동소수점 수
- **float vs. int** : 실수형 대 정수형

## 시험 포인트
원문에 없는 값을 지어내는 문제에서 **신뢰도 점수(float)** 를 붙이는 보기는 오답입니다. 모델이 스스로 매긴 신뢰도는 믿기 어렵고, 정답은 필드를 **nullable** 로 만들어 "없으면 null" 을 허용하는 것입니다.
