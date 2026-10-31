모델이 최종 답을 내기 전에 **단계별 추론을 먼저 길게 써 보게 하는 기능**입니다. 추론 내용은 응답의 `thinking` 블록에 담기고, 예산이나 effort 로 생각의 양을 조절합니다.

## 문제 속 쓰임
> Raise the **extended thinking** budget for the review step, so the model reasons longer over the code it just wrote
> 리뷰 단계의 **extended thinking** 예산을 올려, 모델이 방금 쓴 코드에 대해 더 오래 추론하게 한다.

## 함께 쓰는 표현
- **thinking budget** : 생각에 쓸 토큰 한도
- **thinking block** : 응답에 담긴 추론 내용 블록
- **reason longer** : 더 오래 추론하다

## 시험 포인트
*extended thinking* 을 늘려도 추론은 코드를 쓴 **같은 대화 안**에서 돌아 원래 결정의 편향을 이어받습니다. 자기 검토의 사각지대는 생성 세션을 본 적 없는 **별도 인스턴스**의 리뷰로 잡습니다.
