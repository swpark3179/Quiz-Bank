많은 내용 가운데 **필요한 부분만 골라 뽑아내는** 것입니다. 요약(summarize)과 달리 원래 값을 *그대로* 꺼낸다는 점이 중요합니다.

## 문제 속 쓰임
> **Extract** transactional facts (amounts, dates, order numbers) into a persistent "case facts" block included in each prompt.
> 거래 사실(금액·날짜·주문 번호)을 **뽑아내** 매 프롬프트에 들어가는 영속 "case facts" 블록에 담는다.

## 함께 쓰는 표현
- **extract key information** : 핵심 정보를 추출하다
- **extract A into B** : A를 뽑아 B에 담다
- **extraction** (명) 추출

## 비교
- **summarize** — 줄여서 *다시 쓴다* (세부 값이 뭉개질 수 있음)
- **extract** — 원래 값을 *그대로 뽑아낸다*

## 시험 포인트
요약하다 금액·날짜 같은 세부가 사라지는 문제에는, 그 사실을 **요약 대상 밖의 별도 블록으로 추출해** 매번 넣는 보기가 정답입니다.
