<!-- 출처: https://www.certsafari.com/anthropic/claude-certified-architect-foundations/learn — CCAR-F 레슨 도메인 5(레슨 5.1~5.6)의 Exam question·Check yourself 객관식 문항. 문제·보기·정답은 원문 그대로 옮기고 보기 기호만 A–D → 1–4로 바꿨다. 해설은 원문 해설과 공식 문서를 바탕으로 한글로 작성. -->

## 문제 1
### **A support bot built on the Messages API sends the system prompt, its tool definitions and the customer's newest message on each request. By turn 12 it no longer knows the order number the customer gave in turn 3. Which change fixes this?**

| 보기 | 설명 |
|------|------|
| 1. Switch to a model with a 1M-token context window so the earlier turns stay in the model's memory | |
| **2. Send the complete conversation history with every request: all user messages, assistant replies and tool results** | |
| 3. Send a stable conversation ID with each request so the API can find the earlier turns of the session | |
| 4. Raise max_tokens so the model has room to remember more of the conversation | |

**정답: 2.**

**해설:**

> 📘 레슨 5.1 · 핵심 정보 보존 — Preserving critical facts in long conversations

**📝 문제 번역**

Messages API로 만든 지원 봇이 요청마다 system 프롬프트, 도구 정의, 고객의 최신 메시지만 보냅니다. 12번째 턴이 되자 봇은 고객이 3번째 턴에 알려 준 주문번호를 모릅니다. 어떤 변경이 이를 해결합니까?

- **①** 1M 토큰 컨텍스트 창을 가진 모델로 바꿔, 이전 턴이 모델의 기억에 남게 한다
- **②** 모든 요청에 전체 대화 이력(모든 user 메시지, assistant 응답, 도구 결과)을 보낸다
- **③** 요청마다 고정된 대화 ID를 보내 API가 세션의 이전 턴을 찾게 한다
- **④** `max_tokens` 를 올려 모델이 대화를 더 많이 기억할 여유를 준다

> **핵심:** Messages API는 요청 사이에 상태를 저장하지 않으므로, 모델이 보는 것은 이번 요청에 담긴 내용뿐입니다.

1. **오답** - 컨텍스트 창 크기는 한 요청에 담을 수 있는 양의 상한일 뿐, 앱이 보내지 않은 턴을 채워 주지 않습니다. 3번째 턴이 요청에 없으면 1M 창에서도 모델은 그 주문번호를 본 적이 없습니다.
2. **정답** - 공식 문서는 Messages API가 stateless라서 항상 전체 대화 이력을 보내야 한다고 설명합니다. 이전 user·assistant 메시지와 도구 결과를 매 요청의 `messages` 에 다시 담아야 3번째 턴의 주문번호가 모델 입력에 들어갑니다. 이력 관리가 곧 기억 관리입니다.
3. **오답** - Messages API에는 대화 ID로 이전 턴을 불러오는 서버 측 세션이 없습니다. 모델이 무엇을 "기억"하는지는 앱이 무엇을 다시 보내느냐로 정해집니다.
4. **오답** - `max_tokens` 는 이번 응답의 출력 길이 상한입니다. 입력에 무엇이 들어가는지와 무관하므로 빠진 턴을 되살리지 못합니다.

📚 근거: [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages) · [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)

> "The Messages API is stateless, which means that you always send the full conversational history to the API."

---

## 문제 2
### **Turn 30 of a billing chat: the customer says, "You promised my $214.88 refund by the 15th." The agent's context contains the full system prompt and a running summary that has been condensed several times. The summary says only "customer wants a refund soon." What is the most likely cause?**

| 보기 | 설명 |
|------|------|
| 1. The Messages API is stateless, so it dropped the older turns once the conversation passed a set length | |
| **2. Each summarization pass traded precision for brevity, so the exact amount and deadline were condensed into vague wording** | |
| 3. The model hallucinated a vaguer version of the facts because the context window was nearly full | |
| 4. The summaries were written by a cheaper model; with the main model writing them, the facts would have survived | |

**정답: 2.**

**해설:**

> 📘 레슨 5.1 · 핵심 정보 보존 — Preserving critical facts in long conversations

**📝 문제 번역**

청구 상담 30번째 턴에 고객이 "15일까지 $214.88 환불해 주기로 하셨잖아요"라고 말합니다. 에이전트의 컨텍스트에는 전체 system 프롬프트와, 여러 번 다시 압축된 누적 요약이 있습니다. 요약에는 "고객이 곧 환불을 원함"만 남아 있습니다. 가장 가능성 높은 원인은?

- **①** Messages API가 stateless라서, 대화가 일정 길이를 넘자 오래된 턴을 버렸다
- **②** 요약 단계마다 간결함을 위해 정밀도를 희생해, 정확한 금액과 기한이 모호한 표현으로 압축됐다
- **③** 컨텍스트 창이 거의 차서 모델이 사실을 더 모호하게 환각했다
- **④** 요약을 더 저렴한 모델이 썼다. 메인 모델이 썼다면 사실이 살아남았을 것이다

> **핵심:** 요약은 본래 손실 압축이며, 요약을 거듭할수록 금액·날짜·고객이 들은 약속 같은 정밀한 값이 가장 먼저 흐려집니다.

1. **오답** - stateless는 API가 이전 요청을 기억하지 않는다는 뜻이지, API가 스스로 턴을 잘라 낸다는 뜻이 아닙니다. 이력을 요약으로 바꾼 것은 애플리케이션의 선택입니다.
2. **정답** - 요약 단계는 앞 요약을 다시 압축하는 과정을 되풀이하고, 그때마다 "$214.88", "15일" 같은 구체 값이 "곧", "환불" 같은 일반어로 바뀝니다. Anthropic의 컨텍스트 엔지니어링 글도 지나치게 공격적인 compaction은 나중에야 중요성이 드러나는 미묘한 정보를 잃게 한다고 경고합니다.
3. **오답** - 요약문 자체에 이미 "곧 환불"만 남아 있으므로, 원인은 모델의 생성 오류가 아니라 입력에서 값이 사라진 데 있습니다. 창이 거의 찼다는 근거도 시나리오에 없습니다.
4. **오답** - 어떤 모델이 요약하든 반복 압축은 손실을 피할 수 없습니다. 요약 모델을 바꾸는 것은 구조적 원인을 건드리지 않습니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Compaction overview](https://platform.claude.com/docs/en/build-with-claude/compaction)

> "overly aggressive compaction can result in the loss of subtle but critical context whose importance only becomes apparent later"

---

## 문제 3
### **A billing support agent has been summarizing a lengthy chat every few turns to keep the prompt short. After the third summarization pass, the running summary reads "the customer wants a refund soon and mentioned an order from last month," even though the original messages contained an exact order number, a refund amount of $214.88, and a customer-stated deadline of the 15th. Which practice best addresses this failure mode going forward?**

| 보기 | 설명 |
|------|------|
| **1. Store the order number, refund amount, and deadline in a structured record that is passed along with each summary** | |
| 2. Shorten the interval between summarization passes so each pass condenses fewer new messages into the running summary | |
| 3. Prompt the customer to re-send the order number, refund amount, and deadline each time the summary is refreshed | |
| 4. Move to a model with a larger context window and raise the summarization threshold so condensing starts much later | |

**정답: 1.**

**해설:**

> 📘 레슨 5.1 · 핵심 정보 보존 — Preserving critical facts in long conversations

**📝 문제 번역**

청구 지원 에이전트가 프롬프트를 짧게 유지하려고 긴 상담을 몇 턴마다 요약해 왔습니다. 세 번째 요약 뒤 누적 요약은 "고객이 곧 환불을 원하며 지난달 주문을 언급함"이 되었습니다. 원래 메시지에는 정확한 주문번호, $214.88 환불 금액, 고객이 말한 15일 기한이 있었습니다. 앞으로 이 실패 유형을 가장 잘 막는 방법은?

- **①** 주문번호·환불 금액·기한을 구조화된 기록에 저장해 매 요약과 함께 넘긴다
- **②** 요약 간격을 줄여 한 번에 누적 요약으로 압축하는 새 메시지 수를 줄인다
- **③** 요약을 갱신할 때마다 고객에게 주문번호·환불 금액·기한을 다시 보내 달라고 한다
- **④** 더 큰 컨텍스트 창 모델로 옮기고 요약 임계값을 높여 압축을 훨씬 늦게 시작한다

> **핵심:** 바뀌면 안 되는 거래성 사실은 요약 대상에서 빼서, 구조화된 case-facts 기록으로 따로 싣습니다.

1. **정답** - 식별자·금액·날짜를 서술형 요약 밖의 구조화된 기록에 두면, 대화를 아무리 압축해도 그 값은 흐려지지 않습니다. 기록은 매 요약과 함께 바뀌지 않은 채 모델에 전달됩니다.
2. **오답** - 요약이 한 번 더 돌 때마다 이전 요약이 다시 압축되고, 바로 그 재압축 때문에 주문번호·금액·기한이 사라졌습니다. 간격을 줄이면 압축 횟수가 늘어 정밀한 값이 더 빨리 무너집니다.
3. **오답** - 고객은 이미 정보를 줬고, 손실은 에이전트가 자기 컨텍스트를 다루는 방식에서 생겼습니다. 다시 받은 값도 다음 요약에 들어가 또 흐려질 수 있고, 고객에게 이미 준 정보를 되풀이하게 하는 부담만 생깁니다.
4. **오답** - 창을 키우고 임계값을 올리면 요약 시점이 늦춰질 뿐, 긴 대화에서는 결국 압축이 일어나 값이 빠질 수 있습니다. 그동안 컨텍스트가 길어지면서 recall이 떨어지는 context rot도 생깁니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)

---

## 문제 4
### **You are redesigning a billing agent whose running summary keeps paraphrasing refund amounts, invoice numbers and promised deadlines. Summarization has to stay, because the chats run long. Which design keeps those values exact on every turn?**

| 보기 | 설명 |
|------|------|
| 1. Write a custom summary prompt that tells Claude to list every amount, date and promise under Context to Preserve | |
| **2. Pull the transactional facts into a structured case-facts block that is sent with every prompt and kept out of the history being summarized** | |
| 3. Turn off summarization and rely on a 1M-token context window so the original turns are never condensed | |
| 4. After each summarization pass, ask the customer to confirm their order number, amount and deadline again | |

**정답: 2.**

**해설:**

> 📘 레슨 5.1 · 핵심 정보 보존 — Preserving critical facts in long conversations

**📝 문제 번역**

누적 요약이 환불 금액, 청구서 번호, 약속한 기한을 계속 바꿔 말하는 청구 에이전트를 다시 설계하고 있습니다. 대화가 길어서 요약은 유지해야 합니다. 어떤 설계가 이 값들을 매 턴 정확하게 유지합니까?

- **①** 맞춤 요약 프롬프트로 Claude에게 모든 금액·날짜·약속을 Context to Preserve 아래에 나열하게 한다
- **②** 거래성 사실을 구조화된 case-facts 블록으로 뽑아 매 프롬프트에 함께 보내고, 요약되는 이력에서는 제외한다
- **③** 요약을 끄고 1M 토큰 컨텍스트 창에 기대, 원래 턴이 압축되지 않게 한다
- **④** 요약할 때마다 고객에게 주문번호·금액·기한을 다시 확인받는다

> **핵심:** 요약 안에 남아 있는 값은 보존을 아무리 지시해도 다음 요약에서 다시 바뀔 수 있으므로, 값 자체를 요약 경로 밖으로 뺍니다.

1. **오답** - SDK 기본 요약 프롬프트의 Context to Preserve 섹션처럼 보존 지시를 강화하면 도움은 되지만, 값은 여전히 요약 안에 있어 이후 요약 단계에서 바꿔 말해질 수 있습니다. 지시는 손실 가능성을 줄일 뿐 없애지 못합니다.
2. **정답** - case-facts 블록은 요약되는 이력과 분리되어 있으므로 어떤 요약도 그 값을 건드리지 못합니다. 컨텍스트 창 밖에 노트를 두고 필요할 때 다시 불러오는 structured note-taking을 상담 대화에 적용한 형태입니다. 이슈가 여럿이면 이슈마다 식별자·금액·상태를 담은 기록을 따로 둡니다.
3. **오답** - 요약 유지는 문제의 전제 조건입니다. 또 창이 커도 토큰이 늘수록 recall이 떨어지는 context rot이 생기고, 매 턴 전체 이력을 다시 보내는 비용도 쌓입니다.
4. **오답** - 고객에게 같은 정보를 반복하게 하는 것은 에이전트의 컨텍스트 관리 문제를 고객에게 떠넘기는 것입니다. 다시 받은 값도 요약 안에 들어가면 또 흐려집니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)

> "Structured note-taking, or agentic memory, is a technique where the agent regularly writes notes persisted to memory outside of the context window."

---

## 문제 5
### **A returns-processing agent calls an order-lookup tool that returns a JSON payload with 40+ fields (shipping carrier metadata, internal warehouse codes, marketing tags, etc.) for every order it checks, and after a dozen lookups the raw payloads dominate the context window even though only 5 fields (order status, purchase date, item, amount, return-window deadline) matter for return eligibility. What should the agent do before adding each lookup result to context?**

| 보기 | 설명 |
|------|------|
| **1. Parse each lookup response in code and hand the model only status, purchase date, item, amount and return deadline** | |
| 2. Cache each full lookup response in a session store and reuse it on repeat checks instead of calling the tool again | |
| 3. Send each lookup response to a second model call that writes a brief summary, and keep only that summary in history | |
| 4. Truncate each lookup response to its first 1,000 characters in code and keep only that leading excerpt in history | |

**정답: 1.**

**해설:**

> 📘 레슨 5.1 · 핵심 정보 보존 — Preserving critical facts in long conversations

**📝 문제 번역**

반품 처리 에이전트가 주문 조회 도구를 호출하면, 확인하는 주문마다 40개가 넘는 필드(배송사 메타데이터, 내부 창고 코드, 마케팅 태그 등)가 담긴 JSON이 돌아옵니다. 조회가 열두 번쯤 쌓이자 원본 페이로드가 컨텍스트 창을 지배하지만, 반품 자격 판단에 필요한 것은 5개 필드(주문 상태, 구매일, 품목, 금액, 반품 기한)뿐입니다. 조회 결과를 컨텍스트에 넣기 전에 에이전트는 무엇을 해야 합니까?

- **①** 각 조회 응답을 코드로 파싱해 상태·구매일·품목·금액·반품 기한만 모델에 넘긴다
- **②** 전체 조회 응답을 세션 저장소에 캐시해, 같은 주문을 다시 확인할 때 도구를 다시 부르지 않고 재사용한다
- **③** 각 조회 응답을 두 번째 모델 호출로 보내 짧은 요약을 쓰게 하고, 이력에는 그 요약만 남긴다
- **④** 각 조회 응답을 코드로 앞 1,000자까지 잘라 그 앞부분만 이력에 남긴다

> **핵심:** 도구 결과는 이력에 들어가기 전에, 코드로 필요한 필드만 결정론적으로 골라 냅니다.

1. **정답** - 응답을 코드로 파싱해 반품 판단에 필요한 다섯 필드만 넘기면 값은 원본 그대로 정확하고, 모델이 들고 다니는 양은 도구 페이로드 크기가 아니라 필요한 필드 수로 정해집니다. 도구를 직접 고칠 수 없으면 PostToolUse hook 같은 가로채기 지점에서 같은 처리를 할 수 있습니다.
2. **오답** - 캐시는 같은 주문을 다시 조회할 때만 효과가 있습니다. 새 주문을 확인할 때마다 40여 개 필드가 그대로 들어오므로, 첫 조회가 컨텍스트에 더하는 양은 전혀 줄지 않습니다.
3. **오답** - 조회마다 모델 호출이 하나 더 붙어 비용과 지연이 늘고, 생성된 요약이 금액이나 반품 기한 같은 정확한 값을 바꾸거나 빠뜨릴 수 있습니다. 점진 요약의 흐림 문제를 다시 들여오는 셈입니다.
4. **오답** - 글자 수 절단은 어떤 필드가 중요한지와 무관합니다. 필드 순서에 따라 배송사 메타데이터와 창고 코드는 남고 반품 기한이나 금액이 잘려 나갈 수 있습니다.

📚 근거: [Manage tool context](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context) · [Context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)

> "Tool definitions and accumulated tool_result blocks consume your context window."

---

## 문제 6
### **A research assistant aggregates outputs from five subagents (market sizing, competitor pricing, regulatory risk, customer sentiment, distribution channels) into one long combined document that is then passed to a synthesis step. The synthesis step's final memo omits the regulatory risk finding, which appeared in the third of five sections in the middle of the document. What is the best way to structure the aggregated input to prevent this in future runs?**

| 보기 | 설명 |
|------|------|
| **1. Open the combined input with a short summary of each subagent's key findings, and give each detailed section its own clear heading** | |
| 2. Move the regulatory risk section to the end of the combined input, and keep the other four sections in their current order | |
| 3. Instruct the synthesis step to re-read the combined input and check each section against its draft memo before finalizing it | |
| 4. Split the combined input into two shorter parts, and pass both parts to the synthesis step as separate inputs in order | |

**정답: 1.**

**해설:**

> 📘 레슨 5.1 · 핵심 정보 보존 — Preserving critical facts in long conversations

**📝 문제 번역**

리서치 어시스턴트가 서브에이전트 5개(시장 규모, 경쟁사 가격, 규제 리스크, 고객 정서, 유통 채널)의 출력을 하나의 긴 문서로 합쳐 종합 단계에 넘깁니다. 최종 메모에서 규제 리스크 발견이 빠졌는데, 이 내용은 문서 중간인 다섯 섹션 중 세 번째에 있었습니다. 다음 실행에서 이를 막으려면 집계 입력을 어떻게 구성하는 것이 가장 좋습니까?

- **①** 합친 입력 맨 앞에 서브에이전트별 핵심 발견의 짧은 요약을 두고, 각 상세 섹션에 명확한 제목을 붙인다
- **②** 규제 리스크 섹션을 입력 맨 끝으로 옮기고, 나머지 네 섹션은 현재 순서를 유지한다
- **③** 종합 단계에 최종 확정 전에 입력을 다시 읽고 각 섹션을 초안 메모와 대조하라고 지시한다
- **④** 합친 입력을 짧은 두 부분으로 나눠, 별도 입력으로 순서대로 종합 단계에 넘긴다

> **핵심:** 긴 입력의 중간에 놓인 내용은 빠지기 쉬우므로(lost in the middle), 모든 발견의 요약을 앞에 두고 섹션을 명시적으로 나눕니다.

1. **정답** - 앞부분 요약은 모든 서브에이전트의 핵심 발견을 주의가 가장 잘 가는 입력 시작 위치에 한 번 더 놓고, 명확한 제목(XML 태그나 Markdown 헤더)은 상세 섹션을 찾기 쉽게 합니다. 어느 서브에이전트의 결과가 중간에 오더라도 보호됩니다.
2. **오답** - 규제 리스크만 구하고, 그 자리를 다른 섹션이 채워 다음 실행에서는 그 섹션이 중간의 약한 위치에 놓입니다. 구조 없는 긴 입력이라는 원인은 그대로입니다.
3. **오답** - 프롬프트만 바꿀 뿐 입력은 여전히 구조가 없습니다. 다시 읽으라는 지시는 중간 내용 손실을 안정적으로 보완하지 못하고, 규제 섹션은 여전히 모델이 가장 덜 쓰는 위치에 있습니다. 문제는 입력의 구조적 수정을 묻고 있습니다.
4. **오답** - 나눠도 요약이나 제목이 생기지 않으며, 각 부분마다 또 다른 중간이 생깁니다. 종합 단계가 두 입력을 합쳐야 하는 부담도 늘어납니다.

📚 근거: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

> "using techniques like XML tagging or Markdown headers to delineate these sections"

---

## 문제 7
### **A team is writing the handoff rules for a new customer support agent. Which design gets escalation right in both directions?**

| 보기 | 설명 |
|------|------|
| 1. Hand off any case the agent judges to be complicated, so a human reviews every multi-step case. | |
| **2. Hand off only on specific conditions you can see in the conversation: the customer asks for a person, written policy doesn't cover the request, or the agent can't make meaningful progress.** | |
| 3. Never hand off, because every escalation lowers the deflection rate and adds cost. | |
| 4. Send every conversation to a human for approval before the agent acts, so the agent never decides anything alone. | |

**정답: 2.**

**해설:**

> 📘 레슨 5.2 · 에스컬레이션 — Escalation triggers and ambiguity resolution for support agents

**📝 문제 번역**

팀이 새 고객지원 에이전트의 이관(handoff) 규칙을 쓰고 있습니다. 어떤 설계가 양방향 모두에서 에스컬레이션을 올바르게 합니까?

- **①** 에이전트가 복잡하다고 판단한 케이스는 모두 넘겨, 여러 단계짜리 케이스를 모두 사람이 검토하게 한다.
- **②** 대화에서 확인할 수 있는 특정 조건에서만 넘긴다: 고객이 사람을 요청할 때, 서면 정책이 요청을 다루지 않을 때, 에이전트가 의미 있는 진전을 낼 수 없을 때.
- **③** 에스컬레이션은 자동 처리율(deflection rate)을 낮추고 비용을 늘리므로 절대 넘기지 않는다.
- **④** 에이전트가 행동하기 전에 모든 대화를 사람의 승인으로 보내, 에이전트가 혼자 결정하는 일이 없게 한다.

> **핵심:** 에스컬레이션은 과다·과소 두 방향으로 틀릴 수 있으며, 기준은 대화에서 관찰할 수 있는 세 가지 트리거입니다.

1. **오답** - 복잡도는 트리거가 아닙니다. 정책이 모든 단계를 다루는 다단계 케이스는 에이전트가 처리해야 하며, 복잡도를 기준으로 삼으면 과다 이관이 됩니다.
2. **정답** - 명시적 사람 요청, 정책의 공백·모호, 진전 불가는 모두 대화 안에서 확인할 수 있는 조건이라 일관되게 적용됩니다. 공식 고객지원 가이드도 이관했어야 했는데 놓친 대화를 추적하는 escalation efficiency와, 사람 없이 처리한 비율인 deflection rate를 함께 재서 두 방향의 오류를 모두 보게 합니다.
3. **오답** - "절대 넘기지 않음"은 과소 이관입니다. 에이전트가 권한 밖의 결정을 내리거나, 끝나지 않는 루프에 고객을 붙잡아 두게 됩니다.
4. **오답** - 모든 것을 승인받는 설계는 에이전트를 비싼 티켓 전달 장치로 만듭니다. Anthropic은 "전부 아니면 전무"가 아니라 특정 상황만 승인 대상으로 표시하라고 권합니다.

📚 근거: [Customer support agent](https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat) · [Building AI agents for startups](https://claude.com/blog/building-ai-agents-for-startups)

> "Design your agents to flag specific situations for approval rather than proceeding automatically on everything or nothing."

---

## 문제 8
### **Earlier in a chat, a customer sounded irritated but never asked for a person. So the agent acknowledged the frustration and offered a human as an option. The customer now replies: "No, just put me through to a person." The billing-date change they need takes one tool call. What should the agent do next?**

| 보기 | 설명 |
|------|------|
| 1. Make the billing-date change first, since it takes one step, and then transfer the customer | |
| **2. Hand off to a human now, without making the change or investigating further** | |
| 3. Keep working on the issue, because the agent already decided that frustration alone is not an escalation trigger | |
| 4. Ask the customer why they want a person before deciding whether to escalate | |

**정답: 2.**

**해설:**

> 📘 레슨 5.2 · 에스컬레이션 — Escalation triggers and ambiguity resolution for support agents

**📝 문제 번역**

앞서 고객이 짜증 난 듯했지만 사람을 요청하지는 않아서, 에이전트는 불편을 인정하고 상담원 연결을 선택지로 제안했습니다. 이제 고객이 "아니요, 그냥 사람한테 연결해 주세요"라고 답합니다. 고객에게 필요한 청구일 변경은 도구 호출 한 번이면 됩니다. 에이전트가 다음에 할 일은?

- **①** 한 단계면 되니 청구일 변경을 먼저 하고, 그다음 고객을 연결한다
- **②** 변경이나 추가 조사 없이 지금 바로 사람에게 넘긴다
- **③** 불만만으로는 이관 트리거가 아니라고 이미 판단했으므로 계속 문제를 처리한다
- **④** 이관 여부를 정하기 전에 왜 사람을 원하는지 묻는다

> **핵심:** 고객이 사람을 원한다고 말하면 첫 메시지든 다섯 번째든 명시적 요청이며, 조사 없이 즉시 이관합니다.

1. **오답** - 문제가 간단해도 "빠른 처리 후 연결"은 고객이 밝힌 선호를 덮어쓰는 것입니다. 명시적 요청 뒤에는 해결 가능성을 따지지 않습니다.
2. **정답** - 제안을 받은 고객이 사람을 다시 원한다고 답했으므로, 선호를 거듭 밝힌 명시적 요청입니다. 에이전트는 더 설득하거나 조사하지 않고 넘깁니다. 넘길 때 지금까지 파악한 내용을 요약해 주면 상담원이 같은 설명을 다시 듣지 않아도 됩니다.
3. **오답** - 앞의 판단은 고객이 사람을 요청하지 않았던 시점의 것입니다. 상황이 명시적 요청으로 바뀌었으므로 이전 판단은 더 이상 적용되지 않습니다.
4. **오답** - 이유를 묻는 것은 고객에게 요청을 정당화하라고 요구하는 것이며, 받아들여야 할 요청을 미루는 일입니다.

📚 근거: [Customer support agent](https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat) · [Building AI agents in financial services](https://claude.com/blog/building-ai-agents-in-financial-services)

> "provide straightforward pathways to human specialists when needed"

---

## 문제 9
### **A healthcare scheduling assistant follows a configured escalation policy: when a request is within the assistant's capability and the patient has not asked for a staff member, the assistant should acknowledge any expressed frustration, complete the request directly, and offer escalation to a staff member as an option rather than a requirement -- reserving mandatory escalation for requests it cannot complete, cases needing clinical judgment, or an explicit request for a human. A patient messages the assistant in a clearly irritated tone about needing to reschedule a routine appointment with no clinical urgency. The assistant can complete the rescheduling directly, and the patient has not asked to speak with a staff member. Following its configured policy, what should the assistant do?**

| 보기 | 설명 |
|------|------|
| **1. Acknowledge the frustration, go ahead and reschedule the appointment now, and offer to escalate to a staff member.** | |
| 2. Escalate to a staff member immediately, since the irritated tone signals the situation needs human handling. | |
| 3. Reschedule the appointment without acknowledging the tone, treating the frustration as unrelated to completing the request. | |
| 4. Ask the patient to confirm they do not want a staff member before proceeding with the reschedule. | |

**정답: 1.**

**해설:**

> 📘 레슨 5.2 · 에스컬레이션 — Escalation triggers and ambiguity resolution for support agents

**📝 문제 번역**

의료 예약 어시스턴트는 다음 에스컬레이션 정책을 따릅니다. 요청이 어시스턴트의 처리 범위 안이고 환자가 직원을 요청하지 않았다면, 표현된 불만을 인정하고, 요청을 직접 완료하며, 직원 연결은 필수가 아닌 선택지로 제안합니다. 필수 에스컬레이션은 완료할 수 없는 요청, 임상적 판단이 필요한 경우, 사람에 대한 명시적 요청에만 둡니다. 한 환자가 임상적 긴급성이 없는 정기 진료 일정 변경에 대해 확연히 짜증 섞인 어조로 메시지를 보냈습니다. 어시스턴트는 일정을 직접 바꿀 수 있고, 환자는 직원과 이야기하겠다고 하지 않았습니다. 정책에 따르면 어시스턴트는 무엇을 해야 합니까?

- **①** 불만을 인정하고, 지금 바로 일정을 변경하며, 직원 연결을 제안한다.
- **②** 짜증 섞인 어조는 사람이 다뤄야 할 상황이라는 신호이므로 즉시 직원에게 넘긴다.
- **③** 어조를 인정하지 않고 일정을 변경한다. 불만은 요청 완료와 무관한 것으로 본다.
- **④** 일정 변경 전에, 직원 연결을 원하지 않는다는 것을 환자에게 확인받는다.

> **핵심:** 사람 요청이 없고 처리 범위 안이면 "인정 · 해결 · 선택지로 제안" 세 가지를 한 응답에서 모두 합니다.

1. **정답** - 표현된 불만을 인정하고, 범위 안의 요청이니 일정 변경을 실제로 완료하며(할 수 있다고 말만 하는 것이 아니라), 직원 연결을 강제하지도 빠뜨리지도 않고 선택지로 제안합니다. 정책의 세 요소를 모두 충족하는 유일한 보기입니다.
2. **오답** - 정책은 필수 에스컬레이션을 완료 불가, 임상적 판단 필요, 명시적 요청 세 경우로 한정합니다. 짜증 섞인 어조는 그 어느 것에도 해당하지 않으므로, 즉시 이관은 정책을 따르는 것이 아니라 어기는 것입니다.
3. **오답** - 정책은 요청 완료와 함께 불만 인정을 요구합니다. 일정 변경 자체는 맞지만, 정책의 절반을 빠뜨렸습니다.
4. **오답** - 정책상 이관은 어시스턴트가 제안하는 것이지, 환자가 먼저 배제해야 하는 조건이 아닙니다. 정책에 없는 확인 단계가 생겨 범위 안 요청의 직접 처리가 늦어집니다.

📚 근거: [Customer support agent](https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat) · [Ticket routing](https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing)

> "This assesses Claude's ability to maintain or improve customer sentiment throughout the conversation."

---

## 문제 10
### **A retail customer asks a support agent to match a lower price they found on a competitor's website. The store's documented policy only describes price adjustments when the store's own website lowers a price within 14 days of purchase; it does not mention competitor pricing at all. How should the agent proceed?**

| 보기 | 설명 |
|------|------|
| **1. Refer the request to a supervisor, who can decide cases the written policy does not address** | |
| 2. Decline the request, treating the own-site adjustment terms as the full list of permitted adjustments | |
| 3. Approve the match, extending the own-site adjustment terms to a competitor's lower price as well | |
| 4. Ask for a screenshot of the competitor's listing, then approve the match if the lower price checks out | |

**정답: 1.**

**해설:**

> 📘 레슨 5.2 · 에스컬레이션 — Escalation triggers and ambiguity resolution for support agents

**📝 문제 번역**

소매 고객이 경쟁사 웹사이트에서 찾은 더 낮은 가격에 맞춰 달라고 요청합니다. 매장의 문서화된 정책은 구매 후 14일 이내에 매장 자체 웹사이트 가격이 내려갔을 때의 가격 조정만 설명하고, 경쟁사 가격은 전혀 언급하지 않습니다. 에이전트는 어떻게 해야 합니까?

- **①** 서면 정책이 다루지 않는 사안을 결정할 수 있는 상급자에게 요청을 넘긴다
- **②** 자사 사이트 조정 조항을 허용된 조정의 전체 목록으로 보고 요청을 거절한다
- **③** 자사 사이트 조정 조항을 경쟁사의 낮은 가격에도 확장해 가격 맞춤을 승인한다
- **④** 경쟁사 판매 페이지 스크린샷을 요청하고, 낮은 가격이 확인되면 가격 맞춤을 승인한다

> **핵심:** 정책이 침묵하는 요청은 허용도 금지도 아니므로, 에이전트가 결론을 만들지 않고 권한 있는 사람에게 넘깁니다.

1. **정답** - 서면 정책은 14일 이내 자사 가격 인하만 다루고 경쟁사 가격에 대해서는 말이 없습니다. 허용할 근거도 거절할 근거도 없으므로, 그 사안을 결정할 권한이 있는 상급자나 가격 정책 담당 팀에 넘깁니다.
2. **오답** - 정책은 한 종류의 조정을 설명할 뿐 다른 조정을 금지하지 않습니다. 이를 전체 목록으로 읽으면 쓰여 있지 않은 금지 규칙을 에이전트가 만들어 내는 셈입니다.
3. **오답** - 자사 가격 조항을 경쟁사 가격까지 늘리는 것은 에이전트에게 권한이 없는 정책 확장입니다. 공식 고객지원 가이드의 가드레일 예시도 권한이 없는 약속이나 합의를 하지 말라고 합니다.
4. **오답** - 가격 확인은 사실을 검증할 뿐, 가격을 맞춰 줄 권한을 만들지 않습니다. 확인 뒤 승인해도 결국 정책이 답하지 않는 질문을 에이전트가 결정한 것입니다.

📚 근거: [Customer support agent](https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat) · [Ticket routing](https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing)

> "Don't make promises or enter into agreements it's not authorized to make."

---

## 문제 11
### **A support team's prototype routes a conversation to a human whenever its sentiment score turns negative or the model rates its own confidence below 0.6. In testing, a furious customer with a routine 30-day size exchange gets escalated. A polite customer whose request no written policy covers stays with the agent. What should the team change?**

| 보기 | 설명 |
|------|------|
| 1. Keep the sentiment rule and drop the confidence rule, because anger reliably signals a case that needs a person, while self-ratings are subjective | |
| 2. Keep the confidence rule and drop the sentiment rule, because the model is the best judge of when it is out of its depth | |
| 3. Escalate only when both signals fire together, so negative sentiment and low confidence cover each other's blind spots | |
| **4. Stop using either signal as a trigger: route on checkable conditions (customer asked for a human, no policy covers the request, no way forward), and track sentiment as an outcome from the start to the end of the conversation** | |

**정답: 4.**

**해설:**

> 📘 레슨 5.2 · 에스컬레이션 — Escalation triggers and ambiguity resolution for support agents

**📝 문제 번역**

지원팀의 프로토타입은 감정 점수가 부정적으로 바뀌거나 모델이 스스로 매긴 확신도가 0.6 아래로 떨어지면 대화를 사람에게 넘깁니다. 테스트에서 일반적인 30일 사이즈 교환을 요청한 몹시 화난 고객은 이관됐고, 서면 정책이 다루지 않는 요청을 한 정중한 고객은 에이전트에 남았습니다. 팀은 무엇을 바꿔야 합니까?

- **①** 감정 규칙은 남기고 확신도 규칙은 뺀다. 분노는 사람이 필요한 케이스를 확실히 알려 주지만 자기 평가는 주관적이기 때문이다
- **②** 확신도 규칙은 남기고 감정 규칙은 뺀다. 자기 능력 밖인지는 모델이 가장 잘 판단하기 때문이다
- **③** 두 신호가 동시에 나올 때만 이관해, 부정 감정과 낮은 확신도가 서로의 사각지대를 메우게 한다
- **④** 두 신호 모두 트리거로 쓰지 않는다. 확인 가능한 조건(고객이 사람을 요청, 요청을 다루는 정책 없음, 진전 방법 없음)으로 라우팅하고, 감정은 대화 시작부터 끝까지의 결과 지표로 추적한다

> **핵심:** 감정 점수와 보정되지 않은 자기보고 확신도는 케이스에 사람이 필요한지를 재지 않으며, 둘을 합쳐도 믿을 만한 신호가 되지 않습니다.

1. **오답** - 테스트 결과가 보여 주듯 분노는 케이스의 난이도와 무관합니다. 화난 고객의 사이즈 교환은 에이전트가 처리할 일이고, 감정 규칙은 정중한 고객의 정책 공백을 놓칩니다.
2. **오답** - 모델이 스스로 보고한 확신도는 실제 정확도와 대조해 보정하지 않은 숫자입니다. 정책 공백을 조용히 잘못 읽은 경우에도 높게 나올 수 있고, 표현이 낯선 일상 케이스에서는 낮게 나올 수 있습니다.
3. **오답** - 믿을 수 없는 대리지표 두 개를 AND로 묶어도 신뢰도는 생기지 않습니다. 정책 공백처럼 두 신호가 모두 놓치는 케이스는 계속 빠집니다.
4. **정답** - 세 트리거는 대화에서 직접 확인할 수 있습니다. 감정은 공식 고객지원 가이드처럼 대화 시작과 끝에서 측정해, 90%의 대화에서 유지·개선되는지를 보는 결과 지표로 쓰는 것이 맞습니다.

📚 근거: [Customer support agent](https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat) · [Ticket routing](https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing)

> "Use sentiment analysis tools to measure sentiment at the beginning and end of each conversation. Aim for maintained or improved sentiment in 90% of interactions."

---

## 문제 12
### **In production, a hotel-booking support agent searches by guest name and check-in city and gets back two reservations with different booking references. Logs show it picked the one with the most recent activity and discussed it with the wrong guest. Which system-prompt instruction fixes this?**

| 보기 | 설명 |
|------|------|
| 1. When a lookup returns several matches, continue with the record that has the most recent activity or the most complete profile, because that is usually the active customer. | |
| 2. When a lookup returns several matches, show the customer a summary of every matching record so they can point out which one is theirs. | |
| **3. When a lookup returns several matches, do not choose between them. Ask the customer for one more identifier, such as the booking reference or phone number, and continue only once exactly one record matches.** | |
| 4. When a lookup returns several matches, run more tool lookups before asking the customer anything, then continue with the first record those lookups return. | |

**정답: 3.**

**해설:**

> 📘 레슨 5.2 · 에스컬레이션 — Escalation triggers and ambiguity resolution for support agents

**📝 문제 번역**

운영 중인 호텔 예약 지원 에이전트가 투숙객 이름과 체크인 도시로 검색했더니, 예약 번호가 다른 예약 두 건이 나왔습니다. 로그를 보니 에이전트는 최근 활동이 가장 많은 건을 골라 엉뚱한 투숙객과 그 예약을 논의했습니다. 어떤 시스템 프롬프트 지시가 이를 고칩니까?

- **①** 조회 결과가 여러 건이면, 최근 활동이 있거나 프로필이 가장 완전한 기록으로 진행한다. 보통 그쪽이 활성 고객이기 때문이다.
- **②** 조회 결과가 여러 건이면, 일치하는 모든 기록의 요약을 고객에게 보여 주고 자기 것을 고르게 한다.
- **③** 조회 결과가 여러 건이면, 그중에서 고르지 않는다. 예약 번호나 전화번호 같은 식별자를 하나 더 요청하고, 정확히 한 건만 일치할 때 진행한다.
- **④** 조회 결과가 여러 건이면, 고객에게 묻기 전에 도구 조회를 더 돌리고 그 조회가 처음 반환한 기록으로 진행한다.

> **핵심:** 조회 결과가 여러 건이면 아직 고객을 찾지 못한 것이므로, 휴리스틱으로 고르지 말고 추가 식별자를 묻습니다.

1. **오답** - 최근 활동이나 프로필 완성도는 대화 중인 사람이 누구인지 알려 주지 않습니다. 바로 이 휴리스틱이 로그에 나온 사고를 냈습니다.
2. **오답** - 모든 기록을 요약해 보여 주면 다른 투숙객의 예약 정보를 노출합니다. 고객이 고르게 하더라도 개인정보 문제가 먼저 생깁니다.
3. **정답** - 에이전트는 이미 도구를 썼고, 남은 모호함은 고객만 풀 수 있습니다. 그대로 진행하면 엉뚱한 방향으로 갈 것이 분명한 경우라 질문하는 것이 맞으며, 정확히 한 건이 될 때까지 다른 작업은 보류합니다.
4. **오답** - 같은 정보로 조회를 더 돌려도 두 기록을 가려낼 근거는 생기지 않고, "처음 반환된 기록"을 고르는 것도 결국 휴리스틱 선택입니다.

📚 근거: [Claude Sonnet 5 system prompts](https://platform.claude.com/docs/en/release-notes/system-prompts/claude-sonnet-5) · [Claude Opus 4.7 system prompts](https://platform.claude.com/docs/en/release-notes/system-prompts/claude-opus-4-7)

> "Claude asks a clarifying question only when proceeding would clearly waste effort or go in an entirely wrong direction"

---

## 문제 13
### **An airline support agent searches for a passenger by name and flight route to check a baggage claim. The lookup tool returns three passenger records with the same name on that route, each with a different booking reference. What should the agent do?**

| 보기 | 설명 |
|------|------|
| **1. Ask the customer for one more identifier, such as a ticket number or phone number, then continue the claim review** | |
| 2. Open the record with the most recent departure date on the route, then continue the claim review | |
| 3. Open the record with the most complete profile, such as saved contact details, then continue the claim review | |
| 4. Combine the baggage details from the three records into one summary, then continue the claim review | |

**정답: 1.**

**해설:**

> 📘 레슨 5.2 · 에스컬레이션 — Escalation triggers and ambiguity resolution for support agents

**📝 문제 번역**

항공사 지원 에이전트가 수하물 클레임을 확인하려고 승객 이름과 비행 노선으로 검색합니다. 조회 도구가 그 노선에서 이름이 같은 승객 기록 세 건을 반환했고, 각각 예약 번호가 다릅니다. 에이전트는 무엇을 해야 합니까?

- **①** 항공권 번호나 전화번호 같은 식별자를 고객에게 하나 더 받은 뒤 클레임 검토를 이어 간다
- **②** 해당 노선에서 출발일이 가장 최근인 기록을 열고 클레임 검토를 이어 간다
- **③** 저장된 연락처처럼 프로필이 가장 완전한 기록을 열고 클레임 검토를 이어 간다
- **④** 세 기록의 수하물 정보를 하나의 요약으로 합친 뒤 클레임 검토를 이어 간다

> **핵심:** 동명 기록이 여럿이면 어느 것이 대화 상대의 것인지 조회 결과만으로 알 수 없으므로, 구별할 식별자를 먼저 받습니다.

1. **정답** - 세 승객이 이름과 노선을 공유하므로 조회 결과에는 어느 기록이 이 고객의 것인지 보여 주는 정보가 없습니다. 추가 식별자를 받아 한 건으로 확정한 뒤 클레임을 검토합니다. 질문 한 번의 비용이 잘못된 추측으로 생길 개인정보 사고보다 훨씬 작습니다.
2. **오답** - 세 승객 모두 같은 노선을 탔으므로 최근 출발일은 발신자가 누구인지와 무관합니다. 추측이 틀리면 다른 승객의 수하물 클레임을 열어 노출합니다.
3. **오답** - 프로필의 연락처가 얼마나 채워졌는지는 계정이 어떻게 만들어졌는지를 보여 줄 뿐, 그 계정이 발신자의 것인지는 보여 주지 않습니다. 여전히 세 명 중 하나를 찍는 것입니다.
4. **오답** - 세 기록 중 이 고객의 것은 하나뿐입니다. 합치면 다른 두 승객의 정보가 섞여 잘못된 클레임 요약이 만들어지고, 그들의 정보도 노출됩니다.

📚 근거: [Claude Opus 4.7 system prompts](https://platform.claude.com/docs/en/release-notes/system-prompts/claude-opus-4-7) · [Claude Sonnet 5 system prompts](https://platform.claude.com/docs/en/release-notes/system-prompts/claude-sonnet-5)

> "Claude only asks upfront when the request is genuinely unanswerable without the missing information"

---

## 문제 14
### **A research coordinator sends a patents subagent to search a patent database. The database refuses connections. The subagent retries twice and then returns only: "Patent search could not be completed." What does the coordinator have to decide its recovery from?**

| 보기 | 설명 |
|------|------|
| 1. The full transcript of the subagent, because subagents share the coordinator's conversation history | |
| **2. Only that final message, because it never sees the subagent's tool calls, retries or raw responses, so it can't tell what failed or what was already tried** | |
| 3. The tool_result blocks the subagent marked with is_error: true, because these appear in the coordinator's context automatically | |
| 4. The raw connection errors, because the SDK forwards them to the parent along with the subagent's final message | |

**정답: 2.**

**해설:**

> 📘 레슨 5.3 · 오류 전파 — Error propagation in multi-agent systems

**📝 문제 번역**

리서치 코디네이터가 특허 서브에이전트에게 특허 데이터베이스 검색을 맡깁니다. 데이터베이스가 연결을 거부하고, 서브에이전트는 두 번 재시도한 뒤 "Patent search could not be completed."만 반환합니다. 코디네이터는 무엇을 근거로 복구 방법을 정해야 합니까?

- **①** 서브에이전트의 전체 대화 기록. 서브에이전트는 코디네이터의 대화 이력을 공유하기 때문이다
- **②** 그 최종 메시지뿐. 코디네이터는 서브에이전트의 도구 호출·재시도·원본 응답을 보지 못하므로, 무엇이 실패했고 무엇을 이미 시도했는지 알 수 없다
- **③** 서브에이전트가 `is_error: true` 로 표시한 `tool_result` 블록. 이 블록은 코디네이터의 컨텍스트에 자동으로 나타나기 때문이다
- **④** 원본 연결 오류. SDK가 서브에이전트의 최종 메시지와 함께 이를 부모에게 전달하기 때문이다

> **핵심:** 서브에이전트의 중간 도구 호출과 결과는 서브에이전트 안에 머물고 최종 메시지만 부모에게 돌아오므로, 코디네이터는 보고받은 만큼만 압니다.

1. **오답** - fork가 아닌 서브에이전트는 자기 컨텍스트에서 따로 실행되며, 부모와 대화 이력을 공유하지 않습니다. 코디네이터가 서브에이전트의 기록 전체를 받는 경로도 없습니다.
2. **정답** - Agent SDK 문서대로 코디네이터가 받는 것은 최종 메시지뿐입니다. 그 메시지가 막연하면 재시도할지, 다른 소스로 돌릴지, 질문을 좁힐지, 공백으로 표시할지 고를 근거가 없습니다. 그래서 서브에이전트의 오류 보고를 구조화해야 합니다.
3. **오답** - `is_error` 는 도구 호출 한 번의 결과를 그 호출을 한 에이전트에게 오류로 알리는 플래그입니다. 서브에이전트 안에서 오간 `tool_result` 는 서브에이전트 컨텍스트에 남고 부모에게 자동으로 전달되지 않습니다.
4. **오답** - 서브에이전트가 도구로 받은 원본 연결 오류도 중간 결과라서 부모에게 넘어가지 않습니다. 부모가 알 수 있는 것은 서브에이전트가 최종 메시지에 쓴 내용입니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

> "intermediate tool calls and results stay inside the subagent; only its final message returns to the parent."

---

## 문제 15
### **In a four-source research pipeline, the patent database sometimes rejects credentials while the other sources keep working. How should the coordinator's synthesis output schema handle each topic so the final report stays trustworthy?**

| 보기 | 설명 |
|------|------|
| 1. Require at least one finding for every topic, so no section of the report is ever left empty | |
| 2. Leave out any topic whose source failed, so the report contains only material that was actually retrieved | |
| **3. Give each topic a support level and an optional gap note that names the unavailable source, the reason it failed and what was tried** | |
| 4. Keep the schema to findings only, and write source failures to a separate operator log so the report stays clean | |

**정답: 3.**

**해설:**

> 📘 레슨 5.3 · 오류 전파 — Error propagation in multi-agent systems

**📝 문제 번역**

소스 네 개를 쓰는 리서치 파이프라인에서 특허 데이터베이스가 가끔 자격 증명을 거부하고, 나머지 소스는 정상 동작합니다. 최종 보고서를 신뢰할 수 있게 유지하려면, 코디네이터의 종합 출력 스키마가 각 주제를 어떻게 다뤄야 합니까?

- **①** 모든 주제에 발견을 최소 하나씩 요구해, 보고서의 어느 섹션도 비지 않게 한다
- **②** 소스가 실패한 주제는 빼서, 보고서에 실제로 가져온 자료만 남긴다
- **③** 주제마다 근거 수준(support level)과, 접근 불가 소스·실패 이유·시도한 내용을 적는 선택적 공백 메모를 둔다
- **④** 스키마는 발견만 담고, 소스 실패는 별도 운영 로그에 기록해 보고서를 깔끔하게 유지한다

> **핵심:** 출력 형식에 처음부터 공백을 적을 자리를 두어야, 빠진 소스가 숨은 구멍이 아니라 채워진 필드로 드러납니다.

1. **오답** - 모든 주제에 발견을 강제하면 소스가 없는 주제를 모델이 약한 자료로 채우게 됩니다. 공백을 표시하는 대신 근거 없는 내용이 들어갑니다.
2. **오답** - 주제를 빼면 독자 입장에서는 "검색했는데 아무것도 없었다"와 구분되지 않습니다. 실패가 조용히 사라집니다.
3. **정답** - 주제별 근거 수준은 결론을 얼마나 믿을지 알려 주고, 선택적 공백 메모는 어떤 소스가 왜 빠졌고 무엇을 시도했는지 남깁니다. Agent SDK 구조화 출력 문서도 작업이 스키마가 요구하는 정보를 다 갖지 못할 수 있으면 그 필드를 선택(optional)으로 두라고 합니다.
4. **오답** - 별도 로그는 운영자의 디버깅에는 쓸모 있지만 보고서 독자는 그 공백을 볼 수 없습니다. 보고서는 완전해 보이지만 실제로는 그렇지 않습니다.

📚 근거: [Get structured output from agents](https://code.claude.com/docs/en/agent-sdk/structured-outputs)

> "Match schema to task. If the task might not have all the information your schema requires, make those fields optional."

---

## 문제 16
### **A filings subagent's database times out partway through its work. You are designing the final message it returns. Which payload best lets the coordinator choose how to recover?**

| 보기 | 설명 |
|------|------|
| 1. {"status": "UNAVAILABLE"}, a fixed code the coordinator's logic can branch on reliably | |
| 2. An HTTP 503 code, the raw driver error message and a severity rating of "high" | |
| **3. Failure type "timeout (transient)", the exact query and the database it went to, the 40 of 200 filings already retrieved, and a read replica that could fill the gap** | |
| 4. A retry count of 3, start and end timestamps, the subagent ID, and a pointer to a log file holding the full details | |

**정답: 3.**

**해설:**

> 📘 레슨 5.3 · 오류 전파 — Error propagation in multi-agent systems

**📝 문제 번역**

공시 서브에이전트의 데이터베이스가 작업 도중 타임아웃됩니다. 서브에이전트가 반환할 최종 메시지를 설계하고 있습니다. 코디네이터가 복구 방법을 고르기에 가장 좋은 페이로드는?

- **①** `{"status": "UNAVAILABLE"}`. 코디네이터 로직이 안정적으로 분기할 수 있는 고정 코드
- **②** HTTP 503 코드, 드라이버의 원본 오류 메시지, "high" 심각도 등급
- **③** 실패 유형 "timeout (transient)", 정확한 질의와 그 질의를 보낸 데이터베이스, 이미 가져온 공시 200건 중 40건, 공백을 메울 수 있는 읽기 전용 복제본(read replica)
- **④** 재시도 횟수 3, 시작·종료 시각, 서브에이전트 ID, 전체 내용이 담긴 로그 파일 경로

> **핵심:** 코디네이터에게 필요한 것은 재시도가 의미 있는지, 무엇을 시도했는지, 무엇을 건졌는지, 다른 방법이 있는지의 네 가지입니다.

1. **오답** - 고정 코드는 분기하기 쉽지만 "search unavailable"을 대문자로 바꾼 것과 정보량이 같습니다. 분기할 수는 있어도 어느 분기로 가야 하는지 알려 주지 않습니다.
2. **오답** - 실패가 무엇이었는지는 설명하지만, 무엇을 시도했고 무엇을 건졌는지, 대안이 무엇인지가 없습니다.
3. **정답** - "일시적 타임아웃"이라는 유형은 재시도가 의미 있다는 신호이고, 질의와 대상 데이터베이스는 같은 실패 요청의 반복을 막으며, 40건은 버리지 않을 부분 결과이고, 복제본은 구체적인 대안입니다. 도구 정의 문서의 권고대로 다음 판단에 필요한 필드만 담았습니다.
4. **오답** - 재시도 횟수·시각·ID·로그 경로는 사람이 나중에 디버깅할 때 쓰는 모니터링 데이터입니다. 코디네이터가 지금 복구 방법을 고르는 데는 쓸 수 없습니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

> "include only the fields Claude needs to reason about its next step. Bloated responses waste context"

---

## 문제 17
### **A document-search subagent hits an authentication error against a knowledge base and simply returns the string 'search unavailable' to the coordinator. The coordinator has no other information to act on. What is the primary problem with this design, and what should replace it?**

| 보기 | 설명 |
|------|------|
| **1. The string omits why the search failed; return an error category, the attempted query, and the partial results gathered** | |
| 2. The string omits retry history; retry the search with backoff and return the final attempt count to the coordinator | |
| 3. The string is unstructured; return a fixed status code such as UNAVAILABLE so the coordinator can branch on it reliably | |
| 4. The string lacks audit detail; write the full auth error and query to the subagent log and keep the coordinator message short | |

**정답: 1.**

**해설:**

> 📘 레슨 5.3 · 오류 전파 — Error propagation in multi-agent systems

**📝 문제 번역**

문서 검색 서브에이전트가 지식 베이스에서 인증 오류를 만나, 코디네이터에게 'search unavailable'이라는 문자열만 돌려줍니다. 코디네이터에게는 판단할 다른 정보가 없습니다. 이 설계의 주된 문제는 무엇이고, 무엇으로 바꿔야 합니까?

- **①** 문자열에 실패 이유가 없다. 오류 범주, 시도한 질의, 모은 부분 결과를 반환한다
- **②** 문자열에 재시도 이력이 없다. 백오프를 두고 재시도하고 최종 시도 횟수를 코디네이터에 반환한다
- **③** 문자열이 비구조적이다. UNAVAILABLE 같은 고정 상태 코드를 반환해 코디네이터가 안정적으로 분기하게 한다
- **④** 문자열에 감사(audit) 정보가 없다. 전체 인증 오류와 질의는 서브에이전트 로그에 쓰고, 코디네이터 메시지는 짧게 유지한다

> **핵심:** 일반 상태 문자열은 실패 원인·시도 내용·부분 결과를 숨겨, 코디네이터가 복구 경로를 고를 수 없게 만듭니다.

1. **정답** - 'search unavailable'만으로는 왜 실패했는지, 무엇을 시도했는지, 이미 무엇을 찾았는지 알 수 없습니다. 코디네이터는 이 정보로 재시도, 다른 소스로의 우회, 부분 커버리지로 계속 진행 중 하나를 고릅니다. 공식 문서도 "failed" 같은 일반 오류 대신 무엇이 잘못됐고 다음에 무엇을 시도할지 담은 메시지를 쓰라고 권합니다.
2. **오답** - 인증 오류는 지속되는 상태라 백오프 재시도로 풀리지 않습니다. 시도 횟수도 원인·질의·부분 결과를 알려 주지 않으므로 코디네이터는 여전히 복구 경로를 고를 수 없습니다.
3. **오답** - 고정 코드는 분기하기 쉬울 뿐 현재 문자열보다 정보가 많지 않습니다. 인증 실패와 다른 장애를 구분하지 못하고, 질의 맥락이나 부분 결과도 없습니다.
4. **오답** - 로그는 나중의 디버깅에는 도움이 되지만 코디네이터는 그것을 보지 못합니다. 코디네이터가 받는 메시지는 여전히 짧고 쓸모가 없으며, 이것이 바로 설명된 실패입니다.

📚 근거: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

---

## 문제 18
### **A team is designing the error payload that subagents return to a coordinator when a tool call fails. Which set of fields best supports intelligent coordinator recovery decisions?**

| 보기 | 설명 |
|------|------|
| **1. Failure category, the attempted action, partial results gathered, and suggested alternative approaches** | |
| 2. Numeric error code, the raw error message, the tool name, and a severity rating for the failed call | |
| 3. Retry count, call timestamp, elapsed time, and the identifier of the subagent that ran the failed task | |
| 4. The subagent's full reasoning trace, raw tool output, log excerpts, and a summary of its final message | |

**정답: 1.**

**해설:**

> 📘 레슨 5.3 · 오류 전파 — Error propagation in multi-agent systems

**📝 문제 번역**

도구 호출이 실패했을 때 서브에이전트가 코디네이터에 반환할 오류 페이로드를 설계하고 있습니다. 코디네이터가 지능적으로 복구 결정을 내리는 데 가장 좋은 필드 조합은?

- **①** 실패 범주, 시도한 작업, 모은 부분 결과, 제안하는 대안 접근법
- **②** 숫자 오류 코드, 원본 오류 메시지, 도구 이름, 실패한 호출의 심각도 등급
- **③** 재시도 횟수, 호출 시각, 경과 시간, 실패한 작업을 실행한 서브에이전트 ID
- **④** 서브에이전트의 전체 추론 과정, 원본 도구 출력, 로그 발췌, 최종 메시지 요약

> **핵심:** 오류 보고는 "무엇이 깨졌나"가 아니라 "코디네이터가 다음에 무엇을 할 수 있나"를 알려 주도록 설계합니다.

1. **정답** - 실패 범주는 재시도가 통할지를, 시도한 작업은 같은 요청의 반복 여부를, 부분 결과는 재사용할 자료를, 대안은 다른 경로를 알려 줍니다. 모두 구조화된 필드라 코디네이터가 재시도·재사용·우회 중에서 고를 수 있습니다.
2. **오답** - 무엇이 고장 났는지는 설명하지만 재사용할 부분 결과도, 고를 대안도 없습니다. 코디네이터는 재시도하거나 포기하는 것밖에 할 수 없습니다.
3. **오답** - 횟수·시각·ID는 장부용 메타데이터입니다. 왜 실패했는지, 무엇을 시도했고 무엇을 모았는지 말해 주지 않으므로 재시도·조정·에스컬레이션 중 무엇을 할지 정할 수 없습니다.
4. **오답** - 추론 과정·원본 출력·로그는 비구조적이고 장황해, 코디네이터가 자유 텍스트를 해석해 실패 유형과 건질 것을 추려야 합니다. 컨텍스트 격리의 이점도 사라지고, 대안은 여전히 없습니다.

📚 근거: [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "Claude reads the error and can retry with corrected input, ask the user for clarification, or explain the limitation."

---

## 문제 19
### **A regulatory-filings subagent cannot reach its data provider because the provider's API key expired. Instead of surfacing the failure, the subagent returns an empty findings list with status 'success' so the pipeline continues cleanly. The coordinator later synthesizes a report claiming full regulatory coverage. What went wrong?**

| 보기 | 설명 |
|------|------|
| **1. The subagent returned a completed result for a request it could not make, so the coordinator never learned the source was unavailable** | |
| 2. The subagent stopped retrying the provider too early, so the coordinator never received data a longer retry window would have fetched | |
| 3. The coordinator accepted the subagent's output without a validation pass, so the empty findings list was never checked against the provider | |
| 4. The subagent kept the pipeline running past a credential error, so the other subagents produced results that should have been discarded | |

**정답: 1.**

**해설:**

> 📘 레슨 5.3 · 오류 전파 — Error propagation in multi-agent systems

**📝 문제 번역**

규제 공시 서브에이전트가 공급사 API 키 만료로 데이터 공급사에 접근하지 못합니다. 서브에이전트는 실패를 드러내는 대신, 파이프라인이 매끄럽게 이어지도록 빈 발견 목록과 'success' 상태를 반환합니다. 코디네이터는 나중에 규제 영역을 빠짐없이 다뤘다고 주장하는 보고서를 씁니다. 무엇이 잘못됐습니까?

- **①** 서브에이전트가 수행하지 못한 요청에 대해 완료된 결과를 반환해, 코디네이터는 소스를 쓸 수 없었다는 사실을 알지 못했다
- **②** 서브에이전트가 공급사 재시도를 너무 일찍 멈춰, 더 긴 재시도 구간이었다면 받았을 데이터를 코디네이터가 받지 못했다
- **③** 코디네이터가 검증 단계 없이 서브에이전트 출력을 받아들여, 빈 발견 목록을 공급사와 대조하지 않았다
- **④** 서브에이전트가 자격 증명 오류 뒤에도 파이프라인을 계속 돌려, 다른 서브에이전트들이 버려야 할 결과를 만들었다

> **핵심:** 접근 실패를 빈 성공으로 보고하면(조용한 삼킴) 커버리지 공백이 "확인했지만 없음"이라는 거짓 증거로 바뀝니다.

1. **정답** - 서브에이전트는 공급사에 접근하지 못했는데 호출을 발견 없는 성공으로 보고했습니다. 접근 실패가 코디네이터에게서 숨겨졌고, 코디네이터는 커버리지가 불완전하다는 신호가 없어 전체 커버리지를 주장했습니다. 실패는 `is_error` 와 실패 유형을 담은 오류로 보고해야 합니다.
2. **오답** - 만료된 API 키는 재시도로 고칠 수 없습니다. 자격 증명을 갱신하기 전까지 모든 시도가 같은 이유로 실패하므로, 진짜 결함은 실패를 성공으로 보고한 것입니다.
3. **오답** - 'success'로 표시된 빈 목록은 일반적인 검증으로 진짜 0건과 구별할 수 없습니다. 그 차이가 보였던 유일한 지점은 호출이 실패한 서브에이전트 내부입니다.
4. **오답** - 만료된 키는 다른 서브에이전트의 결과와 무관하며 그 결과는 여전히 유효합니다. 버리는 것은 해결책이 아니라 반대 방향의 안티패턴(전체 중단)입니다.

📚 근거: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

> "is_error (optional): Set to true if the tool execution resulted in an error."

---

## 문제 20
### **Your news subagent gets an overloaded error from its search provider on the first call. After a second query works, the next call returns authentication_failed. It already holds 12 articles. Which retry policy should it follow?**

| 보기 | 설명 |
|------|------|
| 1. Send each failure to the coordinator as it happens, because the coordinator decides every recovery | |
| 2. Retry both failures with exponential backoff until they succeed, so the coordinator never has to deal with an error | |
| **3. Retry the overloaded error a limited number of times locally. Report the authentication failure to the coordinator right away, with the attempts made, the 12 articles and possible alternatives** | |
| 4. Retry both failures a few times with backoff, then send the coordinator the total retry count so it knows how much effort was spent | |

**정답: 3.**

**해설:**

> 📘 레슨 5.3 · 오류 전파 — Error propagation in multi-agent systems

**📝 문제 번역**

뉴스 서브에이전트가 첫 호출에서 검색 공급사의 overloaded 오류를 받습니다. 두 번째 질의는 성공했지만, 다음 호출이 `authentication_failed` 를 반환합니다. 이미 기사 12건을 확보했습니다. 어떤 재시도 정책을 따라야 합니까?

- **①** 실패가 생길 때마다 코디네이터에 보낸다. 모든 복구는 코디네이터가 결정하기 때문이다
- **②** 두 실패 모두 성공할 때까지 지수 백오프로 재시도해, 코디네이터가 오류를 다룰 일이 없게 한다
- **③** overloaded 오류는 로컬에서 제한된 횟수만 재시도한다. 인증 실패는 시도 내역, 12건의 기사, 가능한 대안과 함께 즉시 코디네이터에 보고한다
- **④** 두 실패 모두 백오프로 몇 번 재시도한 뒤, 총 재시도 횟수를 코디네이터에 보내 얼마나 노력했는지 알린다

> **핵심:** 일시적 실패는 서브에이전트가 제한된 재시도로 스스로 복구하고, 재시도로 풀리지 않는 실패는 맥락과 함께 바로 올립니다.

1. **오답** - 짧게 지나가는 과부하까지 모두 올리면 저절로 풀렸을 문제로 코디네이터의 컨텍스트를 채웁니다. 일시적 실패는 질의와 부분 결과를 가진 서브에이전트가 싸게 재시도하는 편이 낫습니다.
2. **오답** - 기다린다고 자격 증명이 고쳐지지 않으므로 인증 실패는 아무리 재시도해도 성공하지 않고, 코디네이터에게 필요한 보고만 늦어집니다. 재시도에는 상한이 있어야 합니다.
3. **정답** - Agent SDK의 오류 값 설명을 보면 `overloaded` 는 서버 용량 부족(529)이라 잠시 뒤 풀리는 경우가 많고, `authentication_failed` 는 재시도로 풀리지 않는 실패입니다. 보고에 시도 내역, 확보한 12건, 대안을 담아야 코디네이터가 다음 행동을 고를 수 있습니다.
4. **오답** - 인증 실패에 백오프는 의미가 없고, 재시도 횟수는 들인 노력만 보여 줄 뿐 코디네이터가 다음에 할 일을 알려 주지 않습니다.

📚 근거: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [Agent SDK TypeScript reference](https://code.claude.com/docs/en/agent-sdk/typescript)

> "If a tool request is invalid or missing parameters, Claude will retry 2-3 times with corrections before apologizing to the user."

---

## 문제 21
### **Phase-2 subagents, each tracing a different refund-related flow, keep spending most of their tokens re-mapping the modules that phase 1 already mapped. Their module maps also differ slightly from one another. What should the coordinator change before spawning them?**

| 보기 | 설명 |
|------|------|
| 1. Nothing in the prompts: non-fork subagents inherit the coordinator's conversation, so a better-worded task question is enough | |
| 2. Paste every phase-1 subagent's full report verbatim into each phase-2 prompt so that no detail is lost | |
| **3. Condense what phase 1 established into a short summary and put it at the top of each phase-2 subagent's prompt** | |
| 4. Run /compact in the coordinator before spawning, so the phase-1 findings are kept in a summary the subagents can draw on | |

**정답: 3.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

2단계 서브에이전트들은 각자 다른 환불 관련 흐름을 추적하는데, 1단계에서 이미 파악한 모듈 구조를 다시 매핑하느라 토큰 대부분을 씁니다. 서로 만든 모듈 지도도 조금씩 다릅니다. 코디네이터는 서브에이전트를 띄우기 전에 무엇을 바꿔야 합니까?

- **①** 프롬프트는 그대로 둔다. fork가 아닌 서브에이전트는 코디네이터의 대화를 상속하므로, 작업 질문만 더 잘 다듬으면 된다
- **②** 1단계 서브에이전트의 전체 보고서를 2단계 프롬프트마다 그대로 붙여 넣어, 세부를 하나도 잃지 않게 한다
- **③** 1단계에서 확정한 내용을 짧게 요약해, 각 2단계 서브에이전트 프롬프트 맨 앞에 넣는다
- **④** 띄우기 전에 코디네이터에서 /compact를 실행해, 1단계 발견을 서브에이전트가 참고할 요약으로 남긴다

> **핵심:** fork가 아닌 서브에이전트는 넘겨받은 프롬프트만 가진 새 컨텍스트로 시작하므로, 이전 단계의 지식은 위임 프롬프트에 직접 써 넣어야 합니다.

1. **오답** - 사실과 반대입니다. Claude Code 문서는 일반 서브에이전트의 컨텍스트를 "넘겨준 프롬프트만 있는 새 컨텍스트"로 설명하며, 부모 대화 전체를 이어받는 것은 fork뿐입니다.
2. **오답** - 전체 보고서를 붙이면 2단계 서브에이전트가 처음부터 붐비는 컨텍스트로 시작합니다. 위임으로 피하려던 문제를 다시 만드는 셈입니다.
3. **정답** - 짧은 요약은 모든 서브에이전트에게 같은 사실(이름, 관계, 열린 질문)을 주면서 새 질문에 쓸 공간을 남깁니다. 모두 같은 출발점에서 시작하므로 모듈 지도가 서로 어긋나는 문제도 사라집니다.
4. **오답** - /compact는 코디네이터 자신의 컨텍스트만 줄입니다. 서브에이전트가 받는 것은 여전히 위임 프롬프트뿐이므로 1단계 지식은 전달되지 않습니다.

📚 근거: [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

> "Fresh context with the prompt you pass"

---

## 문제 22
### **An agent has spent hours exploring a large repository. When asked about a class it examined in detail early on, it now describes what such a class typically looks like, and its two latest answers about that component disagree. Which response deals with the cause?**

| 보기 | 설명 |
|------|------|
| 1. Switch the session to a larger, more capable model so it can recall the earlier findings | |
| 2. Raise the output-token limit so the agent has room to give complete, consistent answers | |
| 3. Have the agent re-read the whole repository so the class details are fresh in its context again | |
| **4. Limit what verbose exploration output enters the main context, and keep key findings somewhere that does not rely on recall from the long transcript** | |

**정답: 4.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

에이전트가 큰 저장소를 몇 시간째 탐색했습니다. 초반에 자세히 살펴본 클래스에 대해 물으면, 이제는 그런 클래스가 보통 어떻게 생겼는지를 설명하고, 같은 컴포넌트에 대한 최근 두 답이 서로 어긋납니다. 원인을 다루는 대응은?

- **①** 세션을 더 크고 성능 좋은 모델로 바꿔 이전 발견을 기억하게 한다
- **②** 출력 토큰 한도를 올려, 완전하고 일관된 답을 쓸 여유를 준다
- **③** 저장소 전체를 다시 읽게 해, 클래스 세부가 컨텍스트에 다시 새로 들어오게 한다
- **④** 장황한 탐색 출력이 메인 컨텍스트에 들어오는 것을 제한하고, 핵심 발견은 긴 대화 기록에서의 회상에 기대지 않는 곳에 보관한다

> **핵심:** 컨텍스트가 찰수록 회상이 떨어지는 context rot은 모든 모델에서 나타나므로, 들어오는 것을 통제하고 발견은 대화 밖에 둡니다.

1. **오답** - Anthropic의 컨텍스트 엔지니어링 글은 정도의 차이만 있을 뿐 이 열화가 모든 모델에서 나타난다고 말합니다. 모델을 바꿔도 긴 기록에 묻힌 발견을 회상하는 문제는 남습니다.
2. **오답** - 출력 한도는 응답 길이의 상한일 뿐, 입력에서 무엇을 기억해 내는지와 무관합니다.
3. **오답** - 저장소를 다시 읽으면 컨텍스트가 다시 넘쳐 같은 문제를 되풀이합니다.
4. **정답** - 장황한 탐색은 서브에이전트에 맡겨 메인 컨텍스트를 가볍게 하고, 확정한 사실은 스크래치패드 파일 같은 곳에 적어 두면 회상 저하가 답을 좌우하지 않습니다. 원인(컨텍스트에 쌓인 토큰)과 결과(회상 저하)를 모두 다루는 유일한 보기입니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

> "While some models exhibit more gentle degradation than others, this characteristic emerges across all models."

---

## 문제 23
### **Mid-way through a long exploration session, four tasks come up. Which one should stay in the main conversation instead of going to a subagent?**

| 보기 | 설명 |
|------|------|
| 1. Build a complete inventory of every test file in the repository and return the paths as one list | |
| 2. Trace the refund flow's dependencies across modules and report the call chain | |
| **3. Find the single function that computes the discount rate in a small module, just before making one edit to it** | |
| 4. Scan every module for calls to a deprecated logging API and report the affected files | |

**정답: 3.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

긴 탐색 세션 중간에 네 가지 작업이 생겼습니다. 서브에이전트에 넘기지 말고 메인 대화에 남겨야 할 것은?

- **①** 저장소의 모든 테스트 파일 목록을 만들어 경로를 하나의 목록으로 반환한다
- **②** 모듈 사이의 환불 흐름 의존 관계를 추적해 호출 체인을 보고한다
- **③** 작은 모듈에서 할인율을 계산하는 함수 하나를 찾는다. 바로 그 함수를 한 번 수정할 참이다
- **④** 모든 모듈에서 폐기 예정 로깅 API 호출을 찾아 영향받는 파일을 보고한다

> **핵심:** 서브에이전트는 장황한 출력을 짧은 답으로 압축할 수 있는 작업에 쓰고, 빠르고 국소적인 수정은 메인 대화에서 직접 합니다.

1. **오답** - 수천 개의 경로가 나올 수 있는 장황한 작업이지만 결과는 목록 하나로 압축됩니다. 서브에이전트에 맡기기 좋은 전형적인 탐색입니다.
2. **오답** - 여러 모듈을 읽어야 하는 독립 조사이고, 결과는 호출 체인 보고로 압축됩니다. 서브에이전트에 맡길 작업입니다.
3. **정답** - 작은 모듈에서 함수 하나를 찾는 일은 Grep이나 Read 한 번이면 끝나는 국소 작업입니다. fork가 아닌 서브에이전트는 새 컨텍스트로 시작해 맥락을 다시 모아야 하므로 오히려 느리고, Claude Code 문서도 빠르고 국소적인 변경이나 지연이 중요할 때는 메인 대화를 권합니다.
4. **오답** - 모든 모듈을 훑는 검색이라 출력이 많지만 결과는 영향받는 파일 목록으로 줄어듭니다. 서브에이전트에 맡길 작업입니다.

📚 근거: [Create custom subagents](https://code.claude.com/docs/en/sub-agents)

> "Latency matters. A subagent that isn’t a fork starts fresh and may need time to gather context"

---

## 문제 24
### **A main agent is coordinating exploration of a repository with over 50,000 files and needs a complete list of every test file before planning a coverage audit. Running the search directly would flood the main conversation with thousands of matched paths it will not need again. What best keeps the main agent's context focused on high-level coordination while still producing the list?**

| 보기 | 설명 |
|------|------|
| 1. Run the search in the main agent with the output capped at the first 200 matches, and treat that capped set as the test file inventory. | |
| **2. Run the search in a subagent that scans the repository and returns only the matching test file paths as one consolidated list.** | |
| 3. Run the search in the main agent one top-level directory at a time, and note each batch of matched paths before starting the next. | |
| 4. Run the search in the main agent, then compact the conversation once the paths are back and keep a summary of the test files. | |

**정답: 2.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

메인 에이전트가 파일 5만 개가 넘는 저장소의 탐색을 조율하고 있으며, 커버리지 감사를 계획하기 전에 모든 테스트 파일의 전체 목록이 필요합니다. 검색을 직접 실행하면 다시 볼 일 없는 수천 개의 일치 경로가 메인 대화에 쏟아집니다. 목록을 얻으면서도 메인 에이전트의 컨텍스트를 상위 수준 조율에 집중시키는 가장 좋은 방법은?

- **①** 메인 에이전트에서 출력을 처음 200개로 제한해 검색하고, 그 집합을 테스트 파일 목록으로 쓴다.
- **②** 저장소를 훑어 일치하는 테스트 파일 경로만 하나의 통합 목록으로 반환하는 서브에이전트에서 검색한다.
- **③** 메인 에이전트에서 최상위 디렉터리별로 하나씩 검색하고, 다음 디렉터리로 가기 전에 각 묶음의 경로를 기록한다.
- **④** 메인 에이전트에서 검색한 뒤, 경로가 돌아오면 대화를 compact하고 테스트 파일 요약을 남긴다.

> **핵심:** 장황한 검색은 서브에이전트의 별도 컨텍스트에서 돌리고, 메인 에이전트는 최종 결과만 받습니다.

1. **오답** - 5만 개가 넘는 파일 저장소에서 처음 200개만 남기면 목록은 거의 확실히 불완전합니다. 커버리지 감사에는 모든 테스트 파일이 필요합니다.
2. **정답** - 서브에이전트는 자기 컨텍스트 창에서 검색하므로 수천 개의 경로가 메인 대화에 들어오지 않습니다. 메인은 완성된 목록만 받아 감사 조율에 컨텍스트를 씁니다. Claude Code의 내장 Explore 서브에이전트(Write·Edit가 거부된 읽기 전용)가 바로 이런 파일 탐색용입니다.
3. **오답** - 디렉터리별로 나눠도 결국 모든 경로가 메인 에이전트로 돌아오고, 기록하면서 메인 대화에 전체 목록이 쌓입니다. 홍수를 피한 것이 아니라 나눠 받은 것입니다.
4. **오답** - compaction은 경로가 이미 메인 대화를 채운 뒤에 돌므로 홍수를 막지 못합니다. 요약 과정에서 개별 경로가 빠질 수도 있어, 감사에 필요한 완전한 목록이 위태로워집니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents)

> "intermediate tool calls and results stay inside the subagent; only its final message returns to the parent."

---

## 문제 25
### **During a multi-hour exploration, the agent wrote to NOTES.md that OrderService extends TransactionalBase and has a distinctive retry mechanism. Hours later, asked about OrderService, it describes a generic service class and does not mention TransactionalBase. The notes file is still on disk and correct. What change fixes this?**

| 보기 | 설명 |
|------|------|
| 1. Have the agent record more detail in NOTES.md, such as the full source of OrderService, so the finding is harder to lose | |
| **2. Have the agent read NOTES.md before it answers any question that depends on an earlier finding** | |
| 3. Run /compact focused on OrderService so the summary keeps the class details in the main context | |
| 4. Move the session to a larger model so it can recall the details from earlier in the transcript | |

**정답: 2.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

몇 시간짜리 탐색 중에 에이전트는 NOTES.md에 OrderService가 TransactionalBase를 상속하며 독특한 재시도 메커니즘이 있다고 적었습니다. 몇 시간 뒤 OrderService에 대해 묻자, 에이전트는 일반적인 서비스 클래스를 설명하고 TransactionalBase는 언급하지 않습니다. 노트 파일은 디스크에 그대로 있고 내용도 맞습니다. 무엇을 바꿔야 합니까?

- **①** OrderService의 전체 소스처럼 더 많은 세부를 NOTES.md에 기록하게 해, 발견을 잃기 어렵게 한다
- **②** 이전 발견에 의존하는 질문에 답하기 전에 NOTES.md를 읽게 한다
- **③** OrderService에 초점을 맞춘 /compact를 실행해, 요약이 메인 컨텍스트에 클래스 세부를 유지하게 한다
- **④** 세션을 더 큰 모델로 옮겨, 대화 기록 초반의 세부를 기억하게 한다

> **핵심:** 스크래치패드는 기록하기와 다시 읽기가 모두 일어날 때만 효과가 있습니다.

1. **오답** - 노트는 이미 정확합니다. 문제는 기록의 양이 아니라 답할 때 노트를 읽지 않는 것이며, 전체 소스를 적으면 노트만 비대해집니다.
2. **정답** - 쓰기만 하고 읽지 않으면 답은 여전히 긴 대화 기록에서의 회상에 기대고, 바로 그 회상이 저하됐습니다. 에이전트 지시에 "이전 발견에 기대는 질문에는 먼저 노트를 확인하라"는 규칙을 명시합니다. Claude Code가 compaction 뒤 다시 읽는 파일은 최근 수정 순 최대 다섯 개라서, 스크래치패드가 그 안에 든다는 보장도 없습니다.
3. **오답** - 초점을 준 compact는 요약에 남길 것을 고르게 해 주지만, 요약은 여전히 손실 압축입니다. 정확한 사실을 지키는 역할은 디스크의 노트가 맡아야 합니다.
4. **오답** - context rot은 모든 모델에서 나타나므로 모델을 바꿔도 긴 기록 속 회상 문제는 그대로입니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Explore the context window](https://code.claude.com/docs/en/context-window)

> "the agent regularly writes notes persisted to memory outside of the context window. These notes get pulled back into the context window at later times."

---

## 문제 26
### **Several subagents are running concurrently, each investigating a different module of a large codebase and recording findings as they go. The architect must prevent one subagent's findings from being overwritten by another before the coordinator can reliably aggregate the results. Which scratchpad convention best achieves this?**

| 보기 | 설명 |
|------|------|
| **1. Give each subagent its own uniquely named scratchpad file, e.g., one per module, and have the coordinator aggregate all files only after all subagents have finished their investigations.** | |
| 2. Have all subagents write their findings to one single shared scratchpad file at the same time as they each discover them. | |
| 3. Skip scratchpad files entirely and have each subagent only report findings verbally in its final response. | |
| 4. Have every subagent overwrite the same fixed scratchpad filename each time it records a newly discovered finding. | |

**정답: 1.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

여러 서브에이전트가 동시에 실행되며, 각자 큰 코드베이스의 서로 다른 모듈을 조사하면서 발견을 기록합니다. 코디네이터가 결과를 안정적으로 모으기 전에 한 서브에이전트의 발견이 다른 서브에이전트에 의해 덮어써지는 일을 막아야 합니다. 어떤 스크래치패드 규칙이 가장 적합합니까?

- **①** 서브에이전트마다 모듈별 파일처럼 고유한 이름의 스크래치패드를 주고, 모든 서브에이전트가 조사를 마친 뒤에만 코디네이터가 모든 파일을 모은다.
- **②** 모든 서브에이전트가 발견하는 즉시, 하나의 공유 스크래치패드 파일에 동시에 쓴다.
- **③** 스크래치패드 파일을 쓰지 않고, 각 서브에이전트가 최종 응답에서 말로만 발견을 보고한다.
- **④** 모든 서브에이전트가 새 발견을 기록할 때마다 같은 고정 스크래치패드 파일명을 덮어쓴다.

> **핵심:** 병렬 서브에이전트는 "에이전트당 파일 하나" 규칙으로 출력을 격리하고, 코디네이터는 모두 끝난 뒤에 합칩니다.

1. **정답** - 각자 고유한 파일에 쓰면 동시 쓰기가 서로 간섭하지 않습니다. 서브에이전트들은 격리된 컨텍스트에서 동시에 돌아 서로의 작업을 볼 수 없으므로, 모두 끝난 뒤 코디네이터가 합치는 것이 경쟁 조건을 피하고 데이터 무결성을 지키는 방법입니다.
2. **오답** - 하나의 공유 파일에 동시에 쓰면 경쟁 조건이 생겨, 코디네이터가 읽기 전에 데이터가 사라지거나 깨질 수 있습니다.
3. **오답** - 최종 응답에만 기대면 서브에이전트가 중간에 끊기거나 세션이 넘어갈 때 디스크에 아무것도 남지 않습니다. 컨텍스트 경계를 넘어 발견을 보존하는 수단이 사라집니다.
4. **오답** - 같은 고정 파일명을 덮어쓰면 마지막에 쓴 서브에이전트의 내용만 남습니다. 막으려던 덮어쓰기 문제를 그대로 일으킵니다.

📚 근거: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

> "multiple subagents can run concurrently, so independent subtasks finish in the time of the slowest one rather than the sum of all of them."

---

## 문제 27
### **An architect has been running a single Claude Code session for several hours exploring a large monorepo. Early on, the agent correctly identified that OrderService extends a custom TransactionalBase class with a distinctive retry mechanism. Hours later, asked about OrderService again, the agent describes it as 'typically extending a standard base controller with default error handling,' ignoring its earlier finding. What should the architect do going forward to prevent this?**

| 보기 | 설명 |
|------|------|
| **1. Have the agent save class names and base classes it discovers to a notes file, so it can read them before answering questions.** | |
| 2. Raise the session's maximum output token limit, so the agent can lay out each class hierarchy in full before answering questions. | |
| 3. Switch to a larger model mid-session, so it recalls the discoveries made earlier in the transcript more reliably when questioned. | |
| 4. Have the agent re-read the full repository from scratch when asked about a class it explored earlier, so it answers from fresh results. | |

**정답: 1.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

아키텍트가 큰 모노레포를 탐색하며 하나의 Claude Code 세션을 몇 시간째 돌리고 있습니다. 초반에 에이전트는 OrderService가 독특한 재시도 메커니즘을 가진 사용자 정의 TransactionalBase 클래스를 상속한다고 정확히 파악했습니다. 몇 시간 뒤 다시 묻자, 에이전트는 OrderService가 '보통 기본 에러 처리를 갖춘 표준 base controller를 상속한다'고 설명하며 이전 발견을 무시합니다. 앞으로 이를 막으려면 아키텍트는 무엇을 해야 합니까?

- **①** 발견한 클래스 이름과 상위 클래스를 노트 파일에 저장하게 해, 질문에 답하기 전에 읽을 수 있게 한다.
- **②** 세션의 최대 출력 토큰 한도를 올려, 답하기 전에 각 클래스 계층을 전부 펼쳐 쓸 수 있게 한다.
- **③** 세션 중간에 더 큰 모델로 바꿔, 질문받았을 때 대화 기록 초반의 발견을 더 잘 기억하게 한다.
- **④** 이전에 탐색한 클래스에 대해 물으면, 저장소 전체를 처음부터 다시 읽어 새 결과로 답하게 한다.

> **핵심:** 긴 세션에서 일반론으로 미끄러지는 것은 context rot이며, 구체적인 발견을 대화 밖 파일에 기록하고 답하기 전에 읽게 해서 막습니다.

1. **정답** - 클래스 이름과 상위 클래스 같은 구체적인 발견을 파일에 적으면 긴 대화 기록 밖에 오래 가는 기록이 생깁니다. 답하기 전에 그 기록을 확인하므로 이후 답이 실제로 찾은 내용에 묶입니다. 기록은 "재시도 로직이 좀 있음"처럼 흐릿하지 않게, 이름·경로·값처럼 원래 읽은 것을 대신할 만큼 구체적이어야 합니다.
2. **오답** - 출력 토큰 한도는 응답 길이만 제한합니다. 에이전트가 이전 발견을 놓친 이유는 답이 잘려서가 아니라 발견이 긴 세션 속에 묻혀서입니다.
3. **오답** - 더 큰 모델도 긴 세션 초반의 세부가 희석되는 문제를 겪습니다. 해결은 모델 크기가 아니라 컨텍스트 관리입니다.
4. **오답** - 큰 모노레포를 처음부터 다시 읽으면 몇 시간의 탐색을 반복하고, 컨텍스트에 자료를 더 쏟아부어 이전 발견을 더 희석합니다. 참고할 간결한 기록도 남지 않습니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

---

## 문제 28
### **You are designing the file a coordinator reads first on restart. It must show which exploration subagents have finished and where each one's findings are, and agents will update their own entries as they complete. Which design fits this lesson best?**

| 보기 | 설명 |
|------|------|
| 1. A Markdown checklist that every agent edits freely, ticking items and rewriting notes as it goes | |
| **2. A structured JSON manifest with one entry per agent, holding its status and the path to its own export file** | |
| 3. One shared log file that all concurrent subagents append their findings to as the findings arrive | |
| 4. No manifest: rely on the coordinator's auto-compaction summary to carry the run's status into the next session | |

**정답: 2.**

**해설:**

> 📘 레슨 5.4 · 대규모 코드베이스 — Managing context in large codebase exploration

**📝 문제 번역**

코디네이터가 재시작할 때 가장 먼저 읽을 파일을 설계하고 있습니다. 이 파일은 어떤 탐색 서브에이전트가 끝났고 각 결과가 어디 있는지 보여 줘야 하며, 에이전트들은 완료할 때 자기 항목을 갱신합니다. 이 레슨에 가장 맞는 설계는?

- **①** 모든 에이전트가 자유롭게 편집하며 항목에 체크하고 메모를 고쳐 쓰는 Markdown 체크리스트
- **②** 에이전트당 항목 하나에 상태와 자기 export 파일 경로를 담은 구조화된 JSON 매니페스트
- **③** 동시에 도는 모든 서브에이전트가 발견이 나올 때마다 덧붙이는 공유 로그 파일 하나
- **④** 매니페스트 없이, 코디네이터의 자동 compaction 요약이 실행 상태를 다음 세션으로 넘기게 한다

> **핵심:** 크래시 복구는 에이전트별 상태 export와, 그 위치·상태를 구조화해 적은 매니페스트로 설계합니다.

1. **오답** - Anthropic의 장기 실행 하네스 글은 모델이 Markdown 파일보다 JSON 파일을 부적절하게 바꾸거나 덮어쓸 가능성이 낮다고 설명합니다. 모두가 자유롭게 고치는 Markdown 체크리스트는 그만큼 깨지기 쉽습니다.
2. **정답** - 에이전트별 항목에 상태와 결과 파일 경로를 두면, 재시작한 코디네이터는 완료된 작업을 다시 돌리지 않고 결과를 불러와 남은 작업의 프롬프트에 주입할 수 있습니다. 한 파일이 실행 전체의 상태를 설명합니다.
3. **오답** - 공유 로그에 동시에 덧붙이면 에이전트당 파일 하나라는 규칙이 깨지고, 어떤 에이전트가 끝났는지 한눈에 읽기도 어렵습니다.
4. **오답** - compaction은 다음 세션에 늘 명확한 지시를 넘겨주지 못하고, 코디네이터가 크래시하면 그 대화 자체가 사라집니다.

📚 근거: [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

> "we landed on using JSON for this, as the model is less likely to inappropriately change or overwrite JSON files compared to Markdown files."

---

## 문제 29
### **A team has one labeled evaluation set covering three document types and has computed only an overall accuracy. They want to stop human review for one of the three types. What should they do first?**

| 보기 | 설명 |
|------|------|
| 1. Use the overall accuracy, because the labeled set already includes that document type | |
| 2. Collect a brand-new labeled dataset just for that type before looking at anything | |
| **3. Split the existing labeled results by document type and by field, and check that this type meets the bar on its own** | |
| 4. Lower the confidence threshold for that type so more of it is automated | |

**정답: 3.**

**해설:**

> 📘 레슨 5.5 · 사람 검토·신뢰도 — Human Review Routing and Confidence Calibration for Extraction

**📝 문제 번역**

팀에 문서 유형 세 가지를 포함한 라벨된 평가 세트가 하나 있고, 지금까지 전체 정확도만 계산했습니다. 세 유형 중 하나에 대해 사람 검토를 중단하려 합니다. 먼저 무엇을 해야 합니까?

- **①** 라벨 세트에 그 문서 유형이 이미 포함돼 있으니 전체 정확도를 쓴다
- **②** 다른 것을 보기 전에, 그 유형만을 위한 새 라벨 데이터셋을 수집한다
- **③** 기존 라벨 결과를 문서 유형별·필드별로 나눠, 그 유형이 단독으로 기준을 넘는지 확인한다
- **④** 그 유형의 신뢰도 임계값을 낮춰 더 많이 자동화한다

> **핵심:** 어떤 세그먼트의 사람 검토를 줄이기 전에, 그 세그먼트의 정확도를 따로 측정합니다.

1. **오답** - 전체 정확도는 흔한 유형과 필드가 지배하는 가중 평균이라, 비중이 작은 유형이 크게 틀려도 거의 움직이지 않습니다. 포함돼 있다는 것과 기준을 넘는다는 것은 다릅니다.
2. **오답** - 필요한 라벨 데이터는 이미 있습니다. 결과를 세그먼트별로 나눠 보지 않았을 뿐이며, 새 데이터 수집은 첫 단계가 아닙니다.
3. **정답** - 기존 결과를 문서 유형×필드로 나누는 것이 이 세그먼트가 일관되게 성능을 내는지 가장 직접적으로 확인하는 방법입니다. 평가 문서도 성공 기준에 드물거나 어려운 입력에서의 성능을 포함하라고 하고, 분류 쿡북은 전체 정확도뿐 아니라 어떤 범주가 어려운지까지 보라고 합니다.
4. **오답** - 성능을 확인하지 않은 채 임계값을 낮추면 검증되지 않은 자동화 범위만 넓어집니다.

📚 근거: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) · [Classification with Claude (cookbook)](https://platform.claude.com/cookbook/capabilities-classification-guide)

> "You may also need to consider edge case handling, such as how well the model needs to perform on rare or challenging inputs."

---

## 문제 30
### **An architect asks Claude to output a confidence score from 0 to 1 for each extracted field in a structured JSON response. Before using these scores to decide which fields skip human review, what step should the architect take to make the scores trustworthy for routing decisions?**

| 보기 | 설명 |
|------|------|
| 1. Add worked examples of well-scored fields to the prompt so the model's numbers follow a consistent scale, then choose the cut-off from a quick read of a few sample outputs. | |
| **2. Measure how often fields at each score level are actually right on a labeled validation set of past documents, then set the cut-off where observed accuracy meets the target.** | |
| 3. Run the extraction several separate times per document and average each field's numbers, then set the cut-off on the averaged value to damp random variation between runs. | |
| 4. Replace the 0-to-1 values with high, medium and low labels defined in the prompt, then let the fields labeled high skip review and send the rest to human reviewers. | |

**정답: 2.**

**해설:**

> 📘 레슨 5.5 · 사람 검토·신뢰도 — Human Review Routing and Confidence Calibration for Extraction

**📝 문제 번역**

아키텍트가 구조화된 JSON 응답에서 추출한 필드마다 0~1 신뢰도 점수를 내도록 Claude에게 요청합니다. 이 점수로 어떤 필드가 사람 검토를 건너뛸지 정하기 전에, 라우팅 결정에 믿고 쓸 수 있게 하려면 어떤 단계를 거쳐야 합니까?

- **①** 점수가 잘 매겨진 필드의 예시를 프롬프트에 넣어 숫자가 일관된 척도를 따르게 하고, 몇 개 샘플 출력을 훑어보고 기준값을 정한다.
- **②** 과거 문서의 라벨된 검증 세트에서 점수 구간별로 필드가 실제로 맞는 비율을 측정하고, 관측된 정확도가 목표를 넘는 지점에 기준값을 둔다.
- **③** 문서마다 추출을 여러 번 따로 돌려 필드별 숫자를 평균하고, 평균값에 기준값을 둬 실행 간 무작위 변동을 줄인다.
- **④** 0~1 값을 프롬프트에 정의한 high·medium·low 라벨로 바꾸고, high 필드는 검토를 건너뛰고 나머지는 사람 검토자에게 보낸다.

> **핵심:** 모델이 스스로 보고한 신뢰도는 라벨된 정답과 대조해 보정한 뒤에야 라우팅 임계값으로 쓸 수 있습니다.

1. **오답** - 예시는 숫자의 형식과 척도를 일관되게 만들 수 있지만, 일관성은 그 점수가 얼마나 자주 맞는지와 무관합니다. 몇 개 출력을 훑어보는 것으로는 검증된 정답과 한 번도 비교하지 않은 것입니다.
2. **정답** - 라벨된 검증 세트에서 점수 구간별 실제 정확도를 재면 점수가 무엇을 뜻하는지 알게 되고, 허용 오류율을 만족하는 지점에 임계값을 둘 수 있습니다. 필드마다 곡선이 다를 수 있으므로 필드별 임계값이 필요할 수 있고, 프롬프트·모델·문서 구성이 바뀌면 다시 보정합니다.
3. **오답** - 평균은 실행 간 무작위 변동을 줄일 뿐, 점수가 실제 오류율과 맞는지 보여 주지 않습니다. 모델이 일관되게 잘못 읽는 필드는 평균해도 일관되게 높은 점수를 받고, 추출 비용만 여러 배가 됩니다.
4. **오답** - 라벨로 바꾸면 형식만 달라지고 신뢰성은 그대로입니다. high가 허용 가능한 비율로 맞는다는 증거가 없으니 같은 미검증 자기평가에 기대는 것입니다.

📚 근거: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) · [Classification with Claude (cookbook)](https://platform.claude.com/cookbook/capabilities-classification-guide)

---

## 문제 31
### **A logistics company's bill-of-lading extraction pipeline shows 94% field accuracy in aggregate. A new architect discovers that the 'weight' field is correct only 70% of the time specifically when the source document's units are ambiguous (for example, a number with no unit label present). All other conditions for the weight field exceed 95%. What review policy should be applied to the weight field going forward?**

| 보기 | 설명 |
|------|------|
| **1. Send weight values to a human reviewer when the document gives no clear unit, and let weights with a clearly stated unit continue to the output without review.** | |
| 2. Review a fixed random sample of weight values across the whole pipeline, sized to the overall 94% accuracy, and treat documents with missing units like the rest. | |
| 3. Move weight extraction to manual entry by staff for the full set of bills of lading, and stop using the model for that field whether or not a unit is given. | |
| 4. Add a prompt rule that assigns the most common unit from past documents to a bare weight number, and release those values to the output without a reviewer. | |

**정답: 1.**

**해설:**

> 📘 레슨 5.5 · 사람 검토·신뢰도 — Human Review Routing and Confidence Calibration for Extraction

**📝 문제 번역**

물류 회사의 선하증권(bill of lading) 추출 파이프라인은 전체 필드 정확도가 94%입니다. 새로 온 아키텍트가 보니 'weight' 필드는 원문 단위가 모호할 때(예: 단위 표시 없이 숫자만 있을 때) 정확도가 70%뿐이고, weight 필드의 다른 모든 조건에서는 95%를 넘습니다. 앞으로 weight 필드에 어떤 검토 정책을 적용해야 합니까?

- **①** 문서에 명확한 단위가 없을 때는 weight 값을 사람 검토로 보내고, 단위가 명확한 weight는 검토 없이 출력으로 보낸다.
- **②** 전체 파이프라인에서 weight 값의 고정 무작위 표본을 94% 정확도에 맞춘 크기로 검토하고, 단위 없는 문서도 나머지와 똑같이 다룬다.
- **③** 모든 선하증권의 weight 추출을 직원 수기 입력으로 바꾸고, 단위 유무와 관계없이 이 필드에는 모델을 쓰지 않는다.
- **④** 단위 없는 weight 숫자에는 과거 문서에서 가장 흔한 단위를 붙이는 프롬프트 규칙을 추가하고, 그 값을 검토 없이 출력한다.

> **핵심:** 오류가 식별 가능한 조건에 몰려 있으면, 그 세그먼트에만 사람 검토를 집중합니다.

1. **정답** - 오류는 단위 누락·모호라는 하나의 조건에서 나옵니다. 그 문서만 사람에게 보내면 정확도 70% 구간에 검토가 집중되고, 95%를 넘는 단위 명시 구간은 그대로 자동화됩니다.
2. **오답** - 균일한 무작위 표본은 이미 정확한 문서에 검토를 얇게 퍼뜨립니다. 70%짜리 단위 모호 weight 대부분이 확인 없이 출력되고, 94% 집계 수치가 그 약한 세그먼트를 가립니다.
3. **오답** - 단위가 명확한 weight는 이미 95% 넘게 맞습니다. 전량 수기 입력은 그 성능을 버리고 필요 없는 곳에 직원 시간을 씁니다.
4. **오답** - 단위 표시가 없는 문서에는 단위를 알 정보가 없으므로 기본 단위는 추측입니다. 실제 단위가 다르면 틀리고, 검토 없이 내보내면 70% 실패가 그대로 남습니다. 환각 줄이기 문서도 불확실할 때는 모른다고 말할 수 있게 허용하라고 권합니다.

📚 근거: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) · [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)

---

## 문제 32
### **Your extraction schema now includes a 0–1 confidence score for every field. What has to happen before you can use 0.85 as the cut-off for automatic acceptance?**

| 보기 | 설명 |
|------|------|
| 1. Nothing more: a 0.85 score means the field is right 85% of the time | |
| **2. Compare the scores with ground truth on a labeled validation set and choose the threshold, per field if needed, from the measured accuracy** | |
| 3. Ask the model to double-check its own scores in a second pass and average the two | |
| 4. Pick the threshold that sends exactly as many items to review as reviewers can handle | |

**정답: 2.**

**해설:**

> 📘 레슨 5.5 · 사람 검토·신뢰도 — Human Review Routing and Confidence Calibration for Extraction

**📝 문제 번역**

추출 스키마에 이제 모든 필드의 0–1 신뢰도 점수가 들어 있습니다. 0.85를 자동 승인 기준값으로 쓰려면 먼저 무엇이 필요합니까?

- **①** 더 필요 없다. 0.85는 그 필드가 85% 확률로 맞는다는 뜻이다
- **②** 라벨된 검증 세트에서 점수를 정답과 비교하고, 측정된 정확도를 보고 (필요하면 필드별로) 임계값을 고른다
- **③** 두 번째 단계에서 모델에게 자기 점수를 다시 점검하게 하고 두 값을 평균한다
- **④** 검토자가 처리할 수 있는 만큼만 정확히 검토로 보내는 임계값을 고른다

> **핵심:** 표현된 신뢰도는 라벨된 데이터로 확인하기 전까지는 신뢰성에 대한 추측일 뿐입니다.

1. **오답** - 모델이 보고한 신뢰도는 기본적으로 보정된 확률이 아닙니다. Claude Academy도 표현된 확신과 실제 신뢰성 사이의 보정이 느슨하다고 설명합니다.
2. **정답** - 홀드아웃 검증 세트에서 점수와 실제 정답 여부를 맞춰 봐야 임계값이 의미를 갖습니다. 예컨대 0.9 이상이 날짜 필드에서는 99% 정확하고 품목 합계에서는 85%일 수 있으므로, 필드별 임계값이 필요할 수 있습니다.
3. **오답** - 자기 점검과 평균은 같은 미보정 신호를 한 번 더 쓰는 것일 뿐, 정답과의 대조가 아닙니다.
4. **오답** - 검토 용량에 맞춘 임계값은 운영 편의일 뿐, 자동 승인되는 항목의 오류율이 허용 범위인지 보장하지 않습니다.

📚 근거: [Claude Academy — How AI Gets Its Character](https://academy.claude.com/courses/ai-capabilities-and-limitations/how-ai-gets-its-character) · [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)

> "loose calibration between stated confidence and actual reliability"

---

## 문제 33
### **A team building a resume-parsing pipeline wants Claude to output a confidence score for each extracted field so reviewers can prioritize their limited time. During prompt design, which approach best supports later calibration of these scores against a labeled validation set?**

| 보기 | 설명 |
|------|------|
| 1. Have the model give one 0–100 certainty score for the whole resume, with a fixed scale definition in the prompt, and review low-scoring resumes first. | |
| **2. Have the model give a 0–100 certainty score next to each extracted value, with a fixed scale definition in the prompt, and log them with the parsed output.** | |
| 3. Have the model give a 0–100 certainty score only next to values it flags as hard to extract, with a fixed scale definition in the prompt, and skip routine ones. | |
| 4. Have the model give a short written rationale next to each extracted value, with fixed wording guidelines in the prompt, and skip numeric scores. | |

**정답: 2.**

**해설:**

> 📘 레슨 5.5 · 사람 검토·신뢰도 — Human Review Routing and Confidence Calibration for Extraction

**📝 문제 번역**

이력서 파싱 파이프라인을 만드는 팀이, 검토자가 제한된 시간을 우선순위대로 쓸 수 있도록 Claude가 추출 필드마다 신뢰도 점수를 내게 하려 합니다. 프롬프트 설계 단계에서, 나중에 라벨된 검증 세트로 이 점수를 보정하기에 가장 좋은 방법은?

- **①** 이력서 전체에 대해 0–100 확신 점수 하나를 프롬프트에 고정 척도 정의와 함께 내게 하고, 점수가 낮은 이력서부터 검토한다.
- **②** 추출한 값마다 옆에 0–100 확신 점수를 프롬프트에 고정 척도 정의와 함께 내게 하고, 파싱 결과와 함께 기록한다.
- **③** 모델이 추출하기 어렵다고 표시한 값에만 0–100 확신 점수를 고정 척도 정의와 함께 내게 하고, 일상적인 값은 건너뛴다.
- **④** 추출한 값마다 짧은 서술형 근거를 고정 문구 지침과 함께 쓰게 하고, 숫자 점수는 생략한다.

> **핵심:** 보정하려면 모든 필드에 같은 척도의 숫자 점수가 있어, 점수 구간별 실제 정확도를 비교할 수 있어야 합니다.

1. **오답** - 이력서 단위 점수는 강한 필드와 약한 필드를 섞어 버립니다. 검증 세트의 필드별 정답 여부와 비교할 수 없고, 검토자에게 어느 필드를 봐야 할지도 알려 주지 않습니다.
2. **정답** - 값마다 정의된 척도의 점수가 있으면 필드를 점수 구간으로 묶어 라벨 세트의 실제 정확도와 비교할 수 있습니다. 그 비교가 보정이고, 결과로 필드별 임계값을 정해 검토 우선순위를 매깁니다. structured outputs로 필드마다 confidence를 필수 속성으로 두면 모든 응답에 점수가 빠짐없이 들어옵니다.
3. **오답** - 모델이 어렵다고 표시한 필드에만 점수가 있으면 일상 필드는 점수가 없어, 그 필드가 정말 가정만큼 정확한지 확인할 수 없습니다. 스키마 전체를 보정할 데이터가 사라집니다.
4. **오답** - 서술형 근거는 숫자나 등급이 아니라서 구간으로 묶어 정답 여부와 비교할 수 없고, 검토 순서를 정할 임계값도 만들 수 없습니다.

📚 근거: [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)

> "Type safe: Guaranteed field types and required fields"

---

## 문제 34
### **Fields above the calibrated threshold are now accepted automatically. Which ongoing practice best measures their error rate and surfaces new failure modes?**

| 보기 | 설명 |
|------|------|
| 1. Wait for users to report errors downstream | |
| 2. Re-run the original validation set every month | |
| 3. Review a uniform random 1% of all auto-accepted extractions | |
| **4. Sample auto-accepted extractions randomly within each document-type and field stratum, and have humans check them** | |

**정답: 4.**

**해설:**

> 📘 레슨 5.5 · 사람 검토·신뢰도 — Human Review Routing and Confidence Calibration for Extraction

**📝 문제 번역**

보정된 임계값을 넘는 필드는 이제 자동 승인됩니다. 이 필드들의 오류율을 측정하고 새로운 실패 유형을 드러내기에 가장 좋은 지속적 관행은?

- **①** 하류에서 사용자가 오류를 신고하기를 기다린다
- **②** 원래 검증 세트를 매달 다시 돌린다
- **③** 자동 승인된 전체 추출에서 균일 무작위로 1%를 검토한다
- **④** 자동 승인된 추출을 문서 유형·필드 층마다 무작위로 표본 추출해 사람이 확인한다

> **핵심:** 자동 승인분도 층화 무작위 표본으로 계속 재야 세그먼트별 오류율과 새 오류 패턴을 잡을 수 있습니다.

1. **오답** - 사후 신고는 늦고 불완전합니다. 대부분의 오류는 신고되지 않으며, 신고만으로는 오류율을 측정할 수도 없습니다.
2. **오답** - 고정된 검증 세트는 이미 아는 유형만 담고 있어, 새 공급사 양식이나 개정된 서식에서 생긴 새 오류를 보여 주지 못합니다.
3. **오답** - 균일 표본은 비중이 큰 세그먼트에서 대부분 뽑혀, 드물고 위험한 세그먼트는 거의 뽑히지 않습니다. 집계 정확도와 같은 문제를 반복합니다.
4. **정답** - 층마다 표본을 뽑으면 드문 세그먼트에도 자체 오류 추정치가 생기고, 실제 운영 트래픽에서 뽑으므로 고정 세트에 없던 새 패턴을 일찍 발견합니다. 발견한 오류는 검증 세트에 추가해 임계값을 다시 보정합니다.

📚 근거: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) · [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

> "Design evals that mirror your real-world task distribution."

---

## 문제 35
### **Reviewers of your research pipeline's final report cannot tell which document supports any particular claim. You are revising the output format the lead agent gives its subagents. Which change fixes the problem?**

| 보기 | 설명 |
|------|------|
| 1. Have each subagent add a list of every document it consulted after its findings | |
| 2. Tag each finding with the subagent's agent ID and the timestamp of the run | |
| 3. Have each subagent return its findings as short direct quotations, so the wording is exact | |
| **4. Return a list of claims where each claim carries its own source URL or document name and the excerpt that supports it** | |

**정답: 4.**

**해설:**

> 📘 레슨 5.6 · 출처 보존 — Provenance in multi-source synthesis: claim-source mappings, conflicts and dates

**📝 문제 번역**

리서치 파이프라인 최종 보고서의 검토자들이, 어떤 문서가 특정 주장을 뒷받침하는지 알 수 없다고 합니다. 리드 에이전트가 서브에이전트에게 주는 출력 형식을 고치고 있습니다. 어떤 변경이 문제를 해결합니까?

- **①** 서브에이전트가 발견 뒤에 참고한 모든 문서 목록을 덧붙이게 한다
- **②** 각 발견에 서브에이전트의 에이전트 ID와 실행 시각을 붙인다
- **③** 서브에이전트가 발견을 짧은 직접 인용문으로 반환하게 해 표현을 정확하게 한다
- **④** 각 주장이 자신의 출처 URL이나 문서명, 그리고 그 주장을 뒷받침하는 발췌를 함께 갖는 주장 목록을 반환한다

> **핵심:** 출처 보존(provenance)은 주장 하나마다 출처와 발췌를 짝지어야 성립합니다.

1. **오답** - 참고문헌 목록은 어느 주장이 어느 문서에서 왔는지 말해 주지 않습니다.
2. **오답** - ID와 시각은 누가 언제 주장을 만들었는지를 기록할 뿐, 주장이 어디서 왔는지는 기록하지 않습니다.
3. **오답** - 인용문은 표현이 정확해도 출처 이름이 없으면 어느 문서에서 찾아야 할지 알 수 없습니다.
4. **정답** - 주장별 출처와 발췌가 있으면 검토자는 발췌로 주장을 확인하고 출처로 원문을 찾습니다. 환각 줄이기 문서도 각 주장마다 인용과 출처를 달게 해 응답을 감사 가능하게 만들라고 권합니다.

📚 근거: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) · [Citations](https://platform.claude.com/docs/en/build-with-claude/citations)

> "Make Claude's response auditable by having it cite quotes and sources for each of its claims."

---

## 문제 36
### **A market-research pipeline dispatches five research subagents, each of which reads several documents and returns a free-form paragraph summary to a coordinator agent. When the coordinator assembles the final report, reviewers find that several claims can no longer be traced to any specific source. Which change to the subagent output contract would best prevent this loss of provenance?**

| 보기 | 설명 |
|------|------|
| **1. Have each subagent return a list of claims, each paired with a document name or URL and a supporting excerpt** | |
| 2. Have each subagent return its findings as a list of claims, then a closing list of the documents it consulted | |
| 3. Have each subagent return a list of claims, each labelled with an agent ID and a timestamp for the research run | |
| 4. Have each subagent return a list of claims, each phrased as a short quotation from the documents it read | |

**정답: 1.**

**해설:**

> 📘 레슨 5.6 · 출처 보존 — Provenance in multi-source synthesis: claim-source mappings, conflicts and dates

**📝 문제 번역**

시장 조사 파이프라인이 리서치 서브에이전트 다섯 개를 보내고, 각 서브에이전트는 문서 여러 개를 읽은 뒤 자유 형식 문단 요약을 코디네이터 에이전트에 반환합니다. 코디네이터가 최종 보고서를 조립하자, 검토자들은 여러 주장을 더 이상 특정 출처까지 추적할 수 없다는 것을 발견합니다. 이런 출처 손실을 막기 위한 서브에이전트 출력 계약 변경으로 가장 좋은 것은?

- **①** 각 서브에이전트가 문서명이나 URL, 뒷받침 발췌와 짝지은 주장 목록을 반환한다
- **②** 각 서브에이전트가 발견을 주장 목록으로 반환하고, 끝에 참고한 문서 목록을 붙인다
- **③** 각 서브에이전트가 에이전트 ID와 리서치 실행 시각을 붙인 주장 목록을 반환한다
- **④** 각 서브에이전트가 읽은 문서의 짧은 인용문 형태로 쓴 주장 목록을 반환한다

> **핵심:** 자유 형식 요약은 주장은 남기고 출처는 떨어뜨리므로, 출력 계약에서 주장마다 출처와 발췌를 요구합니다.

1. **정답** - 각 주장이 자기 문서명·URL과 발췌를 들고 다니면, 코디네이터가 다섯 서브에이전트의 출력을 합쳐도 주장과 출처의 연결이 살아남습니다. 계약은 프롬프트 지시보다 스키마(structured outputs)로 강제하는 편이 확실합니다.
2. **오답** - 끝의 문서 목록은 서브에이전트가 전체적으로 무엇을 참고했는지만 알려 줍니다. 각 서브에이전트가 여러 문서를 읽었으므로 주장 하나를 특정 문서까지 추적할 수 없습니다.
3. **오답** - ID와 시각은 어느 서브에이전트가 언제 주장을 만들었는지를 보여 줄 뿐, 어느 문서에서 왔는지를 보여 주지 않습니다.
4. **오답** - 인용문은 원문 표현에 가깝지만, 문서명이나 URL이 없으면 코디네이터는 어느 문서의 인용인지 알 수 없습니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)

> "Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries."

---

## 문제 37
### **Halfway through a batch of filings, a subagent finds that two credible documents give different headcounts for the same company. In this pipeline, what should the subagent do?**

| 보기 | 설명 |
|------|------|
| 1. Return only the figure from the source it judges more authoritative, so the coordinator gets one clean value | |
| 2. Stop the analysis and return nothing until the coordinator has resolved the discrepancy | |
| **3. Finish the analysis and include both figures, each annotated with its source and flagged as conflicting, so the coordinator can decide how to reconcile them** | |
| 4. Send both figures straight to the synthesis agent and let it pick whichever fits the report best | |

**정답: 3.**

**해설:**

> 📘 레슨 5.6 · 출처 보존 — Provenance in multi-source synthesis: claim-source mappings, conflicts and dates

**📝 문제 번역**

공시 배치를 절반쯤 처리했을 때, 서브에이전트가 신뢰할 만한 두 문서가 같은 회사의 직원 수를 다르게 제시한다는 것을 발견합니다. 이 파이프라인에서 서브에이전트는 무엇을 해야 합니까?

- **①** 더 권위 있다고 판단한 출처의 수치만 반환해, 코디네이터가 깔끔한 값 하나를 받게 한다
- **②** 코디네이터가 불일치를 해결할 때까지 분석을 멈추고 아무것도 반환하지 않는다
- **③** 분석을 끝내고 두 수치를 모두 넣되, 각각 출처를 달고 상충으로 표시해 코디네이터가 조정 방법을 정하게 한다
- **④** 두 수치를 종합 에이전트에 바로 보내, 보고서에 가장 잘 맞는 쪽을 고르게 한다

> **핵심:** 상충하는 값은 분석 단계에서 지우지 않고 출처와 함께 드러내며, 조정은 넓은 시야를 가진 코디네이터가 종합 전에 결정합니다.

1. **오답** - 서브에이전트가 혼자 값을 고르면 신뢰할 만한 데이터 하나가 사라지고, 그 선택은 하류에서 보이지 않습니다.
2. **오답** - 분석을 멈추면 나머지 작업까지 지연되고 이미 처리한 결과도 전달되지 않습니다. 상충은 보고할 정보이지 작업을 멈출 이유가 아닙니다.
3. **정답** - 분석을 마치고 모든 상충 값을 출처와 함께 넘기면, 코디네이터가 추가 서브에이전트를 보내 두 수치가 서로 다른 것을 재는지(회계연도나 정의의 차이 등) 확인할 수 있습니다. Anthropic 리서치 시스템의 LeadResearcher도 결과를 종합하며 추가 조사가 필요한지 결정합니다.
4. **오답** - 조정 단계를 건너뛰고 종합 에이전트가 "보고서에 맞는 쪽"을 고르면, 근거가 아니라 서술의 편의로 값이 정해집니다.

📚 근거: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

> "The LeadResearcher synthesizes these results and decides whether more research is needed—if so, it can create additional subagents or refine its strategy."

---

## 문제 38
### **During a competitive-intelligence synthesis, two subagents report different figures for a competitor's annual revenue: one cites a press release stating $420 million, the other cites an analyst report stating $460 million. Both sources are credible. How should the synthesis agent handle this discrepancy in the final report?**

| 보기 | 설명 |
|------|------|
| **1. Report $420 million (press release) and $460 million (analyst report) for revenue, flagged as conflicting** | |
| 2. Report $460 million (analyst report) for revenue, and leave the press release figure out of the final report | |
| 3. Report $420 million (press release) for revenue, and leave the analyst figure out of the final report | |
| 4. Report $440 million (average of the two figures) for revenue, and cite both sources as its basis | |

**정답: 1.**

**해설:**

> 📘 레슨 5.6 · 출처 보존 — Provenance in multi-source synthesis: claim-source mappings, conflicts and dates

**📝 문제 번역**

경쟁 정보 종합 중에 두 서브에이전트가 경쟁사의 연 매출을 다르게 보고합니다. 하나는 보도자료를 인용해 $420 million, 다른 하나는 애널리스트 보고서를 인용해 $460 million이라고 합니다. 두 출처 모두 신뢰할 만합니다. 종합 에이전트는 최종 보고서에서 이 불일치를 어떻게 다뤄야 합니까?

- **①** 매출을 $420 million(보도자료)과 $460 million(애널리스트 보고서)으로 함께 쓰고 상충으로 표시한다
- **②** 매출을 $460 million(애널리스트 보고서)으로 쓰고, 보도자료 수치는 최종 보고서에서 뺀다
- **③** 매출을 $420 million(보도자료)으로 쓰고, 애널리스트 수치는 최종 보고서에서 뺀다
- **④** 매출을 $440 million(두 수치의 평균)으로 쓰고, 두 출처를 그 근거로 인용한다

> **핵심:** 신뢰할 만한 출처끼리 수치가 다르면 두 값을 각자의 출처와 함께 제시하고 상충을 표시합니다.

1. **정답** - 신뢰할 만한 두 출처가 다르므로 보고서는 각 값을 출처와 함께 제시하고 불일치를 표시해야 합니다. 두 데이터 포인트가 모두 남아 독자가 목적에 맞는 수치를 판단할 수 있습니다.
2. **오답** - 애널리스트 수치를 고르고 보도자료 값을 버리면 신뢰할 만한 데이터를 잃고, 독자는 다른 수치가 있었다는 사실을 모릅니다. 시나리오에는 애널리스트 수치가 더 믿을 만하다는 근거가 없습니다.
3. **오답** - 회사의 자체 발표가 독립 애널리스트보다 정확하다는 근거도 없습니다. 2번과 같은 이유로, 확정되지 않은 질문을 확정된 것처럼 보이게 합니다.
4. **오답** - $440 million은 어느 출처도 보고하지 않은 숫자입니다. 두 출처를 근거로 달면 출처가 있는 수치처럼 보여 오히려 더 오해를 부르고, 주장마다 뒷받침하는 직접 인용을 찾는 기본 검증도 통과하지 못합니다.

📚 근거: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) · [Citations (cookbook)](https://platform.claude.com/cookbook/misc-using-citations)

> "The citation feature will not return citations pointing to documents or locations that were not provided as valid sources."

---

## 문제 39
### **Your coordinator keeps flagging 'contradictions' between subagents. For example, one reports regional unemployment at 5.1% and another at 6.3%, and it spends extra research rounds trying to reconcile them. On review, the two reports were published fourteen months apart. Which change to the subagent output schema prevents this?**

| 보기 | 설명 |
|------|------|
| 1. Add each subagent's run timestamp to every finding, so the coordinator knows when each figure was produced | |
| **2. Require a publication or data-collection date field on every extracted figure, next to the claim, source and excerpt** | |
| 3. Instruct subagents to keep only the most recent figure for each statistic and discard older ones | |
| 4. Have subagents merge figures on the same topic into a single range, such as 5–6%, citing both sources | |

**정답: 2.**

**해설:**

> 📘 레슨 5.6 · 출처 보존 — Provenance in multi-source synthesis: claim-source mappings, conflicts and dates

**📝 문제 번역**

코디네이터가 서브에이전트 사이의 '모순'을 계속 표시합니다. 예를 들어 한쪽은 지역 실업률을 5.1%, 다른 쪽은 6.3%로 보고하고, 코디네이터는 이를 조정하려고 추가 조사 라운드를 돌립니다. 검토해 보니 두 보고서는 14개월 간격으로 발행됐습니다. 서브에이전트 출력 스키마를 어떻게 바꾸면 이를 막을 수 있습니까?

- **①** 모든 발견에 서브에이전트의 실행 시각을 붙여, 코디네이터가 각 수치가 언제 생성됐는지 알게 한다
- **②** 추출한 모든 수치에 발행일 또는 데이터 수집일 필드를 필수로 두고, 주장·출처·발췌 옆에 둔다
- **③** 서브에이전트에게 통계마다 가장 최근 수치만 남기고 오래된 것은 버리라고 지시한다
- **④** 같은 주제의 수치를 5–6% 같은 하나의 범위로 합치고 두 출처를 인용하게 한다

> **핵심:** 두 수치의 차이는 같은 시점을 가리킬 때만 모순이므로, 수치마다 발행일·수집일을 필수 필드로 받습니다.

1. **오답** - 실행 시각은 에이전트가 언제 돌았는지만 기록합니다. 두 수치를 같은 날 추출했다면 실행 시각은 같고, 출처 데이터의 시점은 여전히 알 수 없습니다.
2. **정답** - 수치마다 날짜가 있으면 코디네이터는 5.1%와 6.3%를 추이의 두 점으로 읽습니다. Citations를 쓸 때는 문서의 `context` 필드에 발행일 같은 메타데이터를 텍스트나 JSON 문자열로 넣을 수 있고, 스키마에서 날짜를 필수로 두면 날짜 없는 수치가 코디네이터에 도착하지 않습니다.
3. **오답** - 날짜가 붙으면 오래된 수치는 추이를 보여 주는 증거입니다. 버리면 그 증거를 잃고, 무엇을 남길지 정하는 판단을 코디네이터에게서 빼앗습니다.
4. **오답** - 합친 범위는 어느 출처도 보고하지 않은 값이고, 시점 정보도 여전히 없습니다.

📚 근거: [Citations](https://platform.claude.com/docs/en/build-with-claude/citations) · [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)

> "title is limited in length, so the context field is useful for storing document metadata as text or stringified JSON."

---

## 문제 40
### **A synthesis agent combines a subagent finding that unemployment in a region is '5.1%' with another subagent finding that it is '6.3%'. The coordinator initially treats this as a contradiction requiring reconciliation, but on closer inspection the two figures come from reports published fourteen months apart. What structural change to subagent output would prevent this kind of false contradiction going forward?**

| 보기 | 설명 |
|------|------|
| **1. Have each subagent record the report's release date with each figure it extracts before passing it to the coordinator** | |
| 2. Have each subagent replace each figure it extracts with a twelve-month average before passing it to the coordinator | |
| 3. Have each subagent keep only the newest figure it finds for each statistic before passing it to the coordinator | |
| 4. Have each subagent round each figure it extracts into a range such as 5–6% before passing it to the coordinator | |

**정답: 1.**

**해설:**

> 📘 레슨 5.6 · 출처 보존 — Provenance in multi-source synthesis: claim-source mappings, conflicts and dates

**📝 문제 번역**

종합 에이전트가 어떤 지역의 실업률이 '5.1%'라는 서브에이전트 발견과, '6.3%'라는 다른 서브에이전트의 발견을 합칩니다. 코디네이터는 처음에 이를 조정이 필요한 모순으로 다뤘지만, 살펴보니 두 수치는 14개월 간격으로 발행된 보고서에서 나왔습니다. 앞으로 이런 거짓 모순을 막을 서브에이전트 출력의 구조적 변경은?

- **①** 각 서브에이전트가 추출하는 수치마다 보고서 발행일을 함께 기록해 코디네이터에 넘긴다
- **②** 각 서브에이전트가 추출한 수치를 12개월 평균으로 바꿔 코디네이터에 넘긴다
- **③** 각 서브에이전트가 통계마다 찾은 가장 새로운 수치만 남겨 코디네이터에 넘긴다
- **④** 각 서브에이전트가 추출한 수치를 5–6% 같은 범위로 반올림해 코디네이터에 넘긴다

> **핵심:** 거짓 모순의 원인은 코디네이터가 수치의 시점을 볼 수 없다는 것이므로, 출력에 발행일을 붙입니다.

1. **정답** - 수치 옆의 발행일은 5.1%와 6.3%가 서로 다른 시점을 가리킨다는 것을 코디네이터에게 보여 줍니다. 그 차이는 조정할 출처 간 상충이 아니라 14개월 동안의 변화로 읽힙니다.
2. **오답** - 12개월 평균은 두 시점의 값을 매끈한 숫자로 뭉개 원래의 시점별 값을 버립니다. 한 보고서에는 그런 이력이 없는 경우도 많고, 출력에 날짜가 없으니 출처 간 차이도 여전히 설명되지 않습니다.
3. **오답** - 각 서브에이전트는 자기 보고서만 갖고 있으므로, 서브에이전트 안에서 최신 값을 고르는 것은 두 서브에이전트 발견 사이의 차이와 무관합니다. 남은 수치에도 여전히 날짜가 없습니다.
4. **오답** - 범위로 반올림하면 정밀도만 잃고 시점 정보는 생기지 않습니다. 기간 사이의 실제 변화도 흐려집니다.

📚 근거: [Citations](https://platform.claude.com/docs/en/build-with-claude/citations) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "wrap each document in `<document>` tags with `<document_content>` and `<source>` (and other metadata) subtags for clarity"

---

## 문제 41
### **A stakeholder reading your pipeline's final report says it presents everything with the same certainty. One source called its result "early survey data suggests", but the report says "data shows". A claim backed by a single study sits next to findings that five sources agree on. How should you change the synthesis step?**

| 보기 | 설명 |
|------|------|
| 1. Tell the synthesis agent to rewrite every finding in one consistent, confident voice so the report reads as a single authoritative narrative | |
| 2. Drop every finding that rests on a single source or a disputed figure, so the report holds only what all sources agree on | |
| **3. Put findings that sources consistently support in an established section, and single-source or disputed ones in a contested section. Have the agent extract word-for-word quotes first, so each source's own wording and caveats carry through.** | |
| 4. Keep the blended narrative and add a bibliography of every source at the end, so readers can check the strength of the evidence themselves | |

**정답: 3.**

**해설:**

> 📘 레슨 5.6 · 출처 보존 — Provenance in multi-source synthesis: claim-source mappings, conflicts and dates

**📝 문제 번역**

파이프라인 최종 보고서를 읽은 이해관계자가 모든 내용이 같은 확신으로 쓰였다고 지적합니다. 한 출처는 자기 결과를 "early survey data suggests"(초기 설문 데이터에 따르면 ~로 보인다)라고 썼는데 보고서에는 "data shows"(데이터가 보여 준다)로 되어 있습니다. 연구 하나에만 근거한 주장이 다섯 출처가 일치하는 발견 옆에 나란히 있습니다. 종합 단계를 어떻게 바꿔야 합니까?

- **①** 종합 에이전트에게 모든 발견을 하나의 일관되고 자신 있는 어조로 다시 쓰게 해, 보고서를 하나의 권위 있는 서술로 만든다
- **②** 단일 출처나 논쟁 중인 수치에 기댄 발견을 모두 빼서, 모든 출처가 동의하는 내용만 남긴다
- **③** 출처들이 일관되게 뒷받침하는 발견은 확립된(established) 섹션에, 단일 출처이거나 논쟁 중인 발견은 논쟁(contested) 섹션에 둔다. 에이전트가 먼저 원문 그대로의 인용을 뽑게 해, 각 출처의 표현과 단서가 그대로 이어지게 한다.
- **④** 섞인 서술은 그대로 두고 끝에 모든 출처의 참고문헌을 붙여, 독자가 근거의 강도를 직접 확인하게 한다

> **핵심:** 독자가 근거의 강도를 볼 수 있도록 확립된 결과와 논쟁 중인 결과를 나누고, 원문 인용에 기대어 출처의 단서 표현을 보존합니다.

1. **오답** - 하나의 자신 있는 어조로 다시 쓰면 "초기", "소표본" 같은 단서가 사라져 주장이 출처보다 강해집니다. 지적받은 문제를 오히려 키웁니다.
2. **오답** - 논쟁 중인 발견을 빼면 독자가 알아야 할 불일치를 숨깁니다. 단일 출처 결과도 그 사실이 분명히 표시되면 유용한 정보입니다.
3. **정답** - 섹션을 나누면 독자는 어느 주장을 믿고 어느 주장을 조심해야 하는지 압니다. 환각 줄이기 문서는 작업 전에 원문 그대로의 인용을 먼저 뽑게 하면 응답이 실제 텍스트에 근거하게 된다고 설명하며, 이렇게 해야 "preliminary" 같은 단서가 바꿔 쓰기 과정에서 사라지지 않습니다.
4. **오답** - 참고문헌 목록은 어떤 주장이 얼마나 강한 근거를 갖는지와 연결되지 않습니다. 독자에게 검증 부담을 떠넘길 뿐입니다.

📚 근거: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) · [Citations](https://platform.claude.com/docs/en/build-with-claude/citations)

> "ask Claude to extract word-for-word quotes first before performing its task. This grounds its responses in the actual text, reducing hallucinations."

---
