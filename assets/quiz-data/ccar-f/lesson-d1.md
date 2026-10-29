<!-- 출처: https://www.certsafari.com/anthropic/claude-certified-architect-foundations/learn — CCAR-F 레슨 도메인 1(레슨 1.1~1.7)의 Exam question·Check yourself 객관식 문항. 문제·보기·정답은 원문 그대로 옮기고 보기 기호만 A–D → 1–4로 바꿨다. 해설은 원문 해설과 공식 문서를 바탕으로 한글로 작성. -->

## 문제 1
### **An architect is building a client-side agent loop against the Messages API for a data-cleanup task. The first response has stop_reason set to "tool_use" and contains a tool_use block requesting a file-listing tool. What should the loop do next to correctly continue the agentic execution?**

| 보기 | 설명 |
|------|------|
| **1. Run the tool, add its output as a tool_result block with the matching tool_use_id in a user message, and resend the history with the tool_use turn** | |
| 2. Run the tool, add its output as a tool_result block with the matching tool_use_id in an assistant message, and resend the history without the tool_use turn | |
| 3. Run the tool, add its output as a plain text block naming the tool_use_id in a user message, and resend the history without the tool_use turn | |
| 4. Run the tool, add its output as a plain text block naming the tool_use_id in an assistant message, and resend the history with the tool_use turn | |

**정답: 1.**

**해설:**

> 📘 레슨 1.1 · 에이전트 루프 — Agentic loop lifecycle: stop_reason control flow and tool results

**📝 문제 번역**

아키텍트가 데이터 정리 작업을 위해 Messages API로 클라이언트 측 에이전트 루프를 만들고 있습니다. 첫 응답의 `stop_reason` 은 `"tool_use"` 이고, 파일 목록 조회 도구를 요청하는 `tool_use` 블록이 들어 있습니다. 에이전트 실행을 올바르게 이어 가려면 루프는 다음에 무엇을 해야 합니까?

- **①** 도구를 실행하고, 그 출력을 짝이 맞는 `tool_use_id` 를 가진 `tool_result` 블록으로 **user 메시지** 에 담은 뒤, `tool_use` 턴을 **포함한** 이력을 다시 보낸다
- **②** 도구를 실행하고, 그 출력을 짝이 맞는 `tool_use_id` 를 가진 `tool_result` 블록으로 **assistant 메시지** 에 담은 뒤, `tool_use` 턴을 **뺀** 이력을 다시 보낸다
- **③** 도구를 실행하고, 그 출력을 `tool_use_id` 를 적은 **일반 텍스트 블록** 으로 user 메시지에 담은 뒤, `tool_use` 턴을 뺀 이력을 다시 보낸다
- **④** 도구를 실행하고, 그 출력을 `tool_use_id` 를 적은 일반 텍스트 블록으로 assistant 메시지에 담은 뒤, `tool_use` 턴을 포함한 이력을 다시 보낸다

> **핵심:** 다음 요청에는 원래 메시지, `tool_use` 블록이 든 assistant 응답 전체, 그리고 `tool_use_id` 로 짝을 맞춘 `tool_result` 블록을 담은 user 메시지가 모두 있어야 합니다.

1. **정답** - 클라이언트가 요청된 도구를 실행하고, 그 출력을 요청의 `tool_use_id` 를 담은 `tool_result` 블록으로 만들어 user 메시지로 돌려줍니다. 이때 Claude의 `tool_use` 턴도 이력에 그대로 남겨 다시 보내야 Claude가 자기가 무엇을 요청했고 무엇이 돌아왔는지 함께 봅니다. 이것이 문서가 제시하는 표준 루프의 3·4단계입니다.
2. **오답** - `tool_result` 블록은 assistant 메시지가 아니라 user 메시지에 들어갑니다. 게다가 Claude의 `tool_use` 턴을 지우면 결과에 짝이 되는 도구 호출이 사라져 요청 자체가 유효하지 않습니다.
3. **오답** - 텍스트 안에 `tool_use_id` 를 적는다고 출력이 호출과 연결되지는 않습니다. 결과는 반드시 `tool_result` 블록으로 돌아와야 하고, 이력에는 Claude가 무엇을 요청했는지 알 수 있도록 `tool_use` 턴이 남아 있어야 합니다.
4. **오답** - `tool_use` 블록을 담은 assistant 턴 다음 메시지는 그 호출에 `tool_result` 블록으로 답하는 user 메시지여야 합니다. assistant 메시지의 일반 텍스트로는 도구 출력이 Claude에게 결과로 전달되지 않습니다.

📚 근거: [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

> "Send a new request containing the original messages, the assistant's response, and a user message with the tool_result blocks."

---

## 문제 2
### **After Claude returns stop_reason "tool_use", which history update lets it use the result on the next request?**

| 보기 | 설명 |
|------|------|
| 1. Append only the assistant's text blocks, then a user message summarising the tool output in prose | |
| **2. Append the assistant's full response, then a user message with a tool_result block whose tool_use_id matches each tool_use id** | |
| 3. Replace the history with a single user message containing the tool output, to save context | |
| 4. Append the tool_result blocks followed by a text block saying "Here's the result" | |

**정답: 2.**

**해설:**

> 📘 레슨 1.1 · 에이전트 루프 — Agentic loop lifecycle: stop_reason control flow and tool results

**📝 문제 번역**

Claude가 `stop_reason` `"tool_use"` 를 돌려준 뒤, 다음 요청에서 Claude가 그 결과를 쓸 수 있게 하는 이력 갱신은 무엇입니까?

- **①** assistant의 텍스트 블록만 붙이고, 도구 출력을 문장으로 요약한 user 메시지를 붙인다
- **②** assistant의 응답 전체를 붙이고, 각 `tool_use` 의 `id` 와 일치하는 `tool_use_id` 를 가진 `tool_result` 블록을 담은 user 메시지를 붙인다
- **③** 컨텍스트를 아끼려고 이력을 도구 출력만 담은 user 메시지 하나로 바꾼다
- **④** `tool_result` 블록을 붙이고 그 뒤에 "Here's the result"라는 텍스트 블록을 덧붙인다

> **핵심:** Claude는 자기의 `tool_use` 요청과 그에 맞는 `tool_result` 를 `id` 로 연결된 상태로 함께 봐야 결과를 다음 추론에 씁니다.

1. **오답** - 텍스트 블록만 남기면 `tool_use` 블록이 사라져 Claude에게 자신이 무엇을 요청했는지 기록이 없습니다. 도구 출력을 산문으로 요약해 보내면 `tool_result` 로 호출과 짝지어지지 않으므로, Claude가 같은 호출을 다시 요청할 수 있습니다.
2. **정답** - 다음 요청에는 원래 메시지, `tool_use` 블록까지 포함한 assistant 응답 전체, 그리고 `tool_result` 블록을 담은 user 메시지가 들어가야 합니다. `tool_use` 블록의 `id` 는 바로 결과를 짝지어 주기 위한 식별자이고, `tool_result` 의 `tool_use_id` 가 이를 그대로 반복합니다. 응답에 `tool_use` 가 여럿이면 각각에 대한 `tool_result` 가 모두 있어야 하며, 하나라도 빠지면 API가 오류로 거부합니다.
3. **오답** - 이력을 통째로 바꾸면 원래 사용자 요청과 Claude의 `tool_use` 요청이 모두 사라집니다. Claude는 매 요청마다 보내 준 이력만 보므로, 무엇을 위해 이 결과를 받았는지 알 수 없게 됩니다.
4. **오답** - 문서는 `tool_result` 바로 뒤에 텍스트 블록을 붙이지 말라고 경고합니다. 이렇게 하면 Claude가 '도구 사용 뒤에는 사용자 입력이 온다'고 학습해, 내용 없는 `end_turn` 으로 턴을 일찍 끝낼 수 있습니다.

📚 근거: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

> "id: A unique identifier for this particular tool use block. This will be used to match up the tool results later."

---

## 문제 3
### **A junior engineer proposes capping an autonomous research agent at exactly 5 tool-call iterations and treating that cap as the loop's primary stopping mechanism, regardless of stop_reason. What is the main architectural problem with relying on a fixed iteration cap this way?**

| 보기 | 설명 |
|------|------|
| **1. The loop can halt while stop_reason is still "tool_use", leaving a task Claude was partway through unfinished and its answer incomplete** | |
| 2. The Messages API rejects the sixth request with an error, leaving the conversation stuck at a stop_reason of "tool_use" it cannot resolve | |
| 3. Once the counter hits five, tool_result blocks stop being appended to the history, leaving Claude's stop_reason stuck at "tool_use" | |
| 4. The tools parameter must be dropped from requests after the fifth call, leaving Claude unable to request tool_use for the rest of the session | |

**정답: 1.**

**해설:**

> 📘 레슨 1.1 · 에이전트 루프 — Agentic loop lifecycle: stop_reason control flow and tool results

**📝 문제 번역**

주니어 엔지니어가 자율 리서치 에이전트의 도구 호출 반복을 정확히 5회로 제한하고, `stop_reason` 과 상관없이 그 상한을 루프의 **주된 종료 장치** 로 쓰자고 제안합니다. 이렇게 고정 반복 상한에 의존할 때의 핵심 아키텍처 문제는 무엇입니까?

- **①** `stop_reason` 이 아직 `"tool_use"` 인 상태에서 루프가 멈춰, Claude가 진행 중이던 작업이 끝나지 않고 답이 불완전하게 남을 수 있다
- **②** Messages API가 여섯 번째 요청을 오류로 거부해, 대화가 해결할 수 없는 `"tool_use"` 상태에 갇힌다
- **③** 카운터가 5에 도달하면 `tool_result` 블록이 더 이상 이력에 붙지 않아, Claude의 `stop_reason` 이 `"tool_use"` 에 고정된다
- **④** 다섯 번째 호출 뒤에는 요청에서 `tools` 파라미터를 빼야 해, 세션의 나머지 동안 Claude가 `tool_use` 를 요청할 수 없게 된다

> **핵심:** 고정 횟수는 작업 완료 여부와 아무 관계가 없습니다. 정상 종료는 `stop_reason` 으로 판단하고, 반복 상한은 폭주를 막는 안전망으로만 씁니다.

1. **정답** - 5라는 숫자는 작업이 끝났는지와 무관하므로, 이를 주 종료 조건으로 쓰면 Claude가 아직 도구를 더 부르려는 중간에 루프가 끊길 수 있습니다. 루프는 `stop_reason` 이 `"end_turn"` 일 때 끝나야 합니다. Agent SDK에서도 `max_turns` 에 걸리면 결과 subtype이 `error_max_turns` 가 되고 `result` 필드가 없습니다. 상한 도달은 정상 완료가 아니라는 뜻입니다.
2. **오답** - Messages API는 대화당 도구 호출 횟수에 상한을 두지 않으며, 그 이유로 이후 요청을 거부하지 않습니다. 반복 상한은 순전히 애플리케이션 쪽에서 정하는 선택입니다.
3. **오답** - `tool_result` 를 이력에 붙이는 일은 클라이언트 코드가 하며, 반복 카운터와 연결돼 있지 않습니다. 상한에 도달하면 루프가 요청을 그만 보낼 뿐 `stop_reason` 이 바뀌지는 않습니다.
4. **오답** - 몇 번 호출한 뒤 `tools` 파라미터를 빼야 한다는 규칙은 없습니다. 상한 도달은 루프를 끝낼 뿐이고, 이미 보낸 요청의 `tools` 파라미터는 그대로입니다.

📚 근거: [How the agent loop works (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/agent-loop) · [Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

> "Claude continues calling tools and processing results until it produces a response with no tool calls."

---

## 문제 4
### **A response contains a text block followed by a tool_use block, and its stop_reason is "tool_use". What should the loop do?**

| 보기 | 설명 |
|------|------|
| 1. Stop, because the text block shows Claude has produced its answer | |
| **2. Run the tool, append the results and send another request, because stop_reason is "tool_use"** | |
| 3. Stop and search the text for a phrase such as "done" to confirm | |
| 4. Stop after a fixed number of iterations and ignore the tool_use block | |

**정답: 2.**

**해설:**

> 📘 레슨 1.1 · 에이전트 루프 — Agentic loop lifecycle: stop_reason control flow and tool results

**📝 문제 번역**

응답에 텍스트 블록과 그 뒤의 `tool_use` 블록이 들어 있고, `stop_reason` 은 `"tool_use"` 입니다. 루프는 무엇을 해야 합니까?

- **①** 텍스트 블록이 있으니 Claude가 답을 냈다고 보고 멈춘다
- **②** `stop_reason` 이 `"tool_use"` 이므로 도구를 실행하고, 결과를 붙여 다시 요청한다
- **③** 멈추고, 텍스트에서 "done" 같은 문구를 찾아 완료를 확인한다
- **④** 정해진 반복 횟수가 지나면 멈추고 `tool_use` 블록은 무시한다

> **핵심:** 한 응답에 텍스트와 도구 호출이 함께 올 수 있습니다. 계속할지는 텍스트 유무가 아니라 `stop_reason` 으로만 판단합니다.

1. **오답** - Claude는 "확인해 볼게요" 같은 문장을 `tool_use` 블록과 같은 응답에 자주 씁니다. 텍스트가 있다고 멈추면 작업이 중간 단계에서 버려집니다. 반대로 텍스트가 없는 응답도 정상적인 `end_turn` 일 수 있습니다.
2. **정답** - 응답에는 텍스트, 도구 호출, 또는 둘 다가 들어갈 수 있습니다. 텍스트가 있다는 사실은 완료 여부와 무관하므로, `stop_reason` 이 `"tool_use"` 인 동안 루프는 도구를 실행하고 결과를 붙여 계속 진행합니다.
3. **오답** - 응답 문구에서 "done" 같은 표현을 찾는 것은 자연어 파싱이라는 종료 안티패턴입니다. 문서의 일반 원칙대로, 모델 출력에서 정규식으로 결정을 뽑고 있다면 그 결정은 구조화된 신호여야 하며, 종료에는 이미 `stop_reason` 이 있습니다.
4. **오답** - 반복 상한은 폭주를 막는 안전장치일 뿐 주 종료 장치가 아닙니다. 게다가 `tool_use` 블록을 무시하면 결과 없는 호출이 남아 작업이 완료되지 않습니다.

📚 근거: [How the agent loop works (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/agent-loop) · [Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

> "It may respond with text, request one or more tool calls, or both."

---

## 문제 5
### **A coordinator agent delegates an integration task to a subagent. Three turns earlier in the main conversation, the user chose a specific authentication provider. The subagent picks a different provider. What should the architect change?**

| 보기 | 설명 |
|------|------|
| 1. Resume the subagent's earlier session so it loads the latest state of the main conversation | |
| 2. Give the subagent broader tool permissions so it can read the coordinator's conversation history | |
| **3. Have the coordinator write the user's chosen provider into the prompt it sends when delegating the task** | |
| 4. Add a rule to the subagent's system prompt telling it to defer to decisions the user made upstream | |

**정답: 3.**

**해설:**

> 📘 레슨 1.2 · 코디네이터·서브에이전트 — Coordinator-subagent orchestration: hub-and-spoke routing, selection and refinement

**📝 문제 번역**

코디네이터 에이전트가 연동 작업을 서브에이전트에 위임합니다. 메인 대화에서 세 턴 전에 사용자는 특정 인증 공급자를 골랐습니다. 그런데 서브에이전트는 다른 공급자를 선택합니다. 아키텍트는 무엇을 바꿔야 합니까?

- **①** 서브에이전트의 이전 세션을 재개해 메인 대화의 최신 상태를 불러오게 한다
- **②** 서브에이전트에 더 넓은 도구 권한을 줘 코디네이터의 대화 이력을 읽을 수 있게 한다
- **③** 코디네이터가 작업을 위임할 때 보내는 프롬프트에 사용자가 고른 공급자를 직접 적게 한다
- **④** 서브에이전트의 시스템 프롬프트에 사용자가 앞서 내린 결정을 따르라는 규칙을 추가한다

> **핵심:** 서브에이전트는 자기만의 새 대화에서 시작하므로 사용자의 이전 턴을 보지 못합니다. 필요한 결정은 코디네이터가 위임 프롬프트에 직접 써 넣는 것이 유일한 경로입니다.

1. **오답** - 재개된 서브에이전트는 **자기** 이전 대화를 전체 맥락과 함께 이어 갈 뿐입니다. 그 대화에는 처음부터 사용자의 공급자 선택 턴이 없었으므로, 재개해도 결정은 나타나지 않습니다.
2. **오답** - 도구 권한은 서브에이전트가 **무엇을 할 수 있는지** 를 정할 뿐, 어느 대화를 읽을 수 있는지와는 무관합니다. 권한을 넓혀도 코디네이터의 대화 이력이 전달되지는 않습니다.
3. **정답** - 포크가 아닌 서브에이전트는 새 컨텍스트로 시작하고, 부모 대화는 자동으로 넘어가지 않습니다. 코디네이터가 유일한 통로이므로, 사용자가 고른 공급자 이름을 위임 프롬프트에 써 넣어야 서브에이전트가 그 결정을 따릅니다.
4. **오답** - 시스템 프롬프트 규칙으로는 서브에이전트가 **본 적도 없는** 결정을 따르게 할 수 없습니다. '상위 결정을 따르라'는 규칙이 있어도 따를 결정 내용이 컨텍스트에 없습니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Create custom subagents (Claude Code)](https://code.claude.com/docs/en/sub-agents)

> "Context isolation: each subagent runs in its own conversation, which starts fresh unless the subagent is a fork."

---

## 문제 6
### **Your ticket-triage system sends every ticket through five subagents: classifier, sentiment analyzer, knowledge-base search, summarizer and escalation checker. Token costs are too high, and most one-line tickets only need classifying. Which change addresses the problem?**

| 보기 | 설명 |
|------|------|
| 1. Run all five subagents in parallel so each ticket finishes in the time of the slowest one | |
| **2. Add a cheap planning step where the coordinator assesses each ticket and invokes only the subagents it needs** | |
| 3. Remove the coordinator and let the classifier call the other subagents directly when it thinks they are needed | |

**정답: 2.**

**해설:**

> 📘 레슨 1.2 · 코디네이터·서브에이전트 — Coordinator-subagent orchestration: hub-and-spoke routing, selection and refinement

**📝 문제 번역**

티켓 분류 시스템이 모든 티켓을 분류기, 감정 분석기, 지식 베이스 검색, 요약기, 에스컬레이션 검사기라는 다섯 서브에이전트에 통과시킵니다. 토큰 비용이 너무 높고, 한 줄짜리 티켓 대부분은 분류만 하면 됩니다. 어떤 변경이 이 문제를 해결합니까?

- **①** 다섯 서브에이전트를 병렬로 돌려 각 티켓이 가장 느린 하나의 시간 안에 끝나게 한다
- **②** 코디네이터가 각 티켓을 평가하고 필요한 서브에이전트만 호출하는 저렴한 계획 단계를 추가한다
- **③** 코디네이터를 없애고, 분류기가 필요하다고 판단할 때 다른 서브에이전트를 직접 호출하게 한다

> **핵심:** 코디네이터는 입력마다 필요한 하위 과제를 판단해 그 스포크만 호출해야 합니다. 모든 단계를 매번 돌리는 고정 파이프라인이 비용의 원인입니다.

1. **오답** - 병렬화는 벽시계 시간을 가장 느린 하나 수준으로 줄일 뿐, 티켓마다 다섯 개 모두의 비용을 그대로 냅니다. 문제는 지연이 아니라 토큰 비용이므로 해결되지 않습니다. Anthropic도 병렬화의 주된 이점은 속도가 아니라 철저함이라고 설명합니다.
2. **정답** - orchestrator-workers 패턴에서는 하위 과제가 미리 정해져 있지 않고, 오케스트레이터가 입력을 보고 런타임에 정합니다. 저렴한 첫 호출로 티켓의 복잡도와 필요한 스포크를 구조화된 계획으로 받고, 그 스포크만 호출하면 한 줄짜리 티켓은 분류기 하나로 끝납니다.
3. **오답** - 허브를 없애면 위임과 결과가 한곳을 지나며 얻던 관측 가능성, 일관된 오류 처리, 정보 흐름 통제를 잃습니다. 라우팅 판단이 분류기 안에 섞여 역할 분리도 흐려집니다.

📚 근거: [Orchestrator-workers (Cookbook)](https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers) · [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

> "The orchestrator decides at runtime what subtasks to create, making this more adaptive than pre-defined parallel workflows."

---

## 문제 7
### **An architect delegates a task to a subagent using the Agent tool, expecting it to reference a decision the user made three turns earlier in the main conversation about which authentication provider to use. The subagent's response ignores that decision entirely and proposes a different provider. What is the most likely cause, and how should the architect fix it?**

| 보기 | 설명 |
|------|------|
| 1. The subagent inherited a stale cached copy of the conversation and needs its session resumed to pick up the recent turns | |
| 2. The coordinator's tool permissions blocked the authentication context from being read, so the architect must widen the subagent's tool access | |
| **3. The subagent's context starts fresh each call, so the decision must be included directly in the Agent tool's prompt text** | |
| 4. The subagent's system prompt overrides user decisions by design, so the architect must disable its custom system prompt | |

**정답: 3.**

**해설:**

> 📘 레슨 1.2 · 코디네이터·서브에이전트 — Coordinator-subagent orchestration: hub-and-spoke routing, selection and refinement

**📝 문제 번역**

아키텍트가 Agent 도구로 서브에이전트에 작업을 위임하면서, 서브에이전트가 메인 대화에서 세 턴 전에 사용자가 내린 '어떤 인증 공급자를 쓸지'에 대한 결정을 참고하리라 기대합니다. 그런데 서브에이전트의 응답은 그 결정을 완전히 무시하고 다른 공급자를 제안합니다. 가장 가능성 높은 원인과 수정 방법은 무엇입니까?

- **①** 서브에이전트가 오래된 캐시 사본의 대화를 물려받았으므로, 세션을 재개해 최근 턴을 불러와야 한다
- **②** 코디네이터의 도구 권한이 인증 관련 컨텍스트를 읽지 못하게 막았으므로, 서브에이전트의 도구 접근을 넓혀야 한다
- **③** 서브에이전트의 컨텍스트는 호출마다 새로 시작하므로, 그 결정을 Agent 도구의 프롬프트 텍스트에 직접 넣어야 한다
- **④** 서브에이전트의 시스템 프롬프트가 설계상 사용자 결정을 덮어쓰므로, 커스텀 시스템 프롬프트를 꺼야 한다

> **핵심:** 서브에이전트의 컨텍스트 창은 비어 있는 상태로 시작하고 부모의 대화 이력을 자동으로 물려받지 않습니다. 필요한 결정은 Agent 도구의 `prompt` 문자열로 명시적으로 넘깁니다.

1. **오답** - 서브에이전트는 이전 턴을 캐시하거나 일부만 불러오지 않습니다. 부모 대화를 **아예 받지 않으므로** 재개할 '오래된 사본'도 존재하지 않습니다.
2. **오답** - 도구 권한은 서브에이전트가 어떤 행동을 할 수 있는지를 정할 뿐, 대화 이력을 받는지와는 관계가 없습니다. 도구 접근을 넓혀도 빠진 결정은 드러나지 않습니다.
3. **정답** - 서브에이전트의 컨텍스트는 새로 시작하고 부모 대화 이력을 자동으로 상속하지 않습니다. 따라서 필요한 결정은 Agent 도구의 프롬프트 문자열에 직접 넣어 전달해야 합니다. Agent SDK에서 부모가 서브에이전트에 넘길 수 있는 통로는 이 프롬프트 하나뿐입니다.
4. **오답** - 커스텀 시스템 프롬프트는 서브에이전트의 역할과 전문성을 정의할 뿐 사용자 결정을 덮어쓰지 않습니다. 이를 끄면 필요한 전문화만 잃고, 빠진 맥락 문제는 그대로 남습니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Create custom subagents (Claude Code)](https://code.claude.com/docs/en/sub-agents)

> "intermediate tool calls and results stay inside the subagent; only its final message returns to the parent."

---

## 문제 8
### **A support-ticket triage system always invokes a full pipeline of five subagents (classifier, sentiment analyzer, knowledge-base search, summarizer, and escalation checker) for every incoming ticket, including simple one-line requests that only need classification. Response times have become unacceptable. How should the coordinator be redesigned?**

| 보기 | 설명 |
|------|------|
| **1. Have the coordinator assess each ticket's complexity by running a dedicated lightweight classification prompt that returns a structured JSON object with fields like `complexity` (e.g., `low`, `medium`, `high`) and `required_subagents`, then dynamically invoke only the subagents listed in that output.** | |
| 2. Convert all five subagents into a single subagent that runs every step sequentially without coordinator involvement. | |
| 3. Run all five subagents in parallel for every ticket so total latency matches the slowest subagent instead of the sum. | |
| 4. Remove the coordinator entirely and let the classifier subagent directly invoke the remaining subagents it deems necessary. | |

**정답: 1.**

**해설:**

> 📘 레슨 1.2 · 코디네이터·서브에이전트 — Coordinator-subagent orchestration: hub-and-spoke routing, selection and refinement

**📝 문제 번역**

지원 티켓 분류 시스템이 들어오는 모든 티켓에 대해, 분류만 필요한 한 줄짜리 요청까지 포함해 다섯 서브에이전트(분류기, 감정 분석기, 지식 베이스 검색, 요약기, 에스컬레이션 검사기)로 이뤄진 전체 파이프라인을 항상 호출합니다. 응답 시간이 용납할 수 없을 만큼 길어졌습니다. 코디네이터를 어떻게 다시 설계해야 합니까?

- **①** 코디네이터가 전용 경량 분류 프롬프트를 실행해 각 티켓의 복잡도를 평가하게 한다. 이 프롬프트는 `complexity`(예: `low`, `medium`, `high`)와 `required_subagents` 같은 필드를 가진 구조화된 JSON 객체를 반환하고, 코디네이터는 그 출력에 나열된 서브에이전트만 동적으로 호출한다.
- **②** 다섯 서브에이전트를 코디네이터 개입 없이 모든 단계를 순차 실행하는 하나의 서브에이전트로 합친다.
- **③** 모든 티켓에 대해 다섯 서브에이전트를 병렬로 실행해 총 지연이 합계가 아니라 가장 느린 서브에이전트 수준이 되게 한다.
- **④** 코디네이터를 아예 없애고, 분류기 서브에이전트가 필요하다고 판단하는 나머지 서브에이전트를 직접 호출하게 한다.

> **핵심:** 코디네이터는 질의마다 복잡도를 먼저 판단하고 필요한 서브에이전트만 호출해야 합니다. 판단 결과를 구조화된 계약(JSON)으로 받으면 라우팅이 결정적이 됩니다.

1. **정답** - 복잡도를 점수로 매기고 필요한 서브에이전트를 나열하는 구조화된 프롬프트 계약으로, 코디네이터 수준에서 복잡도를 측정하는 방법을 직접 제시합니다. Anthropic은 명시적 출력 형식을 정하고 분류 같은 가벼운 작업에는 Claude Haiku 같은 경량 모델을 쓰라고 안내합니다. 코디네이터는 이 JSON을 읽어 나열된 서브에이전트만 호출하므로 단순한 티켓은 전체 파이프라인을 거치지 않습니다. 퓨샷 예시와 신뢰도 임계값을 더해, 신뢰도가 낮은 분류는 사람 검토 큐로 보내면 더 견고합니다.
2. **오답** - 하나로 합쳐 순차 실행하면 코디네이터는 사라지지만 모든 티켓에 모든 단계가 여전히 실행됩니다. 과잉 처리 문제는 그대로이고, 멀티에이전트 구조가 주는 관심사 분리와 서브에이전트별 도구·컨텍스트 격리까지 잃습니다.
3. **오답** - 병렬화는 벽시계 지연을 줄일 수 있지만 티켓마다 다섯 서브에이전트를 모두 호출하므로 불필요한 단계에 연산과 토큰을 낭비합니다. Anthropic의 지침이 강조하는 것은 전체 파이프라인의 병렬 실행이 아니라 복잡도에 따른 위임과 동적 호출입니다.
4. **오답** - 코디네이터를 없애는 것은 권장되는 오케스트레이터-서브에이전트 패턴에서 벗어납니다. Anthropic은 리드 에이전트(코디네이터)가 작업 분해와 위임을 맡아 라우팅 로직을 분리해 관리하도록 설명합니다. 그 책임을 분류기 안에 넣으면 구조가 흐려지고 조정 문제가 생길 수 있습니다.

📚 근거: [Orchestrator-workers (Cookbook)](https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

> "subtasks aren't pre-defined, but determined by the orchestrator based on the specific input."

---

## 문제 9
### **A coordinator for a market-research assistant splits the broad query 'analyze the competitive landscape for electric vehicle charging networks' into narrow subtasks like 'find charger connector types' and 'list charging speeds,' each assigned to a separate subagent. The synthesized report ends up missing pricing models, regulatory incentives, and major competitors entirely. What went wrong?**

| 보기 | 설명 |
|------|------|
| 1. The subagents had restricted access to external search tools, so their findings on the areas they were assigned came back thin | |
| 2. The coordinator began synthesis before the last subagents had reported back, so the report was built from partial findings | |
| 3. Several subagents researched connector types in parallel, so the coordinator ran out of budget before the other areas were covered | |
| **4. The coordinator broke the topic into a few detailed technical areas, so the remaining parts of the landscape had no subagent assigned** | |

**정답: 4.**

**해설:**

> 📘 레슨 1.2 · 코디네이터·서브에이전트 — Coordinator-subagent orchestration: hub-and-spoke routing, selection and refinement

**📝 문제 번역**

시장 조사 어시스턴트의 코디네이터가 '전기차 충전 네트워크의 경쟁 구도를 분석하라'는 넓은 질의를 '충전 커넥터 유형 찾기', '충전 속도 나열하기' 같은 좁은 하위 과제로 나누고, 각각을 별도 서브에이전트에 배정했습니다. 종합 보고서에는 요금 모델, 규제 인센티브, 주요 경쟁사가 통째로 빠졌습니다. 무엇이 잘못됐습니까?

- **①** 서브에이전트의 외부 검색 도구 접근이 제한돼, 배정된 영역에 대한 결과가 빈약하게 돌아왔다
- **②** 코디네이터가 마지막 서브에이전트들이 보고하기 전에 종합을 시작해, 보고서가 일부 결과로만 만들어졌다
- **③** 여러 서브에이전트가 커넥터 유형을 병렬로 조사하는 바람에, 다른 영역을 다루기 전에 코디네이터의 예산이 바닥났다
- **④** 코디네이터가 주제를 몇 개의 세부 기술 영역으로만 나눠, 경쟁 구도의 나머지 부분에는 배정된 서브에이전트가 없었다

> **핵심:** 서브에이전트는 배정된 측면만 조사하고 종합은 돌아온 것만 합칩니다. 분해가 질문 전체를 덮지 못하면 빠진 부분은 보고서에 절대 나타나지 않습니다(품질이 아니라 커버리지 실패).

1. **오답** - 검색 접근이 제한되면 배정된 과제의 결과가 약해지겠지만, 보고서에 빠진 것은 **아무에게도 배정되지 않은** 주제 전체입니다. 도구가 좋아져도 그 주제들은 여전히 다뤄지지 않습니다.
2. **오답** - 종합을 일찍 시작하면 배정된 과제의 결과 일부가 빠집니다. 요금, 인센티브, 주요 경쟁사는 애초에 어떤 서브에이전트에도 배정되지 않았으므로 모두를 기다렸어도 추가되지 않았을 것입니다.
3. **오답** - 배정된 커넥터 유형과 충전 속도는 서로 다른 과제라 중복 작업이나 예산 소진으로는 빈틈을 설명할 수 없습니다. 빠진 영역은 처음부터 과제 목록에 없었습니다.
4. **정답** - 코디네이터가 넓은 주제를 몇 개의 세부 기술 과제로 바꿨기 때문에 계획 어디에도 요금, 규제, 경쟁사가 없었습니다. 좋은 분할은 측면들이 합쳐서 질문 전체(경쟁사·요금·규제·기술)를 덮고, 서로 겹치지 않아야 합니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [Multiagent orchestration (Managed Agents)](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration)

---

## 문제 10
### **In a research pipeline, the coordinator hands the synthesis subagent its findings as smooth prose such as "studies show adoption doubled". The final report makes the right claims but can't say which URL, document or page any claim came from. Which handoff format fixes this?**

| 보기 | 설명 |
|------|------|
| 1. Keep the prose handoff, and add "always cite your sources" to the synthesis subagent's system prompt in its AgentDefinition | |
| **2. Pass each finding as a structured record: the claim's content in one field, with the source URL, document name and page number in separate fields** | |
| 3. Have the coordinator shorten the findings to a few key sentences so the synthesis subagent can focus on the most important claims | |
| 4. Tell the synthesis subagent in its Task prompt that every source the researcher used was reputable and verified | |

**정답: 2.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

리서치 파이프라인에서 코디네이터가 종합 서브에이전트에 "연구에 따르면 도입률이 두 배가 됐다" 같은 매끄러운 산문으로 조사 결과를 넘깁니다. 최종 보고서는 주장 자체는 맞지만, 어느 주장이 어떤 URL·문서·쪽에서 왔는지 말하지 못합니다. 어떤 전달 형식이 이를 해결합니까?

- **①** 산문 전달은 유지하고, 종합 서브에이전트의 `AgentDefinition` 시스템 프롬프트에 "항상 출처를 밝혀라"를 추가한다
- **②** 각 결과를 구조화된 레코드로 넘긴다. 주장 내용은 한 필드에, 출처 URL·문서명·쪽 번호는 별도 필드에 담는다
- **③** 종합 서브에이전트가 핵심 주장에 집중하도록, 코디네이터가 결과를 몇 개의 핵심 문장으로 줄인다
- **④** 종합 서브에이전트의 Task 프롬프트에서 연구자가 쓴 출처는 모두 신뢰할 수 있고 검증됐다고 알려 준다

> **핵심:** 출처 메타데이터는 결과가 산문으로 바뀌는 순간 가장 먼저 사라집니다. 내용과 출처를 별도 필드로 분리한 구조화 레코드로 넘겨야 다음 에이전트가 주장마다 출처를 붙일 수 있습니다.

1. **오답** - "출처를 밝혀라"는 지시가 있어도 종합 서브에이전트의 컨텍스트에는 URL이나 쪽 번호가 없습니다. 서브에이전트는 받은 프롬프트만 보므로, 달 출처 자체가 없는 상태에서 지시만 더해 봐야 소용이 없습니다.
2. **정답** - 주장 내용과 출처 URL, 문서명, 쪽 번호를 분리한 레코드로 넘기면 출처가 전달 과정에서 살아남고, 종합 서브에이전트는 내용을 인용하면서 주장마다 출처를 붙일 수 있습니다. Anthropic의 리서치 시스템도 마지막에 모든 결과를 전용 CitationAgent에 넘겨 보고서의 각 주장에 출처 위치를 붙입니다.
3. **오답** - 결과를 더 줄이면 이미 빠진 출처 정보는 물론 결과 자체도 더 많이 잃습니다. 각 전달 단계는 압축을 일으키므로, 한 번 떨어진 정보는 이후의 모든 에이전트에게서 사라집니다.
4. **오답** - 출처가 신뢰할 만하다고 알려 줘도 그 출처가 무엇인지는 여전히 전달되지 않습니다. 주장과 출처를 연결하는 정보가 없다는 근본 문제를 해결하지 못합니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

> "passes all findings to a CitationAgent, which processes the documents and research report to identify specific locations for citations"

---

## 문제 11
### **After an hour of codebase analysis, a coordinator wants to try two competing refactoring strategies. Both strategies depend on everything that analysis found. What is the best way to set this up?**

| 보기 | 설명 |
|------|------|
| **1. Fork the session once for each strategy, so each branch starts with the full analysis and the original session stays intact** | |
| 2. Spawn two fresh subagents with the prompts "Try strategy A based on the analysis so far" and "Try strategy B based on the analysis so far" | |
| 3. Return both Task calls in one coordinator response, so the two parallel subagents share the coordinator's analysis | |
| 4. Try strategy A in the original session, then try strategy B in that same session | |

**정답: 1.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

코드베이스를 한 시간 동안 분석한 뒤, 코디네이터가 서로 경쟁하는 두 리팩터링 전략을 시도하려고 합니다. 두 전략 모두 그 분석이 찾아낸 모든 것에 의존합니다. 가장 좋은 구성 방법은 무엇입니까?

- **①** 전략마다 세션을 한 번씩 포크해, 각 갈래가 전체 분석을 가진 채 시작하고 원래 세션은 그대로 두게 한다
- **②** "지금까지의 분석을 바탕으로 전략 A를 시도하라", "지금까지의 분석을 바탕으로 전략 B를 시도하라"는 프롬프트로 새 서브에이전트 두 개를 띄운다
- **③** 코디네이터의 한 응답에서 Task 호출 두 개를 내, 병렬로 도는 두 서브에이전트가 코디네이터의 분석을 공유하게 한다
- **④** 원래 세션에서 전략 A를 시도한 뒤, 같은 세션에서 전략 B를 시도한다

> **핵심:** 모든 갈래가 긴 공통 분석 전체를 필요로 하면, 빈 컨텍스트로 시작하는 새 스폰이 아니라 세션 포크가 맞습니다.

1. **정답** - 포크는 세션을 새 session ID로 분기하고 원본은 손대지 않습니다. 갈래마다 지금까지 분석한 모든 내용을 그대로 가지므로, 그 분석을 스폰 프롬프트에 욱여넣을 필요가 없습니다. 같은 기준점에서 두 전략을 독립적으로 비교할 수 있습니다.
2. **오답** - 새로 띄운 서브에이전트는 빈 대화로 시작하므로 "지금까지의 분석"이 무엇인지 알지 못합니다. 그 문구는 서브에이전트에게 아무 의미도 없고, 분석을 다시 하거나 근거 없이 진행하게 됩니다.
3. **오답** - 한 응답에 Task 호출을 함께 내면 서브에이전트가 병렬로 실행될 뿐, 각자 새 컨텍스트로 시작한다는 사실은 변하지 않습니다. 병렬 스폰은 코디네이터의 분석을 공유하게 해 주지 않습니다.
4. **오답** - 한 세션에서 두 전략을 차례로 진행하면 전략 A의 변경과 맥락이 전략 B의 출발점에 섞입니다. 두 방안을 같은 기준점에서 독립적으로 비교할 수 없습니다.

📚 근거: [Session management (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/sessions) · [Agent SDK reference – TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript)

> "Try an alternative approach without losing the original | Fork the session."

---

## 문제 12
### **A team is building a "doc-reviewer" subagent that should be able to read and comment on documentation but must never be able to modify files, even accidentally. The coordinator itself has Read, Edit, Write, Grep, and Glob available. How should the doc-reviewer's AgentDefinition be configured to guarantee this constraint?**

| 보기 | 설명 |
|------|------|
| **1. Set tools to ["Read", "Grep"] on the doc-reviewer definition so it inherits only the listed read tools regardless of what the coordinator has available** | |
| 2. Leave tools unset on the doc-reviewer definition and instead instruct it in the prompt field never to call Edit or Write during its review | |
| 3. Set the coordinator's own allowedTools to just ["Read", "Grep"] for the duration of the review so neither agent can access Edit or Write | |
| 4. Give doc-reviewer the same tools as the coordinator, then rely on the description field to signal that the subagent is read-only in practice | |

**정답: 1.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

팀이 문서를 읽고 의견을 달 수는 있지만 실수로라도 파일을 수정해서는 절대 안 되는 "doc-reviewer" 서브에이전트를 만들고 있습니다. 코디네이터 자신은 Read, Edit, Write, Grep, Glob을 쓸 수 있습니다. 이 제약을 보장하려면 doc-reviewer의 `AgentDefinition` 을 어떻게 구성해야 합니까?

- **①** doc-reviewer 정의에 `tools` 를 `["Read", "Grep"]` 으로 지정해, 코디네이터가 무엇을 가졌든 나열된 읽기 도구만 갖게 한다
- **②** doc-reviewer 정의의 `tools` 는 비워 두고, 대신 `prompt` 필드에서 검토 중 Edit이나 Write를 절대 호출하지 말라고 지시한다
- **③** 검토하는 동안 코디네이터 자신의 `allowedTools` 를 `["Read", "Grep"]` 으로만 설정해 두 에이전트 모두 Edit·Write에 접근하지 못하게 한다
- **④** doc-reviewer에 코디네이터와 같은 도구를 주고, `description` 필드로 실제로는 읽기 전용이라는 신호를 준다

> **핵심:** 서브에이전트가 쓸 수 있는 도구는 그 서브에이전트 정의의 `tools` 필드가 정합니다. 프롬프트·설명은 행동을 유도할 뿐 도구를 제거하지 못합니다.

1. **정답** - `AgentDefinition` 의 `tools` 필드는 명시적 허용 목록입니다. Read와 Grep만 지정하면 서브에이전트의 세션에는 Edit·Write 도구가 아예 없으므로, 코디네이터나 부모 세션이 무엇을 할 수 있든 수정이 불가능합니다. 공식 문서도 doc-reviewer를 Read·Grep만 가진 예로 들어 "분석은 하되 실수로 문서를 수정하지 않게" 한다고 설명합니다.
2. **오답** - `tools` 를 비워 두면 서브에이전트는 서브에이전트가 쓸 수 있는 모든 도구를 상속합니다. 프롬프트 지시는 모델이 벗어날 수 있는 권고일 뿐 강제된 제한이 아닙니다.
3. **오답** - 코디네이터의 도구를 줄이면 코디네이터의 다른 정당한 작업까지 막히고, 특정 서브에이전트의 도구를 제한하는 것과는 별개의 설정입니다. 게다가 서브에이전트를 띄우는 데 필요한 Agent(Task) 도구까지 빠지게 됩니다.
4. **오답** - `description` 은 Claude가 언제 이 서브에이전트를 부를지에만 영향을 줍니다. 일단 실행된 서브에이전트가 어떤 도구를 호출할 수 있는지는 제한하지 않습니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Create custom subagents (Claude Code)](https://code.claude.com/docs/en/sub-agents)

> "Array of allowed tool names. If omitted, inherits every tool available to subagents"

---

## 문제 13
### **Your team adds a doc-reviewer subagent that must be able to read and search documentation but must never change it. Which configuration actually guarantees that?**

| 보기 | 설명 |
|------|------|
| **1. Set tools: ["Read", "Grep"] in the doc-reviewer's own AgentDefinition** | |
| 2. Leave tools unset and add "Never edit or write files" to the doc-reviewer's prompt | |
| 3. Write a description that says the doc-reviewer is a read-only agent | |
| 4. Remove Edit and Write from the coordinator's allowedTools | |

**정답: 1.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

팀에 문서를 읽고 검색할 수는 있어야 하지만 절대 수정해서는 안 되는 doc-reviewer 서브에이전트를 추가합니다. 어떤 구성이 이를 실제로 보장합니까?

- **①** doc-reviewer 자신의 `AgentDefinition` 에 `tools: ["Read", "Grep"]` 을 지정한다
- **②** `tools` 는 비워 두고 doc-reviewer의 `prompt` 에 "파일을 절대 편집하거나 쓰지 마라"를 추가한다
- **③** doc-reviewer가 읽기 전용 에이전트라고 말하는 `description` 을 쓴다
- **④** 코디네이터의 `allowedTools` 에서 Edit과 Write를 뺀다

> **핵심:** "절대 수정하면 안 된다"는 요구는 `tools` 필드에, "어떤 작업에 고를지"는 `description` 에, "무엇을 알아야 하는지"는 `prompt` 에 들어갑니다.

1. **정답** - 서브에이전트 자신의 정의에 있는 `tools` 필드가 그 서브에이전트가 호출할 수 있는 도구를 결정합니다. Read와 Grep만 있으면 Edit·Write 도구는 세션에 존재하지 않으므로 수정할 방법 자체가 없습니다.
2. **오답** - `tools` 를 비워 두면 서브에이전트는 쓸 수 있는 모든 도구를 상속하므로 Edit·Write도 갖게 됩니다. 프롬프트 한 줄은 모델이 따르지 않을 수도 있는 지시일 뿐입니다.
3. **오답** - `description` 은 코디네이터가 어떤 에이전트를 고를지에만 영향을 줍니다. '읽기 전용'이라고 적어도 실행된 서브에이전트의 도구는 줄어들지 않습니다.
4. **오답** - 코디네이터의 `allowedTools` 를 좁혀도 서브에이전트의 도구 범위가 정해지지는 않습니다. 서브에이전트 도구 제한은 그 서브에이전트 정의의 `tools` 에서 설정합니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

> "A doc-reviewer subagent might only have access to Read and Grep tools, ensuring it can analyze but never accidentally modify your documentation files."

---

## 문제 14
### **After a web-researcher subagent finishes, a coordinator spawns a synthesis subagent. The synthesis subagent's report comes back generic and cites none of the sources the researcher found. What change actually fixes this?**

| 보기 | 설명 |
|------|------|
| 1. Raise the synthesis subagent's maxTurns so it has more turns to find the earlier research | |
| 2. Give the synthesis subagent web search tools so it can gather the material it needs | |
| **3. Paste the researcher's complete findings and source details into the prompt of the Task call that spawns the synthesis subagent** | |
| 4. Switch the synthesis subagent to a larger model with the model field | |

**정답: 3.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

web-researcher 서브에이전트가 끝난 뒤 코디네이터가 종합 서브에이전트를 띄웁니다. 종합 서브에이전트의 보고서는 일반론만 담겨 있고 연구자가 찾은 출처를 하나도 인용하지 않습니다. 실제로 이를 고치는 변경은 무엇입니까?

- **①** 종합 서브에이전트의 `maxTurns` 를 늘려 앞선 조사를 찾을 턴을 더 준다
- **②** 종합 서브에이전트에 웹 검색 도구를 줘 필요한 자료를 스스로 모으게 한다
- **③** 연구자의 전체 조사 결과와 출처 정보를 종합 서브에이전트를 띄우는 Task 호출의 프롬프트에 붙여 넣는다
- **④** `model` 필드로 종합 서브에이전트를 더 큰 모델로 바꾼다

> **핵심:** 서브에이전트는 새 대화에서 시작하고 코디네이터의 턴을 보지 못합니다. 앞 단계의 조사 결과는 코디네이터가 스폰 프롬프트에 직접 써 넣어야만 전달됩니다.

1. **오답** - `maxTurns` 는 서브에이전트가 쓸 수 있는 턴 수의 상한일 뿐입니다. 턴을 더 줘도 컨텍스트에 조사 자료가 없으니, 같은 일반론을 만들 여유만 늘어납니다.
2. **오답** - 검색 도구를 주면 조사를 처음부터 다시 해 다른 결과를 만들 뿐, 연구자가 이미 모은 출처와 결과는 여전히 쓰이지 않습니다. 비용과 작업이 중복됩니다.
3. **정답** - 서브에이전트는 부모의 턴을 보지 못하고 최종 응답만 부모에게 돌려줍니다. 따라서 연구자의 결과는 코디네이터가 종합 서브에이전트의 Task 프롬프트에 완전한 형태(내용과 출처)로 넣어야만 도달합니다.
4. **오답** - 더 큰 모델도 같은 빈 컨텍스트를 받습니다. 컨텍스트에 없는 사실은 어떤 모델도 복원할 수 없습니다.

📚 근거: [How the agent loop works (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/agent-loop) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

> "It does not see the parent's turns, and only its final response returns to the parent."

---

## 문제 15
### **Style-checker, security-scanner and test-coverage reviews are independent of each other, and each takes about ten minutes. Which coordinator behaviour gets all three results back in roughly ten minutes instead of thirty?**

| 보기 | 설명 |
|------|------|
| 1. Spawn one reviewer per turn, and request the next spawn as soon as the previous reviewer's result comes back | |
| 2. Put all three reviews into the prompt of one general-purpose subagent so a single spawn covers them | |
| **3. Return three Task tool_use blocks in one response, one for each reviewer subagent** | |
| 4. Spawn the reviewers across separate turns, but give each the same maxTurns so they finish together | |

**정답: 3.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

스타일 검사, 보안 스캔, 테스트 커버리지 검토는 서로 독립적이고 각각 10분쯤 걸립니다. 어떤 코디네이터 동작이 세 결과를 30분이 아니라 약 10분 만에 받게 해 줍니까?

- **①** 턴마다 검토자 하나씩 띄우고, 앞 검토자의 결과가 돌아오는 즉시 다음 스폰을 요청한다
- **②** 세 검토를 범용 서브에이전트 하나의 프롬프트에 모두 넣어 한 번의 스폰으로 처리한다
- **③** 한 응답에서 검토자 서브에이전트마다 하나씩, Task `tool_use` 블록 세 개를 반환한다
- **④** 검토자들을 서로 다른 턴에 띄우되, 함께 끝나도록 모두 같은 `maxTurns` 를 준다

> **핵심:** 서브에이전트가 동시에 실행되려면 코디네이터가 한 응답 안에 여러 Task 호출을 함께 내야 합니다. 그래야 총 시간이 합이 아니라 가장 느린 하나 수준이 됩니다.

1. **오답** - 턴마다 하나씩 띄우면 각 스폰이 앞 결과를 기다려야 하므로 시간이 더해져 30분이 걸립니다. 결과를 받자마자 다음을 요청해도 직렬 실행이라는 점은 같습니다.
2. **오답** - 서브에이전트 하나가 세 검토를 맡으면 차례로 처리하므로 역시 시간이 더해집니다. 검토별 컨텍스트 분리와 전문화도 잃습니다.
3. **정답** - Claude는 한 응답에 여러 `tool_use` 블록을 낼 수 있습니다. 코디네이터가 같은 턴에 검토자별 Task 호출을 하나씩 내면 세 서브에이전트가 동시에 실행되고, 독립 과제가 모두의 합이 아니라 가장 느린 하나의 시간 안에 끝납니다.
4. **오답** - `maxTurns` 는 서브에이전트가 얼마나 오래 돌 수 있는지의 상한일 뿐, 스폰을 동시에 만들지 않습니다. 서로 다른 턴에 띄우면 여전히 직렬입니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)

> "multiple subagents can run concurrently, so independent subtasks finish in the time of the slowest one rather than the sum of all of them"

---

## 문제 16
### **A coordinator delegates market research with a script: "Search 'chip shortage 2025', open the top five results, summarise each, then search 'chip prices'." Subagents keep returning unusable notes whenever the search results don't look the way the script expected. How should the delegation prompt be rewritten?**

| 보기 | 설명 |
|------|------|
| 1. Make the script longer, with an extra branch for each kind of search result the subagent might hit | |
| 2. Shorten it to an open goal such as "Research the semiconductor shortage" and let the subagent decide everything else | |
| **3. State the objective, the boundaries (2025 supply chains only; another subagent covers the 2021 crisis) and the required output (findings as records with source URL and document name), and leave the search steps to the subagent** | |
| 4. Keep the script, and raise the subagent's maxTurns so it has room to recover when a step fails | |

**정답: 3.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

코디네이터가 시장 조사를 스크립트로 위임합니다. "'chip shortage 2025'를 검색하고, 상위 다섯 개 결과를 열어 각각 요약한 다음, 'chip prices'를 검색하라." 검색 결과가 스크립트가 예상한 모습과 다를 때마다 서브에이전트가 쓸 수 없는 메모를 돌려줍니다. 위임 프롬프트를 어떻게 다시 써야 합니까?

- **①** 서브에이전트가 마주칠 수 있는 검색 결과 종류마다 분기를 추가해 스크립트를 더 길게 만든다
- **②** "반도체 부족 사태를 조사하라" 같은 열린 목표로 줄이고, 나머지는 서브에이전트가 모두 정하게 한다
- **③** 목표, 경계(2025년 공급망만, 2021년 위기는 다른 서브에이전트 담당), 요구 출력(출처 URL과 문서명을 담은 레코드 형태의 결과)을 명시하고, 검색 단계는 서브에이전트에 맡긴다
- **④** 스크립트는 유지하고, 단계가 실패할 때 회복할 여유가 있도록 서브에이전트의 `maxTurns` 를 늘린다

> **핵심:** 위임 프롬프트는 밟을 단계가 아니라 달성할 목표와 품질 기준을 말해야 합니다. 단, 목표형 프롬프트도 목표·출력 형식·도구와 출처 안내·과제 경계를 구체적으로 담아야 합니다.

1. **오답** - 리서치는 경로 의존적이라 첫 검색 결과가 다음에 볼 곳을 바꿉니다. 분기를 아무리 늘려도 모든 경우를 미리 쓸 수 없고, 스크립트의 경직성만 커집니다.
2. **오답** - 너무 열린 목표는 반대 방향의 실패입니다. Anthropic의 초기 시스템에서 "반도체 부족 사태를 조사하라" 같은 짧은 지시를 받은 서브에이전트들은 과제를 잘못 해석하거나, 한쪽은 2021년 자동차 칩 위기를 조사하고 다른 둘은 2025년 공급망을 중복 조사했습니다.
3. **정답** - 목표, 경계, 출력 형식을 주고 방법은 서브에이전트가 고르게 하면 결과가 예상과 달라도 적응할 수 있습니다. 부모에게는 서브에이전트의 최종 메시지만 돌아오므로, 그 메시지에 무엇이 담겨야 하는지(출처를 포함한 레코드)를 프롬프트가 정해야 결과를 쓸 수 있습니다.
4. **오답** - 턴을 늘려도 스크립트가 상황에 맞지 않는다는 근본 문제는 그대로입니다. 서브에이전트는 맞지 않는 단계를 더 오래 따를 뿐입니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

> "You can't hardcode a fixed path for exploring complex topics, as the process is inherently dynamic and path-dependent."

---

## 문제 17
### **An architect is defining a "database-migration" AgentDefinition with a long prompt field describing SQL best practices, rollback strategy, and data integrity checks. Separately, each time the coordinator invokes this subagent it supplies a different per-call prompt describing the specific table and migration at hand. What is the correct relationship between these two prompt sources?**

| 보기 | 설명 |
|------|------|
| **1. AgentDefinition.prompt sets the subagent's persistent system prompt and expertise, while the per-call prompt passed at invocation supplies the specific task details for that run** | |
| 2. AgentDefinition.prompt is ignored at runtime once a per-call prompt is supplied, so only the invocation-time prompt actually reaches the subagent's model | |
| 3. The per-call prompt is merged into the coordinator's own system prompt instead of the subagent's, so the subagent only ever sees AgentDefinition.prompt | |
| 4. Both prompt sources are concatenated and then truncated to the shorter of the two, so only whichever prompt is more concise is guaranteed to reach the subagent intact | |

**정답: 1.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

아키텍트가 SQL 모범 사례, 롤백 전략, 데이터 무결성 검사를 설명하는 긴 `prompt` 필드를 가진 "database-migration" `AgentDefinition` 을 정의하고 있습니다. 이와 별도로, 코디네이터는 이 서브에이전트를 호출할 때마다 해당 테이블과 마이그레이션을 설명하는 서로 다른 호출별 프롬프트를 제공합니다. 두 프롬프트 출처의 올바른 관계는 무엇입니까?

- **①** `AgentDefinition.prompt` 는 서브에이전트의 지속적인 시스템 프롬프트와 전문성을 정하고, 호출 시 넘기는 호출별 프롬프트는 그 실행의 구체적 작업 내용을 제공한다
- **②** 호출별 프롬프트가 주어지면 런타임에 `AgentDefinition.prompt` 는 무시되므로, 호출 시점의 프롬프트만 서브에이전트의 모델에 도달한다
- **③** 호출별 프롬프트는 서브에이전트가 아니라 코디네이터 자신의 시스템 프롬프트에 합쳐지므로, 서브에이전트는 `AgentDefinition.prompt` 만 본다
- **④** 두 프롬프트는 이어 붙인 뒤 더 짧은 쪽 길이로 잘리므로, 더 간결한 프롬프트만 온전히 도달한다고 보장된다

> **핵심:** 정의의 `prompt` 는 고정된 전문성(시스템 프롬프트), 호출별 프롬프트는 그때그때의 작업입니다. 둘 다 서브에이전트에 온전히 전달됩니다.

1. **정답** - `AgentDefinition.prompt` 는 서브에이전트의 역할, 전문성, 제약을 정하는 시스템 프롬프트로서 매 실행에 적용됩니다. 호출마다 넘기는 Agent(Task) 도구의 프롬프트 문자열은 그 실행의 구체적 작업과 데이터를 담습니다. SQL 모범 사례처럼 코디네이터 지시에는 잡음일 뿐인 전문 지식은 정의에, 어느 테이블을 어떻게 바꿀지는 호출 프롬프트에 둡니다.
2. **오답** - `AgentDefinition.prompt` 는 버려지지 않습니다. 호출별 프롬프트와 함께, 모든 호출에서 시스템 프롬프트로 서브에이전트의 행동을 계속 형성합니다.
3. **오답** - 호출별 프롬프트는 코디네이터의 시스템 프롬프트에 합쳐지지 않고, 호출되는 서브에이전트에 전달됩니다. 문서도 서브에이전트가 받는 것을 '자기 시스템 프롬프트와 Agent 도구의 프롬프트'로 명시합니다.
4. **오답** - 더 짧은 쪽으로 자르는 동작은 없습니다. 정의의 시스템 프롬프트와 호출 프롬프트 모두 그대로 쓰입니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Agent SDK reference – TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript)

> "Its own system prompt (`AgentDefinition.prompt`) and the Agent tool's prompt"

---

## 문제 18
### **A coordinator runs a "web-researcher" subagent that gathers ten sources on a topic, then spawns a "synthesis" subagent to write the final report. The synthesis subagent's output ignores nearly all of the researcher's findings and instead re-derives generic conclusions from scratch. The coordinator's prompt to synthesis only said "Write a report based on the research that was just completed." What change fixes this?**

| 보기 | 설명 |
|------|------|
| **1. Paste the web-researcher's full notes and source details into the synthesis subagent's prompt text, so it can write the report from that material** | |
| 2. Raise the synthesis subagent's maxTurns limit, so it has more turns to work through the topic and build the report from what it finds | |
| 3. Switch the synthesis subagent to a larger model, so it can work out from the short prompt which research the coordinator is referring to | |
| 4. Give the synthesis subagent the same search tools as web-researcher, so it can run its own searches on the topic before writing the report | |

**정답: 1.**

**해설:**

> 📘 레슨 1.3 · 서브에이전트 생성 — Spawning subagents: Task tool, AgentDefinition, and context passing

**📝 문제 번역**

코디네이터가 주제에 대한 출처 열 개를 모으는 "web-researcher" 서브에이전트를 실행한 뒤, 최종 보고서를 쓸 "synthesis" 서브에이전트를 띄웁니다. 종합 서브에이전트의 출력은 연구자의 결과를 거의 모두 무시하고 일반론을 처음부터 다시 도출합니다. 코디네이터가 종합 서브에이전트에 보낸 프롬프트는 "방금 완료된 조사를 바탕으로 보고서를 써라"뿐이었습니다. 무엇을 바꿔야 합니까?

- **①** web-researcher의 전체 노트와 출처 정보를 종합 서브에이전트의 프롬프트 텍스트에 붙여 넣어, 그 자료로 보고서를 쓰게 한다
- **②** 종합 서브에이전트의 `maxTurns` 한도를 늘려, 주제를 충분히 다루고 찾은 내용으로 보고서를 만들 턴을 더 준다
- **③** 종합 서브에이전트를 더 큰 모델로 바꿔, 짧은 프롬프트만으로도 코디네이터가 말하는 조사가 무엇인지 알아내게 한다
- **④** 종합 서브에이전트에 web-researcher와 같은 검색 도구를 줘, 보고서를 쓰기 전에 직접 검색하게 한다

> **핵심:** 서브에이전트의 컨텍스트 창은 새로 시작하고, 프롬프트 문자열이 코디네이터에서 오는 유일한 통로입니다. "방금 완료된 조사"는 종합 서브에이전트에게 아무것도 가리키지 않습니다.

1. **정답** - 연구자의 노트와 출처는 그 프롬프트에 직접 쓰여야만 종합 서브에이전트에 도달합니다. Agent SDK 문서도 서브에이전트에 필요한 파일 경로, 오류 메시지, 결정은 Agent 도구의 프롬프트에 직접 넣으라고 안내합니다.
2. **오답** - `maxTurns` 는 턴 수를 제한할 뿐입니다. 종합 서브에이전트에는 여전히 조사 자료가 없으므로, 턴이 늘어도 같은 일반론을 만들 여유만 커집니다.
3. **오답** - 더 큰 모델도 같은 짧은 프롬프트와 빈 컨텍스트를 받습니다. 연구 결과는 어디에도 없으므로, 지시 문구만으로 그것을 복원할 수 있는 모델은 없습니다.
4. **오답** - 새로 검색하면 다른 결과가 나올 뿐, 연구자가 이미 모은 출처 열 개와 결과는 이어지지 않습니다. 완료된 조사는 여전히 무시되고 작업만 중복됩니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [How the agent loop works (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/agent-loop)

> "The only content you pass from parent to subagent is the Agent tool's prompt string, so include any file paths, error messages, or decisions the subagent needs directly in that prompt."

---

## 문제 19
### **A refund agent's system prompt says "always call get_customer before process_refund". Audits show that a small share of refunds still go out without the customer's identity being verified first. What fix makes verification before a refund guaranteed?**

| 보기 | 설명 |
|------|------|
| 1. Make the instruction more emphatic and add few-shot examples that show get_customer being called before process_refund | |
| 2. Move the agent to a larger, more capable model that follows instructions more reliably | |
| **3. Keep the instruction, and add a PreToolUse hook on process_refund that denies the call unless a verified customer ID from get_customer has been recorded** | |
| 4. Add a PostToolUse hook on process_refund that checks whether verification happened once the refund has run | |

**정답: 3.**

**해설:**

> 📘 레슨 1.4 · 선행 게이트·핸드오프 — Prerequisite gates, parallel investigation and human handoff in agent workflows

**📝 문제 번역**

환불 에이전트의 시스템 프롬프트에 "`process_refund` 전에 항상 `get_customer` 를 호출하라"고 적혀 있습니다. 감사 결과, 적은 비율이지만 여전히 고객 본인 확인 없이 환불이 나가고 있습니다. 환불 전 본인 확인을 **보장** 하는 수정은 무엇입니까?

- **①** 지시를 더 강하게 쓰고, `process_refund` 전에 `get_customer` 를 호출하는 퓨샷 예시를 추가한다
- **②** 지시를 더 잘 따르는 더 크고 유능한 모델로 바꾼다
- **③** 지시는 유지하고, `get_customer` 에서 확인된 고객 ID가 기록돼 있지 않으면 호출을 거부하는 PreToolUse 훅을 `process_refund` 에 추가한다
- **④** 환불이 실행된 뒤 본인 확인이 있었는지 검사하는 PostToolUse 훅을 `process_refund` 에 추가한다

> **핵심:** 프롬프트는 모델의 선택을 유도할 뿐이라 실패율이 0이 되지 않습니다. 돈·신원·규정이 걸린 순서는 도구 실행 전에 코드로 막는 PreToolUse 훅으로 강제합니다.

1. **오답** - 강조와 퓨샷 예시는 준수율을 높일 수 있지만, 모델이 매 턴 스스로 도구를 고른다는 사실은 그대로입니다. 긴 대화나 설득하는 고객 앞에서 `process_refund` 가 먼저 나오는 턴이 여전히 생길 수 있습니다.
2. **오답** - 더 큰 모델도 확률적으로 지시를 따를 뿐입니다. 금융 작업에서는 0이 아닌 실패율이면 일부 환불이 확인되지 않은 사람에게 나간다는 뜻이므로 보장이 되지 않습니다.
3. **정답** - PreToolUse 훅은 도구가 실행되기 **전에** 코드로 돌며 호출을 거부할 수 있으므로, 모델이 무엇을 결정하든 확인 기록 없이는 환불이 실행되지 않습니다. 프롬프트 지시는 모델이 올바른 순서를 계획하도록 돕기 위해 남겨 두고, 훅이 그 순서를 강제합니다.
4. **오답** - PostToolUse는 도구가 이미 실행된 뒤에 돌므로 돈은 이미 나갔습니다. 문서도 PostToolUse 훅은 도구가 이미 실행됐기 때문에 동작을 되돌릴 수 없다고 명시합니다.

📚 근거: [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide) · [Hooks reference](https://code.claude.com/docs/en/hooks)

> "PreToolUse | Before a tool call executes. Can block it"

---

## 문제 20
### **A coordinator splits a three-part complaint and spawns one subagent per concern. The address subagent keeps asking which customer account it is working on. What explains this, and what is the fix?**

| 보기 | 설명 |
|------|------|
| 1. Subagents inherit the coordinator's history only up to a size limit, so the fix is to shorten the conversation | |
| **2. The subagent does not see the coordinator's turns, so the fix is to put the verified customer ID and order numbers in the prompt it is spawned with** | |
| 3. The fix is to give the subagent the SubagentStop hook, which shares the parent's state with it | |
| 4. Subagents running in parallel cannot read account data, so the investigations have to run one after another | |

**정답: 2.**

**해설:**

> 📘 레슨 1.4 · 선행 게이트·핸드오프 — Prerequisite gates, parallel investigation and human handoff in agent workflows

**📝 문제 번역**

코디네이터가 세 가지 내용이 섞인 불만을 나누고 문제마다 서브에이전트를 하나씩 띄웁니다. 주소 담당 서브에이전트가 자기가 어느 고객 계정을 다루는지 계속 묻습니다. 원인과 해결책은 무엇입니까?

- **①** 서브에이전트는 크기 한도까지만 코디네이터의 이력을 물려받으므로, 대화를 줄이면 된다
- **②** 서브에이전트는 코디네이터의 턴을 보지 못하므로, 띄울 때 주는 프롬프트에 확인된 고객 ID와 주문 번호를 넣으면 된다
- **③** 부모의 상태를 공유해 주는 SubagentStop 훅을 서브에이전트에 주면 된다
- **④** 병렬로 도는 서브에이전트는 계정 데이터를 읽을 수 없으므로, 조사를 하나씩 차례로 돌려야 한다

> **핵심:** 서브에이전트는 새 대화로 시작해 자기 프롬프트만 봅니다. 공유해야 할 사건 정보(확인된 고객 ID, 주문 번호, 고객의 원래 표현)는 코디네이터가 모든 스폰 프롬프트에 명시적으로 넣어야 합니다.

1. **오답** - 서브에이전트는 크기와 상관없이 부모 이력을 **전혀** 물려받지 않습니다. 대화를 줄여도 전달되는 것은 없습니다.
2. **정답** - 서브에이전트는 부모의 턴을 보지 못하고 최종 응답만 돌려줍니다. 코디네이터가 모든 스폰 프롬프트에 같은 사건 정보를 담아야 어떤 서브에이전트도 고객을 다시 확인하거나 계정을 추측할 필요가 없습니다.
3. **오답** - SubagentStop 훅은 서브에이전트가 끝날 때 발생하는 이벤트로, 코디네이터 쪽에서 완료를 확인하고 결과를 모으는 지점입니다. 부모의 상태를 서브에이전트에 전달하는 기능이 아닙니다.
4. **오답** - 병렬 실행이 계정 데이터 접근을 막지는 않습니다. 조회처럼 독립적이고 읽기 전용인 작업은 오히려 병렬로 돌리기에 안전하며, 순서대로 돌려도 부모 이력이 생기지는 않습니다.

📚 근거: [How the agent loop works (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/agent-loop) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

> "It does not see the parent's turns, and only its final response returns to the parent."

---

## 문제 21
### **A team wants to enforce that get_customer must run before process_refund, and registers two separate PreToolUse hooks: one matched to get_customer that writes a "verified" marker to a session file, and one matched to process_refund that reads that same file. A reviewer worries this design assumes the hooks run in a guaranteed order relative to each other. Is that assumption safe, and why?**

| 보기 | 설명 |
|------|------|
| 1. It is unsafe, because every registered PreToolUse hook always executes in parallel for every tool call in the session regardless of its matcher, so the file could be read before it is ever written. | |
| 2. It is unsafe, because hooks matched to different tools share no session state with each other at all, so the process_refund hook can never see a file written by the get_customer hook. | |
| 3. It is safe, because the runtime automatically orders hooks alphabetically by their tool name before executing them, which guarantees get_customer's hook always runs first. | |
| **4. It is unsafe, because each hook runs only when its matched tool is invoked, but nothing guarantees that `get_customer` is invoked before `process_refund`. The model could skip the prerequisite tool entirely, causing the `process_refund` hook to read a file that may not exist or contain valid data.** | |

**정답: 4.**

**해설:**

> 📘 레슨 1.4 · 선행 게이트·핸드오프 — Prerequisite gates, parallel investigation and human handoff in agent workflows

**📝 문제 번역**

팀이 `get_customer` 가 반드시 `process_refund` 보다 먼저 실행되도록 강제하려고 두 개의 PreToolUse 훅을 등록합니다. 하나는 `get_customer` 에 매칭돼 세션 파일에 "verified" 표시를 쓰고, 다른 하나는 `process_refund` 에 매칭돼 같은 파일을 읽습니다. 리뷰어는 이 설계가 두 훅이 서로에 대해 정해진 순서로 실행된다고 가정한다고 우려합니다. 이 가정은 안전합니까? 그 이유는?

- **①** 안전하지 않다. 등록된 모든 PreToolUse 훅은 matcher와 상관없이 세션의 모든 도구 호출마다 항상 병렬로 실행되므로, 파일이 쓰이기 전에 읽힐 수 있다
- **②** 안전하지 않다. 서로 다른 도구에 매칭된 훅은 세션 상태를 전혀 공유하지 않으므로, `process_refund` 훅은 `get_customer` 훅이 쓴 파일을 절대 볼 수 없다
- **③** 안전하다. 런타임이 실행 전에 도구 이름의 알파벳 순서로 훅을 정렬하므로 `get_customer` 의 훅이 항상 먼저 실행된다
- **④** 안전하지 않다. 각 훅은 매칭된 도구가 호출될 때만 실행되는데, `get_customer` 가 `process_refund` 보다 먼저 호출된다는 보장이 없다. 모델이 선행 도구를 아예 건너뛸 수 있으므로, `process_refund` 훅은 존재하지 않거나 유효하지 않은 파일을 읽게 될 수 있다

> **핵심:** 훅은 자기 도구가 호출될 때만 실행되며 선행 도구 호출을 강제하지 못합니다. 그래서 게이트는 기록이 없거나 읽을 수 없으면 거부하는 fail-closed로 설계하고, 확인 기록은 PreToolUse가 아니라 성공 뒤에 도는 PostToolUse에서 씁니다.

1. **오답** - 훅은 모든 도구 호출마다 무차별로 실행되지 않습니다. matcher가 호출된 도구 이름과 맞을 때만 실행됩니다. (같은 이벤트에 매칭된 여러 훅이 병렬로 실행되는 것은 맞지만, 그것이 이 설계의 핵심 문제는 아닙니다.)
2. **오답** - 훅은 애플리케이션의 일반 콜백(또는 사용자 권한으로 도는 명령)이라 파일, 세션별 딕셔너리 같은 저장소로 상태를 공유할 수 있습니다. 문제는 공유 상태가 없다는 것이 아니라 `get_customer` 가 먼저 실행된다는 보장이 없다는 것입니다.
3. **오답** - 도구 이름의 알파벳 순서로 훅을 정렬하는 동작은 없습니다. 훅이 언제 발생하는지는 모델이 도구를 어떤 순서로 호출하는지에 달려 있습니다.
4. **정답** - matcher는 '그 도구가 호출되면 훅이 실행된다'만 보장할 뿐, `get_customer` 를 먼저 호출하게 만들지는 못합니다. 모델이 곧장 `process_refund` 를 호출하면 표시 파일이 없거나 이전 세션의 낡은 파일일 수 있습니다. 게다가 표시를 `get_customer` 의 PreToolUse에서 쓰면 조회가 실패해도 표시가 남습니다. 표시는 PostToolUse에서 쓰고, `process_refund` 게이트는 기록이 없으면 거부해야 합니다.

📚 근거: [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide) · [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks)

---

## 문제 22
### **An engineer registers two PreToolUse hooks on process_refund. Hook A loads the verification record into a shared variable, and Hook B reads that variable and denies the call if it is empty. In testing, some refunds are wrongly denied and the failures look random. What is the design flaw?**

| 보기 | 설명 |
|------|------|
| 1. Hook B should be registered as PostToolUse so that it runs after Hook A has finished | |
| **2. Hooks that match the same event run in parallel, in no guaranteed order, so Hook B cannot rely on Hook A having run. Each gate has to read the state it needs on its own** | |
| 3. Hooks run in the order they are registered, so Hook B was registered before Hook A and the fix is to swap them | |
| 4. Hook B fails closed, and it should allow the refund when the shared variable is empty | |

**정답: 2.**

**해설:**

> 📘 레슨 1.4 · 선행 게이트·핸드오프 — Prerequisite gates, parallel investigation and human handoff in agent workflows

**📝 문제 번역**

엔지니어가 `process_refund` 에 PreToolUse 훅 두 개를 등록합니다. 훅 A는 확인 기록을 공유 변수에 불러오고, 훅 B는 그 변수를 읽어 비어 있으면 호출을 거부합니다. 테스트에서 일부 환불이 잘못 거부되며, 실패가 무작위처럼 보입니다. 설계상의 결함은 무엇입니까?

- **①** 훅 A가 끝난 뒤 실행되도록 훅 B를 PostToolUse로 등록해야 한다
- **②** 같은 이벤트에 매칭된 훅은 순서 보장 없이 병렬로 실행되므로, 훅 B는 훅 A가 이미 실행됐다고 기대할 수 없다. 각 게이트는 필요한 상태를 스스로 읽어야 한다
- **③** 훅은 등록 순서대로 실행되므로 훅 B가 훅 A보다 먼저 등록된 것이다. 둘을 바꾸면 된다
- **④** 훅 B가 fail-closed로 동작하니, 공유 변수가 비어 있으면 환불을 허용해야 한다

> **핵심:** 같은 이벤트에 매칭된 훅은 병렬로 실행되고 완료 순서가 비결정적입니다. 한 훅이 다른 훅의 실행을 전제로 하는 설계는 처음부터 깨져 있습니다.

1. **오답** - PostToolUse는 도구가 실행된 **뒤** 에 돌므로 환불을 막기에는 너무 늦습니다. 순서 문제를 해결하려다 게이트 자체를 잃습니다.
2. **정답** - 공식 문서는 이벤트가 발생하면 매칭된 훅들이 병렬로 실행되고 완료 순서는 비결정적이므로, 각 훅을 다른 훅에 의존하지 않고 독립적으로 동작하게 작성하라고 안내합니다. 훅 B가 확인 기록을 직접 읽도록 바꾸면 무작위 실패가 사라집니다.
3. **오답** - 훅은 등록 순서대로 실행된다는 보장이 없습니다. 순서를 바꿔도 병렬 실행이라는 근본 원인은 그대로라 실패는 계속됩니다.
4. **오답** - 기록이 없을 때 거부하는 fail-closed는 게이트로서 올바른 동작입니다. 비어 있을 때 허용(fail-open)으로 바꾸면 확인되지 않은 환불이 통과합니다.

📚 근거: [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide) · [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks)

> "Since hooks run in parallel, the order is non-deterministic."

---

## 문제 23
### **A gate is registered with the matcher `.*refund`. The agent has three tools: process_refund, issue_refund_note and get_customer. Which of them does the gate fire on?**

| 보기 | 설명 |
|------|------|
| 1. Only process_refund, because the pattern ends with the word refund | |
| **2. process_refund and issue_refund_note, because the dot and asterisk make it an unanchored regular expression that matches the substring** | |
| 3. All three tools, because a pattern containing an asterisk matches every tool | |
| 4. None of them, because matchers only accept exact tool names | |

**정답: 2.**

**해설:**

> 📘 레슨 1.4 · 선행 게이트·핸드오프 — Prerequisite gates, parallel investigation and human handoff in agent workflows

**📝 문제 번역**

게이트가 matcher `.*refund` 로 등록돼 있습니다. 에이전트에는 `process_refund`, `issue_refund_note`, `get_customer` 세 도구가 있습니다. 게이트는 어느 도구에서 발생합니까?

- **①** 패턴이 refund라는 단어로 끝나므로 `process_refund` 에서만
- **②** 점과 별표 때문에 고정(anchor)되지 않은 정규식이 되어 부분 문자열에 매칭되므로, `process_refund` 와 `issue_refund_note`
- **③** 별표가 든 패턴은 모든 도구에 매칭되므로 세 도구 모두
- **④** matcher는 정확한 도구 이름만 받으므로 아무 도구에서도 발생하지 않는다

> **핵심:** 문자·숫자·`_`·`-`·공백·`,`·`|` 만으로 된 matcher는 정확한 이름(목록)으로, 그 밖의 문자가 하나라도 있으면 고정되지 않은 JavaScript 정규식으로 평가됩니다.

1. **오답** - 정규식 matcher는 이름 전체가 아니라 이름 **어디든** 일치하면 성공합니다. 패턴이 refund로 끝난다고 해서 이름 끝에 고정되지 않으므로 `issue_refund_note` 도 매칭됩니다.
2. **정답** - `.` 과 `*` 는 허용 문자 집합 밖이라 matcher가 정규식 경로로 평가되고, 정규식은 `RegExp.prototype.test` 로 이름 어디서든 일치하면 성공합니다. 그래서 refund를 포함한 두 도구가 매칭됩니다. `get_customer` 에는 그 부분 문자열이 없습니다. 하나만 겨누려면 `^process_refund$` 로 고정하거나 정확한 이름 `process_refund` 를 씁니다.
3. **오답** - 별표가 모두 매칭을 뜻하는 것은 matcher 전체가 `"*"` 일 때뿐입니다(빈 문자열이나 생략도 동일). `.*refund` 는 refund를 포함한 이름에만 매칭됩니다.
4. **오답** - matcher는 정확한 이름만 받는 것이 아니라 정규식도 받습니다. 허용 문자 밖의 문자가 있으면 정규식으로 해석됩니다.

📚 근거: [Hooks reference](https://code.claude.com/docs/en/hooks) · [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks)

> "Contains any other character | JavaScript regular expression, unanchored"

---

## 문제 24
### **A developer implements a PreToolUse hook that gates the `process_refund` tool by checking a boolean flag `is_verified`. The flag is expected to be set to `true` by a separate `mark_verified` tool after a human reviewer approves a photo ID. In an incident, the `mark_verified` tool executed and the human reviewer explicitly rejected the ID, but due to a software bug the `is_verified` flag was incorrectly set to `true`. The PreToolUse hook consequently allowed `process_refund`, resulting in an unauthorized refund. What change to the PreToolUse hook would best prevent this category of failure?**

| 보기 | 설명 |
|------|------|
| 1. Increase the timeout on the PreToolUse hook to re-check the flag periodically; the hook will eventually notice the review was incorrect and block the refund. | |
| 2. Add a PostToolUse hook on `process_refund` that verifies the flag again after the refund has been initiated, so it can reverse the transaction if the flag is invalid. | |
| **3. Modify the PreToolUse hook to inspect the explicit verification result included in the `process_refund` tool call parameters, confirming that the human review expressly passed, instead of relying on a separate boolean flag that can be set incorrectly.** | |
| 4. Replace the model with a larger, more capable language model that can independently re-read the entire conversation and determine whether the human review actually succeeded, overriding the flag when necessary. | |

**정답: 3.**

**해설:**

> 📘 레슨 1.4 · 선행 게이트·핸드오프 — Prerequisite gates, parallel investigation and human handoff in agent workflows

**📝 문제 번역**

개발자가 불리언 플래그 `is_verified` 를 검사해 `process_refund` 도구를 막는 PreToolUse 훅을 구현합니다. 이 플래그는 사람 검토자가 사진 신분증을 승인한 뒤 별도의 `mark_verified` 도구가 `true` 로 설정하도록 돼 있습니다. 한 사고에서 `mark_verified` 도구가 실행됐고 검토자는 신분증을 명시적으로 **거부** 했지만, 소프트웨어 버그로 `is_verified` 가 잘못 `true` 로 설정됐습니다. 그 결과 PreToolUse 훅이 `process_refund` 를 허용해 무단 환불이 발생했습니다. 이런 유형의 실패를 가장 잘 막는 PreToolUse 훅 변경은 무엇입니까?

- **①** PreToolUse 훅의 timeout을 늘려 플래그를 주기적으로 재확인하게 한다. 훅이 결국 검토가 잘못됐음을 알아차리고 환불을 막을 것이다
- **②** `process_refund` 에 PostToolUse 훅을 추가해 환불이 시작된 뒤 플래그를 다시 확인하고, 플래그가 잘못됐으면 거래를 되돌린다
- **③** 잘못 설정될 수 있는 별도 불리언 플래그에 의존하는 대신, `process_refund` 도구 호출 파라미터에 포함된 명시적 확인 결과를 PreToolUse 훅이 검사해 사람 검토가 분명히 통과했는지 확인하도록 바꾼다
- **④** 대화 전체를 독립적으로 다시 읽고 사람 검토가 실제로 성공했는지 판단해, 필요하면 플래그를 무시할 수 있는 더 크고 유능한 언어 모델로 교체한다

> **핵심:** 게이트는 자기가 검사하는 증거보다 더 신뢰할 수 없습니다. 무엇이든 뒤집을 수 있는 별도 플래그가 아니라, 도구 입력(`tool_input`)에 담긴 구체적인 확인 결과·ID를 기록된 값과 대조해야 합니다.

1. **오답** - PreToolUse 훅은 도구 호출 전에 한 번 실행되며 주기적 재확인용이 아닙니다. `timeout` 은 훅이 실행될 수 있는 최대 시간(초)일 뿐이고, 플래그 값은 그대로이므로 실패를 막지 못합니다.
2. **오답** - PostToolUse 훅은 도구 실행 뒤에 돌며, 그때는 이미 환불이 실행됐습니다. 문서대로 PostToolUse는 이미 실행된 동작을 되돌릴 수 없고, 사후 역거래는 예방이 아니라 복구일 뿐입니다.
3. **정답** - PreToolUse 입력에는 `tool_name` 과 `tool_input` 이 들어 있으므로, 훅은 환불 인자에 담긴 확인 결과나 고객 ID를 결정적으로 검사할 수 있습니다. 수정 가능한 전역 상태에 의존하지 않고 환불을 '분명히 통과한 특정 검토 결과'에 묶으면, 플래그를 잘못 뒤집는 버그가 있어도 무단 환불이 통과하지 않습니다.
4. **오답** - 에이전트 안전은 확률적인 모델 추론이 아니라 결정적인 아키텍처 통제에 기대야 합니다. 더 큰 모델도 맥락을 잘못 해석할 수 있어 훅의 구조화된 파라미터 검사만큼의 보장을 주지 못합니다.

📚 근거: [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks) · [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide)

> "PostToolUse hooks can't undo actions since the tool has already executed."

---

## 문제 25
### **An architect writes a PreToolUse hook with the regex matcher `/refund/` intending it to gate a single custom tool named `refund`. During a review, a colleague notices the matcher would also fire on a tool named `issue_refund_note` that only writes an internal comment and should never be gated. What is the cause and the correct fix?**

| 보기 | 설명 |
|------|------|
| 1. The matcher `/refund/` uses a regular expression, but regular expression matchers in hooks are automatically anchored to match exactly, so it would only fire on the tool named exactly `refund`. The colleague's concern is unfounded; no fix is needed. | |
| 2. Matchers can only target tool names that begin with the `mcp__` server prefix. A custom in-process tool like `refund` must be renamed to include this prefix before any matcher can reliably target it. | |
| 3. The hook fires on every single tool call by default unless a timeout value is explicitly configured. Adding a timeout would stop it from matching `issue_refund_note`. | |
| **4. The regex matcher `/refund/` is unanchored, so it matches any tool name containing the substring 'refund'. The fix is to anchor the regex with `^` and `$`: `/^refund$/`, ensuring it only matches the exact tool name `refund`.** | |

**정답: 4.**

**해설:**

> 📘 레슨 1.4 · 선행 게이트·핸드오프 — Prerequisite gates, parallel investigation and human handoff in agent workflows

**📝 문제 번역**

아키텍트가 `refund` 라는 커스텀 도구 하나만 막으려고 정규식 matcher `/refund/` 로 PreToolUse 훅을 작성합니다. 리뷰 중 동료가, 이 matcher가 내부 코멘트만 쓰고 절대 막아서는 안 되는 `issue_refund_note` 도구에서도 발생한다는 것을 발견합니다. 원인과 올바른 수정은 무엇입니까?

- **①** matcher `/refund/` 는 정규식이지만 훅의 정규식 matcher는 자동으로 정확히 일치하도록 고정되므로, 이름이 정확히 `refund` 인 도구에서만 발생한다. 동료의 우려는 근거가 없고 수정할 필요가 없다
- **②** matcher는 `mcp__` 서버 접두사로 시작하는 도구 이름만 대상으로 할 수 있다. `refund` 같은 인프로세스 커스텀 도구는 matcher가 안정적으로 겨눌 수 있도록 이 접두사를 포함하게 이름을 바꿔야 한다
- **③** timeout 값을 명시하지 않으면 훅은 기본적으로 모든 도구 호출에서 발생한다. timeout을 추가하면 `issue_refund_note` 에 매칭되지 않는다
- **④** 정규식 matcher `/refund/` 는 고정되지 않아 'refund'라는 부분 문자열을 포함한 모든 도구 이름에 매칭된다. `^` 와 `$` 로 고정한 `/^refund$/` 로 바꿔 정확히 `refund` 라는 이름에만 매칭되게 한다

> **핵심:** 훅의 정규식 matcher는 자동으로 고정되지 않습니다. 정확히 한 도구만 겨누려면 `^...$` 로 고정하거나, 정규식 문자가 없는 정확한 이름 matcher를 씁니다.

1. **오답** - 훅의 정규식 matcher는 자동 고정되지 않습니다. 문서는 정규식 경로의 matcher가 `RegExp.prototype.test` 로 평가돼 값 어디서든 일치하면 성공한다고 설명하며, 전체 일치가 필요하면 `^` 와 `$` 로 감싸라고 안내합니다.
2. **오답** - matcher는 `mcp__` 접두사 도구에만 쓰는 것이 아닙니다. `Bash`, `Write` 같은 내장 도구, MCP 도구, 인프로세스 커스텀 도구 모두 이름으로 매칭할 수 있으므로 이름을 바꿀 필요가 없습니다.
3. **오답** - PreToolUse 훅은 matcher에 맞는 호출에서만 발생하며, matcher를 생략하거나 `"*"`·빈 문자열일 때만 모든 호출에 발생합니다. `timeout` 은 훅이 실행될 수 있는 시간을 정할 뿐, 어떤 도구 이름을 겨누는지와 무관합니다.
4. **정답** - 고정되지 않은 정규식은 이름에 'refund'가 들어 있기만 하면 매칭되므로 `issue_refund_note` 도 걸립니다. 시작(`^`)과 끝(`$`)으로 고정하면 정확히 `refund` 에만 매칭됩니다. 정규식 문자가 없는 정확한 이름 matcher `refund` 를 써도 같은 효과를 얻습니다.

📚 근거: [Hooks reference](https://code.claude.com/docs/en/hooks) · [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks)

> "wrap the pattern in `^` and `$`, as in `^Edit$`, when you need a whole-string match."

---

## 문제 26
### **A finance team says a single refund above $500 is unacceptable, even if it happens in only one conversation out of thousands. Which design actually guarantees the limit holds?**

| 보기 | 설명 |
|------|------|
| 1. Put the rule in the system prompt with several worked examples so the model reliably refuses large refunds. | |
| 2. Register a PostToolUse hook on the refund tool that flags any refund over $500 for review. | |
| **3. Register a PreToolUse hook on the refund tool whose callback checks the amount and returns a deny decision when it exceeds $500.** | |
| 4. Keep the rule in the system prompt and add a second agent that rereads each conversation and reminds the first agent of the policy. | |

**정답: 3.**

**해설:**

> 📘 레슨 1.5 · Agent SDK 훅 — Agent SDK hooks for blocking tool calls and normalizing tool results

**📝 문제 번역**

재무팀은 수천 건의 대화 중 단 한 건이라도 500달러를 넘는 환불은 용납할 수 없다고 말합니다. 어떤 설계가 이 한도를 실제로 보장합니까?

- **①** 모델이 큰 환불을 확실히 거절하도록 시스템 프롬프트에 규칙과 여러 개의 풀이 예시를 넣는다
- **②** 환불 도구에 PostToolUse 훅을 등록해 500달러를 넘는 환불을 검토 대상으로 표시한다
- **③** 환불 도구에 PreToolUse 훅을 등록하고, 콜백이 금액을 검사해 500달러를 넘으면 deny 결정을 돌려주게 한다
- **④** 규칙은 시스템 프롬프트에 두고, 각 대화를 다시 읽어 첫 번째 에이전트에게 정책을 상기시키는 두 번째 에이전트를 추가한다

> **핵심:** 위반 한 건의 비용이 큰 규칙은 모델이 아니라 코드가 결정해야 합니다. PreToolUse 훅은 도구 실행 전에 호출을 검사해 거부하므로 매번 규칙이 지켜집니다.

1. **오답** - 프롬프트 지시는 모델이 따르기로 선택할 때만 지켜지므로 실패율이 항상 0보다 큽니다. 예시를 더해 비율을 낮출 수는 있어도, 설득하는 고객 메시지나 긴 컨텍스트 앞에서 지시가 무시되는 경우를 없애지 못합니다.
2. **오답** - PostToolUse 훅은 환불이 이미 실행된 뒤에 돕니다. 검토 표시는 사후 발견일 뿐, 한도를 넘는 환불이 나가는 것 자체를 막지 못합니다.
3. **정답** - PreToolUse 훅은 Claude가 `tool_use` 블록을 만든 뒤, 도구가 실행되기 전에 발생합니다. 콜백이 `tool_input` 의 금액을 읽어 한도를 넘으면 `permissionDecision: "deny"` 를 돌려주므로, 모델이 무엇을 의도했든 그 호출은 실행되지 않습니다. 결정이 모델 밖으로 빠져나와 모든 호출에서 규칙이 지켜집니다.
4. **오답** - 검토 에이전트도 결국 모델이 정책을 따르기로 선택해야 효과가 있는 확률적 장치입니다. 비용과 복잡도만 늘고 보장은 생기지 않습니다.

📚 근거: [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks) · [Hooks reference](https://code.claude.com/docs/en/hooks)

> "Block dangerous operations before they execute, like destructive shell commands or unauthorized file access"

---

## 문제 27
### **Your policy is to block refund_customer calls over $500 when the category is "restricted". A teammate registers `HookMatcher(matcher="refund_customer.*category=restricted", hooks=[check_refund])` under PreToolUse. What happens when the agent calls refund_customer with amount 900 and category "restricted"?**

| 보기 | 설명 |
|------|------|
| 1. The hook fires, because the regex matches the tool name and the arguments together, so only restricted-category refunds reach the callback. | |
| **2. The hook never fires, so the refund goes unchecked. The pattern is tested only against the tool name, and "refund_customer" does not contain "category=restricted".** | |
| 3. The hook fires on every tool call, because any regex character in a matcher makes it match all tools. | |
| 4. The hook fires for every refund_customer call, because only the part of the pattern before `.*` is compared with the tool name. | |

**정답: 2.**

**해설:**

> 📘 레슨 1.5 · Agent SDK 훅 — Agent SDK hooks for blocking tool calls and normalizing tool results

**📝 문제 번역**

정책은 category가 "restricted"일 때 500달러를 넘는 `refund_customer` 호출을 막는 것입니다. 팀원이 PreToolUse 아래에 `HookMatcher(matcher="refund_customer.*category=restricted", hooks=[check_refund])` 를 등록했습니다. 에이전트가 amount 900, category "restricted"로 `refund_customer` 를 호출하면 어떻게 됩니까?

- **①** 정규식이 도구 이름과 인자를 함께 매칭하므로 훅이 발생하고, restricted 카테고리 환불만 콜백에 도달한다
- **②** 훅이 전혀 발생하지 않아 환불이 검사 없이 나간다. 패턴은 도구 이름하고만 비교되는데, "refund_customer"에는 "category=restricted"가 들어 있지 않다
- **③** matcher에 정규식 문자가 하나라도 있으면 모든 도구에 매칭되므로 훅이 모든 도구 호출에서 발생한다
- **④** `.*` 앞부분만 도구 이름과 비교되므로 훅이 모든 `refund_customer` 호출에서 발생한다

> **핵심:** 도구 훅의 matcher는 도구 **이름** 하고만 비교됩니다. 인자 조건은 matcher가 아니라 콜백 안에서 `tool_input` 을 읽어 판단합니다.

1. **오답** - matcher는 인자를 보지 않습니다. 문서도 "matcher는 도구 이름만 매칭하며 파일 경로나 다른 인자는 매칭하지 않는다"고 명시합니다. 인자 텍스트를 패턴에 넣어도 비교 대상은 여전히 도구 이름뿐입니다.
2. **정답** - 정규식 `refund_customer.*category=restricted` 는 이름 "refund_customer"에 대해 검사되는데, 이름에는 "category=restricted"가 없으므로 아무 도구에도 매칭되지 않습니다. 결국 게이트가 없는 것과 같아 900달러 환불이 그대로 나갑니다. `matcher="refund_customer"` 로 범위를 정하고 콜백에서 `tool_input["amount"]` 와 `tool_input["category"]` 를 읽어야 합니다.
3. **오답** - 정규식 문자가 있으면 matcher가 '고정되지 않은 정규식'으로 평가될 뿐, 모든 도구에 매칭되는 것은 아닙니다. 모든 도구 매칭은 `"*"`, 빈 문자열, 또는 matcher 생략일 때입니다.
4. **오답** - 패턴의 일부만 떼어 비교하는 동작은 없습니다. 정규식 전체가 도구 이름에 대해 검사되므로, 이름에 없는 뒷부분 때문에 매칭이 실패합니다.

📚 근거: [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks) · [Hooks reference](https://code.claude.com/docs/en/hooks)

> "Matchers only match tool names, not file paths or other arguments."

---

## 문제 28
### **An unattended support agent, where no permission prompt may ever appear, has a PreToolUse hook that denies refunds over $500 with the reason "Refund denied". In the logs, the agent keeps calling refund_customer again with the same amount. Which change stops the retries and still keeps the limit guaranteed?**

| 보기 | 설명 |
|------|------|
| 1. Return "ask" instead of "deny" so the agent waits for someone to approve the refund. | |
| 2. Move the message into the top-level systemMessage field so the agent sees a clearer explanation. | |
| **3. Keep returning "deny", but change permissionDecisionReason to say that refunds over $500 need human approval and that the agent should call escalate_refund with the order ID and amount.** | |
| 4. Remove the hook and add the escalation instruction to the system prompt, because the agent clearly ignores the hook. | |

**정답: 3.**

**해설:**

> 📘 레슨 1.5 · Agent SDK 훅 — Agent SDK hooks for blocking tool calls and normalizing tool results

**📝 문제 번역**

권한 프롬프트가 절대 나타나서는 안 되는 무인 지원 에이전트에, 500달러를 넘는 환불을 "Refund denied"라는 이유로 거부하는 PreToolUse 훅이 있습니다. 로그를 보면 에이전트가 같은 금액으로 `refund_customer` 를 계속 다시 호출합니다. 재시도를 멈추면서도 한도 보장은 유지하는 변경은 무엇입니까?

- **①** "deny" 대신 "ask"를 돌려줘 누군가 환불을 승인할 때까지 에이전트가 기다리게 한다
- **②** 에이전트가 더 분명한 설명을 보도록 메시지를 최상위 `systemMessage` 필드로 옮긴다
- **③** "deny"는 계속 돌려주되, `permissionDecisionReason` 을 '500달러를 넘는 환불은 사람 승인이 필요하니 주문 ID와 금액을 담아 `escalate_refund` 를 호출하라'는 내용으로 바꾼다
- **④** 에이전트가 훅을 무시하는 게 분명하니 훅을 없애고 시스템 프롬프트에 에스컬레이션 지시를 추가한다

> **핵심:** 차단은 결정적이고, 방향 전환은 Claude가 거부 이유를 읽는 데 달려 있습니다. 훅은 게이트로 유지하고, 이유에 다음에 쓸 정확한 도구나 절차를 적습니다.

1. **오답** - `"ask"` 는 사용자에게 권한 프롬프트로 확인을 요청합니다. 프롬프트가 나타나서는 안 된다는 조건을 깨고, 승인할 사람이 없는 무인 환경에서는 진행이 막힙니다.
2. **오답** - `systemMessage` 는 사용자에게 보여 주는 최상위 필드이고 모델은 보지 못합니다. Claude에게 이유를 전하는 필드는 `deny` 일 때의 `permissionDecisionReason` 입니다.
3. **정답** - `deny` 가 한도를 보장하고, `permissionDecisionReason` 은 Claude에게 표시됩니다. "Refund denied"처럼 막연한 이유는 대안을 주지 않아 같은 호출의 재시도로 이어지기 쉽습니다. 에스컬레이션 도구와 넘길 인자를 이유에 적으면 Claude가 재시도 대신 그 절차로 방향을 바꿉니다.
4. **오답** - 에이전트는 훅을 무시한 것이 아닙니다. 훅은 매번 호출을 막았고, 문제는 이유에 대안이 없었다는 것입니다. 훅을 없애면 한도 보장이 사라지고 확률적인 프롬프트만 남습니다.

📚 근거: [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks) · [Hooks reference](https://code.claude.com/docs/en/hooks)

> "`permissionDecisionReason` tells the model why."

---

## 문제 29
### **A PreToolUse hook needs to block refunds above $500 only when they target a specific merchant category, based on a field named category inside the refund tool's arguments. The hook is registered with matcher="refund_customer". Where should the category check be implemented?**

| 보기 | 설명 |
|------|------|
| 1. In the tool's own MCP server definition, since PreToolUse hooks cannot inspect individual tool arguments under any circumstances | |
| 2. In a second, separate matcher field called argument_matcher that the HookMatcher accepts alongside the tool-name matcher | |
| 3. In the matcher string, by writing a regex such as `refund_customer.*category=restricted` so the SDK filters on the argument before invoking the callback | |
| **4. Inside the callback function itself, by reading input_data["tool_input"]["category"] and applying the conditional logic there, since matchers only filter by tool name** | |

**정답: 4.**

**해설:**

> 📘 레슨 1.5 · Agent SDK 훅 — Agent SDK hooks for blocking tool calls and normalizing tool results

**📝 문제 번역**

PreToolUse 훅이 환불 도구 인자 안의 `category` 필드를 기준으로, 특정 가맹점 카테고리를 대상으로 할 때만 500달러를 넘는 환불을 막아야 합니다. 훅은 `matcher="refund_customer"` 로 등록돼 있습니다. 카테고리 검사는 어디에 구현해야 합니까?

- **①** 도구 자체의 MCP 서버 정의에. PreToolUse 훅은 어떤 경우에도 개별 도구 인자를 검사할 수 없기 때문이다
- **②** HookMatcher가 도구 이름 matcher와 함께 받는 `argument_matcher` 라는 별도 matcher 필드에
- **③** matcher 문자열에. `refund_customer.*category=restricted` 같은 정규식을 써서 SDK가 콜백을 부르기 전에 인자로 걸러 내게 한다
- **④** 콜백 함수 안에. `input_data["tool_input"]["category"]` 를 읽고 거기서 조건 로직을 적용한다. matcher는 도구 이름으로만 거르기 때문이다

> **핵심:** matcher로 범위(어느 도구인가)를 정하고, 조건(어떤 인자인가)은 콜백 안에서 `tool_input` 을 읽어 판단합니다.

1. **오답** - PreToolUse 훅은 인자를 검사할 수 있습니다. 콜백이 받는 `PreToolUseHookInput` 에는 `tool_name` 과 `tool_input` 이 들어 있습니다. 정책을 MCP 서버로 옮길 이유가 없습니다.
2. **오답** - `HookMatcher` 의 옵션은 `matcher`, `hooks`, `timeout` 뿐이며 `argument_matcher` 같은 필드는 없습니다. 인자로 거르는 matcher 옵션은 존재하지 않습니다.
3. **오답** - 도구 훅의 matcher는 도구 이름하고만 비교되므로, 인자 텍스트를 넣은 정규식은 어떤 도구 이름에도 매칭되지 않아 훅이 아예 발생하지 않습니다. 게이트가 조용히 사라지는 가장 위험한 선택입니다.
4. **정답** - 콜백은 Claude가 넘긴 인자 전체를 `tool_input` 으로 받습니다. `input_data["tool_input"]["amount"]` 와 `["category"]` 를 읽어 조건에 맞으면 `permissionDecision: "deny"` 를, 아니면 빈 객체 `{}` 를 돌려주면 됩니다.

📚 근거: [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks)

> "Matchers only match tool names, not file paths or other arguments. To filter by file path, check `tool_input.file_path` inside your hook"

---

## 문제 30
### **An architect is consolidating tool-output normalization into a single PostToolUse hook that must work for both MCP tools and built-in tools. Currently, a legacy MCP tool uses `updatedMCPToolOutput` and a newer built-in tool uses `updatedToolOutput`. Which field should the shared hook use to replace the output for both tool types?**

| 보기 | 설명 |
|------|------|
| 1. `updatedMCPToolOutput`, because it is the field intended for cross‑tool output replacement. | |
| 2. `systemMessage`, because it can be used to display the normalized output to the user for all tools. | |
| **3. `updatedToolOutput`, because it replaces output for all tools (built‑in and MCP) in the `PostToolUse` hook, while `updatedMCPToolOutput` only works for MCP tools.** | |
| 4. `additionalContext`, because it provides a way to add extra information that overrides the original tool output. | |

**정답: 3.**

**해설:**

> 📘 레슨 1.5 · Agent SDK 훅 — Agent SDK hooks for blocking tool calls and normalizing tool results

**📝 문제 번역**

아키텍트가 도구 출력 정규화를 MCP 도구와 내장 도구 모두에 동작해야 하는 하나의 PostToolUse 훅으로 통합하고 있습니다. 현재 레거시 MCP 도구는 `updatedMCPToolOutput` 을, 새 내장 도구는 `updatedToolOutput` 을 씁니다. 공용 훅이 두 종류 도구의 출력을 모두 바꾸려면 어떤 필드를 써야 합니까?

- **①** `updatedMCPToolOutput`. 도구 종류를 가리지 않는 출력 교체용 필드이기 때문이다
- **②** `systemMessage`. 모든 도구에 대해 정규화된 출력을 사용자에게 보여 줄 수 있기 때문이다
- **③** `updatedToolOutput`. `PostToolUse` 훅에서 모든 도구(내장·MCP)의 출력을 바꾸는 반면, `updatedMCPToolOutput` 은 MCP 도구에만 동작하기 때문이다
- **④** `additionalContext`. 원래 도구 출력을 덮어쓰는 추가 정보를 넣는 방법이기 때문이다

> **핵심:** Claude가 읽기 전에 도구 출력을 **교체** 하는 필드는 `updatedToolOutput` 이고, 모든 도구에 동작합니다. `updatedMCPToolOutput` 은 MCP 전용인 이전 필드입니다.

1. **오답** - 반대입니다. `updatedMCPToolOutput` 은 MCP 도구의 출력만 바꾸는 이전 필드이고, 문서는 모든 도구에 동작하는 `updatedToolOutput` 을 쓰라고 권합니다.
2. **오답** - `systemMessage` 는 사용자에게 메시지를 보여 주는 최상위 필드일 뿐, 도구 결과를 바꾸지 않고 모델도 보지 못합니다. 정규화의 목적은 Claude가 읽는 결과를 바꾸는 것입니다.
3. **정답** - `updatedToolOutput` 은 도구 출력을 Claude에게 보내기 전에 주어진 값으로 교체하며, 두 SDK에서 모든 도구에 동작합니다. 값은 그 도구의 출력 형태와 맞아야 합니다. 도구는 이미 실행됐으므로 Claude가 보는 내용만 바뀌고 부작용은 그대로라는 점도 기억합니다.
4. **오답** - `additionalContext` 는 도구 결과 **옆에** 정보를 덧붙일 뿐 원래 출력을 덮어쓰지 않습니다. Claude는 원래 출력과 추가 문맥을 함께 보게 되어, 형식이 섞인 상태가 그대로 남습니다.

📚 근거: [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks) · [Hooks reference](https://code.claude.com/docs/en/hooks)

> "To replace the tool's output before Claude sees it, set `updatedToolOutput`, which works for any tool in both SDKs. The older `updatedMCPToolOutput` field replaces MCP tool output only."

---

## 문제 31
### **An agent connects to two MCP servers named "billing" and "inventory". An architect wants a single PreToolUse hook to run for every tool exposed by the "billing" server, without matching any tool from "inventory" or any built-in tool like Bash or Read. Which matcher achieves this?**

| 보기 | 설명 |
|------|------|
| 1. billing | |
| 2. `^mcp__` | |
| **3. `mcp__billing__.*`** | |
| 4. `^mcp__billing__$` | |

**정답: 3.**

**해설:**

> 📘 레슨 1.5 · Agent SDK 훅 — Agent SDK hooks for blocking tool calls and normalizing tool results

**📝 문제 번역**

에이전트가 "billing"과 "inventory"라는 두 MCP 서버에 연결돼 있습니다. 아키텍트는 "billing" 서버가 노출하는 모든 도구에 대해 실행되고, "inventory"의 도구나 Bash·Read 같은 내장 도구에는 매칭되지 않는 PreToolUse 훅 하나를 원합니다. 어떤 matcher가 이를 달성합니까?

- **①** `billing`
- **②** `^mcp__`
- **③** `mcp__billing__.*`
- **④** `^mcp__billing__$`

> **핵심:** MCP 도구 이름은 `mcp__<server>__<tool>` 형식입니다. 한 서버의 모든 도구를 겨누려면 서버 접두사 뒤에 `.*` 를 붙여야 합니다.

1. **오답** - `billing` 은 정확한 이름 문자만으로 되어 있어 정확한 문자열로 비교됩니다. 이름이 정확히 `billing` 인 도구는 없으므로 아무것도 매칭되지 않습니다.
2. **오답** - `^mcp__` 는 이름이 `mcp__` 로 시작하는 모든 MCP 도구에 매칭되므로 inventory 서버 도구까지 포함합니다.
3. **정답** - `.` 과 `*` 때문에 정규식으로 평가되고, `mcp__billing__` 로 시작하는 이름, 즉 billing 서버의 도구(예: `mcp__billing__issue_refund`)에만 매칭됩니다. 문서도 서버의 모든 도구를 매칭하려면 서버 접두사에 `.*` 를 붙여야 하며, 이것이 필수라고 설명합니다.
4. **오답** - 양 끝을 고정했으므로 정확히 `mcp__billing__` 라는 문자열에만 매칭됩니다. 그런 이름의 도구는 없어 아무 도구에도 매칭되지 않습니다.

📚 근거: [Hooks reference](https://code.claude.com/docs/en/hooks) · [Intercept and control agent behavior with hooks (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/hooks)

> "To match every tool from a server, append `.*` to the server prefix."

---

## 문제 32
### **Every night a job takes each new product spec and runs the same steps in the same order. It writes a product description, code checks the length and banned terms, and then the description is translated into German and French. The content of a spec never changes which steps run. Which decomposition fits best?**

| 보기 | 설명 |
|------|------|
| 1. An orchestrator LLM that reads each spec and plans the writing, checking and translation subtasks for it | |
| **2. A fixed prompt chain sequenced in code (write, then a programmatic gate, then translate), where each step is its own LLM call** | |
| 3. An adaptive agent that inspects each spec first and then generates subtasks based on what it finds | |
| 4. One LLM call that writes and translates the description together, to cut latency | |

**정답: 2.**

**해설:**

> 📘 레슨 1.6 · 작업 분해 전략 — Task decomposition: prompt chaining vs adaptive decomposition

**📝 문제 번역**

매일 밤 작업 하나가 새 제품 사양서를 하나씩 받아 같은 단계를 같은 순서로 실행합니다. 제품 설명을 쓰고, 코드가 길이와 금지어를 검사한 뒤, 설명을 독일어와 프랑스어로 번역합니다. 사양서의 내용이 어떤 단계를 실행할지 바꾸는 일은 없습니다. 가장 알맞은 분해 방식은 무엇입니까?

- **①** 사양서마다 오케스트레이터 LLM이 읽고 작성·검사·번역 하위 작업을 계획한다
- **②** 코드로 순서를 정한 고정 프롬프트 체인(작성 → 프로그램 게이트 → 번역)을 쓰고, 단계마다 별도 LLM 호출을 둔다
- **③** 적응형 에이전트가 사양서를 먼저 살펴본 뒤 발견한 내용에 따라 하위 작업을 만든다
- **④** 지연을 줄이려고 하나의 LLM 호출이 설명 작성과 번역을 함께 한다

> **핵심:** 실행 전에 하위 작업 목록을 쓸 수 있고 그것이 바뀌지 않는다면, 분해는 코드의 몫입니다. 단계 사이에 게이트를 둔 고정 체인이 맞습니다.

1. **오답** - 단계가 매번 같으므로 오케스트레이터는 실행할 때마다 같은 계획을 다시 세우고 그 계획 호출의 비용과 지연을 매번 냅니다. 얻는 것 없이 실행마다 편차만 더합니다.
2. **정답** - 프롬프트 체이닝은 작업을 단계의 순서로 나누고 각 LLM 호출이 이전 호출의 출력을 처리하며, 단계 사이에 프로그램 검사(게이트)를 둘 수 있습니다. Anthropic은 이 패턴이 고정된 하위 작업으로 깔끔하게 분해되는 작업에 이상적이라고 하며, '마케팅 문구 생성 후 다른 언어로 번역'을 대표 예로 듭니다. 길이·금지어 검사 게이트가 잘못된 설명이 번역되기 전에 걸러 냅니다.
3. **오답** - 사양서 내용이 실행할 단계를 바꾸지 않으므로, 먼저 살펴보고 하위 작업을 만드는 과정은 매번 같은 결론에 이르는 비용일 뿐입니다. 적응형 분해는 다음 단계가 중간 발견에 달린 열린 조사를 위한 것입니다.
4. **오답** - 작성과 번역을 한 호출에 합치면 중간 산출물인 원문 설명이 사라져 게이트가 검사할 대상이 없습니다. 한 호출이 두 가지 일을 맡아 각 단계의 정확도도 떨어집니다.

📚 근거: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "This workflow is ideal for situations where the task can be easily and cleanly decomposed into fixed subtasks."

---

## 문제 33
### **An agent's system prompt says: "First extract the fields, then validate them, then format the report." The team needs to log the validated fields and stop the run before formatting if validation fails. What change gives them that?**

| 보기 | 설명 |
|------|------|
| 1. Make the instruction stronger, for example "You MUST complete each step in order before moving on" | |
| 2. Ask the model to wrap each step's output in its own XML tags in the single response | |
| **3. Make extract, validate and format separate API calls that orchestration code sequences, with a check between validate and format** | |
| 4. Switch to a model with a larger context window so that it follows all three steps reliably | |

**정답: 3.**

**해설:**

> 📘 레슨 1.6 · 작업 분해 전략 — Task decomposition: prompt chaining vs adaptive decomposition

**📝 문제 번역**

에이전트의 시스템 프롬프트에 "먼저 필드를 추출하고, 그다음 검증하고, 그다음 보고서 형식으로 정리하라"고 적혀 있습니다. 팀은 검증된 필드를 로그로 남기고, 검증이 실패하면 형식 정리 전에 실행을 멈춰야 합니다. 어떤 변경이 이를 가능하게 합니까?

- **①** "다음으로 넘어가기 전에 각 단계를 반드시 순서대로 완료해야 한다" 처럼 지시를 더 강하게 쓴다
- **②** 하나의 응답 안에서 각 단계의 출력을 별도 XML 태그로 감싸게 한다
- **③** 추출, 검증, 형식 정리를 오케스트레이션 코드가 순서를 정하는 별도 API 호출로 나누고, 검증과 형식 정리 사이에 검사를 둔다
- **④** 세 단계를 모두 확실히 따르도록 컨텍스트 창이 더 큰 모델로 바꾼다

> **핵심:** 프롬프트에 단계를 나열하는 것은 모델이 섞거나 건너뛸 수 있는 '요청'입니다. 단계마다 별도 호출을 두고 코드가 순서를 정해야 중간 출력을 검사하고, 게이트로 멈추고, 분기할 수 있습니다.

1. **오답** - 지시를 강하게 써도 세 단계는 여전히 한 번의 응답 안에서 일어납니다. 코드가 검증 결과를 보고 형식 정리 전에 실행을 멈출 지점이 생기지 않습니다.
2. **오답** - XML 태그로 출력을 나누면 결과를 파싱하기는 쉬워지지만, 형식 정리는 이미 같은 응답에서 끝난 뒤입니다. 검증 실패 시 그 전에 멈추는 것은 불가능합니다.
3. **정답** - Prompting best practices는 최신 모델이 다단계 추론 대부분을 내부에서 처리하더라도, 중간 출력을 검사하거나 특정 파이프라인 구조를 강제해야 할 때는 명시적 체이닝이 여전히 유용하다고 설명합니다. 각 단계가 별도 API 호출이면 어느 지점에서든 로그를 남기고, 평가하고, 분기할 수 있습니다.
4. **오답** - 컨텍스트 창 크기는 문제와 무관합니다. 큰 창도 한 번의 호출 안에서는 중간 출력을 코드가 검사할 기회를 주지 않습니다.

📚 근거: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

> "Each step is a separate API call so you can log, evaluate, or branch at any point."

---

## 문제 34
### **A team is building an automated pipeline that takes a raw customer support transcript, produces a structured summary, then translates that summary into three fixed target languages. The steps and their order never change between runs. Which decomposition strategy best fits this workflow?**

| 보기 | 설명 |
|------|------|
| **1. A fixed prompt chain that summarizes the transcript, runs a code-based check on the summary, then translates it** | |
| 2. An orchestrator agent that plans the summary and translation subtasks per transcript, then delegates them to workers | |
| 3. A single agent that reads the transcript and writes the three translations in one pass, folding summarization into it | |
| 4. An adaptive agent that inspects the transcript first, then generates the subtasks needed to summarize and translate it | |

**정답: 1.**

**해설:**

> 📘 레슨 1.6 · 작업 분해 전략 — Task decomposition: prompt chaining vs adaptive decomposition

**📝 문제 번역**

팀이 고객 지원 대화 원문을 받아 구조화된 요약을 만들고, 그 요약을 고정된 세 언어로 번역하는 자동 파이프라인을 만들고 있습니다. 단계와 그 순서는 실행마다 바뀌지 않습니다. 이 워크플로에 가장 알맞은 분해 전략은 무엇입니까?

- **①** 대화를 요약하고, 요약을 코드 기반으로 검사한 뒤, 번역하는 고정 프롬프트 체인
- **②** 대화마다 요약·번역 하위 작업을 계획한 뒤 워커에 위임하는 오케스트레이터 에이전트
- **③** 대화를 읽고 요약을 함께 녹여 세 번역을 한 번에 쓰는 단일 에이전트
- **④** 대화를 먼저 살펴본 뒤 요약·번역에 필요한 하위 작업을 생성하는 적응형 에이전트

> **핵심:** 단계와 순서가 미리 알려져 있으면 프롬프트 체이닝이 정확히 그 경우를 위한 패턴입니다. 두 단계 사이의 프로그램 검사가 잘못된 요약이 세 언어로 번역되기 전에 잡아냅니다.

1. **정답** - 요약 → 번역이라는 단계와 순서가 미리 정해져 있으므로 고정 체인이 맞습니다. 요약 단계의 출력을 코드로 검사하면 잘못된 요약이 세 언어로 퍼지기 전에 멈추고, 실패한 단계만 다시 시도할 수 있습니다.
2. **오답** - 대화마다 하위 작업을 계획하고 위임하는 구조는 단계를 예측할 수 없는 작업을 위한 것입니다. 여기서는 단계와 순서가 변하지 않으므로, 계획 계층은 고정 순서 대비 비용과 편차만 더합니다.
3. **오답** - 한 번에 번역까지 쓰면 별도의 요약 출력이 사라져 번역 전에 검증할 것이 없고, 실패한 단계만 다시 시도할 방법도 없습니다. 이 워크플로는 구조화된 요약을 만든 다음 번역해야 하므로, 서로 구분되고 검사 가능한 단계가 필요합니다.
4. **오답** - 내용을 보고 하위 작업을 만드는 방식은 다음 단계가 발견에 달린 열린 조사에 맞습니다. 이 워크플로는 실행마다 같은 두 단계이므로, 내용 기반 계획은 예측 불가능성만 들여옵니다.

📚 근거: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Orchestrator workers (Cookbook)](https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers)

> "Subtasks are predictable and can be pre-defined (use simpler parallelization)"

---

## 문제 35
### **A reviewer is designing an agentic code review for a pull request that touches 40 files across a monorepo. Reviewers have noticed that when a single pass tries to hold all 40 files in context at once, subtle cross-file issues are missed and comments become generic. What restructuring addresses this attention dilution problem?**

| 보기 | 설명 |
|------|------|
| **1. Review each file in its own pass for local issues, then run a second pass over those findings to check how the files interact** | |
| 2. Move the review to a model with a larger context window, so the full diff is read in one sitting without being truncated | |
| 3. Keep one pass over the diff, but have the model rank the files by risk first, then spend its review effort on the highest-risk ones | |
| 4. Run one pass over the diff several times with the file order shuffled each time, then keep the comments that recur across runs | |

**정답: 1.**

**해설:**

> 📘 레슨 1.6 · 작업 분해 전략 — Task decomposition: prompt chaining vs adaptive decomposition

**📝 문제 번역**

리뷰어가 모노레포 전반의 파일 40개를 건드리는 풀 리퀘스트에 대한 에이전트형 코드 리뷰를 설계하고 있습니다. 한 번의 패스가 40개 파일을 모두 컨텍스트에 담으려 하면 미묘한 파일 간 문제를 놓치고 코멘트가 일반론으로 흐른다는 사실을 리뷰어들이 알아챘습니다. 이 주의 희석(attention dilution) 문제를 해결하는 재구성은 무엇입니까?

- **①** 파일마다 별도 패스로 로컬 문제를 검토한 뒤, 그 발견들을 대상으로 두 번째 패스를 돌려 파일 간 상호작용을 확인한다
- **②** 전체 diff를 잘림 없이 한 번에 읽도록 컨텍스트 창이 더 큰 모델로 리뷰를 옮긴다
- **③** 한 패스는 유지하되, 모델이 먼저 위험도로 파일 순위를 매기고 가장 위험한 파일에 리뷰 노력을 쏟게 한다
- **④** 매번 파일 순서를 섞어 diff 전체를 한 패스로 여러 번 돌리고, 여러 실행에서 반복된 코멘트만 남긴다

> **핵심:** 컨텍스트는 수확 체감이 있는 유한한 자원이라, 토큰이 늘수록 모든 모델에서 회상 정밀도가 떨어집니다. 파일별 집중 패스와 교차 파일 통합 패스로 나눠야 합니다.

1. **정답** - 파일별 패스는 각 리뷰를 구체적인 지적이 가능한 크기로 유지하고, 발견을 모아 보는 두 번째 패스는 파일별 리뷰로는 보이지 않는 파일 간 상호작용을 잡습니다. Anthropic도 여러 고려 사항을 각각 별도 LLM 호출로 다룰 때 성능이 좋다고 설명하며, Claude Code 워크플로 예시에도 '변경된 파일마다 검토한 뒤 파일별 발견을 하나의 순위 요약으로 합치는' 형태가 있습니다.
2. **오답** - 리뷰어는 이미 diff 전체를 한 패스에 넣고 있고, 문제는 40개 파일에 주의가 얇게 퍼지는 것입니다. 더 큰 창은 더 많은 내용을 담게 할 뿐, 각 파일에 더 세심하게 주의를 기울이게 하지 않습니다.
3. **오답** - 한 패스 안에서 위험도 순위를 매겨도 40개 파일이 모두 같은 희석된 컨텍스트에 남습니다. 게다가 순위가 낮은 파일에 노력이 덜 가는데, 미묘한 교차 파일 버그의 나머지 절반이 바로 그 파일에 있을 수 있습니다.
4. **오답** - 순서를 섞어 여러 번 돌리는 것은 투표 방식입니다. 실행마다 여전히 diff 전체를 한 패스에 담아 주의가 희석되고, 반복된 코멘트만 남기면 명백한 문제만 살아남고 들쭉날쭉하게 드러나는 미묘한 문제는 버려집니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Claude Code: Dynamic workflows](https://code.claude.com/docs/en/workflows)

> "LLMs generally perform better when each consideration is handled by a separate LLM call, allowing focused attention on each specific aspect."

---

## 문제 36
### **Customers report that some paid orders vanish without a trace, and nobody knows which part of the system drops them. Which design is adaptive decomposition for this investigation?**

| 보기 | 설명 |
|------|------|
| 1. An orchestrator that spawns four subagents in parallel up front, one each for the API, the queue, the database and the payment service, and then merges their reports | |
| 2. A prompt chain sequenced in code that collects logs, then correlates errors, then inspects the related code, each as its own LLM call with a gate between steps | |
| **3. An orchestrator that starts by tracing the missing order IDs through the logs and creates each next subtask from what the last one found, stopping once two rounds turn up nothing new** | |
| 4. A single long-context call loaded with the logs of the main services, asked to find where the orders are lost | |

**정답: 3.**

**해설:**

> 📘 레슨 1.6 · 작업 분해 전략 — Task decomposition: prompt chaining vs adaptive decomposition

**📝 문제 번역**

고객들이 결제된 주문 일부가 흔적 없이 사라진다고 신고합니다. 시스템의 어느 부분이 주문을 떨어뜨리는지 아무도 모릅니다. 이 조사에서 적응형 분해에 해당하는 설계는 무엇입니까?

- **①** 오케스트레이터가 처음부터 API, 큐, 데이터베이스, 결제 서비스에 하나씩 네 서브에이전트를 병렬로 띄운 뒤 보고를 합친다
- **②** 코드로 순서를 정한 프롬프트 체인이 로그 수집 → 오류 상관 분석 → 관련 코드 검사를 각각 별도 LLM 호출로, 단계 사이 게이트를 두고 진행한다
- **③** 오케스트레이터가 사라진 주문 ID를 로그에서 추적하는 것으로 시작해, 각 다음 하위 작업을 직전 작업이 찾은 내용으로 만들고, 두 라운드 연속 새로운 것이 없으면 멈춘다
- **④** 주요 서비스의 로그를 담은 긴 컨텍스트 호출 하나에 주문이 어디서 사라지는지 찾게 한다

> **핵심:** 적응형 분해는 '에이전트가 몇 개인가'가 아니라 '누가, 언제 하위 작업을 정하는가'로 판단합니다. 오케스트레이터가 중간 발견으로 다음 하위 작업을 만들고, 명시적인 정지 규칙을 둡니다.

1. **오답** - 여러 에이전트가 병렬로 돌지만 하위 작업은 증거가 나오기 전에 정해졌습니다. 이는 고정 병렬 분할(sectioning)이며, 원인이 다섯 번째 구성 요소에 있으면 아무도 살펴보지 않습니다.
2. **오답** - 단계가 미리 정해진 체인은 로그가 무엇을 말하든 같은 단계를 실행합니다. 발견이 다른 서비스를 가리켜도 단계를 추가·생략·반복할 수 없습니다.
3. **정답** - 사라진 주문 ID라는 구체적 단서에서 출발해 각 결과가 다음 작업을 결정하므로, 증거가 가리키는 곳으로 조사를 넓히거나 좁힐 수 있습니다. 끝이 정해져 있지 않은 루프라 정지 규칙이 필요한데, Claude Code 워크플로 예시도 '두 라운드 연속 새 발견이 없으면 멈춘다'는 진척 기반 규칙을 씁니다.
4. **오답** - 어떤 로그를 넣을지 미리 짐작해야 하고, 발견한 내용을 후속 조사할 기회가 없습니다. 원인이 '주요 서비스' 밖에 있으면 진단은 부분적인 스냅숏에 머뭅니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [Claude Code: Dynamic workflows](https://code.claude.com/docs/en/workflows)

> "The model must operate autonomously for many turns, making decisions about which directions to pursue based on intermediate findings."

---

## 문제 37
### **An architect is asked to design an agent that investigates why a production incident occurred, given only a vague alert message and no prior knowledge of which service is at fault. The number of logs, services, and code paths to inspect cannot be known ahead of time. Which decomposition approach is most appropriate?**

| 보기 | 설명 |
|------|------|
| **1. An orchestrator agent that plans each next task from what the previous task found and revises the plan as evidence arrives** | |
| 2. A fixed set of parallel subagents for the database, cache and load balancer that report to a merging step for diagnosis | |
| 3. A single prompt loaded with the alert and recent logs from the main services that asks the model to name the root cause | |
| 4. A prompt chain with predefined stages for collecting logs, correlating errors and inspecting code, then drafting a report | |

**정답: 1.**

**해설:**

> 📘 레슨 1.6 · 작업 분해 전략 — Task decomposition: prompt chaining vs adaptive decomposition

**📝 문제 번역**

아키텍트가 모호한 알림 메시지 하나만 주어지고 어느 서비스가 문제인지 사전 지식이 없는 상태에서, 운영 장애가 왜 발생했는지 조사하는 에이전트를 설계해야 합니다. 살펴볼 로그, 서비스, 코드 경로의 수는 미리 알 수 없습니다. 가장 알맞은 분해 방식은 무엇입니까?

- **①** 직전 작업이 찾은 내용으로 각 다음 작업을 계획하고, 증거가 들어올 때마다 계획을 수정하는 오케스트레이터 에이전트
- **②** 데이터베이스, 캐시, 로드 밸런서를 맡은 고정된 병렬 서브에이전트들이 진단을 위한 병합 단계에 보고하는 구조
- **③** 알림과 주요 서비스의 최근 로그를 담아 모델에게 근본 원인을 말하게 하는 단일 프롬프트
- **④** 로그 수집, 오류 상관 분석, 코드 검사 단계를 미리 정해 두고 마지막에 보고서를 쓰는 프롬프트 체인

> **핵심:** 필요한 하위 작업이 입력과 앞 단계의 발견에 달려 있으면, 오케스트레이터가 런타임에 하위 작업을 정하는 적응형 분해가 맞습니다.

1. **정답** - 문제 서비스를 모르고 작업량이 각 단계의 발견에 달려 있으므로, 앞선 발견으로 다음 작업을 고르는 오케스트레이터가 증거에 따라 탐색을 넓히거나 좁힐 수 있습니다. orchestrator-workers 패턴은 오케스트레이터가 어떤 하위 작업을 만들지 런타임에 정한다는 점에서 미리 정의된 병렬 워크플로보다 적응적입니다.
2. **오답** - 병렬 서브에이전트 자체는 실제 패턴이지만, 이 구성은 증거가 생기기 전에 세 구성 요소로 고정돼 있습니다. 원인이 다른 곳에 있으면 그 단서를 따라갈 수 없습니다.
3. **오답** - 몇몇 서비스의 로그를 미리 넣은 프롬프트 하나로는 알 수 없는 수의 로그·서비스·코드 경로를 덮을 수 없습니다. 발견을 후속 조사할 방법도 없어 진단이 부분적 스냅숏에 기대게 됩니다.
4. **오답** - 단계를 미리 정한 체인은 작업의 모양을 처음부터 고정합니다. 발견이 다른 서비스나 더 깊은 코드 경로를 가리켜도 단계를 추가·생략·반복할 수 없는데, 이 열린 조사에는 그것이 필요합니다.

📚 근거: [Orchestrator workers (Cookbook)](https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers) · [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

> "The orchestrator decides at runtime what subtasks to create, making this more adaptive than pre-defined parallel workflows."

---

## 문제 38
### **A developer named a session 'auth-refactor' on their laptop. A CI job on a fresh ephemeral build host then runs `claude -r "auth-refactor" "Finish this PR"`. Nothing else was set up on the host. What happens?**

| 보기 | 설명 |
|------|------|
| 1. It resumes directly, because a session name you set yourself is a valid handle wherever you are signed in | |
| **2. It does not find the session, because the transcript is on the laptop's local disk; the transcript file would have to be copied to the CI host first** | |
| 3. It opens the session picker with 'auth-refactor' pre-filled as a search term, because the CI host has no exact match | |
| 4. It falls back to the most recent session in the CI working directory, the way --continue does | |

**정답: 2.**

**해설:**

> 📘 레슨 1.7 · 세션 재개·포크 — Session resumption, forking, and fresh starts

**📝 문제 번역**

개발자가 노트북에서 세션에 'auth-refactor'라는 이름을 붙였습니다. 이후 새로 뜬 일회용 빌드 호스트의 CI 작업이 `claude -r "auth-refactor" "Finish this PR"` 을 실행합니다. 호스트에는 그 밖에 아무것도 설정하지 않았습니다. 어떻게 됩니까?

- **①** 직접 붙인 세션 이름은 로그인한 곳이라면 어디서든 유효한 핸들이므로 곧바로 재개된다
- **②** 세션을 찾지 못한다. 트랜스크립트가 노트북의 로컬 디스크에 있기 때문이며, 먼저 트랜스크립트 파일을 CI 호스트로 복사해야 한다
- **③** CI 호스트에 정확히 일치하는 것이 없으므로 'auth-refactor'를 검색어로 미리 채운 세션 선택기가 열린다
- **④** `--continue` 처럼 CI 작업 디렉터리의 가장 최근 세션으로 대신 이어진다

> **핵심:** 이름과 생성된 제목은 재개 핸들로 쓰이지만, 재개는 현재 머신에 저장된 세션 파일만 찾습니다. 세션은 로컬 디스크에 있습니다.

1. **오답** - 이름이 핸들로 쓰이는 것은 맞지만, 세션은 계정이 아니라 그 세션을 만든 머신의 로컬 트랜스크립트 파일(`~/.claude/projects/<project>/<session-id>.jsonl`)에 저장됩니다. 로그인 여부와 상관없이 파일이 없는 머신에서는 찾을 수 없습니다.
2. **정답** - Agent SDK 문서는 어느 작업 디렉터리에서든 재개할 수 있지만 '같은 머신에서만' 가능하며 세션 파일이 현재 머신에 있어야 한다고 설명합니다. 다른 호스트에서 이어 가려면 트랜스크립트 파일을 옮기거나, `SessionStore` 어댑터로 공유 저장소에 미러링하거나, 필요한 결과를 애플리케이션 상태로 저장해 새 세션 프롬프트에 넣어야 합니다.
3. **오답** - 검색어를 미리 채운 선택기는 이름이 **여러** 세션과 일치할 때 나타납니다. 이 호스트에는 일치하는 세션이 하나도 없습니다.
4. **오답** - `--resume` 은 최근 세션으로 대체하지 않습니다. 가장 최근 세션을 여는 것은 `--continue` 의 동작이며, 두 옵션은 세션을 찾는 방식이 다릅니다.

📚 근거: [Agent SDK: Work with sessions](https://code.claude.com/docs/en/agent-sdk/sessions) · [Claude Code: Manage sessions](https://code.claude.com/docs/en/sessions)

> "Same machine only: the session file still needs to exist on the current machine."

---

## 문제 39
### **An architect ran a two-hour investigation into a flaky payment-retry bug yesterday afternoon and named the session 'payment-retry-bug' before stopping for the day. This morning, a teammate wants the architect to pick the investigation back up with full context of everything already read and concluded, without hunting through the interactive session picker. Which approach satisfies this most directly?**

| 보기 | 설명 |
|------|------|
| **1. Run claude --resume payment-retry-bug in the project directory to reload that conversation** | |
| 2. Run claude --continue in the project directory to reload the latest conversation there | |
| 3. Run claude in the project directory and paste a summary of yesterday's findings first | |
| 4. Run claude --resume with no name and pick payment-retry-bug from the session list | |

**정답: 1.**

**해설:**

> 📘 레슨 1.7 · 세션 재개·포크 — Session resumption, forking, and fresh starts

**📝 문제 번역**

아키텍트가 어제 오후 간헐적으로 실패하는 결제 재시도 버그를 두 시간 동안 조사했고, 하루를 마치기 전에 세션 이름을 'payment-retry-bug'로 붙였습니다. 오늘 아침 팀원은 아키텍트가 대화형 세션 선택기를 뒤지지 않고, 이미 읽고 결론 낸 모든 내용의 전체 맥락을 가진 채 조사를 이어 가기를 원합니다. 이를 가장 직접적으로 충족하는 방법은 무엇입니까?

- **①** 프로젝트 디렉터리에서 `claude --resume payment-retry-bug` 를 실행해 그 대화를 다시 불러온다
- **②** 프로젝트 디렉터리에서 `claude --continue` 를 실행해 그곳의 최신 대화를 다시 불러온다
- **③** 프로젝트 디렉터리에서 `claude` 를 실행하고 먼저 어제 조사 결과 요약을 붙여 넣는다
- **④** 이름 없이 `claude --resume` 을 실행하고 세션 목록에서 payment-retry-bug를 고른다

> **핵심:** 이름을 붙인 세션으로 전체 맥락을 갖고 가장 직접 돌아가는 방법은 `--resume <그 이름>` 입니다. 정확히 일치하면 선택기 없이 바로 재개됩니다.

1. **정답** - `--resume` 에 세션 이름을 주면 읽은 파일, 도구 출력, 결론을 포함한 전체 이력과 함께 그 대화를 바로 불러오고, 선택기는 거치지 않습니다. 이름은 시작할 때 `claude -n`, 세션 중 `/rename`, 선택기에서 `Ctrl+R` 로 붙일 수 있습니다.
2. **오답** - `--continue` 는 그 디렉터리에서 가장 최근에 활동한 대화를 엽니다. 그사이 다른 세션이 하나라도 실행됐다면 결제 조사가 아니라 그 세션이 열리며, 이름 붙인 세션을 겨눌 수 없습니다.
3. **오답** - 새 세션은 빈 이력으로 시작하고, 직접 쓴 요약은 두 시간 조사의 파일 읽기, 도구 출력, 추론을 빠뜨립니다. 목표는 전체 맥락이었고, 그것은 저장된 대화를 복원해야만 얻을 수 있습니다.
4. **오답** - 이름 없는 `--resume` 은 대화형 선택기를 열므로 여전히 세션을 찾아 고르는 단계가 남습니다. 명령줄에 저장된 이름을 넘기면 그 단계가 사라집니다.

📚 근거: [Claude Code: Manage sessions](https://code.claude.com/docs/en/sessions) · [CLI reference](https://code.claude.com/docs/en/cli-reference)

> "`claude --resume <name>` | Resumes the named session directly"

---

## 문제 40
### **An application serves many concurrent users, each with their own long-running investigation conversation against the same repository directory. A backend service needs to resume a specific user's conversation on demand, potentially hours after the user's last message, while other users' sessions remain active in the same directory. Which session option should the service use?**

| 보기 | 설명 |
|------|------|
| **1. Pass the session ID stored for each user to resume when that user sends a follow-up request** | |
| 2. Pass continue_conversation=True on each follow-up request and let it reattach to the user's session | |
| 3. Pass fork_session=True on each follow-up request to branch off the user's earlier conversation state | |
| 4. Call resume without an ID and have the service pick the user's conversation from the session picker | |

**정답: 1.**

**해설:**

> 📘 레슨 1.7 · 세션 재개·포크 — Session resumption, forking, and fresh starts

**📝 문제 번역**

한 애플리케이션이 여러 동시 사용자에게 서비스하며, 사용자마다 같은 저장소 디렉터리를 대상으로 하는 장기 조사 대화를 가지고 있습니다. 백엔드 서비스는 같은 디렉터리에서 다른 사용자들의 세션이 활성 상태인 가운데, 사용자의 마지막 메시지로부터 몇 시간 뒤일 수도 있는 시점에 특정 사용자의 대화를 요청에 따라 재개해야 합니다. 서비스는 어떤 세션 옵션을 써야 합니까?

- **①** 사용자가 후속 요청을 보내면 그 사용자용으로 저장해 둔 session ID를 `resume` 에 넘긴다
- **②** 후속 요청마다 `continue_conversation=True` 를 넘겨 사용자의 세션에 다시 붙게 한다
- **③** 후속 요청마다 `fork_session=True` 를 넘겨 사용자의 이전 대화 상태에서 갈래를 만든다
- **④** ID 없이 `resume` 을 호출하고 서비스가 세션 선택기에서 사용자의 대화를 고르게 한다

> **핵심:** 한 디렉터리를 여러 세션이 공유하면 ID로 재개하는 것이 선택이 아니라 필수입니다. 사용자별 session ID를 저장했다가 `resume` 에 넘깁니다.

1. **정답** - 여러 세션이 한 디렉터리를 공유하므로 서비스는 사용자마다 session ID를 기록하고 그 ID를 재개해야 합니다. ID는 성공·오류와 상관없이 모든 결과 메시지의 `session_id` 에 들어 있어 쉽게 저장할 수 있고, ID로 재개하면 몇 시간 뒤에도 동작하며 다른 사용자의 활성 세션에 영향을 주지 않습니다.
2. **오답** - continue는 디렉터리에서 가장 최근 세션을 찾을 뿐 특정 사용자를 식별하지 못합니다. 동시 사용자가 있으면 후속 요청이 마지막으로 활동한 대화, 즉 다른 사용자의 대화에 붙을 수 있습니다. 문서도 continue는 앱이 한 번에 한 대화만 다룰 때 잘 맞는다고 설명합니다.
3. **오답** - `fork_session` 은 이미 선택된 세션에서 갈래를 만들 뿐 어느 사용자의 세션에서 시작할지 고르지 못합니다. 게다가 매 요청마다 새 세션이 생겨 사용자의 실제 대화 줄기를 놓치게 됩니다.
4. **오답** - ID 없이 재개하면 사람이 터미널에서 쓰는 대화형 선택기가 열립니다. 백엔드 서비스는 이를 프로그램으로 조작할 수 없고, 선택기 항목을 특정 사용자와 연결하는 정보도 없습니다.

📚 근거: [Agent SDK: Work with sessions](https://code.claude.com/docs/en/agent-sdk/sessions) · [Agent SDK Python reference](https://code.claude.com/docs/en/agent-sdk/python)

> "Required when you have multiple sessions (for example, one per user in a multi-user app)"

---

## 문제 41
### **After an expensive codebase analysis that ended with a JWT proposal, an engineer wants to try OAuth2 on a separate branch. They call `forked = fork_session(session_id, title="Try the OAuth approach")` in Python, and no agent output appears. What explains this, and what is the next step?**

| 보기 | 설명 |
|------|------|
| **1. fork_session() only writes the forked transcript and returns its ID. Pass forked.session_id to ClaudeAgentOptions(resume=...) to start working on the branch** | |
| 2. The fork runs in the background. Resume the original session_id to see the OAuth2 exploration, since forks report back to their parent | |
| 3. The standalone function cannot branch a finished session. Resume the original session and ask about OAuth2 there instead | |
| 4. The fork needs fork_session=True on the original session first. Until then the standalone call creates nothing on disk | |

**정답: 1.**

**해설:**

> 📘 레슨 1.7 · 세션 재개·포크 — Session resumption, forking, and fresh starts

**📝 문제 번역**

JWT 방안으로 끝난 비싼 코드베이스 분석 뒤, 엔지니어가 OAuth2를 별도 갈래에서 시도해 보려 합니다. Python에서 `forked = fork_session(session_id, title="Try the OAuth approach")` 를 호출했는데 에이전트 출력이 하나도 나타나지 않습니다. 이유와 다음 단계는 무엇입니까?

- **①** `fork_session()` 은 포크된 트랜스크립트를 쓰고 그 ID를 반환할 뿐이다. 갈래에서 작업을 시작하려면 `forked.session_id` 를 `ClaudeAgentOptions(resume=...)` 에 넘긴다
- **②** 포크는 백그라운드에서 실행된다. 포크는 부모에게 보고하므로, OAuth2 탐색을 보려면 원래 `session_id` 를 재개한다
- **③** 독립 함수로는 끝난 세션을 분기할 수 없다. 원래 세션을 재개해 거기서 OAuth2를 물어본다
- **④** 원래 세션에 먼저 `fork_session=True` 를 설정해야 한다. 그 전에는 독립 함수 호출이 디스크에 아무것도 만들지 않는다

> **핵심:** 독립 함수 `fork_session()` 은 파일 작업입니다. 트랜스크립트를 새 세션으로 복사하고 ID를 돌려줄 뿐, 그 ID를 `resume` 에 넘기기 전까지 에이전트는 실행되지 않습니다.

1. **정답** - `fork_session()` 은 세션 트랜스크립트를 새 세션으로 복사하고 `ForkSessionResult` 를 반환하며, 그 `session_id` 를 `resume` 으로 넘겨야 포크를 이어 갈 수 있습니다. `up_to_message_id` 를 주면 분석이 끝난 특정 메시지까지만 복사해 그 지점에서 분기할 수도 있습니다.
2. **오답** - 포크는 백그라운드에서 돌지 않으며 부모에게 보고하지도 않습니다. 원래 ID를 재개하면 JWT 줄기가 그대로 이어질 뿐 OAuth2 탐색은 없습니다.
3. **오답** - 독립 함수는 끝난 세션도 분기할 수 있습니다. 반대로 원래 세션에서 OAuth2를 물으면 그 탐색이 JWT 줄기에 섞이는데, 포크가 피하려던 바로 그 문제입니다.
4. **오답** - `fork_session=True` 는 `query()` 옵션으로 resume과 함께 쓰는 또 다른 포크 방식이며, 독립 함수의 전제 조건이 아닙니다. 독립 호출은 그 자체로 디스크에 새 트랜스크립트를 씁니다.

📚 근거: [Agent SDK Python reference](https://code.claude.com/docs/en/agent-sdk/python) · [Building a session browser (Cookbook)](https://platform.claude.com/cookbook/claude-agent-sdk-05-building-a-session-browser)

> "fork_session() writes the new file and returns its ID. It doesn't run the agent"

---

## 문제 42
### **While a session is resumed via --continue --fork-session to try a riskier approach, the architect notices that a permission the original session had approved with 'allow for this session' is being re-prompted in the new branch. Why does this happen?**

| 보기 | 설명 |
|------|------|
| **1. A session-level grant stays bound to the session that issued it, so a forked branch starts without it** | |
| 2. Combining --continue with --fork-session reloads history without permission state, which --resume would keep | |
| 3. A fork starts the branch in a new working directory, and grants are tied to the directory they were given in | |
| 4. Session-level grants lapse after a set number of turns, and the resumed history had already passed that point | |

**정답: 1.**

**해설:**

> 📘 레슨 1.7 · 세션 재개·포크 — Session resumption, forking, and fresh starts

**📝 문제 번역**

더 위험한 방안을 시도하려고 `--continue --fork-session` 으로 세션을 재개했는데, 원래 세션에서 '이 세션에서 허용(allow for this session)'으로 승인했던 권한을 새 갈래에서 다시 묻고 있다는 것을 아키텍트가 알아챕니다. 왜 이런 일이 생깁니까?

- **①** 세션 단위 허용은 그것을 발급한 세션에 묶여 있으므로, 포크된 갈래는 그 허용 없이 시작한다
- **②** `--continue` 와 `--fork-session` 을 함께 쓰면 권한 상태 없이 이력만 다시 불러오는데, `--resume` 이라면 유지됐을 것이다
- **③** 포크는 갈래를 새 작업 디렉터리에서 시작하며, 허용은 그것이 주어진 디렉터리에 묶여 있다
- **④** 세션 단위 허용은 정해진 턴 수가 지나면 만료되는데, 재개된 이력이 이미 그 지점을 지났다

> **핵심:** 포크는 대화를 복사할 뿐 권한 상태를 복사하지 않습니다. 'allow for this session' 허용은 발급한 세션(프로세스)에 남고, `--fork-session` 포크는 새 프로세스로 시작해 다시 승인해야 합니다.

1. **정답** - Claude Code 문서는 in-process `/branch` 는 같은 프로세스에서 돌기 때문에 기존 허용이 그대로 적용되지만, `--fork-session` 으로 별도 프로세스에 포크하면 새 프로세스는 그 허용 없이 시작해 다시 승인해야 한다고 설명합니다. 포크는 대화 이력은 복사하지만 그 허용은 복사하지 않습니다.
2. **오답** - `--fork-session` 은 `--continue` 와 쓰든 `--resume` 과 쓰든 똑같이 동작하며, `--resume` 으로 만든 포크도 세션 단위 허용을 물려받지 않습니다. 플래그 조합이 원인이 아닙니다.
3. **오답** - 포크는 대화를 분기할 뿐 실행 위치를 바꾸지 않습니다. 갈래는 같은 작업 디렉터리를 유지하므로 디렉터리 변경으로는 다시 묻는 이유를 설명할 수 없습니다.
4. **오답** - 세션 단위 승인에는 턴 기반 만료가 없습니다. 원래 세션에서는 여전히 유효하며, 새 갈래가 그것을 물려받지 않았을 뿐입니다.

📚 근거: [Claude Code: Manage sessions](https://code.claude.com/docs/en/sessions) · [CLI reference](https://code.claude.com/docs/en/cli-reference)

> "If you fork into a separate process with `--fork-session`, the new process starts without them and you re-approve there"

---
