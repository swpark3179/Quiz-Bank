*mis-*(잘못) + *read*(읽다)로, 값을 **잘못 읽거나 잘못 해석하는** 것입니다. 과거형도 철자는 *misread* 그대로이고 발음만 [ˌmɪsˈred] 로 바뀝니다.

## 문제 속 쓰임
> Logs show the model occasionally **misreads** these heterogeneous fields, e.g., treating a refund amount in the wrong units.
> 로그를 보면 모델이 이런 이질적인 필드를 가끔 **잘못 읽어**, 예를 들어 환불 금액을 잘못된 단위로 해석합니다.

## 함께 쓰는 표현
- **misread a value / the situation** : 값 / 상황을 잘못 읽다
- **misinterpret** : 잘못 해석하다 (비슷한 말)

## 시험 포인트
도구마다 날짜·통화 형식이 섞여 모델이 **잘못 읽는다면**, 도구 출력이 컨텍스트에 들어가기 전에 `PostToolUse` 훅으로 하나의 표준 형식으로 정규화하는 보기가 정답입니다.
