*mis*(잘못) + *label*(라벨을 붙이다)입니다. 분류·추출 작업에서 형식은 맞지만 **내용상 틀린 범주를 붙이는** 것을 말합니다.

## 문제 속 쓰임
> ...the model performs well on similar short English emails but starts **mislabeling** longer documents and documents in other languages...
> 모델은 비슷한 짧은 영어 이메일은 잘 처리하지만, 긴 문서와 다른 언어 문서를 **잘못 분류하기** 시작했습니다.

## 함께 쓰는 표현
- **mislabel A as B** : A를 B로 잘못 분류하다 (*deposits were mislabeled as withdrawals*)
- **label** : 라벨(을 붙이다), 분류값

## 비슷한 말 · 반대말
- **misclassify** — 잘못 분류하다 (거의 같은 뜻)

## 시험 포인트
퓨샷 예시가 모두 짧은 영어 이메일이면 모델이 길이·언어라는 **우연한 공통점까지 배워** 다른 문서를 잘못 분류하므로, 예시를 다양화하는 것이 정답입니다. 스키마를 통과했는데 입금이 출금으로 라벨링된 것은 **의미 오류**라 스키마 검증이나 strict 모드로는 막지 못합니다.
