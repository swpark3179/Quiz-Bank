여러 부분을 **하나로 묶어 만든** 것입니다. 문제에서는 자주 함께 쓰이는 조회 두 개를 **도구 하나로 묶은 '복합 도구'** 를 뜻합니다.

## 문제 속 쓰임
> Create **composite** tools like `get_customer_with_orders` that bundle common lookup combinations into single calls.
> `get_customer_with_orders` 처럼 자주 쓰는 조회 조합을 한 번의 호출로 묶은 **복합** 도구를 만든다.

## 함께 쓰는 표현
- **composite tool** : 여러 조회를 묶은 복합 도구
- **composite score / key** : 여러 지표를 합친 종합 점수 / 복합 키

## 시험 포인트
왕복 횟수를 줄이려고 **composite 도구**를 만드는 선택지는 특정 조합만 해결하고 조합마다 도구가 늘어나 오답이 되기 쉽습니다. Claude 가 **한 턴에 여러 도구를 함께 요청**할 수 있다는 점을 활용하는 쪽이 정답입니다.
