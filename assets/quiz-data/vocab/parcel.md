포장해서 보내는 **비교적 작은 짐**입니다. 배나 트럭으로 실어 나르는 큰 화물(*freight*)과 대비해서 씁니다.

## 문제 속 쓰임
> A logistics app has a `get_shipping_quote` tool that only supports domestic **parcels** under 30 kg, but Claude keeps calling it for international freight requests...
> 물류 앱의 `get_shipping_quote` 도구는 30kg 미만의 국내 **소포**만 지원하는데, Claude가 국제 화물 요청에도 계속 이 도구를 호출합니다.

## 함께 쓰는 표현
- **domestic parcel** : 국내 소포
- **parcel delivery** : 택배 배송
- **shipping quote** : 배송 견적

## 비슷한 말 · 반대말
- **package** — 소포 (미국에서 더 흔한 말)
- **freight** — 대량 화물, 운송 화물

## 시험 포인트
도구가 **범위 밖 요청에 선택되는** 문제는 strict 모드나 스키마가 아니라 **도구 설명**으로 고칩니다. 지원 범위(국내·30kg 미만)와 쓰지 말아야 할 경우를 설명에 적는 보기가 정답이고, `enum`·`additionalProperties: false` 는 오답입니다.
