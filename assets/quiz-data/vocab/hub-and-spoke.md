바퀴의 중심축(hub)과 바큇살(spoke)처럼, **중앙 하나가 여러 하위 요소를 연결·조율하는 구조**입니다. 에이전트 설계에서는 코디네이터(허브)가 역할별 서브에이전트(스포크)에게 일을 나눠 주고 결과를 모읍니다.

## 문제 속 쓰임
> Decompose into **hub-and-spoke** with specialized subagents; add PreToolCall hook enforcing fraud-check prerequisite before payment writes
> 전문 서브에이전트로 구성된 **허브 앤 스포크**로 분해하고, 결제 쓰기 전에 사기 검사 선행을 강제하는 PreToolCall 훅을 추가한다

## 함께 쓰는 표현
- **hub-and-spoke architecture** : 허브 앤 스포크 아키텍처
- **spoke** : 허브에 연결된 하위 쪽 (여기서는 서브에이전트)

## 시험 포인트
도구가 너무 많아 선택이 흔들릴 때 도구를 **역할별 스포크로 나누면** 각 에이전트가 고를 도구가 줄어듭니다. 스포크끼리는 컨텍스트가 공유되지 않으므로 필요한 정보는 허브가 넘겨야 합니다.
