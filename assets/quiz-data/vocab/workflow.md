일이 **정해진 단계와 순서를 따라 흘러가는 과정**입니다. 여러 도구·사람·에이전트가 차례로 이어 맡는 전체 흐름을 말합니다.

## 문제 속 쓰임
> Intermittently the synthesis subagent uses that phrase mid-analysis, halting the **workflow**.
> 간헐적으로 합성 서브에이전트가 분석 도중에 이 문구를 쓰면서 **워크플로**가 중단된다.

## 함께 쓰는 표현
- **agentic workflow** : 에이전트 워크플로
- **CI workflow** : CI 작업 흐름 (예: GitHub Actions)
- **halt / break the workflow** : 흐름을 멈추다·끊다

## 시험 포인트
특정 문구가 나오면 루프를 끝내는 설계는 흐름을 엉뚱한 곳에서 끊습니다. 루프는 **`stop_reason` 이 `tool_use` 인 동안 계속**하고 `end_turn` 에서만 멈추는 것이 정답입니다.
