1. **블록, 덩어리** — API 응답 `content` 를 이루는 단위 (`text` 블록, `tool_use` 블록 등)
2. **막다, 차단하다** — 실행·진행을 못 하게 막는다

## 문제 속 쓰임
> The engineer is parsing Claude's conversational text output to detect tool calls instead of using the structural `stop_reason` and `tool_use` content **blocks**
> 구조화된 `stop_reason` 과 `tool_use` 콘텐츠 **블록** 대신, Claude의 대화형 텍스트 출력을 파싱해 도구 호출을 감지하고 있다
> Add a `PreToolUse` hook that checks the command and exits with code 2 to **block** it
> 명령을 검사해 종료 코드 2로 끝내 **차단하는** `PreToolUse` 훅을 추가한다

## 함께 쓰는 표현
- **content block** : 응답 `content` 배열의 한 항목
- **block a tool call** : 도구 호출을 차단하다
- **blocking** (형) 막는, 끝날 때까지 기다리게 하는

## 시험 포인트
도구 호출 여부는 텍스트를 파싱하지 말고 `stop_reason` 과 `tool_use` **블록**으로 판단합니다. 또 `PreToolUse` 훅이 **종료 코드 2** 로 끝나면 그 호출이 차단됩니다 — 프롬프트가 아닌 결정적 차단 수단입니다.
