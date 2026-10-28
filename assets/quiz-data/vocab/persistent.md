1. **계속되는, 사라지지 않는** — 재시도해도 같은 오류가 반복되는 상황 (↔ *transient*)
2. **영속적인, 유지되는** — 대화가 요약되거나 초기화돼도 지워지지 않고 남아 있는 것

## 문제 속 쓰임
> Have the subagent retry transient failures internally and only report **persistent** errors.
> 서브에이전트가 일시적인 오류는 내부에서 재시도하고, **계속되는** 오류만 보고한다.
> Extract transactional facts (amounts, dates, order numbers) into a **persistent** "case facts" block.
> 거래 사실(금액·날짜·주문번호)을 **영속적인** "case facts" 블록으로 뽑아 둔다.

## 함께 쓰는 표현
- **persistent error / issue** : 계속되는 오류 / 문제
- **persistent storage / memory** : 영구 저장소 / 지속 메모리
- **persist** (동) 계속되다, 유지되다 · **persistence** (명) 지속(성)

## 반대말
- **transient**, **temporary** — 일시적인

## 시험 포인트
긴 대화에서 금액·날짜 같은 핵심 사실이 사라지는 문제는, 요약 방식을 손보기보다 **요약 대상 밖의 persistent 블록**에 따로 보관하는 보기가 정답인 경우가 많습니다.
