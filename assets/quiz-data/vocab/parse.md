문자열을 정해진 **문법·구조에 따라 쪼개 읽어 내는** 것입니다. JSON 텍스트를 객체로 바꾸는 일이 대표적인 *파싱*입니다.

## 문제 속 쓰임
> The engineer is **parsing** Claude's conversational text output to detect tool calls instead of using the structural `stop_reason` and `tool_use` content blocks
> 구조화된 `stop_reason` 과 `tool_use` 콘텐츠 블록 대신, Claude의 대화형 텍스트 출력을 **파싱해** 도구 호출을 감지하고 있다.

## 함께 쓰는 표현
- **parse JSON** : JSON 을 파싱하다 (*JSON.parse()*)
- **parse error** : 파싱 오류
- **parser** (명) 파서, 구문 분석기

## 시험 포인트
자연어 텍스트를 파싱해 도구 호출이나 종료를 판단하는 보기는 오답입니다. 루프 제어는 **`stop_reason`** 으로, 구조화 출력은 **도구 `input_schema` + `tool_choice` 강제**로 받는 것이 정답입니다.
