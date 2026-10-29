1. **압축하다, (대화 기록을) 요약해 줄이다** — Claude Code 의 `/compact` 명령, 명사 *compaction*
2. **(형) 간결한, 작고 촘촘한** — 군더더기 없이 짧게 정리된

## 문제 속 쓰임
> Context window saturation — the cumulative message history exceeds the effective attention range; implement a summarization/**compaction** strategy
> 컨텍스트 윈도 포화 — 누적 대화 기록이 실질적인 주의 범위를 넘었다. 요약/**압축(compaction)** 전략을 구현한다
> ...the agent uses progressive summarization to keep the history **compact**.
> ...에이전트는 기록을 **간결하게** 유지하려고 점진적 요약(progressive summarization)을 사용합니다.

## 함께 쓰는 표현
- **/compact** : 지금까지의 대화를 요약해 컨텍스트를 줄이는 Claude Code 명령
- **compaction strategy** : 압축(요약) 전략

## 시험 포인트
같은 작업을 이어 가는데 기록만 부풀었다면 `/compact` 가 정답입니다. 다만 요약은 **손실 압축**이라 금액·날짜 같은 정확한 값은 요약 밖 블록에 따로 보존해야 합니다.
