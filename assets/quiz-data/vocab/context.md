1. **(LLM의) 컨텍스트** — 모델이 한 번의 호출에서 보는 입력 전체 (시스템 프롬프트·대화 기록·도구 결과)
2. **맥락, 배경 정보** — 일을 이해하는 데 필요한 사정

## 문제 속 쓰임
> **Context** window saturation — the cumulative message history exceeds the effective attention range...
> **컨텍스트** 윈도 포화 — 누적 대화 기록이 실질적인 주의 범위를 넘었다...
> ...subagents consistently fail because they claim they 'have no **context**' about the task.
> 서브에이전트들이 작업에 대해 "**맥락**이 없다"고 하며 계속 실패합니다.

## 함께 쓰는 표현
- **context window** : 컨텍스트 윈도 — 한 번에 담을 수 있는 토큰 한도
- **pass context explicitly** : 맥락을 명시적으로 넘기다
- **context: fork** : 스킬을 격리된 컨텍스트에서 실행하는 frontmatter 설정

## 시험 포인트
서브에이전트는 **빈 기록에서 시작**하므로 필요한 맥락을 프롬프트로 넘겨야 합니다. 컨텍스트가 길어져 품질이 떨어지면 "더 큰 창"보다 **요약·압축, 출력 정리, 서브에이전트로 격리**가 정답입니다.
