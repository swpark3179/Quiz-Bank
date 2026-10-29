말이나 행동 뒤에 있는 **실제 의도·목적**입니다. 챗봇·에이전트에서는 사용자 메시지가 **무엇을 원하는지**를 분류할 때 씁니다.

## 문제 속 쓰임
> Run a lightweight **intent** classifier over each assistant message to decide whether the turn is a genuine completion.
> 어시스턴트 메시지마다 경량 **의도** 분류기를 돌려, 그 턴이 진짜 완료인지 판단한다

## 함께 쓰는 표현
- **intent classifier / classification** : 의도 분류기 / 의도 분류
- **user intent** : 사용자 의도
- **intention** (명) 의도, 의향 (더 일상적)

## 시험 포인트
루프 종료를 판단하려고 **의도 분류기**를 붙이는 보기는 과잉 설계라 오답입니다. API 가 주는 결정적 신호인 **`stop_reason`**(`end_turn` / `tool_use`)으로 판단하는 것이 정답입니다.
