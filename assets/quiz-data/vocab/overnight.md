**밤사이에** 돌려 두고 다음 날 아침에 결과를 받는 작업을 말할 때 씁니다. 시험에서는 *사람이 바로 기다리지 않는, 지연이 허용되는 작업*의 신호입니다.

## 문제 속 쓰임
> ...a technical debt report generated **overnight** for the next morning.
> 다음 날 아침을 위해 **밤사이에** 생성되는 기술 부채 보고서.

## 함께 쓰는 표현
- **run overnight** : 밤새 돌리다
- **overnight job / batch** : 야간 작업 / 야간 배치
- **nightly** (형) 매일 밤의 — *nightly test generation* 처럼 씀

## 시험 포인트
*overnight*, *nightly*, *weekly* 처럼 **결과를 당장 기다리지 않는 작업**은 Message Batches API(50% 절감, 최대 24시간)와 잘 맞습니다. 반대로 머지를 막고 기다리는(*blocking*) 검사는 실시간 호출로 남겨야 합니다.
