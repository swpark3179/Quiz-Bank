1. **(대화의) 턴, 차례** — 사용자 메시지와 모델 응답이 한 번 오가는 단위. 에이전트 루프에서는 모델이 응답을 한 번 내는 것을 말한다
2. **돌다, 돌리다, 바뀌다** — *turn into* (~로 바뀌다), *turn on / off* (켜다 / 끄다)

## 문제 속 쓰임
> ...maintains conversation history across 30+ **turns**.
> 30**턴** 이상 대화 기록을 유지한다.
> ...to decide whether the **turn** is a genuine completion.
> 그 **턴**이 진짜 완료인지 판단한다.

## 함께 쓰는 표현
- **multi-turn conversation** : 여러 턴에 걸친 대화
- **on every turn / each turn** : 매 턴마다
- **turn away** : 돌려보내다, 거절하다

## 시험 포인트
턴이 끝났는지는 문구·분류기가 아니라 **`stop_reason`** 으로 판단합니다(`tool_use` → 도구 실행 후 계속, `end_turn` → 종료). 또 턴이 쌓여 금액·날짜가 틀어지면 핵심 사실을 요약 밖 블록에 두고 **매 턴 그대로 다시 넣는** 보기가 정답입니다.
