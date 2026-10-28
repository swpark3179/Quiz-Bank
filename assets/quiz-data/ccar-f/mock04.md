<!-- 출처: https://szymonpaluch.com/claude-certified-architect-practice-exam — CCAR-F 비공식 연습문제 "실전 모의고사 4" 60문항(원문 Question 번호 = 문제 번호). 문제·보기·정답은 원문 그대로 옮기고 보기 기호만 A–D → 1–4로 바꿨다. 해설은 원문 근거를 바탕으로 공식 문서를 확인해 한글로 새로 작성. -->

## 문제 1
### **[Scenario: Customer Support Resolution Agent] A customer support resolution agent built with the Claude Agent SDK reaches backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). The engineering team wrote a wrapper loop that ends the conversation whenever the assistant's text matches a closing phrase like "let me know if there's anything else." Production logs show that in 11% of sessions the loop terminates while a tool_use block is still pending, so the refund is never actually executed. What is the correct way to drive the agentic loop?**

| 보기 | 설명 |
|------|------|
| **1. Terminate only on stop_reason end_turn; on tool_use, run the requested tool, append its tool_result to the messages, and loop again.** | |
| 2. Expand the regex allowlist of closing phrases so it also matches every polite sign-off variant the model might emit. | |
| 3. Add a max-iteration cap and also stop after two consecutive text-only assistant responses, regardless of stop_reason. | |
| 4. Run a lightweight intent classifier over each assistant message to decide whether the turn is a genuine completion. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

Claude Agent SDK로 만든 고객 지원 해결 에이전트가 커스텀 MCP 도구(`get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`)로 백엔드 시스템에 접근합니다. 엔지니어링 팀은 어시스턴트의 텍스트가 "let me know if there's anything else" 같은 마무리 문구와 일치하면 대화를 끝내는 래퍼 루프를 작성했습니다. 운영 로그를 보면 세션의 11%에서 `tool_use` 블록이 아직 처리되지 않은 상태로 루프가 종료되어, 환불이 실제로는 실행되지 않습니다. 에이전트 루프를 올바르게 구동하는 방법은 무엇일까요?

- **①** `stop_reason` 이 `end_turn` 일 때만 종료하고, `tool_use` 이면 요청된 도구를 실행해 그 `tool_result` 를 메시지에 추가한 뒤 다시 루프를 돈다
- **②** 마무리 문구 정규식 허용 목록을 넓혀, 모델이 낼 수 있는 모든 정중한 맺음말 변형까지 매칭되게 한다
- **③** 최대 반복 횟수 상한을 두고, `stop_reason` 과 관계없이 텍스트만 있는 어시스턴트 응답이 두 번 연속되면 종료한다
- **④** 어시스턴트 메시지마다 경량 의도 분류기를 돌려, 그 턴이 진짜 완료인지 판단한다

> **핵심 진단:** 에이전트 루프의 계속·종료는 모델이 쓴 *문장* 이 아니라 API 응답의 **`stop_reason` 필드** 로 판단해야 합니다. `stop_reason` 이 `"tool_use"` 이면 응답 안의 `tool_use` 블록을 실행하고, 결과를 같은 `tool_use_id` 를 가진 `tool_result` 블록으로 다음 user 메시지에 담아 다시 호출합니다. `"end_turn"` 이 나와야 비로소 작업이 끝난 것입니다. 마무리 문구는 도구 호출과 *같은 응답* 안에 함께 나올 수 있으므로, 문구를 보고 끊으면 대기 중인 `process_refund` 가 실행되지 않습니다.

```python
for _ in range(MAX_TURNS):  # 폭주 방지용 안전장치 (정상 종료 판단은 stop_reason)
    response = client.messages.create(model=MODEL, tools=tools, messages=messages)
    messages.append({"role": "assistant", "content": response.content})
    if response.stop_reason == "end_turn":
        break
    if response.stop_reason == "tool_use":
        results = [
            {"type": "tool_result", "tool_use_id": b.id, "content": run_tool(b.name, b.input)}
            for b in response.content if b.type == "tool_use"
        ]
        messages.append({"role": "user", "content": results})
```

Agent SDK의 `query()` 는 이 루프를 내부에서 대신 돌려 주므로, 래퍼에서 텍스트를 보고 세션을 끊는 로직 자체를 두지 않는 것이 좋습니다.

1. **정답** - `stop_reason` 은 API가 주는 결정적인 프로토콜 신호입니다. `tool_use` 면 도구를 실행하고 `tool_result` 를 붙여 루프를 이어 가고, `end_turn` 일 때만 끝내면 도구 호출이 대기 중인 채로 세션이 닫히는 일이 원천적으로 사라집니다.
2. **오답** - 마무리 문구를 정규식으로 찾는 것은 이번 버그를 만든 바로 그 취약한 텍스트 파싱입니다. 변형을 아무리 추가해도, 맺음말 뒤에 `tool_use` 블록이 함께 오는 응답에서는 여전히 루프를 잘못 끊습니다.
3. **오답** - 반복 상한은 폭주를 막는 안전장치로는 쓸 수 있지만, "텍스트 응답 두 번 연속" 같은 휴리스틱은 정당한 다단계 작업을 중간에 끊을 수 있고 여전히 `stop_reason` 을 무시합니다.
4. **오답** - 결정적인 프로토콜 필드가 이미 답을 주는데 분류기로 자연어를 다시 추론하는 것은 과잉 설계입니다. 분류기 자체도 확률적이라 오판을 없애지 못합니다.

> 💡 **시험 포인트:** 루프 제어는 항상 `stop_reason` 으로 합니다(`tool_use` → 도구 실행 후 계속, `end_turn` → 종료). 문구 매칭·의도 분류·응답 횟수 휴리스틱으로 종료를 판단하는 보기는 오답입니다. 실무에서는 `max_tokens`, `pause_turn`, `refusal` 같은 다른 값도 따로 처리합니다.

---

## 문제 2
### **[Scenario: Customer Support Resolution Agent] When the support agent invokes escalate_to_human, human agents report they must re-read the entire raw conversation to understand each case, and average handle time for escalated tickets has risen. What should the agent do at the moment of escalation to fix this?**

| 보기 | 설명 |
|------|------|
| 1. Attach the full untrimmed transcript of the conversation so the human agent has every message available to read. | |
| **2. Generate a structured handoff summary: issue, verified identifiers, tool results, actions attempted, and recommended next step.** | |
| 3. Escalate earlier in ambiguous cases so humans receive tickets before much conversation has accumulated, instead of waiting for the agent to try more tools. | |
| 4. Enable extended thinking on the escalation turn so the model reasons longer about the case before handing it off. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

지원 에이전트가 `escalate_to_human` 을 호출하면, 사람 상담원들은 각 건을 파악하려고 원본 대화 전체를 다시 읽어야 한다고 말하고, 에스컬레이션된 티켓의 평균 처리 시간도 늘어났습니다. 이 문제를 해결하려면 에이전트가 에스컬레이션 시점에 무엇을 해야 할까요?

- **①** 사람 상담원이 모든 메시지를 읽을 수 있도록, 잘라 내지 않은 대화 전체 기록을 첨부한다
- **②** 문제 내용, 확인된 식별자, 도구 결과, 시도한 조치, 권장 다음 단계를 담은 구조화된 핸드오프 요약을 생성한다
- **③** 에이전트가 도구를 더 시도하기를 기다리지 말고, 모호한 건은 더 일찍 에스컬레이션해 대화가 많이 쌓이기 전에 사람이 티켓을 받게 한다
- **④** 에스컬레이션 턴에 확장 사고(extended thinking)를 켜서, 모델이 건을 넘기기 전에 더 오래 추론하게 한다

> **핵심 진단:** 핸드오프의 목적은 사람이 *대화를 다시 읽지 않고* 바로 다음 조치를 결정하게 하는 것입니다. 그러려면 에이전트가 에스컬레이션 시점에 지금까지 파악한 내용을 사람이 필요한 순서대로 압축한 **구조화된 핸드오프 요약** 을 만들어 `escalate_to_human` 에 함께 넘겨야 합니다. 원본 대화 곳곳에 흩어진 고객 식별자, 도구 결과, 이미 시도한 조치를 정해진 필드로 앞에 배치하면, 상담원은 짧은 시간 안에 사건을 파악하고 같은 확인 절차를 반복하지 않습니다.

```json
{
  "issue": "동일 주문 이중 결제, 1건 환불 요청",
  "verified_ids": {"customer_id": "C-88213", "order_id": "O-55107"},
  "tool_results": {"lookup_order": "결제 2건 확인, 각 $129.00"},
  "actions_attempted": ["process_refund 시도: 권한 한도로 거절"],
  "recommended_next_step": "중복 결제 1건 수동 환불 승인",
  "customer_expectation": "영업일 3일 내 환불"
}
```

원본 대화 기록은 필요할 때 열어 볼 수 있게 링크로 남겨 둘 수 있지만, 상담원이 *먼저* 읽는 것은 이 요약이어야 합니다.

1. **오답** - 전체 대화 원문을 그대로 붙이는 것이 바로 지금의 문제 상황입니다. 정보는 모두 들어 있지만 사건을 재구성하는 일을 사람에게 떠넘기므로 처리 시간이 줄지 않습니다.
2. **정답** - 문제, 확인된 식별자, 도구 결과, 시도한 조치, 권장 다음 단계를 정해진 구조로 앞에 배치하면 상담원이 대화를 다시 읽지 않고 바로 판단하고 조치할 수 있습니다. 재독 부담과 평균 처리 시간이 함께 줄어듭니다.
3. **오답** - 일찍 넘기면 쌓이는 대화량은 줄겠지만 티켓이 *언제* 도착하는지만 바뀔 뿐, 사람에게 필요한 정보가 정리되어 전달되지 않는 근본 문제는 그대로입니다. 에이전트가 스스로 해결할 수 있던 건까지 넘기게 되어 첫 응대 해결률(first-contact resolution)도 떨어질 수 있습니다.
4. **오답** - 확장 사고는 모델 *자신의* 추론 품질을 높일 뿐, 사람 상담원이 읽을 산출물을 만들어 주지 않습니다. 추론이 아무리 좋아도 핸드오프에 담기지 않으면 상담원은 여전히 원문을 읽어야 합니다.

> 💡 **시험 포인트:** 에스컬레이션 문제에서 '사람이 다시 읽어야 한다', '처리 시간이 늘었다'는 신호가 보이면 구조화된 핸드오프 요약(이슈, 확인된 식별자, 시도한 조치, 권장 다음 단계)이 정답입니다. 원문 덤프, 에스컬레이션 시점 조정, 모델 추론 강화는 사람에게 전달되는 정보의 형태를 바꾸지 못합니다.

---

## 문제 3
### **[Scenario: Customer Support Resolution Agent] Company policy states that any refund above $500 must be approved by a manager rather than auto-issued. The support agent, however, has autonomously called process_refund for amounts over $500 in several audited cases. What is the best way to guarantee the policy holds?**

| 보기 | 설명 |
|------|------|
| 1. Add a line to the system prompt telling the agent to always escalate refunds over $500 instead of processing them directly. | |
| 2. Remove process_refund from the agent's toolset entirely so that every refund, large or small, is handled by a human. | |
| **3. Add a PreToolUse hook on process_refund that blocks any amount over $500 and redirects the flow to escalate_to_human.** | |
| 4. Fine-tune the model on historical tickets so it learns the $500 threshold from past manager approvals and applies it. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

회사 정책에 따르면 $500 초과 환불은 자동으로 지급하지 않고 반드시 관리자 승인을 받아야 합니다. 그런데 감사한 사례 중 여러 건에서 지원 에이전트가 $500 초과 금액에 대해 스스로 `process_refund` 를 호출했습니다. 이 정책이 반드시 지켜지도록 보장하는 가장 좋은 방법은 무엇일까요?

- **①** $500 초과 환불은 직접 처리하지 말고 항상 에스컬레이션하라는 문장을 시스템 프롬프트에 추가한다
- **②** 에이전트의 도구 목록에서 `process_refund` 를 완전히 제거해, 금액과 관계없이 모든 환불을 사람이 처리하게 한다
- **③** `process_refund` 에 PreToolUse 훅을 추가해 $500 초과 금액을 차단하고 흐름을 `escalate_to_human` 으로 돌린다
- **④** 과거 티켓으로 모델을 파인튜닝해, 과거 관리자 승인 사례에서 $500 기준을 학습해 적용하게 한다

> **핵심 진단:** '절대 일어나면 안 되는' 정책 위반은 모델의 판단에 맡기지 말고, 도구가 실행되기 *전에* 코드로 가로채 결정적으로 막아야 합니다. Agent SDK의 `PreToolUse` 훅은 도구 호출 요청마다 실행되어 `tool_input` 을 검사할 수 있고, `permissionDecision` 으로 `"deny"` 를 반환하면 호출 자체가 실행되지 않습니다. 이때 `permissionDecisionReason` 은 Claude에게 전달되므로, 거부 사유에 '관리자 승인이 필요하니 `escalate_to_human` 으로 넘기라'고 적어 두면 모델이 에스컬레이션 경로로 전환합니다. 모델이 무엇을 결정하든 $500 한도는 하네스 수준에서 강제됩니다.

```python
async def refund_limit(input_data, tool_use_id, context):
    if input_data["tool_input"].get("amount", 0) > 500:
        return {"hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": "Refunds over $500 need manager approval. Use escalate_to_human.",
        }}
    return {}  # 한도 이하는 그대로 통과

options = ClaudeAgentOptions(hooks={
    "PreToolUse": [HookMatcher(matcher="mcp__support__process_refund", hooks=[refund_limit])]
})
```

매처는 도구 이름만 비교하므로 금액 같은 인수 조건은 콜백 안에서 `tool_input` 으로 검사합니다. MCP 도구 이름은 `mcp__<서버>__<도구>` 형식으로 매칭합니다.

1. **오답** - 시스템 프롬프트 지시는 모델이 따를 가능성을 높일 뿐인 권고입니다. 감사에서 드러난 위반처럼 프롬프트만으로는 한도를 넘는 호출을 막을 수 없으므로 '반드시'를 보장하지 못합니다.
2. **오답** - 도구를 없애면 위반은 사라지지만 $500 이하의 정상적인 자동 환불까지 모두 사람에게 넘어가, 자동화의 가치와 첫 응대 해결률이 크게 떨어집니다. 필요한 것은 한도를 넘는 호출만 골라 막는 것입니다.
3. **정답** - PreToolUse 훅은 `process_refund` 가 실행되기 전에 금액을 검사해 $500 초과 호출을 코드 수준에서 거부하고, 거부 사유로 모델을 `escalate_to_human` 으로 이끕니다. 한도 이하 환불은 그대로 자동 처리되므로 정책 준수와 자동화를 함께 지킵니다.
4. **오답** - 파인튜닝은 비용과 시간이 많이 들고, 학습된 결과도 여전히 확률적이라 한도를 *절대* 넘지 않는다고 보장할 수 없습니다. 정책 기준이 바뀔 때마다 다시 학습해야 하는 부담도 있습니다.

> 💡 **시험 포인트:** '반드시', '절대', '보장' 같은 표현이 금액 한도나 승인 절차와 함께 나오면 프롬프트나 파인튜닝이 아니라 PreToolUse 훅 같은 프로그래밍적 강제가 정답입니다. 도구 제거처럼 정상 흐름까지 막는 과잉 조치도 오답입니다.

---

## 문제 4
### **[Scenario: Customer Support Resolution Agent] get_customer and lookup_order call two different backend systems that return dates in different formats (ISO vs. US) and amounts with inconsistent currency notation. Logs show the model occasionally misreads these heterogeneous fields, e.g., treating a refund amount in the wrong units. What is the most robust remedy?**

| 보기 | 설명 |
|------|------|
| 1. Instruct the model in the system prompt to normalize all dates and currency values before it reasons about them. | |
| 2. Increase the context window so the model has more room to keep the varied date and currency formats straight. | |
| 3. Spin up a dedicated formatting subagent that the coordinator calls after every backend lookup to rewrite the raw fields. | |
| **4. Add a PostToolUse hook that normalizes each tool's raw output into one canonical schema before it enters the context.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

`get_customer` 와 `lookup_order` 는 서로 다른 두 백엔드 시스템을 호출하는데, 두 시스템은 날짜를 서로 다른 형식(ISO와 미국식)으로 반환하고 금액의 통화 표기도 일관되지 않습니다. 로그를 보면 모델이 이런 이질적인 필드를 가끔 잘못 읽어, 예를 들어 환불 금액을 잘못된 단위로 해석합니다. 가장 견고한 해결책은 무엇일까요?

- **①** 모델이 추론하기 전에 모든 날짜와 통화 값을 정규화하도록 시스템 프롬프트에 지시한다
- **②** 컨텍스트 창을 늘려, 모델이 다양한 날짜·통화 형식을 헷갈리지 않고 유지할 여유를 준다
- **③** 백엔드 조회가 끝날 때마다 코디네이터가 호출해 원본 필드를 다시 쓰게 하는 전용 포맷팅 서브에이전트를 띄운다
- **④** 각 도구의 원본 출력을 컨텍스트에 들어가기 전에 하나의 표준 스키마로 정규화하는 PostToolUse 훅을 추가한다

> **핵심 진단:** 형식이 섞인 데이터를 모델에게 *해석하라고* 맡기면 그 해석 자체가 오류의 원천이 됩니다. 결정적인 해법은 도구 결과가 모델에게 도달하기 **전에** 코드로 변환해, 모델이 언제나 같은 스키마(예: ISO 8601 날짜, 최소 단위 정수 금액과 통화 코드)만 보게 하는 것입니다. Agent SDK의 `PostToolUse` 훅은 도구가 실행된 직후에 실행되며, `updatedToolOutput` 을 반환하면 Claude가 보는 도구 출력을 교체할 수 있습니다. 변환 규칙이 코드로 한 번 정의되므로 모든 호출에 똑같이 적용됩니다.

```python
async def normalize(input_data, tool_use_id, context):
    raw = input_data["tool_response"]   # 백엔드가 돌려준 원본
    canonical = to_canonical(raw)       # 날짜 → "2026-03-14", 금액 → {"amount_minor": 64000, "currency": "USD"}
    return {"hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "updatedToolOutput": canonical,
    }}

options = ClaudeAgentOptions(hooks={
    "PostToolUse": [HookMatcher(matcher="mcp__support__get_customer|mcp__support__lookup_order", hooks=[normalize])]
})
```

`updatedToolOutput` 은 Claude가 보는 결과만 바꾸고 이미 끝난 도구 실행에는 영향을 주지 않습니다. 호출을 막거나 입력을 고치는 일은 `PreToolUse` 훅의 몫입니다.

1. **오답** - 프롬프트로 정규화를 지시해도 정규화는 여전히 모델이 하는 *추론* 입니다. 지금 오독을 일으키는 바로 그 확률적 해석을 그대로 맡기는 셈이라 오류가 사라지지 않습니다.
2. **오답** - 컨텍스트 창 크기는 담을 수 있는 *분량* 의 문제이지 형식 불일치나 단위 혼동과는 관계가 없습니다. 데이터는 이미 컨텍스트 안에 들어와 있고, 문제는 그것을 잘못 읽는 데 있습니다.
3. **오답** - 포맷팅 서브에이전트도 결국 모델이 변환하므로 확률적이고, 조회할 때마다 추가 왕복과 오케스트레이션 비용이 붙습니다. 코드로 한 번 정의하면 되는 결정적 변환에 LLM 호출을 쓰는 과잉 설계입니다.
4. **정답** - PostToolUse 훅은 도구 출력이 컨텍스트에 들어가기 전에 코드로 날짜·통화 형식을 하나의 표준 스키마로 바꿉니다. 모델은 항상 일관된 값만 보게 되어 단위 혼동의 원인이 결정적으로 제거됩니다.

> 💡 **시험 포인트:** 도구 *출력* 의 변환·정규화·정제는 `PostToolUse` 훅, 도구 *호출* 의 차단·정책 강제·입력 수정은 `PreToolUse` 훅으로 구분합니다. '형식이 섞여 모델이 잘못 읽는다'는 신호에는 프롬프트 지시나 컨텍스트 창 확대가 아니라 코드 기반 정규화가 정답입니다.

---

## 문제 5
### **[Scenario: Customer Support Resolution Agent] The coordinator has already run get_customer and confirmed the account, then spawns subagents to check order history and refund eligibility in parallel. Those subagents return results that contradict the confirmed account — some even re-run get_customer and pick a different customer match. What is the correct fix?**

| 보기 | 설명 |
|------|------|
| **1. Put the confirmed customer record and identifiers explicitly in each subagent's Task prompt, since subagents do not inherit the coordinator's context.** | |
| 2. Store the confirmed customer record in a global variable that the SDK automatically injects into every spawned subagent's context at startup. | |
| 3. Instruct each subagent to call get_customer itself at the start so that it independently establishes and verifies the account before it does any order work. | |
| 4. Enlarge the shared context window across the coordinator and its subagents so they can read the coordinator's earlier turns directly. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

코디네이터가 이미 `get_customer` 를 실행해 계정을 확인한 뒤, 주문 이력과 환불 자격을 병렬로 확인하는 서브에이전트들을 생성합니다. 그런데 이 서브에이전트들이 확인된 계정과 모순되는 결과를 돌려주고, 일부는 `get_customer` 를 다시 실행해 다른 고객과 매칭하기까지 합니다. 올바른 해결책은 무엇일까요?

- **①** 서브에이전트는 코디네이터의 컨텍스트를 상속하지 않으므로, 확인된 고객 레코드와 식별자를 각 서브에이전트의 `Task` 프롬프트에 명시적으로 넣는다
- **②** 확인된 고객 레코드를 전역 변수에 저장해, SDK가 생성되는 모든 서브에이전트의 컨텍스트에 시작 시점에 자동으로 주입하게 한다
- **③** 각 서브에이전트가 시작할 때 직접 `get_customer` 를 호출하게 해, 주문 작업을 하기 전에 스스로 계정을 확인하고 검증하게 한다
- **④** 코디네이터와 서브에이전트가 공유하는 컨텍스트 창을 키워, 서브에이전트가 코디네이터의 이전 턴을 직접 읽을 수 있게 한다

> **핵심 진단:** 서브에이전트는 코디네이터의 대화를 이어받지 않고 **새로운 독립 컨텍스트** 에서 시작합니다. 자기 시스템 프롬프트, 프로젝트 CLAUDE.md, 도구 정의는 받지만 부모의 대화 기록과 도구 결과는 받지 않으며, 공식 문서 기준으로 부모가 서브에이전트에게 넘길 수 있는 내용은 위임 도구의 프롬프트 문자열뿐입니다. 따라서 코디네이터가 이미 확인한 고객 레코드와 식별자는 위임 프롬프트에 명시적으로 적어야 합니다. 그렇지 않으면 서브에이전트는 계정을 모르는 상태에서 스스로 다시 조회하다가 다른 고객과 매칭하게 됩니다.

```text
[확인된 고객: 다시 조회하지 말 것]
customer_id: C-88213 (이메일과 주문 번호로 검증 완료)
name: Maria Garcia / email: m.garcia@example.com

[작업]
이 고객의 최근 90일 주문 이력을 lookup_order로 확인하고,
환불 대상 주문 id와 근거만 요약해 돌려줄 것.
```

Agent SDK와 Claude Code에서 이 위임 도구의 현재 이름은 `Agent` 입니다(이전 이름 `Task`). 대화 전체를 복사해 넘기는 포크(fork)는 별도 기능이며, '자동 상속이 없다'는 원칙은 일반 서브에이전트에 대한 것입니다.

1. **정답** - 서브에이전트가 부모에게서 받는 것은 위임 프롬프트뿐이므로, 확인된 고객 레코드와 식별자를 거기에 명시하면 모든 서브에이전트가 같은 계정을 기준으로 일합니다. 모순된 결과와 중복 조회가 함께 사라집니다.
2. **오답** - SDK에는 전역 변수를 모든 서브에이전트 컨텍스트에 자동 주입하는 기능이 없습니다. 그럴듯하게 들리지만 존재하지 않는 기능을 전제로 한 함정입니다.
3. **오답** - 서브에이전트마다 `get_customer` 를 다시 부르게 하는 것이 바로 서로 다른 고객과 매칭되는 지금 증상의 원인입니다. 이미 확인된 결과를 버리고 같은 조회를 중복 실행하므로 비용도 늘어납니다.
4. **오답** - 코디네이터와 서브에이전트는 각자 별도의 컨텍스트 창을 쓰므로 키울 '공유 컨텍스트 창' 자체가 없습니다. 허브 앤 스포크 구조를 잘못 이해한 설명입니다.

> 💡 **시험 포인트:** 서브에이전트에게 필요한 사실(확인된 식별자, 이전 결과, 결정 사항)은 위임 프롬프트에 명시적으로 넣어야 합니다. '자동 상속', '전역 변수·공유 메모리', '공유 컨텍스트 창'을 전제로 한 보기는 오답입니다.

---

## 문제 6
### **[Scenario: Customer Support Resolution Agent] process_refund handles both full order refunds and small partial goodwill credits. Logs show the agent issues full refunds when only a partial credit was warranted in 17% of cases because it cannot tell from the single tool which behavior it is invoking. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Enlarge the context window so the full refund policy document can sit next to the conversation and guide each call. | |
| **2. Split process_refund into process_full_refund and process_partial_credit, each with its own description stating exactly when to use it.** | |
| 3. Add three few-shot partial-credit conversations to the system prompt and keep the single process_refund tool unchanged. | |
| 4. Set tool_choice to "any" so the model must select a tool on every refund turn and cannot answer without calling one. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

`process_refund` 는 주문 전액 환불과 소액 부분 호의 크레딧(goodwill credit)을 모두 처리합니다. 로그를 보면 에이전트가 하나의 도구만으로는 자신이 어떤 동작을 호출하는지 구분하지 못해, 부분 크레딧이면 충분했던 경우의 17%에서 전액 환불을 처리합니다. 가장 좋은 해결책은 무엇일까요?

- **①** 컨텍스트 창을 키워 전체 환불 정책 문서를 대화 옆에 두고, 매 호출을 안내하게 한다
- **②** `process_refund` 를 `process_full_refund` 와 `process_partial_credit` 로 나누고, 각 도구의 description에 언제 써야 하는지 정확히 적는다
- **③** 부분 크레딧 대화 세 개를 few-shot 예시로 시스템 프롬프트에 넣고, 단일 `process_refund` 도구는 그대로 둔다
- **④** `tool_choice` 를 `"any"` 로 설정해, 모델이 환불 턴마다 반드시 도구를 선택하고 도구 호출 없이 답하지 못하게 한다

> **핵심 진단:** 모델은 도구의 이름, description, 입력 스키마를 보고 어떤 도구를 부를지 결정합니다. 하나의 `process_refund` 가 성격이 다른 두 동작(전액 환불, 부분 크레딧)을 구분 없이 떠안고 있으면, 호출 시점에 모델이 자신의 의도를 표현할 수단이 없어 오분류가 생깁니다. 두 동작을 별도 이름의 도구로 나누고 각 description에 '언제 쓰고 언제 쓰지 말아야 하는지'를 적으면, 도구 선택 자체가 명시적인 결정이 됩니다.

```json
{"name": "process_partial_credit",
 "description": "Issue a small goodwill credit (not a refund) when the customer keeps the order but had a minor issue such as a late delivery. Do NOT use for returned or undelivered orders; use process_full_refund instead."}
```

공식 문서는 관련 동작을 `action` 파라미터 하나로 묶어 도구 수를 줄이는 방식도 권장합니다. 핵심은 '분리' 자체보다, 두 동작의 경계를 도구 이름이나 명시적인 파라미터와 description으로 인터페이스에 드러내는 데 있습니다.

1. **오답** - 정책 문서를 더 넣어도 도구 인터페이스는 여전히 구분되지 않은 하나의 동작만 노출합니다. 모델이 정책을 이해하더라도 호출 시점에 그 의도를 표현할 방법이 없어 같은 오분류가 반복됩니다.
2. **정답** - 도구를 동작별로 나누고 description에 사용 경계를 명시하면, 모델이 도구를 *고르는* 순간 전액 환불인지 부분 크레딧인지가 정해집니다. 모호함이 인터페이스 수준에서 사라집니다.
3. **오답** - few-shot 예시는 어느 정도 도움이 되지만, 도구가 여전히 하나의 뭉뚱그린 동작만 노출하므로 근본 원인을 고치지 못합니다. 예시와 다른 상황에서는 다시 오분류가 생깁니다.
4. **오답** - `tool_choice` 의 `any` 는 '제공된 도구 중 하나는 반드시 호출'하게 할 뿐, *어떤* 환불 동작을 고를지는 바꾸지 않습니다. 도구가 하나뿐이면 오히려 모든 환불 턴에서 같은 모호한 도구를 강제로 부르게 됩니다.

> 💡 **시험 포인트:** 한 도구가 서로 다른 동작을 뭉뚱그려 오용이 생기면, 도구를 분리하고(또는 동작을 명시하는 파라미터를 두고) description에 경계를 적는 것이 정답입니다. `tool_choice` 는 도구를 부를지, 어떤 도구를 강제할지를 정할 뿐 선택의 모호함을 해결하지 못합니다.

---

## 문제 7
### **[Scenario: Customer Support Resolution Agent] When the customer database is briefly unreachable, get_customer returns a plain empty result, and the agent tells the customer "I can't find any account with that information" and closes the case. Real accounts are being turned away during transient outages. What should the MCP tool return instead?**

| 보기 | 설명 |
|------|------|
| 1. Retry get_customer automatically in a tight loop until the database answers, with no upper bound on attempts or backoff delay. | |
| 2. Raise the get_customer connection timeout so slow database responses are no longer cut off in the middle of a request. | |
| **3. A structured error with errorCategory (e.g. transient) and isRetryable, so an access failure differs from an empty result.** | |
| 4. Treat every unsuccessful get_customer response, whatever its cause, as an escalation trigger and route all of them to escalate_to_human. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

고객 데이터베이스에 잠시 접속할 수 없을 때 `get_customer` 가 그냥 빈 결과를 반환하면, 에이전트는 고객에게 "I can't find any account with that information"(해당 정보로는 계정을 찾을 수 없습니다)이라고 말하고 케이스를 종료합니다. 일시적인 장애 동안 실제 계정이 있는 고객들이 돌려보내지고 있습니다. MCP 도구는 대신 무엇을 반환해야 할까요?

- **①** 데이터베이스가 응답할 때까지 시도 횟수 상한이나 백오프 지연 없이 `get_customer` 를 촘촘한 루프로 자동 재시도한다
- **②** `get_customer` 의 연결 타임아웃을 늘려, 느린 데이터베이스 응답이 요청 도중에 끊기지 않게 한다
- **③** `errorCategory`(예: `transient`)와 `isRetryable` 을 담은 구조화된 오류를 반환해, 접근 실패가 빈 결과와 구분되게 한다
- **④** 원인과 관계없이 실패한 `get_customer` 응답을 모두 에스컬레이션 트리거로 보고, 전부 `escalate_to_human` 으로 보낸다

> **핵심 진단:** 근본 원인은 '조회에 실패했다'는 사실이 '조회는 성공했지만 일치하는 고객이 없다'는 정상 결과와 똑같은 모양으로 전달된다는 점입니다. 에이전트는 받은 결과만 보고 판단하므로, 두 상황을 구분할 정보가 없으면 '계정 없음'으로 결론 내릴 수밖에 없습니다. MCP 공식 스펙은 API 실패 같은 도구 실행 오류를 `isError: true` 인 결과로 보고하도록 정하고 있으며, 그 내용에 오류 종류와 재시도 가능 여부를 구조화해 담으면 에이전트가 '잠시 후 재시도하거나 고객에게 장애를 안내한다'는 올바른 분기를 탈 수 있습니다.

```text
일치 고객 없음 → isError: false, 내용 {"matches": []}
DB 접속 실패   → isError: true,  내용 {"errorCategory": "transient", "isRetryable": true,
                                       "message": "customer DB unreachable"}
```

`errorCategory`, `isRetryable` 은 MCP 공식 필드가 아니라 오류 내용에 담는 구조화 관례입니다. 공식 스펙이 정한 것은 실행 오류를 `isError: true` 결과로 돌려주는 부분입니다.

1. **오답** - 상한 없는 무한 재시도는 장애 중인 DB에 부하만 더하고, 끝내 실패하면 같은 빈 결과로 돌아갑니다. '조회 실패'와 '고객 없음'을 구분할 의미 정보가 여전히 없습니다.
2. **오답** - 타임아웃을 늘리면 느린 응답 일부는 살릴 수 있지만, DB에 실제로 접속할 수 없을 때는 여전히 실패하고 그 실패가 빈 결과로 위장되는 근본 문제는 그대로입니다.
3. **정답** - 실패를 `isError` 결과로 돌려주고 그 안에 `errorCategory`(일시 장애)와 `isRetryable` 을 담으면, 에이전트가 접근 실패를 '계정 없음'과 구분해 재시도하거나 고객에게 장애 상황을 안내할 수 있습니다. 실제 계정이 돌려보내지는 일이 사라집니다.
4. **오답** - 모든 실패를 사람에게 넘기면 입력 검증 오류나 정상적인 비즈니스 결과까지 인프라 장애와 똑같이 취급해 과잉 에스컬레이션이 됩니다. 잠시 뒤 재시도하면 풀릴 일시 장애까지 사람이 떠안아 해결률 목표가 무너집니다.

> 💡 **시험 포인트:** 도구가 실패를 빈 결과나 성공처럼 숨기면 에이전트는 잘못된 결론을 내립니다. '접근 실패'와 '결과 없음'을 구분하는 구조화된 오류(`isError` 와 오류 종류·재시도 가능 여부)를 고르고, 무한 재시도·타임아웃 조정·일괄 에스컬레이션은 오답으로 봅니다.

---

## 문제 8
### **[Scenario: Customer Support Resolution Agent] For refunds above the agent's $500 authority, process_refund correctly declines, but it returns a generic isError response. Logs show the agent then retries the same $640 refund three times before eventually giving a confusing reply. How should the tool signal this condition?**

| 보기 | 설명 |
|------|------|
| 1. Have the agent retry with exponential backoff, since repeated attempts eventually succeed for most declined refunds in the logs. | |
| 2. Raise the agent's refund authority limit above $640 in the tool configuration so that the call no longer fails. | |
| 3. Instruct the agent in the system prompt to never retry a refund more than once and to apologize to the customer instead. | |
| **4. Return errorCategory "business" with isRetryable false so the agent stops retrying and escalates through escalate_to_human.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

에이전트의 환불 권한($500)을 넘는 환불에 대해 `process_refund` 는 올바르게 거절하지만, 구분 없는 일반 `isError` 응답을 반환합니다. 로그를 보면 에이전트는 같은 $640 환불을 세 번 재시도한 끝에 결국 혼란스러운 답변을 내놓습니다. 도구는 이 상황을 어떻게 알려야 할까요?

- **①** 로그상 거절된 환불 대부분이 반복 시도하면 결국 성공하므로, 에이전트가 지수 백오프로 재시도하게 한다
- **②** 도구 설정에서 에이전트의 환불 권한 한도를 $640보다 높게 올려, 호출이 더 이상 실패하지 않게 한다
- **③** 시스템 프롬프트에서 에이전트에게 환불을 한 번 넘게 재시도하지 말고 대신 고객에게 사과하라고 지시한다
- **④** `errorCategory` 를 `"business"` 로, `isRetryable` 을 `false` 로 반환해 에이전트가 재시도를 멈추고 `escalate_to_human` 으로 에스컬레이션하게 한다

> **핵심 진단:** 권한 한도 초과 거절은 몇 번을 다시 시도해도 결과가 바뀌지 않는 **비즈니스 규칙 오류** 입니다. 그런데 도구가 아무 구분 없는 `isError` 만 돌려주면, 에이전트는 이것이 일시 장애인지 영구 거절인지 알 수 없어 가장 흔한 대응인 재시도를 택합니다. 오류 내용에 `errorCategory: "business"` 와 `isRetryable: false` 를 담고 다음 조치(관리자 승인 필요)까지 적어 주면, 에이전트가 재시도를 멈추고 `escalate_to_human` 으로 넘기는 결정을 확실하게 내릴 수 있습니다.

```text
isError: true
내용 {"errorCategory": "business", "isRetryable": false,
      "message": "Refund $640 exceeds agent limit $500; manager approval required",
      "suggested_action": "escalate_to_human"}
```

MCP 스펙도 비즈니스 로직 오류를 API 실패와 함께 `isError: true` 로 보고하는 도구 실행 오류로 분류합니다. 같은 `isError` 안에서 일시 장애(`transient`), 입력 검증(`validation`), 비즈니스 규칙(`business`), 권한(`permission`)을 나눠 주는 것이 이 시험 가이드가 말하는 구조화 오류 응답 관례입니다.

1. **오답** - 지수 백오프는 일시 장애를 위한 재시도 전략입니다. 정책 한도는 시간이 지나도 바뀌지 않으므로 호출만 낭비하고 성공하지 못하며, '재시도하면 대부분 성공한다'는 전제도 영구 거절에는 성립하지 않습니다.
2. **오답** - 한도를 올리는 것은 오류를 처리하는 것이 아니라 비즈니스가 의도적으로 둔 통제를 없애는 것입니다. 더 큰 금액이 오면 같은 문제가 반복되고 관리자 승인 정책도 무너집니다.
3. **오답** - 프롬프트로 재시도 횟수를 제한해도 오류 자체는 여전히 재시도 가능한 오류와 구분되지 않습니다. 에이전트가 올바른 다음 조치(에스컬레이션)를 알 수 없어 사과만 하고 끝내는, 취약하고 불완전한 대응이 됩니다.
4. **정답** - `errorCategory` 를 `business` 로, `isRetryable` 을 `false` 로 명시하면 에이전트가 이 거절이 영구적임을 프로그램적으로 알 수 있습니다. 재시도를 멈추고 관리자 승인을 위해 `escalate_to_human` 으로 넘기는 올바른 흐름이 만들어집니다.

> 💡 **시험 포인트:** 오류 응답 문제에서는 오류 종류(transient, validation, business, permission)와 재시도 가능 여부를 구조화해 돌려주는 보기가 정답입니다. 비즈니스 규칙 위반은 `isRetryable: false` 로 표시해 재시도 대신 에스컬레이션하게 하고, 백오프·한도 상향·프롬프트 패치는 오답입니다.

---

## 문제 9
### **[Scenario: Customer Support Resolution Agent] In longer billing-dispute conversations, the agent uses progressive summarization to keep the history compact. Testers find that after several turns it quotes the wrong refund amount and an incorrect order date, even though those values appeared earlier. What is the best remedy?**

| 보기 | 설명 |
|------|------|
| **1. Keep a persistent case-facts block (order id, amount, dates) outside the summary and re-inject it verbatim each turn.** | |
| 2. Switch to a model with a larger context window so the conversation never needs summarizing and every earlier turn stays intact. | |
| 3. Call get_customer and lookup_order again on every turn to refetch the numbers, then overwrite the stored summary with the fresh results. | |
| 4. Enable extended thinking with a larger thinking budget so the model reasons more carefully before quoting any refund figure. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

청구 분쟁처럼 대화가 길어지면, 에이전트는 기록을 간결하게 유지하려고 점진적 요약(progressive summarization)을 사용합니다. 테스터들은 몇 턴이 지나면 에이전트가 앞에서 분명히 나왔던 환불 금액과 주문 날짜를 틀리게 말한다는 것을 발견했습니다. 가장 좋은 해결책은 무엇일까요?

- **①** 주문 id, 금액, 날짜를 담은 영구적인 케이스 사실(case-facts) 블록을 요약 밖에 따로 두고, 매 턴 원문 그대로 다시 주입한다
- **②** 더 큰 컨텍스트 창을 가진 모델로 바꿔 대화를 요약할 필요가 없게 하고, 이전 턴을 모두 그대로 유지한다
- **③** 매 턴 `get_customer` 와 `lookup_order` 를 다시 호출해 숫자를 새로 가져온 뒤, 저장된 요약을 새 결과로 덮어쓴다
- **④** 더 큰 thinking 예산으로 확장 사고(extended thinking)를 켜서, 모델이 환불 금액을 인용하기 전에 더 신중하게 추론하게 한다

> **핵심 진단:** 요약은 본질적으로 *손실 압축* 입니다. 여러 턴을 문장으로 줄이는 과정에서 '$127.50', '3월 14일 주문' 같은 정확한 값은 '환불 금액', '지난달 주문'처럼 뭉개지거나 다른 값과 섞이기 쉽습니다. 정확해야 하는 사실은 요약 대상에서 빼서 **구조화된 케이스 사실 블록** 으로 따로 보관하고, 매 턴 프롬프트에 원문 그대로 다시 넣어야 합니다. 그러면 대화 서술은 얼마든지 요약해도 금액·날짜·주문 id는 변하지 않습니다.

```text
<case_facts>  (요약 대상 아님, 매 턴 그대로 주입)
order_id: O-55107
disputed_amount: USD 127.50
order_date: 2026-03-14
customer_expectation: 영업일 5일 내 카드 환불
</case_facts>
<conversation_summary> ...점진적 요약... </conversation_summary>
```

사실 블록은 모델이 아니라 코드가 도구 결과에서 값을 뽑아 갱신하게 하면, 요약 단계의 오류가 사실 블록으로 번지는 것까지 막을 수 있습니다.

1. **정답** - 정확한 값을 요약 흐름 밖의 사실 블록에 두고 매 턴 그대로 다시 넣으면, 요약이 몇 번 반복되어도 금액·날짜·주문 id가 바뀌지 않습니다. 손실 압축이 일어나는 경로에서 핵심 사실을 아예 분리하는 구조적 해법입니다.
2. **오답** - 컨텍스트 창이 커지면 요약이 필요한 시점이 늦춰질 뿐, 대화가 충분히 길어지면 같은 정보 손실이 다시 생깁니다. 특정 필드를 보호하는 장치도 아닙니다.
3. **오답** - 매 턴 도구를 다시 부르면 지연·비용·오류 가능성이 턴마다 늘고, 새 값도 다시 요약에 섞이면 결국 같은 압축 손실을 겪습니다. 고객이 대화 중에 밝힌 기대 사항처럼 도구로 다시 가져올 수 없는 사실도 보호하지 못합니다.
4. **오답** - 확장 사고는 추론 과정을 개선할 뿐, 요약 과정에서 이미 컨텍스트에서 사라진 정확한 값을 되살리지 못합니다. 없는 정보는 더 오래 생각해도 복원되지 않습니다.

> 💡 **시험 포인트:** 요약 뒤에 숫자·날짜·기대 사항이 틀어진다는 신호가 보이면, 그 사실을 요약 밖의 구조화된 블록에 두고 그대로 다시 주입하는 보기가 정답입니다. 더 큰 컨텍스트 창, 확장 사고, 매 턴 재조회는 손실 압축이라는 원인을 건드리지 못합니다.

---

## 문제 10
### **[Scenario: Customer Support Resolution Agent] A customer gives only the name "Maria Garcia." get_customer returns three distinct matching accounts. Logs show the agent proceeds with the most recently active match, and in several cases it has processed refunds against the wrong customer's order. What is the correct behavior?**

| 보기 | 설명 |
|------|------|
| 1. Continue with the most recently active of the three accounts, since recent activity makes it the most likely current customer. | |
| **2. Ask for an extra identifier (order number, email, or ZIP) to disambiguate before taking any account action.** | |
| 3. Escalate every multiple-match case straight to a human agent, because the agent cannot safely resolve duplicate names. | |
| 4. Pick the match with the highest fuzzy name-similarity score and proceed, logging the confidence value for audit. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

고객이 "Maria Garcia"라는 이름만 알려 줍니다. `get_customer` 는 일치하는 서로 다른 계정 세 개를 반환합니다. 로그를 보면 에이전트는 가장 최근에 활동한 계정으로 진행하고, 여러 건에서 엉뚱한 고객의 주문에 환불을 처리했습니다. 올바른 동작은 무엇일까요?

- **①** 최근 활동이 있으면 현재 고객일 가능성이 가장 높으므로, 세 계정 중 가장 최근에 활동한 계정으로 계속 진행한다
- **②** 계정 관련 조치를 하기 전에 추가 식별자(주문 번호, 이메일, ZIP 코드)를 요청해 대상을 확정한다
- **③** 에이전트는 동명이인을 안전하게 구분할 수 없으므로, 여러 계정이 일치하는 경우는 모두 바로 사람 상담원에게 에스컬레이션한다
- **④** 이름 퍼지 유사도 점수가 가장 높은 계정을 골라 진행하고, 감사를 위해 신뢰도 값을 기록한다

> **핵심 진단:** 조회 결과가 여럿이라는 것은 '아직 대상이 확정되지 않았다'는 뜻입니다. 이 상태에서 최근 활동이나 이름 유사도 같은 휴리스틱으로 하나를 고르는 것은 동명이인 사이에서 *추측* 을 하는 것이고, 추측이 틀리면 환불처럼 되돌리기 어려운 조치가 엉뚱한 고객에게 실행됩니다. 올바른 동작은 계정에 영향을 주는 조치를 멈추고, 고객에게 주문 번호·이메일·ZIP 코드 같은 **추가 식별자** 를 물어 하나로 좁힌 뒤에만 진행하는 것입니다. 질문 한 번이면 에이전트가 스스로 풀 수 있는 일상적인 모호성이므로 사람에게 넘길 일도 아닙니다.

후보가 하나로 확정될 때까지는 조회 같은 읽기 작업만 하고, `process_refund` 같은 쓰기 작업은 확정된 고객 id로만 호출하도록 지침을 두면 같은 사고를 막을 수 있습니다.

1. **오답** - 최근 활동은 '지금 연락한 고객'이라는 근거가 되지 못합니다. 이 추측이 바로 다른 고객에게 환불이 처리된 지금의 사고를 만든 동작입니다.
2. **정답** - 추가 식별자 하나로 세 후보 중 실제 고객을 확정한 뒤에만 계정 조치를 하므로, 잘못된 계정에 환불하는 일을 막습니다. 질문 한 번으로 해결되어 첫 응대 해결률도 지킵니다.
3. **오답** - 동명이인 상황은 질문 한 번으로 풀리는 일상적 모호성이라 사람에게 넘길 이유가 없습니다. 다중 일치를 모두 에스컬레이션하면 상담원 부담만 늘고 첫 응대 해결률 목표가 무너집니다.
4. **오답** - 이름이 완전히 같은 사람들 사이에서는 이름 유사도 점수가 구분 근거가 되지 못합니다. 신뢰도를 기록해도 사후 감사에 도움이 될 뿐, 잘못된 환불을 막지는 못합니다.

> 💡 **시험 포인트:** 조회 결과가 여러 건이면 추측(최근성, 유사도, 첫 번째 결과)하지 말고 추가 식별자를 요청해 확정합니다. 에이전트가 질문으로 풀 수 있는 모호성은 직접 해결하고, 에스컬레이션은 정책 공백이나 권한 밖 요청처럼 에이전트가 해결할 수 없을 때 씁니다.

---

## 문제 11
### **[Scenario: Code Generation with Claude Code] Your team standardized naming and error-handling conventions by adding them to `~/.claude/CLAUDE.md` on the tech lead's machine. Everything works for the lead, but three newly onboarded engineers who cloned the repo report that Claude Code ignores the conventions entirely, even though `git status` shows a clean checkout. What is the most effective fix?**

| 보기 | 설명 |
|------|------|
| 1. Add an `@import` to the repo-root CLAUDE.md pointing at `~/.claude/CLAUDE.md` so each clone pulls in the personal file | |
| 2. Have each engineer run /memory after cloning so the user-scoped memory files are force-reloaded from the lead's profile | |
| **3. Move the conventions into the project-scoped .claude/CLAUDE.md (or repo root) so they are committed to version control and load for every clone** | |
| 4. Convert the conventions into a skill under .claude/skills/ so they activate on demand for all users when relevant | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

팀은 이름 짓기와 오류 처리 컨벤션을 테크 리드 머신의 `~/.claude/CLAUDE.md` 에 추가해 표준화했습니다. 리드에게는 모든 것이 잘 동작하지만, 저장소를 클론한 신규 엔지니어 세 명은 `git status` 가 깨끗한 체크아웃 상태를 보여 주는데도 Claude Code가 컨벤션을 완전히 무시한다고 보고합니다. 가장 효과적인 해결책은 무엇일까요?

- **①** 저장소 루트 CLAUDE.md에 `~/.claude/CLAUDE.md` 를 가리키는 `@import` 를 추가해, 각 클론이 개인 파일을 가져오게 한다
- **②** 각 엔지니어가 클론 후 `/memory` 를 실행해, 사용자 범위 메모리 파일을 리드의 프로필에서 강제로 다시 불러오게 한다
- **③** 컨벤션을 프로젝트 범위의 `.claude/CLAUDE.md`(또는 저장소 루트)로 옮겨, 버전 관리에 커밋되고 모든 클론에서 로드되게 한다
- **④** 컨벤션을 `.claude/skills/` 아래의 스킬로 바꿔, 관련 있을 때 모든 사용자에게 필요 시 활성화되게 한다

> **핵심 진단:** CLAUDE.md는 범위(scope)마다 위치와 공유 대상이 다릅니다. `~/.claude/CLAUDE.md` 는 **사용자 범위** 로, 그 머신의 그 사용자에게만 모든 프로젝트에 걸쳐 적용되고 버전 관리로 공유되지 않습니다. 팀 전체가 따라야 할 컨벤션은 **프로젝트 범위** 인 `./CLAUDE.md` 나 `./.claude/CLAUDE.md` 에 두고 커밋해야, 저장소를 클론한 모든 사람의 세션에서 시작 시 자동으로 로드됩니다. '리드 머신에서만 되고 깨끗한 체크아웃에서는 안 된다'는 증상은 지침이 공유되지 않는 범위에 있다는 전형적인 신호입니다.

```text
~/.claude/CLAUDE.md       사용자 범위: 나만, 모든 프로젝트
./CLAUDE.md 또는          프로젝트 범위: 소스 관리를 통해 팀 전체 공유
./.claude/CLAUDE.md
./CLAUDE.local.md         로컬 범위: 나만, 현재 프로젝트 (.gitignore에 추가)
```

세션에서 실제로 어떤 CLAUDE.md가 로드됐는지는 `/context` 의 Memory files 목록에서 확인할 수 있습니다.

1. **오답** - `@import` 경로의 `~` 는 각자의 홈 디렉터리로 해석되므로, 신규 팀원 머신에서는 리드의 파일이 아니라 존재하지 않거나 그 사람 개인의 파일을 가리킵니다. 게다가 `~/.claude/CLAUDE.md` 는 원래 모든 프로젝트에 자동 로드되는 파일이라 리드에게도 의미 없는 중복입니다.
2. **오답** - `/memory` 는 사용자·프로젝트 범위의 메모리 파일 목록을 보여 주고 편집기로 열어 주는 명령일 뿐, 다른 사람 머신의 파일을 가져오는 기능이 없습니다. 공유 범위에 없던 지침은 어떤 명령으로도 신규 팀원에게 생기지 않습니다.
3. **정답** - 컨벤션을 프로젝트 범위 CLAUDE.md로 옮겨 커밋하면 버전 관리를 통해 모든 클론에 같은 파일이 생기고, Claude Code가 세션 시작 시 자동으로 로드합니다. 리드 머신에 대한 의존이 사라지고 팀 전체가 같은 지침을 받습니다.
4. **오답** - 스킬은 설명만 컨텍스트에 있고 본문은 관련 있다고 판단될 때만 로드되는 on-demand 방식이라, 항상 적용되어야 하는 명명·오류 처리 컨벤션에는 맞지 않습니다. 모든 세션에 늘 깔려 있어야 하는 지침은 CLAUDE.md의 역할입니다.

> 💡 **시험 포인트:** '내 머신에서는 되는데 팀원은 안 된다'는 증상이 나오면 사용자 범위(`~/.claude/`)와 프로젝트 범위(커밋되는 `CLAUDE.md`, `.claude/`)의 차이를 먼저 떠올립니다. 팀 공유가 목적이면 커밋되는 프로젝트 범위가 정답입니다.

---

## 문제 12
### **[Scenario: Code Generation with Claude Code] Your team's /investigate-flaky skill greps the entire test suite, reads dozens of files, and prints verbose exploration before it answers. Developers notice that after running it, the main session is cluttered with raw output and Claude's subsequent answers in that session degrade in quality. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Add a step to CLAUDE.md instructing Claude to summarize the skill's output before continuing with later requests in the session | |
| 2. Restrict the skill with an allowed-tools list in its frontmatter so it can only run a few tools and reads fewer files | |
| 3. Increase the context window size so the accumulated exploration output no longer causes any degradation in later answers | |
| **4. Set context:fork in the skill's SKILL.md frontmatter so exploration runs in an isolated context and only the result returns** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

팀의 `/investigate-flaky` 스킬은 테스트 스위트 전체를 grep으로 검색하고, 수십 개 파일을 읽고, 답하기 전에 장황한 탐색 과정을 출력합니다. 개발자들은 이 스킬을 실행한 뒤 메인 세션이 원본 출력으로 어수선해지고, 그 세션에서 Claude가 이후에 내놓는 답변의 품질이 떨어진다는 것을 알아챘습니다. 가장 좋은 해결책은 무엇일까요?

- **①** 세션의 이후 요청을 이어 가기 전에 스킬 출력을 요약하라는 단계를 CLAUDE.md에 추가한다
- **②** 스킬 frontmatter에 `allowed-tools` 목록을 두어, 몇 가지 도구만 실행하고 파일을 덜 읽도록 스킬을 제한한다
- **③** 컨텍스트 창 크기를 늘려, 누적된 탐색 출력이 이후 답변의 품질을 더 이상 떨어뜨리지 않게 한다
- **④** 스킬의 SKILL.md frontmatter에 `context: fork` 를 설정해, 탐색은 격리된 컨텍스트에서 실행되고 결과만 돌아오게 한다

> **핵심 진단:** 문제는 탐색 *과정* 의 원본 출력이 메인 대화의 컨텍스트에 그대로 쌓여, 이후 요청과 무관한 내용이 주의를 분산시킨다는 점입니다. 스킬 frontmatter에 `context: fork` 를 넣으면 Claude Code가 새 서브에이전트를 띄워 스킬 내용을 그 프롬프트로 실행하고, grep 결과와 파일 내용 같은 중간 출력은 그 서브에이전트의 컨텍스트 안에만 남습니다. 메인 대화로 돌아오는 것은 서브에이전트가 정리한 결과뿐이므로 메인 세션이 깨끗하게 유지됩니다.

```yaml
name: investigate-flaky
description: Investigate flaky tests and report the likely root cause
context: fork
agent: Explore
```

`agent` 는 포크에 쓸 서브에이전트 종류이며, 생략하면 `general-purpose` 가 쓰입니다. 포크된 서브에이전트는 현재 대화 기록을 보지 못하므로 스킬 본문에 작업 지시가 스스로 완결되게 적혀 있어야 하고, 기본적으로 백그라운드에서 실행되어 끝나면 결과가 대화에 도착합니다.

1. **오답** - 요약 지시는 장황한 출력이 이미 메인 컨텍스트에 들어온 *뒤에* 작동하는 프롬프트 수준의 조치입니다. 모델이 따를지도 확실하지 않고, 원본 출력은 요약과 함께 컨텍스트에 그대로 남습니다.
2. **오답** - 현재 공식 문서 기준 `allowed-tools` 는 스킬을 호출한 턴에 나열한 도구를 승인 없이 쓰게 하는 사전 승인 목록이라 도구를 제한하지도 않습니다. 설령 도구를 줄이더라도 출력이 메인 컨텍스트로 들어오는 경로는 그대로이고, 조사에 필요한 탐색 능력만 약해집니다.
3. **오답** - 컨텍스트 창을 키워도 무관한 출력이 쌓이는 것은 그대로라 주의 분산은 사라지지 않고 늦춰질 뿐입니다. 스킬을 여러 번 돌리면 다시 같은 문제가 생깁니다.
4. **정답** - `context: fork` 는 스킬을 격리된 서브에이전트 컨텍스트에서 실행하고 최종 결과만 메인 대화로 돌려보내는 공식 frontmatter 설정입니다. 장황한 탐색은 서브에이전트 안에 남고 메인 세션의 답변 품질이 유지됩니다.

> 💡 **시험 포인트:** '장황한 탐색 출력이 메인 컨텍스트를 오염시킨다'는 신호에는 격리(스킬의 `context: fork` 또는 서브에이전트 위임)가 정답입니다. 더 큰 컨텍스트 창, 사후 요약 지시, 도구 목록 조정은 출력이 메인 컨텍스트에 쌓이는 경로를 바꾸지 못합니다.

---

## 문제 13
### **[Scenario: Code Generation with Claude Code] A team's `.claude/skills/dep-audit/` skill is meant to be run manually before releases, but Claude keeps auto-invoking it mid-session whenever dependency files come up, dumping roughly 4,000 lines of resolution output into unrelated refactoring sessions. The team still wants engineers to be able to run `/dep-audit` explicitly. What is the most effective fix?**

| 보기 | 설명 |
|------|------|
| **1. Set `disable-model-invocation: true` in the skill's SKILL.md frontmatter so only an explicit `/dep-audit` runs it** | |
| 2. Call `/compact` automatically at the end of the skill so the audit output is condensed before the session's work continues | |
| 3. Delete the skill's `description` frontmatter so Claude can no longer match it to conversation topics or dependency files | |
| 4. Move the audit instructions into CLAUDE.md so they load once at startup instead of being triggered mid-session by file names | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

팀의 `.claude/skills/dep-audit/` 스킬은 릴리스 전에 수동으로 실행하려고 만든 것인데, Claude가 세션 도중 의존성 파일 이야기가 나올 때마다 이 스킬을 자동으로 호출해, 관계없는 리팩터링 세션에 약 4,000줄의 의존성 해석 출력을 쏟아 냅니다. 팀은 엔지니어가 `/dep-audit` 을 명시적으로 실행할 수 있는 것은 그대로 유지하고 싶어 합니다. 가장 효과적인 해결책은 무엇일까요?

- **①** 스킬의 SKILL.md frontmatter에 `disable-model-invocation: true` 를 설정해, 명시적인 `/dep-audit` 호출로만 실행되게 한다
- **②** 스킬 끝에서 `/compact` 를 자동으로 호출해, 세션 작업이 이어지기 전에 감사 출력을 압축한다
- **③** 스킬의 `description` frontmatter를 삭제해, Claude가 더 이상 이 스킬을 대화 주제나 의존성 파일과 연결하지 못하게 한다
- **④** 감사 지침을 CLAUDE.md로 옮겨, 세션 도중 파일 이름 때문에 트리거되지 않고 시작 시 한 번만 로드되게 한다

> **핵심 진단:** 기본 상태의 스킬은 사용자가 `/이름` 으로 호출할 수 있고, Claude도 description을 보고 관련 있다고 판단하면 스스로 호출합니다. 수동 전용 워크플로에는 frontmatter의 `disable-model-invocation: true` 가 정확히 맞는 설정입니다. 이 값을 켜면 스킬의 description이 컨텍스트에 올라가지 않아 Claude가 자동으로 호출하지 않고, 사용자가 `/dep-audit` 을 직접 입력했을 때만 전체 스킬이 로드되어 실행됩니다.

```yaml
name: dep-audit
description: Full dependency resolution audit to run before a release
disable-model-invocation: true
```

반대로 사용자가 직접 부를 수 없고 Claude만 쓰게 하려면 `user-invocable: false` 를 씁니다.

1. **정답** - `disable-model-invocation: true` 는 Claude의 자동 호출만 막고 사용자의 명시적인 `/dep-audit` 호출은 그대로 허용하는 공식 설정입니다. 릴리스 전 수동 실행이라는 의도를 지키면서 리팩터링 세션은 깨끗하게 유지됩니다.
2. **오답** - `/compact` 는 4,000줄이 이미 세션에 들어와 품질을 떨어뜨린 *뒤에* 대응하는 사후 조치이고, 압축 과정에서 작업에 필요한 세부 정보까지 잃을 수 있습니다. 원치 않는 자동 호출 자체는 막지 못합니다.
3. **오답** - 공식 문서에 따르면 `description` 을 생략하면 Claude Code는 마크다운 본문의 첫 번째 비어 있지 않은 줄을 설명으로 씁니다. 메타데이터를 망가뜨려도 자동 호출이 확실히 막히지 않는, 지원되지 않는 우회책입니다.
4. **오답** - CLAUDE.md는 매 세션 시작 시 로드되므로, 장황한 감사 지침이 관계없는 모든 세션의 기본 컨텍스트가 되어 문제가 오히려 커집니다. 필요할 때만 실행하는 워크플로라는 성격과도 맞지 않습니다.

> 💡 **시험 포인트:** '수동으로만 실행, 자동 호출 금지'는 `disable-model-invocation: true`, 'Claude만 호출, 사용자 메뉴에서 숨김'은 `user-invocable: false` 로 구분합니다. description 삭제나 사후 `/compact` 같은 우회책은 오답입니다.

---

## 문제 14
### **[Scenario: Code Generation with Claude Code] A shared `generate-docs` skill is supposed to read source and write Markdown into `docs/`, but twice it has run `Edit` and shell `rm` and overwritten source files. Adding the reminder "only write to docs/, never edit source" to the skill body has not reliably stopped it. What is the best way to guarantee the skill cannot touch source?**

| 보기 | 설명 |
|------|------|
| 1. Add a stronger system-prompt instruction explicitly forbidding edits to any file that lives outside the `docs/` directory | |
| **2. Declare `allowed-tools` in the skill's SKILL.md frontmatter limited to Read/Glob/Write so the harness blocks Edit and Bash** | |
| 3. Require the skill to run in plan mode every time so a human reviews and approves each proposed action before it executes | |
| 4. Add a global PreToolUse hook that inspects every Edit across all sessions and rejects any write outside the `docs/` folder | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

공유 `generate-docs` 스킬은 소스를 읽고 `docs/` 에 Markdown을 써야 하는데, 두 번이나 `Edit` 과 셸 `rm` 을 실행해 소스 파일을 덮어썼습니다. 스킬 본문에 "only write to docs/, never edit source"(docs/에만 쓰고 소스는 절대 수정하지 말 것)라는 문구를 추가했지만 확실히 막지 못했습니다. 스킬이 소스를 건드릴 수 없도록 보장하는 가장 좋은 방법은 무엇일까요?

- **①** `docs/` 디렉터리 밖에 있는 파일의 수정을 명시적으로 금지하는 더 강한 시스템 프롬프트 지시를 추가한다
- **②** 스킬의 SKILL.md frontmatter에 `allowed-tools` 를 `Read`, `Glob`, `Write` 로 제한해 선언하고, 하네스가 `Edit` 과 `Bash` 를 차단하게 한다
- **③** 스킬이 매번 plan 모드로 실행되게 해, 제안된 각 동작이 실행되기 전에 사람이 검토하고 승인하게 한다
- **④** 모든 세션의 모든 `Edit` 을 검사해 `docs/` 폴더 밖 쓰기를 거부하는 전역 PreToolUse 훅을 추가한다

> **핵심 진단:** 스킬 본문의 문구는 모델이 무시할 수 있는 지시일 뿐이므로, '절대 못 하게 보장'하려면 도구 사용을 하네스 수준에서 강제해야 하고, 그 범위는 문제가 생긴 이 스킬로 좁혀야 합니다. 이 문제의 출제 의도는 SKILL.md frontmatter로 이 스킬이 쓸 수 있는 도구를 한정하는 것입니다. 다만 현재 Claude Code 공식 문서에서 `allowed-tools` 는 스킬을 호출한 턴 동안 나열한 도구를 **승인 없이 쓰게 해 주는 사전 승인 목록** 이며, 다른 도구를 막지 않습니다. 스킬이 활성화된 동안 도구를 실제로 빼는 필드는 `disallowed-tools` 입니다.

```yaml
name: generate-docs
description: Generate Markdown docs under docs/ from the source code
disallowed-tools: Edit Bash
```

`disallowed-tools` 의 제한은 다음 메시지를 보내면 풀리고, 남겨 둔 `Write` 는 경로와 관계없이 파일을 덮어쓸 수 있습니다. `docs/` 밖 쓰기까지 막으려면 `Write` 의 `file_path` 를 검사하는 PreToolUse 훅이나, 파일을 수정하는 모든 내장 도구에 적용되는 `Edit(...)` 경로 권한 규칙을 함께 씁니다.

1. **오답** - 더 강한 문구도 결국 모델이 따르지 않을 수 있는 지시이며, 스킬 본문에 같은 경고를 넣었는데도 실패한 것이 바로 관찰된 증상입니다. 확률적인 지시로는 '보장'이 불가능합니다.
2. **정답** - 출제 의도는 스킬 frontmatter로 이 스킬의 도구를 하네스 수준에서 제한해, 프롬프트 문구와 달리 모델이 우회할 수 없게 하고 적용 범위도 이 스킬로 한정하는 것입니다. 다만 현재 공식 문서 기준 `allowed-tools` 는 사전 승인 목록일 뿐 `Edit`·`Bash` 를 막지 않으므로, 실무에서는 같은 frontmatter의 `disallowed-tools` 로 구현해야 이 의도가 실제로 보장됩니다.
3. **오답** - plan 모드는 모든 실행에 사람의 검토 단계를 더해 마찰을 만들고, 나쁜 동작을 *예방* 하기보다 사람이 매번 잡아내기를 기대합니다. 검토자가 놓치면 같은 사고가 다시 생깁니다.
4. **오답** - 훅으로 결정적으로 막는다는 방향은 맞지만, 문제는 한 스킬에 한정되어 있는데 모든 세션의 모든 `Edit` 을 감시하므로 범위가 과합니다. 또 `Edit` 만 검사하면 이번에 소스를 지운 셸 `rm` 은 걸러 내지 못합니다.

> 💡 **시험 포인트:** '절대 하지 못하게 보장'이라는 요구에는 프롬프트가 아닌 결정적 장치를 고르고, 그중 문제 범위에 맞는 가장 좁은 범위(이 스킬의 frontmatter)를 선택합니다. 실무에서는 `allowed-tools` 는 사전 승인, `disallowed-tools` 는 도구 제거라는 차이를 꼭 구분합니다.

---

## 문제 15
### **[Scenario: Code Generation with Claude Code] A shared `/scaffold-component` skill expects a component-name argument, but telemetry shows teammates invoke it with no argument or a malformed one about a third of the time, producing empty or misnamed scaffolds. What is the most effective way to reduce these malformed invocations?**

| 보기 | 설명 |
|------|------|
| 1. Rename the skill to `/scaffold-component-with-name` so the required input is implied by the command name itself | |
| 2. Document the correct usage in the project CLAUDE.md so it is always loaded into the model's context at startup | |
| **3. Add an `argument-hint` field to the skill's SKILL.md frontmatter so the expected argument format shows at invocation** | |
| 4. Have the skill body instruct Claude to ask the user for the component name whenever the argument is missing or empty | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

공유 `/scaffold-component` 스킬은 컴포넌트 이름 인자를 받도록 되어 있지만, 텔레메트리를 보면 팀원들이 약 3분의 1의 경우 인자 없이 또는 잘못된 형식의 인자로 호출해, 비어 있거나 이름이 잘못된 스캐폴드가 만들어집니다. 이런 잘못된 호출을 줄이는 가장 효과적인 방법은 무엇일까요?

- **①** 스킬 이름을 `/scaffold-component-with-name` 으로 바꿔, 필요한 입력이 명령 이름 자체에서 드러나게 한다
- **②** 프로젝트 CLAUDE.md에 올바른 사용법을 문서화해, 시작 시 항상 모델의 컨텍스트에 로드되게 한다
- **③** 스킬의 SKILL.md frontmatter에 `argument-hint` 필드를 추가해, 호출할 때 기대되는 인자 형식이 표시되게 한다
- **④** 인자가 없거나 비어 있을 때마다 사용자에게 컴포넌트 이름을 물어보라고 스킬 본문에서 Claude에게 지시한다

> **핵심 진단:** 실수가 일어나는 곳은 사람이 슬래시 명령을 *입력하는 순간* 이므로, 안내도 그 순간에 보여야 합니다. SKILL.md frontmatter의 `argument-hint` 는 자동완성 중에 기대되는 인자를 보여 주는 힌트로, `/scaffold-component` 를 입력하는 사람에게 `[ComponentName]` 같은 형식을 바로 알려 줍니다. 실행 전에 사람을 안내하므로 빈 호출이나 형식이 틀린 호출을 가장 앞 단계에서 줄입니다.

```yaml
name: scaffold-component
description: Scaffold a new UI component with tests and a story file
argument-hint: "[ComponentName]"
```

본문에서는 `$ARGUMENTS`(또는 `$0` 같은 위치 인자)로 입력값을 받습니다. `argument-hint` 는 표시용 힌트일 뿐 인자를 필수로 만들거나 검증하지는 않으므로, 실무에서는 '인자가 없으면 묻기' 지시를 보조 안전장치로 함께 두면 좋습니다.

1. **오답** - 이름을 바꾸는 것은 형식을 보여 주지도, 빈 호출을 막지도 못하는 외형적인 유도에 그칩니다. 명령 이름만 길어지고 어떤 형식의 이름을 넣어야 하는지는 여전히 알 수 없습니다.
2. **오답** - CLAUDE.md는 *모델* 의 컨텍스트에 들어갈 뿐, 사람이 슬래시 명령을 입력하는 순간 화면에 힌트를 보여 주지 않습니다. 실수가 일어나는 지점과 안내가 전달되는 지점이 어긋납니다.
3. **정답** - `argument-hint` 는 호출 시점의 자동완성에 기대 인자와 형식을 보여 주도록 만들어진 전용 frontmatter 필드입니다. 실수가 일어나는 바로 그 순간에 사람을 안내하므로 잘못된 호출 자체를 가장 직접적으로 줄입니다.
4. **오답** - 인자가 없을 때 되묻는 것은 잘못된 호출이 *일어난 뒤의* 런타임 대응이라 왕복이 하나 늘고, 형식이 틀린 인자는 걸러 내지 못할 수 있습니다. 보조 장치로는 유용하지만 기대 형식을 미리 알려 주는 직접적인 해결책은 아닙니다.

> 💡 **시험 포인트:** 스킬 frontmatter 필드를 짝지어 기억합니다. 호출 시 인자 안내는 `argument-hint`, 자동 호출 방지는 `disable-model-invocation`, 격리 실행은 `context: fork`, 도구 사전 승인은 `allowed-tools` 입니다. '사람이 호출할 때 실수한다'는 신호에는 호출 시점에 보이는 장치가 정답입니다.

---

## 문제 16
### **[Scenario: Code Generation with Claude Code] A developer needs three changes that all touch the shared `PaymentStatus` enum and the several functions that switch on it. They sent each change as a separate sequential message; after the third message the project no longer compiles because the earlier edits did not anticipate the later ones. What is the best way to structure the request?**

| 보기 | 설명 |
|------|------|
| 1. Run each of the three changes in its own fresh session so every edit stays cleanly isolated from the others | |
| 2. Enable plan mode and approve the three changes one at a time in sequence, reviewing each plan before the next | |
| 3. Keep them sequential but ask Claude to re-read the enum definition before each message to refresh its memory | |
| **4. Batch the three interacting changes into a single message so Claude edits the enum and all dependent switch sites together** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

개발자에게 필요한 세 가지 변경이 모두 공유 `PaymentStatus` enum과 이 enum을 기준으로 분기(switch)하는 여러 함수를 건드립니다. 개발자는 각 변경을 별도의 메시지로 차례차례 보냈는데, 세 번째 메시지 이후 프로젝트가 더 이상 컴파일되지 않습니다. 앞선 수정이 뒤에 올 변경을 예상하지 못했기 때문입니다. 요청을 구성하는 가장 좋은 방법은 무엇일까요?

- **①** 세 변경을 각각 새 세션에서 실행해, 모든 수정이 서로 깔끔하게 격리되도록 한다
- **②** plan mode를 켜고 세 변경을 하나씩 순서대로 승인하며, 다음 변경으로 넘어가기 전에 각 계획을 검토한다
- **③** 순차 방식은 유지하되, 메시지마다 Claude에게 enum 정의를 다시 읽게 해 기억을 새로 고친다
- **④** 서로 얽힌 세 변경을 하나의 메시지로 묶어, Claude가 enum과 이에 의존하는 모든 switch 지점을 함께 수정하게 한다

> **핵심 진단:** 여러 변경이 같은 enum과 그 enum을 분기하는 함수들을 함께 건드리면, 이 변경들은 서로 독립적이지 않은 **상호작용하는 변경** 입니다. 순차 메시지로 나눠 보내면 Claude는 매번 *지금 보이는 요청* 만 기준으로 enum과 switch 지점을 맞추므로, 첫 번째 수정이 두 번째·세 번째 변경과 충돌하는 형태로 굳어 버립니다. 세 변경을 **한 메시지에 묶어** 주면 모델이 최종 enum 모양과 모든 의존 지점을 한 번에 설계하고 같은 작업 안에서 일관되게 고칠 수 있습니다. 반대로 서로 무관한 변경이라면 하나씩 순서대로 처리하는 편이 검토하기 쉽습니다.

```text
PaymentStatus 에 대한 아래 세 변경은 서로 얽혀 있으니 한 번에 적용해 줘.
- REFUNDED 상태 추가
- PENDING 을 AUTHORIZED 와 AWAITING_CAPTURE 로 분리
- FAILED 에 실패 사유 필드 연결
enum 정의와 이를 switch 하는 모든 함수를 함께 고치고, 마지막에 빌드가 통과하는지 확인해 줘.
```

묶은 요청이 크게 느껴지면 plan mode로 *묶은 전체* 에 대한 계획을 먼저 받아 검토하는 것은 좋은 보완책입니다. 핵심은 계획과 승인을 변경별로 쪼개지 않는 것입니다.

1. **오답** - 세션을 새로 시작할 때마다 앞선 변경의 맥락이 사라지므로, 서로 얽힌 수정끼리 조율할 근거가 오히려 줄어듭니다. 격리는 독립적인 작업에 맞는 처방이지 상호작용하는 변경에 맞는 처방이 아닙니다.
2. **오답** - plan mode는 구현 전에 계획을 검토하게 해 줄 뿐이고, 세 변경을 하나씩 승인하면 여전히 한 번에 한 변경만 보고 수정하게 됩니다. 순서 때문에 생긴 충돌이 그대로 재현됩니다.
3. **오답** - 문제는 enum 정의를 잊어버린 것이 아니라, 각 수정이 뒤에 올 변경을 모른 채 이뤄진 *조율* 문제입니다. 정의를 다시 읽혀도 다음 메시지에 올 변경 내용은 여전히 보이지 않습니다.
4. **정답** - 서로 영향을 주는 변경을 한 메시지에 담으면 Claude가 세 요구 사항을 동시에 고려해 enum과 모든 switch 지점을 일관되게 고칠 수 있습니다. 중간 상태가 깨진 채 남는 일도 사라집니다.

> 💡 **시험 포인트:** 변경들이 같은 타입·같은 코드 경로를 공유해 서로 영향을 주면 "한 메시지로 묶기", 서로 독립적이면 "순차 처리"가 정답입니다. 새 세션, plan mode 단계별 승인, 정의 다시 읽기는 모두 순서 문제를 그대로 남기는 오답입니다.

---

## 문제 17
### **[Scenario: Code Generation with Claude Code] Asking Claude to "make the input validation more robust and idiomatic" yields inconsistent output across runs: sometimes it adds zod, sometimes hand-written checks, sometimes nothing meaningful. The team wants the validation style to come out consistent. What is the most effective refinement?**

| 보기 | 설명 |
|------|------|
| **1. Provide 2-3 concrete input-to-output examples showing the exact validation style and library you want** | |
| 2. Expand the request into a longer prose description defining what "robust" and "idiomatic" mean for validation | |
| 3. Fine-tune a model on the team's existing validation code so it internalizes the house validation style | |
| 4. Add a standing CLAUDE.md rule stating that all validation code should always be robust and idiomatic | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

Claude에게 "make the input validation more robust and idiomatic"(입력 검증을 더 견고하고 관용적으로 만들어 줘)이라고 요청하면 실행할 때마다 결과가 들쭉날쭉합니다. 어떤 때는 `zod` 를 추가하고, 어떤 때는 손으로 쓴 검사 코드를 넣고, 어떤 때는 의미 있는 변화가 거의 없습니다. 팀은 검증 스타일이 일관되게 나오기를 원합니다. 가장 효과적인 개선 방법은 무엇일까요?

- **①** 원하는 검증 스타일과 라이브러리를 정확히 보여 주는 구체적인 입력-출력 예시를 2-3개 제공한다
- **②** 요청을 더 긴 산문 설명으로 늘려, 검증에서 "robust"와 "idiomatic"이 무엇을 뜻하는지 정의한다
- **③** 팀의 기존 검증 코드로 모델을 파인튜닝해, 팀 고유의 검증 스타일을 내재화하게 한다
- **④** 모든 검증 코드는 항상 견고하고 관용적이어야 한다는 상시 규칙을 CLAUDE.md에 추가한다

> **핵심 진단:** "robust", "idiomatic" 같은 형용사는 해석의 폭이 넓어서, 모델은 실행마다 그럴듯한 해석 중 하나를 고르게 되고 그 차이가 그대로 출력 편차로 나타납니다. 스타일에 민감한 작업에서는 목표를 **말로 설명하기보다 보여 주는 것**, 즉 구체적인 입력→출력 예시(few-shot 예시)가 가장 확실합니다. 예시 몇 개가 라이브러리 선택(`zod`), 스키마 선언 위치, 오류 처리 방식까지 한꺼번에 고정해 주고, 모델은 그 패턴을 새 입력에 일반화합니다.

```text
<examples>
<example>
<input>function createUser(body) { db.users.insert(body) }</input>
<output>
const CreateUser = z.object({ email: z.string().email(), age: z.number().int().min(0) });
function createUser(body) { const input = CreateUser.parse(body); db.users.insert(input) }
</output>
</example>
(같은 형식으로 중첩 객체, 선택 필드 같은 다른 경우의 예시를 더 추가)
</examples>
```

Anthropic 프롬프트 가이드도 예시를 출력의 형식·어조·구조를 조정하는 가장 신뢰할 만한 방법으로 꼽고, 실제 사용 사례와 닮았으면서도 서로 다양한 예시 3-5개를 `<example>` 태그로 감싸 지시문과 구분하라고 권합니다.

1. **정답** - 구체적인 예시는 형용사가 열어 둔 해석의 여지를 정확한 패턴으로 닫아 줍니다. 원하는 라이브러리와 검증 방식을 직접 보여 주므로 실행마다 같은 스타일이 나오고, 처음 보는 입력에도 일반화됩니다.
2. **오답** - 설명을 길게 늘려도 결국 말로 된 기준이라 해석의 여지가 남고, 그 여지가 바로 편차의 원인입니다. 정확한 코드 모양을 보여 주는 예시만큼 목표를 고정하지 못합니다.
3. **오답** - 파인튜닝은 프롬프트에 예시 몇 개를 넣으면 해결될 문제에 비해 비용과 운영 부담이 지나치게 큰 과잉 설계입니다. 스타일을 바꿀 때마다 다시 학습해야 하는 부담도 생깁니다.
4. **오답** - CLAUDE.md는 세션 시작 때마다 로드되지만, 이 규칙은 같은 모호한 형용사를 되풀이할 뿐이라 구체적인 형식을 알려 주지 못합니다. 항상 로드되는 모호한 지시는 편차를 줄이지 못합니다.

> 💡 **시험 포인트:** 출력 형식이나 스타일이 실행마다 달라지면 "더 긴 설명"이나 "상시 규칙"이 아니라 "구체적인 입력-출력 예시(few-shot 예시)"가 정답입니다. 프롬프트로 해결되는 문제에서 파인튜닝을 고르는 보기는 과잉 설계로 오답입니다.

---

## 문제 18
### **[Scenario: Code Generation with Claude Code] During a 200-file framework migration carried out in one long session, logs show Claude re-migrating files it already converted and skipping others as the conversation grows. What technique best keeps the migration on track?**

| 보기 | 설명 |
|------|------|
| 1. Switch to a larger-context model so the whole 200-file list stays inside the window for the entire length of the session. | |
| **2. Keep a scratchpad manifest of migrated vs pending files, updated after each file, so progress survives context growth.** | |
| 3. Run `/compact` frequently so the history stays short, letting the model re-summarize the file list each time it runs. | |
| 4. Do the entire migration in a single large message to avoid any state loss between separate conversation turns. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

하나의 긴 세션에서 파일 200개 규모의 프레임워크 마이그레이션을 진행하는 동안, 대화가 길어질수록 Claude가 이미 변환한 파일을 다시 마이그레이션하고 다른 파일은 건너뛰는 모습이 로그에 나타납니다. 마이그레이션이 제 궤도를 유지하게 하는 가장 좋은 기법은 무엇일까요?

- **①** 컨텍스트 창이 더 큰 모델로 바꿔, 세션 내내 200개 파일 목록 전체가 창 안에 머물게 한다
- **②** 마이그레이션 완료 파일과 대기 파일을 기록한 scratchpad 매니페스트를 두고 파일마다 갱신해, 컨텍스트가 커져도 진행 상황이 유지되게 한다
- **③** `/compact` 를 자주 실행해 기록을 짧게 유지하고, 실행할 때마다 모델이 파일 목록을 다시 요약하게 한다
- **④** 대화 턴 사이에 상태가 사라지지 않도록 전체 마이그레이션을 하나의 거대한 메시지로 처리한다

> **핵심 진단:** 수백 개 파일을 다루는 장기 작업에서 "무엇을 끝냈고 무엇이 남았는가"를 대화 기억에 맡기면, 대화가 길어질수록 앞부분의 진행 기록이 희석되거나 압축 과정에서 사라져 중복 작업과 누락이 생깁니다. 해결책은 진행 상태를 **디스크의 외부 파일(매니페스트)** 에 두고 파일 하나를 끝낼 때마다 갱신하는 것입니다. 그러면 컨텍스트에서 무엇이 밀려나든 매니페스트가 진행 상황의 기준(source of truth)이 되고, 다음 작업은 항상 매니페스트의 대기 목록에서 골라 결정적으로 이어 갈 수 있습니다. 세션이 끊기거나 새 세션으로 넘어가도 이 파일만 읽으면 복구됩니다.

```json
{
  "migrated": ["src/auth/login.ts", "src/auth/session.ts"],
  "pending": ["src/billing/invoice.ts", "src/billing/refund.ts"],
  "failed": [{"file": "src/legacy/report.ts", "reason": "dynamic require"}],
  "total": 200
}
```

Anthropic 프롬프트 가이드도 여러 컨텍스트 창에 걸친 작업에서는 상태 데이터를 JSON 같은 구조화 파일로, 진행 메모는 자유 형식 텍스트로 남기고, git을 되돌릴 수 있는 체크포인트 기록으로 활용하라고 권합니다.

1. **오답** - 창이 커져도 200개 파일 규모의 긴 기록에서는 주의가 분산되어 진행 상황 추적이 흔들릴 수 있고, 무엇을 끝냈는지 확인할 수 있는 신뢰할 만한 기록은 여전히 생기지 않습니다.
2. **정답** - 파일마다 갱신하는 매니페스트는 대화 내용과 무관하게 남는 진행 기록입니다. Claude가 다음 작업을 매니페스트의 대기 목록에서 고르므로 중복 변환과 누락이 사라지고, 중단 후에도 그 파일로 바로 복구할 수 있습니다.
3. **오답** - `/compact` 는 기록을 요약해 줄일 뿐이라, 정작 필요한 파일별 진행 정보가 요약 과정에서 뭉개질 수 있습니다. 매번 다시 요약되는 목록은 검증 가능한 기록이 아닙니다.
4. **오답** - 200개 파일을 한 메시지로 처리하는 것은 이 규모에서 비현실적이고, 중간에 실패하면 무엇이 끝났는지 알 수 있는 장애 대비 기록도 남지 않습니다.

> 💡 **시험 포인트:** 장기·대규모 작업에서 "이미 한 일을 또 하거나 빠뜨린다"는 증상이 보이면, 진행 상태를 대화 밖 외부 파일(매니페스트·scratchpad)에 두는 보기가 정답입니다. 더 큰 컨텍스트 창이나 `/compact` 는 보조 수단일 뿐 진행 기록을 대신하지 못합니다.

---

## 문제 19
### **[Scenario: Code Generation with Claude Code] To rename a widely-used internal API, Claude must first locate every call site across a large monorepo. Doing this discovery inline reads dozens of files and floods the main session with search output before any edits begin, and the later edits then start to wander. What is the best approach?**

| 보기 | 설명 |
|------|------|
| 1. Read every candidate file into the main session first so all call sites are visible before any edit begins, then plan the rename. | |
| 2. Run `/compact` after each search so the accumulated search output is repeatedly condensed before the edits start. | |
| **3. Delegate discovery to an Explore subagent that returns only a summary of call sites, keeping the main context for edits.** | |
| 4. Move to a larger-context model so the exploration output no longer competes with the edits for the model's attention. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

널리 쓰이는 내부 API의 이름을 바꾸려면 Claude가 먼저 대형 모노레포 전체에서 모든 호출 지점을 찾아야 합니다. 이 탐색을 메인 세션에서 직접 하면 편집을 시작하기도 전에 수십 개 파일을 읽어 메인 세션이 검색 출력으로 넘쳐나고, 이후의 편집도 점점 방향을 잃기 시작합니다. 가장 좋은 접근 방식은 무엇일까요?

- **①** 편집을 시작하기 전에 모든 호출 지점이 보이도록 후보 파일을 전부 메인 세션에 먼저 읽어 들인 뒤, 이름 변경을 계획한다
- **②** 검색이 끝날 때마다 `/compact` 를 실행해, 편집을 시작하기 전까지 쌓인 검색 출력을 반복해서 압축한다
- **③** 탐색을 Explore 서브에이전트에 위임해 호출 지점 요약만 돌려받고, 메인 컨텍스트는 편집에 쓴다
- **④** 컨텍스트 창이 더 큰 모델로 옮겨, 탐색 출력이 모델의 주의를 두고 편집 작업과 경쟁하지 않게 한다

> **핵심 진단:** 대형 코드베이스의 탐색은 출력이 많고, 그 출력 대부분은 이후 편집에서 다시 볼 필요가 없는 소음입니다. 이런 작업은 **별도 컨텍스트 창에서 도는 서브에이전트** 에 맡기고, 메인 세션에는 정제된 결과(호출 지점의 파일 경로·줄 번호 목록)만 돌려받는 것이 구조적인 해법입니다. Claude Code의 내장 Explore 서브에이전트는 코드베이스 검색·분석에 최적화된 읽기 전용 에이전트로 `Write`·`Edit` 도구가 막혀 있고, 탐색 중 읽은 파일 내용은 서브에이전트 쪽 컨텍스트에만 남습니다.

```text
Explore 서브에이전트로 legacyFetch( 호출 지점을 모노레포 전체에서 찾아 줘.
파일 경로, 줄 번호, 호출 형태(직접 호출 또는 래퍼 경유)만 표로 정리해서 돌려줘.
```

Explore를 호출할 때 Claude는 quick, medium, very thorough 중 하나로 탐색 깊이를 정하고, Explore는 빠르고 저렴한 탐색을 위해 CLAUDE.md 없이 시작합니다.

1. **오답** - 모든 후보 파일을 메인 세션에 읽어 들이는 것은 편집이 흔들리게 만든 바로 그 과부하 동작입니다. 호출 지점은 보이겠지만 검색 소음이 실제 편집에 필요한 주의를 잠식합니다.
2. **오답** - 반복적인 `/compact` 는 소음이 이미 쌓인 뒤에 쓰는 손실성 사후 처방입니다. 요약 과정에서 호출 지점 세부 정보가 뭉개질 수 있고 작업 흐름도 계속 끊깁니다.
3. **정답** - 탐색을 격리된 컨텍스트에서 수행하고 호출 지점 요약만 받으므로, 메인 세션은 깨끗한 상태로 이름 변경 편집에 집중할 수 있습니다. 읽기 전용인 Explore는 탐색 중 실수로 파일을 고칠 위험도 없습니다.
4. **오답** - 창이 커져도 원시 검색 출력이 그대로 쌓이면 주의 분산은 남습니다. 문제는 용량이 아니라 메인 컨텍스트의 신호 대비 소음 비율입니다.

> 💡 **시험 포인트:** "장황한 탐색이 메인 세션을 오염시킨다"는 신호가 보이면 탐색을 서브에이전트(특히 Explore)로 격리하고 요약만 받는 보기가 정답입니다. 컨텍스트를 키우거나 `/compact` 를 반복하는 보기는 오답입니다.

---

## 문제 20
### **[Scenario: Code Generation with Claude Code] Midway through a coherent multi-hour refactor, the session approaches its context limit. The history is full of superseded intermediate diffs, but the current task and goal are unchanged and the latest file states are still valid. What should the developer do to keep going without losing the thread?**

| 보기 | 설명 |
|------|------|
| 1. Start a brand-new session with no prior context and re-describe the entire task, accepting the loss of current file state. | |
| 2. Fork the session to branch off a divergent line of work and continue the refactor in the forked copy of the history. | |
| 3. Request a larger context window and continue as-is, leaving the superseded intermediate diffs sitting in the history. | |
| **4. Run `/compact` to condense the accumulated history into a summary while continuing the same task.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

일관된 흐름으로 몇 시간째 진행 중인 리팩터링 도중 세션이 컨텍스트 한도에 가까워졌습니다. 기록은 이미 폐기된 중간 diff로 가득하지만, 현재 작업과 목표는 그대로이고 최신 파일 상태도 여전히 유효합니다. 맥락을 잃지 않고 작업을 이어 가기 위해 개발자가 해야 할 일은 무엇일까요?

- **①** 이전 컨텍스트가 전혀 없는 완전히 새로운 세션을 시작해 작업 전체를 다시 설명하고, 현재 파일 상태에 대한 맥락을 잃는 것을 감수한다
- **②** 세션을 포크해 갈라지는 작업 갈래로 분기하고, 포크된 기록 사본에서 리팩터링을 이어 간다
- **③** 더 큰 컨텍스트 창을 요청해, 폐기된 중간 diff를 기록에 그대로 둔 채 지금처럼 계속한다
- **④** `/compact` 를 실행해 쌓인 기록을 요약으로 압축하면서 같은 작업을 계속한다

> **핵심 진단:** 작업이 하나의 일관된 흐름이고 목표와 파일 상태가 여전히 유효하다면, 문제는 "맥락이 틀렸다"가 아니라 "쓸모없어진 중간 기록이 공간을 차지한다"는 것입니다. 이럴 때는 **`/compact`** 로 지금까지의 대화를 요약으로 바꿔 공간을 비우고 같은 작업을 이어 가는 것이 맞습니다. 포커스 지시를 함께 주면 요약이 무엇을 남길지 직접 정할 수 있습니다.

```text
/compact 리팩터링 목표, 남은 작업 목록, 확정된 설계 결정, 현재 파일 상태를 남기고 폐기된 중간 diff는 버려 줘
```

Claude Code 문서 기준으로 압축 뒤에도 프로젝트 루트 CLAUDE.md는 디스크에서 다시 주입되고, 세션에서 읽거나 수정한 파일 중 최대 다섯 개를 최근 수정 순으로 다시 읽습니다. 반대로 작업 자체가 바뀌면 `/clear`(빈 컨텍스트로 새 대화), 다른 방향을 따로 시험하려면 `/branch` 같은 분기 기능을 씁니다.

1. **오답** - 새 세션은 이전 도구 결과가 낡았거나 작업 자체가 바뀌었을 때 쓰는 선택입니다. 여기서는 목표와 파일 상태가 모두 유효하므로, 쓸모 있는 맥락까지 버리고 다시 설명하는 비용만 생깁니다.
2. **오답** - 포크는 원래 흐름을 보존한 채 *다른 방향* 을 시도할 때 쓰는 기능입니다. 포크한 사본도 폐기된 diff로 가득한 같은 기록을 그대로 물려받으므로 컨텍스트 압박은 전혀 줄지 않습니다.
3. **오답** - 더 큰 창은 한도를 뒤로 미룰 뿐 쌓인 낡은 diff를 치우지 않습니다. 소음이 계속 남아 주의를 분산시킵니다.
4. **정답** - `/compact` 는 대화를 요약으로 압축해 폐기된 중간 기록의 부담을 덜면서 목표와 유효한 상태는 그대로 이어 갑니다. 같은 작업을 끊김 없이 계속하려는 상황에 정확히 맞는 도구입니다.

> 💡 **시험 포인트:** 같은 작업을 계속하는데 기록만 부풀었다면 `/compact`, 이전 결과가 낡았거나 작업이 바뀌었다면 새 세션, 다른 방향을 따로 시험하려면 포크가 정답입니다. 이 세 가지 구분이 자주 출제됩니다.

---

## 문제 21
### **[Scenario: Code Generation with Claude Code] In a long debugging session Claude repeatedly runs the full test suite; each run dumps roughly 2,000 lines of passing-test noise into the context. Over time Claude starts overlooking the failing-test details and the constraints stated at the start of the session. What is the best fix?**

| 보기 | 설명 |
|------|------|
| **1. Trim each run's output to the failing-test lines before it accumulates, and keep the key constraints in a summary at the top of the context.** | |
| 2. Switch to a larger-context model so all of the test output fits comfortably in the window, however many runs accumulate. | |
| 3. Enable extended thinking so Claude reasons harder over the full accumulated output, including every passing-test line. | |
| 4. Instruct Claude to re-read the entire session history at the start of every turn so the early constraints stay fresh. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

긴 디버깅 세션에서 Claude가 전체 테스트 스위트를 반복해서 실행하는데, 실행할 때마다 통과한 테스트에 관한 소음이 약 2,000줄씩 컨텍스트에 쌓입니다. 시간이 지나자 Claude가 실패한 테스트의 세부 정보와 세션 초반에 밝힌 제약 조건을 놓치기 시작합니다. 가장 좋은 해결책은 무엇일까요?

- **①** 각 실행의 출력이 쌓이기 전에 실패한 테스트 관련 줄만 남도록 잘라 내고, 핵심 제약 조건은 컨텍스트 맨 앞의 요약에 유지한다
- **②** 실행이 아무리 쌓여도 모든 테스트 출력이 창에 넉넉히 들어가도록 컨텍스트가 더 큰 모델로 바꾼다
- **③** extended thinking을 켜서, 통과한 테스트 줄까지 포함한 누적 출력 전체를 Claude가 더 깊이 추론하게 한다
- **④** 초반 제약 조건이 계속 생생하게 유지되도록, 매 턴 시작마다 세션 기록 전체를 다시 읽으라고 Claude에게 지시한다

> **핵심 진단:** 원인은 두 가지가 겹친 컨텍스트 저하입니다. 하나는 장황한 도구 출력이 아무 제한 없이 누적되어 정작 중요한 실패 정보가 소음에 묻히는 것이고, 다른 하나는 초반 제약 조건이 긴 기록의 중간으로 밀려나 덜 주목받게 되는 현상(lost in the middle)입니다. 따라서 **출력이 쌓이기 전에 관련 줄만 남기고**, **핵심 제약은 눈에 띄는 앞쪽 요약 블록으로 고정** 하는 것이 두 원인을 모두 겨냥하는 해법입니다. Claude Code에서는 `PreToolUse` 훅으로 테스트 명령을 실패만 보여 주는 형태로 바꿔 실행하게 할 수 있습니다.

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "~/.claude/hooks/filter-test-output.sh" }] }
    ]
  }
}
```

공식 비용 관리 문서의 예시 스크립트는 `npm test`·`pytest`·`go test` 명령을 감지하면 `updatedInput` 으로 명령 뒤에 `grep -A 5 -E '(FAIL|ERROR|error:)' | head -100` 을 붙여 실패 줄만 컨텍스트에 들어오게 합니다. 테스트 실행 자체를 서브에이전트에 맡기고 실패 요약만 돌려받는 방법도 같은 원리입니다.

1. **정답** - 실패 관련 줄만 남기면 매 실행이 남기던 소음이 사라져 실패 세부 정보가 또렷해지고, 핵심 제약을 앞쪽 요약에 고정하면 기록이 길어져도 묻히지 않습니다. 신호 대비 소음 비율과 정보 배치라는 두 원인을 동시에 고칩니다.
2. **오답** - 창이 커져도 실행마다 2,000줄이 쌓이면 실패 정보는 여전히 소음에 묻히고 주의는 분산됩니다. 문제는 용량이 아니라 신호 대비 소음 비율입니다.
3. **오답** - extended thinking은 같은 소음 가득한 컨텍스트 위에서 더 열심히 추론하게 할 뿐, 소음 자체를 치우지 못합니다. 비용과 지연만 늘어납니다.
4. **오답** - 매 턴 기록 전체를 다시 읽히면 실패 정보를 묻어 버리는 바로 그 혼잡이 오히려 증폭됩니다. 제약을 되살리는 올바른 방법은 요약으로 앞쪽에 고정하는 것입니다.

> 💡 **시험 포인트:** 장황한 도구 출력 때문에 중요한 정보를 놓친다면 "출력이 쌓이기 전에 관련 필드만 남기기 + 핵심 정보는 앞쪽 요약에 고정"이 정답입니다. 더 큰 창, extended thinking, 전체 기록 다시 읽기는 소음을 그대로 두는 오답입니다.

---

## 문제 22
### **[Scenario: Multi-Agent Research System] The synthesis subagent's reports read as generic overviews: in 30% of runs they omit the specific figures and named sources the web-search subagent surfaced. Tracing shows the Task prompt sent to the synthesis subagent contains only the report topic and formatting instructions. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Increase the coordinator's context window so that more of the earlier findings stay resident across delegations | |
| **2. Have the coordinator embed the web-search and document-analysis findings verbatim in the synthesis Task prompt** | |
| 3. Add a 'recall the earlier research' instruction to the synthesis subagent's system prompt so it retrieves prior findings | |
| 4. Give the synthesis subagent its own web-search tool so it can re-gather the missing figures and named sources itself | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

합성(synthesis) 서브에이전트가 만드는 보고서가 일반적인 개요처럼 읽힙니다. 실행의 30%에서 웹 검색 서브에이전트가 찾아낸 구체적인 수치와 출처 이름이 빠져 있습니다. 추적해 보니 합성 서브에이전트에 보내는 Task 프롬프트에는 보고서 주제와 형식 지시만 들어 있습니다. 가장 좋은 해결책은 무엇일까요?

- **①** 위임이 거듭되어도 앞선 발견 사항이 더 많이 남아 있도록 코디네이터의 컨텍스트 창을 늘린다
- **②** 코디네이터가 웹 검색과 문서 분석의 발견 사항을 합성 Task 프롬프트에 원문 그대로 넣게 한다
- **③** 합성 서브에이전트의 시스템 프롬프트에 'recall the earlier research'(앞선 조사를 떠올려라)라는 지시를 추가해 이전 발견 사항을 가져오게 한다
- **④** 합성 서브에이전트에 자체 웹 검색 도구를 주어, 빠진 수치와 출처를 직접 다시 수집하게 한다

> **핵심 진단:** 서브에이전트는 코디네이터의 대화 기록을 물려받지 않습니다. 새로 시작하는 서브에이전트에는 자기 시스템 프롬프트, 도구 정의, CLAUDE.md 같은 기본 설정 외에 **위임 호출(Task, 현재 이름은 Agent 도구)의 프롬프트 문자열** 만 전달되고, 앞서 다른 서브에이전트가 돌려준 결과는 코디네이터가 직접 넣어 주지 않으면 존재하지 않습니다. 그래서 주제와 형식만 받은 합성 서브에이전트는 일반론으로 빈칸을 채울 수밖에 없습니다. 해결책은 코디네이터가 웹 검색·문서 분석 결과를 수치와 출처가 살아 있는 형태 그대로 Task 프롬프트에 담아 넘기는 것입니다.

```python
synthesis_prompt = f"""보고서 주제: {topic}
<web_search_findings>
{web_findings}
</web_search_findings>
<document_analysis_findings>
{doc_findings}
</document_analysis_findings>
형식: {format_rules}
보고서의 모든 수치에는 위 findings의 출처를 함께 적을 것."""
```

Agent SDK 문서도 부모에서 서브에이전트로 넘어가는 내용은 Agent 도구의 프롬프트 문자열뿐이므로, 서브에이전트에 필요한 파일 경로·오류 메시지·결정 사항을 그 프롬프트에 직접 넣으라고 안내합니다(대화를 복사해 시작하는 포크는 예외).

1. **오답** - 코디네이터의 창을 키워도 그 내용이 새로 생성되는 서브에이전트의 컨텍스트로 넘어가지는 않습니다. 정보는 위임 프롬프트로 명시적으로 건네야만 경계를 넘습니다.
2. **정답** - 서브에이전트가 받는 작업 정보는 위임 프롬프트에 담긴 내용뿐이므로, 웹 검색·문서 분석 결과를 원문 그대로 넣어 주면 구체적인 수치와 출처가 보고서에 반영됩니다. 이미 수집한 증거를 재사용하므로 중복 작업도 없습니다.
3. **오답** - 합성 서브에이전트에게는 떠올릴 이전 대화 자체가 없으므로 'recall' 지시는 효과가 없습니다. 오히려 그럴듯한 내용을 지어낼 위험만 커집니다.
4. **오답** - 자체 검색 도구를 주면 이미 수행한 검색을 중복하고, 코디네이터가 모은 증거와 다른 결과로 갈라질 수 있습니다. 역할 범위를 벗어난 과잉 설계입니다.

> 💡 **시험 포인트:** 서브에이전트 결과물에 앞 단계의 정보가 빠져 있으면, 컨텍스트 상속을 기대하는 보기(창 확대, 떠올리라는 지시)가 아니라 "위임 프롬프트에 findings를 명시적으로 넣는" 보기가 정답입니다.

---

## 문제 23
### **[Scenario: Multi-Agent Research System] The coordinator dispatches three independent regional web-search subagents (EU, US, APAC), but issues each Task call only after the previous subagent returns. End-to-end research latency is about 3x the slowest single search. What change most reduces latency?**

| 보기 | 설명 |
|------|------|
| 1. Add a fixed iteration cap so the coordinator stops waiting after a set number of rounds and reports what it has | |
| 2. Merge the three regional searches into one subagent that loops over the regions internally, one after another | |
| **3. Emit all three Task calls together in a single assistant response so the regional subagents run concurrently** | |
| 4. Set tool_choice to 'any' so the coordinator selects its tools faster and skips deliberation between calls | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

코디네이터가 서로 독립적인 지역별 웹 검색 서브에이전트 세 개(EU, US, APAC)에 작업을 배분하는데, 앞선 서브에이전트가 결과를 돌려준 뒤에야 다음 Task 호출을 보냅니다. 전체 조사 지연 시간은 가장 느린 단일 검색의 약 3배입니다. 지연 시간을 가장 크게 줄이는 변경은 무엇일까요?

- **①** 고정 반복 상한을 두어, 정해진 라운드 수가 지나면 코디네이터가 기다리기를 멈추고 그때까지의 결과로 보고하게 한다
- **②** 세 지역 검색을 서브에이전트 하나로 합쳐, 그 안에서 지역을 하나씩 차례로 순회하게 한다
- **③** 세 Task 호출을 하나의 어시스턴트 응답에 함께 내보내, 지역별 서브에이전트가 동시에 실행되게 한다
- **④** `tool_choice` 를 `any` 로 설정해, 코디네이터가 도구를 더 빨리 고르고 호출 사이의 숙고를 건너뛰게 한다

> **핵심 진단:** 병렬 서브에이전트는 코디네이터가 **한 번의 어시스턴트 응답 안에 여러 위임 도구 호출을 함께 내보낼 때** 만들어집니다(위임 도구는 Claude Code v2.1.63부터 `Agent` 로 이름이 바뀌었고 `Task` 는 별칭으로 남아 있습니다). 호출을 턴마다 하나씩 내면 각 호출이 앞선 결과를 기다리므로 전체 지연은 세 검색 시간의 합이 되고, 한 응답에 모아 내면 서로 독립적인 세 검색이 동시에 돌아 전체 지연이 가장 느린 검색 하나 수준으로 줄어듭니다. 세 검색은 서로의 결과에 의존하지 않으므로 병렬화의 전제 조건도 충족합니다.

```json
{"role": "assistant", "content": [
  {"type": "tool_use", "id": "toolu_eu", "name": "Agent", "input": {"subagent_type": "web-search", "prompt": "EU 지역 ..."}},
  {"type": "tool_use", "id": "toolu_us", "name": "Agent", "input": {"subagent_type": "web-search", "prompt": "US 지역 ..."}},
  {"type": "tool_use", "id": "toolu_apac", "name": "Agent", "input": {"subagent_type": "web-search", "prompt": "APAC 지역 ..."}}
]}
```

API 기준으로는 한 응답에 담긴 여러 `tool_use` 블록의 `tool_result` 를 모두 다음 user 메시지 하나에 담아 돌려줘야 병렬 호출 패턴이 유지됩니다. Agent SDK 문서도 여러 서브에이전트를 동시에 돌리면 독립 작업이 전체 합이 아니라 가장 느린 작업의 시간 안에 끝난다고 설명합니다.

1. **오답** - 반복 상한은 기다리는 시간을 줄이는 것이 아니라 중간에 포기하게 만들 뿐이라, 일부 지역 결과가 통째로 빠질 위험이 있습니다. 지연의 원인인 순차 실행은 그대로입니다.
2. **오답** - 하나의 서브에이전트가 지역을 차례로 돌면 병렬성이 완전히 사라지고, 지역별로 특화된 프롬프트와 컨텍스트 분리도 잃습니다. 지연은 줄지 않습니다.
3. **정답** - 서로 독립적인 세 Task 호출을 한 응답에 함께 내면 세 서브에이전트가 동시에 실행되어, 전체 지연이 대략 가장 느린 검색 하나의 시간으로 줄어듭니다.
4. **오답** - `tool_choice` 의 `any` 는 제공된 도구 중 하나를 반드시 쓰라는 강제일 뿐, 서브에이전트를 동시에 실행할지와는 무관합니다. 지연의 원인인 순차 호출 구조를 바꾸지 못합니다.

> 💡 **시험 포인트:** 독립적인 하위 작업의 지연을 줄이는 문제라면 "한 응답에 여러 Task 호출을 함께 내보내 병렬 실행"이 정답입니다. 호출이 턴마다 하나씩 나가면 순차 실행이고, 반복 상한·서브에이전트 병합·`tool_choice` 변경은 병렬성과 무관합니다.

---

## 문제 24
### **[Scenario: Multi-Agent Research System] A newly configured coordinator answers research questions directly from its own knowledge instead of delegating; its attempts to invoke subagents never appear in the trace. The subagent definitions exist and work when tested standalone. What is the root cause?**

| 보기 | 설명 |
|------|------|
| 1. The subagents were registered at user scope while the coordinator runs at project scope, so it cannot see them | |
| 2. The coordinator's model is too small to plan multi-agent delegation, so it falls back to answering directly | |
| 3. tool_choice is forced to a specific tool, which prevents the coordinator from ever choosing to delegate work | |
| **4. The coordinator's allowedTools list omits 'Task', so it has no mechanism to spawn any subagents** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

새로 구성한 코디네이터가 위임하지 않고 자기 지식만으로 조사 질문에 바로 답합니다. 서브에이전트를 호출하려는 시도는 추적 기록에 전혀 나타나지 않습니다. 서브에이전트 정의는 존재하고, 단독으로 테스트하면 정상 동작합니다. 근본 원인은 무엇일까요?

- **①** 서브에이전트는 user 스코프에 등록되었는데 코디네이터는 project 스코프에서 실행되어, 코디네이터가 서브에이전트를 볼 수 없다
- **②** 코디네이터의 모델이 너무 작아 멀티 에이전트 위임을 계획하지 못하고, 그래서 직접 답하는 쪽으로 되돌아간다
- **③** `tool_choice` 가 특정 도구로 강제되어 있어, 코디네이터가 작업을 위임하는 선택을 아예 할 수 없다
- **④** 코디네이터의 `allowedTools` 목록에 `Task` 가 빠져 있어, 서브에이전트를 생성할 수단이 아예 없다

> **핵심 진단:** 코디네이터가 서브에이전트를 띄우는 기본 수단은 **위임 도구(Task, 현재 이름은 Agent)** 입니다. 이 도구가 코디네이터의 도구 구성에 없으면 모델 입장에서는 위임이라는 선택지 자체가 존재하지 않으므로, 오류 없이 조용히 스스로 답하게 됩니다. "위임 시도가 추적에 한 번도 없다"는 증상은 모델이 시도했다가 실패한 것이 아니라 *시도할 수단이 없었다* 는 뜻이고, 서브에이전트 정의가 단독으로는 잘 동작한다는 사실도 문제가 정의가 아니라 코디네이터 쪽 도구 구성에 있음을 가리킵니다.

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Grep", "Agent"],  # 위임 도구 (예전 이름 Task 도 별칭으로 동작)
    agents={"web-search": web_search_def, "synthesis": synthesis_def},
)
```

최신 Agent SDK 문서 기준으로 `allowedTools` 는 "자동 승인" 목록이고, 도구를 모델에게서 아예 빼는 것은 `disallowedTools`(CLI에서는 `--tools`, `--disallowedTools`)입니다. 실무에서는 `system:init` 메시지의 도구 목록(여기서는 `Task` 로 표시됨)에 위임 도구가 있는지, `disallowedTools` 에 `Agent` 가 들어가 있지 않은지를 함께 확인합니다.

1. **오답** - Claude Code에서 user 스코프(`~/.claude/agents/`)에 둔 서브에이전트는 모든 프로젝트에서 쓸 수 있으므로 스코프 차이가 위임을 막는 조건이 아닙니다. 게다가 서브에이전트는 단독 테스트에서 이미 정상 동작했습니다.
2. **오답** - 모델 크기로는 위임 시도가 추적에 *전혀* 없다는 현상을 설명할 수 없습니다. 능력이 부족하다면 서툰 위임 시도라도 나타나야 하는데, 여기서는 위임 기능 자체가 노출되지 않은 것입니다.
3. **오답** - `tool_choice` 가 특정 도구로 강제되어 있다면 그 도구에 대한 호출이 매번 추적에 보였을 것입니다. "도구 호출 없이 조용히 직접 답한다"는 증상과 맞지 않습니다.
4. **정답** - 위임 도구가 코디네이터의 허용 도구에 없으니 서브에이전트를 생성할 방법이 없고, 그래서 오류도 시도 기록도 없이 스스로 답합니다. 관찰된 증상과 정확히 일치하는 원인입니다.

> 💡 **시험 포인트:** "코디네이터가 위임을 전혀 시도하지 않는다(추적에 흔적 없음)"는 신호가 보이면 코디네이터의 도구 구성에 Task(Agent) 도구가 있는지부터 확인하는 보기가 정답입니다. 모델 크기·스코프·`tool_choice` 는 이 증상을 설명하지 못합니다.

---

## 문제 25
### **[Scenario: Multi-Agent Research System] For open-ended briefs like 'assess the competitive landscape for X', the coordinator runs a fixed three-step chain (search then summarize then format). Reviewers note the reports consistently miss emerging subtopics that only surface mid-investigation. What orchestration change best fits this workload?**

| 보기 | 설명 |
|------|------|
| **1. Use dynamic decomposition: the coordinator spawns follow-up subtasks as earlier findings reveal them** | |
| 2. Raise the temperature of the synthesis subagent so that it produces broader, more varied topical coverage | |
| 3. Keep the fixed chain but add a second formatting pass that reorganizes and tightens each report section | |
| 4. Add few-shot examples of well-structured, thorough landscape reports to the formatting step of the chain | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

'assess the competitive landscape for X'(X의 경쟁 구도를 평가하라) 같은 개방형 요청에 대해 코디네이터는 고정된 3단계 체인(검색 → 요약 → 서식 지정)을 실행합니다. 검토자들은 조사 도중에야 드러나는 새로운 하위 주제를 보고서가 일관되게 놓친다고 지적합니다. 이 작업에 가장 잘 맞는 오케스트레이션 변경은 무엇일까요?

- **①** 동적 분해를 쓴다. 앞선 발견이 새로운 하위 작업을 드러내면 코디네이터가 그에 맞는 후속 하위 작업을 생성한다
- **②** 합성 서브에이전트의 `temperature` 를 높여, 더 넓고 다양한 주제를 다루는 결과를 내게 한다
- **③** 고정 체인은 유지하되, 보고서의 각 섹션을 재구성하고 다듬는 두 번째 서식 지정 단계를 추가한다
- **④** 잘 구조화되고 충실한 경쟁 구도 보고서의 few-shot 예시를 체인의 서식 지정 단계에 추가한다

> **핵심 진단:** 고정 체인은 하위 작업을 미리 정해 둘 수 있는 예측 가능한 작업에 맞는 구조입니다. 개방형 조사는 실제로 조사해 봐야 무엇을 더 파야 할지가 드러나므로, 계획에 없던 하위 주제를 구조적으로 따라갈 수 없는 고정 체인으로는 누락을 막을 수 없습니다. **동적 분해** 에서는 코디네이터가 중간 결과를 보고 후속 하위 작업을 새로 만들어 위임하므로, 조사 도중 떠오른 주제도 자연스럽게 범위에 들어옵니다.

```text
코디네이터: 초기 하위 작업 → 시장 규모, 주요 경쟁사, 가격 구조
웹 검색 결과: "신규 규제가 진입 장벽으로 부상"이라는 단서 발견
코디네이터: 후속 하위 작업 추가 → 규제 영향 분석, 경쟁사별 규제 대응 사례
코디네이터: 새 결과에 더 파고들 주제가 없으면 합성 단계로 진행
```

Anthropic의 "Building effective agents" 글도 고정된 하위 작업으로 깔끔하게 나눌 수 있는 일에는 프롬프트 체이닝을, 필요한 하위 작업을 미리 예측할 수 없는 복잡한 일에는 오케스트레이터가 입력에 따라 하위 작업을 정하는 orchestrator-workers 패턴을 권합니다.

1. **정답** - 코디네이터가 앞선 발견에 따라 후속 하위 작업을 생성하므로, 조사 중간에 드러나는 새 주제를 계획에 추가해 따라갈 수 있습니다. 개방형 조사의 커버리지 문제를 구조적으로 해결합니다.
2. **오답** - `temperature` 를 높이면 표현의 무작위성이 늘 뿐, 새 하위 주제를 찾아 조사하는 적응적 깊이가 생기지는 않습니다. 근거 없는 내용이 섞일 위험만 커집니다.
3. **오답** - 서식 단계를 하나 더 두면 표현은 다듬어지지만, 조사 단계에서 애초에 수집하지 않은 하위 주제가 새로 생겨나지는 않습니다.
4. **오답** - few-shot 예시는 출력의 형식과 구조를 일관되게 만드는 도구입니다. 서식 단계에 넣어도 조사 범위는 넓어지지 않습니다.

> 💡 **시험 포인트:** 예측 가능하고 단계가 정해진 작업은 고정 체인, 중간 발견에 따라 계획이 바뀌어야 하는 개방형 조사는 동적 분해가 정답입니다. 서식·예시·`temperature` 같은 출력 쪽 손질은 조사 커버리지 문제를 풀지 못합니다.

---

## 문제 26
### **[Scenario: Multi-Agent Research System] After the shared search and document-analysis phase completes, stakeholders want two report variants from the same evidence — a one-page executive brief and a technical deep-dive — without re-running the costly searches. What is the best way to produce both?**

| 보기 | 설명 |
|------|------|
| 1. Continue the same session, generate the brief first, then ask for the deep-dive in the following turn | |
| **2. Fork the session at the end of the research phase into two branches, one per report variant, sharing the evidence** | |
| 3. Start two fresh sessions and re-run the search subagents in each so that both start from clean state | |
| 4. Increase the context window so that both reports fit within one single long generation pass over the evidence | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

공유 검색·문서 분석 단계가 끝난 뒤, 이해관계자들이 같은 증거로 두 가지 보고서, 즉 한 페이지짜리 임원 요약본과 기술 심층 분석본을 원합니다. 비용이 큰 검색을 다시 실행하지 않고 둘 다 만드는 가장 좋은 방법은 무엇일까요?

- **①** 같은 세션을 이어 가며 먼저 요약본을 만들고, 다음 턴에서 심층 분석본을 요청한다
- **②** 조사 단계가 끝난 시점에서 세션을 보고서 종류별로 하나씩 두 갈래로 포크해, 두 갈래가 증거를 공유하게 한다
- **③** 새 세션 두 개를 시작하고 각각에서 검색 서브에이전트를 다시 실행해, 둘 다 깨끗한 상태에서 시작하게 한다
- **④** 두 보고서가 증거 전체를 한 번 훑는 긴 생성 패스 하나에 함께 들어가도록 컨텍스트 창을 늘린다

> **핵심 진단:** 포크는 원래 세션 기록의 사본으로 시작하는 새 세션을 만들고, 원본 세션의 ID와 기록은 그대로 둡니다. 조사 단계가 끝난 시점에서 포크하면 두 갈래가 **같은 검색·분석 결과를 공유한 채 서로 독립적으로** 각자의 보고서를 만들 수 있으므로, 비싼 검색을 반복하지 않으면서 한쪽 산출물이 다른 쪽에 영향을 주지도 않습니다.

```python
base = research_session_id  # 검색·문서 분석까지 끝난 세션
brief = query(prompt="한 페이지 임원 요약본을 작성해 줘",
              options=ClaudeAgentOptions(resume=base, fork_session=True))
deep = query(prompt="기술 심층 분석 보고서를 작성해 줘",
             options=ClaudeAgentOptions(resume=base, fork_session=True))
```

TypeScript SDK에서는 `forkSession: true`, CLI에서는 `claude --resume <id> --fork-session`, 대화형 세션에서는 `/branch` 로 같은 효과를 냅니다. 포크는 대화 기록을 나눌 뿐 파일 시스템을 나누지는 않으므로, 두 갈래가 같은 파일을 고친다면 서로 영향을 줍니다.

1. **오답** - 한 세션에서 이어 가면 두 산출물이 같은 기록에 얽혀, 심층 분석본이 먼저 만든 요약본의 틀과 강조점에 끌려가기 쉽습니다. 두 변형을 서로 독립적으로 만들 수 없습니다.
2. **정답** - 조사 단계 직후에 포크하면 두 갈래가 모은 증거를 그대로 물려받아 각자 다른 보고서를 만들고, 원본 세션도 보존됩니다. 검색은 한 번만 실행됩니다.
3. **오답** - 새 세션 두 개는 이미 마친 비싼 검색을 두 번이나 다시 돌리는 낭비이고, 검색 결과가 달라져 두 보고서의 근거가 어긋날 수도 있습니다.
4. **오답** - 컨텍스트 창 크기는 같은 기반에서 서로 다른 산출물을 갈라 내는 문제와 관계가 없습니다. 한 번의 생성에 두 보고서를 몰아넣으면 서로 섞일 위험만 커집니다.

> 💡 **시험 포인트:** "같은 기반 상태에서 서로 다른 갈래의 결과가 필요하다"는 신호에는 포크(`fork_session`)가 정답입니다. 반대로 기반 상태 자체가 낡았다면 포크가 아니라 새 세션과 요약 주입이 정답입니다.

---

## 문제 27
### **[Scenario: Multi-Agent Research System] Logs show the document-analysis subagent attempting to invoke the web-search subagent directly to fill gaps, producing routing errors and duplicated searches. How should the topology be corrected?**

| 보기 | 설명 |
|------|------|
| 1. Merge the document-analysis and web-search subagents into one general subagent that handles both kinds of work | |
| 2. Let subagents call each other but add a lock so that two of them can never run the same search at once | |
| **3. Route requests through the coordinator: subagents return gaps to it, and it dispatches follow-up searches** | |
| 4. Give every subagent the full tool set, including search and document tools, so none needs to call another | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

로그를 보면 문서 분석 서브에이전트가 빈 정보를 채우려고 웹 검색 서브에이전트를 직접 호출하려 하고, 그 결과 라우팅 오류와 중복 검색이 발생합니다. 토폴로지를 바로잡는 올바른 방법은 무엇일까요?

- **①** 문서 분석 서브에이전트와 웹 검색 서브에이전트를 두 종류의 작업을 모두 처리하는 범용 서브에이전트 하나로 합친다
- **②** 서브에이전트끼리 서로 호출하게 두되, 두 서브에이전트가 같은 검색을 동시에 실행하지 못하도록 락을 추가한다
- **③** 요청이 코디네이터를 거치게 한다. 서브에이전트는 빈 정보를 코디네이터에 돌려보내고, 코디네이터가 후속 검색을 배분한다
- **④** 모든 서브에이전트에 검색·문서 도구를 포함한 전체 도구 세트를 주어, 어느 서브에이전트도 다른 서브에이전트를 호출할 필요가 없게 한다

> **핵심 진단:** 멀티 에이전트 조사 시스템의 올바른 구조는 **허브 앤 스포크(hub-and-spoke)** 입니다. 서브에이전트는 결과와 "무엇이 부족한지(gaps)"를 코디네이터에게 돌려보내고, 후속 작업을 누구에게 맡길지는 전체 상황을 보는 코디네이터가 결정합니다. 서브에이전트끼리 직접 호출하면 코디네이터가 모르는 작업이 생겨 같은 검색이 중복되고, 라우팅·오류 처리·결과 취합이 여러 곳으로 흩어집니다.

```python
"doc-analysis": AgentDefinition(
    description="문서를 분석해 발견 사항과 부족한 정보(gaps)를 보고",
    prompt="부족한 정보는 직접 찾지 말고 gaps 목록으로 반환할 것.",
    tools=["Read", "Grep"],  # Agent 도구 없음: 다른 서브에이전트를 직접 띄울 수 없음
),
```

최신 Claude Code는 기본적으로 서브에이전트가 자기 서브에이전트를 띄우는 중첩(최대 3단계)을 허용하므로, 이 구조를 강제하려면 서브에이전트의 `tools` 에서 `Agent` 를 빼거나 `disallowedTools` 에 넣고, 필요하면 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 를 `1` 로 설정해 중첩을 끕니다.

1. **오답** - 두 서브에이전트를 합치면 문서 분석과 웹 검색으로 나눈 전문화와 역할 분리가 사라집니다. 범용 에이전트는 도구와 지시가 늘어나 각 작업의 품질도 떨어지기 쉽습니다.
2. **오답** - 락은 중복 실행 하나를 막는 미봉책일 뿐, 코디네이터를 우회하는 잘못된 peer-to-peer 구조를 오히려 정당화하고 굳힙니다. 라우팅 오류의 원인은 그대로 남습니다.
3. **정답** - 서브에이전트가 빈 정보를 코디네이터에 보고하고 코디네이터가 후속 검색을 배분하면, 모든 작업이 한 곳에서 조율되어 라우팅 오류와 중복 검색이 함께 사라집니다.
4. **오답** - 모든 서브에이전트에 전체 도구를 주면 도구가 과다해져 선택 정확도가 떨어지고, 각 서브에이전트가 코디네이터 모르게 검색을 반복하게 됩니다. 오케스트레이션을 우회한다는 문제도 그대로입니다.

> 💡 **시험 포인트:** 서브에이전트 간 직접 호출이나 중복 작업이 보이면 "모든 통신과 후속 작업 배분은 코디네이터를 거친다(허브 앤 스포크)"는 보기가 정답입니다. 락 추가, 에이전트 병합, 전체 도구 부여는 안티패턴입니다.

---

## 문제 28
### **[Scenario: Multi-Agent Research System] A weekly market report is produced by --resume of a named coordinator session. This week the report cites last week's prices as current, because the resumed session replays cached web-search tool results. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Fork the prior session so the stale results are copied into a new branch that continues the report | |
| 2. Keep using --resume but instruct the coordinator to ignore old tool outputs when it writes the report | |
| 3. Increase the context window so that both the old and the new search results can coexist in one session | |
| **4. Start a fresh session, inject a summary of the prior conclusions, and re-run the searches** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

주간 시장 보고서는 이름을 붙여 둔 코디네이터 세션을 `--resume` 으로 재개해 만듭니다. 이번 주 보고서는 지난주 가격을 현재 가격처럼 인용했는데, 재개된 세션이 캐시된 웹 검색 도구 결과를 그대로 되살렸기 때문입니다. 가장 좋은 해결책은 무엇일까요?

- **①** 이전 세션을 포크해, 낡은 결과가 복사된 새 분기에서 보고서 작성을 이어 간다
- **②** `--resume` 은 계속 쓰되, 보고서를 쓸 때 오래된 도구 출력은 무시하라고 코디네이터에 지시한다
- **③** 이전 검색 결과와 새 검색 결과가 한 세션 안에 함께 있을 수 있도록 컨텍스트 창을 늘린다
- **④** 새 세션을 시작해 이전 결론의 요약을 주입하고, 검색을 다시 실행한다

> **핵심 진단:** `--resume` 은 세션의 대화 기록, 즉 프롬프트와 모든 도구 호출·**도구 결과**·응답을 그대로 되살립니다. 지난주에 받은 검색 결과도 그 기록의 일부라서, 재개된 세션의 모델은 그것을 "이미 확인한 사실"로 취급합니다. 도구 결과가 낡았을 때는 기록을 이어 붙일 것이 아니라 **새 세션** 을 시작하고, 지난주 결론처럼 여전히 쓸모 있는 부분만 요약으로 주입한 뒤 검색을 다시 실행해야 최신 데이터에 근거한 보고서가 나옵니다.

```bash
claude -p "$(cat reports/last_week_summary.md)
위는 지난주 보고서의 결론 요약이다. 가격과 지표는 전부 새로 검색해서 이번 주 시장 보고서를 작성해 줘."
```

Agent SDK 세션 문서도 필요한 결과(분석 결과, 결정 사항)를 애플리케이션 상태로 따로 저장해 새 세션의 프롬프트에 넣는 방식이 세션 기록을 옮겨 재개하는 것보다 견고한 경우가 많다고 설명합니다.

1. **오답** - 포크는 원래 세션 기록의 사본으로 시작하므로 낡은 도구 출력까지 새 분기에 그대로 복사됩니다. 문제의 원인을 그대로 들고 가는 셈입니다.
2. **오답** - 프롬프트로 "오래된 결과는 무시하라"고 하는 것은 확률적이라 신뢰할 수 없고, 낡은 결과는 여전히 컨텍스트에 남아 판단을 흐립니다. 어떤 결과가 낡았는지 모델이 매번 정확히 구분한다는 보장도 없습니다.
3. **오답** - 창을 늘리면 낡은 데이터가 그대로 남은 채 새 데이터와 섞여, 어느 가격이 최신인지 혼동만 커집니다.
4. **정답** - 새 세션은 낡은 도구 결과를 아예 가져오지 않고, 요약 주입으로 이전 결론의 연속성은 유지하며, 재검색으로 이번 주 데이터를 확보합니다. 최신성과 연속성을 함께 얻는 방법입니다.

> 💡 **시험 포인트:** 이전 도구 결과가 낡았다면 `--resume` 이나 포크가 아니라 "새 세션 + 이전 결론 요약 주입 + 재조회"가 정답입니다. 기반 상태가 여전히 유효할 때만 재개나 포크가 맞습니다.

---

## 문제 29
### **[Scenario: Multi-Agent Research System] The coordinator's agentic loop sometimes stops before the report subagent has run: it ends whenever the latest assistant text contains the phrase 'research complete'. Intermittently the synthesis subagent uses that phrase mid-analysis, halting the workflow. How should loop termination be driven?**

| 보기 | 설명 |
|------|------|
| **1. Continue the loop while stop_reason is tool_use, appending each tool result, and stop only on end_turn** | |
| 2. Use a stricter regex that also requires the word 'final' next to the phrase before the loop is allowed to stop | |
| 3. Add a minimum iteration count that the coordinator must reach before it is allowed to stop looping | |
| 4. Have a separate classifier judge after every assistant message whether the report is truly finished | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

코디네이터의 에이전트 루프가 보고서 서브에이전트가 실행되기도 전에 멈추는 일이 있습니다. 최신 어시스턴트 텍스트에 'research complete'라는 문구가 들어 있으면 루프를 끝내도록 되어 있기 때문입니다. 간헐적으로 합성 서브에이전트가 분석 도중에 이 문구를 쓰면서 워크플로가 중단됩니다. 루프 종료를 판단하는 올바른 기준은 무엇일까요?

- **①** `stop_reason` 이 `tool_use` 인 동안 각 도구 결과를 추가하며 루프를 계속하고, `end_turn` 일 때만 멈춘다
- **②** 루프가 멈추기 전에 문구 옆에 'final'이라는 단어까지 있어야 하는 더 엄격한 정규식을 쓴다
- **③** 코디네이터가 루프를 멈출 수 있기 전에 반드시 채워야 하는 최소 반복 횟수를 추가한다
- **④** 별도의 분류기가 어시스턴트 메시지마다 보고서가 정말 끝났는지 판단하게 한다

> **핵심 진단:** 루프의 계속·종료는 모델이 쓴 문장이 아니라 **API 응답의 `stop_reason`** 으로 판단해야 합니다. 이 사례에서 'research complete'는 합성 서브에이전트가 분석의 *중간 단계* 를 설명하며 쓴 자연어일 뿐인데, 텍스트 매칭이 이를 워크플로 전체의 완료 신호로 오인했습니다. `stop_reason` 이 `tool_use` 이면 코디네이터가 아직 도구(서브에이전트 호출 포함)를 실행해야 한다는 뜻이므로 결과를 `tool_result` 로 붙여 다시 호출하고, `end_turn` 이 나와야 비로소 그 턴이 끝난 것입니다. 이 신호는 모델의 문구 선택과 무관한 프로토콜 필드라서, 어떤 표현이 등장해도 흔들리지 않습니다.

Agent SDK의 `query()` 를 쓰면 이 루프를 SDK가 대신 돌리고 끝에 결과 메시지(`ResultMessage`)를 내보내므로, 그 위에 텍스트 기반 종료 로직을 덧씌울 이유가 없습니다. `stop_reason` 에는 이 밖에도 `max_tokens`, `pause_turn`, `refusal` 등의 값이 있어 실무에서는 따로 처리합니다.

1. **정답** - `stop_reason` 은 API가 주는 결정적인 종료 신호입니다. `tool_use` 인 동안은 도구 결과를 붙여 계속하고 `end_turn` 에서만 멈추면, 서브에이전트가 어떤 문구를 쓰든 보고서 단계가 실행되기 전에 루프가 끊기지 않습니다.
2. **오답** - 정규식을 더 엄격하게 해도 여전히 어시스턴트의 자연어를 파싱하는 방식이라 취약합니다. 모델이 분석 도중 두 단어를 함께 쓰는 순간 같은 버그가 재발합니다.
3. **오답** - 최소 반복 횟수는 임의의 하한으로 버그를 가릴 뿐입니다. 하한을 넘긴 뒤에는 여전히 문구 때문에 조기 종료되고, 짧게 끝나야 할 작업은 불필요하게 늘어납니다.
4. **오답** - API가 이미 결정적인 종료 신호를 주는데 확률적인 분류기를 추가하는 것은 과잉 설계입니다. 분류기 자체의 오판과 추가 지연·비용도 새로 생깁니다.

> 💡 **시험 포인트:** 특정 문구·정규식·반복 횟수·분류기로 루프 종료를 판단하는 보기는 오답이고, `stop_reason`(`tool_use` → 계속, `end_turn` → 종료)을 쓰는 보기가 정답입니다.

---

## 문제 30
### **[Scenario: Multi-Agent Research System] The synthesis subagent is initialized with the full registry of 18 tools shared across the system (web_search, fetch_url, parse_pdf, extract_tables, generate_chart, render_report, and others). Traces show that in 22% of runs it issues a fresh web_search or parse_pdf call instead of combining the findings the coordinator already passed in its prompt, adding 6-9 s of latency per run. What is the most effective fix?**

| 보기 | 설명 |
|------|------|
| 1. Increase the synthesis subagent's context window so all prior findings fit and it stops re-fetching them from the web. | |
| **2. Limit the synthesis subagent's tool configuration to the few tools its role needs, removing search and parsing tools.** | |
| 3. Add a system-prompt line instructing the synthesis subagent never to call web_search or parse_pdf under any circumstances. | |
| 4. Force tool_choice to "any" so the model commits to exactly one deliberate tool call on every turn it takes. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

합성 서브에이전트가 시스템 전체에서 공유하는 18개 도구 레지스트리(`web_search`, `fetch_url`, `parse_pdf`, `extract_tables`, `generate_chart`, `render_report` 등) 전부를 가진 채 초기화됩니다. 추적 기록을 보면 실행의 22%에서 이 서브에이전트가 코디네이터가 프롬프트로 이미 넘겨준 발견 사항을 종합하는 대신 `web_search` 나 `parse_pdf` 를 새로 호출해, 실행마다 6-9초의 지연을 더합니다. 가장 효과적인 해결책은 무엇일까요?

- **①** 앞선 발견 사항이 모두 들어가 웹에서 다시 가져오지 않도록 합성 서브에이전트의 컨텍스트 창을 늘린다
- **②** 합성 서브에이전트의 도구 구성을 역할에 필요한 소수의 도구로 제한하고, 검색·파싱 도구를 제거한다
- **③** 어떤 경우에도 `web_search` 나 `parse_pdf` 를 호출하지 말라는 문장을 합성 서브에이전트의 시스템 프롬프트에 추가한다
- **④** `tool_choice` 를 `"any"` 로 강제해, 모델이 매 턴 신중하게 고른 도구 호출 하나에 전념하게 한다

> **핵심 진단:** 도구를 과하게 부여하면 도구 선택이 흔들립니다. 18개 도구가 모두 보이는 합성 서브에이전트는 이미 받은 발견 사항으로 충분한 상황에서도 가끔 "한 번 더 확인"하려고 검색·파싱 도구를 고르고, 그만큼 지연과 비용이 붙습니다. 해결책은 서브에이전트 정의에서 **역할에 필요한 도구만 허용 목록으로 지정** 하는 것입니다. 목록에서 뺀 도구는 서브에이전트 세션에 아예 존재하지 않으므로, 잘못된 선택지 자체가 구조적으로 사라집니다(최소 권한 원칙).

```python
"synthesis": AgentDefinition(
    description="코디네이터가 넘긴 findings를 종합해 보고서를 작성",
    prompt="프롬프트로 받은 findings만 근거로 보고서를 작성할 것.",
    tools=["mcp__reports__generate_chart", "mcp__reports__render_report"],
),  # web_search, parse_pdf 등은 목록에 없으므로 호출 자체가 불가능
```

Claude API의 도구 정의 가이드도 관련 작업을 더 적은 도구로 묶으면 선택의 모호함이 줄어든다고 설명합니다. 프롬프트 금지는 확률적인 안내지만, 도구 목록 제한은 결정적인 통제입니다.

1. **오답** - 발견 사항은 이미 프롬프트에 들어 있어 컨텍스트에 충분히 들어갑니다. 넘쳐서가 아니라 모델이 다시 가져오기를 *선택* 하는 것이므로 창 크기는 원인과 무관합니다.
2. **정답** - 역할에 필요한 도구만 남기면 검색·파싱 도구가 서브에이전트에게 아예 보이지 않아, 불필요한 재조회와 그에 따른 6-9초 지연이 구조적으로 사라집니다.
3. **오답** - 시스템 프롬프트의 금지 문구는 비결정적인 안내일 뿐이라 일정 비율로 새어 나갑니다. 22%라는 수치 자체가 프롬프트만으로는 도구 선택을 통제할 수 없다는 증거입니다.
4. **오답** - `tool_choice` 의 `any` 는 제공된 도구 중 하나를 반드시 호출하도록 강제하므로, 도구가 필요 없는 합성 단계에서 오히려 불필요한 호출을 늘립니다. 최신 문서 기준으로 Claude Opus 5.5, Claude Sonnet 5.5 등 일부 모델은 `any` 강제 자체를 지원하지 않습니다.

> 💡 **시험 포인트:** 서브에이전트가 역할과 무관한 도구를 호출하는 증상에는 "역할에 맞게 도구 목록을 제한한다"가 정답입니다. 프롬프트 금지(확률적), 컨텍스트 확대(원인 무관), `tool_choice` 강제(호출 증가)는 오답입니다.

---

## 문제 31
### **[Scenario: Multi-Agent Research System] The document-analysis subagent must call classify_document before running any field extraction, because the extraction schema depends on the detected type. Relying on a prompt instruction, it skips classification in 9% of runs and extracts against the wrong schema. The coordinator invokes it once per document, and the required first step is always the same. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Set tool_choice to "any" so the subagent must use some tool on the opening turn, whichever one it prefers. | |
| 2. Strengthen the system prompt with an emphatic "ALWAYS classify before extracting" rule plus two worked examples. | |
| **3. On the first turn, set tool_choice to {"type":"tool","name":"classify_document"} so classification always runs before extraction.** | |
| 4. Add an interception hook that inspects every extraction call and blocks it whenever no classification has run yet. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

문서 분석 서브에이전트는 추출 스키마가 감지된 문서 유형에 따라 달라지므로, 필드 추출을 하기 전에 반드시 `classify_document` 를 호출해야 합니다. 프롬프트 지시에만 의존하다 보니 실행의 9%에서 분류를 건너뛰고 잘못된 스키마로 추출합니다. 코디네이터는 문서마다 이 서브에이전트를 한 번 호출하며, 필수 첫 단계는 항상 같습니다. 가장 좋은 해결책은 무엇일까요?

- **①** `tool_choice` 를 `"any"` 로 설정해, 서브에이전트가 첫 턴에 어떤 도구든 원하는 것 하나를 반드시 사용하게 한다
- **②** 시스템 프롬프트를 강조형 "ALWAYS classify before extracting" 규칙과 풀이 예시 두 개로 강화한다
- **③** 첫 턴에 `tool_choice` 를 `{"type":"tool","name":"classify_document"}` 로 설정해, 분류가 항상 추출보다 먼저 실행되게 한다
- **④** 모든 추출 호출을 검사해 아직 분류가 실행되지 않았으면 차단하는 가로채기 훅을 추가한다

> **핵심 진단:** "항상 같은 특정 도구가 첫 단계로 실행되어야 한다"는 요구는 프롬프트가 아니라 **API 파라미터** 로 보장해야 합니다. `tool_choice` 를 `{"type": "tool", "name": "classify_document"}` 로 지정하면 모델은 그 턴에 반드시 해당 도구를 호출하므로, 분류 결과 없이 추출이 시작되는 경로 자체가 사라집니다. `"any"` 는 "도구를 하나는 써라"일 뿐 어떤 도구인지는 정하지 않고, 프롬프트 강조는 이미 9% 실패한 확률적 방식입니다. 강제는 첫 턴에만 걸고, 분류 결과를 받은 다음 턴부터는 `auto` 로 되돌려 모델이 알맞은 추출 도구를 고르게 합니다.

```python
first = client.messages.create(  # 첫 턴: 분류 도구 강제
    model=MODEL, tools=tools, messages=messages,
    tool_choice={"type": "tool", "name": "classify_document"})
messages += [assistant_turn(first), run_classify(first)]  # 분류 실행 후 tool_result 추가
nxt = client.messages.create(  # 이후 턴: auto 로 되돌려 추출 도구 선택
    model=MODEL, tools=tools, messages=messages,
    tool_choice={"type": "auto"})
```

최신 문서 기준으로 강제 `tool_choice`(`any`·`tool`)는 모든 환경에서 쓸 수 있는 것은 아닙니다. 수동 extended thinking(`thinking: {type: "enabled"}`)과는 함께 쓸 수 없고 Claude Opus 5.5·Sonnet 5.5 등 일부 최신 모델은 400 오류를 반환하므로, 그런 모델에서는 애플리케이션 코드가 `classify_document` 를 먼저 실행해 결과를 넘기는 식으로 순서를 보장해야 합니다.

1. **오답** - `"any"` 는 "도구를 반드시 하나 호출하라"는 제약일 뿐 어떤 도구인지는 지정하지 않습니다. 모델이 추출 도구를 먼저 골라도 제약은 충족되므로 이번 순서 문제를 해결하지 못합니다.
2. **오답** - 강조 문구와 예시를 늘려도 결국 프롬프트 지시라 확률적입니다. 이미 9%가 실패한 바로 그 방식을 더 세게 반복하는 것에 불과합니다.
3. **정답** - 이름을 지정한 강제 `tool_choice` 는 첫 턴에 `classify_document` 호출을 API 수준에서 보장합니다. 고정된 첫 단계 하나를 가장 직접적이고 가볍게 결정적으로 만드는 방법입니다.
4. **오답** - 훅으로 추출 호출을 막는 방식도 동작은 하지만, 고정된 첫 단계 하나를 위해 여러 도구에 걸친 정책 장치를 만드는 것은 과합니다. 잘못된 호출이 나온 뒤 막는 사후 교정이라, 첫 턴에 올바른 호출을 강제하는 것보다 우회적입니다.

> 💡 **시험 포인트:** 첫 단계가 "항상 같은 특정 도구"이면 이름을 지정한 강제 `tool_choice`(`{"type":"tool","name":...}`)가 답입니다. `"any"` 는 도구 종류를 고정하지 못하고, 훅은 여러 도구에 걸친 정책·차단이 필요할 때 떠올립니다.

---

## 문제 32
### **[Scenario: Multi-Agent Research System] The document-analysis subagent handles mixed inputs: some are PDFs requiring parse_pdf, and some are already plain-text snippets that need no tool at all. It is currently configured with tool_choice "any". Logs show it calling parse_pdf on plain-text inputs — returning garbage — in 18% of cases. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Force tool_choice to the parse_pdf tool so parsing behavior is deterministic for every input the subagent receives. | |
| 2. Keep "any" but add a preprocessing stage that strips plain-text inputs out of the batch before dispatch to the subagent. | |
| 3. Add more few-shot examples of plain-text inputs to the subagent's prompt showing the model answering without parsing. | |
| **4. Set tool_choice to "auto" so the model can respond directly when no tool is required for the input.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

문서 분석 서브에이전트는 섞인 입력을 처리합니다. 일부는 `parse_pdf` 가 필요한 PDF이고, 일부는 이미 일반 텍스트라 도구가 전혀 필요 없는 조각입니다. 현재 `tool_choice` 는 `"any"` 로 설정되어 있습니다. 로그를 보면 18%의 경우에 일반 텍스트 입력에도 `parse_pdf` 를 호출해 엉터리 결과를 돌려줍니다. 가장 좋은 해결책은 무엇일까요?

- **①** `tool_choice` 를 `parse_pdf` 도구로 강제해, 서브에이전트가 받는 모든 입력에서 파싱 동작이 결정적이 되게 한다
- **②** `"any"` 는 유지하되, 서브에이전트로 보내기 전에 일반 텍스트 입력을 배치에서 걸러 내는 전처리 단계를 추가한다
- **③** 모델이 파싱 없이 바로 답하는 일반 텍스트 입력의 few-shot 예시를 서브에이전트 프롬프트에 더 추가한다
- **④** `tool_choice` 를 `"auto"` 로 설정해, 입력에 도구가 필요 없을 때는 모델이 직접 응답할 수 있게 한다

> **핵심 진단:** `tool_choice` 값의 의미를 정확히 구분하는 문제입니다. `"any"` 는 제공된 도구 중 **하나를 반드시** 호출하게 하므로, 도구가 필요 없는 일반 텍스트에서도 모델은 무언가를 호출해야 하고 결국 `parse_pdf` 로 흘러갑니다. `"auto"` 는 도구를 쓸지 말지를 모델이 판단하게 하므로, PDF에는 `parse_pdf` 를 호출하고 텍스트에는 바로 답하는 혼합 입력 역할에 정확히 맞습니다. 원인이 설정 한 줄이므로 해결도 설정 한 줄입니다.

```text
auto  : 도구 사용 여부를 모델이 결정 (tools 를 주면 기본값)
any   : 제공된 도구 중 하나를 반드시 사용 (어떤 도구인지는 모델이 선택)
tool  : 이름을 지정한 도구를 반드시 사용
none  : 도구 사용 금지 (tools 가 없을 때 기본값)
```

`any` 나 `tool` 을 쓰면 API가 assistant 메시지를 미리 채워 도구 사용을 강제하므로, 모델은 `tool_use` 블록 앞에 자연어 설명조차 내지 않습니다. "도구를 쓰지 않는 것"이 정답인 입력이 섞여 있다면 강제 계열 값은 처음부터 맞지 않습니다.

1. **오답** - `parse_pdf` 를 강제하면 텍스트 입력에서 생기던 잘못된 파싱이 18%가 아니라 모든 텍스트 입력에서 일어나게 됩니다. 결정적이긴 하지만 잘못된 동작을 의무화하는 것입니다.
2. **오답** - 전처리로 텍스트를 걸러 내면 증상은 줄지만, 원인인 `"any"` 설정은 그대로 두고 파이프라인에 구성 요소만 하나 더 늘립니다. 한 줄 설정 변경으로 끝날 문제를 엉뚱한 계층에서 처리하는 셈입니다.
3. **오답** - few-shot 예시는 모델의 판단을 유도할 뿐, `"any"` 가 거는 "도구를 반드시 호출하라"는 API 제약을 넘어설 수 없습니다. 예시가 "도구 없이 답하라"고 보여 줘도 설정이 그 선택지를 막고 있습니다.
4. **정답** - `"auto"` 는 도구가 필요할 때만 호출하고 아니면 바로 답하도록 허용하므로, PDF와 일반 텍스트가 섞인 입력에 필요한 유연성을 줍니다. 잘못 걸린 강제를 걷어 내는 최소한의 수정입니다.

> 💡 **시험 포인트:** `tool_choice` 값을 구분하세요. "도구가 필요 없는 입력도 있다"는 신호가 보이면 `auto`, "어떤 도구든 꼭 하나"는 `any`, "특정 도구를 꼭"은 `{"type":"tool","name":...}`, 도구 금지는 `none` 입니다.

---

## 문제 33
### **[Scenario: Multi-Agent Research System] The web-search subagent is equipped with two tools, search_web and search_academic, each carrying a one-line description ("search the web" / "search academic sources"). It routes queries to the wrong tool in 31% of cases — for example, sending peer-reviewed-literature queries to search_web. What is the best first step?**

| 보기 | 설명 |
|------|------|
| **1. Expand and differentiate both tool descriptions with input formats, example queries, source coverage, and clear boundaries.** | |
| 2. Consolidate the two tools into one unified search tool whose single description covers both general web pages and academic sources. | |
| 3. Add a separate router model that classifies each query and then selects the matching search tool programmatically before dispatch. | |
| 4. Set a forced tool_choice so the subagent always uses one designated search tool regardless of the query's topic or type. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

웹 검색 서브에이전트에는 `search_web` 과 `search_academic` 두 도구가 있고, 각각 한 줄짜리 설명("search the web" / "search academic sources")만 붙어 있습니다. 이 서브에이전트는 31%의 경우 쿼리를 잘못된 도구로 보냅니다. 예를 들어 동료 심사 문헌을 찾는 쿼리를 `search_web` 으로 보냅니다. 가장 좋은 첫 단계는 무엇일까요?

- **①** 두 도구 설명을 입력 형식, 예시 쿼리, 다루는 출처 범위, 명확한 사용 경계를 담아 확장하고 서로 구별되게 한다
- **②** 두 도구를 일반 웹 페이지와 학술 출처를 모두 다루는 설명 하나짜리 통합 검색 도구로 합친다
- **③** 각 쿼리를 분류해 디스패치 전에 맞는 검색 도구를 프로그램으로 선택하는 별도 라우터 모델을 추가한다
- **④** 쿼리의 주제나 유형과 관계없이 서브에이전트가 지정된 검색 도구 하나만 항상 쓰도록 강제 `tool_choice` 를 설정한다

> **핵심 진단:** 모델이 어떤 도구를 고를지는 주로 **도구 설명(description)** 에 달려 있습니다. "search the web"과 "search academic sources" 같은 한 줄 설명은 "동료 심사 논문"이나 "최신 뉴스" 같은 쿼리가 어느 쪽에 속하는지 판단할 근거를 거의 주지 않으므로, 31%의 오라우팅은 예상된 결과입니다. 공식 문서도 매우 상세한 설명을 도구 성능에 가장 중요한 요소로 꼽고, 무엇을 하는지·언제 써야 하고 언제 쓰지 말아야 하는지·각 파라미터의 의미·한계를 도구당 최소 3-4문장으로 적으라고 권합니다. 아키텍처를 바꾸기 전에 가장 싸고 직접적인 원인부터 고치는 것이 첫 단계입니다.

```json
{
  "name": "search_academic",
  "description": "Searches peer-reviewed journals, conference papers and preprints. Use for scholarly literature, study results and methodology. Input: keywords, author names or a DOI. Example: 'meta-analysis of remote work productivity 2020-2024'. Do NOT use for news, product pages or general web content; use search_web for those."
}
```

형식이 까다로운 입력이 있는 도구라면 스키마 검증을 거치는 `input_examples` 필드로 예시 입력을 따로 줄 수도 있지만, 공식 문서는 먼저 설명을 충실히 쓰는 것을 우선으로 권합니다.

1. **정답** - 입력 형식, 예시 쿼리, 출처 범위, 두 도구 사이의 경계를 설명에 명시하면 모델이 쿼리 성격에 맞는 도구를 고를 근거가 생깁니다. 도구 선택의 1차 메커니즘을 직접 고치는 가장 저렴한 첫 조치입니다.
2. **오답** - 공식 문서가 관련 작업을 적은 도구로 묶으라고 권하는 것은 `action` 같은 파라미터로 구분을 유지하는 설계를 말하며, 설명 하나로 웹과 학술 출처를 뭉뚱그리면 유용한 구분이 사라집니다. 지금 필요한 것은 병합이 아니라 차별화입니다.
3. **오답** - 별도 라우터 모델은 설명 수정으로 풀릴 문제에 모델 하나와 호출 단계를 더 얹는 과설계입니다. 라우터도 확률적 분류기라 운영 부담만 늘고, 근본 원인인 설명 부족은 그대로 남습니다.
4. **오답** - 올바른 도구가 쿼리마다 달라지는 상황에서 도구 하나로 고정하면, 다른 유형의 쿼리는 모두 틀린 도구로 가게 됩니다. 정적인 강제로는 쿼리별 선택 문제를 풀 수 없습니다.

> 💡 **시험 포인트:** 도구 오선택이 보이면 첫 처방은 도구 설명 보강(무엇을 하는지, 언제 쓰고 언제 쓰지 말지, 입력 형식, 예시)입니다. 라우터 추가, 도구 통합, 강제 `tool_choice` 같은 구조 변경은 그다음이거나 오답입니다.

---

## 문제 34
### **[Scenario: Multi-Agent Research System] The synthesis subagent merges findings from the web-search and document-analysis subagents into a unified narrative but drops the record of which source each claim came from. The report-generation subagent can then no longer attach citations, and 40% of the report's sentences ship uncited. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Have the report-generation subagent re-run web_search for every claim to find a supporting source for each uncited sentence. | |
| **2. Preserve claim-to-source mappings through synthesis so each claim carries its originating sources into report generation.** | |
| 3. Add a citation post-processor that guesses the most likely source for each uncited sentence based on topical similarity. | |
| 4. Instruct synthesis to insert (source) placeholders in the narrative that a human fills in after the report is generated. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

종합(synthesis) 서브에이전트는 웹 검색 서브에이전트와 문서 분석 서브에이전트의 결과를 하나의 서술로 합치지만, 각 주장이 어느 출처에서 왔는지에 대한 기록을 잃어버립니다. 그 결과 보고서 생성 서브에이전트가 더는 인용을 붙일 수 없고, 보고서 문장의 40%가 인용 없이 나갑니다. 가장 좋은 해결책은 무엇일까요?

- **①** 보고서 생성 서브에이전트가 모든 주장에 대해 `web_search` 를 다시 실행해, 인용 없는 문장마다 뒷받침할 출처를 찾게 한다
- **②** 종합 단계를 거치는 동안 주장과 출처의 매핑을 보존해, 각 주장이 원래 출처를 달고 보고서 생성 단계까지 가게 한다
- **③** 주제 유사도를 바탕으로 인용 없는 문장마다 가장 그럴듯한 출처를 추측해 붙이는 인용 후처리기를 추가한다
- **④** 종합 단계가 서술 안에 (source) 자리 표시자를 넣게 하고, 보고서가 생성된 뒤 사람이 채우게 한다

> **핵심 진단:** 출처 정보(provenance)는 나중에 **복원** 하는 것이 아니라 파이프라인 전 구간에서 **보존** 해야 합니다. 종합 단계가 평문 서술만 내보내는 순간 "이 주장은 어느 문서·URL·페이지에서 왔는가"라는 정보가 사라지고, 다음 단계는 어떤 방법을 써도 실제 근거를 되찾을 수 없습니다. 각 주장을 출처 식별자·근거 발췌·날짜와 묶은 구조화된 형태로 넘기면, 보고서 생성 단계는 추측 없이 실제 출처를 인용할 수 있습니다.

```json
{
  "claim": "Remote work raised self-reported productivity by 13%.",
  "sources": [
    {"id": "doc-17", "url": "https://example.org/study.pdf", "page": 4,
     "excerpt": "...a 13% increase in self-reported output...", "published": "2023-05"}
  ]
}
```

원천 문서를 다루는 단계라면 Claude API의 Citations 기능(문서 블록에 `"citations": {"enabled": true}`)을 쓸 수도 있습니다. 응답에 `cited_text` 와 문서 위치가 함께 돌아와, 주장과 근거 구절의 연결을 처음부터 기계적으로 확보할 수 있습니다.

1. **오답** - 주장마다 다시 검색하면 그 주장이 실제로 근거한 출처가 아니라 비슷한 내용의 새 출처를 찾게 될 수 있습니다. 비용도 크고, 결과적으로 원래 근거와 다른 인용을 붙이는 셈입니다.
2. **정답** - 주장과 출처의 매핑을 구조화된 데이터로 끝까지 들고 가면, 보고서 생성 단계가 실제 원천을 그대로 인용할 수 있습니다. 정보가 사라지는 지점인 종합 단계에서 손실 자체를 막는 근본 해결책입니다.
3. **오답** - 주제 유사도로 출처를 추측해 붙이는 것은 출처를 지어내는 것과 같습니다. 그럴듯하지만 틀린 인용은 인용이 없는 것보다 보고서의 신뢰성을 더 해칩니다.
4. **오답** - 자리 표시자는 문제를 사람에게 미룰 뿐이고, 사람이 채우기 전까지 보고서는 기본적으로 인용 없는 상태로 남습니다. 사람도 사라진 출처 정보를 되찾으려면 결국 다시 조사해야 합니다.

> 💡 **시험 포인트:** 멀티 에이전트 파이프라인에서 출처가 사라지는 문제의 답은 "주장-출처 매핑을 구조화해 단계 사이에 그대로 전달"입니다. 재검색, 유사도 추측, 사람에게 미루는 자리 표시자처럼 사후에 복원하려는 보기는 오답입니다.

---

## 문제 35
### **[Scenario: Multi-Agent Research System] Two sources report different market-size figures for the same market — $4.2B (2021 data) versus $6.8B (2023 data). The synthesis subagent silently picks $6.8B and presents it as the single authoritative fact. Reviewers, seeing the discarded figure elsewhere, flag the report as unreliable. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Always keep the larger or more recent figure and drop the other before synthesis so the report states a single clean number. | |
| 2. Average the two figures into a single blended market-size number so the report reflects both sources about equally. | |
| **3. Annotate both figures with source and publication date so the time difference is visible, not read as a conflict.** | |
| 4. Route every conflicting statistic to a human reviewer and block synthesis until the reviewer picks a figure for each one. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

두 출처가 같은 시장에 대해 서로 다른 시장 규모 수치를 보고합니다. 하나는 $4.2B(2021년 데이터), 다른 하나는 $6.8B(2023년 데이터)입니다. 종합 서브에이전트는 아무 표시 없이 $6.8B를 골라 유일한 권위 있는 사실처럼 제시합니다. 검토자들은 버려진 수치를 다른 곳에서 발견하고 이 보고서를 신뢰할 수 없다고 표시합니다. 가장 좋은 해결책은 무엇일까요?

- **①** 보고서가 깔끔한 수치 하나만 말하도록, 종합 전에 항상 더 크거나 더 최신인 수치를 남기고 다른 하나는 버린다
- **②** 보고서가 두 출처를 거의 같은 비중으로 반영하도록, 두 수치를 평균 내 하나의 혼합 시장 규모 수치로 만든다
- **③** 두 수치 모두에 출처와 발행 날짜를 주석으로 달아, 시점 차이가 충돌로 읽히지 않고 그대로 보이게 한다
- **④** 충돌하는 모든 통계를 사람 검토자에게 보내고, 검토자가 각각의 수치를 고를 때까지 종합을 막는다

> **핵심 진단:** 두 수치는 서로 **모순** 이 아니라 **다른 시점** 의 측정값입니다. 2021년의 $4.2B와 2023년의 $6.8B는 둘 다 맞을 수 있고, 함께 보여 주면 시장이 성장했다는 정보까지 전달됩니다. 따라서 해결책은 하나를 고르거나 섞는 것이 아니라, 두 값을 출처·발행(수집) 날짜와 함께 나란히 표기하는 것입니다. 이를 위해서는 서브에이전트들이 구조화된 출력에 출처와 날짜 메타데이터를 정확히 담아 넘기도록 파이프라인을 설계해야 합니다.

```text
시장 규모: $4.2B (출처 X, 2021년 데이터) → $6.8B (출처 Y, 2023년 데이터)
```

날짜를 맞춰 봐도 설명되지 않는 진짜 충돌(같은 연도인데 방법론이 다른 경우 등)이라면, 두 값과 출처를 모두 보존한 채 "상충"으로 표시하고 그런 경우에만 사람 검토로 넘기는 것이 적절합니다.

1. **오답** - 더 크거나 최신인 값만 남기면 출처 정보가 사라지고, 다른 출처가 있다는 사실 자체가 숨겨집니다. 이런 기계적 규칙은 근거가 없어 상황에 따라 그대로 틀린 수치를 남길 수도 있습니다.
2. **오답** - 서로 다른 해의 값을 평균 내면 어느 출처에도 없는 의미 없는 수치가 만들어지고, 출처 추적도 불가능해집니다.
3. **정답** - 두 수치를 출처·날짜와 함께 나란히 보여 주면 차이가 시점 때문이라는 것이 드러나, 검토자가 충돌로 오해하지 않습니다. 정보 손실 없이 사실을 그대로 전달하는 방식입니다.
4. **오답** - 날짜만으로 완전히 설명되는 차이까지 사람에게 보내고 종합을 막는 것은 불필요한 지연과 부담입니다. 에스컬레이션은 날짜와 출처로도 풀리지 않는 진짜 모호한 충돌에 남겨 둬야 합니다.

> 💡 **시험 포인트:** 수치가 다르면 먼저 시점·출처 차이인지 확인하고, 두 값을 출처·날짜 주석과 함께 보존하는 보기를 고르세요. 하나를 조용히 고르거나 평균 내는 보기는 오답이고, 모든 차이를 사람에게 보내는 보기는 과잉 대응입니다.

---

## 문제 36
### **[Scenario: Multi-Agent Research System] The coordinator passes each subagent's output forward verbatim: the web-search subagent's full scraped page bodies — roughly 38k tokens — flow straight into the synthesis subagent's prompt. Synthesis quality has dropped and it now misses findings buried in the middle of the passed-in content (lost-in-the-middle). What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Move synthesis to a larger-context model so all 38k tokens fit comfortably in the prompt and nothing has to be trimmed or reordered. | |
| 2. Keep passing the raw pages but add a prompt instruction telling synthesis to focus on the important parts and ignore boilerplate. | |
| 3. Have synthesis re-fetch and re-summarize each page itself before combining them, so it works from fresh source text each time. | |
| **4. Trim each subagent's output to relevant extracted findings before handoff, and open the synthesis prompt with a key-facts summary under headers.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Context Management & Reliability

**📝 문제 번역**

코디네이터는 각 서브에이전트의 출력을 원문 그대로 다음 단계로 넘깁니다. 웹 검색 서브에이전트가 긁어 온 페이지 본문 전체, 약 38k 토큰이 그대로 종합 서브에이전트의 프롬프트로 들어갑니다. 종합 품질이 떨어졌고, 이제 전달된 내용의 중간에 묻힌 발견 사항을 놓칩니다(lost-in-the-middle). 가장 좋은 해결책은 무엇일까요?

- **①** 종합 단계를 더 큰 컨텍스트의 모델로 옮겨, 38k 토큰 전체가 여유 있게 들어가고 아무것도 잘라 내거나 재배치하지 않아도 되게 한다
- **②** 원본 페이지는 계속 넘기되, 종합 단계에 중요한 부분에 집중하고 상용구는 무시하라는 프롬프트 지시를 추가한다
- **③** 종합 단계가 결합 전에 각 페이지를 직접 다시 가져와 다시 요약하게 해, 매번 새 원문으로 작업하게 한다
- **④** 핸드오프 전에 각 서브에이전트의 출력을 관련 추출 결과로 줄이고, 종합 프롬프트는 헤더 아래 핵심 사실 요약으로 시작한다

> **핵심 진단:** 하위 단계로 넘기는 컨텍스트는 **예산** 을 정해 관리해야 합니다. 원시 페이지 본문 38k 토큰은 대부분 내비게이션, 광고, 상용구처럼 신호가 낮은 내용이라, 정작 중요한 발견 사항이 긴 입력의 중간에 묻혀 주의가 분산됩니다. 해결은 두 갈래입니다. 각 서브에이전트가 핸드오프 전에 출력을 관련 발견 사항(주장, 수치, 출처)만 남도록 줄여 누적량 자체를 막고, 종합 프롬프트는 섹션 헤더 아래 핵심 사실 요약으로 시작해 위치 효과를 상쇄합니다.

```text
<key_facts>
- 발견 사항: … [source: web-03]
- 발견 사항: … [source: doc-11]
</key_facts>
<details agent="web_search"> 서브에이전트별 세부 발견 사항 … </details>
```

공식 장문 컨텍스트 가이드도 여러 문서를 `<document>`·`<source>` 같은 XML 태그로 구조화하고, 긴 자료는 위에 두고 질문·지시는 끝에 두라고 권합니다. 핵심은 창 크기가 아니라 입력의 구성입니다.

1. **오답** - 창이 커져도 신호가 낮은 대량 텍스트로 가득 찬 프롬프트에서는 주의 분산과 lost-in-the-middle이 그대로 일어납니다. 문제는 용량이 아니라 무엇을 어떤 순서로 넣느냐입니다.
2. **오답** - "중요한 부분에 집중하라"는 지시는 모델이 처리해야 하는 노이즈의 양을 전혀 줄이지 못합니다. 중간에 묻힌 정보를 찾아내야 하는 부담은 그대로입니다.
3. **오답** - 다시 가져와 요약하면 이미 한 작업이 중복되고, 줄이려던 원시 분량을 종합 단계로 다시 끌어들입니다. 지연과 비용도 늘어납니다.
4. **정답** - 핸드오프 전에 출력을 관련 발견 사항으로 다듬으면 누적되는 컨텍스트 자체가 줄고, 핵심 요약을 헤더 아래 맨 앞에 두면 위치 효과가 완화됩니다. 신호 대 잡음비와 배치를 함께 고치는 해법입니다.

> 💡 **시험 포인트:** lost-in-the-middle은 용량이 아니라 구성의 문제입니다. "출력을 미리 다듬어 넘기고, 핵심 요약을 앞에 두고, 섹션 헤더로 구조화"가 정답 신호이고, 더 큰 창, "집중하라" 지시, 재수집은 오답입니다.

---

## 문제 37
### **[Scenario: Developer Productivity with Claude] A coordinator agent is asked to produce a migration plan for a 400,000-line legacy billing monolith. The engineer hard-codes an upfront decomposition into five subagent tasks (billing, invoicing, tax, reporting, auth). Production runs show the final plan omits an entire 'dunning' subsystem and a currency-conversion layer that no subagent was ever assigned. What is the most effective decomposition strategy?**

| 보기 | 설명 |
|------|------|
| **1. Run a mapping pass enumerating the repository's real modules, then dynamically spawn one subagent per discovered component** | |
| 2. Raise the coordinator's maximum iteration count so it has more turns to notice the missing subsystems on its own while it works | |
| 3. Expand the fixed list from five to twelve subagent tasks based on the engineer's prior knowledge of the billing domain | |
| 4. Give the coordinator a larger context window so that the entire monolith fits inside one single prompt for analysis | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

코디네이터 에이전트에게 40만 줄짜리 레거시 청구(billing) 모놀리스의 마이그레이션 계획을 만들라는 요청이 들어왔습니다. 엔지니어는 다섯 개 서브에이전트 작업(billing, invoicing, tax, reporting, auth)으로 나누는 분할을 처음부터 하드코딩했습니다. 운영 실행 결과를 보면 최종 계획에서, 어떤 서브에이전트에도 배정되지 않았던 'dunning'(연체 독촉) 하위 시스템 전체와 통화 변환 계층이 빠져 있습니다. 가장 효과적인 분할 전략은 무엇일까요?

- **①** 저장소의 실제 모듈을 열거하는 매핑 단계를 먼저 실행한 뒤, 발견된 구성 요소마다 서브에이전트를 하나씩 동적으로 생성한다
- **②** 코디네이터의 최대 반복 횟수를 늘려, 작업하면서 빠진 하위 시스템을 스스로 알아챌 턴을 더 많이 준다
- **③** 엔지니어가 알고 있는 청구 도메인 지식을 바탕으로 고정 목록을 다섯 개에서 열두 개 서브에이전트 작업으로 늘린다
- **④** 코디네이터에게 더 큰 컨텍스트 창을 줘서 모놀리스 전체가 분석용 프롬프트 하나에 들어가게 한다

> **핵심 진단:** 낯설거나 오래된 코드베이스는 실제 구조를 **미리 알 수 없으므로**, 사람이 정한 정적 분할은 반드시 사각지대를 남깁니다. 이번에 빠진 'dunning'과 통화 변환 계층이 바로 그 사각지대입니다. 올바른 패턴은 "매핑 후 적응형 분할"로, 먼저 저장소를 탐색해 실제 모듈·디렉터리·진입점을 열거하고 그 결과를 기준으로 구성 요소마다 서브에이전트를 배정합니다. 이렇게 하면 커버리지가 엔지니어의 기억이 아니라 코드에 실제로 존재하는 것에 묶입니다.

```text
- 매핑 단계: 모듈·패키지·진입점 목록 생성 (billing, invoicing, tax, dunning, fx, ...)
- 동적 분할: 발견된 구성 요소마다 서브에이전트 생성
- 커버리지 확인: 매핑 목록과 결과를 대조해 빠진 항목이 없는지 검증
- 종합: 코디네이터가 구성 요소별 계획을 하나로 합침
```

Anthropic의 "Building effective agents" 글도 orchestrator-workers 패턴을 "필요한 하위 작업을 미리 예측할 수 없는 복잡한 작업"에 맞는 방식으로 설명하며, 하위 작업이 미리 정해지지 않고 입력에 따라 오케스트레이터가 결정한다는 점을 핵심 차이로 꼽습니다.

1. **정답** - 실제 모듈 구조를 먼저 발견한 뒤 그에 맞춰 분할하므로, 누구도 몰랐던 하위 시스템까지 자연스럽게 커버리지에 들어옵니다. 구조를 모르는 코드베이스에 맞는 탐색 후 동적 분할입니다.
2. **오답** - 반복 횟수를 늘려도 고정된 배정 목록의 커버리지는 바뀌지 않습니다. 어떤 서브에이전트도 'dunning'을 맡지 않는 한, 턴이 늘어도 그 영역은 분석되지 않습니다.
3. **오답** - 다섯 개를 열두 개로 늘려도 여전히 불완전한 사전 지식에 묶인 정적 분할입니다. 빠진 하위 시스템은 애초에 알려지지 않았던 것이라, 기억에서 이름을 더 꺼내도 드러나지 않습니다.
4. **오답** - 실패의 원인은 창 크기가 아니라 분할 커버리지 누락입니다. 40만 줄을 프롬프트 하나에 넣는 것은 현실적이지 않고, 넣더라도 주의 분산으로 분석 품질이 떨어집니다.

> 💡 **시험 포인트:** 구조를 모르는 코드베이스나 레거시 시스템에서 일부 영역이 누락된다면 "먼저 매핑(탐색)하고 발견된 구성 요소를 기준으로 동적 분할"이 답입니다. 고정 목록 확장, 반복 횟수 증가, 더 큰 창은 커버리지 문제를 풀지 못합니다.

---

## 문제 38
### **[Scenario: Developer Productivity with Claude] The coordinator spawns a subagent with a single Task call to trace how a payment webhook propagates through the `orders` module. Logs show the subagent re-runs Grep to rediscover the entrypoint the coordinator had already located two turns earlier, and reaches a conclusion that contradicts the coordinator's established finding. What is the root cause?**

| 보기 | 설명 |
|------|------|
| 1. The subagent's allowedTools list is missing the Task tool, so it cannot delegate the trace any further | |
| **2. Subagents do not inherit the coordinator's conversation; prior findings must be passed in the Task prompt** | |
| 3. The Message Batches API strips prior turns, so the multi-turn context was silently dropped from the trace | |
| 4. tool_choice was set to auto rather than forcing the Grep tool, so the entrypoint was never pinned down | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

코디네이터가 결제 웹훅이 `orders` 모듈을 통해 어떻게 전파되는지 추적하라며 `Task` 호출 한 번으로 서브에이전트를 생성합니다. 로그를 보면 서브에이전트가 코디네이터가 두 턴 전에 이미 찾아 둔 진입점을 다시 찾으려고 `Grep` 을 재실행하고, 코디네이터가 확정한 결과와 모순되는 결론에 도달합니다. 근본 원인은 무엇일까요?

- **①** 서브에이전트의 `allowedTools` 목록에 `Task` 도구가 없어서, 추적을 더 아래로 위임할 수 없다
- **②** 서브에이전트는 코디네이터의 대화를 상속받지 않으므로, 이전 발견 사항은 `Task` 프롬프트에 담아 넘겨야 한다
- **③** Message Batches API가 이전 턴을 제거해, 여러 턴에 걸친 컨텍스트가 추적 과정에서 조용히 빠졌다
- **④** `tool_choice` 가 `Grep` 도구 강제가 아니라 `auto` 로 설정되어 있어, 진입점이 끝내 확정되지 않았다

> **핵심 진단:** 허브 앤 스포크 구조에서 서브에이전트는 **깨끗한 새 컨텍스트** 로 시작합니다. 코디네이터의 대화 기록, 이전 도구 결과, 이미 읽은 파일은 보이지 않고, 부모에서 서브에이전트로 넘어가는 내용은 `Task`(현재 이름 `Agent`) 도구의 프롬프트 문자열뿐입니다. 그래서 코디네이터가 찾아 둔 진입점과 결론을 프롬프트에 적어 주지 않으면, 서브에이전트는 같은 탐색을 반복하고 다른 결론에 도달할 수 있습니다. 해결은 위임 프롬프트에 확정된 사실(파일 경로, 진입점, 이미 내린 결론)과 남은 질문을 명시적으로 담는 것입니다.

```text
Task prompt:
  알려진 사실: 웹훅 진입점은 orders/webhooks/payment.py 의 handle_payment_event()
  확정된 결론: 이벤트는 OrderService.apply_payment() 로 전달됨 (코디네이터 확인)
  할 일: apply_payment() 이후 상태 전이와 후속 이벤트 발행 경로만 추적
  범위 밖: 진입점 재탐색은 불필요
```

Claude Code v2.1.63부터 `Task` 도구 이름이 `Agent` 로 바뀌었고, 기존 `Task(...)` 표기는 별칭으로 계속 동작합니다. 부모 대화를 물려받는 것은 포크(fork)로 띄운 서브에이전트뿐입니다.

1. **오답** - `Task` 도구는 서브에이전트가 또 다른 서브에이전트를 생성할 수 있는지를 좌우할 뿐, 부모 컨텍스트를 물려받는지와는 관계가 없습니다. 하위 위임이 막혀 있다고 해서 이미 찾은 진입점을 다시 찾는 현상이 설명되지는 않습니다.
2. **정답** - 서브에이전트는 위임 프롬프트에 적힌 내용만 알기 때문에, 이전 발견 사항이 빠지면 재탐색과 모순된 결론이 생깁니다. 확정된 사실을 프롬프트에 명시적으로 넘기는 것이 근본 해결입니다.
3. **오답** - 대화형 서브에이전트 위임은 Message Batches API를 거치지 않으므로 이 현상과 무관합니다. Message Batches API는 지연을 감수하는 대량 비동기 처리용입니다.
4. **오답** - `tool_choice` 는 어떤 도구를 호출할지를 정할 뿐, 이전 결론이 서브에이전트에 전달되는지와는 상관이 없습니다. `Grep` 을 강제해도 서브에이전트는 여전히 코디네이터의 발견 사항을 모릅니다.

> 💡 **시험 포인트:** 서브에이전트가 이미 알려진 사실을 다시 탐색하거나 부모와 모순된 결론을 낸다면 원인은 "서브에이전트는 부모 대화를 상속하지 않는다"입니다. 위임 프롬프트에 발견 사항을 명시적으로 담는 보기가 답입니다.

---

## 문제 39
### **[Scenario: Developer Productivity with Claude] An engineer runs `--resume` on a named exploration session from three days ago to continue a refactor. Since then a teammate moved several files and renamed a package. The resumed agent replays cached Read and Grep results from the old history and proposes edits against paths that no longer exist. What is the best way to continue the work?**

| 보기 | 설명 |
|------|------|
| 1. Use --resume but manually enlarge the context window so that more of the stale history is retained anyway | |
| 2. Run fork_session on the three-day-old session to branch the refactor onto a new line of history | |
| **3. Start a fresh session and inject a short summary of prior conclusions, discarding stale tool results** | |
| 4. Re-run the same session with /compact to shrink the stale tool outputs before making any further edits | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agentic Architecture & Orchestration

**📝 문제 번역**

한 엔지니어가 리팩터링을 이어 가려고 사흘 전의 이름 붙은 탐색 세션에 `--resume` 을 실행합니다. 그사이 팀원이 여러 파일을 옮기고 패키지 이름을 바꿨습니다. 재개된 에이전트는 옛 기록에 남아 있는 `Read`·`Grep` 결과를 그대로 재사용해, 더는 존재하지 않는 경로를 대상으로 수정을 제안합니다. 작업을 이어 가는 가장 좋은 방법은 무엇일까요?

- **①** `--resume` 을 쓰되 컨텍스트 창을 수동으로 늘려, 낡은 기록을 어쨌든 더 많이 유지한다
- **②** 사흘 전 세션에 `fork_session` 을 실행해 리팩터링을 새 기록 갈래로 분기한다
- **③** 새 세션을 시작하고 이전 결론의 짧은 요약을 주입하며, 낡은 도구 결과는 버린다
- **④** 추가 수정을 하기 전에 같은 세션을 다시 열어 `/compact` 로 낡은 도구 출력을 줄인다

> **핵심 진단:** 세션은 **대화** 를 저장할 뿐 **파일 시스템** 을 저장하지 않습니다. 재개된 세션에는 사흘 전의 `Read`·`Grep` 결과가 그대로 들어 있지만, 그 결과가 가리키는 파일 트리는 이미 바뀌었으므로 모델은 존재하지 않는 경로를 기준으로 추론합니다. 이전 도구 결과가 낡았을 때는 결론(설계 방향, 결정 사항, 남은 작업)만 요약해 새 세션에 주입하고, 현재 트리는 새로 읽어 근거를 다시 잡는 것이 안전합니다.

```text
새 세션 시작 프롬프트 예:
  이전 결론: 결제 모듈을 adapter 패턴으로 분리하기로 결정, 인터페이스 정의까지 완료
  주의: 사흘 전 이후 파일 이동과 패키지 이름 변경이 있었음, 경로는 모두 새로 확인할 것
  다음 할 일: 현재 트리에서 결제 관련 모듈 위치를 다시 찾은 뒤 구현 단계 진행
```

Agent SDK 문서도 세션은 파일 시스템이 아니라 대화를 저장하고, 포크 역시 대화 기록만 분기한다고 명시합니다. 맥락 대부분이 아직 유효하고 바뀐 파일이 소수라면, 재개한 세션에 어떤 파일이 바뀌었는지 구체적으로 알려 그 부분만 다시 분석하게 하는 방법도 있습니다.

1. **오답** - 문제는 창이 부족한 것이 아니라 낡은 기록이 남아 있는 것입니다. 낡은 도구 결과를 더 많이 유지할수록 잘못된 경로에 근거한 제안만 늘어납니다.
2. **오답** - 포크는 원래 세션의 기록을 복사해 새 세션 ID로 분기하는 기능이라, 낡은 `Read`·`Grep` 결과도 그대로 따라갑니다. 기록의 갈래만 바뀔 뿐 근거는 여전히 사흘 전 상태입니다.
3. **정답** - 유효한 결론만 요약으로 가져가고 낡은 도구 결과는 버린 채 현재 트리를 새로 읽으므로, 옮겨진 파일과 바뀐 패키지 이름을 기준으로 정확하게 작업을 이어 갈 수 있습니다.
4. **오답** - `/compact` 는 지금까지의 대화를 요약해 컨텍스트를 줄일 뿐, 옮겨진 파일을 새로 읽어 대체하지 않습니다. 요약 안에도 옛 경로가 남아 잘못된 수정 제안이 계속됩니다.

> 💡 **시험 포인트:** "코드가 바뀐 뒤 재개한 세션이 낡은 도구 결과로 엉뚱한 경로를 다룬다"는 신호가 보이면 새 세션과 이전 결론 요약 주입이 답입니다. `--resume`, 포크, `/compact` 는 모두 낡은 기록을 어떤 형태로든 그대로 가져갑니다.

---

## 문제 40
### **[Scenario: Developer Productivity with Claude] A security scan flags that the team's committed .mcp.json contains a hardcoded GitHub personal-access token used by an MCP server. The team wants the server config to stay shared and version-controlled, but each engineer (and CI) must supply their own credential without leaking it. What should they do?**

| 보기 | 설명 |
|------|------|
| 1. Encrypt the .mcp.json file and commit the encrypted blob, then decrypt it with a shared key at session start. | |
| 2. Move the server to user-scoped `~/.claude.json` so the token lives only on a single trusted machine per engineer. | |
| 3. Store the token in the project CLAUDE.md so it loads with memory and is easy to rotate across the whole team. | |
| **4. Reference `${GITHUB_TOKEN}` in .mcp.json so each machine and CI job injects its own value at load time.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

보안 스캔 결과, 팀이 커밋한 `.mcp.json` 에 MCP 서버가 쓰는 GitHub 개인 액세스 토큰이 하드코딩되어 있다는 경고가 나왔습니다. 팀은 서버 설정을 계속 공유하고 버전 관리하기를 원하지만, 각 엔지니어(와 CI)는 유출 없이 각자의 자격 증명을 제공해야 합니다. 팀이 해야 할 일은 무엇일까요?

- **①** `.mcp.json` 파일을 암호화해 암호화된 덩어리를 커밋하고, 세션 시작 시 공유 키로 복호화한다
- **②** 서버를 사용자 스코프인 `~/.claude.json` 으로 옮겨, 토큰이 엔지니어마다 신뢰할 수 있는 한 대의 머신에만 있게 한다
- **③** 토큰을 프로젝트 CLAUDE.md에 저장해 메모리와 함께 로드되고 팀 전체에서 쉽게 교체할 수 있게 한다
- **④** `.mcp.json` 에서 `${GITHUB_TOKEN}` 을 참조해, 각 머신과 CI 작업이 로드 시점에 자기 값을 주입하게 한다

> **핵심 진단:** Claude Code는 `.mcp.json` 에서 **환경 변수 확장** 을 지원하므로, 설정 파일은 공유·버전 관리하면서 비밀 값만 각 실행 환경에서 주입할 수 있습니다. `${VAR}` 는 환경 변수 값으로, `${VAR:-default}` 는 변수가 없을 때 기본값으로 확장되며, `command`·`args`·`env`·`url`·`headers` 필드에서 쓸 수 있습니다. 커밋되는 파일에는 변수 이름만 남고, 실제 토큰은 각 엔지니어의 셸 환경과 CI 시크릿에서 로드 시점에 채워집니다.

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://mcp.example.com/github",
      "headers": { "Authorization": "Bearer ${GITHUB_TOKEN}" }
    }
  }
}
```

변수가 설정되지 않았고 기본값도 없으면 설정은 그대로 로드되지만 `claude mcp list` 에 경고가 표시되고 확장되지 않은 `${VAR}` 문자열이 그대로 쓰입니다. 또 이미 커밋된 토큰은 git 이력에 남으므로, 파일을 고치는 것과 별개로 즉시 폐기하고 재발급해야 합니다.

1. **오답** - 암호화된 덩어리를 커밋해도 비밀은 여전히 저장소에 들어 있고, 공유 키를 배포·보관·교체하는 새로운 키 관리 부담이 생깁니다. 공유 키 하나가 새면 모든 자격 증명이 함께 노출됩니다.
2. **오답** - `~/.claude.json` 의 사용자 스코프로 옮기면 토큰은 저장소에서 빠지지만, 서버 설정을 팀이 공유하고 버전 관리해야 한다는 요구 사항을 포기하게 됩니다. 엔지니어마다 설정을 따로 만들어야 하고 CI에도 별도로 넣어야 합니다.
3. **오답** - 프로젝트 CLAUDE.md도 커밋되는 파일이라 평문 토큰이 그대로 VCS에 들어갑니다. 다른 파일에서 똑같이 유출되는 것이고, 토큰이 매 세션 모델 컨텍스트에까지 실립니다.
4. **정답** - `${GITHUB_TOKEN}` 참조만 커밋하면 설정은 공유·버전 관리되고, 실제 값은 각 머신과 CI 작업이 자기 환경에서 주입합니다. 공유 요구와 비밀 분리를 동시에 만족하는 공식 메커니즘입니다.

> 💡 **시험 포인트:** 공유 `.mcp.json` 에 비밀이 필요하면 `${ENV_VAR}`(또는 `${VAR:-default}`) 확장이 답입니다. 사용자·로컬 스코프 MCP 설정은 `~/.claude.json` 에 저장되어 공유되지 않고, 프로젝트 스코프만 `.mcp.json` 으로 버전 관리된다는 구분도 기억하세요.

---

## 문제 41
### **[Scenario: Developer Productivity with Claude] The agent connects to a database MCP server to help engineers query a legacy schema. Traces show that before every real query it fires 6-10 exploratory tool calls (list_tables, describe_table, sample_rows) to rediscover what exists, adding seconds of latency and thousands of tokens per session. The schema changes rarely. What is the best way to reduce this overhead?**

| 보기 | 설명 |
|------|------|
| **1. Expose the schema catalog as an MCP resource that the agent reads once upfront, instead of probing with repeated exploratory tool calls.** | |
| 2. Force tool_choice to "any" so the model commits to a productive tool call sooner instead of exploring first on every turn. | |
| 3. Raise the context window so that more exploratory results fit inside the session without truncation or early summarization. | |
| 4. Add a short-lived cache in front of the query tool so that repeated schema probes return faster on later calls. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

에이전트가 데이터베이스 MCP 서버에 연결해 엔지니어들이 레거시 스키마를 조회하도록 돕습니다. 트레이스를 보면 실제 쿼리를 할 때마다 그 전에 무엇이 있는지 다시 알아내려고 탐색용 도구 호출(`list_tables`, `describe_table`, `sample_rows`)을 6번에서 10번씩 실행해, 세션마다 몇 초의 지연과 수천 토큰이 더해집니다. 스키마는 거의 바뀌지 않습니다. 이 오버헤드를 줄이는 가장 좋은 방법은 무엇일까요?

- **①** 스키마 카탈로그를 MCP 리소스로 노출해 에이전트가 처음에 한 번 읽게 하고, 반복적인 탐색용 도구 호출로 더듬어 찾지 않게 한다
- **②** `tool_choice` 를 `"any"` 로 강제해, 모델이 매 턴 먼저 탐색하는 대신 생산적인 도구 호출에 더 빨리 나서게 한다
- **③** 컨텍스트 창을 늘려, 잘림이나 이른 요약 없이 더 많은 탐색 결과가 세션 안에 들어가게 한다
- **④** 쿼리 도구 앞에 수명이 짧은 캐시를 두어, 반복되는 스키마 탐색이 이후 호출에서 더 빨리 반환되게 한다

> **핵심 진단:** MCP에서 **도구(tool)** 는 동작을 수행하고, **리소스(resource)** 는 모델에게 맥락이 될 데이터를 노출합니다. MCP 스펙은 리소스를 파일, 데이터베이스 스키마, 애플리케이션별 정보처럼 언어 모델에 맥락을 제공하는 데이터로 설명하며, 각 리소스는 URI로 식별되고 클라이언트는 `resources/list`·`resources/read` 로 조회합니다. 거의 바뀌지 않는 스키마 카탈로그를 리소스로 노출하면 에이전트는 처음에 한 번 읽어 재사용하므로, 쿼리마다 "무엇이 있는지"를 알아내려던 탐색 호출이 통째로 사라집니다.

```json
{"jsonrpc": "2.0", "id": 2, "method": "resources/read",
 "params": {"uri": "schema://legacy-db/catalog"}}
```

Claude Code는 서버가 리소스를 지원하면 리소스를 나열하고 읽는 도구(`ListMcpResourcesTool`, `ReadMcpResourceTool`)를 자동으로 제공하고, 사용자는 `@server:protocol://resource/path` 형식의 @ 멘션으로 리소스를 첨부할 수도 있습니다. 드물게 스키마가 바뀌면, 서버는 구독(`resources/subscribe`)한 클라이언트에 `notifications/resources/updated` 알림으로 변경을 알릴 수 있습니다.

1. **정답** - 스키마 카탈로그를 리소스로 한 번 노출하면 에이전트는 이미 무엇이 있는지 알고 바로 실제 쿼리로 들어갑니다. 탐색 호출 패턴 자체를 없애므로 지연과 토큰 낭비가 함께 사라집니다.
2. **오답** - `"any"` 는 도구를 반드시 하나 호출하게 할 뿐이라, `list_tables` 같은 탐색 호출도 그 조건을 그대로 충족합니다. 스키마 정보가 없다는 근본 원인을 건드리지 않으므로 탐색은 줄지 않습니다.
3. **오답** - 창을 늘리면 늘어난 탐색 결과를 담아 둘 수는 있지만, 낭비를 막는 것이 아니라 수용하는 것입니다. 지연과 토큰 비용은 그대로이거나 오히려 늘어납니다.
4. **오답** - 캐시는 중복 탐색의 응답을 빠르게 할 뿐, 모델이 탐색 호출을 보내는 왕복과 그 결과가 컨텍스트에 쌓이는 토큰 비용은 그대로 남습니다. 문제는 개별 호출 속도가 아니라 탐색 패턴 자체입니다.

> 💡 **시험 포인트:** "무엇이 있는지 알아내려는 탐색용 도구 호출이 반복된다"면 콘텐츠 카탈로그(스키마, 인덱스, 파일 목록)를 MCP 리소스로 노출하는 보기가 답입니다. 도구는 동작, 리소스는 읽을 데이터라는 구분을 기억하세요.

---

## 문제 42
### **[Scenario: Developer Productivity with Claude] The team added a code-intelligence MCP server that does semantic, cross-file symbol search over an indexed monorepo. In practice the agent almost always reaches for the built-in Grep tool instead, so it misses semantically related call sites that don't share literal text. The MCP tool's description currently reads only "Search the code index." What is the most effective first step?**

| 보기 | 설명 |
|------|------|
| 1. Remove Grep from the agent's allowedTools so the MCP search tool becomes the only code search option it can use at all. | |
| **2. Enrich the MCP tool description with example queries and a note that it does semantic cross-file search literal matching misses.** | |
| 3. Add a CLAUDE.md rule instructing the agent to never use Grep for any code search anywhere in the monorepo, whatever the task is. | |
| 4. Force tool_choice to the MCP search tool on every turn so the agent can no longer fall back on other built-in tools. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

팀이 인덱싱된 모노레포에서 의미 기반의 파일 간 심볼 검색을 하는 코드 인텔리전스 MCP 서버를 추가했습니다. 그런데 실제로 에이전트는 거의 항상 내장 `Grep` 도구를 쓰기 때문에, 같은 문자열을 공유하지 않는 의미상 관련된 호출 지점을 놓칩니다. 현재 MCP 도구의 설명은 "Search the code index."가 전부입니다. 가장 효과적인 첫 단계는 무엇일까요?

- **①** 에이전트의 `allowedTools` 에서 `Grep` 을 빼서, MCP 검색 도구가 쓸 수 있는 유일한 코드 검색 수단이 되게 한다
- **②** MCP 도구 설명에 예시 쿼리를 넣고, 문자열 매칭이 놓치는 것을 찾는 의미 기반 파일 간 검색이라는 점을 명시한다
- **③** 작업이 무엇이든 모노레포 어디에서도 코드 검색에 절대 `Grep` 을 쓰지 말라는 규칙을 CLAUDE.md에 추가한다
- **④** 매 턴 MCP 검색 도구로 `tool_choice` 를 강제해, 에이전트가 더는 다른 내장 도구로 돌아가지 못하게 한다

> **핵심 진단:** 도구 선택의 1차 근거는 **도구 설명** 입니다. "Search the code index."라는 한 줄은 이 도구가 언제 `Grep` 보다 나은지를 전혀 알려 주지 않으므로, 모델은 동작을 잘 아는 내장 문자열 검색으로 기웁니다. 설명에 "의미 기반·파일 간 심볼 검색이며, 이름이나 문자열이 달라도 관련된 호출 지점과 구현을 찾는다", "정확한 문자열·정규식 검색에는 `Grep` 을 쓴다" 같은 경계와 예시 쿼리를 적으면, 모델이 상황에 따라 두 도구를 올바르게 나눠 씁니다. 금지·제거·강제는 좋은 선택을 가르치지 못하고 정당한 `Grep` 사용까지 막습니다.

```json
{
  "name": "semantic_code_search",
  "description": "Semantic, cross-file symbol search over the indexed monorepo. Finds call sites, implementations and related code even when names or literal text differ (e.g. 'where is payment retry logic triggered?'). Prefer this for conceptual questions; use Grep for exact strings or regex."
}
```

Claude Code에서는 MCP 도구 검색(tool search)이 기본으로 켜져 있어 세션 시작 시 도구 이름과 서버 지시문만 로드되고, 도구 정의는 필요할 때 검색으로 불러옵니다. 문서는 검색될 단어와 핵심 내용을 설명 앞부분에 두라고 권하므로, 빈약한 설명은 선택뿐 아니라 발견 단계에서도 불리합니다.

1. **오답** - `Grep` 을 없애는 것은 과도한 조치입니다. 정확한 문자열 검색이 맞는 작업도 많고, Agent SDK에서 `allowedTools` 는 자동 승인 목록이라 빼도 도구가 사라지지 않습니다(도구 자체를 숨기려면 `disallowedTools` 를 씁니다).
2. **정답** - 예시 쿼리와 "의미 기반 대 문자열 매칭"이라는 명확한 경계를 설명에 넣으면, 모델이 이 도구가 유리한 상황을 알아보고 스스로 선택합니다. 선택 메커니즘 자체를 고치는 가장 가볍고 효과적인 첫 단계입니다.
3. **오답** - CLAUDE.md의 전면 금지 규칙은 각 도구가 언제 유리한지를 알려 주지 않고 좋은 동작까지 막습니다. 게다가 CLAUDE.md는 강제 설정이 아니라 맥락으로 취급되어 지켜진다는 보장도 없습니다.
4. **오답** - 매 턴 `tool_choice` 를 강제하면 정당한 `Grep`·`Read` 사용이 모두 막히고, 올바른 선택을 가르치지도 못합니다. 강제는 "항상 같은 도구"가 정답일 때만 맞는 수단입니다.

> 💡 **시험 포인트:** MCP 도구가 기대만큼 쓰이지 않으면 먼저 도구 설명을 보강하세요(무엇을 하는지, 언제 내장 도구보다 나은지, 예시 쿼리). 도구 제거, 전면 금지, 강제 `tool_choice` 는 첫 단계가 아닙니다.

---

## 문제 43
### **[Scenario: Developer Productivity with Claude] The agent is asked to rename a shared constant throughout a generated client file. Its Edit call fails with a non-unique-match error because the target string appears on many lines that must all be updated consistently, and no single surrounding context makes one occurrence unique. What is the correct way to complete the change?**

| 보기 | 설명 |
|------|------|
| 1. Switch to a Bash sed global substitution that rewrites every occurrence and bypasses the Edit tool entirely. | |
| 2. Retry the identical Edit call with tool_choice forced so it applies despite the ambiguity in the match. | |
| **3. Read the whole file, then Write it back with the change applied, since Edit needs a unique match.** | |
| 4. Delete the file and have the agent regenerate it from scratch using the new constant name throughout. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D2 · Tool Design & MCP Integration

**📝 문제 번역**

에이전트에게 생성된 클라이언트 파일 전체에서 공유 상수의 이름을 바꾸라는 요청이 들어왔습니다. 대상 문자열이 모두 일관되게 바꿔야 하는 여러 줄에 나타나고 어떤 주변 문맥으로도 한 곳만 고유하게 특정할 수 없어서, `Edit` 호출이 고유하지 않은 일치(non-unique match) 오류로 실패합니다. 변경을 완료하는 올바른 방법은 무엇일까요?

- **①** `Bash` 의 `sed` 전역 치환으로 바꿔 모든 위치를 다시 쓰고, `Edit` 도구는 완전히 우회한다
- **②** 일치가 모호해도 적용되도록 `tool_choice` 를 강제한 채 똑같은 `Edit` 호출을 다시 시도한다
- **③** `Edit` 은 고유한 일치가 필요하므로, 파일 전체를 `Read` 한 뒤 변경을 반영해 `Write` 로 다시 쓴다
- **④** 파일을 삭제하고 에이전트가 새 상수 이름을 사용해 처음부터 다시 생성하게 한다

> **핵심 진단:** `Edit` 도구는 정규식이나 퍼지 매칭 없이 `old_string` 을 `new_string` 으로 바꾸는 **정확한 문자열 치환** 이며, `old_string` 은 파일에 정확히 한 번만 나타나야 합니다. 이번처럼 같은 문자열이 여러 곳에 있고 주변 문맥으로도 하나를 특정할 수 없을 때의 정석 대안은, `Read` 로 파일 전체를 읽고 모든 위치를 바꾼 내용을 `Write` 로 통째로 다시 쓰는 것입니다. 내장 파일 도구 흐름 안에 머무르므로 변경 내용을 검토할 수 있고, 관련 없는 내용은 그대로 보존됩니다.

최신 Claude Code 문서 기준으로는 `Edit` 에 `replace_all: true` 옵션이 있어, 같은 문자열이 여러 번 나올 때 모든 위치를 한 번에 바꿀 수 있습니다. 보기에는 없지만 실무에서는 이 옵션이 가장 간단하며, `Write` 를 쓸 때는 전체 내용을 덮어쓰므로(추가·병합하지 않음) 먼저 `Read` 로 현재 내용을 정확히 확보해야 합니다.

1. **오답** - `sed` 로 우회하면 결과는 비슷할 수 있지만, 내장 파일 도구의 검토 가능한 변경 흐름과 안전장치를 벗어납니다. 의도하지 않은 부분 일치까지 바뀌어도 알아채기 어렵습니다.
2. **오답** - `tool_choice` 는 어떤 도구를 호출할지만 정할 뿐 `Edit` 의 일치 규칙을 바꾸지 못합니다. 같은 입력으로 다시 호출하면 같은 오류가 납니다.
3. **정답** - 파일 전체를 읽고 모든 위치를 일관되게 바꾼 내용을 다시 쓰므로, 고유한 기준점이 없어도 변경을 확실하게 끝낼 수 있습니다. `Edit` 의 고유 일치 제약에 대한 정석 폴백입니다.
4. **오답** - 파일을 지우고 재생성하면 이름 변경과 무관한 수작업 수정이 사라질 수 있고, 필요 이상으로 파괴적입니다. 재생성 결과가 원본과 다르게 나올 위험도 있습니다.

> 💡 **시험 포인트:** `Edit` 이 고유하지 않은 일치로 실패하고 주변 문맥으로도 특정할 수 없다면 `Read` + `Write` 폴백이 답입니다. `sed` 우회, `tool_choice` 강제, 삭제 후 재생성은 오답이며, 실무에서는 `replace_all: true` 옵션도 함께 기억해 두세요.

---

## 문제 44
### **[Scenario: Developer Productivity with Claude] An engineer asks the tool to determine which of 30 services emits a particular Kafka event. Answering requires grepping and reading across dozens of files, producing thousands of lines of intermediate tool output. Done inline, this verbose discovery floods the main session's context and later steps degrade from lost-in-the-middle effects. What is the best approach?**

| 보기 | 설명 |
|------|------|
| 1. Increase the main session's context window so that all of the thousands of lines of intermediate tool output fit | |
| 2. Disable Grep and instead Read each candidate file directly in the main session, one service after another | |
| 3. Turn on plan mode so the tool plans the searches before it runs them and waits for approval of that plan | |
| **4. Delegate the discovery to an Explore subagent that returns only the concise finding to the main context** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

한 엔지니어가 도구에게 30개 서비스 중 어느 서비스가 특정 Kafka 이벤트를 발행하는지 알아내 달라고 요청합니다. 답을 찾으려면 수십 개 파일을 grep하고 읽어야 하며, 그 과정에서 수천 줄의 중간 도구 출력이 생깁니다. 이 장황한 탐색을 메인 세션 안에서 바로 하면 메인 세션의 컨텍스트가 넘쳐나고, 이후 단계는 lost-in-the-middle 효과로 품질이 떨어집니다. 가장 좋은 접근 방식은 무엇일까요?

- **①** 수천 줄의 중간 도구 출력이 모두 들어가도록 메인 세션의 컨텍스트 창을 늘린다
- **②** `Grep` 을 끄고, 대신 메인 세션에서 후보 파일을 서비스별로 하나씩 직접 `Read` 한다
- **③** 플랜 모드를 켜서 도구가 검색을 실행하기 전에 계획부터 세우고 그 계획의 승인을 기다리게 한다
- **④** 탐색을 Explore 서브에이전트에 위임하고, 간결한 결론만 메인 컨텍스트로 돌려받는다

> **핵심 진단:** 장황한 탐색은 **격리된 컨텍스트** 에서 해야 합니다. 서브에이전트는 자기만의 새 컨텍스트 창에서 grep과 파일 읽기를 수행하고, 중간 도구 호출과 결과는 그 안에 머문 채 최종 메시지만 부모에게 돌아갑니다. 수천 줄의 탐색 출력 대신 "`order-service` 의 `OrderEventPublisher` 가 `order.created` 를 발행한다" 같은 짧은 결론만 메인 세션에 들어오므로, 이후 단계의 컨텍스트가 깨끗하게 유지됩니다. 내장 Explore 서브에이전트는 바로 이런 파일 탐색·코드 검색을 위한 읽기 전용 에이전트(`Write`·`Edit` 거부)입니다.

Explore를 호출할 때 Claude는 quick(대상 조회), medium(균형 잡힌 탐색), very thorough(종합 분석) 중 하나로 탐색 강도를 지정합니다. 다시 참고하지 않을 검색 결과·로그·파일 내용이 메인 대화를 채울 것 같으면 서브에이전트에 맡기라는 것이 공식 문서의 권장입니다.

1. **오답** - 창을 키워도 출력은 계속 쌓이고 주의가 희석되므로 lost-in-the-middle은 그대로입니다. 홍수를 담아 둘 뿐 막지는 못합니다.
2. **오답** - `Grep` 없이 파일을 하나씩 읽으면 더 느리고, 모든 파일 내용이 메인 컨텍스트에 그대로 쌓여 문제가 오히려 악화됩니다.
3. **오답** - 플랜 모드의 목적은 소스를 수정하기 전에 조사하고 계획을 승인받는 것이라, 이 문제의 핵심인 "탐색 출력을 메인 컨텍스트에서 분리"를 해결하지 않습니다. 검색을 미리 계획해도 실제 검색이 만들어 내는 중간 출력의 양은 그대로입니다.
4. **정답** - Explore 서브에이전트가 자기 컨텍스트에서 장황한 탐색을 끝내고 간결한 답만 돌려주므로, 메인 세션은 깨끗하게 유지되고 이후 단계의 품질도 지켜집니다.

> 💡 **시험 포인트:** "장황한 탐색 출력이 메인 컨텍스트를 오염시킨다"는 신호가 보이면, 탐색을 서브에이전트(Explore)로 격리하고 요약만 돌려받는 보기가 답입니다. 더 큰 창, 직접 읽기, 플랜 모드는 메인 컨텍스트에 쌓이는 출력량을 줄이지 못합니다.

---

## 문제 45
### **[Scenario: Developer Productivity with Claude] A senior engineer added the team's coding-convention instructions to `~/.claude/CLAUDE.md`, and the tool follows them perfectly on her machine. A newly onboarded teammate clones the same repository, but the tool ignores those conventions for him. What is the correct fix?**

| 보기 | 설명 |
|------|------|
| **1. Move the conventions into the project's `.claude/CLAUDE.md` (or root CLAUDE.md) and commit it to version control** | |
| 2. Add the conventions to the teammate's `~/.claude.json` MCP configuration so that they load for him on every session | |
| 3. Convert the conventions into a Skill so they load on demand whenever the tool judges them relevant to the task | |
| 4. Register the conventions in a `.claude/config.json` commands array so that they sync with the repository on clone | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

시니어 엔지니어가 팀의 코딩 규칙 지침을 `~/.claude/CLAUDE.md` 에 추가했고, 그녀의 머신에서는 도구가 그 지침을 완벽하게 따릅니다. 새로 합류한 팀원이 같은 저장소를 클론했지만, 그의 환경에서는 도구가 그 규칙을 무시합니다. 올바른 해결책은 무엇일까요?

- **①** 규칙을 프로젝트의 `.claude/CLAUDE.md`(또는 루트 `CLAUDE.md`)로 옮기고 버전 관리에 커밋한다
- **②** 규칙을 팀원의 `~/.claude.json` MCP 설정에 추가해, 그의 모든 세션에서 로드되게 한다
- **③** 규칙을 스킬(Skill)로 바꿔, 도구가 작업과 관련 있다고 판단할 때마다 필요 시 로드되게 한다
- **④** 저장소를 클론할 때 함께 동기화되도록 규칙을 `.claude/config.json` 의 commands 배열에 등록한다

> **핵심 진단:** CLAUDE.md는 놓인 위치에 따라 **누구와 공유되는지** 가 정해집니다. `~/.claude/CLAUDE.md` 는 "나만, 모든 프로젝트"에 적용되는 사용자 지침이라 저장소와 함께 이동하지 않으므로, 새로 클론한 팀원에게는 처음부터 존재하지 않습니다. 팀이 공유해야 하는 코딩 규칙은 프로젝트 지침인 `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` 에 두고 커밋해야 버전 관리를 통해 모든 팀원에게 전달됩니다.

```text
~/.claude/CLAUDE.md                  사용자 지침: 나만, 모든 프로젝트
./CLAUDE.md, ./.claude/CLAUDE.md     프로젝트 지침: 소스 관리로 팀과 공유
./CLAUDE.local.md                    로컬 지침: 나만, 현재 프로젝트 (.gitignore 에 추가)
```

세션에서 `/context` 를 실행해 Memory files 목록을 보면 어떤 CLAUDE.md가 실제로 로드되었는지 확인할 수 있습니다. 개인 취향은 사용자 지침이나 `CLAUDE.local.md` 에 두고, 팀 규칙은 커밋되는 프로젝트 지침에 둡니다.

1. **정답** - 프로젝트 수준 CLAUDE.md는 저장소에 커밋되어 클론하는 모든 팀원에게 그대로 전달되고, 매 세션 시작 시 로드됩니다. 규칙을 공유 범위에 맞는 위치로 옮기는 근본 해결입니다.
2. **오답** - `~/.claude.json` 은 MCP 서버 설정 같은 Claude Code의 개인 상태를 담는 파일이지 코딩 규칙을 담는 곳이 아니며, 그 자체도 개인 파일이라 팀과 공유되지 않습니다.
3. **오답** - 스킬은 설명만 항상 컨텍스트에 있고 본문은 호출될 때 로드되므로, 항상 적용되어야 할 규칙을 선택적 로드로 바꾸게 됩니다. 게다가 팀에 공유하려면 어차피 `.claude/skills/` 에 커밋해야 합니다.
4. **오답** - Claude Code에는 `.claude/config.json` 의 commands 배열 같은 메커니즘이 없습니다. 팀이 공유하는 프로젝트 설정 파일은 `.claude/settings.json` 이고, 지침은 CLAUDE.md에 둡니다.

> 💡 **시험 포인트:** "내 머신에서는 되는데 새로 클론한 팀원에게는 안 된다"면 사용자 스코프(`~/.claude/...`)에 둔 것이 원인입니다. 팀 공유 지침은 커밋되는 프로젝트 CLAUDE.md(`./CLAUDE.md` 또는 `./.claude/CLAUDE.md`)에 둡니다.

---

## 문제 46
### **[Scenario: Claude Code for Continuous Integration] A CI pipeline calls Claude Code to review each pull request, and a shell gate script greps stdout for the word "CRITICAL" to fail the build. The gate is flaky because Claude phrases severe findings differently each run — "severe issue," "major bug," "critical defect." What is the most effective fix?**

| 보기 | 설명 |
|------|------|
| 1. Add a post-processing library with a synonym dictionary that normalizes severity wording before the grep step runs | |
| **2. Invoke Claude with --output-format json plus a --json-schema so findings are emitted as typed fields the gate reads deterministically** | |
| 3. Instruct the prompt to "always use the exact word CRITICAL for severe issues" and rely on that wording to gate builds | |
| 4. Set temperature to 0 so the phrasing of findings stays stable between runs and the grep matches consistently | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

CI 파이프라인이 Claude Code를 호출해 풀 리퀘스트마다 리뷰를 수행하고, 셸 게이트 스크립트가 stdout에서 "CRITICAL" 이라는 단어를 grep해 빌드를 실패시킵니다. 그런데 Claude가 심각한 발견 사항을 실행할 때마다 "severe issue", "major bug", "critical defect"처럼 다르게 표현하기 때문에 게이트 결과가 들쭉날쭉합니다. 가장 효과적인 해결책은 무엇일까요?

- **①** grep 단계가 실행되기 전에 동의어 사전을 가진 후처리 라이브러리를 추가해 심각도 표현을 정규화한다
- **②** Claude를 `--output-format json` 과 `--json-schema` 로 호출해, 발견 사항이 게이트가 결정적으로 읽을 수 있는 타입 지정 필드로 출력되게 한다
- **③** 프롬프트에 "always use the exact word CRITICAL for severe issues"(심각한 문제에는 항상 CRITICAL이라는 단어를 정확히 쓸 것)라고 지시하고, 그 표현에 의존해 빌드를 판정한다
- **④** temperature를 0으로 설정해 실행 간 발견 사항의 표현이 안정되고 grep이 일관되게 매칭되도록 한다

> **핵심 진단:** 기계가 소비하는 CI 출력은 자연어 *문장* 이 아니라 **스키마로 정의된 구조화 데이터** 여야 합니다. `claude -p` 에 `--output-format json` 과 `--json-schema` 를 함께 주면, 에이전트가 작업을 마친 뒤 스키마에 맞춰 검증된 JSON이 응답의 `structured_output` 필드에 담겨 나옵니다. 게이트는 `severity` 같은 열거형 필드 값만 비교하면 되므로, 모델이 산문에서 어떤 단어를 고르든 판정이 흔들리지 않습니다.

```bash
gh pr diff "$PR_NUMBER" | claude -p "Review this diff and report every finding." \
  --output-format json \
  --json-schema "$(cat .ci/review-schema.json)" > review.json
# 스키마 예: findings[] = {severity: enum ["critical","major","minor"], file, line, message}
jq -e '[.structured_output.findings[] | select(.severity == "critical")] | length == 0' review.json
```

거절 등으로 유효한 구조화 출력 없이 실행이 끝나면 응답에 `structured_output` 필드 자체가 없으므로, 게이트는 필드가 없을 때도 빌드를 실패시키도록(fail-closed) 작성합니다.

1. **오답** - 동의어 사전은 이미 본 표현만 따라잡는 사후 패치라, 모델이 처음 쓰는 표현이 나오면 다시 놓칩니다. 출력을 구조화하면 이런 정규화 계층 자체가 필요 없습니다.
2. **정답** - 출력 계약을 스키마로 고정하면 심각도가 `severity` 필드의 정해진 값으로 나오므로, 게이트가 문자열 매칭 없이 필드 값으로 결정적으로 판정합니다. `--json-schema` 는 비대화형(`-p`) 모드 전용이며 결과는 `structured_output` 에 담깁니다.
3. **오답** - 프롬프트 지시는 대체로 지켜질 뿐 보장은 아니어서 모델이 여전히 다른 표현을 쓸 수 있습니다. 게다가 산문 grep은 리뷰 본문에 `logging.CRITICAL` 같은 코드 문자열이 인용되기만 해도 오탐을 내므로, 단어 하나에 빌드를 거는 구조 자체가 취약합니다.
4. **오답** - temperature는 샘플링의 무작위성을 줄일 뿐 출력 형식을 계약으로 만들어 주지 않습니다. 결과는 여전히 자유 형식 산문이고, PR마다 입력이 다르니 표현도 계속 달라집니다.

> 💡 **시험 포인트:** CI나 스크립트가 Claude 출력을 읽는데 "파싱이 불안정하다"는 신호가 보이면 `--output-format json` + `--json-schema`(API라면 structured outputs나 도구 스키마)로 구조를 강제하는 보기가 정답입니다. 동의어 사전, 프롬프트 강조, temperature 조정은 모두 자연어 파싱을 그대로 두는 오답입니다.

---

## 문제 47
### **[Scenario: Claude Code for Continuous Integration] In the pipeline, the same Claude Code session that generates an implementation also performs the automated review step. It consistently rates its own output clean, yet human reviewers keep finding real bugs it missed. What is the most effective change?**

| 보기 | 설명 |
|------|------|
| 1. Instruct the generating session to "review critically and assume the code contains bugs" before it approves the diff | |
| 2. Enable extended thinking on the generating session before it reviews its own code for defects | |
| **3. Run the review in a separate, independent Claude Code instance that shares no context with the generating session** | |
| 4. Lower the pass threshold so more borderline findings surface in the same session during self-review | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

파이프라인에서 구현을 생성한 바로 그 Claude Code 세션이 자동 리뷰 단계까지 수행합니다. 이 세션은 자기 결과물을 늘 문제없다고 평가하지만, 사람 리뷰어는 세션이 놓친 실제 버그를 계속 찾아냅니다. 가장 효과적인 변경은 무엇일까요?

- **①** 생성 세션이 diff를 승인하기 전에 "review critically and assume the code contains bugs"(비판적으로 리뷰하고 코드에 버그가 있다고 가정하라)라고 지시한다
- **②** 생성 세션이 자기 코드의 결함을 리뷰하기 전에 확장 사고(extended thinking)를 켠다
- **③** 생성 세션과 컨텍스트를 전혀 공유하지 않는 별도의 독립 Claude Code 인스턴스에서 리뷰를 실행한다
- **④** 통과 기준을 낮춰, 같은 세션의 자기 리뷰에서 경계선상의 발견 사항이 더 많이 드러나게 한다

> **핵심 진단:** 코드를 만든 세션의 컨텍스트에는 그 코드를 정당화한 추론과 가정이 고스란히 남아 있습니다. 같은 컨텍스트로 리뷰하면 결함을 만든 바로 그 전제를 다시 "맞다"고 확인하게 되어 맹점이 체계적으로 재현됩니다. 해결책은 프롬프트나 설정이 아니라 **컨텍스트 분리** 입니다. 생성 과정을 본 적 없는 새 인스턴스가 diff만 보고 검토해야 작성자의 가정에 끌려가지 않습니다.

- 생성 단계와 리뷰 단계를 별도의 `claude -p` 호출(새 세션)로 나누고, 리뷰 쪽에서는 생성 세션을 `--continue` 나 `--resume` 으로 이어 받지 않습니다.
- 리뷰 호출에는 diff와 요구 사항(스펙)만 넘기고, 생성 세션의 대화나 자기 설명은 넘기지 않습니다.

Claude Code 모범 사례 문서도 `/code-review` 가 대화를 한 번도 보지 않은 새 서브에이전트에서 diff를 검토하므로 코드를 만든 추론에 흔들리지 않는다고 설명합니다. 읽기 전용 도구만 준 리뷰어 서브에이전트(`.claude/agents/`)를 두는 것도 같은 원리입니다.

1. **오답** - "버그가 있다고 가정하라"는 지시는 태도만 바꿀 뿐, 리뷰어가 여전히 결함을 만든 자기 추론 안에서 생각한다는 구조적 문제를 풀지 못합니다. 억지로 문제를 찾게 하면 진짜 버그 대신 사소한 지적만 늘어날 수도 있습니다.
2. **오답** - 확장 사고는 추론의 깊이를 늘리지만 컨텍스트와 전제는 그대로입니다. 같은 가정 위에서 더 오래 생각해도 같은 맹점에 도달합니다.
3. **정답** - 컨텍스트를 공유하지 않는 독립 인스턴스는 작성자의 가정 없이 diff를 처음 보는 눈으로 검토하므로, 자기 리뷰가 놓치던 결함을 잡아냅니다. 생성과 리뷰의 분리가 자기 검토 편향의 구조적 해결책입니다.
4. **오답** - 기준을 낮추면 민감도만 올라가 잡음이 늘 뿐 관점은 바뀌지 않습니다. 세션이 애초에 문제로 인식하지 못한 버그는 기준을 낮춰도 목록에 오르지 않습니다.

> 💡 **시험 포인트:** "같은 세션이 생성하고 스스로 리뷰한다"와 "자기 결과물을 늘 통과시킨다"는 신호가 함께 보이면 답은 컨텍스트를 공유하지 않는 독립 리뷰 인스턴스입니다. 같은 세션 안에서 프롬프트, 사고 깊이, 임계값만 바꾸는 보기는 모두 오답입니다.

---

## 문제 48
### **[Scenario: Claude Code for Continuous Integration] Locally, the author's Claude generates tests that follow team conventions (naming, arrange-act-assert structure). In CI on a clean checkout, the generated tests ignore those conventions. The conventions are documented only in the author's `~/.claude/CLAUDE.md`. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Pass the conventions as a --system-prompt argument in the CI command on every run of the test-generation job | |
| 2. Add the conventions to the CI build server's `~/.claude/CLAUDE.md` so the runner picks them up on each job | |
| 3. Reproduce the author's local machine environment, including home-directory config, inside the CI job container | |
| **4. Move the conventions into the project's committed .claude/CLAUDE.md so each checkout, local or CI, loads them** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

로컬에서는 작성자의 Claude가 팀 컨벤션(이름 규칙, arrange-act-assert 구조)을 따르는 테스트를 생성합니다. 그런데 깨끗한 체크아웃 상태의 CI에서는 생성된 테스트가 이 컨벤션을 무시합니다. 컨벤션은 작성자의 `~/.claude/CLAUDE.md` 에만 문서화되어 있습니다. 가장 좋은 해결책은 무엇일까요?

- **①** 테스트 생성 job을 실행할 때마다 CI 명령에서 컨벤션을 `--system-prompt` 인자로 넘긴다
- **②** CI 빌드 서버의 `~/.claude/CLAUDE.md` 에 컨벤션을 추가해, 러너가 job마다 이를 읽게 한다
- **③** 홈 디렉터리 설정을 포함한 작성자의 로컬 머신 환경을 CI job 컨테이너 안에 그대로 재현한다
- **④** 컨벤션을 커밋되는 프로젝트의 `.claude/CLAUDE.md` 로 옮겨, 로컬이든 CI든 모든 체크아웃에서 로드되게 한다

> **핵심 진단:** CLAUDE.md는 위치에 따라 **스코프** 가 다릅니다. `~/.claude/CLAUDE.md` 는 "나 혼자, 모든 프로젝트"에 적용되는 사용자 스코프라 저장소에 들어가지 않고, `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` 는 소스 관리를 통해 팀 전체가 공유하는 프로젝트 스코프입니다. 깨끗한 CI 체크아웃에는 작성자의 홈 디렉터리가 없으니 컨벤션이 사라지는 것이 당연합니다. 팀 공통 규칙은 프로젝트 파일에 커밋해야 로컬, CI, 모든 팀원이 같은 지침을 받습니다.

```text
~/.claude/CLAUDE.md     사용자 스코프: 나만, 모든 프로젝트 (저장소 밖)
./CLAUDE.md             프로젝트 스코프: 소스 관리로 팀 공유 (커밋)
./.claude/CLAUDE.md     프로젝트 스코프: 소스 관리로 팀 공유 (커밋)
./CLAUDE.local.md       개인용 프로젝트 메모 (.gitignore 에 추가)
```

참고로 최신 문서는 CI처럼 어느 머신에서나 같은 결과가 필요한 곳에 `--bare` 를 권하는데, `--bare` 는 CLAUDE.md 자동 로드도 건너뜁니다. 그렇게 실행한다면 커밋된 같은 파일을 `--append-system-prompt-file` 로 넘겨, 지침의 원본은 계속 저장소 한 곳에 둡니다.

1. **오답** - 지침이 저장소 밖 CI 명령 문자열에 묶여 버전 관리와 리뷰가 되지 않고, 로컬 사용자나 다른 팀원에게도 전달되지 않습니다. 게다가 `--system-prompt` 는 Claude Code의 기본 시스템 프롬프트 전체를 교체하므로, 규칙을 덧붙이려는 의도라면 부작용까지 생깁니다.
2. **오답** - 빌드 서버 한 대의 사용자 스코프 파일에 지침을 숨겨 두는 것이라 여전히 버전 관리되지 않고 팀원에게 보이지 않으며, 러너가 바뀌면 다시 사라집니다.
3. **오답** - 한 사람의 홈 디렉터리 설정까지 복제하는 것은 과도하고 재현성도 떨어집니다. 원인은 환경 차이가 아니라 지침이 공유되는 프로젝트 스코프에 없다는 점입니다.
4. **정답** - 프로젝트 `.claude/CLAUDE.md` 는 커밋되어 모든 클론에 함께 따라오므로, CI의 깨끗한 체크아웃에서도 자동으로 로드됩니다. 컨벤션이 코드와 함께 버전 관리되고 리뷰되는 단일 출처가 됩니다.

> 💡 **시험 포인트:** "로컬에서는 되는데 CI나 다른 팀원 환경에서는 안 된다"와 `~/.claude/` 가 함께 보이면 사용자 스코프 문제이므로, 커밋되는 프로젝트 스코프(`./CLAUDE.md` 또는 `./.claude/CLAUDE.md`)로 옮기는 보기가 정답입니다. 서버별 설정, 환경 복제, 명령 플래그 주입은 오답입니다.

---

## 문제 49
### **[Scenario: Claude Code for Continuous Integration] The project's always-loaded CLAUDE.md has grown to embed a long, detailed code-review rubric. That rubric is needed only by the review job, but it is now injected into every CI job — test generation, doc updates — inflating token cost and diluting the model's focus on those tasks. What is the best fix?**

| 보기 | 설명 |
|------|------|
| **1. Move the review rubric into an on-demand Skill under .claude/skills so only the review job loads it** | |
| 2. Split CLAUDE.md into two files and symlink the right one into place per job before each run starts | |
| 3. Keep the rubric in CLAUDE.md but wrap it in comment markers so it is visually separated from other rules | |
| 4. Delete the rubric from CLAUDE.md and inline its full text into each review command invocation by hand | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code Configuration & Workflows

**📝 문제 번역**

프로젝트의 항상 로드되는 CLAUDE.md에 길고 상세한 코드 리뷰 루브릭이 들어가 비대해졌습니다. 이 루브릭은 리뷰 job에서만 필요한데, 지금은 테스트 생성이나 문서 업데이트 같은 모든 CI job에 주입되어 토큰 비용을 부풀리고 해당 작업에 대한 모델의 집중을 흐리고 있습니다. 가장 좋은 해결책은 무엇일까요?

- **①** 리뷰 루브릭을 `.claude/skills` 아래의 온디맨드 스킬로 옮겨 리뷰 job만 이를 로드하게 한다
- **②** CLAUDE.md를 두 파일로 나누고, 매 실행이 시작되기 전에 job별로 맞는 파일을 심볼릭 링크로 배치한다
- **③** 루브릭은 CLAUDE.md에 그대로 두되 주석 표시로 감싸 다른 규칙과 시각적으로 구분한다
- **④** CLAUDE.md에서 루브릭을 지우고, 리뷰 명령을 호출할 때마다 그 전문을 직접 인라인한다

> **핵심 진단:** CLAUDE.md는 **모든 세션에 항상** 로드되는 컨텍스트이므로, 특정 job에만 필요한 긴 지침을 넣으면 무관한 실행마다 토큰 비용과 주의 분산을 치릅니다. 스킬은 반대로, 평소에는 이름과 설명만 컨텍스트에 있고 **본문은 호출될 때만** 로드됩니다. 그래서 "모든 세션에서 지킬 짧은 사실과 규칙은 CLAUDE.md, 특정 작업에만 필요한 긴 절차와 기준은 스킬"로 나누는 것이 공식 문서가 권하는 구성입니다.

```yaml
# .claude/skills/review-rubric/SKILL.md 의 frontmatter 키 (본문에 상세 루브릭)
name: review-rubric
description: PR 코드 리뷰에 적용할 팀 루브릭. 리뷰 job에서만 사용한다.
disable-model-invocation: true
```

리뷰 job은 `claude -p "/review-rubric ..."` 처럼 프롬프트에 `/스킬이름` 을 넣어 명시적으로 불러옵니다. `disable-model-invocation: true` 를 두면 다른 job에서 Claude가 스스로 이 스킬을 불러오는 일도 막을 수 있습니다.

1. **정답** - 스킬 본문은 호출될 때만 컨텍스트에 들어오므로, 리뷰 job은 루브릭을 온전히 쓰고 나머지 job은 그 비용을 내지 않습니다. 루브릭은 저장소에 커밋된 파일로 계속 버전 관리됩니다.
2. **오답** - job마다 파일을 바꿔 끼우는 심볼릭 링크는 CI 스크립트에 숨은 상태를 만들고, 공통 규칙을 두 파일에 중복시켜 동기화가 깨지기 쉬운 편법입니다.
3. **오답** - 주석 표시는 사람이 보기 편하게 구분할 뿐 "필요한 job에서만 로드"라는 요구를 충족하지 못합니다. 일반적인 구분 표시라면 내용이 그대로 모든 job에 로드되고, 블록 단위 HTML 주석(`<!-- -->`)으로 감싸면 최신 문서 기준 주입 전에 제거되어 리뷰 job조차 루브릭을 받지 못합니다.
4. **오답** - 전문을 명령마다 붙여 넣으면 버전 관리되는 단일 출처가 사라지고 명령 정의만 비대해집니다. 루브릭을 고칠 때마다 모든 호출 지점을 손봐야 합니다.

> 💡 **시험 포인트:** "항상 로드되는 CLAUDE.md가 특정 작업 전용 내용으로 비대해졌다"는 신호가 보이면 그 내용을 온디맨드 스킬(`.claude/skills/<이름>/SKILL.md`)로 옮기는 보기가 정답입니다. 파일 바꿔 끼우기, 서식만 바꾸기, 수동 인라인은 오답입니다.

---

## 문제 50
### **[Scenario: Claude Code for Continuous Integration] The CI reviewer posts naming-convention and style comments, but developers report that roughly 60% of these particular comments are wrong or trivial. They have started ignoring the bot entirely — including its genuine security findings. What is the most effective response?**

| 보기 | 설명 |
|------|------|
| 1. Add a single global confidence threshold so only comments the model rates above 0.8 are posted to the pull request | |
| **2. Temporarily disable the naming-convention category and rewrite its prompt with explicit rules before re-enabling** | |
| 3. Route every comment through a human moderation queue before it is posted, so a reviewer approves each one first | |
| 4. Train a sentiment classifier on developer reactions and suppress whichever categories draw negative responses overall | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

CI 리뷰어가 이름 규칙과 스타일에 관한 코멘트를 다는데, 개발자들은 바로 이 범주의 코멘트 중 약 60%가 틀렸거나 사소하다고 보고합니다. 개발자들은 이제 진짜 보안 발견 사항까지 포함해 봇을 통째로 무시하기 시작했습니다. 가장 효과적인 대응은 무엇일까요?

- **①** 모델이 0.8 초과로 평가한 코멘트만 풀 리퀘스트에 게시되도록 단일 전역 신뢰도 임계값을 추가한다
- **②** 이름 규칙 범주를 일시적으로 비활성화하고, 명시적 규칙으로 그 프롬프트를 다시 작성한 뒤 다시 활성화한다
- **③** 모든 코멘트를 게시 전에 사람 검수 대기열로 보내, 리뷰어가 하나씩 먼저 승인하게 한다
- **④** 개발자 반응으로 감성 분류기를 학습시켜, 전반적으로 부정적인 반응을 끄는 범주를 숨긴다

> **핵심 진단:** 오탐이 많은 범주 하나가 **리뷰어 전체에 대한 신뢰** 를 무너뜨리고, 그 피해는 보안 발견처럼 정상적인 범주까지 번집니다. 그래서 먼저 문제 범주만 운영에서 내려 신뢰 손실을 멈추고, 그 범주의 기준을 "무엇은 지적하고 무엇은 넘어가는지"가 분명한 명시적 규칙으로 다시 쓴 다음, 정밀도를 확인하고 다시 켜는 것이 근본 해결입니다. 범주 단위로 문제를 격리하므로 건강한 범주의 지적은 그대로 살아남습니다.

- 끄기: 이름 규칙 범주만 비활성화하고 보안과 정확성 범주는 계속 게시합니다.
- 고치기: 어떤 경우에 지적하고 어떤 경우는 넘어가는지를 구체적 규칙과 예시로 적습니다(예: 린터가 이미 잡는 항목은 제외).
- 검증 후 재활성화: 과거 PR로 해당 범주의 정밀도를 측정해 기준을 넘을 때만 다시 켭니다.

Claude Code 모범 사례 문서도 리뷰 프롬프트에 `skip style` 같은 제외 지시를 남겨 두라고 권합니다. 문제를 찾으라고 하면 리뷰어는 언제나 *무언가* 를 찾아내기 때문입니다.

1. **오답** - 모델이 스스로 매긴 신뢰도는 보정이 잘 되어 있지 않아 기준선으로 믿기 어렵고, 전역 임계값은 건강한 범주의 좋은 지적까지 함께 걸러 냅니다. 문제 범주의 잘못된 정의는 그대로 남습니다.
2. **정답** - 문제 범주만 잠시 내려 신뢰가 더 깎이는 것을 즉시 막고, 명시적 기준으로 프롬프트를 고쳐 오탐의 원인 자체를 없앤 뒤 다시 켭니다. 그동안 다른 범주의 가치 있는 발견은 계속 전달됩니다.
3. **오답** - 모든 코멘트를 사람이 승인하면 자동화의 의미가 사라지고 병목이 생기며, 시끄러운 프롬프트 자체는 고쳐지지 않습니다.
4. **오답** - 개발자 반응을 학습하는 감성 분류기는 증상(불만)만 다루는 과잉 설계이고, 잘못 정의된 범주 기준을 바로잡지 못합니다. 보안 지적처럼 불편하지만 중요한 코멘트가 부정적 반응을 받아 숨겨질 위험도 있습니다.

> 💡 **시험 포인트:** "특정 범주의 오탐 때문에 봇 전체가 무시된다"는 신뢰 붕괴 패턴이 보이면 '그 범주만 일시 비활성화하고 명시적 기준으로 프롬프트를 재작성'하는 보기가 정답입니다. 전역 신뢰도 임계값, 전수 사람 검수, 반응 기반 분류기는 오답입니다.

---

## 문제 51
### **[Scenario: Claude Code for Continuous Integration] The CI reviewer handles clear-cut defects well but is inconsistent on genuinely ambiguous cases — for example, whether a bare `except:` is acceptable in a one-off script versus a shared library. Enumerating every possible scenario in the prompt is impractical. What is the best approach?**

| 보기 | 설명 |
|------|------|
| 1. Write an exhaustive list in CLAUDE.md of every code pattern and the correct verdict for each one | |
| 2. Fine-tune a dedicated model on the team's full history of past review decisions and deploy it | |
| **3. Add two to four few-shot examples of representative ambiguous cases, each with the reasoning behind its verdict** | |
| 4. Lower the bar so every borderline case is flagged and pushed to a human reviewer for a decision | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

CI 리뷰어는 명백한 결함은 잘 처리하지만, 진짜로 모호한 사례(예: 맨 `except:` 가 일회성 스크립트에서와 공유 라이브러리에서 각각 허용 가능한지)에서는 판정이 일관되지 않습니다. 가능한 모든 시나리오를 프롬프트에 나열하는 것은 비현실적입니다. 가장 좋은 접근법은 무엇일까요?

- **①** CLAUDE.md에 모든 코드 패턴과 각각의 올바른 판정을 망라한 목록을 작성한다
- **②** 팀의 과거 리뷰 결정 이력 전체로 전용 모델을 파인튜닝해 배포한다
- **③** 대표적인 모호 사례 2–4개를 few-shot 예시로 추가하고, 각 예시에 판정의 근거가 된 추론을 함께 적는다
- **④** 기준을 낮춰 모든 경계 사례를 표시하고 사람 리뷰어에게 넘겨 결정하게 한다

> **핵심 진단:** 규칙으로 다 적을 수 없는 **판단의 경계** 는 잘 고른 소수의 예시와 그 *이유* 로 가르치는 것이 가장 효과적입니다. 판정만 있는 예시는 표면 패턴을 외우게 하지만, "왜 이 판정인가"가 붙은 예시는 모델이 밑에 깔린 원칙(여기서는 코드의 수명과 영향 범위)을 일반화해 처음 보는 사례에도 적용하게 합니다. 예시는 실제 사용 사례와 닮게, 서로 충분히 다르게 고르고, `<example>` 태그로 지시문과 구분합니다.

```xml
<examples>
<example>
  <code>scripts/backfill_2024.py: try: ... except: pass</code>
  <verdict>허용 (코멘트 없음)</verdict>
  <reasoning>한 번 실행하고 버리는 스크립트이며 실패가 다른 코드로 전파되지 않는다.</reasoning>
</example>
<example>
  <code>libs/payments/client.py: try: ... except: pass</code>
  <verdict>지적</verdict>
  <reasoning>공유 라이브러리라 모든 호출자의 오류를 조용히 삼키고 KeyboardInterrupt 까지 가로챈다.</reasoning>
</example>
</examples>
```

공식 프롬프팅 가이드는 일반적으로 관련성 있고 다양한 예시 3–5개를 권하지만, 핵심은 개수가 아니라 경계를 대표하는 사례와 판정 이유를 함께 보여 주는 것입니다.

1. **오답** - 모든 패턴을 나열하는 것은 문제에서 이미 비현실적이라고 한 바로 그 방식이고, 목록에 없는 새 사례는 여전히 처리하지 못합니다. 항상 로드되는 CLAUDE.md만 비대해집니다.
2. **오답** - 파인튜닝은 프롬프트 수준에서 풀 수 있는 문제에 비해 비용과 반복 주기가 과도하고, 과거 결정에 섞여 있던 비일관성까지 그대로 학습할 수 있습니다.
3. **정답** - 대표적인 모호 사례를 판정 이유와 함께 보여 주면 모델이 "일회성 스크립트 대 공유 라이브러리" 같은 원칙을 일반화해, 나열하지 않은 사례에도 일관된 판정을 내립니다.
4. **오답** - 경계 사례를 전부 사람에게 넘기면 유용한 자동 피드백이라는 목적을 포기하는 것이고, 리뷰어에게 잡음만 쏟아져 봇에 대한 신뢰도 떨어집니다.

> 💡 **시험 포인트:** "모호한 사례에서 판정이 들쭉날쭉하다"와 "전부 나열할 수는 없다"가 함께 보이면 판정 이유를 담은 소수의 대표 few-shot 예시가 정답입니다. 망라형 규칙 목록, 파인튜닝, 전부 사람에게 넘기기는 오답입니다.

---

## 문제 52
### **[Scenario: Claude Code for Continuous Integration] In the pipeline, Claude Code generates test cases and then, within the same session, reviews those tests for quality. The review almost never finds problems, yet audits show 20% of the generated tests have weak or tautological assertions. What explains this and what is the fix?**

| 보기 | 설명 |
|------|------|
| 1. Enable extended thinking in the same session so the self-review reasons more carefully before it approves the tests | |
| 2. Have the same session review the tests three times and take a majority vote on each test's verdict | |
| 3. Add more detailed quality criteria, such as an assertion-strength checklist, to the existing session's review prompt | |
| **4. Have a separate, independent Claude instance review the tests, since a session is biased toward its own output** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

파이프라인에서 Claude Code가 테스트 케이스를 생성한 뒤, 같은 세션 안에서 그 테스트의 품질을 리뷰합니다. 리뷰는 거의 문제를 찾지 못하지만, 감사 결과 생성된 테스트의 20%에 약하거나 동어반복적인 assertion이 있었습니다. 이 현상의 원인과 해결책은 무엇일까요?

- **①** 같은 세션에서 확장 사고(extended thinking)를 켜, 자기 리뷰가 테스트를 승인하기 전에 더 신중하게 추론하게 한다
- **②** 같은 세션이 테스트를 세 번 리뷰하게 하고, 테스트별 판정을 다수결로 정한다
- **③** 기존 세션의 리뷰 프롬프트에 assertion 강도 체크리스트 같은 더 상세한 품질 기준을 추가한다
- **④** 세션은 자기 결과물 쪽으로 편향되므로, 별도의 독립 Claude 인스턴스가 테스트를 리뷰하게 한다

> **핵심 진단:** 방금 만든 결과물을 같은 세션이 평가하면 그 결과물을 만든 추론에 **고정(anchoring)** 되어 반박보다 확인 쪽으로 기웁니다. `assert result == result` 같은 동어반복이나 `assert response is not None` 처럼 사실상 아무것도 검증하지 않는 assertion은, 작성 의도("이 함수를 테스트한다")를 이미 아는 눈에는 그럴듯해 보여 자기 리뷰를 통과합니다. 생성에 관여하지 않은 독립 인스턴스는 테스트 코드만 보고 "이 assertion이 실패할 수 있는 경우가 있는가"를 묻게 되므로 약한 테스트를 훨씬 잘 잡아냅니다.

상세한 체크리스트 자체는 쓸모가 있습니다. 다만 같은 세션이 아니라 **독립 리뷰어에게** 줄 때 제 효과가 납니다.

1. **오답** - 확장 사고는 같은 편향된 세션이 같은 결론을 더 오래 생각하게 할 뿐, 자기 결과물을 평가하는 이해 충돌을 없애지 못합니다.
2. **오답** - 같은 세션의 반복 판정은 서로 독립적인 표본이 아니므로, 다수결은 공유된 편향을 상쇄하지 못하고 오히려 굳힙니다.
3. **오답** - 더 자세한 기준은 약간 도움이 되지만, 자기 결과물을 승인하려는 성향을 지닌 리뷰어가 그 기준을 관대하게 적용하는 문제는 그대로입니다.
4. **정답** - 원인은 자기 결과물 편향이고 처방은 생성 컨텍스트를 공유하지 않는 독립 인스턴스의 리뷰입니다. 원래 생성 과정에 이해관계가 없는 리뷰어가 훨씬 비판적으로 검토합니다.

> 💡 **시험 포인트:** "같은 세션의 자기 리뷰는 거의 문제를 못 찾는데 감사에서는 결함이 나온다"면 독립 인스턴스 리뷰가 정답입니다. 같은 세션 안에서 사고를 늘리거나, 여러 번 투표하거나, 기준을 덧붙이는 보기는 편향을 그대로 둔 오답입니다.

---

## 문제 53
### **[Scenario: Structured Data Extraction] Production logs show that 8% of extraction responses fail the downstream JSON.parse() step because Claude wraps its output in markdown code fences or prepends a sentence like "Here is the extracted data:". Prompt tweaks reduced but did not eliminate the failures. What is the most reliable fix?**

| 보기 | 설명 |
|------|------|
| **1. Define the target structure as a tool input_schema, force that tool via tool_choice, and read the JSON from the tool_use block.** | |
| 2. Add a stern system-prompt line ("Return only valid JSON, no markdown, no commentary") and set temperature to 0 for deterministic formatting. | |
| 3. Post-process every response with a regex that strips markdown fences and leading prose before calling JSON.parse() on it. | |
| 4. Lower max_tokens to a tight cap so the model has no room to add explanatory prose or code fences around the JSON. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

운영 로그를 보면 추출 응답의 8%가 다운스트림 `JSON.parse()` 단계에서 실패합니다. Claude가 출력을 마크다운 코드 펜스로 감싸거나 "Here is the extracted data:"(추출한 데이터는 다음과 같습니다) 같은 문장을 앞에 붙이기 때문입니다. 프롬프트를 손봐서 실패를 줄이긴 했지만 없애지는 못했습니다. 가장 신뢰할 수 있는 해결책은 무엇일까요?

- **①** 목표 구조를 도구의 `input_schema` 로 정의하고, `tool_choice` 로 그 도구를 강제한 뒤, `tool_use` 블록에서 JSON을 읽는다
- **②** 시스템 프롬프트에 엄격한 한 줄("Return only valid JSON, no markdown, no commentary")을 추가하고, 결정적인 형식을 위해 temperature를 0으로 설정한다
- **③** `JSON.parse()` 를 호출하기 전에 모든 응답을 정규식으로 후처리해 마크다운 펜스와 앞머리 문장을 제거한다
- **④** `max_tokens` 를 빠듯하게 낮춰, 모델이 JSON 주위에 설명 문장이나 코드 펜스를 붙일 여유가 없게 한다

> **핵심 진단:** 문제의 뿌리는 구조화 데이터를 **자유 텍스트 채널** 로 받고 있다는 점입니다. 추출 스키마를 도구의 `input_schema` 로 정의하고 `tool_choice: {"type": "tool", "name": ...}` 로 강제하면, API가 assistant 응답을 도구 호출로 시작하도록 미리 채우므로 앞머리 문장이나 코드 펜스가 끼어들 자리가 없고, 결과는 `tool_use` 블록의 `input` 에 이미 파싱된 JSON 객체로 들어옵니다. 텍스트를 파싱하는 단계 자체가 사라집니다.

```python
resp = client.messages.create(
    model=MODEL, max_tokens=2048,
    tools=[{"name": "record_invoice", "description": "Record fields extracted from the document.",
            "input_schema": INVOICE_SCHEMA, "strict": True}],
    tool_choice={"type": "tool", "name": "record_invoice"},
    messages=[{"role": "user", "content": document_text}],
)
data = next(b.input for b in resp.content if b.type == "tool_use")  # 이미 dict
```

`strict: true` 를 함께 쓰면 입력이 스키마를 정확히 따르는 것까지 보장됩니다(없으면 타입 불일치나 필수 필드 누락이 생길 수 있습니다). 최신 문서 기준 Claude Opus 5.5, Sonnet 5.5 등 일부 모델은 강제 `tool_choice`(`any`, `tool`)를 지원하지 않아 400 오류를 내므로, 그런 모델에서는 structured outputs(`output_config.format`)나 `auto` + strict tool use로 같은 효과를 얻습니다.

1. **정답** - 추출 결과가 텍스트가 아닌 `tool_use` 블록의 구조화된 `input` 으로 오므로, 코드 펜스나 앞머리 문장 같은 형식 오류가 구조적으로 사라집니다. 도구를 강제하면 모델이 구조화 경로를 건너뛸 수도 없습니다.
2. **오답** - 엄격한 지시와 temperature 0은 여전히 모델이 자유 텍스트를 올바른 모양으로 꾸며 주기를 기대하는 방식이라, 이미 확인했듯 실패율을 줄일 뿐 0으로 만들지 못합니다.
3. **오답** - 정규식 후처리는 예상하지 못한 래퍼(뒤에 붙은 설명, 다른 형식의 펜스 등)에서 다시 깨지는 취약한 땜질이며, 원인인 자유 텍스트 출력은 그대로 둡니다.
4. **오답** - `max_tokens` 를 줄이면 정상 JSON이 중간에 잘려 오히려 파싱 실패가 늘 수 있고, 짧은 응답에서도 펜스로 감싸는 습관은 막지 못합니다.

> 💡 **시험 포인트:** "JSON 파싱 실패 + 프롬프트로는 완전히 없앨 수 없다"는 신호에는 스키마로 출력을 강제하는 구조적 방법(도구 `input_schema` + `tool_choice` 강제, 또는 structured outputs)이 정답입니다. 프롬프트 강조, 정규식 후처리, 토큰 제한은 오답입니다.

---

## 문제 54
### **[Scenario: Structured Data Extraction] After migrating to tool_use with a strict JSON schema, JSON parse failures dropped to zero. However, reconciliation shows 6% of extracted invoices have line-item amounts that do not sum to the stated invoice total. What does this reveal about schema-based structured output?**

| 보기 | 설명 |
|------|------|
| 1. The schema is misconfigured; adding "additionalProperties": false will force the line-item amounts to reconcile with the stated invoice total. | |
| **2. Schema enforcement removes syntax and type errors but not semantic ones, so a downstream arithmetic check must flag or retry mismatches.** | |
| 3. tool_choice should be "any" rather than forced, so the model can self-correct the arithmetic before it returns the final tool_use result. | |
| 4. max_tokens is too low, so the model silently omits some line items from the output; raising the limit will make the totals add up. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

엄격한 JSON 스키마를 쓰는 `tool_use` 로 전환한 뒤 JSON 파싱 실패는 0건이 되었습니다. 그런데 대사(reconciliation) 결과, 추출된 인보이스의 6%에서 품목별 금액의 합이 명시된 인보이스 총액과 맞지 않습니다. 이 결과가 스키마 기반 구조화 출력에 대해 보여 주는 것은 무엇일까요?

- **①** 스키마 설정이 잘못된 것이며, `"additionalProperties": false` 를 추가하면 품목 금액이 명시된 인보이스 총액과 맞도록 강제된다
- **②** 스키마 강제는 구문 오류와 타입 오류는 없애지만 의미 오류는 없애지 못하므로, 다운스트림 산술 검사로 불일치를 표시하거나 재시도해야 한다
- **③** `tool_choice` 를 강제 대신 `"any"` 로 두어, 모델이 최종 `tool_use` 결과를 반환하기 전에 산술을 스스로 교정할 수 있게 해야 한다
- **④** `max_tokens` 가 너무 낮아 모델이 일부 품목을 조용히 누락하는 것이므로, 한도를 올리면 합계가 맞게 된다

> **핵심 진단:** JSON 스키마는 **모양(구조, 타입, 필수 필드)** 을 보장할 뿐, 값들이 서로 맞는지라는 **의미(semantic) 불변식** 은 보장하지 않습니다. "품목 금액의 합 = 총액" 같은 필드 간 산술 관계는 JSON Schema 키워드로 표현할 수 없고, structured outputs는 `minimum`·`maximum` 같은 단일 필드 수치 제약조차 지원하지 않습니다. 따라서 추출 뒤에 비즈니스 규칙을 코드로 검증하는 단계가 따로 있어야 합니다.

```python
from decimal import Decimal

def check_totals(inv):
    items = sum(Decimal(str(li["amount"])) for li in inv["line_items"])
    stated = Decimal(str(inv["stated_total"]))
    if items != stated:
        return f"line_items sum {items} != stated_total {stated}"
    return None  # 통과
```

불일치가 나오면 이 오류 메시지를 붙여 재시도하고, 원문 자체가 맞지 않는 경우라면 사람 검토로 보냅니다. 스키마에 명시 총액과 별도로 품목 합계도 함께 추출하게 해 두면, 불일치가 원문 문제인지 추출 오류인지 구분하기 쉬워집니다.

1. **오답** - `additionalProperties: false` 는 스키마에 없는 키를 막는 구조 제약일 뿐, 필드 값끼리의 산술 관계를 표현하지 못합니다. 파싱 실패 0건이 보여 주듯 스키마는 이미 제대로 작동하고 있고, 문제는 스키마가 다룰 수 없는 영역에 있습니다.
2. **정답** - 스키마는 구문과 타입의 유효성만 보장하므로, 합계를 다시 계산하는 다운스트림 검증으로 의미 오류를 잡고 불일치는 표시하거나 오류 내용을 붙여 재시도해야 합니다.
3. **오답** - `tool_choice` 는 어떤 도구를 부를지 정할 뿐 숫자의 정확성과는 무관합니다. `"any"` 로 바꿔도 같은 도구가 같은 방식으로 호출되며 산술 검증은 일어나지 않습니다.
4. **오답** - 토큰 한도에 걸리면 `stop_reason` 이 `max_tokens` 가 되고 출력이 불완전해지는 식으로 드러나지, 스키마를 통과한 채 합계만 틀리는 조용한 계산 오류로 나타나지 않습니다.

> 💡 **시험 포인트:** "스키마 검증은 통과하는데 값끼리 서로 맞지 않는다"면 스키마의 한계(구문은 보장, 의미는 보장 못 함)를 묻는 문제이며, 별도의 비즈니스 규칙 검증 단계가 정답입니다. 스키마 키워드, `tool_choice`, `max_tokens` 를 조정하는 보기는 오답입니다.

---

## 문제 55
### **[Scenario: Structured Data Extraction] For documents that lack a purchase-order number, audit logs show Claude inventing plausible-looking PO numbers about 11% of the time instead of signaling absence. Downstream systems then treat the fabricated values as real. What is the best schema-level fix?**

| 보기 | 설명 |
|------|------|
| 1. Add a required confidence float to every field so downstream code can discard PO numbers below a chosen threshold. | |
| 2. Switch tool_choice to "auto" so the model can decline to call the extraction tool altogether when the PO number is missing. | |
| **3. Make the po_number field nullable and instruct the model to return null when the value is not present in the source.** | |
| 4. Add a few-shot example containing a correctly formatted PO number to anchor the expected pattern for the field. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

구매 주문(PO) 번호가 없는 문서에 대해, 감사 로그를 보면 Claude가 약 11%의 경우 값이 없다고 알리는 대신 그럴듯해 보이는 PO 번호를 지어냅니다. 다운스트림 시스템은 이렇게 꾸며 낸 값을 실제 값으로 취급합니다. 가장 좋은 스키마 수준의 해결책은 무엇일까요?

- **①** 모든 필드에 필수 신뢰도 float를 추가해, 다운스트림 코드가 정해 둔 임계값 미만의 PO 번호를 버리게 한다
- **②** `tool_choice` 를 `"auto"` 로 바꿔, PO 번호가 없을 때 모델이 추출 도구 호출 자체를 하지 않을 수 있게 한다
- **③** `po_number` 필드를 nullable로 만들고, 원문에 값이 없으면 null을 반환하라고 모델에 지시한다
- **④** 올바른 형식의 PO 번호가 들어 있는 few-shot 예시를 추가해, 이 필드에 기대하는 패턴을 고정한다

> **핵심 진단:** 필드가 필수인데 값의 타입이 문자열뿐이라면, 원문에 값이 없을 때 모델에게 남은 "스키마에 맞는" 선택지는 무언가를 지어내는 것뿐입니다. 필드를 **nullable** 로 만들면 "없음"을 표현할 정식 통로가 생기므로 날조 대신 null을 반환합니다. 키는 `required` 에 그대로 두고 값만 null을 허용하면 "확인했지만 없었다"가 명시적으로 기록되고, 원문에 없을 때 null을 내라는 지시를 설명에 함께 적어 행동을 고정합니다.

```json
"po_number": {
  "type": ["string", "null"],
  "description": "문서에 인쇄된 PO 번호를 그대로 옮긴다. 문서에 없으면 null. 추측하거나 만들어 내지 않는다."
}
```

필드를 선택(optional) 필드로 만들어도 날조는 줄지만, 그때는 키 자체가 빠지므로 다운스트림에서 "추출 누락"과 "원문에 없음"을 구별하기 어렵습니다.

1. **오답** - 모델이 매기는 신뢰도는 보정이 부정확해, 그럴듯하게 지어낸 값에도 높은 점수가 붙을 수 있습니다. 날조 자체를 막지 못하고 사후 필터링만 시도하는 데다 모든 필드에 잡음을 더합니다.
2. **오답** - `"auto"` 로 바꾸면 PO 번호 하나가 없다는 이유로 나머지 필드는 멀쩡한 문서의 추출 전체를 건너뛸 위험이 생깁니다. 필요한 것은 도구 호출을 건너뛸 자유가 아니라 필드 하나에서 "없음"을 표현할 방법입니다.
3. **정답** - nullable 필드와 "없으면 null" 지시가 모델에게 값의 부재를 표현할 정당한 방법을 주므로, 필수 필드를 채우려고 값을 꾸며 낼 이유가 사라집니다. 다운스트림은 null을 보고 부재를 정확히 처리할 수 있습니다.
4. **오답** - 올바른 PO 번호 예시는 형식만 강화할 뿐 값이 없는 경우의 출구를 보여 주지 않습니다. 오히려 "이 필드에는 항상 값이 있다"는 인상을 굳힐 수 있습니다.

> 💡 **시험 포인트:** "값이 없는데 그럴듯한 값을 지어낸다"는 신호에는 필드를 nullable로 만들고 "없으면 null" 지시를 주는 보기가 정답입니다. 신뢰도 점수, `tool_choice` 변경, 정상 값만 보여 주는 예시는 오답입니다.

---

## 문제 56
### **[Scenario: Structured Data Extraction] The extraction schema uses an enum with six known values for document_type. A new vendor begins sending "credit memo" documents, which are not in the enum, and the model force-fits them to "invoice", corrupting downstream routing. What is the best design change?**

| 보기 | 설명 |
|------|------|
| 1. Remove the enum constraint entirely and let the model emit any free-text string for document_type on each document. | |
| 2. Fine-tune a dedicated document-type classifier and run it before extraction to assign the type to every document. | |
| 3. Brainstorm and add every conceivable document type to the enum so that no future document falls outside it. | |
| **4. Add an "other" value to the enum plus an optional document_type_detail string so novel types are captured instead of misclassified.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

추출 스키마는 `document_type` 에 알려진 값 6개로 된 enum을 씁니다. 새 공급업체가 enum에 없는 "credit memo"(대변 메모) 문서를 보내기 시작했고, 모델은 이를 억지로 `"invoice"` 에 끼워 맞춰 다운스트림 라우팅을 오염시킵니다. 가장 좋은 설계 변경은 무엇일까요?

- **①** enum 제약을 완전히 없애고, 모델이 문서마다 `document_type` 에 어떤 자유 텍스트 문자열이든 내게 한다
- **②** 전용 문서 유형 분류기를 파인튜닝해 추출 전에 실행하고, 모든 문서에 유형을 부여하게 한다
- **③** 생각할 수 있는 모든 문서 유형을 브레인스토밍해 enum에 추가해서, 앞으로 어떤 문서도 범위 밖으로 벗어나지 않게 한다
- **④** enum에 `"other"` 값과 선택적 `document_type_detail` 문자열을 추가해, 새로운 유형이 잘못 분류되지 않고 포착되게 한다

> **핵심 진단:** 닫힌 enum은 모델에게 "반드시 이 중 하나"를 요구하므로, 목록에 없는 대상이 오면 **가장 가까운 값으로 조용히 오분류** 하는 것이 유일한 선택이 됩니다. enum에 `"other"`(필요하면 `"unclear"`) 같은 탈출 값과 자유 텍스트 상세 필드를 두면, 통제된 어휘는 그대로 유지하면서 예상하지 못한 유형이 오분류 대신 눈에 보이는 형태로 드러납니다.

```python
"document_type": {
    "type": "string",
    "enum": KNOWN_TYPES + ["other"],  # 기존 6개 값 + 탈출구
},
"document_type_detail": {
    "type": ["string", "null"],
    "description": "document_type 이 other 일 때 원문에 적힌 유형명(예: credit memo)",
},
```

다운스트림은 `other` 를 검토 대기열로 보내고, `document_type_detail` 에 같은 값이 자주 쌓이면 그때 정식 enum 값으로 승격합니다. 참고로 structured outputs는 문자열 enum 값의 대소문자까지는 보장하지 않으므로, 라우팅 전에 소문자로 정규화해 두면 안전합니다.

1. **오답** - enum을 없애면 "Invoice", "bill" 같은 표기 변형이 섞여 다운스트림이 의존하는 검증과 정규화가 사라집니다. 새 유형 하나 때문에 기존 여섯 유형의 데이터 품질까지 희생하는 셈입니다.
2. **오답** - 별도 분류기 파인튜닝은 스키마 수정으로 풀리는 문제에 비해 과한 설계이며, 그 분류기 역시 학습하지 않은 새 유형 앞에서는 같은 방식으로 오분류합니다.
3. **오답** - 가능한 모든 유형을 미리 나열하는 것은 끝낼 수 없는 작업이고, 다음 번 진짜 새로운 문서에서 똑같이 실패합니다. enum이 커질수록 값 사이의 경계도 모호해집니다.
4. **정답** - `"other"` 탈출 값과 상세 문자열 필드가 미지의 유형을 잘못된 버킷에 억지로 넣지 않고 그대로 드러내므로, 라우팅 오염을 막으면서 신규 유형을 검토하고 enum을 확장할 근거까지 남깁니다.

> 💡 **시험 포인트:** 카테고리형 필드에서 "목록 밖의 값이 기존 값으로 억지 분류된다"는 신호가 보이면 enum + `"other"` + 상세 문자열 필드가 정답 패턴입니다. enum 제거, 모든 유형 나열, 별도 분류기는 오답입니다.

---

## 문제 57
### **[Scenario: Structured Data Extraction] Extractions pass the JSON schema but sometimes violate a business rule (invoice_date later than due_date). The current recovery discards the result and re-runs the identical prompt from scratch; 40% of retries still fail the rule. What is the most effective retry strategy?**

| 보기 | 설명 |
|------|------|
| **1. Append the failed extraction and the validation errors in a follow-up message, asking the model to fix only the offending fields.** | |
| 2. Re-run the identical prompt up to five times and accept the first result that happens to satisfy the invoice_date versus due_date rule. | |
| 3. Lower temperature to 0 and re-run the original prompt exactly once, expecting deterministic output that satisfies the rule. | |
| 4. Move all rule violations to the Message Batches API and reprocess them overnight at the discounted batch rate. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

추출 결과가 JSON 스키마는 통과하지만 가끔 비즈니스 규칙(`invoice_date` 가 `due_date` 보다 늦음)을 위반합니다. 현재 복구 방식은 결과를 버리고 똑같은 프롬프트를 처음부터 다시 실행하는데, 재시도의 40%가 여전히 규칙을 통과하지 못합니다. 가장 효과적인 재시도 전략은 무엇일까요?

- **①** 실패한 추출 결과와 검증 오류를 후속 메시지에 덧붙여, 문제가 된 필드만 고치도록 모델에 요청한다
- **②** 똑같은 프롬프트를 최대 다섯 번 다시 실행하고, 우연히 `invoice_date` 대 `due_date` 규칙을 만족하는 첫 결과를 채택한다
- **③** temperature를 0으로 낮추고 원래 프롬프트를 정확히 한 번 다시 실행해, 규칙을 만족하는 결정적 출력을 기대한다
- **④** 규칙 위반 건을 모두 Message Batches API로 옮겨, 할인된 배치 요금으로 밤사이 재처리한다

> **핵심 진단:** 같은 프롬프트를 다시 돌리면 모델은 **같은 입력에서 같은 추론** 을 반복하므로 같은 실수를 재현하기 쉽습니다. 효과적인 validation-retry는 모델에게 새 정보, 즉 *자기가 낸 실패한 출력* 과 *어떤 규칙이 어떻게 깨졌는지* 를 돌려주어, 전체를 다시 만드는 대신 문제 필드만 원문과 다시 대조해 고치게 하는 것입니다.

```python
messages += [
    {"role": "assistant", "content": resp.content},  # 실패한 추출(tool_use 포함)
    {"role": "user", "content": [{
        "type": "tool_result", "tool_use_id": tool_use.id, "is_error": True,
        "content": "Validation failed: invoice_date 2026-03-15 is after due_date 2026-03-01. "
                   "Re-check both dates in the document and fix only these fields.",
    }]},
]
resp = client.messages.create(model=MODEL, max_tokens=2048, tools=tools, messages=messages)
```

피드백을 주고도 같은 위반이 반복된다면 원문 자체가 그렇게 적혀 있을 가능성이 있으므로, 재시도 횟수에 상한을 두고 사람 검토로 넘깁니다.

1. **정답** - 실패한 출력과 구체적인 검증 오류를 함께 돌려주면 모델이 무엇이 틀렸는지 알고 해당 필드만 원문과 대조해 고치므로, 맹목적인 반복보다 규칙 위반을 해결할 가능성이 훨씬 높습니다.
2. **오답** - 새 정보 없이 같은 프롬프트를 반복하는 것은 운에 맡기는 방식입니다. 이미 40%가 다시 실패하듯 같은 오류가 재현되고, 비용만 최대 다섯 배로 늘어납니다.
3. **오답** - temperature를 낮춰 한 번 더 돌려도 모델은 여전히 무엇이 틀렸는지 모릅니다. 출력이 더 일관돼진다면 오히려 같은 잘못된 날짜를 더 일관되게 재현할 뿐입니다.
4. **오답** - Message Batches API는 지연을 감수할 수 있는 대량 작업을 50% 할인된 가격으로 비동기 처리하는 수단이지 교정 루프가 아닙니다. 실패 맥락을 모델에 주지 않으니 같은 오류가 그대로 나옵니다.

> 💡 **시험 포인트:** 재시도 전략을 묻는 문제에서는 "실패한 출력 + 구체적인 오류 메시지를 피드백해 해당 필드만 수정"하는 보기가 정답입니다. 같은 프롬프트 반복, temperature 조정, 처리 채널 변경(배치)은 모델에게 새 정보를 주지 않는 오답입니다.

---

## 문제 58
### **[Scenario: Structured Data Extraction] For scanned documents where the tax ID is physically cut off at the page edge and simply absent from the source text, the validation-retry loop retries five times and still fails, burning tokens on every attempt. What is the correct understanding of this situation?**

| 보기 | 설명 |
|------|------|
| 1. Raise the retry ceiling from five to ten, since with enough attempts the model will eventually recover the cut-off tax ID from the scanned page. | |
| **2. Retries fix format errors but cannot recover absent source data, so detect the absence, return null, and route the document to human review.** | |
| 3. Enable extended thinking so the model reasons more deeply and reconstructs the missing tax ID from surrounding context clues on the page. | |
| 4. Switch tool_choice to "any" so the model can select a different extraction tool that will locate the tax ID elsewhere in the document. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

세금 ID가 페이지 가장자리에서 물리적으로 잘려 원문 텍스트에 아예 없는 스캔 문서에 대해, validation-retry 루프가 다섯 번 재시도하고도 여전히 실패하며 매번 토큰을 소모합니다. 이 상황을 올바르게 이해한 것은 무엇일까요?

- **①** 충분히 시도하면 모델이 결국 스캔 페이지에서 잘린 세금 ID를 복구할 것이므로, 재시도 상한을 5회에서 10회로 올린다
- **②** 재시도는 형식 오류를 고칠 수 있지만 원문에 없는 데이터는 복구할 수 없으므로, 부재를 감지해 null을 반환하고 문서를 사람 검토로 보낸다
- **③** 확장 사고(extended thinking)를 켜서 모델이 더 깊이 추론해 페이지의 주변 단서로부터 누락된 세금 ID를 재구성하게 한다
- **④** `tool_choice` 를 `"any"` 로 바꿔, 모델이 문서의 다른 곳에서 세금 ID를 찾아낼 다른 추출 도구를 고를 수 있게 한다

> **핵심 진단:** validation-retry 루프가 고칠 수 있는 것은 모델이 **원문에 있는 정보를 잘못 옮긴** 오류(형식, 구조, 필드 혼동)입니다. 정보가 원문에 **애초에 없으면** 재시도는 구조적으로 성공할 수 없고, 억지로 "성공"한다면 그것은 값을 지어낸 것입니다. 따라서 루프는 실패 원인을 구분해야 하며, 부재가 확인되면 즉시 멈추고 null과 사유를 기록한 뒤 사람 검토로 에스컬레이션하는 것이 올바른 종료 동작입니다.

- 재시도 대상: 형식 오류, 필드 간 규칙 위반처럼 원문을 다시 보면 고칠 수 있는 오류
- 즉시 종료 대상: 원문에 값이 없음(잘림, 공란, 판독 불가) → `tax_id: null` + 사유 기록 + 사람 검토 대기열

이렇게 하면 불필요한 토큰 소모가 멈추고, 다운스트림은 날조된 값 대신 "확인 필요" 상태를 받습니다.

1. **오답** - 입력에 없던 데이터는 시도 횟수를 늘려도 나타나지 않습니다. 상한을 올리면 낭비되는 토큰만 두 배가 되고, 어쩌다 "통과"한 값은 날조일 가능성이 큽니다.
2. **정답** - 재시도의 한계(형식 오류에는 유효하지만 원문에 없는 정보에는 무효)를 정확히 짚고, 부재 감지 → null → 사람 검토라는 올바른 종료 동작으로 토큰 낭비와 날조 위험을 함께 없앱니다.
3. **오답** - 확장 사고는 주어진 증거에 대한 추론을 개선할 뿐입니다. 잘려 나간 세금 ID를 주변 단서로 "재구성"한다면 그것은 근거 없는 날조입니다.
4. **오답** - `tool_choice` 는 어떤 도구를 실행할지 정할 뿐, 잘린 페이지에 존재하는 텍스트를 바꾸지 못합니다. 어떤 추출 도구도 원문에 없는 값을 찾아낼 수 없습니다.

> 💡 **시험 포인트:** "원문에 정보가 아예 없다"는 신호가 보이면 재시도 확대, 사고 강화, 도구 변경은 모두 오답이고 null 반환 + 사람 검토 에스컬레이션이 정답입니다. 재시도는 원문에 있는 정보를 잘못 옮긴 오류에만 효과가 있습니다.

---

## 문제 59
### **[Scenario: Structured Data Extraction] A 50,000-document extraction batch completes and 300 requests returned errors. The team needs to reprocess only the failures and reliably match every result back to its source document. What is the correct approach?**

| 보기 | 설명 |
|------|------|
| 1. Resubmit the entire 50,000-document batch, since Batch API jobs are atomic and cannot be reprocessed partially or selectively. | |
| 2. Rely on result ordering, since the Batch API guarantees that results come back in the same order as the input requests. | |
| **3. Give each request a custom_id tied to its source, match results by it, and submit a new batch of only the 300 failures.** | |
| 4. Convert the 300 failures to synchronous calls and use response timestamps to align each result with its source document. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

50,000건 규모의 문서 추출 배치가 완료되었고, 그중 300건의 요청이 오류를 반환했습니다. 팀은 실패한 건만 다시 처리하면서 모든 결과를 원본 문서와 확실하게 매칭해야 합니다. 올바른 접근법은 무엇일까요?

- **①** Batch API 작업은 원자적이라 일부만 골라 재처리할 수 없으므로, 50,000건 배치 전체를 다시 제출한다
- **②** Batch API는 결과를 입력 요청과 같은 순서로 돌려준다고 보장하므로, 결과 순서에 의존한다
- **③** 각 요청에 원본과 연결된 `custom_id` 를 부여해 그것으로 결과를 매칭하고, 실패한 300건만 담은 새 배치를 제출한다
- **④** 실패한 300건을 동기 호출로 바꾸고, 응답 타임스탬프로 각 결과를 원본 문서와 맞춘다

> **핵심 진단:** Message Batches API의 각 요청에는 호출자가 정하는 고유한 **`custom_id`** 가 붙고, 결과의 각 줄에도 같은 `custom_id` 와 결과 유형(`succeeded`, `errored`, `canceled`, `expired`)이 함께 옵니다. 결과는 입력 순서와 다르게 돌아올 수 있으므로 매칭은 반드시 `custom_id` 로 해야 하며, 배치 안의 요청은 각각 독립적으로 처리되므로 실패한 `custom_id` 만 골라 새 배치로 다시 보내면 됩니다.

```python
failed = [r.custom_id for r in client.messages.batches.results(batch_id)
          if r.result.type == "errored"]
retry = client.messages.batches.create(requests=[
    {"custom_id": cid, "params": build_params(docs[cid])} for cid in failed
])
```

`custom_id` 는 1–64자의 영숫자, 하이픈, 밑줄만 허용하므로 파일 경로 대신 문서 ID 같은 안정적인 키를 쓰고 원본과의 매핑을 따로 보관합니다. 오류 중 `invalid_request_error` 는 요청 본문을 고친 뒤 보내야 하고, 서버 오류는 그대로 재시도할 수 있습니다. `errored` 요청에는 요금이 청구되지 않습니다.

1. **오답** - 배치의 각 요청은 독립적으로 처리되어 요청별 결과가 나오므로 "원자적"이라는 전제부터 틀렸습니다. 이미 성공한 49,700건까지 다시 돌리는 것은 비용과 시간 낭비입니다.
2. **오답** - 공식 문서는 결과가 입력 순서와 다르게 돌아올 수 있다고 명시합니다. 바로 그 때문에 `custom_id` 가 존재합니다.
3. **정답** - 원본과 묶인 `custom_id` 로 결과를 결정적으로 매칭하고, 실패한 300건만 새 배치로 재제출하면 저렴하고 정확하게 복구할 수 있습니다.
4. **오답** - 타임스탬프로 결과를 맞추는 것은 취약한 추정이며, 결정적인 `custom_id` 매핑이 있는데 굳이 쓸 이유가 없습니다. 동기 호출로 바꾸면 배치의 50% 할인도 잃습니다.

> 💡 **시험 포인트:** Batch API 결과는 순서가 아니라 `custom_id` 로 매칭하고, 재처리는 실패한 `custom_id` 만 새 배치로 보내는 보기가 정답입니다. "배치는 원자적이다", "결과 순서가 보장된다"는 보기는 사실과 다른 오답입니다.

---

## 문제 60
### **[Scenario: Structured Data Extraction] The pipeline handles six document types, each with its own extraction tool. Even when the type is already known from the intake folder that routed the document, the caller still sends all six tools with tool_choice "auto", and in 9% of cases the model invokes the wrong extractor. What is the best fix?**

| 보기 | 설명 |
|------|------|
| 1. Keep tool_choice "auto" but add sentiment analysis of the document text to help the model decide which of the six extractors fits best. | |
| 2. Merge all six extraction tools into one large tool with a combined schema and a document_type field covering every type. | |
| 3. Set tool_choice to "any" so the model is at least required to call some extraction tool before it responds. | |
| **4. Force the known extractor with tool_choice {"type": "tool", "name": "extract_invoice"} rather than leaving selection to "auto".** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D4 · Prompt Engineering & Structured Output

**📝 문제 번역**

파이프라인은 여섯 가지 문서 유형을 처리하며, 유형마다 전용 추출 도구가 있습니다. 문서를 라우팅한 접수 폴더로 유형을 이미 알고 있는데도, 호출자는 여전히 여섯 도구를 모두 보내고 `tool_choice` 를 `"auto"` 로 두며, 9%의 경우 모델이 엉뚱한 추출기를 호출합니다. 가장 좋은 해결책은 무엇일까요?

- **①** `tool_choice` 는 `"auto"` 로 유지하되, 문서 텍스트에 감성 분석을 더해 모델이 여섯 추출기 중 가장 맞는 것을 고르도록 돕는다
- **②** 여섯 추출 도구를 모든 유형을 아우르는 통합 스키마와 `document_type` 필드를 가진 하나의 큰 도구로 합친다
- **③** `tool_choice` 를 `"any"` 로 설정해, 모델이 응답하기 전에 적어도 어떤 추출 도구든 하나는 반드시 호출하게 한다
- **④** 선택을 `"auto"` 에 맡기지 말고 `tool_choice` `{"type": "tool", "name": "extract_invoice"}` 로 이미 알고 있는 추출기를 강제한다

> **핵심 진단:** 올바른 도구가 이미 **업스트림의 결정적 로직(접수 폴더 라우팅)** 으로 정해졌다면 그 결정을 모델에게 다시 맡길 이유가 없습니다. `tool_choice` 의 값은 네 가지입니다. `auto` 는 도구를 쓸지와 어떤 도구를 쓸지를 모델이 판단하고(도구가 있을 때 기본값), `any` 는 어떤 도구든 하나는 반드시 호출하게 하며, `tool` 은 지정한 도구를 반드시 호출하게 하고, `none` 은 도구 호출을 막습니다. 도구를 이름으로 지정하면 선택 단계 자체가 없어지므로 9%의 선택 오류가 구조적으로 사라집니다.

```python
EXTRACTORS = {"invoice": "extract_invoice", "receipt": "extract_receipt"}  # 6종 매핑
tool_name = EXTRACTORS[doc.intake_folder_type]
resp = client.messages.create(
    model=MODEL, max_tokens=2048, tools=EXTRACTOR_TOOLS, messages=msgs,
    tool_choice={"type": "tool", "name": tool_name},
)
```

최신 문서 기준 Claude Opus 5.5, Sonnet 5.5 등 일부 모델은 `any`·`tool` 강제를 지원하지 않아 400 오류를 반환합니다. 그런 모델에서는 라우팅으로 정해진 유형의 스키마를 structured outputs(`output_config.format`)로 직접 지정하는 방식으로 같은 원리(이미 아는 선택을 모델에게 맡기지 않기)를 적용합니다.

1. **오답** - `"auto"` 를 유지하면 지금 실패하고 있는 선택을 그대로 모델에게 맡기는 것이고, 감성 분석은 문서 유형 판단과 무관한 과잉 설계입니다.
2. **오답** - 관련 작업을 적은 수의 도구로 묶는 것이 일반적으로는 권장되지만, 여기서는 유형이 이미 정해져 있습니다. 여섯 스키마를 합치면 유형별 필수 필드가 모두 선택 필드로 흐려지고 스키마가 비대해져, 이미 가진 라우팅 정보를 버린 채 추출 품질만 떨어뜨릴 수 있습니다.
3. **오답** - `"any"` 는 어떤 도구든 하나를 반드시 호출하게 할 뿐, 여섯 개 중 무엇을 고를지는 여전히 모델이 정하므로 엉뚱한 추출기를 고르는 문제는 그대로입니다.
4. **정답** - 업스트림에서 이미 정해진 도구를 `{"type": "tool", "name": ...}` 로 강제하면 모델의 선택 단계가 사라져 선택 오류가 원천적으로 없어집니다. 호출되는 도구가 결정적이므로 다운스트림 처리도 단순해집니다.

> 💡 **시험 포인트:** `tool_choice` 를 구분하세요: `auto` 는 모델이 판단, `any` 는 어떤 도구든 반드시 하나, `tool` 은 특정 도구 강제입니다. "올바른 도구를 이미 안다"는 신호가 보이면 특정 도구 강제가 정답이고, 강제를 지원하지 않는 최신 모델이라면 structured outputs로 같은 효과를 냅니다.

---
