<!-- 출처: pages/CCAR-F 레슨 2.1~2.5 하단 "자가 점검 퀴즈" 문항(레슨당 6문항)을 옮겼다. 문제·보기·정답은 원문과 같고 보기 기호만 A–D → 1–4로 바꿨다. 해설은 공식 문서를 확인해 보강. -->

## 문제 1
### **Define tools 문서가 도구 성능에 "단연 가장 중요한 요소"로 꼽는 것은?**

| 보기 | 설명 |
|------|------|
| **1. 매우 자세한 도구 설명** | |
| 2. 짧고 기억하기 쉬운 도구 이름 | |
| 3. 도구 개수를 세 개 이하로 유지하는 것 | |
| 4. `input_schema`의 모든 필드를 required로 지정하는 것 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — 가장 중요한 요소

> **핵심:** Claude는 도구의 구현을 보지 못하고 정의에 적힌 글로만 판단하므로, Define tools 문서는 **매우 자세한 설명**을 도구 성능의 단연 가장 중요한 요소로 꼽습니다.

1. **정답** - 문서는 "Provide extremely detailed descriptions. This is by far the most important factor in tool performance."라고 적습니다. 도구가 하는 일, 언제 쓰고 언제 쓰지 말지, 각 파라미터의 의미와 동작에 미치는 영향, 반환하지 않는 정보 같은 한계까지 담고, 도구당 최소 3~4문장(복잡하면 더 길게)을 권합니다.
2. **오답** - 이름은 `^[a-zA-Z0-9_-]{1,128}$` 형식의 식별자로 경계를 드러내는 보조 신호입니다. 서비스 접두사(`github_list_prs` 등)를 붙이라는 권고는 있지만, 짧고 기억하기 쉬운 이름이 가장 중요하다는 말은 없습니다.
3. **오답** - 문서에 "세 개 이하" 같은 개수 기준은 없습니다. 문서의 관련 권고는 같은 자원에 대한 동작을 `action` 파라미터를 가진 도구 하나로 합쳐 선택의 모호함을 줄이라는 것입니다.
4. **오답** - `required`는 어떤 입력이 필수인지 정하는 스키마 요소일 뿐, 문서가 성능 요소로 꼽는 기준이 아닙니다. 문서의 예시(`get_weather`)도 `location`만 required로 두고 `unit`은 선택 파라미터로 남깁니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

---

## 문제 2
### **고객 지원 에이전트에 `get_refund_status`("환불 정보를 가져온다")와 `get_refund_policy`("환불 정보를 제공한다")가 있다. "제 환불 어떻게 됐어요?"라는 질문에 정책 도구가 자주 호출된다. 가장 근본적인 해결책은?**

| 보기 | 설명 |
|------|------|
| 1. 시스템 프롬프트에 "'환불'이라는 단어가 나오면 get_refund_status를 우선 호출하라"를 추가한다 | |
| 2. 두 도구의 이름을 더 짧게 바꾼다 | |
| **3. 각 설명에 무엇을 반환하는지와 언제 쓰고 언제 쓰지 않는지를 구분해 적는다(특정 환불 건의 진행 상태 vs 회사 규정)** | |
| 4. tool_choice로 get_refund_status를 항상 강제한다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — 겹치는 도구

> **핵심:** 두 설명이 거의 같으면 Claude에게는 둘을 가를 근거가 없으므로, 각 설명을 **무엇을 반환하는지와 언제 쓰는지**로 구분해 다시 써야 합니다.

1. **오답** - "환불"이라는 단어에 도구를 묶는 키워드 규칙입니다. "환불 규정이 어떻게 돼요?" 같은 정책 질문까지 상태 조회로 보내 새로운 오라우팅을 만들고, 겹친 설명이라는 원인은 그대로 둡니다.
2. **오답** - 이름을 짧게 바꿔도 "환불 정보를 가져온다"와 "환불 정보를 제공한다"라는 거의 같은 설명은 그대로라 구분 근거가 늘지 않습니다.
3. **정답** - Troubleshooting 문서는 "A를 원했는데 B를 부른다"의 원인을 설명의 모호함으로 보고, 무엇을 하는지만이 아니라 **언제** 쓰는지로 설명을 다듬으라고 처방합니다. 특정 환불 건의 진행 상태를 묻는 경우와 회사 규정을 묻는 경우를 각 설명에 명시하면 오라우팅의 원인이 사라집니다.
4. **오답** - `tool_choice`로 상태 도구를 항상 강제하면 정책 질문에도 상태 도구가 호출됩니다. 강제 호출은 특정 단계를 반드시 실행해야 할 때 쓰는 장치이지 두 도구를 구분하는 수단이 아닙니다.

📚 근거: [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

---

## 문제 3
### **세무 에이전트의 시스템 프롬프트에 "금액이 언급되면 반드시 calculate_tax를 먼저 호출하라"가 있다. 사용자가 "작년에 낸 세금이 얼마였죠?"라고 묻자 납부 내역 조회 도구 대신 계산 도구가 호출됐다. 원인과 조치로 옳은 것은?**

| 보기 | 설명 |
|------|------|
| 1. 계산 도구의 설명이 너무 길어서이므로 설명을 한 줄로 줄인다 | |
| **2. 키워드에 묶인 지시가 도구 설명의 사용 조건을 덮어쓴 것이므로, 지시를 의도 기준으로 고치고 세부 조건은 도구 설명에 둔다** | |
| 3. 조회 도구를 삭제해 선택지를 줄인다 | |
| 4. "CRITICAL"을 붙여 조회 도구의 우선순위를 더 강하게 쓴다 | |

**정답: 2.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — 프롬프트 키워드

> **핵심:** API는 도구 정의와 시스템 프롬프트를 하나의 프롬프트로 묶어 Claude에게 보여 주므로, **특정 단어에 묶인 지시**는 도구 설명의 사용 조건보다 먼저 작동해 선택을 끌어갈 수 있습니다.

1. **오답** - 설명을 한 줄로 줄이면 판단 재료가 더 사라집니다. 원인은 설명 길이가 아니라 "금액이 언급되면 반드시 calculate_tax"라는 시스템 프롬프트의 키워드 지시입니다.
2. **정답** - "작년에 낸 세금이 얼마였죠?"는 조회 의도인데 "금액"이라는 단어가 계산 도구를 끌어냈습니다. Tool use overview도 시스템 프롬프트로 도구 사용의 경계를 움직일 수 있다고 설명합니다. 지시는 "새로 계산해야 할 때 calculate_tax를 쓴다"처럼 의도 단위로 고치고, 세부 사용 조건은 도구 설명에 둡니다.
3. **오답** - 조회 도구를 지우면 납부 내역 조회라는 필요한 기능이 사라집니다. 선택지를 줄이는 것이 아니라 잘못된 지시를 고쳐야 합니다.
4. **오답** - Prompting best practices는 최신 모델이 시스템 프롬프트에 더 민감해서 "CRITICAL: You MUST use this tool when..." 같은 공격적 표현이 과호출(overtriggering)을 부른다고 경고합니다. 강한 어조를 하나 더 얹으면 두 지시가 경쟁할 뿐이며, 문서의 처방은 어조를 낮추는 것입니다.

📚 근거: [Tool use with Claude (overview)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

---

## 문제 4
### **`analyze(file_id, mode)` 도구 하나가 mode 값에 따라 OCR 텍스트, 요약, 개인정보 탐지 결과를 서로 다른 JSON 모양으로 돌려준다. Claude가 mode를 자주 잘못 고르고 결과 해석도 틀린다. 가장 알맞은 개선은?**

| 보기 | 설명 |
|------|------|
| 1. mode의 enum 값을 더 늘린다 | |
| 2. 설명을 더 짧게 줄여 혼동을 줄인다 | |
| 3. 시스템 프롬프트에 mode별 키워드 목록을 나열한다 | |
| **4. 목적별 도구(텍스트 추출·요약·개인정보 탐지)로 나누고 각 도구의 입력·출력 계약을 정한다** | |

**정답: 4.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — 범용 도구 분리

> **핵심:** 입력과 출력 모양이 서로 다른 일을 도구 하나의 파라미터 값으로 숨기면 진짜 선택이 도구 안쪽으로 숨어 버리므로, **목적별 도구와 입출력 계약**으로 나눕니다.

1. **오답** - mode의 enum 값을 늘리면 하나의 도구 설명이 감당해야 할 일이 더 많아져 mode 선택과 결과 해석의 혼동이 커집니다.
2. **오답** - 설명을 줄이면 각 mode가 무엇을 돌려주는지 같은 판단 재료가 더 사라집니다. 지금도 하나의 설명으로 세 가지 일을 설명하지 못해 혼동이 생기고 있습니다.
3. **오답** - mode별 키워드 목록은 키워드성 지시라 또 다른 오라우팅을 만듭니다. 시스템 프롬프트의 키워드는 도구 설명의 사용 조건을 덮어쓸 수 있습니다.
4. **정답** - 텍스트 추출·요약·개인정보 탐지를 각자의 도구로 나누고 입력과 출력 형태를 정하면, 각 설명이 무엇을 반환하고 언제 형제 도구 대신 골라야 하는지 말할 수 있습니다. Define tools의 "관련 작업을 합쳐라" 권고는 같은 자원에 대한 비슷한 동작(PR의 생성·리뷰·병합)에 관한 것이라 이 경우와 충돌하지 않습니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)

---

## 문제 5
### **`input_examples`에 대한 설명으로 옳은 것은?**

| 보기 | 설명 |
|------|------|
| 1. web search 같은 server tool에도 똑같이 쓸 수 있다 | |
| 2. 참고용이므로 스키마와 맞지 않아도 된다 | |
| 3. 프롬프트 토큰을 추가로 쓰지 않는다 | |
| **4. 각 예시는 `input_schema`를 통과해야 하며, 그렇지 않으면 400 오류가 난다** | |

**정답: 4.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — input_examples

> **핵심:** `input_examples`는 사용자 정의 도구에 붙이는 선택 필드로, 각 예시는 **`input_schema`를 통과해야 하며(아니면 400 오류)** 프롬프트 토큰을 추가로 씁니다.

1. **오답** - Define tools 문서는 input examples가 web search나 code execution 같은 서버 도구에는 지원되지 않는다고 명시합니다(computer use·browser use 툴셋도 제외).
2. **오답** - 예시는 참고용이 아니라 검증 대상입니다. 스키마에 맞지 않는 예시가 하나라도 있으면 요청이 400 오류로 실패합니다.
3. **오답** - 예시는 도구 스키마와 함께 프롬프트에 들어가 토큰을 씁니다. 문서 기준으로 단순한 예시는 약 20~50토큰, 복잡한 중첩 객체는 약 100~200토큰이 추가됩니다.
4. **정답** - 문서의 요구 사항 그대로입니다. "Each example must be valid according to the tool's input_schema. Invalid examples return a 400 error." 예시는 설명을 대신하지 않고, 중첩 객체나 형식이 까다로운 파라미터가 있는 복잡한 도구에 덧붙이는 보조 수단입니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

---

## 문제 6
### **여러 팀이 만든 도구를 한 에이전트에 모았더니, 우리 팀의 `search` 도구가 거의 호출되지 않는다. 다른 팀 도구 중에 `find`, `search_all`처럼 이름도 설명도 비슷한 것이 있다. 가장 알맞은 조치는?**

| 보기 | 설명 |
|------|------|
| **1. 서비스 접두사를 붙인 이름으로 바꾸고, 다른 검색 도구와 구별되는 사용 조건을 설명에 적고, input_examples로 쓰임을 구체화한다** | |
| 2. 설명 맨 앞에 "CRITICAL: 항상 이 도구를 써라"를 넣는다 | |
| 3. 다른 팀의 도구를 모두 제거한다 | |
| 4. 설명을 비워 토큰을 아낀다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — 호출되지 않는 도구

> **핵심:** Troubleshooting 문서는 "만든 도구를 아예 안 부른다"의 원인으로 **이름 충돌과 지나치게 일반적인 스키마**를 들고, 중복 이름 확인과 `input_examples`로 의도한 쓰임을 구체화하라고 처방합니다.

1. **정답** - 서비스 접두사(예: `billing_search_invoices`)는 여러 팀의 도구가 한데 모일 때 경계를 드러내 줍니다. Define tools 문서도 도구가 여러 서비스에 걸치면 이름 앞에 서비스를 붙이라고 하고, 설명에서 다른 검색 도구와 구별되는 사용 조건을 밝히며, `input_examples`로 어떤 입력에 쓰는지 구체적으로 보여 주는 조합이 문서의 처방과 일치합니다.
2. **오답** - "CRITICAL: 항상 이 도구를 써라" 같은 강한 어조는 최신 모델에서 과호출을 부릅니다. Prompting best practices의 처방은 공격적 표현을 누그러뜨리는 것입니다.
3. **오답** - 다른 팀의 도구를 모두 지우면 그 팀들이 필요로 하는 기능을 잃습니다. 문제는 도구의 존재가 아니라 이름과 설명이 겹친다는 점입니다.
4. **오답** - 설명을 비우면 판단 재료가 사라져 `find`, `search_all`과 구분할 근거가 더 없어집니다. 토큰보다 선택 정확도가 먼저입니다.

📚 근거: [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

---

## 문제 7
### **MCP 명세에서 `isError: true`인 도구 결과(도구 실행 오류)로 보고해야 하는 것은?**

| 보기 | 설명 |
|------|------|
| 1. 존재하지 않는 도구 이름으로 들어온 호출 | |
| **2. 형식이 틀린 날짜 입력값** | |
| 3. `CallToolRequest` 스키마를 어긴 요청 | |
| 4. JSON-RPC 메시지 자체가 파싱되지 않는 경우 | |

**정답: 2.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — 오류 채널

> **핵심:** MCP 명세는 도구 오류를 두 채널로 나눕니다. 요청 구조의 문제는 JSON-RPC **프로토콜 오류**로, 도구가 실행된 뒤의 실패(API 실패, 입력 검증, 비즈니스 로직)는 `isError: true` **도구 실행 오류**로 보고합니다.

1. **오답** - 존재하지 않는 도구 이름(Unknown tools)은 명세가 프로토콜 오류로 분류하는 예입니다. 명세 예시도 `-32602` 코드와 "Unknown tool: invalid_tool_name" 메시지를 담은 JSON-RPC `error` 객체입니다.
2. **정답** - 형식이 틀린 날짜는 명세가 "Input validation errors (e.g., date in wrong format, value out of range)"로 직접 예시하는 도구 실행 오류입니다. 모델이 읽고 인자를 고쳐 재시도할 수 있는 피드백이므로 `isError: true` 결과로 돌려줘야 하고, 클라이언트는 이를 모델에 전달해야 합니다(SHOULD).
3. **오답** - `CallToolRequest` 스키마를 어긴 요청(Malformed requests)은 명세가 프로토콜 오류로 분류합니다. 요청 구조 자체의 문제라 모델이 고치기 어렵습니다.
4. **오답** - JSON-RPC 메시지 자체가 파싱되지 않는 것은 도구를 실행하기도 전, 요청 구조 단계의 문제입니다. 도구 실행 오류가 아니라 프로토콜 계층에서 처리됩니다.

📚 근거: [MCP Specification: Tools (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) · [MCP Specification: Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

---

## 문제 8
### **항공권 변경 도구가 "특가 운임은 날짜 변경 불가" 규정에 걸린 요청을 받으면 `isError: true`와 "Error"만 돌려준다. 에이전트는 같은 요청을 세 번 보낸 뒤 고객에게 "시스템 점검 중이니 나중에 다시 시도해 달라"고 안내했다. 가장 알맞은 수정은?**

| 보기 | 설명 |
|------|------|
| 1. 오류를 JSON-RPC 프로토콜 오류로 바꿔 에이전트가 보지 못하게 한다 | |
| 2. `isError`를 false로 바꾸고 "변경 불가"라는 텍스트만 돌려준다 | |
| 3. 에이전트의 최대 재시도 횟수를 1로 줄인다 | |
| **4. errorCategory "business", isRetryable false, 고객용 설명(운임 규정)과 가능한 대안(취소 후 재구매 등)을 담아 돌려준다** | |

**정답: 4.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — 비즈니스 오류

> **핵심:** 다시 보내도 결과가 같은 규정 위반은 **비즈니스 오류**이므로, 재시도 불가임을 밝히고 고객에게 전할 설명과 가능한 대안을 함께 돌려줘야 합니다.

1. **오답** - 도구 실행 중에 난 실패를 프로토콜 오류로 보내면 모델은 오류가 났다는 사실조차 보지 못해 스스로 고칠 기회를 잃습니다. 규정 위반은 `isError: true` 결과로 돌려줄 대상입니다.
2. **오답** - `isError`를 false로 바꾸면 실패한 변경이 성공한 결과처럼 보입니다. 에이전트가 변경이 완료된 것으로 오해할 수 있습니다.
3. **오답** - 재시도 횟수를 줄여도 에이전트는 여전히 실패 이유를 모르므로, 고객에게 "시스템 점검 중"이라고 잘못 안내하는 문제는 그대로입니다.
4. **정답** - errorCategory "business"와 isRetryable false는 같은 요청을 반복하지 말라는 신호이고, 고객용 설명(특가 운임은 날짜 변경 불가)과 대안(취소 후 재구매 등)이 있으면 에이전트가 사정을 정확히 설명할 수 있습니다. 이 분류 필드는 MCP 표준 필드가 아니라 결과 내용 안에 넣는 서버 자체 규약입니다.

📚 근거: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent) · [MCP Specification: Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

---

## 문제 9
### **재고 조회 서브에이전트가 공급사 API에서 간헐적으로 503을 받는다. 대개 몇 초 뒤 다시 하면 성공한다. 가장 알맞은 처리는?**

| 보기 | 설명 |
|------|------|
| **1. 서브에이전트 안에서 상한과 백오프를 둔 재시도로 처리하고, 끝내 실패할 때만 시도 내역과 함께 코디네이터에 알린다** | |
| 2. 503이 올 때마다 즉시 코디네이터로 올려 판단을 맡긴다 | |
| 3. 503을 "재고 0"으로 바꿔 돌려준다 | |
| 4. 실패한 상품을 기록 없이 결과에서 뺀다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — 일시적 오류

> **핵심:** 잠시 뒤 같은 요청으로 풀리는 **일시적 오류**는 서브에이전트가 상한과 백오프를 둔 재시도로 로컬에서 복구하고, 끝내 실패할 때만 시도 내역과 함께 올립니다.

1. **정답** - 503은 대개 몇 초 뒤 재시도하면 풀리는 transient 오류입니다. 서브에이전트 안에서 횟수 상한과 백오프를 두고 재시도하면 코디네이터는 이 일을 알 필요조차 없고, 재시도가 바닥났을 때만 무엇을 몇 번 시도했는지와 함께 보고하면 됩니다.
2. **오답** - 스스로 풀 수 있는 오류까지 모두 올리면 코디네이터의 컨텍스트가 잡음으로 차고, 판단할 필요도 없는 일로 왕복이 늘어납니다.
3. **오답** - 접근 실패를 "재고 0"으로 바꾸면 조회하지 못한 것을 확인된 정상 값처럼 보고하게 됩니다. 에이전트가 "재고 없음"이라는 틀린 결론을 자신 있게 전하게 됩니다.
4. **오답** - 실패한 상품을 기록 없이 빼면 결과가 불완전하다는 사실이 숨겨져, 코디네이터는 빠진 상품이 있다는 것도 모릅니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

---

## 문제 10
### **`find_customer` 도구는 일치하는 고객이 없을 때 `isError: true`와 "not found"를 돌려준다. 에이전트는 이를 장애로 보고 같은 조회를 반복하다가 사람에게 이관한다. 가장 알맞은 수정은?**

| 보기 | 설명 |
|------|------|
| 1. 오류 메시지를 더 길고 자세하게 쓴다 | |
| 2. 일치하는 고객이 없으면 content를 비운 채 돌려준다 | |
| **3. 0건을 정상 결과(isError false, 빈 목록과 사용한 조건)로 돌려주고, 접속 실패만 오류로 보고한다** | |
| 4. 시스템 프롬프트에 "not found는 무시하라"를 추가한다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — 빈 결과

> **핵심:** 결과 0건은 질의가 **성공**했다는 뜻입니다. MCP 명세상 `isError`를 설정하지 않으면 성공으로 간주되며, 오류는 도구가 질문에 답하지 못했을 때만 씁니다.

1. **오답** - 메시지를 길게 써도 `isError: true`인 이상 여전히 성공한 질의를 실패로 알립니다. 에이전트는 계속 장애로 보고 재시도하거나 이관합니다.
2. **오답** - content를 비우면 무엇을 어떤 조건으로 찾았는지 정보가 없어, 에이전트가 "0건"인지 "응답이 비었다"인지 해석하기 모호해집니다.
3. **정답** - "고객 없음"은 완전한 답입니다. `isError` false로 빈 목록과 사용한 검색 조건을 돌려주면, 에이전트가 조건을 바꿔(예: 이메일 대신 전화번호) 다시 찾을지 스스로 판단할 수 있습니다. 반대로 DB에 접속하지 못한 경우는 오류로 보고해야 에이전트가 "없다"는 잘못된 결론을 내리지 않습니다.
4. **오답** - "not found는 무시하라"는 지시는 진짜 접근 실패의 메시지까지 무시하게 만들 수 있고, 도구가 성공을 실패로 보고한다는 근본 원인은 그대로 둡니다.

📚 근거: [MCP Specification: Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) · [MCP Schema (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/schema)

---

## 문제 11
### **번역 서브에이전트가 매뉴얼 12개 장 중 9개를 번역했다. 나머지 3개 장은 외부 용어집 API가 계속 타임아웃되어, 정해 둔 재시도 3회를 모두 썼다. 코디네이터에 무엇을 돌려줘야 하나?**

| 보기 | 설명 |
|------|------|
| **1. 번역된 9개 장, 실패한 3개 장과 오류 분류(transient), 이미 쓴 재시도 횟수와 시도 내용** | |
| 2. "작업 실패"만 알리고 번역된 9개 장은 버린다 | |
| 3. 실패를 숨기고 9개 장만 완성본처럼 보낸다 | |
| 4. 상한을 무시하고 성공할 때까지 계속 재시도한다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — 부분 결과 전파

> **핵심:** 로컬 복구 수단(정해 둔 재시도)을 다 쓴 뒤에는 **얻은 것·실패한 것·오류 분류·시도 내역**을 함께 올려, 코디네이터가 다음 조치를 고를 수 있게 합니다.

1. **정답** - 번역된 9개 장은 부분 결과로 보존되고, 실패한 3개 장과 transient 분류, 이미 쓴 재시도 3회와 시도 내용이 있으면 코디네이터가 나중에 재위임할지, 용어집 없이 진행할지, 사람에게 넘길지 고를 수 있습니다. 이미 실패한 시도를 반복하지 않게 되는 것도 시도 내역 덕분입니다.
2. **오답** - "작업 실패"만 알리면 쓸 수 있는 9개 장의 결과를 버리게 되고, 코디네이터는 무엇이 왜 실패했는지 모른 채 처음부터 다시 맡겨야 합니다.
3. **오답** - 9개 장만 완성본처럼 보내면 3개 장이 빠졌다는 불완전함이 숨겨집니다. 코디네이터는 작업이 끝났다고 믿고 넘어갑니다.
4. **오답** - 재시도 상한은 비용과 지연이 끝없이 늘어나는 것을 막으려고 두는 것입니다. 상한을 무시하고 계속 시도하면 그 이유를 무시하는 셈이고, 결과가 언제 돌아올지도 알 수 없습니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [MCP Specification: Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

---

## 문제 12
### **Agent SDK 커스텀 도구 핸들러에서 예외를 잡지 않으면 어떻게 되나?**

| 보기 | 설명 |
|------|------|
| 1. `query()` 전체가 즉시 중단된다 | |
| 2. Claude는 아무것도 받지 못하고 다음 턴으로 넘어간다 | |
| **3. in-process MCP 서버가 원래 예외 메시지를 담은 오류 결과로 바꿔 Claude에게 주고, 에이전트 루프는 계속된다** | |
| 4. SDK가 같은 호출을 자동으로 세 번 재시도한다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — SDK 핸들러

> **핵심:** Agent SDK의 in-process MCP 서버는 핸들러의 잡히지 않은 예외를 **원래 예외 메시지를 담은 오류 결과**로 바꿔 Claude에게 주며, 에이전트 루프는 멈추지 않습니다.

1. **오답** - custom tools 문서는 "A handler error doesn't stop the agent loop"라고 적습니다. 예외 하나로 `query()` 전체가 중단되지는 않습니다.
2. **오답** - Claude는 아무것도 못 받는 것이 아니라, 원래 예외 메시지가 담긴 오류 결과를 받아 읽습니다.
3. **정답** - 문서의 표 그대로입니다. 잡히지 않은 예외는 원래 예외 메시지를 담은 오류 결과가 되고 Claude가 그것을 보며 루프는 계속됩니다. 다만 Claude가 보는 것은 예외 문자열뿐이므로, 어느 요청이 실패했고 무엇을 대신 해 볼지 같은 맥락을 주려면 직접 잡아서 `isError: true`(Python은 `"is_error": True`)와 함께 메시지를 구성합니다.
4. **오답** - SDK가 같은 호출을 자동으로 재시도한다는 동작은 문서에 없습니다. 오류 결과를 받은 뒤 다시 시도할지, 다른 도구를 쓸지, 실패를 설명할지는 Claude가 정합니다.

📚 근거: [Agent SDK: Give Claude custom tools](https://code.claude.com/docs/en/agent-sdk/custom-tools)

---

## 문제 13
### **고객 상담 시스템에서 상담 기록을 요약해 CRM에 남기는 요약 에이전트가 모든 에이전트와 같은 도구 세트를 받았다. 어느 날 요약 도중 이 에이전트가 `cancel_order`를 실행했다. 다만 요약 중에 주문 상태를 확인할 일은 자주 있다. 가장 알맞은 설계 변경은?**

| 보기 | 설명 |
|------|------|
| 1. 시스템 프롬프트에 "요약 중에는 주문을 변경하지 마라"를 추가한다 | |
| 2. cancel_order에 확인 메시지를 붙이고 도구 세트는 그대로 둔다 | |
| **3. 요약 에이전트에서 주문 변경 도구를 빼고 읽기 전용의 좁은 get_order_status만 주며, 주문 처리가 필요하면 코디네이터로 돌려보내게 한다** | |
| 4. 요약 에이전트의 tool_choice를 none으로 고정한다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — 역할 밖 도구

> **핵심:** 역할 밖 도구는 **범위에서 빼고**, 잦고 단순한 교차 역할 필요만 좁은 읽기 전용 도구로 열며, 실제 처리는 코디네이터를 거치게 합니다.

1. **오답** - 프롬프트 지시는 확률적인 억제일 뿐이고 `cancel_order`는 여전히 손에 있습니다. 도구가 선택지에 있는 한 언젠가 다시 쓰일 수 있습니다.
2. **오답** - 확인 메시지를 붙여도 도구 세트가 그대로라 오용 가능성은 남습니다. 요약 에이전트에게 주문 취소 능력이 필요하다는 근거 자체가 없습니다.
3. **정답** - Agent SDK 서브에이전트 문서도 서브에이전트를 특정 도구로 제한하면 의도치 않은 동작의 위험이 줄어든다고 설명합니다. 주문 변경 도구를 빼고, 자주 필요한 상태 확인만 읽기 전용의 좁은 `get_order_status`로 주면 요약 흐름은 끊기지 않습니다. 주문 처리가 필요하면 코디네이터로 돌려보내 담당 에이전트에게 맡깁니다.
4. **오답** - `tool_choice: none`은 모든 도구 호출을 막으므로, 요약에 필요한 상태 확인과 CRM 기록 도구까지 쓸 수 없게 됩니다. 범위 문제를 호출 제어로 풀려는 잘못된 축입니다.

📚 근거: [Agent SDK: Subagents](https://code.claude.com/docs/en/agent-sdk/subagents) · [Claude Code: Create custom subagents](https://code.claude.com/docs/en/sub-agents)

---

## 문제 14
### **`tool_choice: {"type": "any"}`의 의미는?**

| 보기 | 설명 |
|------|------|
| **1. 제공된 도구 중 하나는 반드시 호출하되, 어느 것인지는 Claude가 고른다** | |
| 2. 지정한 도구 하나를 반드시 호출한다 | |
| 3. 도구를 부를지 말지 Claude가 판단한다 | |
| 4. 도구 호출을 금지한다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — tool_choice 의미

> **핵심:** `tool_choice`의 네 값은 각각 다른 것을 보장합니다. `any`는 "제공된 도구 중 하나는 반드시 쓰되, 어느 것인지는 Claude가 고른다"입니다.

1. **정답** - Define tools 문서는 "`any` tells Claude that it must use one of the provided tools, but doesn't force a particular tool."이라고 적습니다. 텍스트만으로 답하는 것을 막을 뿐 순서나 특정 도구는 정하지 않습니다.
2. **오답** - 지정한 도구 하나를 반드시 호출하게 하는 것은 `{"type": "tool", "name": "..."}`입니다.
3. **오답** - 도구를 부를지 말지 Claude가 판단하는 것은 `auto`이며, `tools`가 있을 때의 기본값입니다.
4. **오답** - 도구 호출을 금지하는 것은 `none`이며, `tools`가 없을 때의 기본값입니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Tool choice (Cookbook)](https://platform.claude.com/cookbook/tool-use-tool-choice)

---

## 문제 15
### **의료비 영수증 처리 에이전트는 먼저 `detect_document_type`으로 문서 종류를 판별하고, 그 결과에 따라 `parse_pharmacy_receipt`나 `parse_hospital_bill` 중 하나를 써야 한다. 사용하는 모델은 강제 호출을 지원한다. 가장 알맞은 방법은?**

| 보기 | 설명 |
|------|------|
| 1. 모든 요청의 tool_choice를 detect_document_type으로 고정한다 | |
| 2. 시스템 프롬프트에 "가장 먼저 문서 종류를 판별하라"만 적는다 | |
| 3. 모든 턴에 tool_choice any를 건다 | |
| **4. 첫 요청에만 `{"type": "tool", "name": "detect_document_type"}`을 주고, 결과를 돌려준 뒤 후속 요청은 auto로 되돌린다** | |

**정답: 4.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — 첫 호출 강제

> **핵심:** 순서를 보장하려면 **첫 요청만** 특정 도구로 강제하고, 그 결과를 돌려준 뒤 후속 요청은 auto로 되돌려 다음 선택을 Claude에게 맡깁니다.

1. **오답** - 모든 요청을 `detect_document_type`으로 강제하면 매 턴 같은 도구만 부르게 되어, 판별 결과를 받고도 파싱 도구로 넘어가거나 텍스트로 끝낼 수 없습니다.
2. **오답** - 프롬프트 지시는 판별을 먼저 하도록 유도할 뿐 보장하지 않습니다. Tool use overview도 프롬프트에 기대지 않고 도구 호출을 요구하려면 `tool_choice`를 쓰라고 합니다.
3. **오답** - `any`는 어떤 도구든 하나를 부르게 할 뿐 어느 것인지는 정하지 않습니다. 판별 전에 파싱 도구를 먼저 부르는 일을 막지 못합니다.
4. **정답** - 첫 요청에 `{"type": "tool", "name": "detect_document_type"}`을 주면 판별이 반드시 먼저 실행됩니다. 그 `tool_result`를 돌려준 뒤 auto로 되돌리면 Claude가 판별 결과를 보고 `parse_pharmacy_receipt`와 `parse_hospital_bill` 중 알맞은 것을 고릅니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Tool use with Claude (overview)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

---

## 문제 16
### **팀이 분류 파이프라인의 모델을 Claude Sonnet 5.5로 바꾼 뒤, `tool_choice: {"type": "any"}`를 쓰던 요청이 모두 400 오류를 낸다. 올바른 진단과 대응은?**

| 보기 | 설명 |
|------|------|
| 1. max_tokens가 부족해서이므로 늘린다 | |
| **2. 이 모델은 any·tool을 지원하지 않으므로, auto와 strict tool use·명시적 지시를 쓰거나 고정 JSON 응답이 필요하면 structured outputs로 바꾼다** | |
| 3. disable_parallel_tool_use를 true로 설정하면 해결된다 | |
| 4. any 대신 `{"type": "tool", "name": …}`로 바꾸면 된다 | |

**정답: 2.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — 강제 호출 제약

> **핵심:** 현재 Define tools 문서 기준으로 Claude Opus 5.5·Sonnet 5.5·Fable 5.1·Mythos 5.1은 강제 도구 호출(`any`·`tool`)을 **400 오류**로 거부하며, 대안은 auto + strict tool use 또는 structured outputs입니다.

1. **오답** - `max_tokens` 부족은 응답이 잘리는 문제(`stop_reason`이 `max_tokens`)이지, 요청 자체가 400으로 거부되는 원인이 아닙니다. 모든 요청이 일제히 실패한 시점이 모델 교체 직후라는 점이 단서입니다.
2. **정답** - 문서의 표는 이 모델들에서 `any`와 `tool`이 400 오류를 낸다고 하고, 대신 `auto`와 strict tool use(스키마에 맞는 입력 보장)를 쓰거나, 고정된 JSON 모양의 응답이 필요하면 structured outputs를 쓰라고 안내합니다. 어느 도구를 고를지는 `auto`에서도 프롬프트로 유도할 수 있고, `none`도 지원됩니다.
3. **오답** - `disable_parallel_tool_use`는 병렬 호출 개수를 제어하는 설정이며 `tool_choice` 객체 안에 넣습니다. 강제 호출 지원 여부와는 무관하므로 400 오류를 해결하지 못합니다.
4. **오답** - `{"type": "tool", "name": …}`도 강제 호출의 한 형태라 같은 이유로 400 오류로 거부됩니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [API errors (Forced tool use not supported)](https://platform.claude.com/docs/en/api/errors) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

---

## 문제 17
### **Agent SDK에서 코드 리뷰 서브에이전트를 읽기 전용으로 만들려고 상위 옵션에 `allowed_tools=["Read", "Grep", "Glob", "Agent"]`만 넣었다. 그런데 리뷰 중 서브에이전트가 Edit을 시도했다. 올바른 조치는?**

| 보기 | 설명 |
|------|------|
| **1. allowed_tools는 자동 승인 목록일 뿐이므로, 서브에이전트의 AgentDefinition에 `tools=["Read", "Grep", "Glob"]`을 지정한다(또는 Edit·Write를 disallowedTools로 뺀다)** | |
| 2. allowed_tools에 Edit을 추가해 권한 프롬프트를 없앤다 | |
| 3. 서브에이전트 프롬프트에 "파일을 고치지 마라"만 쓴다 | |
| 4. 서브에이전트의 tool_choice를 none으로 둔다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — 가용성 vs 권한

> **핵심:** Agent SDK에서 `tools`와 맨 이름의 `disallowedTools`는 도구를 세션에 **존재하게 할지(가용성)**를, `allowedTools`는 묻지 않고 **승인할지(권한)**를 정하는 서로 다른 층입니다.

1. **정답** - `allowed_tools`는 나열한 도구를 권한 프롬프트 없이 실행하게 하는 자동 승인 목록일 뿐, 나머지 도구를 막지 않습니다. 서브에이전트의 `AgentDefinition`에 `tools=["Read", "Grep", "Glob"]`을 지정하면 그 밖의 도구는 서브에이전트 세션에 아예 없어 시도조차 할 수 없고, Edit·Write를 맨 이름으로 `disallowedTools`에 넣어도 컨텍스트에서 빠집니다.
2. **오답** - `allowed_tools`에 Edit을 넣으면 편집이 막히는 것이 아니라 오히려 권한 프롬프트 없이 자동 승인됩니다. 읽기 전용이라는 목표와 정반대입니다.
3. **오답** - "파일을 고치지 마라"는 프롬프트 지시는 확률적인 억제일 뿐 Edit 도구는 여전히 사용할 수 있습니다.
4. **오답** - `tool_choice: none`은 도구 호출을 모두 막으므로 Read·Grep·Glob까지 쓸 수 없어 리뷰 자체가 불가능해집니다.

📚 근거: [Agent SDK: Give Claude custom tools](https://code.claude.com/docs/en/agent-sdk/custom-tools) · [Agent SDK: Subagents](https://code.claude.com/docs/en/agent-sdk/subagents)

---

## 문제 18
### **`tool_choice`가 `{"type": "tool", "name": "…"}`이고 `disable_parallel_tool_use: true`일 때(강제 호출을 지원하는 모델) Claude의 응답은?**

| 보기 | 설명 |
|------|------|
| 1. 도구를 최대 하나 호출하거나 텍스트로만 답할 수 있다 | |
| 2. 같은 도구를 여러 번 병렬로 호출한다 | |
| **3. 정확히 하나의 도구 호출을 한다** | |
| 4. 설명 텍스트를 먼저 쓰고 도구를 호출한다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — 병렬 호출 제어

> **핵심:** `disable_parallel_tool_use: true`는 `tool_choice` 객체 안에 넣으며, `auto`와 함께면 응답당 도구 호출 **최대 하나**, `any`·`tool`과 함께면 **정확히 하나**입니다.

1. **오답** - "최대 하나 호출하거나 텍스트로만 답할 수 있다"는 `auto`와 조합했을 때의 동작입니다. 강제 호출(`tool`)에서는 텍스트만으로 답하는 선택지가 없습니다.
2. **오답** - 병렬 호출을 끈 설정과 모순됩니다. 같은 도구라도 한 응답에서 여러 번 병렬로 부르지 않습니다.
3. **정답** - Parallel tool use 문서는 `tool_choice` 유형이 `any`나 `tool`일 때 `disable_parallel_tool_use: true`면 Claude가 정확히 하나의 도구를 호출한다고 설명합니다. 지정한 도구 하나가 한 번 호출됩니다.
4. **오답** - `any`나 `tool`이면 API가 assistant 메시지를 미리 채워 도구 사용을 강제하므로, 요청해도 `tool_use` 블록 앞에 자연어 설명이 나오지 않습니다. 설명이 필요하면 `auto`에 사용자 메시지로 "get_x 도구를 써서 답해" 같은 지시를 넣습니다.

📚 근거: [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

---

## 문제 19
### **개발자가 저장소 A에서 `claude mcp add --transport http tracker https://tracker.example.com/mcp`를 실행했다. 저장소 B로 옮겨 `/mcp`를 보니 tracker가 없다. 가장 그럴듯한 원인은?**

| 보기 | 설명 |
|------|------|
| 1. HTTP 서버는 세션마다 다시 추가해야 한다 | |
| **2. 스코프를 생략해 local로 등록되었고, 저장소 A의 항목 아래에만 저장되었다** | |
| 3. 저장소 B의 `.mcp.json`이 저장소 A의 설정을 덮어썼다 | |
| 4. user 스코프 서버는 승인 프롬프트를 통과해야 보인다 | |

**정답: 2.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — 기본 스코프

> **핵심:** `claude mcp add`의 기본 스코프는 **local**이며, `~/.claude.json`의 현재 프로젝트 항목 아래에 저장되어 그 프로젝트에서만, 나에게만 로드됩니다.

1. **오답** - HTTP 서버를 세션마다 다시 추가할 필요는 없습니다. 한 번 추가한 서버는 해당 스코프의 설정 파일에 남아 다음 세션에도 로드됩니다.
2. **정답** - 스코프를 생략했으니 local로 등록되었고, 저장소 A의 항목 아래에만 저장되었습니다. 퀵스타트 문서의 문제 해결 항목도 "local 스코프 서버는 추가한 프로젝트에 묶인다"고 설명하며, 모든 저장소에서 쓰려면 `--scope user`로 다시 추가하라고 안내합니다.
3. **오답** - 저장소 B의 `.mcp.json`이 다른 저장소의 설정을 덮어쓰는 일은 없습니다. 여러 스코프에 같은 이름이 있을 때도 덮어쓰기가 아니라 우선순위(local → project → user)로 정의 하나를 고를 뿐입니다.
4. **오답** - 승인 프롬프트는 저장소의 `.mcp.json`에서 오는 project 스코프 서버에 대한 것입니다. user 스코프 서버는 승인 없이 모든 프로젝트에서 로드되며, 애초에 이 서버는 user 스코프도 아닙니다.

📚 근거: [Connect to MCP servers (quickstart)](https://code.claude.com/docs/en/mcp-quickstart) · [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

---

## 문제 20
### **팀이 사내 티켓 서버를 모든 팀원에게 배포하려 한다. 서버는 Bearer 토큰 인증을 요구하고, 토큰은 사람마다 다르다. 가장 알맞은 구성은?**

| 보기 | 설명 |
|------|------|
| 1. 대표 토큰 하나를 `.mcp.json`에 적고 저장소를 비공개로 유지한다 | |
| 2. 각자 `.claude/settings.json`의 `mcpServers`에 서버와 토큰을 적는다 | |
| 3. 헤더에 `Bearer ${ANTHROPIC_AUTH_TOKEN}`을 넣어 기존 자격 증명을 재사용한다 | |
| **4. project 스코프 `.mcp.json`에 `"Authorization": "Bearer ${TICKET_TOKEN}"`을 쓰고 각자 환경 변수를 설정한다** | |

**정답: 4.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — 비밀값 공유

> **핵심:** 파일은 project 스코프 `.mcp.json`으로 커밋해 공유하고, 사람마다 다른 토큰은 `${VAR}` **환경 변수 확장**으로 각자의 셸 환경에서 채웁니다.

1. **오답** - 대표 토큰을 `.mcp.json`에 적으면 저장소가 비공개라도 클론한 모든 사람과 커밋 이력에 실제 비밀값이 남습니다. 사람마다 다른 토큰을 쓴다는 요구도 충족하지 못합니다.
2. **오답** - Debug your configuration 문서는 `settings.json`이 `mcpServers` 키를 읽지 않는다고 명시합니다. 그곳에 적은 서버는 나타나지 않으므로 동작하지 않습니다. 프로젝트 서버는 저장소 루트의 `.mcp.json`에 둡니다.
3. **오답** - Claude Code는 원격 서버의 `url`과 `headers`에서 `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY` 같은 자체 자격 증명 변수를 확장하지 않고 빈 값으로 읽습니다. 서버는 `Bearer `만 받아 보통 401로 거부합니다. 애초에 그 값은 사내 티켓 서버의 토큰도 아닙니다.
4. **정답** - MCP 문서의 방식 그대로입니다. `"Authorization": "Bearer ${TICKET_TOKEN}"`처럼 참조만 커밋하고 각자 `TICKET_TOKEN`을 설정하면 파일은 공유되고 값은 사람마다 다르게 채워집니다. 변수가 없으면 서버는 로드되되 누락 경고가 뜨고 `${VAR}` 문자열이 확장되지 않은 채 쓰이므로, 비밀값에는 `:-default` 기본값을 주지 않습니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) · [Debug your configuration](https://code.claude.com/docs/en/debug-your-config)

---

## 문제 21
### **`metrics`라는 서버가 user 스코프(`~/.claude.json` 최상위, URL X, 추가 헤더 포함)와 프로젝트 `.mcp.json`(URL Y)에 모두 정의되어 있고 local 정의는 없다. Claude Code는 어떻게 연결하는가?**

| 보기 | 설명 |
|------|------|
| **1. project 정의 전체를 써서 URL Y에 한 번 연결한다** | |
| 2. URL Y에 user 정의의 헤더를 합쳐 연결한다 | |
| 3. 두 정의에 각각 연결해 도구가 두 벌 생긴다 | |
| 4. 개인 설정이 팀 설정을 덮어쓰므로 user 정의를 쓴다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — 우선순위

> **핵심:** 같은 이름의 서버가 여러 곳에 있으면 Claude Code는 우선순위(local → project → user → 플러그인 → claude.ai 커넥터)가 가장 높은 출처의 **항목 전체**로 한 번만 연결하며, 필드를 병합하지 않습니다.

1. **정답** - local 정의가 없으니 project가 user보다 우선합니다. project 항목 전체를 써서 URL Y에 한 번 연결하고, 엔드포인트가 서로 다르므로 `claude mcp list`와 `/mcp`에 충돌 경고가 표시됩니다.
2. **오답** - 문서는 "The entire server entry from that source is used; fields are not merged across scopes."라고 적습니다. user 정의의 추가 헤더는 project 정의에 섞이지 않습니다.
3. **오답** - 세 스코프 사이의 중복은 이름으로 판단하므로 같은 이름 `metrics`는 하나로 취급되어 한 번만 연결됩니다. 도구가 두 벌 생기지 않습니다.
4. **오답** - "개인 설정이 이긴다"는 local 스코프에만 해당합니다. user 스코프는 project보다 순위가 낮습니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

---

## 문제 22
### **장애 분석 에이전트에 `search_incidents` MCP 도구(설명: "Search incidents.")를 붙였다. 그런데 에이전트는 계속 Bash로 로컬 로그 파일만 grep한다. 먼저 해야 할 조치는?**

| 보기 | 설명 |
|------|------|
| 1. Bash 도구를 세션에서 제거해 MCP 도구만 남긴다 | |
| 2. 서버 이름을 바꿔 도구 목록에서 앞쪽에 오게 한다 | |
| **3. 어떤 데이터를 검색해 무엇을 반환하는지, 로컬 로그 검색 대신 언제 써야 하는지를 설명에 구체적으로 적는다** | |
| 4. 설명을 더 짧게 줄여 매칭이 쉬워지게 한다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — 도구 설명

> **핵심:** MCP 도구도 설명을 근거로 선택되므로, 범위·반환값·사용 시점·한계를 적어 **내장 도구와의 차이**를 설명에서 드러내야 합니다.

1. **오답** - Bash를 세션에서 제거하면 테스트·빌드·git 같은 다른 정당한 용도까지 막힙니다. 설명이 부족하다는 원인은 그대로 둔 우회책입니다.
2. **오답** - 도구 목록에서의 순서는 선택 근거가 되지 않습니다. 서버 이름을 바꿔 앞쪽에 오게 해도 "Search incidents."라는 한 줄 설명으로는 로컬 로그 grep과 무엇이 다른지 알 수 없습니다.
3. **정답** - 어떤 데이터(예: 사내 장애 관리 시스템의 기록)를 검색해 무엇을 반환하는지, 로컬 로그 검색 대신 언제 써야 하는지를 적으면 에이전트가 MCP 도구를 고를 때 무엇을 얻는지 알게 됩니다. Define tools 문서는 도구에 대한 맥락을 많이 줄수록 Claude가 언제, 어떻게 쓸지 더 잘 판단한다고 합니다. tool search가 켜져 있으면 검색에 걸릴 단어를 설명 앞부분에 두는 것도 중요합니다.
4. **오답** - 설명을 더 줄이면 판단 재료가 더 사라집니다. 문서는 도구당 최소 3~4문장의 자세한 설명을 권합니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

---

## 문제 23
### **데이터 분석 에이전트가 어떤 테이블이 있는지 몰라 `run_query`로 이름을 추측하며 오류를 여러 번 낸다. 탐색성 호출을 줄이는 MCP 설계는?**

| 보기 | 설명 |
|------|------|
| 1. `run_query`의 타임아웃을 늘린다 | |
| 2. 시스템 프롬프트에 "추측하지 말라"고 적는다 | |
| 3. 테이블마다 별도의 조회 도구를 만든다 | |
| **4. 테이블 목록과 스키마를 MCP 리소스(예: `schema://warehouse/...`)로 노출한다** | |

**정답: 4.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — 리소스

> **핵심:** "무엇이 있는지" 보여 주는 읽기용 카탈로그는 MCP **리소스**가 맞는 자리입니다. 에이전트가 목록을 먼저 보고 필요한 것만 질의할 수 있습니다.

1. **오답** - 타임아웃을 늘려도 에이전트가 테이블 이름을 모른다는 문제는 그대로입니다. 오류의 원인은 시간이 아니라 정보 부족입니다.
2. **오답** - "추측하지 말라"는 지시는 없는 정보를 만들어 주지 못합니다. 에이전트는 여전히 어떤 테이블이 있는지 모릅니다.
3. **오답** - 테이블마다 조회 도구를 만들면 도구 수만 늘어 선택이 어려워지고, 테이블이 추가될 때마다 도구도 늘려야 합니다.
4. **정답** - MCP 명세에서 리소스는 URI로 식별되는 읽기용 데이터이며, 클라이언트는 `resources/list`로 목록을, `resources/read`로 내용을 받습니다. Claude Code는 서버가 리소스를 지원하면 리소스를 나열하고 읽는 도구를 자동으로 제공하고, 프롬프트에서 `@`로 참조하면 첨부로 가져옵니다. 테이블 목록과 스키마를 `schema://warehouse/...` 같은 리소스로 노출하면 추측성 `run_query` 호출이 줄어듭니다.

📚 근거: [MCP spec: Resources](https://modelcontextprotocol.io/specification/2025-11-25/server/resources) · [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

---

## 문제 24
### **기본 설정의 Claude Code(tool search 지원 모델)에서 MCP 서버 5개를 연결했다. 세션 시작 시 이 서버들로부터 컨텍스트에 들어가는 것은?**

| 보기 | 설명 |
|------|------|
| **1. 도구 이름과 서버 instructions — 전체 스키마는 필요할 때 로드** | |
| 2. 모든 도구의 전체 JSON 스키마 | |
| 3. 아무것도 없음 — 사용자가 `@`로 부를 때까지 | |
| 4. 각 서버의 리소스 본문 전체 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — tool search

> **핵심:** Claude Code는 tool search가 기본으로 켜져 있어 세션 시작 시 MCP 서버의 **도구 이름과 서버 instructions만** 컨텍스트에 싣고, 전체 스키마는 필요할 때 불러옵니다.

1. **정답** - MCP 문서는 "Only tool names and server instructions load at session start"라고 적습니다. 도구 정의는 Claude가 필요할 때까지 미뤄지고, 그래서 서버를 더 추가해도 컨텍스트 영향이 작습니다.
2. **오답** - 모든 도구의 전체 스키마를 미리 싣는 것은 `ENABLE_TOOL_SEARCH=false`로 tool search를 껐을 때의 동작입니다(지원하지 않는 이전 모델 등에서도 미리 로드).
3. **오답** - 사용자가 `@`로 부를 때까지 아무것도 실리지 않는 것은 아닙니다. 도구 이름과 서버 instructions는 처음부터 들어갑니다. `@` 참조는 리소스를 첨부할 때 쓰는 방식입니다.
4. **오답** - 리소스 본문은 세션 시작 시 미리 실리지 않습니다. 사용자가 `@`로 참조하면 첨부로 가져오고, Claude가 리소스 읽기 도구로 필요할 때 읽습니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) · [Agent SDK: Tool search](https://code.claude.com/docs/en/agent-sdk/tool-search)

---

## 문제 25
### **운영 로그에 `PAYMENT_GATEWAY_TIMEOUT`이 찍혔다. 이 코드를 만드는 곳을 저장소 전체에서 찾아야 한다. 알맞은 도구는?**

| 보기 | 설명 |
|------|------|
| 1. Glob `**/*PAYMENT_GATEWAY_TIMEOUT*` | |
| 2. 모든 소스 파일을 Read한 뒤 눈으로 찾는다 | |
| **3. Grep으로 `PAYMENT_GATEWAY_TIMEOUT`을 검색한다** | |
| 4. Edit로 해당 문자열을 다른 값으로 바꿔 본다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — 내용 검색

> **핵심:** 파일 **안의** 문자열을 찾는 것은 내용 검색이므로 Grep이 맞습니다. Glob은 파일 경로만 봅니다.

1. **오답** - Glob은 경로 패턴만 맞추므로 파일 **이름**에 `PAYMENT_GATEWAY_TIMEOUT`이 들어간 경우만 찾습니다. 코드 안에서 그 오류 코드를 만드는 곳은 찾지 못합니다.
2. **오답** - 모든 소스 파일을 Read하면 무관한 코드로 컨텍스트를 낭비하고, 중요한 한 곳이 그 속에 묻힙니다.
3. **정답** - Grep은 파일 내용을 정규식으로 검색합니다. 기본 `output_mode`인 `files_with_matches`로 해당 파일 경로를 먼저 얻고, 필요하면 `content` 모드로 일치하는 줄을 봅니다. 그다음 찾은 파일만 Read하면 됩니다.
4. **오답** - Edit는 파일을 수정하는 도구이지 검색 도구가 아닙니다. 위치를 찾으려고 코드를 바꿔 보는 것은 부작용만 남깁니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

---

## 문제 26
### **여러 패키지에 흩어진 `*.stories.tsx` 파일 목록을 얻으려 한다. 가장 직접적인 방법은?**

| 보기 | 설명 |
|------|------|
| **1.** Glob `**/*.stories.tsx` | |
| 2. Grep `stories`를 `content` 모드로 | |
| 3. Read로 각 패키지 디렉터리를 연다 | |
| 4. Write로 목록 파일을 만든다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — 경로 검색

> **핵심:** 이름 규칙으로 파일을 찾는 것은 **경로 검색**이므로 Glob의 일입니다. Glob은 파일을 열지 않아 구조에 관한 질문에 가장 저렴합니다.

1. **정답** - Glob `**/*.stories.tsx`는 여러 패키지에 흩어진 파일도 하위 디렉터리 전체에서 이름 패턴으로 한 번에 찾습니다.
2. **오답** - Grep은 내용을 검색하므로 `content` 모드는 "stories"라는 단어가 들어간 **줄**을 돌려줍니다. 파일 목록이라는 목적과 다르고, 이름에 stories가 없는 파일의 줄까지 섞입니다.
3. **오답** - Tools reference 문서에 따르면 Read는 파일만 읽고 디렉터리는 읽지 못합니다. 디렉터리 내용은 `ls` 같은 셸 명령으로 나열합니다.
4. **오답** - Write는 파일을 만들거나 덮어쓰는 도구라 목록을 "얻는" 데 쓸 수 없습니다. 목록을 만들려면 먼저 찾아야 합니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference)

---

## 문제 27
### **설정 파일에서 staging 섹션의 `replicas: 2`만 4로 바꾸려는데, Edit가 "old_string이 3번 나온다"며 실패했다. 다음 조치로 가장 알맞은 것은?**

| 보기 | 설명 |
|------|------|
| 1. `replace_all: true`로 다시 시도한다 | |
| 2. 파일을 읽지 않고 기억나는 내용으로 Write해 덮어쓴다 | |
| 3. Glob으로 같은 이름의 다른 파일을 찾는다 | |
| **4. `staging:` 머리 줄까지 포함하도록 `old_string`을 넓혀 한 곳으로 특정한다** | |

**정답: 4.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Edit 실패

> **핵심:** Edit는 `old_string`이 파일에 **정확히 한 번** 나와야 성공합니다. 여러 번 나오면 앞뒤 문맥을 넓혀 한 곳으로 특정하는 것이 기본 복구입니다.

1. **오답** - `replace_all: true`는 모든 일치를 바꾸므로 dev·staging·prod 세 섹션의 `replicas: 2`가 모두 4로 바뀝니다. 의도는 staging 하나였습니다.
2. **오답** - 읽지 않고 기억으로 Write하면 파일 전체를 덮어쓰므로, 기억과 다른 부분이나 다른 사람의 변경을 잃을 위험이 큽니다. 도구 문서상 기존 파일을 덮어쓰기 전에 읽어야 하는 규칙도 적용됩니다(이전 모델은 항상, 최신 모델은 조건에 따라).
3. **오답** - Glob으로 같은 이름의 다른 파일을 찾는 것은 이 파일 안에서 일치가 여러 개라는 문제와 관계가 없습니다.
4. **정답** - `staging:` 머리 줄(필요하면 그 아래 줄까지)을 `old_string`에 포함하면 staging 블록 하나로 특정되어 고유성 검사를 통과합니다. 일치는 공백과 들여쓰기까지 정확해야 하므로 파일에 있는 그대로 옮겨야 합니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference)

---

## 문제 28
### **Edit 대신 Read 후 Write로 파일을 바꾸는 것이 합리적인 경우는?**

| 보기 | 설명 |
|------|------|
| 1. 함수 하나의 반환값만 바꿀 때 | |
| **2. 반복되는 블록이 많아 고유한 앵커를 만들 수 없거나, 파일 대부분을 재구성할 때** | |
| 3. 파일 끝에 한 줄을 덧붙일 때 | |
| 4. 오타 하나를 고칠 때 | |

**정답: 2.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Read + Write

> **핵심:** Read로 현재 내용을 모두 확보한 뒤 Write로 통째로 쓰는 방법은 **고유한 앵커를 만들 수 없거나 파일 대부분을 다시 쓸 때** 확실한 대안입니다.

1. **오답** - 함수 하나의 반환값처럼 범위가 분명한 수정은 그 부분을 고유하게 가리키는 `old_string`으로 Edit하면 됩니다. 파일 전체를 다시 쓸 이유가 없습니다.
2. **정답** - 같은 블록이 반복되어 문맥을 넓혀도 한 번만 나오는 문자열을 만들 수 없을 때, 또는 생성 코드처럼 파일 대부분을 재구성할 때는 Edit가 맞지 않습니다. 이때 Read로 전체를 읽고 수정된 전체 내용을 Write하면 의도한 결과를 확실히 얻습니다.
3. **오답** - Write에는 덧붙이기(append) 기능이 없고 전체 내용으로 덮어씁니다. 파일 끝의 마지막 줄을 앵커로 삼아 Edit하는 편이 알맞습니다.
4. **오답** - 오타 하나는 가장 작은 범위의 수정입니다. 오타가 있는 줄을 `old_string`으로 Edit하면 됩니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference)

---

## 문제 29
### **`toMinorUnits`의 시그니처를 바꾸려 한다. 이 함수는 `packages/money/src/index.ts`에서 별칭으로도 재export된다. Grep `toMinorUnits` 결과가 예상보다 적다. 누락 없이 호출부를 찾는 방법은?**

| 보기 | 설명 |
|------|------|
| **1. index.ts를 읽어 별칭을 포함한 export 이름을 모두 모은 뒤 이름마다 Grep한다** | |
| 2. Glob `**/*toMinorUnits*`로 파일을 찾는다 | |
| 3. packages/ 아래 모든 파일을 Read한다 | |
| 4. Grep 결과가 적으므로 영향 범위가 작다고 판단한다 | |

**정답: 1.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — 재export 추적

> **핵심:** 외부 코드는 래퍼·배럴 모듈이 내보낸 이름(별칭 포함)으로 함수를 씁니다. **공개 경계에서 이름 목록을 먼저 모으고** 이름마다 검색해야 누락이 없습니다.

1. **정답** - `index.ts`에서 `export { toMinorUnits as toCents }` 같은 별칭을 포함해 내보내는 이름을 모두 확인한 뒤, 원래 이름과 별칭 각각을 Grep하면 별칭으로 가져다 쓰는 호출부까지 찾습니다. 시그니처 변경처럼 모든 호출부를 고쳐야 할 때 특히 중요합니다.
2. **오답** - Glob은 경로만 봅니다. 파일 이름에 `toMinorUnits`가 들어간 파일만 나오므로 호출부를 찾지 못합니다.
3. **오답** - `packages/` 아래 모든 파일을 읽으면 컨텍스트를 크게 낭비합니다. 이름 목록을 얻은 뒤 검색 결과 중 필요한 파일만 읽으면 됩니다.
4. **오답** - Grep 결과가 적은 이유는 별칭으로 가져다 쓰는 곳이 원래 이름 문자열을 포함하지 않기 때문입니다. 이를 영향 범위가 작다는 근거로 삼으면 별칭 사용처를 놓친 채 결론을 내리게 됩니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

---

## 문제 30
### 빌드 산출물 폴더 `dist/`는 `.gitignore`에 있다. Grep으로 검색할 때는 `dist/` 파일이 나오지 않았는데, Glob `**/*.js`에는 나왔다. 이유는?

| 보기 | 설명 |
|------|------|
| 1. Glob은 수정 시각이 최근인 파일만 돌려준다 | |
| 2. Grep은 JavaScript 파일을 검색하지 않는다 | |
| **3. Grep은 `.gitignore`를 따르고, Glob은 기본적으로 따르지 않는다** | |
| 4. `dist/`에 대한 권한이 Grep에만 막혀 있다 | |

**정답: 3.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — .gitignore

> **핵심:** 두 검색 도구는 `.gitignore`를 다르게 처리합니다. **Grep은 따르고**(무시된 파일을 건너뜀), **Glob은 기본적으로 따르지 않습니다**(무시된 파일도 찾음).

1. **오답** - Glob 결과는 수정 시각 순으로 **정렬**될 뿐, 최근 파일만 골라내지 않습니다. 결과는 최대 100개에서 잘리며, 넘으면 잘렸다는 표시가 붙습니다.
2. **오답** - Grep은 파일 형식과 상관없이 내용을 검색하며 JavaScript 파일도 당연히 검색합니다. `glob`이나 `type` 파라미터로 대상을 좁힐 수 있을 뿐입니다.
3. **정답** - Tools reference 문서에 따르면 Grep은 `.gitignore`를 따르므로 무시된 `dist/` 파일을 건너뛰고, Glob은 기본적으로 따르지 않아 무시된 파일도 함께 찾습니다. Glob이 `.gitignore`를 따르게 하려면 Claude Code 실행 전에 `CLAUDE_CODE_GLOB_NO_IGNORE=false`를 설정하고, 무시된 파일을 Grep하려면 그 경로를 직접 지정합니다.
4. **오답** - 권한 규칙은 이런 차이를 만들지 않습니다. 두 도구 모두 읽기 전용이며, 결과 차이는 `.gitignore` 처리 방식에서 옵니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference)

---
