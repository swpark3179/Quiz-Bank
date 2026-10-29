대화에서 **정확히 지켜야 하는 그 건의 핵심 사실**(주문 번호, 금액, 날짜 등)을 따로 모아 둔 것입니다. 문제에서는 요약과 분리해 두는 **사실 블록**의 이름으로 쓰입니다.

## 문제 속 쓰임
> Keep a persistent **case-facts** block (order id, amount, dates) outside the summary and re-inject it verbatim each turn.
> 주문 id, 금액, 날짜를 담은 영구적인 **케이스 사실(case-facts)** 블록을 요약 밖에 따로 두고, 매 턴 원문 그대로 다시 주입한다.

## 함께 쓰는 표현
- **case facts block** : 핵심 사실 블록
- **re-inject verbatim** : 원문 그대로 다시 넣다

## 시험 포인트
점진적 요약 뒤에 금액·날짜가 틀어지는 것은 **손실 압축** 탓입니다. 그 사실을 요약 밖의 구조화된 블록에 두고 매 턴 그대로 다시 주입하는 보기가 정답이고, 더 큰 창·확장 사고·매 턴 재조회는 오답입니다.
