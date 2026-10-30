<!-- 출처·작성 원칙: CertSafari CCDV-F 레슨(https://certsafari.com/anthropic/claude-developer-foundations/learn) 도메인 8(8.1~8.3)의 체크포인트·Predict-first 문항 39개에 1:1로 대응한다. 각 체크포인트가 묻는 개념과 정답 근거만 따르고, 시나리오·문장·보기는 새로 썼다(원문은 옮기지 않음). 순서 맞추기·짝 맞추기·빈칸·예측 형식은 4지선다로 바꿨다. 해설은 Anthropic 공식 문서와 MCP 명세(2026년 10월 기준, 명세 개정 2026-07-28)를 확인해 한글로 작성. -->

## 문제 1
### **A travel-planning app enables the `web_search` server tool and its own `check_seat_map` client tool. One response has `stop_reason: "tool_use"` and contains a `server_tool_use` block for `web_search` with no matching result block, plus a `tool_use` block for `check_seat_map`. What should the app send next?**

| 보기 | 설명 |
|------|------|
| 1. Re-send the assistant content unchanged with no new user message, exactly as it would for a `pause_turn` response. | |
| 2. Send a `tool_result` for `check_seat_map` and a second `tool_result` with a placeholder for the pending `web_search` call. | |
| **3. Run `check_seat_map`, then send a user message containing only its `tool_result`, keeping the same `tools` array in the request.** | |
| 4. Run `check_seat_map` and send its `tool_result`, removing `web_search` from `tools` so that the pending search is cancelled. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

여행 일정 앱이 `web_search` 서버 도구와 자체 클라이언트 도구 `check_seat_map`을 켰습니다. 어떤 응답의 `stop_reason`이 `"tool_use"`이고, 결과 블록이 짝지어지지 않은 `web_search`의 `server_tool_use` 블록과 `check_seat_map`의 `tool_use` 블록이 함께 들어 있습니다. 앱은 다음에 무엇을 보내야 할까요?

- **①** `pause_turn` 응답일 때와 똑같이, 새 사용자 메시지 없이 어시스턴트 내용을 그대로 다시 보낸다
- **②** `check_seat_map`의 `tool_result`와, 대기 중인 `web_search` 호출에 대한 자리표시용 `tool_result`를 하나 더 보낸다
- **③** `check_seat_map`을 실행한 뒤 그 `tool_result`만 담은 사용자 메시지를 보내고, 요청의 `tools` 배열은 그대로 유지한다
- **④** `check_seat_map`을 실행해 `tool_result`를 보내되, 대기 중인 검색이 취소되도록 `tools`에서 `web_search`를 뺀다

> **핵심 진단:** Claude가 서버 도구와 클라이언트 도구를 같은 병렬 호출 묶음에서 부르면, API는 서버 도구를 실행하지 않고 **클라이언트 도구를 먼저 실행하도록 곧바로 돌아옵니다**. 이때 `stop_reason`은 `pause_turn`이 아니라 `tool_use`이고, 결과 블록이 없는 `server_tool_use`가 남아 있다는 것 외에 별도 표시는 없습니다. 공식 문서가 정한 대응은 **클라이언트 도구의 `tool_result` 블록만 담은 사용자 메시지를 보내고, 같은 `tools` 배열을 유지하는 것** 입니다. 그러면 API가 결과를 아직 열린 어시스턴트 턴에 붙이고, 미뤄 둔 `web_search`를 실행한 뒤, 다음 응답을 그 검색의 결과 블록으로 시작합니다.

1. **오답** - `pause_turn`은 클라이언트 `tool_use`를 기다리게 두는 일이 없어서 그대로 다시 보내면 됩니다. 이 응답은 클라이언트 도구가 결과를 기다리고 있으므로, 그 결과를 보내지 않으면 턴을 이어 갈 수 없습니다.
2. **오답** - 서버 도구의 결과는 API가 만듭니다. 앱은 서버 도구에 대해 `tool_result`를 구성하지 않으며, 대기 중인 서버 호출은 다음 요청이 시작될 때 API가 실행합니다.
3. **정답** - 클라이언트 결과만 보내고 같은 도구 배열을 유지하는 것이 문서의 혼합 턴 처리 방법입니다. 대기 중이던 검색은 다음 요청에서 실행됩니다.
4. **오답** - 대기 중인 서버 도구가 후속 요청에 정의되어 있지 않으면 "but no `web_search` tool was provided" 형태로 끝나는 400 오류가 납니다. 도구를 빼는 것은 취소 수단이 아닙니다.

> 💡 **시험 포인트:** "결과 없는 `server_tool_use` + 클라이언트 `tool_use` + `stop_reason: tool_use`"는 혼합 턴입니다. 클라이언트 결과만, 다른 블록 없이, 같은 `tools`로 보냅니다.

> 📚 근거 문서: [Server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

---

## 문제 2
### **A DevOps assistant team is choosing between Anthropic's `bash` tool and a custom `run_shell` tool they wrote with an equivalent schema. Which statement correctly describes the trade-off?**

| 보기 | 설명 |
|------|------|
| **1. Claude calls `bash` more reliably because its schema is trained in, but the team's app still executes each command and returns the result.** | |
| 2. The `bash` tool runs inside Anthropic's sandbox, so the team no longer has to execute commands or build a `tool_result` for them. | |
| 3. The two are equally reliable, because Claude reads every tool schema the same way no matter who wrote it or how it is named. | |
| 4. The custom `run_shell` tool is more reliable, because a schema written for the team's own environment always beats a generic one. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

DevOps 어시스턴트 팀이 Anthropic의 `bash` 도구와, 같은 기능의 스키마로 직접 만든 커스텀 도구 `run_shell` 중 하나를 고르려 합니다. 둘 사이의 장단점을 올바르게 설명한 것은 무엇일까요?

- **①** `bash`는 스키마가 학습되어 있어 Claude가 더 안정적으로 호출하지만, 명령을 실행하고 결과를 돌려주는 일은 여전히 팀의 앱이 한다
- **②** `bash` 도구는 Anthropic의 샌드박스에서 실행되므로, 팀이 더는 명령을 실행하거나 `tool_result`를 만들 필요가 없다
- **③** 누가 썼든 이름이 무엇이든 Claude는 모든 도구 스키마를 같은 방식으로 읽으므로 두 도구의 신뢰도는 같다
- **④** 팀 환경에 맞게 쓴 스키마가 범용 스키마보다 항상 낫기 때문에 커스텀 `run_shell` 도구가 더 안정적이다

> **핵심 진단:** `bash`는 **Anthropic 스키마 클라이언트 도구** 입니다. 스키마는 Anthropic이 공개했지만 실행 방식은 사용자 정의 도구와 같아서, 응답의 `tool_use`를 받아 **앱이 명령을 실행하고 `tool_result`를 돌려줍니다**. 이런 도구를 쓰는 이유는 스키마가 학습되어 있기 때문입니다. Claude는 바로 이 시그니처를 쓴 성공 궤적 수천 건으로 최적화되어 있어, 같은 일을 하는 커스텀 도구보다 더 안정적으로 호출하고 오류에서도 더 잘 회복합니다.

1. **정답** - 이점은 호출 신뢰도이고, 실행 책임은 그대로 앱에 있다는 두 사실을 모두 맞게 설명합니다.
2. **오답** - Anthropic이 실행하는 것은 `web_search`·`web_fetch`·`code_execution`·`tool_search` 같은 서버 도구입니다. `bash`는 클라이언트 도구이므로 명령은 팀의 환경에서 돕니다.
3. **오답** - 문서는 학습된 스키마가 커스텀 도구보다 더 안정적으로 호출된다고 명시합니다. 스키마의 출처가 신뢰도에 영향을 줍니다.
4. **오답** - 환경 특화가 유리할 때도 있지만 '항상'은 틀렸습니다. 공식 문서의 비교 결론은 학습된 스키마 쪽이 호출과 회복에서 더 안정적이라는 것입니다.

> 💡 **시험 포인트:** "스키마를 누가 썼나"와 "누가 실행하나"는 다른 질문입니다. `bash`·`text_editor`는 Anthropic이 스키마를 썼고, 실행은 앱이 합니다.

> 📚 근거 문서: [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

---

## 문제 3
### **A ticketing integration's `create_ticket` tool expects `priority` as an integer from 1 to 4, but Claude occasionally sends "2" as a string, which crashes the handler. The team wants a guarantee that every call matches the schema's types. What should they do?**

| 보기 | 설명 |
|------|------|
| 1. Add three `input_examples` that each show `priority` as an integer value. | |
| 2. Expand the `priority` description to say it must be an integer and never a string. | |
| 3. Set `tool_choice` to `{"type": "any"}` so that Claude always produces a tool call. | |
| **4. Set `strict: true` on the `create_ticket` tool definition.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

티켓 연동의 `create_ticket` 도구는 `priority`를 1~4의 정수로 기대하지만, Claude가 가끔 "2"를 문자열로 보내 핸들러가 죽습니다. 팀은 모든 호출이 스키마의 타입과 일치한다는 보장을 원합니다. 무엇을 해야 할까요?

- **①** `priority`를 정수로 보여 주는 `input_examples`를 세 개 추가한다
- **②** `priority` 설명을 늘려 반드시 정수이고 문자열이면 안 된다고 적는다
- **③** Claude가 항상 도구 호출을 만들도록 `tool_choice`를 `{"type": "any"}`로 설정한다
- **④** `create_ticket` 도구 정의에 `strict: true`를 설정한다

> **핵심 진단:** **`strict: true`** 는 문법 제약 샘플링(grammar-constrained sampling)으로 모델의 토큰 샘플링을 스키마에 맞는 출력으로 제한합니다. 그래서 도구 `input`이 `input_schema`를 정확히 따르고, `"2"` 대신 `2`처럼 타입이 맞는 인자가 **매번** 나온다고 문서가 보장합니다. 설명과 예시는 올바른 호출을 *더 자주* 만들 뿐, 보장하지는 않습니다.

1. **오답** - `input_examples`는 복잡한 입력의 패턴을 보여 주는 데 유용하지만 가능성을 높이는 장치입니다. 타입 준수를 보장하지 않습니다.
2. **오답** - 설명은 도구 성능에 가장 중요한 요소이지만, 지시문이라 여전히 어길 수 있습니다. 문서가 타입 보장 수단으로 제시하는 것은 strict 모드입니다.
3. **오답** - `any`는 도구 중 하나를 반드시 부르게 할 뿐 입력 형태와는 무관합니다. 게다가 Opus 5.5·Sonnet 5.5 등 일부 모델에서는 400 오류를 냅니다.
4. **정답** - strict 모드만이 입력이 스키마의 타입과 필수 필드를 정확히 따르도록 보장합니다.

> 💡 **시험 포인트:** "보장(guarantee)"이라는 단어가 입력 형태와 함께 나오면 `strict: true`입니다. 예시·설명·`tool_choice`는 보장 수단이 아닙니다.

> 📚 근거 문서: [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

---

## 문제 4
### **A logistics app has a `get_shipping_quote` tool that only supports domestic parcels under 30 kg, but Claude keeps calling it for international freight requests, which the carrier API then rejects. The tool already has `strict: true`. Predict which change will most directly reduce these out-of-scope calls.**

| 보기 | 설명 |
|------|------|
| 1. Add more `input_examples` showing domestic parcels, since examples define the tool's scope for Claude. | |
| **2. Rewrite the description to state what the tool covers, its weight and domestic-only limits, and when not to use it.** | |
| 3. Keep the definition and add `additionalProperties: false`, since strict mode then rejects unsupported requests. | |
| 4. Add an `enum` that lists the single supported country, so strict mode refuses to select the tool for other countries. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

물류 앱의 `get_shipping_quote` 도구는 30kg 미만의 국내 소포만 지원하는데, Claude가 국제 화물 요청에도 계속 이 도구를 호출하고 운송사 API가 이를 거부합니다. 도구에는 이미 `strict: true`가 설정되어 있습니다. 이런 범위 밖 호출을 가장 직접적으로 줄일 변경은 무엇일지 예측해 보세요.

- **①** 예시가 Claude에게 도구의 범위를 정해 주므로, 국내 소포를 보여 주는 `input_examples`를 더 추가한다
- **②** 도구가 다루는 범위, 무게와 국내 전용이라는 한계, 쓰지 말아야 할 때를 설명에 다시 쓴다
- **③** 정의는 그대로 두고 `additionalProperties: false`를 추가한다. 그러면 strict 모드가 지원하지 않는 요청을 거부한다
- **④** 지원하는 국가 하나만 나열한 `enum`을 추가해, strict 모드가 다른 국가에 대해서는 도구 선택을 거부하게 한다

> **핵심 진단:** 문제는 입력의 *형태* 가 아니라 *도구 선택* 입니다. strict 모드는 입력이 스키마를 따르도록 보장할 뿐 **어떤 요청에 이 도구를 쓸지는 다루지 않습니다**. 도구 선택을 이끄는 것은 설명이고, 문서는 설명에 무엇을 하는지, **언제 써야 하고 언제 쓰지 말아야 하는지**, 주의점과 한계를 담으라고 권합니다. 지원 범위와 제외 대상을 분명히 적으면 Claude가 국제 화물 요청에는 이 도구를 고르지 않게 됩니다.

1. **오답** - 예시는 올바른 호출의 *형식* 을 보여 줄 뿐 범위를 정의하지 않습니다. 문서도 설명을 우선하고 예시는 복잡한 입력에 보조로 쓰라고 합니다.
2. **정답** - 범위·한계·제외 조건을 설명에 넣는 것이 도구 선택 문제를 고치는 정공법입니다.
3. **오답** - `additionalProperties: false`는 정의되지 않은 필드를 막는 스키마 제약입니다. 요청이 국제 화물인지 판단하는 데는 아무 역할을 하지 않습니다.
4. **오답** - strict 모드는 도구를 고를지 말지 결정하지 않습니다. 국가를 `enum`으로 묶으면 Claude가 국제 요청에도 도구를 부르면서 허용된 국가 값을 억지로 채울 수 있어 오히려 잘못된 견적이 나올 수 있습니다.

> 💡 **시험 포인트:** 엉뚱한 도구 선택·범위 밖 호출 → 설명을 고친다. 타입 오류·필드 누락 → `strict`. 두 처방을 바꿔 놓은 보기가 함정입니다.

> 📚 근거 문서: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

---

## 문제 5
### **An expense-processing service runs on Claude Haiku 5.5 and must respond to every receipt by calling its `record_expense` tool, never with plain text and never with a different tool. Which `tool_choice` setting does this?**

| 보기 | 설명 |
|------|------|
| 1. `{"type": "auto"}` | |
| 2. `{"type": "any"}` | |
| **3. `{"type": "tool", "name": "record_expense"}`** | |
| 4. `{"type": "none"}` | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

경비 처리 서비스가 Claude Haiku 5.5에서 돌아가며, 영수증마다 반드시 `record_expense` 도구를 호출해 응답해야 합니다. 일반 텍스트로 답하거나 다른 도구를 불러서는 안 됩니다. 이렇게 만드는 `tool_choice` 설정은 무엇일까요?

- **①** `{"type": "auto"}`
- **②** `{"type": "any"}`
- **③** `{"type": "tool", "name": "record_expense"}`
- **④** `{"type": "none"}`

> **핵심 진단:** `tool_choice`의 네 옵션 중 **특정 도구 하나를 반드시 쓰게 하는 것은 `tool` 타입** 입니다. Haiku 5.5는 강제 호출을 받아들이는 모델이므로 이 설정이 동작합니다. 다만 강제 호출은 모든 모델에서 되지 않습니다. 2026년 10월 문서 기준 Claude Opus 5.5·Sonnet 5.5·Fable 5.1·Mythos 5.1에서는 `any`와 `tool`이 400 오류를 내고, 수동 extended thinking(`thinking: {type: "enabled"}`)을 켠 요청에서도 지원되지 않습니다. 강제 호출이 받아들여지는 모델에서도 사고(thinking)를 건너뛰고 `tool_use` 블록부터 시작합니다.

| 옵션 | 동작 |
|---|---|
| `auto` | 도구를 쓸지 Claude가 정한다 (`tools`가 있을 때 기본값) |
| `any` | 제공된 도구 중 하나는 반드시 쓴다 |
| `tool` | 지정한 도구를 반드시 쓴다 |
| `none` | 도구를 쓰지 않는다 |

1. **오답** - `auto`에서는 Claude가 텍스트로만 답하거나 다른 도구를 고를 수 있습니다. "반드시 이 도구"라는 요구를 충족하지 못합니다.
2. **오답** - `any`는 도구 사용을 강제하지만 *어느* 도구인지는 정하지 않습니다. 다른 도구가 정의되어 있으면 그 도구가 불릴 수 있습니다.
3. **정답** - 지원 모델에서 지정한 도구 하나의 호출을 강제하는 유일한 옵션입니다.
4. **오답** - `none`은 도구 사용을 막습니다. 요구와 정반대입니다.

> 💡 **시험 포인트:** 강제 호출 문항에서는 모델을 확인하세요. 지원 모델이면 `{"type": "tool", "name": …}`, Opus 5.5 계열이면 400이므로 대안(`auto` + `strict`)을 고릅니다.

> 📎 참고: CertSafari 체크포인트는 모델 조건 없이 `tool` 타입을 정답으로 둡니다. 최신 공식 문서에는 모델별 제한이 있어, 이 문항은 강제 호출을 받아들이는 모델(Haiku 5.5)을 명시해 정답이 문서와 어긋나지 않게 했습니다.

> 📚 근거 문서: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

---

## 문제 6
### **A developer is writing the description for a `lookup_order` tool. Which of the following is the least useful content to include in that description?**

| 보기 | 설명 |
|------|------|
| **1. That the handler is written in Go and queries a sharded PostgreSQL cluster through an internal ORM.** | |
| 2. That the tool returns order status and line items, but it does not return any payment details. | |
| 3. That it should be used only when the user supplies an order number in the ORD-123456 format. | |
| 4. That setting `include_history` adds past status changes and makes each response noticeably longer. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

개발자가 `lookup_order` 도구의 설명을 쓰고 있습니다. 다음 중 설명에 넣기에 가장 쓸모없는 내용은 무엇일까요?

- **①** 핸들러가 Go로 작성되었고 내부 ORM을 통해 샤딩된 PostgreSQL 클러스터를 조회한다는 것
- **②** 도구가 주문 상태와 품목을 돌려주지만 결제 정보는 전혀 돌려주지 않는다는 것
- **③** 사용자가 ORD-123456 형식의 주문 번호를 줄 때에만 써야 한다는 것
- **④** `include_history`를 켜면 과거 상태 변경이 추가되고 응답이 눈에 띄게 길어진다는 것

> **핵심 진단:** Claude는 구현을 받지 않습니다. 모델이 보는 것은 **여러분이 준 스키마(이름·설명·입력 스키마)와 돌려준 결과뿐** 입니다. 문서가 설명에 담으라고 하는 것은 도구가 무엇을 하는지, 언제 쓰고 언제 쓰지 않는지, 매개변수마다 무슨 뜻이고 동작에 어떤 영향을 주는지, 주의점과 한계(돌려주지 않는 정보 포함)입니다. 구현 언어나 저장소 구조는 도구 선택에도 인자 채우기에도 도움이 되지 않고 토큰만 씁니다.

1. **정답** - 구현 언어와 내부 저장 구조는 Claude의 판단과 무관한 정보입니다. 설명에서 빼야 할 대상입니다.
2. **오답** - 반환하는 것과 반환하지 *않는* 정보를 밝히는 것은 문서가 권하는 '주의점과 한계'에 해당합니다.
3. **오답** - 언제 써야 하는지와 입력 형식을 알려 주므로 도구 선택과 인자 채우기에 직접 도움이 됩니다.
4. **오답** - 매개변수의 의미와 그것이 동작에 주는 영향은 설명의 핵심 요소입니다.

> 💡 **시험 포인트:** 도구 설명은 '모델이 도구를 언제·어떻게 쓸지'를 위한 글입니다. 구현 세부는 넣지 않습니다.

> 📚 근거 문서: [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

---

## 문제 7
### **A `get_exchange_rate` tool calls a currency provider that responds with HTTP 503 during scheduled maintenance. How should the application report this failure back to Claude?**

| 보기 | 설명 |
|------|------|
| 1. Abort the agent loop and surface the raw HTTP 503 to the end user, since Claude has no way to use a failed call. | |
| 2. Skip the `tool_result` for that call and add a plain user text message explaining that the provider is down. | |
| 3. Return a `tool_result` with the matching `tool_use_id` and the single word "failed", leaving `is_error` unset so Claude retries. | |
| **4. Return a `tool_result` with the matching `tool_use_id`, `is_error: true`, and a message on the outage and when to retry.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

`get_exchange_rate` 도구는 정기 점검 중에 HTTP 503을 돌려주는 환율 제공 업체를 호출합니다. 애플리케이션은 이 실패를 Claude에게 어떻게 알려야 할까요?

- **①** Claude는 실패한 호출을 활용할 방법이 없으므로 에이전트 루프를 중단하고 원시 HTTP 503을 최종 사용자에게 보여 준다
- **②** 해당 호출의 `tool_result`를 생략하고, 제공 업체가 다운되었다고 설명하는 일반 사용자 텍스트 메시지를 추가한다
- **③** 일치하는 `tool_use_id`와 "failed" 한 단어를 담은 `tool_result`를 보내고, Claude가 재시도하도록 `is_error`는 설정하지 않는다
- **④** 일치하는 `tool_use_id`, `is_error: true`, 그리고 장애 내용과 언제 재시도할지 알리는 메시지를 담은 `tool_result`를 보낸다

> **핵심 진단:** 도구 실행 중 오류(예: 상위 서비스 장애)가 나면 **오류 메시지를 `content`에 담고 `"is_error": true`를 붙인 `tool_result`** 를 돌려줍니다. Claude는 이 오류를 응답에 반영해 사용자에게 상황을 설명하거나 다른 방법을 찾습니다. 문서는 "failed" 같은 일반적인 오류 대신 **무엇이 잘못됐고 다음에 무엇을 시도해야 하는지** 를 담으라고 권합니다(예: "Rate limit exceeded. Retry after 60 seconds.").

```json
{"type": "tool_result", "tool_use_id": "toolu_01…",
 "content": "Rate provider returned HTTP 503 (maintenance until 02:00 UTC). Retry after 02:00 UTC or tell the user the rate is unavailable.",
 "is_error": true}
```

1. **오답** - 실패를 결과로 돌려주면 Claude가 사용자에게 설명하거나 대안을 찾을 수 있습니다. 루프를 끊고 원시 오류를 노출하는 것은 회복 기회를 버리는 처리입니다.
2. **오답** - `tool_use` 블록마다 짝이 되는 `tool_result`가 다음 메시지에 있어야 합니다. 결과를 빼면 "tool_use ids were found without tool_result blocks" 오류가 납니다.
3. **오답** - 짝은 맞지만, 실패 표시가 없고 메시지도 회복에 쓸 정보가 없습니다. Claude가 이것을 정상 데이터로 오해할 수 있습니다.
4. **정답** - 짝이 되는 ID, 실패 표시, 회복에 쓸 수 있는 설명이라는 세 요소를 모두 갖춘 처리입니다.

> 💡 **시험 포인트:** 클라이언트 도구 실패 = 같은 `tool_use_id` + `is_error: true` + 지시적인 메시지. 결과 생략이나 루프 중단은 오답입니다.

> 📚 근거 문서: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

---

## 문제 8
### **A CRM agent shows four problems: (a) separate `create_contact`, `update_contact`, and `archive_contact` tools are often mixed up; (b) a `search` tool from the CRM and a `search` tool from the email service are confused; (c) contact lookups return 80 raw database columns with internal row pointers; (d) the app uses a regex to pull the agent's "escalate: yes" decision out of its prose. Which set of fixes matches (a) through (d)?**

| 보기 | 설명 |
|------|------|
| 1. (a) prefix names with the service, (b) merge into one tool with an action parameter, (c) make the decision a tool call, (d) return only high-signal fields | |
| **2. (a) merge into one tool with an action parameter, (b) prefix names with the service, (c) return only high-signal fields and stable IDs, (d) make the decision a tool call** | |
| 3. (a) merge into one tool with an action parameter, (b) prefix names with the service, (c) make the decision a tool call, (d) return only high-signal fields and stable IDs | |
| 4. (a) return only high-signal fields and stable IDs, (b) merge into one tool with an action parameter, (c) prefix names with the service, (d) make the decision a tool call | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

CRM 에이전트에 네 가지 문제가 있습니다. (a) 따로 있는 `create_contact`, `update_contact`, `archive_contact` 도구가 자주 뒤섞이고, (b) CRM의 `search` 도구와 이메일 서비스의 `search` 도구가 혼동되며, (c) 연락처 조회가 내부 행 포인터가 섞인 원시 DB 열 80개를 돌려주고, (d) 앱이 정규식으로 에이전트 산문에서 "escalate: yes" 판단을 뽑아냅니다. (a)~(d)에 맞는 처방 묶음은 무엇일까요?

- **①** (a) 이름에 서비스 접두사, (b) action 매개변수를 가진 도구 하나로 통합, (c) 판단을 도구 호출로, (d) 고신호 필드만 반환
- **②** (a) action 매개변수를 가진 도구 하나로 통합, (b) 이름에 서비스 접두사, (c) 고신호 필드와 안정적인 ID만 반환, (d) 판단을 도구 호출로
- **③** (a) action 매개변수를 가진 도구 하나로 통합, (b) 이름에 서비스 접두사, (c) 판단을 도구 호출로, (d) 고신호 필드와 안정적인 ID만 반환
- **④** (a) 고신호 필드와 안정적인 ID만 반환, (b) action 매개변수를 가진 도구 하나로 통합, (c) 이름에 서비스 접두사, (d) 판단을 도구 호출로

> **핵심 진단:** 공식 문서와 "Writing tools for agents"가 권하는 도구 세트 설계 원칙은 증상별로 짝이 정해져 있습니다.

| 증상 | 원칙 |
|---|---|
| 동작별 도구가 많아 헷갈림 | **관련 동작을 `action` 매개변수를 가진 도구 하나로 통합** |
| 여러 서비스에 같은 이름의 도구 | **서비스 접두사로 네임스페이스** (`crm_search`, `email_search`) |
| 응답이 원시 열·내부 참조로 부풂 | **다음 단계에 필요한 고신호 필드와 의미 있고 안정적인 식별자만 반환** |
| 산문에서 판단을 정규식으로 추출 | **그 판단을 도구 호출로** (구조는 스키마에 있어야 한다) |

1. **오답** - (a)와 (b)가 뒤바뀌었고 (c)와 (d)도 뒤바뀌었습니다. 이름 충돌은 접두사, 동작별 도구 난립은 통합으로 해결합니다.
2. **정답** - 네 증상이 각각 통합·네임스페이스·고신호 응답·도구 호출 전환과 정확히 짝지어졌습니다.
3. **오답** - (a)·(b)는 맞지만 (c)와 (d)가 바뀌었습니다. 부푼 응답은 반환 필드를 줄여야 하고, 정규식 파싱은 도구 호출로 바꿔야 합니다.
4. **오답** - 네 짝이 한 칸씩 밀렸습니다. 응답 정리는 (c)의 처방이지 (a)의 처방이 아닙니다.

> 💡 **시험 포인트:** "정규식으로 모델 출력에서 결정을 뽑는다"는 문서가 직접 꼽는 신호입니다. 그 결정은 처음부터 도구 호출이었어야 합니다.

> 📚 근거 문서: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) · [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

---

## 문제 9
### **A team migrates a data-extraction service from Claude Haiku 5.5 to Claude Opus 5.5 and keeps `tool_choice: {"type": "tool", "name": "save_fields"}` in every request. What happens, and what should they change?**

| 보기 | 설명 |
|------|------|
| 1. The request succeeds, but Claude now writes a text explanation before the forced call, so the parser must skip it. | |
| 2. The request succeeds, because forced tool use is restricted only when manual extended thinking is enabled. | |
| **3. The API returns a 400 error; switch to `auto` with `strict: true` on the tool, or use structured outputs for a fixed JSON reply.** | |
| 4. The API silently downgrades the setting to `{"type": "any"}`, so Claude might call a different tool than `save_fields`. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

한 팀이 데이터 추출 서비스를 Claude Haiku 5.5에서 Claude Opus 5.5로 옮기면서, 모든 요청에 `tool_choice: {"type": "tool", "name": "save_fields"}`를 그대로 둡니다. 어떤 일이 생기고, 무엇을 바꿔야 할까요?

- **①** 요청은 성공하지만 이제 Claude가 강제 호출 앞에 텍스트 설명을 쓰므로, 파서가 그것을 건너뛰어야 한다
- **②** 강제 호출은 수동 extended thinking을 켰을 때만 제한되므로 요청은 성공한다
- **③** API가 400 오류를 돌려준다. 도구에 `strict: true`를 두고 `auto`로 바꾸거나, 고정된 JSON 응답이 필요하면 structured outputs를 쓴다
- **④** API가 설정을 조용히 `{"type": "any"}`로 낮추므로, Claude가 `save_fields`가 아닌 다른 도구를 부를 수 있다

> **핵심 진단:** 공식 문서의 제한 표에 따르면 **Claude Opus 5.5·Sonnet 5.5·Fable 5.1·Mythos 5.1에서 `tool_choice`의 `any`와 `tool`은 400 오류** 를 냅니다(사고 설정과 무관). 문서가 제시하는 대안은 **`auto`와 strict tool use** 입니다. strict가 도구 입력이 스키마를 따르도록 보장하고, 어느 도구를 고를지는 프롬프트 지시로 이끕니다. 응답 자체를 고정된 JSON 모양으로 받아야 하면 structured outputs를 씁니다. `auto`와 `none`은 이 모델들에서도 동작합니다.

1. **오답** - 요청이 성공한다는 전제부터 틀렸습니다. 또 강제 호출이 받아들여지는 모델에서는 오히려 API가 어시스턴트 메시지를 미리 채워 도구 호출 앞에 텍스트가 나오지 않습니다.
2. **오답** - 수동 extended thinking도 강제 호출을 막는 조건이지만 유일한 조건은 아닙니다. 이 모델들은 사고 설정과 관계없이 거부합니다.
3. **정답** - 400 오류라는 결과와 문서가 권하는 대안(`auto` + `strict`, 또는 structured outputs)을 모두 맞게 설명합니다.
4. **오답** - API는 설정을 조용히 바꾸지 않고 오류로 거부합니다. `any`도 같은 이유로 이 모델들에서 400입니다.

> 💡 **시험 포인트:** 모델을 Opus 5.5 계열로 올릴 때 강제 `tool_choice`는 마이그레이션 점검 항목입니다. 대안은 `auto` + `strict` + 프롬프트입니다.

> 📚 근거 문서: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

---

## 문제 10
### **Which sequence correctly describes the agentic loop for client tools in an application built directly on the Messages API?**

| 보기 | 설명 |
|------|------|
| **1. Send `tools` and the user message → get `stop_reason: "tool_use"` with `tool_use` blocks → run each tool and build `tool_result` blocks → resend the history, the assistant turn, then the results → repeat while `stop_reason` is `tool_use`** | |
| 2. Send `tools` and the user message → run every defined tool in advance → attach all outputs as `tool_result` blocks in the first request → let Claude pick the relevant result → repeat until `stop_reason` is `end_turn` | |
| 3. Send `tools` and the user message → get `tool_use` blocks → run each tool → resend only the `tool_result` blocks, dropping the assistant turn to save tokens → repeat while `stop_reason` is `tool_use` | |
| 4. Send `tools` and the user message → get `tool_use` blocks → run each tool → resend the history, then the results, then the assistant turn after them → repeat while `stop_reason` is `pause_turn` | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

Messages API 위에 직접 만든 애플리케이션에서 클라이언트 도구용 에이전트 루프를 올바르게 설명한 순서는 무엇일까요?

- **①** `tools`와 사용자 메시지를 보낸다 → `tool_use` 블록과 함께 `stop_reason: "tool_use"`를 받는다 → 도구마다 실행하고 `tool_result` 블록을 만든다 → 이전 기록, 어시스턴트 턴, 결과 순으로 다시 보낸다 → `stop_reason`이 `tool_use`인 동안 반복한다
- **②** `tools`와 사용자 메시지를 보낸다 → 정의된 모든 도구를 미리 실행한다 → 첫 요청에 모든 출력을 `tool_result` 블록으로 붙인다 → Claude가 관련 결과를 고르게 한다 → `stop_reason`이 `end_turn`이 될 때까지 반복한다
- **③** `tools`와 사용자 메시지를 보낸다 → `tool_use` 블록을 받는다 → 도구마다 실행한다 → 토큰을 아끼려고 어시스턴트 턴을 빼고 `tool_result` 블록만 다시 보낸다 → `stop_reason`이 `tool_use`인 동안 반복한다
- **④** `tools`와 사용자 메시지를 보낸다 → `tool_use` 블록을 받는다 → 도구마다 실행한다 → 이전 기록, 결과, 그 뒤에 어시스턴트 턴 순으로 다시 보낸다 → `stop_reason`이 `pause_turn`인 동안 반복한다

> **핵심 진단:** 클라이언트 도구는 모델이 실행할 수 없으므로 앱이 루프를 돌립니다. 문서의 표준 형태는 `stop_reason`을 키로 한 `while` 루프입니다. ① `tools`와 사용자 메시지로 요청 → ② `stop_reason: "tool_use"`와 `tool_use` 블록 수신 → ③ 도구 실행 후 `tool_result`로 정리 → ④ **원래 메시지 + 어시스턴트 응답 + 결과를 담은 사용자 메시지** 로 새 요청 → ⑤ `stop_reason`이 `tool_use`인 동안 반복. 다른 stop reason(`end_turn`, `max_tokens`, `stop_sequence`, `refusal`)이 오면 루프를 빠져나옵니다.

1. **정답** - 다섯 단계와 메시지 순서(어시스턴트 응답 다음에 결과), 반복 조건이 모두 문서와 일치합니다.
2. **오답** - 도구는 Claude가 `tool_use`로 요청한 것만 실행합니다. 모든 도구를 미리 실행하는 것은 루프가 아니며 비용과 부작용만 늘립니다.
3. **오답** - 결과 메시지는 그 결과를 요청한 어시스턴트 메시지 바로 다음에 와야 합니다. 어시스턴트 응답을 빼면 `tool_use`와 `tool_result`의 짝이 성립하지 않습니다.
4. **오답** - 순서가 거꾸로이고 반복 조건도 틀렸습니다. `pause_turn`은 서버 도구 루프가 멈췄다는 신호이지 클라이언트 도구 루프의 반복 조건이 아닙니다.

> 💡 **시험 포인트:** "어시스턴트 턴 다음에 결과", "`tool_use`인 동안 반복"이 순서 문항의 두 기준입니다.

> 📚 근거 문서: [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

---

## 문제 11
### **Claude's response contains two `tool_use` blocks with `id` values `toolu_A1` (for `get_balance`) and `toolu_B2` (for `get_limits`). The app runs both in parallel and the `get_limits` result arrives first. How is each result matched to its call?**

| 보기 | 설명 |
|------|------|
| 1. By position: the results must be listed in the same order as the `tool_use` blocks appeared. | |
| 2. By the `name` field, which each `tool_result` block must repeat from the call it answers. | |
| 3. By a `call_index` field that the app sets to 0 or 1 on each result, following the call order. | |
| **4. By each `tool_result` block's `tool_use_id`, which must equal the `id` of its `tool_use` block.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

Claude의 응답에 `id`가 `toolu_A1`(`get_balance`)과 `toolu_B2`(`get_limits`)인 `tool_use` 블록 두 개가 있습니다. 앱이 둘을 병렬로 실행했고 `get_limits` 결과가 먼저 도착했습니다. 각 결과는 어떻게 자기 호출과 짝지어질까요?

- **①** 위치로: 결과는 `tool_use` 블록이 나온 순서와 같은 순서로 나열해야 한다
- **②** `name` 필드로: 각 `tool_result` 블록이 답하는 호출의 이름을 반복해 적어야 한다
- **③** 앱이 호출 순서에 따라 각 결과에 0이나 1로 설정하는 `call_index` 필드로
- **④** 각 `tool_result` 블록의 `tool_use_id`로: 이 값은 해당 `tool_use` 블록의 `id`와 같아야 한다

> **핵심 진단:** `tool_use` 블록의 `id`는 "나중에 도구 결과를 짝짓는 데 쓰는" 고유 식별자입니다. 결과를 보낼 때 `tool_result`의 **`tool_use_id`에 그 결과가 답하는 `tool_use`의 `id`를 넣습니다**. 짝은 이 ID로 맞춰지므로 병렬 호출의 결과가 어떤 순서로 도착하든 그대로 담아 보내면 됩니다. 문서는 서버 도구 결과도 위치가 아니라 `tool_use_id`로 짝이 맞는다고 설명합니다.

1. **오답** - 짝짓기는 위치 기반이 아닙니다. 지켜야 할 순서 규칙은 결과 메시지가 호출 메시지 바로 다음에 오고, 그 안에서 `tool_result` 블록이 텍스트보다 앞에 온다는 것입니다.
2. **오답** - 일반 `tool_result` 블록은 도구 이름을 담지 않습니다. 같은 도구를 두 번 부르면 이름으로는 구분할 수도 없습니다.
3. **오답** - `call_index` 같은 필드는 없습니다. 식별은 API가 발급한 `id`로 합니다.
4. **정답** - `tool_use_id`와 `id`의 일치가 API가 결과와 호출을 짝짓는 방법입니다.

> 💡 **시험 포인트:** 결과의 짝 = `tool_result.tool_use_id` == `tool_use.id`. 병렬 호출에서도 순서는 짝짓기 기준이 아닙니다.

> 📚 근거 문서: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [Server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools)

---

## 문제 12
### **A file-conversion tool crashes on a corrupted upload. The app sends `{"type": "tool_result", "tool_use_id": "toolu_77", "content": "Conversion failed: the PDF header is damaged. Ask the user to re-export the file.", ___: true}`. Which field name fills the blank so that Claude treats the result as a failure?**

| 보기 | 설명 |
|------|------|
| 1. `"error"` | |
| **2. `"is_error"`** | |
| 3. `"isError"` | |
| 4. `"failed"` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

파일 변환 도구가 손상된 업로드 파일에서 실패했습니다. 앱은 `{"type": "tool_result", "tool_use_id": "toolu_77", "content": "Conversion failed: the PDF header is damaged. Ask the user to re-export the file.", ___: true}`를 보냅니다. Claude가 이 결과를 실패로 다루게 하려면 빈칸에 어떤 필드 이름이 들어가야 할까요?

- **①** `"error"`
- **②** `"is_error"`
- **③** `"isError"`
- **④** `"failed"`

> **핵심 진단:** Messages API의 `tool_result` 블록에서 실행 실패를 표시하는 선택 필드는 **`is_error`** 입니다. 도구 실행이 오류로 끝났으면 `true`로 설정하고, 오류 내용은 `content`에 씁니다. 이 문항의 메시지처럼 무엇이 잘못됐고 무엇을 하면 되는지까지 적으면 Claude가 사용자에게 다음 행동을 안내할 수 있습니다.

1. **오답** - `tool_result`에 `error`라는 필드는 없습니다. 오류 설명은 `content`에 들어갑니다.
2. **정답** - Messages API가 정의한 실패 표시 필드입니다.
3. **오답** - `isError`는 MCP 명세의 도구 결과(`CallToolResult`)와 Agent SDK TypeScript 핸들러 반환값에서 쓰는 이름입니다. Messages API의 `tool_result` 블록은 스네이크 케이스 `is_error`를 씁니다.
4. **오답** - `failed`라는 필드는 정의되어 있지 않습니다.

> 💡 **시험 포인트:** Messages API `tool_result`는 `is_error`, MCP 도구 결과는 `isError`. 이름이 비슷해 빈칸 문항의 단골 함정입니다.

> 📚 근거 문서: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [MCP Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

---

## 문제 13
### **Claude has the `web_fetch` server tool and a client tool named `read_local_config`. In one turn it decides to fetch a vendor's changelog URL and read a local config file in parallel. Predict the response the application receives.**

| 보기 | 설명 |
|------|------|
| **1. `stop_reason` is `tool_use`; the content holds a `server_tool_use` block with no result yet and a `tool_use` block for `read_local_config`.** | |
| 2. `stop_reason` is `pause_turn`; the content holds the `server_tool_use` block, and the client call is postponed to a later turn. | |
| 3. `stop_reason` is `tool_use`; the content already includes the `web_fetch_tool_result`, followed by the `tool_use` block. | |
| 4. `stop_reason` is `end_turn`; the API ran both tools, because a client tool in the same group also runs server-side. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

Claude에게 `web_fetch` 서버 도구와 `read_local_config`라는 클라이언트 도구가 있습니다. 한 턴에서 Claude가 공급업체의 변경 로그 URL을 가져오는 일과 로컬 설정 파일을 읽는 일을 병렬로 하기로 합니다. 애플리케이션이 받을 응답을 예측해 보세요.

- **①** `stop_reason`은 `tool_use`이고, 내용에는 아직 결과가 없는 `server_tool_use` 블록과 `read_local_config`의 `tool_use` 블록이 있다
- **②** `stop_reason`은 `pause_turn`이고, 내용에는 `server_tool_use` 블록이 있으며 클라이언트 호출은 다음 턴으로 미뤄진다
- **③** `stop_reason`은 `tool_use`이고, 내용에는 이미 `web_fetch_tool_result`가 들어 있고 그 뒤에 `tool_use` 블록이 온다
- **④** `stop_reason`은 `end_turn`이다. 같은 묶음의 클라이언트 도구도 서버에서 실행되므로 API가 두 도구를 모두 실행했다

> **핵심 진단:** 서버 도구와 클라이언트 도구가 같은 병렬 호출 묶음에 있으면 API는 **서버 도구를 실행하지 않고 즉시 돌아와** 클라이언트 도구를 먼저 실행하게 합니다. 문서가 정리한 응답 모양은 세 가지입니다. `stop_reason`은 `pause_turn`이 아니라 **`tool_use`**, `content`에는 **결과 블록 없는 `server_tool_use`와 클라이언트 `tool_use`**, 그리고 그 밖의 표시는 없음. 앱은 `id`에 짝이 되는 결과 블록이 없는 `server_tool_use`를 찾아 이 상태를 감지합니다.

1. **정답** - 문서가 설명하는 혼합 턴의 응답 모양 그대로입니다.
2. **오답** - `pause_turn`은 클라이언트 `tool_use`를 기다리게 두지 않습니다. 클라이언트 도구를 부르려고 멈춘 응답의 `stop_reason`은 항상 `tool_use`입니다.
3. **오답** - 이 경우 API는 서버 도구를 아직 실행하지 않았습니다. 결과 블록은 클라이언트 결과를 보낸 다음 응답의 첫 블록으로 옵니다.
4. **오답** - 클라이언트 도구는 언제나 앱이 실행합니다. API가 대신 실행하는 일은 없습니다.

> 💡 **시험 포인트:** "서버 도구가 대기 중이면 항상 `pause_turn`"은 대표적인 오해입니다. 클라이언트 도구가 함께 불리면 `tool_use`입니다.

> 📚 근거 문서: [Server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools) · [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

---

## 문제 14
### **A harness must continue correctly after three response states: (a) `stop_reason: "pause_turn"`; (b) `stop_reason: "tool_use"` with a client `tool_use` block and a `server_tool_use` block that has no result; (c) a `server_tool_use` block whose result block is already in the same response. Which actions match (a), (b), and (c)?**

| 보기 | 설명 |
|------|------|
| 1. (a) send only the client tool_results with the same tools, (b) re-send the paused content as-is, (c) send a tool_result for the server call | |
| 2. (a) re-send the paused content as-is with the same tools, (b) send tool_results for both the client and the server calls, (c) nothing to do | |
| **3. (a) re-send the paused content as-is with the same tools, (b) send only the client tool_results with the same tools, (c) nothing to do** | |
| 4. (a) re-send the paused content as-is without the server tools, (b) send only the client tool_results, (c) re-run the server call | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

하네스는 세 가지 응답 상태 다음에 올바르게 이어 가야 합니다. (a) `stop_reason: "pause_turn"`, (b) `stop_reason: "tool_use"`이면서 클라이언트 `tool_use` 블록과 결과가 없는 `server_tool_use` 블록이 있음, (c) 결과 블록이 같은 응답 안에 이미 있는 `server_tool_use` 블록. (a), (b), (c)에 맞는 조치는 무엇일까요?

- **①** (a) 같은 도구로 클라이언트 tool_result만 보낸다, (b) 멈춘 내용을 그대로 다시 보낸다, (c) 서버 호출에 대한 tool_result를 보낸다
- **②** (a) 같은 도구로 멈춘 내용을 그대로 다시 보낸다, (b) 클라이언트와 서버 호출 모두에 tool_result를 보낸다, (c) 할 일 없음
- **③** (a) 같은 도구로 멈춘 내용을 그대로 다시 보낸다, (b) 같은 도구로 클라이언트 tool_result만 보낸다, (c) 할 일 없음
- **④** (a) 서버 도구를 빼고 멈춘 내용을 그대로 다시 보낸다, (b) 클라이언트 tool_result만 보낸다, (c) 서버 호출을 다시 실행한다

> **핵심 진단:** 세 상태의 처리는 문서에 명확히 나뉘어 있습니다.

| 상태 | 조치 |
|---|---|
| (a) `pause_turn` | 멈춘 응답을 **그대로** 다시 보내 Claude가 턴을 이어 가게 한다. **같은 도구** 를 포함한다(대기 중인 서버 도구가 없으면 검증 오류). 다시 멈출 수 있으니 횟수 상한을 둔다 |
| (b) 혼합 턴 | 클라이언트 도구를 실행하고 **`tool_result` 블록만** 담은 사용자 메시지를 **같은 `tools`** 로 보낸다 |
| (c) 완료된 서버 호출 | 이미 끝났으므로 **할 일 없음** |

1. **오답** - (a)와 (b)의 처리가 서로 바뀌었고, (c)에서 서버 호출에 결과를 만들어 보내는 것도 틀렸습니다.
2. **오답** - (b)에서 서버 호출의 결과는 API가 다음 요청 때 직접 실행해 만듭니다. 앱은 클라이언트 결과만 보냅니다.
3. **정답** - 세 상태 모두 문서의 처리 방법과 일치합니다.
4. **오답** - 멈춘 턴은 아직 실행되지 않은 `server_tool_use`로 끝날 수 있어 도구를 빼면 오류가 납니다. 완료된 서버 호출을 다시 실행할 이유도 없습니다.

> 💡 **시험 포인트:** `pause_turn` = 그대로 재전송, 혼합 턴 = 클라이언트 결과만, 완료된 서버 호출 = 아무것도 안 함. 두 경우 모두 `tools`는 그대로 둡니다.

> 📚 근거 문서: [Server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools)

---

## 문제 15
### **An Agent SDK coding agent starts in `default` mode, and the app may switch it to `acceptEdits` or `bypassPermissions` mid-session with `set_permission_mode()`. Any `git push --force` command must be refused in every mode, while other Bash commands stay available. What should the team configure?**

| 보기 | 설명 |
|------|------|
| 1. List only safe commands such as `Bash(git status)` in `allowed_tools`, since anything not listed is blocked. | |
| 2. Add `Bash` to `disallowed_tools`, then re-enable the safe commands through entries in `allowed_tools`. | |
| 3. Check for `git push --force` inside the `canUseTool` callback and return a deny decision there. | |
| **4. Add the scoped rule `Bash(git push --force *)` to `disallowed_tools`.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

Agent SDK 코딩 에이전트가 `default` 모드로 시작하고, 앱이 세션 중에 `set_permission_mode()`로 `acceptEdits`나 `bypassPermissions`로 바꿀 수 있습니다. `git push --force` 명령은 어느 모드에서든 거부되어야 하고, 다른 Bash 명령은 계속 쓸 수 있어야 합니다. 팀은 무엇을 설정해야 할까요?

- **①** 목록에 없는 것은 막히므로, `allowed_tools`에 `Bash(git status)` 같은 안전한 명령만 나열한다
- **②** `disallowed_tools`에 `Bash`를 넣은 다음, `allowed_tools` 항목으로 안전한 명령을 다시 허용한다
- **③** `canUseTool` 콜백 안에서 `git push --force`를 검사해 거기서 거부 결정을 돌려준다
- **④** `disallowed_tools`에 범위 규칙 `Bash(git push --force *)`를 추가한다

> **핵심 진단:** Agent SDK는 호출마다 **훅 → 거부 규칙 → ask 규칙 → 권한 모드 → 허용 규칙 → `canUseTool`** 순서로 확인합니다. `disallowed_tools`의 거부 규칙은 **권한 모드보다 먼저** 평가되므로, 일치하는 호출은 `bypassPermissions`를 포함한 모든 모드에서 거부됩니다. 도구 이름 대신 `Bash(패턴)` 같은 **범위 규칙** 을 쓰면 `Bash` 도구 자체는 남고 적힌 패턴과 일치하는 호출만 막힙니다. 세션 중 모드가 바뀌어도 이 규칙은 그대로 적용됩니다.

1. **오답** - `allowed_tools`는 자동 승인 목록입니다. 목록에 없는 명령은 막히지 않고 권한 모드로 넘어가며, `bypassPermissions`에서는 그대로 승인됩니다.
2. **오답** - 이름만 쓴 `Bash` 거부는 도구 정의를 요청에서 제거하므로 다른 Bash 명령도 쓸 수 없게 됩니다. 거부가 허용보다 먼저 평가되어 다시 살릴 수도 없습니다.
3. **오답** - `canUseTool`은 앞 단계에서 결론이 나지 않은 호출만 받습니다. `acceptEdits`나 `bypassPermissions`가 승인한 호출은 콜백에 도달하지 않아 검사가 조용히 우회됩니다.
4. **정답** - 범위 거부 규칙은 모드 확인 전에 평가되어 어느 모드에서든 일치하는 호출을 막고, 나머지 Bash 명령은 그대로 둡니다.

> 💡 **시험 포인트:** "모드와 관계없이 특정 패턴만 막기" = `disallowed_tools`의 범위 규칙. 콜백에만 둔 검사는 자동 승인된 호출에서 돌지 않습니다.

> 📎 참고: 범위 규칙은 명령이 '적힌 그대로' 패턴과 일치할 때만 막습니다(예: `Bash(rm *)`는 `/bin/rm`을 막지 않는다). 모든 변형을 막아야 하면 `PreToolUse` 훅으로 보강하는 것이 문서의 권고입니다.

> 📚 근거 문서: [Configure permissions (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/permissions)

---

## 문제 16
### **An Agent SDK research agent is configured with `disallowed_tools=["WebFetch"]`. What is the effect?**

| 보기 | 설명 |
|------|------|
| 1. Claude still sees `WebFetch`, but every attempt is denied and the denial is reported back in the transcript. | |
| **2. The `WebFetch` definition is removed from the request, so Claude never sees the tool and cannot attempt it.** | |
| 3. `WebFetch` calls fall through to the `canUseTool` callback, which decides whether each individual call may run. | |
| 4. `WebFetch` is denied only in `default` mode, and in `bypassPermissions` mode its calls are still approved. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.1 Tool Implementation

**📝 문제 번역**

Agent SDK 리서치 에이전트가 `disallowed_tools=["WebFetch"]`로 설정되어 있습니다. 어떤 효과가 있을까요?

- **①** Claude는 여전히 `WebFetch`를 보지만, 시도할 때마다 거부되고 그 거부가 대화 기록에 보고된다
- **②** `WebFetch` 정의가 요청에서 제거되어, Claude는 이 도구를 보지 못하고 시도할 수도 없다
- **③** `WebFetch` 호출은 `canUseTool` 콜백으로 넘어가고, 콜백이 호출마다 실행 여부를 정한다
- **④** `WebFetch`는 `default` 모드에서만 거부되고, `bypassPermissions` 모드에서는 호출이 여전히 승인된다

> **핵심 진단:** `disallowed_tools`의 거부 규칙은 **도구 이름을 쓰느냐, 범위 패턴을 쓰느냐** 에 따라 다르게 동작합니다. 이름만 쓴 항목(`"WebFetch"`)은 **도구 정의를 요청에서 제거** 합니다. Claude는 그 도구를 보지 못하므로 시도조차 하지 않고, 턴을 낭비하지도 않습니다. 반면 `"Bash(rm *)"` 같은 범위 규칙은 도구를 컨텍스트에 남겨 두고 일치하는 호출만 거부합니다.

1. **오답** - 이것은 범위 규칙의 동작입니다. 이름만 쓴 거부는 도구를 아예 보이지 않게 합니다.
2. **정답** - 문서의 표 그대로, 이름 거부는 도구 정의 제거이며 Claude는 그 도구를 시도할 수 없습니다.
3. **오답** - 콜백으로 넘어가는 것은 어느 규칙에도 걸리지 않은 호출입니다. 거부 규칙에 걸리면 `canUseTool`은 호출되지 않습니다.
4. **오답** - 거부 규칙은 권한 모드보다 먼저 평가되어 `bypassPermissions`에서도 적용됩니다. 여기서는 도구가 아예 없으니 모드와 무관합니다.

> 💡 **시험 포인트:** 이름 거부 = 제거(가용성), 범위 거부 = 일치하는 호출만 차단(권한). `allowed_tools`에서 빼는 것은 어느 쪽도 아닙니다.

> 📚 근거 문서: [Configure permissions (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/permissions) · [Give Claude custom tools (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/custom-tools)

---

## 문제 17
### **An IDE embeds MCP support and connects to three servers: a Git server, a ticket tracker, and a docs search service. Which mapping of responsibilities to MCP roles is correct? (a) creates and manages the connections and enforces user consent and security policy; (b) keeps a dedicated connection to exactly one server; (c) exposes tools, resources, and prompts.**

| 보기 | 설명 |
|------|------|
| 1. (a) server, (b) client, (c) host | |
| 2. (a) client, (b) host, (c) server | |
| 3. (a) host, (b) server, (c) client | |
| **4. (a) host, (b) client, (c) server** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

한 IDE가 MCP 지원을 내장하고 Git 서버, 티켓 트래커, 문서 검색 서비스라는 세 서버에 연결합니다. 책임과 MCP 역할을 올바르게 짝지은 것은 무엇일까요? (a) 연결을 만들고 관리하며 사용자 동의와 보안 정책을 집행한다, (b) 정확히 한 서버와의 전용 연결을 유지한다, (c) 도구·리소스·프롬프트를 노출한다.

- **①** (a) 서버, (b) 클라이언트, (c) 호스트
- **②** (a) 클라이언트, (b) 호스트, (c) 서버
- **③** (a) 호스트, (b) 서버, (c) 클라이언트
- **④** (a) 호스트, (b) 클라이언트, (c) 서버

> **핵심 진단:** MCP는 클라이언트-호스트-서버 구조입니다. **호스트** 는 컨테이너이자 조정자로서 여러 클라이언트 인스턴스를 만들고 관리하며, 연결 권한과 수명을 통제하고, **보안 정책과 동의 요구를 집행** 합니다. **클라이언트** 는 호스트가 만들며 **정확히 한 서버와 통신** 합니다(1:1). **서버** 는 MCP 프리미티브로 **리소스·도구·프롬프트를 노출** 합니다. 이 IDE에는 호스트 하나와 클라이언트 세 개가 있는 셈입니다.

1. **오답** - 동의와 보안 정책을 집행하는 것은 서버가 아니라 호스트입니다. 서버는 대화 전체도 보지 못하도록 설계되어 있습니다.
2. **오답** - 클라이언트는 연결 하나를 맡는 커넥터이고, 여러 연결을 관리하는 것은 호스트입니다. 둘이 바뀌었습니다.
3. **오답** - 1:1 연결을 유지하는 것은 클라이언트, 프리미티브를 노출하는 것은 서버입니다. (b)와 (c)가 바뀌었습니다.
4. **정답** - 호스트·클라이언트·서버의 책임이 명세와 정확히 일치합니다.

> 💡 **시험 포인트:** "여러 개를 관리하고 동의를 집행" = 호스트, "딱 하나의 서버" = 클라이언트, "프리미티브 노출" = 서버.

> 📚 근거 문서: [MCP Architecture (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/architecture)

---

## 문제 18
### **A team's MCP server has a working `tools/call` handler, but the `capabilities` object it advertises (for example, in its `server/discover` result) contains only `resources`. What does the specification imply for clients?**

| 보기 | 설명 |
|------|------|
| **1. Clients may call tools only on a server that advertises the `tools` capability, so they cannot rely on its tools until it does.** | |
| 2. Capabilities are informational only, so any client that knows a tool's name can still call it through `tools/call`. | |
| 3. The client should infer the `tools` capability automatically the first time a `tools/list` request returns a result. | |
| 4. Only clients declare capabilities, so a server exposes whatever handlers it implements without declaring anything. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

한 팀의 MCP 서버는 동작하는 `tools/call` 핸들러를 갖고 있지만, 서버가 광고하는 `capabilities` 객체(예: `server/discover` 결과)에는 `resources`만 들어 있습니다. 명세에 따르면 클라이언트 입장에서 어떤 의미일까요?

- **①** 도구 호출은 서버가 `tools` 기능을 선언해야 가능하므로, 서버가 선언하기 전까지 클라이언트는 그 도구를 호출할 수 있다고 기대할 수 없다
- **②** 기능 선언은 참고용일 뿐이므로, 도구 이름을 아는 클라이언트라면 누구든 `tools/call`로 호출할 수 있다
- **③** `tools/list` 요청이 처음 결과를 돌려줄 때 클라이언트가 `tools` 기능을 자동으로 추론해야 한다
- **④** 기능은 클라이언트만 선언하므로, 서버는 아무것도 선언하지 않고 구현한 핸들러를 노출한다

> **핵심 진단:** MCP는 기능 기반 협상을 씁니다. 명세의 아키텍처 문서는 **구현한 서버 기능은 서버의 capabilities에 광고해야 하고**, **도구 호출은 서버가 tools 기능을 선언해야 한다** 고 정합니다. 도구 명세도 도구를 지원하는 서버는 `tools` 기능을 반드시(MUST) 선언하라고 요구합니다. 양쪽 모두 선언된 기능을 존중해야 하므로, 핸들러를 구현한 것만으로는 클라이언트가 그 기능을 쓸 근거가 생기지 않습니다.

1. **정답** - 선언되지 않은 기능은 쓸 수 없다는 기능 협상 규칙을 그대로 적용한 설명입니다.
2. **오답** - 선언은 참고용이 아니라 각 기능을 여는 조건입니다. 명세는 양쪽이 선언된 기능을 존중해야 한다고 요구합니다.
3. **오답** - 기능은 서버가 명시적으로 광고하는 것이지 클라이언트가 응답을 보고 추론하는 것이 아닙니다. 애초에 `tools`를 선언한 서버만 `tools/list`에 응답할 의무가 있습니다.
4. **오답** - 클라이언트와 서버가 모두 기능을 선언합니다. 클라이언트는 sampling·elicitation 같은 기능을, 서버는 도구·리소스·프롬프트 같은 기능을 선언합니다.

> 💡 **시험 포인트:** "핸들러를 구현했으니 선언은 선택"이라는 보기는 오답입니다. 기능은 광고해야 열립니다.

> 📎 참고: CertSafari는 이 개념을 '초기화 때 선언한 기능'으로 설명합니다. 2026-07-28 개정에는 `initialize` 핸드셰이크가 없고, 서버 기능은 `server/discover` 응답으로 광고하며 클라이언트 기능은 요청마다 `_meta`에 싣습니다. 원리(선언되지 않은 기능은 쓸 수 없다)는 같아서 문항은 최신 개정의 용어로 썼습니다.

> 📚 근거 문서: [MCP Architecture (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/architecture) · [Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) · [Discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover)

---

## 문제 19
### **A developer adds a `get_server_time` MCP tool that takes no arguments and sets `"inputSchema": null` in its definition. Predict how the specification treats this, and what to use instead.**

| 보기 | 설명 |
|------|------|
| 1. It is valid, because `null` is the conventional way to declare that a tool accepts no arguments at all. | |
| 2. It is valid only if `outputSchema` is also set, so that clients still have one schema to validate against. | |
| **3. It is invalid; `inputSchema` must be a JSON Schema object, such as `{"type": "object", "additionalProperties": false}`.** | |
| 4. It is invalid, because every tool must declare at least one required property, so a dummy parameter is needed. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

개발자가 인자를 받지 않는 `get_server_time` MCP 도구를 추가하면서 정의에 `"inputSchema": null`을 넣었습니다. 명세가 이것을 어떻게 다루는지, 그리고 대신 무엇을 써야 하는지 예측해 보세요.

- **①** 유효하다. 도구가 인자를 전혀 받지 않음을 선언하는 관례적인 방법이 `null`이기 때문이다
- **②** `outputSchema`도 함께 설정했을 때만 유효하다. 그래야 클라이언트가 검증할 스키마가 하나는 있기 때문이다
- **③** 유효하지 않다. `inputSchema`는 `{"type": "object", "additionalProperties": false}` 같은 JSON Schema 객체여야 한다
- **④** 유효하지 않다. 모든 도구는 필수 속성을 하나 이상 선언해야 하므로 더미 매개변수가 필요하다

> **핵심 진단:** 명세는 `inputSchema`가 **유효한 JSON Schema 객체여야 하며 `null`이면 안 된다(MUST)** 고 정합니다. 매개변수가 없는 도구에는 두 가지 유효한 방법이 있습니다. 빈 객체만 받아들이는 **`{"type": "object", "additionalProperties": false}`(권장)**, 그리고 어떤 객체든 받아들이는 `{"type": "object"}`입니다. `$schema`가 없으면 JSON Schema 2020-12로 해석됩니다.

```json
{"name": "get_server_time",
 "description": "Returns the server's current UTC time",
 "inputSchema": {"type": "object", "additionalProperties": false}}
```

1. **오답** - `null`은 명세가 명시적으로 금지한 값입니다. 생략하는 것도 같은 이유로 맞지 않습니다.
2. **오답** - `outputSchema`는 선택 항목이고 입력 스키마를 대신하지 않습니다. 입력 스키마 규칙은 출력 스키마와 무관하게 적용됩니다.
3. **정답** - 객체 스키마를 써야 한다는 규칙과 권장 형태를 정확히 제시합니다.
4. **오답** - 필수 속성은 요구되지 않습니다. 명세가 매개변수 없는 도구의 유효한 형태를 직접 예시합니다.

> 💡 **시험 포인트:** 인자 없는 도구도 `inputSchema`는 객체입니다. `{"type":"object","additionalProperties":false}`를 기억하세요.

> 📚 근거 문서: [Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

---

## 문제 20
### **A client has discovered a server's tools with `tools/list`, and the model has chosen the `convert_currency` tool. Which JSON-RPC method does the client send to run it?**

| 보기 | 설명 |
|------|------|
| 1. `tools/run` | |
| **2. `tools/call`** | |
| 3. `tools/invoke` | |
| 4. `tools/execute` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

클라이언트가 `tools/list`로 서버의 도구를 찾았고, 모델이 `convert_currency` 도구를 골랐습니다. 이 도구를 실행하려면 클라이언트는 어떤 JSON-RPC 메서드를 보낼까요?

- **①** `tools/run`
- **②** `tools/call`
- **③** `tools/invoke`
- **④** `tools/execute`

> **핵심 진단:** MCP 도구의 메시지 흐름은 두 단계입니다. 발견은 **`tools/list`**, 실행은 **`tools/call`** 입니다. `tools/call` 요청의 `params`에는 도구 `name`과 `arguments`가 들어가고, 응답 `result`에는 `content` 배열과 `isError`가 들어갑니다. Streamable HTTP에서는 같은 이름이 `Mcp-Method` 헤더로, 도구 이름이 `Mcp-Name` 헤더로도 실립니다.

```json
{"jsonrpc": "2.0", "id": 7, "method": "tools/call",
 "params": {"name": "convert_currency",
            "arguments": {"amount": 120, "from": "EUR", "to": "KRW"}}}
```

1. **오답** - `tools/run`은 명세에 없는 메서드입니다.
2. **정답** - 명세가 정의한 도구 실행 메서드입니다.
3. **오답** - '호출(invoke)'은 설명에 쓰이는 말이지 메서드 이름이 아닙니다.
4. **오답** - `tools/execute`도 정의되어 있지 않습니다.

> 💡 **시험 포인트:** 세 프리미티브의 메서드 쌍을 외워 두세요. `tools/list`·`tools/call`, `resources/list`·`resources/read`(+`resources/templates/list`), `prompts/list`·`prompts/get`.

> 📚 근거 문서: [Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

---

## 문제 21
### **A documentation server exposes the resource template `file:///{path}`, mapped to files under `/srv/handbook`. A client then reads `file:///../../etc/passwd`. Which requirement in the MCP resources specification addresses this?**

| 보기 | 설명 |
|------|------|
| 1. Clients must only read URIs that appeared in the most recent `resources/list` response from the server. | |
| 2. Servers must return an empty `contents` array for any URI that points outside the handbook directory. | |
| 3. Servers must switch to an `https://` URI for anything that is not a regular file inside the handbook. | |
| **4. Servers must validate resource URIs and sanitize file paths to prevent directory traversal attacks.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

문서 서버가 `/srv/handbook` 아래 파일에 대응하는 리소스 템플릿 `file:///{path}`를 노출합니다. 그런데 클라이언트가 `file:///../../etc/passwd`를 읽습니다. MCP 리소스 명세의 어떤 요구 사항이 이 상황을 다룰까요?

- **①** 클라이언트는 서버의 가장 최근 `resources/list` 응답에 나온 URI만 읽어야 한다
- **②** 서버는 핸드북 디렉터리 밖을 가리키는 URI에 대해 빈 `contents` 배열을 돌려줘야 한다
- **③** 서버는 핸드북 안의 일반 파일이 아닌 것에 대해 `https://` URI로 바꿔야 한다
- **④** 서버는 리소스 URI를 검증하고, 디렉터리 순회 공격을 막도록 파일 경로를 정제해야 한다

> **핵심 진단:** 리소스 명세의 보안 고려 사항은 서버에 **모든 리소스 URI를 검증하라(MUST)** 고, **`file://` 리소스를 제공할 때 디렉터리 순회 공격을 막도록 파일 경로를 정제하라(MUST)** 고 요구합니다. 민감한 리소스에 접근 제어를 두고 작업 전 권한을 확인하는 것도 권장 사항(SHOULD)입니다. 템플릿이 받는 `{path}`는 외부 입력이므로, `..`를 풀어 기준 디렉터리 밖으로 나가지 않는지 서버가 확인해야 합니다.

1. **오답** - 템플릿은 목록에 없는 URI도 만들 수 있게 하려고 있는 것이고, 명세는 이런 클라이언트 측 제한을 정하지 않습니다. 방어 책임은 서버에 있습니다.
2. **오답** - 명세는 없는 리소스에 빈 `contents`를 돌려주는 것을 금지합니다(MUST NOT). 없는 리소스는 `-32602` 오류로 알립니다.
3. **오답** - `https://`는 클라이언트가 웹에서 직접 가져올 수 있는 자원에만 쓰는 스킴입니다. 보안 대책과는 관계가 없습니다.
4. **정답** - URI 검증과 경로 정제가 명세가 정한 디렉터리 순회 방어입니다.

> 💡 **시험 포인트:** 파일 기반 리소스 + 경로 입력 = 서버의 경로 정제(MUST). 없는 리소스는 빈 배열이 아니라 `-32602`.

> 📚 근거 문서: [Resources (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/resources)

---

## 문제 22
### **A server defines a `draft_release_notes` prompt with a required `version` argument. A client sends `prompts/get` with `name: "draft_release_notes"` and no arguments. Which error should the server return?**

| 보기 | 설명 |
|------|------|
| **1. JSON-RPC error `-32602` (Invalid params)** | |
| 2. JSON-RPC error `-32601` (Method not found) | |
| 3. JSON-RPC error `-32603` (Internal error) | |
| 4. A successful result whose messages contain an empty `version` placeholder | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

서버가 필수 인자 `version`을 가진 `draft_release_notes` 프롬프트를 정의했습니다. 클라이언트가 `name: "draft_release_notes"`에 인자 없이 `prompts/get`을 보냅니다. 서버는 어떤 오류를 돌려줘야 할까요?

- **①** JSON-RPC 오류 `-32602`(Invalid params)
- **②** JSON-RPC 오류 `-32601`(Method not found)
- **③** JSON-RPC 오류 `-32603`(Internal error)
- **④** 메시지에 빈 `version` 자리표시자가 들어간 성공 결과

> **핵심 진단:** 프롬프트 명세의 오류 처리 절은 서버가 흔한 실패에 표준 JSON-RPC 오류를 돌려주라고 합니다. **잘못된 프롬프트 이름과 필수 인자 누락은 모두 `-32602`(Invalid params)**, 내부 오류는 `-32603`(Internal error)입니다. 서버는 처리 전에 프롬프트 인자를 검증해야 합니다(SHOULD).

| 상황 | 코드 |
|---|---|
| 잘못된 프롬프트 이름 | `-32602` |
| 필수 인자 누락 | `-32602` |
| 내부 오류 | `-32603` |

1. **정답** - 필수 인자가 빠진 요청은 매개변수가 잘못된 요청입니다.
2. **오답** - `prompts/get` 메서드 자체는 존재합니다. `-32601`은 서버가 그 메서드를 구현하지 않았을 때의 코드입니다.
3. **오답** - 서버 내부 문제가 아니라 클라이언트 요청의 매개변수 문제입니다.
4. **오답** - 인자를 비운 채 템플릿을 채워 돌려주면 클라이언트가 실패를 알 수 없고, 잘못된 프롬프트가 모델에 들어갑니다.

> 💡 **시험 포인트:** MCP 서버 기능에서 '없는 이름·빠진 인자·없는 리소스'는 대부분 `-32602`입니다.

> 📚 근거 문서: [Prompts (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/prompts)

---

## 문제 23
### **A desktop host launched a local MCP server over stdio and now needs to shut it down cleanly on Linux. Which sequence follows the stdio transport's shutdown guidance?**

| 보기 | 설명 |
|------|------|
| 1. Send `SIGTERM` → wait for the server to exit → close the server's stdin → send `SIGKILL` if it is still running | |
| 2. Send a shutdown request on stdin → wait for its response → close stdout → send `SIGKILL` if it is still running | |
| **3. Close the server's stdin → wait for it to exit → send `SIGTERM` if it overruns → escalate to `SIGKILL` if it still runs** | |
| 4. Send `SIGKILL` immediately → close the server's stdin → restart the server if it was handling requests | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

데스크톱 호스트가 로컬 MCP 서버를 stdio로 실행했고, 이제 Linux에서 깔끔하게 종료하려 합니다. stdio 트랜스포트의 종료 지침을 따르는 순서는 무엇일까요?

- **①** `SIGTERM`을 보낸다 → 서버가 끝나기를 기다린다 → 서버의 stdin을 닫는다 → 여전히 실행 중이면 `SIGKILL`을 보낸다
- **②** stdin으로 종료 요청을 보낸다 → 응답을 기다린다 → stdout을 닫는다 → 여전히 실행 중이면 `SIGKILL`을 보낸다
- **③** 서버의 stdin을 닫는다 → 끝나기를 기다린다 → 시간을 넘기면 `SIGTERM`을 보낸다 → 그래도 실행 중이면 `SIGKILL`로 올린다
- **④** 즉시 `SIGKILL`을 보낸다 → 서버의 stdin을 닫는다 → 요청을 처리하던 중이었다면 서버를 재시작한다

> **핵심 진단:** stdio 명세는 클라이언트가 종료를 시작하는 순서를 이렇게 권합니다(SHOULD). **① 서버로 가는 입력 스트림(stdin)을 닫는다 → ② 서버가 끝나기를 기다린다 → ③ 적당한 시간 안에 끝나지 않으면 OS에 맞는 방법으로 강제 종료한다.** POSIX에서는 강제 종료가 보통 `SIGTERM`에서 `SIGKILL`로 올라가고, Windows에서는 `TerminateProcess`나 Job Objects를 씁니다. 서버는 stdin이 닫히거나 EOF를 읽으면 곧바로 종료해야 하며, 이것이 주된 정상 종료 신호이자 유일하게 이식 가능한 신호입니다.

1. **오답** - 정상 종료 신호(stdin 닫기)보다 강제 종료 신호를 먼저 보냈습니다. 서버가 스스로 정리할 기회를 주지 않습니다.
2. **오답** - stdio 명세의 종료 절차에는 종료 요청 메시지가 없습니다. 또 닫는 것은 서버의 출력(stdout)이 아니라 서버로 가는 입력(stdin)입니다.
3. **정답** - 입력 닫기 → 대기 → `SIGTERM` → `SIGKILL`로 단계적으로 올리는 명세의 순서입니다.
4. **오답** - 처음부터 `SIGKILL`을 쓰면 정상 종료가 불가능합니다. 재시작은 서버가 *예기치 않게* 죽었을 때의 권고입니다.

> 💡 **시험 포인트:** stdio 종료는 '입력을 닫고 기다린다'가 먼저입니다. 신호는 그다음, `SIGTERM` → `SIGKILL` 순입니다.

> 📚 근거 문서: [stdio (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio)

---

## 문제 24
### **Over the Streamable HTTP transport, a client POSTs a body containing a single JSON-RPC notification to the MCP endpoint, and the server accepts it. What must the server return?**

| 보기 | 설명 |
|------|------|
| 1. `200 OK` with an empty JSON-RPC result object in the body | |
| **2. `202 Accepted` and an empty body** | |
| 3. `204 No Content` with an `Mcp-Session-Id` header | |
| 4. `200 OK` with `Content-Type: text/event-stream` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

Streamable HTTP 트랜스포트에서 클라이언트가 JSON-RPC 알림 하나를 담은 본문을 MCP 엔드포인트로 POST했고, 서버가 이를 받아들였습니다. 서버는 무엇을 돌려줘야 할까요?

- **①** 본문에 빈 JSON-RPC 결과 객체를 담은 `200 OK`
- **②** 본문 없는 `202 Accepted`
- **③** `Mcp-Session-Id` 헤더를 붙인 `204 No Content`
- **④** `Content-Type: text/event-stream`을 붙인 `200 OK`

> **핵심 진단:** Streamable HTTP 명세는 POST 본문이 JSON-RPC **알림** 이고 서버가 받아들이면 **HTTP `202 Accepted`를 본문 없이** 돌려줘야 한다(MUST)고 정합니다. 받아들일 수 없으면 `400 Bad Request` 같은 HTTP 오류 상태를 돌려주고, 본문에 `id` 없는 JSON-RPC 오류를 담을 수 있습니다. 본문이 **요청** 이면 `application/json`(단일 객체)이나 `text/event-stream`(그 요청 전용 SSE 스트림)으로 응답합니다.

1. **오답** - 알림에는 응답할 `id`가 없으므로 JSON-RPC 결과를 돌려주지 않습니다. 명세가 정한 상태 코드도 `202`입니다.
2. **정답** - 받아들인 알림에 대한 명세의 응답입니다.
3. **오답** - `2026-07-28` 개정에서 프로토콜 수준 세션이 없어져 서버는 세션 ID를 발급하거나 되돌려 보내지 않습니다. 상태 코드도 `202`여야 합니다.
4. **오답** - SSE 스트림은 JSON-RPC 요청에 대한 응답 방식 중 하나입니다. 알림에는 스트림을 열지 않습니다.

> 💡 **시험 포인트:** 알림 → `202`·본문 없음, 요청 → JSON 또는 SSE. 세션 ID는 현재 개정에 없습니다.

> 📎 참고: 예전 개정(2025-03-26~2025-11-25)은 클라이언트가 JSON-RPC 응답도 POST할 수 있었고, 받아들인 알림·응답 모두에 `202`를 돌려줬습니다. `2026-07-28`에서는 클라이언트가 응답을 POST하지 않으므로 문항은 알림만 다룹니다. 이 개정의 핵심 프로토콜은 Streamable HTTP에서 쓰는 클라이언트 알림을 따로 정의하지 않지만, 알림 POST의 전송 규칙은 위와 같습니다.

> 📚 근거 문서: [Streamable HTTP (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)

---

## 문제 25
### **A TypeScript client creates `new StdioClientTransport({ command: "node", args: ["build/inventory-server.js"] })` and passes it to `client.connect()`. What does this transport do?**

| 보기 | 설명 |
|------|------|
| 1. It opens an HTTP connection to an inventory server that is already running on localhost. | |
| 2. It loads the server module into the client's own process and calls its handlers directly. | |
| 3. It connects to a remote MCP endpoint and receives every response as Server-Sent Events. | |
| **4. It launches the server as a local subprocess and exchanges MCP messages over its stdin and stdout.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

TypeScript 클라이언트가 `new StdioClientTransport({ command: "node", args: ["build/inventory-server.js"] })`를 만들어 `client.connect()`에 넘깁니다. 이 트랜스포트는 무엇을 할까요?

- **①** localhost에서 이미 실행 중인 재고 서버에 HTTP 연결을 연다
- **②** 서버 모듈을 클라이언트 자신의 프로세스에 불러와 핸들러를 직접 호출한다
- **③** 원격 MCP 엔드포인트에 연결해 모든 응답을 Server-Sent Events로 받는다
- **④** 서버를 로컬 하위 프로세스로 실행하고, 그 stdin과 stdout으로 MCP 메시지를 주고받는다

> **핵심 진단:** stdio 트랜스포트에서는 **클라이언트가 MCP 서버를 하위 프로세스로 실행** 하고, 서버는 **stdin에서 JSON-RPC 메시지를 읽고 stdout에 씁니다**. 공식 SDK의 `StdioClientTransport`는 받은 `command`와 `args`로 그 프로세스를 띄웁니다. 공식 클라이언트 튜토리얼도 이 클라이언트가 "서버를 하위 프로세스로 실행하고 stdio로 통신한다"고 설명합니다. 연결을 끊으면 하위 프로세스도 종료됩니다.

1. **오답** - 이미 떠 있는 서버에 HTTP로 붙는 것은 Streamable HTTP 트랜스포트입니다. stdio 트랜스포트는 서버를 직접 실행합니다.
2. **오답** - 같은 프로세스 안에서 도구를 돌리는 것은 Agent SDK의 인프로세스 SDK MCP 서버 같은 방식입니다. stdio는 별도 프로세스와 표준 스트림으로 통신합니다.
3. **오답** - 원격 엔드포인트와 SSE는 HTTP 계열 트랜스포트의 특징입니다. 이 설정에는 URL이 없습니다.
4. **정답** - 하위 프로세스 실행과 stdin/stdout 통신이라는 stdio 트랜스포트의 정의 그대로입니다.

> 💡 **시험 포인트:** `command`·`args`가 보이면 stdio(하위 프로세스), `url`이 보이면 HTTP입니다.

> 📚 근거 문서: [Build an MCP client](https://modelcontextprotocol.io/docs/develop/build-client) · [stdio (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio)

---

## 문제 26
### **A vendor gives a team the remote MCP endpoint `https://mcp.trackly.example/mcp`. To add it to Claude Code, a developer runs `claude mcp add --transport ___ trackly https://mcp.trackly.example/mcp`. Which value fills the blank?**

| 보기 | 설명 |
|------|------|
| **1. `http`** | |
| 2. `stdio` | |
| 3. `ws` | |
| 4. `remote` | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

공급업체가 원격 MCP 엔드포인트 `https://mcp.trackly.example/mcp`를 팀에 줬습니다. 이를 Claude Code에 추가하려고 개발자가 `claude mcp add --transport ___ trackly https://mcp.trackly.example/mcp`를 실행합니다. 빈칸에 들어갈 값은 무엇일까요?

- **①** `http`
- **②** `stdio`
- **③** `ws`
- **④** `remote`

> **핵심 진단:** Claude Code에서 원격 서버를 추가하는 권장 형식은 **`claude mcp add --transport http <name> <url>`** 입니다. SSE 트랜스포트는 사용 중단(deprecated)되었고 가능하면 HTTP를 쓰라고 문서가 안내합니다. 로컬 프로세스로 실행하는 서버라면 `--transport stdio`에 `--` 뒤로 실행 명령을 넘깁니다.

```bash
claude mcp add --transport http trackly https://mcp.trackly.example/mcp
claude mcp add --transport stdio geodata -- uvx geodata-mcp --region eu
```

1. **정답** - URL로 받은 원격 서버에 맞는 트랜스포트 값입니다.
2. **오답** - `stdio`는 Claude Code가 로컬에서 실행할 명령이 있을 때 씁니다. 원격 URL에는 맞지 않습니다.
3. **오답** - WebSocket(`ws`) 서버는 `claude mcp add-json`으로만 추가할 수 있고, `--transport` 플래그는 `ws`를 받지 않습니다.
4. **오답** - `remote`라는 트랜스포트 값은 없습니다.

> 💡 **시험 포인트:** 원격 URL = `--transport http`. SSE는 사용 중단, `ws`는 `add-json` 전용입니다.

> 📚 근거 문서: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

---

## 문제 27
### **A vendor's setup guide for its geodata MCP server provides only the command `uvx geodata-mcp --region eu` and no URL. Which transport should the Agent SDK configuration use for this server?**

| 보기 | 설명 |
|------|------|
| 1. `http`, because every MCP server is ultimately reached through its single MCP endpoint. | |
| 2. `sse`, because a server that runs locally streams all of its responses as events. | |
| **3. stdio, by giving `command` and `args` so that the SDK starts the server as a local process.** | |
| 4. An SDK MCP server, because the server runs on the same machine as the agent itself. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

한 공급업체의 지오데이터 MCP 서버 설치 안내에는 `uvx geodata-mcp --region eu`라는 명령만 있고 URL은 없습니다. Agent SDK 설정에서 이 서버에 어떤 트랜스포트를 써야 할까요?

- **①** `http`. 모든 MCP 서버는 결국 단일 MCP 엔드포인트로 접근하기 때문이다
- **②** `sse`. 로컬에서 실행되는 서버는 모든 응답을 이벤트로 스트리밍하기 때문이다
- **③** stdio. `command`와 `args`를 주어 SDK가 서버를 로컬 프로세스로 실행하게 한다
- **④** SDK MCP 서버. 서버가 에이전트와 같은 컴퓨터에서 실행되기 때문이다

> **핵심 진단:** Agent SDK 문서의 판단 기준은 간단합니다. 서버 문서가 **실행할 명령** 을 주면 stdio, **URL** 을 주면 HTTP 또는 SSE, 코드 안에서 직접 도구를 만들면 SDK MCP 서버입니다. stdio 서버는 `mcpServers`에 `command`와 `args`(필요하면 `env`)를 주어 등록하고, SDK가 그 명령으로 프로세스를 띄워 stdin/stdout으로 통신합니다.

```python
mcp_servers={"geodata": {"command": "uvx",
                         "args": ["geodata-mcp", "--region", "eu"]}}
```

1. **오답** - 단일 MCP 엔드포인트는 Streamable HTTP 서버의 특징입니다. 명령만 받은 서버에는 연결할 URL이 없습니다.
2. **오답** - SSE는 원격 URL에 쓰는 (사용 중단된) HTTP 계열 트랜스포트입니다. 로컬 명령과는 관계가 없습니다.
3. **정답** - 명령이 주어졌으니 stdio로 하위 프로세스를 실행하는 것이 맞습니다.
4. **오답** - SDK MCP 서버는 여러분이 앱 코드 안에서 `tool()`·`createSdkMcpServer`로 정의한 도구를 위한 것입니다. 외부 패키지로 배포된 서버를 같은 컴퓨터에서 돌린다고 SDK 서버가 되지는 않습니다.

> 💡 **시험 포인트:** 명령 → stdio, URL → http, 내 코드 속 도구 → SDK 서버. 같은 컴퓨터에서 돈다는 사실은 기준이 아닙니다.

> 📚 근거 문서: [Connect to external tools with MCP (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/mcp)

---

## 문제 28
### **An Agent SDK app registers an MCP server under the key `warehouse` and wants every tool from that server to run without permission prompts, without listing each tool. Which `allowedTools` entry does this?**

| 보기 | 설명 |
|------|------|
| 1. `mcp__*` | |
| **2. `mcp__warehouse__*`** | |
| 3. `warehouse__*` | |
| 4. `mcp:warehouse:*` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

Agent SDK 앱이 MCP 서버를 `warehouse`라는 키로 등록했고, 도구를 하나씩 나열하지 않고도 그 서버의 모든 도구가 권한 확인 없이 실행되기를 원합니다. 어떤 `allowedTools` 항목이 이렇게 할까요?

- **①** `mcp__*`
- **②** `mcp__warehouse__*`
- **③** `warehouse__*`
- **④** `mcp:warehouse:*`

> **핵심 진단:** MCP 도구의 이름은 **`mcp__<server-name>__<tool-name>`** 이고, `<server-name>`은 `mcpServers`에 등록한 키입니다. 허용 규칙은 **문자 그대로의 `mcp__<server>__` 접두사 뒤에서만** 도구 이름 glob을 받으므로, `mcp__warehouse__*`가 그 서버의 모든 도구를 자동 승인합니다. 서버 부분이 glob이면 안 되기 때문에 `mcp__*`나 `*` 같은 허용 규칙은 무시되고 아무것도 승인하지 않습니다.

1. **오답** - 서버를 특정하지 않은 `mcp__*`는 허용 규칙으로는 무시됩니다. 거부 규칙에서는 모든 MCP 도구를 뜻하지만 허용 규칙에서는 효과가 없습니다.
2. **정답** - 특정 서버의 모든 도구를 여는 문서의 와일드카드 형식입니다.
3. **오답** - `mcp__` 접두사가 빠져 MCP 도구 이름과 일치하지 않습니다.
4. **오답** - 구분자가 틀렸습니다. MCP 도구 이름은 이중 밑줄(`__`)로 구분합니다.

> 💡 **시험 포인트:** 서버 전체 = `mcp__서버__*`, 도구 하나 = `mcp__서버__도구`. 서버를 특정하지 않은 허용 glob은 무시됩니다.

> 📚 근거 문서: [Connect to external tools with MCP (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/mcp) · [Configure permissions (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/permissions)

---

## 문제 29
### **A team adds a hosted metrics MCP server to `.mcp.json` as `"metrics": {"url": "https://metrics.example.com/mcp"}`, but Claude Code skips the server at startup. What is the fix?**

| 보기 | 설명 |
|------|------|
| **1. Add `"type": "http"` to the entry, because an entry with no `type` is read as a stdio server.** | |
| 2. Add a `command` field that points at `curl`, because Claude Code reaches remote servers through a local process. | |
| 3. Rename the key to `metrics-http`, because Claude Code infers each server's transport from its name. | |
| 4. Move the entry to `.claude/settings.json`, because remote servers are not allowed in `.mcp.json` files. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

팀이 호스팅된 메트릭 MCP 서버를 `.mcp.json`에 `"metrics": {"url": "https://metrics.example.com/mcp"}`로 추가했는데, Claude Code가 시작할 때 이 서버를 건너뜁니다. 어떻게 고쳐야 할까요?

- **①** 항목에 `"type": "http"`를 추가한다. `type`이 없는 항목은 stdio 서버로 읽히기 때문이다
- **②** Claude Code는 원격 서버에 로컬 프로세스를 거쳐 접근하므로, `curl`을 가리키는 `command` 필드를 추가한다
- **③** Claude Code는 서버 이름으로 트랜스포트를 추론하므로, 키를 `metrics-http`로 바꾼다
- **④** 원격 서버는 `.mcp.json`에 둘 수 없으므로, 항목을 `.claude/settings.json`으로 옮긴다

> **핵심 진단:** Claude Code 문서는 **`url`은 있는데 `type`이 없는 JSON 항목을 설정 오류** 로 봅니다. `type`이 없는 항목을 **stdio 서버로 읽기** 때문입니다. Claude Code는 그 서버를 건너뛰고 "has a "url" but no "type"; add "type": "http" (or "sse" / "ws")"라는 메시지를 냅니다. 호스팅된 엔드포인트는 `type`과 `url`을 함께 씁니다.

```json
{"mcpServers": {"metrics": {"type": "http",
                            "url": "https://metrics.example.com/mcp"}}}
```

1. **정답** - 누락된 `type`을 채우는 것이 문서가 안내하는 수정입니다.
2. **오답** - 원격 HTTP 서버에는 로컬 명령이 필요 없습니다. `command`를 넣으면 stdio 서버 정의가 됩니다.
3. **오답** - 트랜스포트는 이름이 아니라 `type` 필드로 정합니다.
4. **오답** - 프로젝트 MCP 서버의 자리는 바로 저장소 루트의 `.mcp.json`입니다. 원격 서버도 문제없이 둘 수 있습니다.

> 💡 **시험 포인트:** `url`만 있고 `type`이 없으면 stdio로 읽혀 건너뜁니다. `"type": "http"`를 짝으로 기억하세요.

> 📚 근거 문서: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

---

## 문제 30
### **An agent connects to a `billing` MCP server that exposes `get_invoice`, `refund_payment`, and `void_invoice`. The team wants only `get_invoice` to be auto-approved. Which `allowedTools` entry should they use?**

| 보기 | 설명 |
|------|------|
| 1. `mcp__billing__*` | |
| 2. `mcp__billing` | |
| 3. `get_invoice` | |
| **4. `mcp__billing__get_invoice`** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.2 MCP Server Development

**📝 문제 번역**

에이전트가 `get_invoice`, `refund_payment`, `void_invoice`를 노출하는 `billing` MCP 서버에 연결합니다. 팀은 `get_invoice`만 자동 승인되기를 원합니다. 어떤 `allowedTools` 항목을 써야 할까요?

- **①** `mcp__billing__*`
- **②** `mcp__billing`
- **③** `get_invoice`
- **④** `mcp__billing__get_invoice`

> **핵심 진단:** 도구 하나만 승인하려면 그 도구의 **전체 이름 `mcp__<server>__<tool>`** 을 씁니다. Claude Code 권한 규칙 문서에 따르면 `mcp__billing`과 `mcp__billing__*`는 **둘 다 그 서버의 모든 도구** 와 일치하고, `mcp__billing__get_invoice`만 그 도구 하나와 일치합니다. 환불·무효 처리처럼 부작용이 큰 도구는 목록에 넣지 않으면 권한 흐름(모드·`canUseTool`)으로 넘어갑니다.

1. **오답** - 와일드카드는 서버의 모든 도구를 승인하므로 `refund_payment`와 `void_invoice`까지 확인 없이 실행됩니다.
2. **오답** - 서버 이름만 쓴 규칙도 그 서버가 제공하는 모든 도구와 일치합니다.
3. **오답** - MCP 도구는 `mcp__` 접두사와 서버 이름이 붙은 전체 이름으로 식별됩니다. 도구 이름만으로는 일치하지 않습니다.
4. **정답** - 전체 이름으로 그 도구 하나만 승인합니다.

> 💡 **시험 포인트:** 최소 권한이 요구되면 와일드카드 대신 도구별 전체 이름을 나열합니다.

> 📚 근거 문서: [Connect to external tools with MCP (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/mcp) · [Configure permissions](https://code.claude.com/docs/en/permissions)

---

## 문제 31
### **An application enables four tools: `web_search`, `code_execution`, `text_editor`, and `web_fetch`. Which of them is a client tool that the application itself must execute, even though Anthropic wrote its schema?**

| 보기 | 설명 |
|------|------|
| 1. `web_search` | |
| **2. `text_editor`** | |
| 3. `code_execution` | |
| 4. `web_fetch` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

애플리케이션이 `web_search`, `code_execution`, `text_editor`, `web_fetch` 네 도구를 켭니다. 이 중 Anthropic이 스키마를 썼지만 애플리케이션이 직접 실행해야 하는 클라이언트 도구는 무엇일까요?

- **①** `web_search`
- **②** `text_editor`
- **③** `code_execution`
- **④** `web_fetch`

> **핵심 진단:** 도구는 실행 위치로 세 갈래입니다. **Anthropic 스키마 클라이언트 도구** 는 `memory`, `bash`, `text_editor`, `computer`, `browser`로, Anthropic이 스키마를 공개하고 **실행은 앱이 합니다**. 응답에 `tool_use` 블록이 오면 앱이 실제로 파일을 보거나 고치고 `tool_result`를 돌려줍니다. 반면 `web_search`, `web_fetch`, `code_execution`, `tool_search`는 **서버 실행 도구** 로, Anthropic이 실행하고 앱은 결과를 읽기만 합니다.

1. **오답** - 웹 검색은 Anthropic 인프라의 서버 측 루프에서 실행됩니다. 앱은 `tool_result`를 만들지 않습니다.
2. **정답** - 스키마는 Anthropic이 썼지만 파일 편집은 앱의 코드가 수행하는 클라이언트 도구입니다.
3. **오답** - 코드 실행은 Anthropic이 관리하는 샌드박스 컨테이너에서 돌아가는 서버 도구입니다.
4. **오답** - 웹 페이지 가져오기도 서버 도구입니다. 결과는 `web_fetch_tool_result` 블록으로 응답에 들어옵니다.

> 💡 **시험 포인트:** "스키마를 Anthropic이 썼다 = Anthropic이 실행한다"는 함정입니다. `bash`·`text_editor`는 앱이 실행합니다.

> 📚 근거 문서: [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

---

## 문제 32
### **An SRE keeps pasting the same 12-step on-call handoff procedure into Claude Code at the end of every shift. The procedure matters only at handoff time, not for everyday coding work. What is the best way to stop repeating it?**

| 보기 | 설명 |
|------|------|
| 1. Add the full procedure to the project's CLAUDE.md so that it is loaded into every session. | |
| 2. Build an MCP server that exposes each of the 12 steps as a separate tool Claude can call. | |
| **3. Capture it as a skill that can also be invoked as a slash command such as `/handoff`.** | |
| 4. Write a `SessionStart` hook that prints the whole procedure into the context of each session. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

한 SRE가 교대가 끝날 때마다 똑같은 12단계 온콜 인수인계 절차를 Claude Code에 붙여 넣습니다. 이 절차는 인수인계 때만 중요하고 평소 코딩 작업에는 필요 없습니다. 반복을 멈추는 가장 좋은 방법은 무엇일까요?

- **①** 모든 세션에 로드되도록 절차 전체를 프로젝트의 CLAUDE.md에 넣는다
- **②** 12단계를 각각 Claude가 호출할 수 있는 별도 도구로 노출하는 MCP 서버를 만든다
- **③** `/handoff` 같은 슬래시 명령으로도 부를 수 있는 스킬로 만든다
- **④** 절차 전체를 매 세션의 컨텍스트에 출력하는 `SessionStart` 훅을 작성한다

> **핵심 진단:** Claude Code 문서는 "같은 플레이북이나 여러 단계 절차를 세 번째 붙여 넣을 때"를 **스킬** 을 만들 신호로 꼽습니다. 스킬은 재사용 가능한 지시·지식·워크플로이고, 설명만 세션 시작 때 로드되며 **본문은 쓸 때만** 들어옵니다. `/deploy`처럼 **`/<name>`으로 직접 부를 수도** 있습니다. CLAUDE.md는 "항상 X를 하라" 같은 상시 규칙, MCP는 외부 서비스 연결, 커스텀 도구는 동작을 위한 것입니다.

1. **오답** - CLAUDE.md는 매 세션 전체가 로드되어 모든 요청에 비용이 듭니다. 인수인계 때만 쓰는 절차를 넣기에는 맞지 않고, 문서는 CLAUDE.md를 200줄 이하로 유지하고 참조 내용은 스킬로 옮기라고 권합니다.
2. **오답** - MCP는 외부 시스템과의 연결을 위한 것입니다. 절차 자체는 외부 서비스가 아니라 지시문이므로 서버로 만들 이유가 없습니다.
3. **정답** - 필요할 때만 로드되고 이름으로 부를 수 있는, 반복 절차에 맞는 확장입니다.
4. **오답** - 훅의 출력은 컨텍스트에 들어가므로, 이 방법은 모든 세션에 절차를 밀어 넣는 셈입니다. 훅은 매번 반드시 실행되어야 하는 자동화에 씁니다.

> 💡 **시험 포인트:** 반복 절차 → 스킬, 상시 규칙 → CLAUDE.md, 외부 연결 → MCP, 반드시 실행 → 훅.

> 📚 근거 문서: [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Extend Claude with skills](https://code.claude.com/docs/en/skills)

---

## 문제 33
### **A team installs 20 skills, each with a SKILL.md body of about 3,000 tokens plus several reference files. Predict roughly how much context the skills use at startup, before any of them is triggered.**

| 보기 | 설명 |
|------|------|
| **1. About 2,000 tokens, because only each skill's name and description (about 100 tokens each) is loaded.** | |
| 2. About 60,000 tokens, because every SKILL.md body is loaded at startup so Claude can choose among them. | |
| 3. Over 60,000 tokens, because each skill's bundled reference files are loaded together with its SKILL.md. | |
| 4. Nothing at all, because skills are loaded only after the user types the slash command for one of them. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

한 팀이 스킬 20개를 설치했습니다. 각 스킬의 SKILL.md 본문은 약 3,000토큰이고 참조 파일도 몇 개씩 있습니다. 어느 스킬도 트리거되기 전, 시작 시점에 스킬이 쓰는 컨텍스트가 대략 얼마일지 예측해 보세요.

- **①** 약 2,000토큰. 각 스킬의 이름과 설명(스킬당 약 100토큰)만 로드되기 때문이다
- **②** 약 60,000토큰. Claude가 고를 수 있도록 시작 시 모든 SKILL.md 본문이 로드되기 때문이다
- **③** 60,000토큰 이상. 스킬마다 번들된 참조 파일이 SKILL.md와 함께 로드되기 때문이다
- **④** 전혀 쓰지 않는다. 스킬은 사용자가 그 슬래시 명령을 입력한 뒤에만 로드되기 때문이다

> **핵심 진단:** 스킬은 **단계적 공개(progressive disclosure)** 로 로드됩니다. 1단계 메타데이터(프런트매터의 `name`과 `description`)는 **항상, 시작 시** 시스템 프롬프트에 들어가며 **스킬당 약 100토큰** 입니다. 2단계 SKILL.md 본문(5k 미만)은 스킬이 트리거될 때, 3단계 참조 파일과 스크립트는 필요할 때만 로드됩니다. 따라서 20개 × 약 100토큰 ≈ **2,000토큰** 입니다. 문서도 이 방식 덕분에 "많은 스킬을 컨텍스트 부담 없이 설치할 수 있다"고 설명합니다.

| 단계 | 로드 시점 | 비용 |
|---|---|---|
| 메타데이터 | 시작 시 항상 | 스킬당 약 100토큰 |
| SKILL.md 본문 | 트리거될 때 | 5k 미만 |
| 참조 파일·스크립트 | 필요할 때 | 접근 전까지 0 (스크립트는 출력만) |

1. **정답** - 시작 시에는 이름과 설명만 올라간다는 1단계 로딩을 정확히 계산했습니다.
2. **오답** - 본문은 트리거될 때만 들어옵니다. Claude는 설명만 보고 어떤 스킬을 쓸지 정합니다.
3. **오답** - 번들 파일은 읽기 전까지 토큰을 쓰지 않습니다. 스킬에 문서를 많이 넣어도 쓰지 않으면 비용이 없습니다.
4. **오답** - 기본 설정의 스킬은 설명이 항상 컨텍스트에 있어 Claude가 알아서 고를 수 있습니다. 설명까지 빼려면 Claude Code에서 `disable-model-invocation: true`를 설정해야 합니다.

> 💡 **시험 포인트:** 스킬의 시작 비용은 '개수 × 약 100토큰'입니다. 본문 길이나 참조 파일 수는 시작 비용에 들어가지 않습니다.

> 📚 근거 문서: [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview)

---

## 문제 34
### **A `contract-review` skill has a SKILL.md and a `REDLINE_GUIDE.md` reference file that is needed only for tracked-change edits. A user asks Claude to summarize the risks in a contract, without any edits. Which sequence describes how the skill is loaded?**

| 보기 | 설명 |
|------|------|
| 1. SKILL.md and REDLINE_GUIDE.md load at startup → the request arrives → Claude picks the relevant section → Claude finishes the summary | |
| 2. The request arrives → Claude loads every installed skill's SKILL.md → Claude matches the request → Claude reads REDLINE_GUIDE.md → Claude finishes | |
| 3. Name and description load at startup → the request arrives → Claude reads REDLINE_GUIDE.md first → Claude reads SKILL.md → Claude finishes | |
| **4. Name and description load at startup → the request arrives → Claude reads SKILL.md → Claude skips REDLINE_GUIDE.md as unneeded → Claude finishes the summary** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

`contract-review` 스킬에는 SKILL.md와, 변경 추적 편집 때만 필요한 참조 파일 `REDLINE_GUIDE.md`가 있습니다. 사용자가 편집 없이 계약서의 위험 요소를 요약해 달라고 합니다. 스킬이 로드되는 순서를 올바르게 설명한 것은 무엇일까요?

- **①** 시작 시 SKILL.md와 REDLINE_GUIDE.md가 로드된다 → 요청이 온다 → Claude가 관련 부분을 고른다 → Claude가 요약을 마친다
- **②** 요청이 온다 → Claude가 설치된 모든 스킬의 SKILL.md를 로드한다 → Claude가 요청을 대조한다 → Claude가 REDLINE_GUIDE.md를 읽는다 → Claude가 마친다
- **③** 시작 시 이름과 설명이 로드된다 → 요청이 온다 → Claude가 REDLINE_GUIDE.md를 먼저 읽는다 → Claude가 SKILL.md를 읽는다 → Claude가 마친다
- **④** 시작 시 이름과 설명이 로드된다 → 요청이 온다 → Claude가 SKILL.md를 읽는다 → 필요 없는 REDLINE_GUIDE.md는 건너뛴다 → Claude가 요약을 마친다

> **핵심 진단:** 공식 문서의 PDF 스킬 예시와 같은 흐름입니다. **① 시작:** 시스템 프롬프트에 스킬의 이름과 설명만 들어간다 → **② 요청 도착** → **③ 설명과 맞으므로 Claude가 bash로 SKILL.md를 읽어** 지시를 컨텍스트에 넣는다 → **④ 작업에 필요 없는 참조 파일은 읽지 않는다** → **⑤ SKILL.md의 지시대로 작업을 마친다.** 참조 파일은 SKILL.md가 가리키고 작업이 필요로 할 때만 읽히므로, 편집이 없는 요약 요청에서는 REDLINE_GUIDE.md가 토큰을 쓰지 않습니다.

1. **오답** - 시작 시 로드되는 것은 메타데이터뿐입니다. SKILL.md 본문과 참조 파일은 시작 시 들어가지 않습니다.
2. **오답** - 요청과 대조하는 데 쓰는 것은 이미 로드된 설명입니다. 모든 스킬의 본문을 로드하지 않고, 이 요청에는 REDLINE_GUIDE.md도 필요 없습니다.
3. **오답** - 참조 파일은 SKILL.md의 지시를 통해 찾아가는 것이므로 SKILL.md보다 먼저 읽히지 않습니다. 이 요청에는 아예 필요하지도 않습니다.
4. **정답** - 메타데이터 → 요청 → SKILL.md → 불필요한 참조 파일 건너뜀 → 완료라는 단계적 공개 흐름 그대로입니다.

> 💡 **시험 포인트:** 순서 문항의 기준은 '시작 시 메타데이터만', 'SKILL.md는 트리거 후', '참조 파일은 필요할 때만'입니다.

> 📚 근거 문서: [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

---

## 문제 35
### **A skill is never triggered, even though users often ask for exactly what it does. Which SKILL.md frontmatter field does Claude match requests against when deciding whether to use a skill?**

| 보기 | 설명 |
|------|------|
| 1. `name` | |
| **2. `description`** | |
| 3. `allowed-tools` | |
| 4. `argument-hint` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

사용자들이 스킬이 하는 일을 그대로 자주 요청하는데도 그 스킬이 한 번도 트리거되지 않습니다. 스킬을 쓸지 정할 때 Claude가 요청과 대조하는 SKILL.md 프런트매터 필드는 무엇일까요?

- **①** `name`
- **②** `description`
- **③** `allowed-tools`
- **④** `argument-hint`

> **핵심 진단:** Agent Skills 문서는 **`description`이 Claude가 스킬을 트리거할지 판단할 때 요청과 대조하는 필드** 라고 명시하고, 그래서 설명에 **무엇을 하는지와 언제 써야 하는지** 를 함께 써야 한다고 합니다(API 기준 최대 1,024자). Claude Code 문서도 Claude가 이 설명으로 언제 스킬을 적용할지 정한다고 하며, 설명이 모호하거나 다른 스킬과 겹치면 잘못된 스킬을 로드하거나 필요한 스킬을 놓친다고 경고합니다. 트리거되지 않는 스킬은 먼저 설명에 사용자가 실제로 쓰는 표현과 사용 시점을 넣어 봅니다.

1. **오답** - `name`은 스킬 식별자이자 `/` 메뉴의 명령 이름입니다. 메타데이터로 함께 로드되지만, 문서가 매칭 기준으로 밝힌 것은 설명입니다.
2. **정답** - 요청과 대조되는 필드이므로, 트리거 문제는 설명을 고쳐 해결합니다.
3. **오답** - `allowed-tools`는 스킬을 부른 턴에서 권한 확인 없이 쓸 수 있는 도구를 정합니다. 트리거 여부와는 무관합니다.
4. **오답** - `argument-hint`는 자동 완성 때 보여 주는 인자 안내입니다. Claude의 선택에는 쓰이지 않습니다.

> 💡 **시험 포인트:** "스킬이 안 불린다" → `description`에 무엇을·언제를 구체적으로. Claude Code에서는 `when_to_use`가 설명 뒤에 덧붙어 같은 목록에 들어갑니다.

> 📚 근거 문서: [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [Extend Claude with skills](https://code.claude.com/docs/en/skills)

---

## 문제 36
### **An analytics agent must query the company's Snowflake warehouse and follow team conventions: always filter by `tenant_id`, use the approved views instead of raw tables, and cap results at 10,000 rows. Which design fits best?**

| 보기 | 설명 |
|------|------|
| 1. A skill alone, with the warehouse connection string and the SQL conventions written into its SKILL.md. | |
| 2. An MCP server alone, with all of the team's conventions repeated inside every tool description it exposes. | |
| **3. An MCP server for the warehouse connection, plus a skill that documents the schema and query conventions.** | |
| 4. A separate custom tool for every approved view, so that the agent never has to write any SQL itself. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

분석 에이전트가 회사의 Snowflake 웨어하우스를 조회하면서 팀 규칙을 지켜야 합니다. 항상 `tenant_id`로 거르고, 원본 테이블 대신 승인된 뷰를 쓰고, 결과를 1만 행으로 제한해야 합니다. 가장 알맞은 설계는 무엇일까요?

- **①** 웨어하우스 연결 문자열과 SQL 규칙을 SKILL.md에 적은 스킬 하나만 쓴다
- **②** MCP 서버 하나만 쓰고, 팀 규칙 전부를 서버가 노출하는 모든 도구 설명에 반복해 넣는다
- **③** 웨어하우스 연결은 MCP 서버로, 스키마와 쿼리 규칙은 그것을 문서화한 스킬로 둔다
- **④** 에이전트가 SQL을 직접 쓰지 않도록, 승인된 뷰마다 별도의 커스텀 도구를 만든다

> **핵심 진단:** Claude Code 문서는 MCP와 스킬이 **서로 다른 문제를 풀며 함께 잘 동작한다** 고 설명하고, 대표 조합으로 바로 이 예를 듭니다. **MCP가 DB에 연결하고, 스킬이 스키마와 쿼리 패턴을 문서화한다.** MCP는 외부 시스템을 위한 전용 도구를 주고 연결과 인증을 서버가 처리합니다. 스킬은 그 도구를 효과적으로 쓰는 법(팀 규칙, 스키마 설명)을 주며, 필요할 때만 로드됩니다.

1. **오답** - 스킬은 지식과 절차를 담을 뿐 외부 시스템 연결을 제공하지 않습니다. 연결 문자열을 지시문에 적는 것은 보안상으로도 좋지 않습니다.
2. **오답** - 도구는 생기지만, 팀 규칙을 모든 도구 설명에 반복하면 설명이 부풀고 관리가 어렵습니다. 문서가 권하는 분리는 연결은 MCP, 사용 지식은 스킬입니다.
3. **정답** - 연결과 사용법을 각자 맞는 층에 둔, 문서의 'Skill + MCP' 조합입니다.
4. **오답** - 뷰마다 도구를 만들면 도구가 난립하고 새 뷰마다 코드를 고쳐야 합니다. 규칙을 지키게 하려는 목적에 비해 과도한 설계입니다.

> 💡 **시험 포인트:** "외부 시스템 + 팀의 사용 규칙"이 함께 나오면 MCP + 스킬입니다. 둘은 대안이 아니라 짝입니다.

> 📚 근거 문서: [Extend Claude Code](https://code.claude.com/docs/en/features-overview)

---

## 문제 37
### **A team wants its agent to create and update issues in Trackly, its issue tracker. Trackly already publishes an official remote MCP server that handles OAuth sign-in. What should the team do?**

| 보기 | 설명 |
|------|------|
| **1. Connect the existing Trackly MCP server and approve only the tools that the agent actually needs.** | |
| 2. Write custom tools that call Trackly's REST API directly, so the team controls every request it sends. | |
| 3. Fork the Trackly MCP server and rebuild it as an in-process SDK server inside the agent's codebase. | |
| 4. Write a skill that teaches Claude to call Trackly's REST API with curl through the Bash tool. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

한 팀이 에이전트가 이슈 트래커 Trackly에서 이슈를 만들고 수정하게 하려 합니다. Trackly는 OAuth 로그인을 처리하는 공식 원격 MCP 서버를 이미 제공합니다. 팀은 무엇을 해야 할까요?

- **①** 기존 Trackly MCP 서버를 연결하고, 에이전트가 실제로 필요한 도구만 승인한다
- **②** 보내는 모든 요청을 팀이 통제하도록, Trackly의 REST API를 직접 호출하는 커스텀 도구를 작성한다
- **③** Trackly MCP 서버를 포크해 에이전트 코드베이스 안의 인프로세스 SDK 서버로 다시 만든다
- **④** Claude가 Bash 도구로 curl을 써서 Trackly REST API를 호출하도록 가르치는 스킬을 작성한다

> **핵심 진단:** 외부 서비스에 이미 MCP 서버가 있으면 **그 서버와 인증을 재사용** 하는 것이 기본입니다. 문서는 MCP가 외부 시스템을 위한 전용 도구를 주고 **연결과 인증을 서버가 처리한다** 고 설명하고, Agent SDK 문서도 MCP로 "커스텀 도구를 구현하지 않고" 외부 서비스에 연결할 수 있다고 소개합니다. 연결한 뒤에는 `allowedTools`에 필요한 도구의 전체 이름(`mcp__trackly__…`)만 넣어 최소 권한으로 엽니다.

1. **정답** - 인증·도구·유지 보수를 이미 갖춘 서버를 쓰고, 승인 범위로 위험을 통제하는 방법입니다.
2. **오답** - 통제는 승인 규칙으로도 충분히 얻을 수 있습니다. API 호출을 다시 짜면 OAuth·오류 처리·API 변경 대응을 팀이 떠안게 됩니다.
3. **오답** - 이미 있는 서버를 다시 구현하는 일이라 이득 없이 유지 보수만 늘어납니다.
4. **오답** - 스킬은 절차를 가르칠 뿐 연결이나 인증을 제공하지 않습니다. 셸로 API를 직접 부르면 토큰 관리와 권한 통제도 어려워집니다.

> 💡 **시험 포인트:** "공식 MCP 서버가 이미 있다"는 신호가 있으면 재구현 보기는 오답입니다. 연결하고, 필요한 도구만 승인합니다.

> 📚 근거 문서: [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Connect to external tools with MCP (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/mcp)

---

## 문제 38
### **Match each need to the extension that fits it: (a) reading, editing, and searching files and running shell commands in the repository; (b) posting messages to the team's chat service; (c) a repeatable release sign-off checklist; (d) reusing the same skills, hooks, and MCP setup in a second repository.**

| 보기 | 설명 |
|------|------|
| 1. (a) MCP server, (b) skill, (c) plugin, (d) built-in tools | |
| 2. (a) built-in tools, (b) skill, (c) MCP server, (d) plugin | |
| 3. (a) built-in tools, (b) MCP server, (c) plugin, (d) skill | |
| **4. (a) built-in tools, (b) MCP server, (c) skill, (d) plugin** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

각 요구에 맞는 확장을 짝지으세요. (a) 저장소에서 파일을 읽고 고치고 검색하며 셸 명령을 실행하기, (b) 팀 채팅 서비스에 메시지 게시하기, (c) 반복 가능한 릴리스 승인 체크리스트, (d) 같은 스킬·훅·MCP 설정을 두 번째 저장소에서도 다시 쓰기.

- **①** (a) MCP 서버, (b) 스킬, (c) 플러그인, (d) 내장 도구
- **②** (a) 내장 도구, (b) 스킬, (c) MCP 서버, (d) 플러그인
- **③** (a) 내장 도구, (b) MCP 서버, (c) 플러그인, (d) 스킬
- **④** (a) 내장 도구, (b) MCP 서버, (c) 스킬, (d) 플러그인

> **핵심 진단:** Claude Code 문서의 대응 관계를 그대로 적용합니다.

| 요구 | 확장 | 근거 |
|---|---|---|
| 파일·검색·셸 작업 | **내장 도구** | 파일 작업·검색·실행·웹 접근용 내장 도구가 대부분의 코딩 작업을 감당한다 |
| 외부 서비스에 게시 | **MCP 서버** | 외부 데이터나 동작은 MCP로 연결한다 |
| 반복 절차 | **스킬** | 반복 작업과 워크플로, `/<name>`으로 호출 |
| 다른 저장소에서 같은 설정 | **플러그인** | 스킬·훅·서브에이전트·MCP 서버를 묶는 패키징 층 |

1. **오답** - 네 짝이 모두 어긋났습니다. 파일 작업에 MCP 서버를 만들 이유가 없고, 설정 재사용은 플러그인의 몫입니다.
2. **오답** - (b)와 (c)가 바뀌었습니다. 외부 서비스 게시는 연결이 필요하고, 체크리스트는 지시문입니다.
3. **오답** - (c)와 (d)가 바뀌었습니다. 플러그인은 묶어서 배포하는 층이고, 체크리스트 자체는 스킬입니다.
4. **정답** - 네 요구가 각각 내장 도구·MCP·스킬·플러그인과 정확히 짝지어졌습니다.

> 💡 **시험 포인트:** 문서가 주는 신호 "두 번째 저장소에 같은 설정이 필요하다"는 곧 플러그인입니다.

> 📚 근거 문서: [Extend Claude Code](https://code.claude.com/docs/en/features-overview)

---

## 문제 39
### **An Agent SDK agent must look up employee leave balances in a proprietary internal HR service. No MCP server exists for it, and the service exposes only an internal REST API. Which approach fits best?**

| 보기 | 설명 |
|------|------|
| 1. Have Claude call the REST API with curl through the built-in Bash tool, guided by a note in CLAUDE.md. | |
| **2. Define a custom tool with the SDK's `tool()` helper and register it through an in-process SDK MCP server.** | |
| 3. Publish the HR service as a public remote MCP server so that Claude can reach it over Streamable HTTP. | |
| 4. Write a skill that contains the HR API documentation, since skills can call internal services directly. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D8 · Tools and MCPs · 8.3 Agentic Customization

**📝 문제 번역**

Agent SDK 에이전트가 사내 독점 HR 서비스에서 직원의 남은 휴가 일수를 조회해야 합니다. 이 서비스용 MCP 서버는 없고, 서비스는 내부 REST API만 제공합니다. 가장 알맞은 방법은 무엇일까요?

- **①** CLAUDE.md의 안내에 따라 Claude가 내장 Bash 도구로 curl을 써서 REST API를 호출하게 한다
- **②** SDK의 `tool()` 헬퍼로 커스텀 도구를 정의하고, 인프로세스 SDK MCP 서버를 통해 등록한다
- **③** Claude가 Streamable HTTP로 접근할 수 있도록 HR 서비스를 공개 원격 MCP 서버로 게시한다
- **④** 스킬은 내부 서비스를 직접 호출할 수 있으므로, HR API 문서를 담은 스킬을 작성한다

> **핵심 진단:** 기존 통합이 없는 사내 시스템에 **도메인 동작** 이 필요하면 커스텀 도구를 만듭니다. Agent SDK에서는 이름·설명·입력 스키마·핸들러로 도구를 정의해 `tool()`(TypeScript)이나 `@tool`(Python)로 만들고, **`createSdkMcpServer`·`create_sdk_mcp_server`로 감싸 `mcpServers`에 넘깁니다**. 이 서버는 **별도 프로세스가 아니라 앱 안에서** 돌고, 도구는 `mcp__hr__get_leave_balance` 같은 이름으로 `allowedTools`에 넣어 승인합니다. 핸들러가 인증과 오류 처리를 맡으므로 Claude에게 자격 증명을 노출하지 않아도 됩니다.

1. **오답** - 셸로 API를 직접 부르면 자격 증명 처리, 입력 검증, 권한 통제가 모두 프롬프트와 명령 문자열에 기대게 됩니다. 구조화된 입력·출력과 오류 처리를 주는 도구가 낫습니다.
2. **정답** - 문서가 안내하는 커스텀 도구 등록 방식이며, 사내 독점 서비스에 맞는 선택입니다.
3. **오답** - 사내 HR 데이터를 공개 서버로 내놓는 것은 불필요한 노출입니다. 이 에이전트 하나에 필요한 연결에 비해 위험이 큽니다.
4. **오답** - 스킬은 지시와 참조 자료를 담을 뿐 서비스를 호출하는 연결을 제공하지 않습니다. 동작이 필요하면 도구가 있어야 합니다.

> 💡 **시험 포인트:** "독점 사내 서비스 + 기존 MCP 서버 없음 + Agent SDK" → 인프로세스 SDK MCP 서버에 등록한 커스텀 도구.

> 📚 근거 문서: [Give Claude custom tools (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/custom-tools) · [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

---
