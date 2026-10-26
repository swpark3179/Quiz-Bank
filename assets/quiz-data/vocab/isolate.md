다른 것과 섞이거나 영향을 주고받지 않도록 **따로 떼어 놓는** 것입니다. 에이전트 문제에서는 주로 *장황한 출력이나 탐색 과정을 별도 컨텍스트에 가둬 메인 대화를 지킨다*는 뜻으로 나옵니다.

## 문제 속 쓰임
> Use the Explore subagent for Phase 1 to **isolate** verbose output and return a summary, then continue Phases 2-3 in the main conversation.
> 1단계에는 Explore 서브에이전트를 써서 장황한 출력을 **격리하고** 요약만 돌려받은 뒤, 2~3단계는 메인 대화에서 이어 간다.

## 함께 쓰는 표현
- **isolated context** : 격리된 컨텍스트
- **in isolation** : 따로 떼어서, 단독으로
- **isolation** (명) 격리, 분리

## 시험 포인트
메인 대화의 컨텍스트가 **장황한 출력이나 탐색 내용으로 오염**되는 상황이면, 그 작업을 격리된 서브에이전트 컨텍스트(`context: fork`, Explore 서브에이전트)에서 돌리고 요약만 받는 선택지가 정답인 경우가 많습니다.
