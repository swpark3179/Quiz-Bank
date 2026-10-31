**나라 안**의 것을 가리킵니다. 배송·결제처럼 국경을 기준으로 규칙이 갈리는 문맥에서 *international*(국제의)과 짝을 이뤄 자주 나옵니다.

## 문제 속 쓰임
> A logistics app has a `get_shipping_quote` tool that only supports **domestic** parcels under 30 kg, but Claude keeps calling it for international freight requests...
> 물류 앱의 `get_shipping_quote` 도구는 30kg 미만의 **국내** 소포만 지원하는데, Claude가 국제 화물 요청에도 계속 이 도구를 호출한다.

## 함께 쓰는 표현
- **domestic shipping** : 국내 배송
- **domestic-only** : 국내 전용

## 비슷한 말 · 반대말
- **local** — 지역의 (더 좁은 범위)
- **international** — 국제의, 해외의

## 시험 포인트
"국내 전용 도구가 국제 요청에도 호출된다"는 **도구 선택(범위)** 문제이므로, 설명에 지원 범위와 쓰지 말아야 할 경우를 적는 것이 정답입니다. `strict`·`enum` 은 입력 형태만 다뤄 범위 밖 호출을 막지 못합니다.
