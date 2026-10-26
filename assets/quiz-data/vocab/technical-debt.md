빨리 끝내려고 택한 임시방편이 쌓여 **나중에 갚아야 할 빚처럼 남은 코드 문제** 입니다. 미룰수록 고치는 비용(이자)이 커진다는 비유입니다.

## 문제 속 쓰임
> ...a **technical debt** report generated overnight for the next morning.
> 다음 날 아침에 보도록 밤사이 생성하는 **기술 부채** 보고서.

## 함께 쓰는 표현
- **take on / incur technical debt** : 기술 부채를 지다
- **pay down technical debt** : 기술 부채를 갚다(정리하다)
- **tech debt** : 줄임말

## 시험 포인트
밤사이 만들어 다음 날 보는 보고서처럼 **급하지 않은 작업**은 Message Batches API 로 비용을 줄이기 좋은 후보입니다. 머지를 막는 검사처럼 기다리는 사람이 있는 작업은 실시간 호출로 남깁니다.
