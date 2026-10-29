1. **(없는 것을) 지어내다, 꾸며 내다** — 사실이 아닌 값·내용을 그럴듯하게 만들어 내다
2. **발명하다** — 새로운 것을 처음 만들어 내다

## 문제 속 쓰임
> ...audit logs show Claude **inventing** plausible-looking PO numbers about 11% of the time instead of signaling absence.
> 감사 로그를 보면 Claude가 약 11%의 경우 값이 없다고 알리는 대신 그럴듯해 보이는 PO 번호를 **지어낸다**.

## 함께 쓰는 표현
- **invent a value / data** : 값 / 데이터를 지어내다
- **invented** (형) 꾸며 낸, 지어낸

## 비슷한 말
- **fabricate** — 날조하다
- **hallucinate** — (모델이) 사실이 아닌 내용을 만들어 내다

## 시험 포인트
원문에 없는 값을 모델이 **지어낼** 때 스키마 수준 해법은 그 필드를 **nullable** 로 만들고 "없으면 null" 을 허용하는 것입니다. 필수 문자열 필드는 모델에게 지어내는 것 말고 다른 출구를 주지 않습니다.
