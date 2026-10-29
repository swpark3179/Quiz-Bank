원래 "태우다"지만, 문제에서는 토큰·비용·시간 같은 자원을 **헛되이 써 버리는** 것입니다.

## 문제 속 쓰임
> ...the validation-retry loop retries five times and still fails, **burning** tokens on every attempt.
> ...validation-retry 루프가 다섯 번 재시도하고도 여전히 실패하며 매번 토큰을 **소모합니다**.

## 함께 쓰는 표현
- **burn tokens / budget** : 토큰·예산을 낭비하다
- **burn through** ~ : ~을 빠르게 다 써 버리다

## 시험 포인트
원문에 정보가 **아예 없으면** 재시도는 토큰만 태웁니다. 재시도는 형식 오류에만 효과가 있으므로, 없음을 감지해 `null` 을 돌려주고 사람 검토로 넘기는 것이 정답입니다.
