사람과 **대화하듯 주고받는** 성격을 말합니다. 출력에 쓰면 정해진 구조가 아니라 **자연어 문장으로 된** 출력이라는 뜻입니다.

## 문제 속 쓰임
> The engineer is parsing Claude's **conversational** text output to detect tool calls instead of using the structural `stop_reason` and `tool_use` content blocks
> 구조화된 `stop_reason` 과 `tool_use` 콘텐츠 블록 대신, Claude의 **대화형** 텍스트 출력을 파싱해 도구 호출을 감지하고 있다

## 함께 쓰는 표현
- **conversational AI / agent** : 대화형 AI·에이전트
- **conversational tone** : 대화체 말투
- **conversation** (명) 대화

## 시험 포인트
대화형(자연어) 출력을 문자열로 파싱해 판단하는 방식은 깨지기 쉬워 오답입니다. 도구 호출은 **구조화된 `stop_reason` 과 `tool_use` 블록**으로 판단합니다.
