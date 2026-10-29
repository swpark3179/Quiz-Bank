더 담을 수 없을 만큼 **가득 찬 상태**입니다. AI 문맥의 *context saturation* 은 대화·도구 출력이 너무 쌓여 모델이 앞부분이나 중간 내용을 제대로 활용하지 못하는 상황을 말합니다.

## 문제 속 쓰임
> Context window **saturation** — the cumulative message history exceeds the effective attention range; implement a summarization/compaction strategy
> 컨텍스트 윈도 **포화** — 누적 대화 기록이 실질적인 주의 범위를 넘었다. 요약/압축(compaction) 전략을 구현한다

## 함께 쓰는 표현
- **context saturation** : 컨텍스트 포화
- **saturated** (형) 포화된, 꽉 찬

## 시험 포인트
긴 대화에서 초반 내용을 잊는 문제는 더 큰 컨텍스트 모델로 바꾸기보다 **요약·압축으로 컨텍스트를 재구성**하는 보기가 정답입니다. 반면 도구 선택 오류 문제에서 "포화를 줄이려고 덜 쓰는 도구를 뺀다"는 보기는 원인을 잘못 짚은 오답입니다.
