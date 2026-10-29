1. **주의, 집중** — 무엇에 신경을 쓰는 것 (*pay attention to*)
2. **(LLM) 어텐션** — 모델이 입력의 어느 부분을 얼마나 참고할지 정하는 메커니즘. 입력이 길어질수록 각 부분에 주는 집중이 흐려질 수 있습니다

## 문제 속 쓰임
> Context window saturation — the cumulative message history exceeds the effective **attention** range; implement a summarization/compaction strategy
> 컨텍스트 윈도 포화 — 누적 대화 기록이 실질적인 **주의** 범위를 넘었다. 요약/압축(compaction) 전략을 구현한다

## 함께 쓰는 표현
- **pay attention to** ~ : ~에 주의를 기울이다
- **compete for attention** : (여러 내용이) 모델의 주의를 두고 경쟁하다

## 시험 포인트
긴 대화에서 앞선 내용을 잊고 같은 도구 호출을 반복하면 컨텍스트 포화를 의심합니다. 창을 키우기보다 **요약·압축(compaction)** 이나, 장황한 탐색을 **서브에이전트로 격리**하는 쪽이 정답입니다.
