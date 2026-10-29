1. **구조** — 각 부분이 어떻게 짜여 있는지 (*the target structure* 목표 구조)
2. **구조화하다** — 정해진 형식에 맞춰 짜다. **structured** 는 "정해진 필드·형식을 갖춘"이라는 뜻으로 아주 자주 나옵니다

## 문제 속 쓰임
> ...instead of using the **structural** `stop_reason` and `tool_use` content blocks
> **구조화된** `stop_reason` 과 `tool_use` 콘텐츠 블록 대신
> Implement **structured** trace logging at each step
> 각 단계마다 **구조화된** 트레이스 로그를 남긴다

## 함께 쓰는 표현
- **structured output** : 구조화 출력 — 스키마에 맞춘 JSON 출력
- **structured data / handoff** : 구조화된 데이터 / 인계 정보
- **structural** (형) 구조(상)의

## 시험 포인트
자연어 텍스트를 파싱하는 보기와 **구조화된 신호**(`stop_reason`, `tool_use` 블록, 스키마, 구조화 로그)를 쓰는 보기가 함께 나오면, 대부분 구조화된 쪽이 정답입니다.
