밖에서 내용·값을 **안으로 집어넣는** 것입니다. 컨텍스트에 정보를 넣는 정상적인 동작에도, 악의적인 지시를 몰래 끼워 넣는 공격(*prompt injection*)에도 씁니다.

## 문제 속 쓰임
> Keep a persistent case-facts block (order id, amount, dates) outside the summary and **re-inject** it verbatim each turn.
> 주문 id, 금액, 날짜를 담은 영구적인 케이스 사실 블록을 요약 밖에 따로 두고, 매 턴 원문 그대로 **다시 주입한다**

## 함께 쓰는 표현
- **inject into** ~ : ~에 주입하다 (*inject into the context*)
- **re-inject** : 다시 넣다
- **prompt injection** : 프롬프트 인젝션 — 외부 콘텐츠에 지시를 숨겨 모델을 조종하는 공격

## 시험 포인트
요약이 반복되면 금액·날짜 같은 정확한 값이 뭉개지므로, **핵심 사실 블록을 요약 밖에 두고 매 턴 다시 주입**하는 것이 정답입니다. 반면 "SDK 가 전역 변수를 서브에이전트에 자동 주입한다"는 보기는 없는 기능을 전제로 한 함정입니다.
