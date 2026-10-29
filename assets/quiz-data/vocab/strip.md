1. **(겉을) 벗겨 내다, 걷어 내다** — 앞뒤에 붙은 불필요한 부분을 떼어 낸다 (*strip whitespace* 공백 제거)
2. **(목록에서) 빼내다, 걸러 내다** — 특정 항목을 골라 제거한다

## 문제 속 쓰임
> Post-process responses with regex to **strip** markdown fences
> 정규식 후처리로 마크다운 펜스를 **제거한다**
> ...add a preprocessing stage that **strips** plain-text inputs out of the batch before dispatch to the subagent.
> 서브에이전트로 보내기 전에 일반 텍스트 입력을 배치에서 **걸러 내는** 전처리 단계를 추가한다

## 함께 쓰는 표현
- **strip A out of / from B** : B에서 A를 빼내다
- **strip whitespace** : 앞뒤 공백을 지우다

## 시험 포인트
출력의 마크다운 펜스를 정규식으로 벗겨 내는 것은 **증상만 가리는 후처리**라 오답 쪽입니다. 형식을 보장하려면 도구 스키마나 구조화 출력으로 처음부터 강제합니다.
