긴 내용을 **핵심만 남기고 짧게 줄이는** 것입니다. 긴 대화에서 컨텍스트를 아끼려고 예전 기록을 요약본으로 바꾸는 기법(*summarization*)으로 자주 나옵니다.

## 문제 속 쓰임
> ...the agent uses progressive **summarization** to keep the history compact.
> 에이전트는 기록을 간결하게 유지하려고 점진적 **요약**(progressive summarization)을 사용한다.

## 함께 쓰는 표현
- **progressive summarization** : 점진적 요약 — 대화가 길어질 때마다 앞부분을 계속 요약해 나가는 것
- **summarization / compaction strategy** : 요약·압축 전략
- **re-summarize** : 다시 요약하다

## 시험 포인트
요약은 **손실 압축**이라 금액·날짜·주문 번호 같은 정확한 값이 뭉개질 수 있습니다. 그런 핵심 사실은 요약 밖의 **구조화된 블록**에 따로 두고 매 턴 그대로 다시 주입하는 것이 정답입니다.
