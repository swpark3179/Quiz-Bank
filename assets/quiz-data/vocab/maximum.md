허용되는 **가장 큰 값, 상한**입니다. 명사 앞에 붙여 *maximum iteration count*(최대 반복 횟수)처럼 형용사로도 쓰고, 줄여서 *max* 라고도 합니다.

## 문제 속 쓰임
> The loop has no **maximum** iteration guard; a tool returning ambiguous results can cause the model to keep requesting the same tool indefinitely
> 루프에 **최대** 반복 횟수 가드가 없다. 도구가 모호한 결과를 반환하면 모델이 같은 도구를 끝없이 재요청할 수 있다

## 함께 쓰는 표현
- **maximum iteration / retry count** : 최대 반복 / 재시도 횟수
- **at most** : 많아야, 최대
- **`max_tokens`** : (API) 응답의 최대 토큰 수

## 반대말
- **minimum** — 최소(의)

## 시험 포인트
최대 반복 횟수는 **무한 루프를 막는 안전장치**로는 맞는 답이 될 수 있지만, 정상 종료 판단은 `stop_reason` 으로 합니다. 반복 횟수를 **늘려서** 모델이 스스로 문제를 알아채게 하는 보기는 오답입니다.
