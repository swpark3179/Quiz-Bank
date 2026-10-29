사실이 아닌 것을 **그럴듯하게 지어내다, 꾸며 내다** 라는 뜻입니다. LLM 문맥에서는 원문에 없는 값을 **만들어 넣는 환각**을 말합니다.

## 문제 속 쓰임
> Downstream systems then treat the **fabricated** values as real.
> 다운스트림 시스템은 이렇게 **꾸며 낸** 값을 실제 값으로 취급한다.

## 함께 쓰는 표현
- **fabricated value / citation** : 지어낸 값·인용
- **fabrication** (명) 날조, 지어낸 것

## 비슷한 말
- **hallucinate** — (모델이) 없는 내용을 사실처럼 만들어 내다
- **make up**, **invent** — 지어내다

## 시험 포인트
원문에 없는 필드를 모델이 **지어낸다면**, 스키마에서 그 필드를 **선택(optional)·null 허용**으로 바꿔 "없음"을 정상 답으로 낼 수 있게 하는 것이 정답입니다. 필수(required) 필드는 값을 억지로 채우게 만듭니다.
