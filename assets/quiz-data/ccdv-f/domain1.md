<!-- 출처·작성 원칙: CertSafari CCDV-F 레슨(https://certsafari.com/anthropic/claude-developer-foundations/learn) 도메인 1(1.1~1.3)의 체크포인트·Predict-first 문항 29개에 1:1로 대응한다. 각 체크포인트가 묻는 개념과 정답 근거만 따르고, 시나리오·문장·보기는 새로 썼다(원문은 옮기지 않음). 순서 맞추기·짝 맞추기·빈칸·예측 형식은 4지선다로 바꿨다. 해설은 Anthropic 공식 문서(2026년 10월 기준)를 확인해 한글로 작성. -->

## 문제 1
### **An insurance company's intake service sends each new claim email to Claude, which returns exactly one label: "auto", "home", or "travel". A Python `match` statement then forwards the claim to a dedicated prompt for that label. The engineering lead describes the system as "our claims agent." Which description of this architecture is accurate?**

| 보기 | 설명 |
|------|------|
| 1. It is an agent, because Claude's output decides which branch of the code runs next. | |
| **2. It is a workflow, because every path a claim can take is defined in code and Claude only supplies a label.** | |
| 3. It is an agent, because the system calls an LLM more than once for every claim. | |
| 4. It is a workflow only if the classification call runs at temperature 0 so the label is deterministic. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

한 보험사의 접수 서비스는 새 청구 이메일을 Claude에 보내고, Claude는 "auto", "home", "travel" 중 정확히 하나의 라벨을 돌려줍니다. 그다음 Python `match` 문이 그 라벨에 맞는 전용 프롬프트로 청구 건을 넘깁니다. 엔지니어링 리드는 이 시스템을 "우리 청구 에이전트"라고 부릅니다. 이 아키텍처에 대한 설명으로 옳은 것은 무엇일까요?

- **①** 에이전트다. Claude의 출력이 다음에 실행될 코드 분기를 정하기 때문이다
- **②** 워크플로다. 청구 건이 갈 수 있는 모든 경로가 코드에 정의되어 있고, Claude는 라벨만 제공하기 때문이다
- **③** 에이전트다. 시스템이 청구 건마다 LLM을 두 번 이상 호출하기 때문이다
- **④** 분류 호출을 temperature 0으로 돌려 라벨이 결정적일 때에만 워크플로다

> **핵심 진단:** 워크플로와 에이전트를 가르는 기준은 *LLM을 쓰느냐* 가 아니라 **제어 흐름을 누가 쥐느냐** 입니다. Anthropic의 정의에서 워크플로는 LLM과 도구가 *미리 정의된 코드 경로* 를 따라 움직이는 시스템이고, 에이전트는 LLM이 *자신의 과정과 도구 사용을 동적으로 지휘* 하는 시스템입니다. 이 시스템에서 모델은 값 하나를 낼 뿐이고, 그 값으로 갈 수 있는 세 갈래는 모두 `match` 문에 적혀 있습니다. 전형적인 **라우팅 워크플로** 입니다.

1. **오답** - 모델 출력이 분기를 *고르는* 데 쓰인다고 에이전트가 되지는 않습니다. 고를 수 있는 분기 자체를 코드가 미리 정해 두었으므로, 모델은 과정을 지휘하지 않습니다.
2. **정답** - 실행 전에 코드만 보고 가능한 경로를 전부 나열할 수 있습니다. 모델은 분류라는 한 단계를 맡을 뿐이므로 라우팅 워크플로입니다.
3. **오답** - 호출 횟수는 기준이 아닙니다. 프롬프트 체이닝처럼 LLM을 여러 번 부르는 워크플로도 흔하고, 에이전트 여부는 다음 단계를 누가 정하느냐로 판단합니다.
4. **오답** - 샘플링 설정은 출력의 변동성에 관한 것이고 아키텍처 분류와는 무관합니다. 라벨이 매번 달라지더라도 경로가 코드에 고정되어 있으면 여전히 워크플로입니다.

> 💡 **시험 포인트:** "LLM이 분류하고 코드가 분기한다"는 시나리오는 에이전트가 아니라 라우팅 워크플로입니다. 에이전트라고 부르려면 모델이 실행 중에 다음 행동과 도구를 스스로 정해야 합니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 2
### **A contract-summarization pipeline extracts clauses, summarizes them, and then checks the summary against a fixed compliance checklist. It currently meets its 95% accuracy target and its p95 latency SLA. A product manager proposes rebuilding it as an autonomous agent "so it can be smarter." What is the best response?**

| 보기 | 설명 |
|------|------|
| 1. Rebuild it as an agent, but cap the agent at the same number of steps as the current pipeline. | |
| 2. Rebuild it as a multi-agent system so that each stage is handled by its own specialist subagent. | |
| 3. Keep the pipeline, but let Claude decide at runtime whether the checklist step can be skipped. | |
| **4. Keep the existing pipeline, because it already meets the requirements and an agent would add latency, cost, and unpredictability without a measured benefit.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

계약서 요약 파이프라인이 조항을 추출하고, 요약한 뒤, 요약본을 고정된 컴플라이언스 체크리스트와 대조합니다. 현재 정확도 목표 95%와 p95 지연 SLA를 모두 충족하고 있습니다. 제품 관리자가 "더 똑똑해지도록" 이것을 자율 에이전트로 다시 만들자고 제안합니다. 가장 알맞은 대응은 무엇일까요?

- **①** 에이전트로 다시 만들되, 현재 파이프라인과 같은 단계 수로 상한을 둔다
- **②** 단계마다 전문 서브에이전트가 맡도록 멀티에이전트 시스템으로 다시 만든다
- **③** 파이프라인은 유지하되, 체크리스트 단계를 건너뛸지 Claude가 실행 중에 정하게 한다
- **④** 기존 파이프라인을 유지한다. 이미 요구사항을 충족하고 있고, 에이전트는 측정된 이득 없이 지연·비용·예측 불가능성만 더하기 때문이다

> **핵심 진단:** Anthropic의 기본 원칙은 "가능한 가장 단순한 해법을 찾고, *필요할 때만* 복잡성을 더하라"입니다. 에이전트형 시스템은 더 나은 작업 성능을 얻는 대가로 **지연과 비용** 을 치르고, 모델이 경로를 정하므로 **예측 가능성** 도 떨어집니다. 이 파이프라인은 단계가 고정된 작업을 이미 목표 수준으로 처리하고 있으므로, 그 대가를 치를 이유가 없습니다. 구조를 바꾸려면 먼저 현재 구조로는 채울 수 없는 요구가 측정으로 확인되어야 합니다.

1. **오답** - 단계 수를 고정한 에이전트는 사실상 워크플로를 더 비싸고 덜 예측 가능하게 만든 것입니다. 바꿀 이유부터가 없다는 문제를 해결하지 못합니다.
2. **오답** - 멀티에이전트는 단일 에이전트보다도 토큰을 훨씬 많이 쓰고, 순차 단계를 역할별 에이전트로 쪼개면 넘길 때마다 맥락이 빠집니다. 문제가 없는 곳에 가장 비싼 구조를 들이는 셈입니다.
3. **오답** - 컴플라이언스 검사처럼 반드시 거쳐야 하는 단계를 모델 재량에 맡기면 오히려 위험이 생깁니다. 고정되어야 할 단계는 코드로 고정해 두는 것이 워크플로의 장점입니다.
4. **정답** - 품질과 지연 목표를 모두 채우는 시스템을 에이전트로 바꾸면 이득은 불확실한데 비용·지연·예측 불가능성은 확실히 늘어납니다. 현 구조를 유지하는 것이 맞습니다.

> 💡 **시험 포인트:** "이미 목표를 충족하는 워크플로를 에이전트로 바꾸자"는 보기는 거의 항상 오답입니다. 자율성은 요구사항이 그것을 필요로 한다는 근거가 있을 때만 한 단계씩 올립니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Building multi-agent systems: when and how to use them](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them)

---

## 문제 3
### **An internal IT helpdesk receives requests that always fall into one of four known categories: password reset, hardware order, VPN access, or software license. Each category has its own fixed handling procedure that rarely changes. Which architecture fits best?**

| 보기 | 설명 |
|------|------|
| **1. Routing: classify each request, then send it to the predefined handler for its category.** | |
| 2. Orchestrator-workers: a lead model decides at runtime which subtasks each request requires. | |
| 3. An autonomous agent that holds the tools for all four procedures and chooses its own steps. | |
| 4. Parallelization by voting: run all four handlers on every request and keep the majority result. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

사내 IT 헬프데스크로 들어오는 요청은 항상 비밀번호 재설정, 하드웨어 주문, VPN 접근, 소프트웨어 라이선스라는 네 가지 정해진 범주 중 하나에 속합니다. 범주마다 거의 바뀌지 않는 고정된 처리 절차가 있습니다. 가장 알맞은 아키텍처는 무엇일까요?

- **①** 라우팅: 요청을 분류한 뒤, 해당 범주에 미리 정의된 처리기로 보낸다
- **②** 오케스트레이터-워커: 리드 모델이 요청마다 필요한 하위 작업을 실행 중에 정한다
- **③** 네 절차의 도구를 모두 가진 자율 에이전트가 스스로 단계를 고른다
- **④** 투표 방식 병렬화: 모든 요청에 네 처리기를 다 돌려 다수 결과를 채택한다

> **핵심 진단:** 범주가 **미리 알려져 있고 개수가 정해져 있으며**, 범주마다 **처리 경로가 고정** 되어 있다면 라우팅 워크플로가 정답입니다. 라우팅은 입력을 분류해 전용 후속 경로로 보내는 패턴으로, 관심사를 분리하고 범주별로 특화된 프롬프트를 쓸 수 있게 해 줍니다. 실행 중에 하위 작업을 새로 정할 필요가 없으므로 그보다 자율적인 구조는 불필요한 비용과 예측 불가능성만 더합니다.

1. **정답** - 분류 한 번과 범주별 고정 경로로 문제를 완전히 해결합니다. 범주별 처리기를 독립적으로 최적화하고 테스트할 수 있어 예측 가능성도 높습니다.
2. **오답** - 오케스트레이터-워커는 입력을 보기 전에는 하위 작업을 알 수 없을 때 쓰는 패턴입니다. 여기서는 범주와 절차가 모두 정해져 있으므로 실행 중 분해가 필요 없습니다.
3. **오답** - 자율 에이전트는 경로가 고정된 문제에 예측 불가능성과 비용을 더합니다. 정해진 절차를 모델이 매번 재구성할 이유가 없습니다.
4. **오답** - 투표는 *같은 작업* 을 여러 번 돌려 신뢰도를 높이는 패턴입니다. 서로 다른 네 처리기를 모두 실행하는 것은 투표도 아니고, 요청 하나에 맞지 않는 처리까지 수행하는 낭비입니다.

> 💡 **시험 포인트:** "정해진 몇 개 범주 + 범주별 고정 처리"라는 신호가 보이면 라우팅입니다. "무엇을 해야 할지 입력을 봐야 안다"는 신호가 있어야 오케스트레이터-워커나 에이전트가 후보가 됩니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 4
### **A market-intelligence product uses an orchestrator–subagent design modeled on Anthropic's multi-agent research system. Which sequence correctly describes how one research request flows through the system?**

| 보기 | 설명 |
|------|------|
| 1. Subagents search every angle independently → the lead writes a plan from what they found → a citation step attributes sources → the lead decides whether to spawn more subagents. | |
| 2. The lead writes a plan → each subagent attaches citations while searching → the lead concatenates the subagent outputs → the report is returned without further research. | |
| **3. The lead analyzes the request and saves its plan → spawns subagents with specific subtasks → subagents search and report back → the lead synthesizes and decides whether more research is needed → a separate citation step attributes sources.** | |
| 4. The lead spawns one subagent per search result → subagents write the final report sections → the lead adds citations → the plan is saved to memory for the next request. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

한 시장 정보 제품이 Anthropic의 멀티에이전트 리서치 시스템을 본떠 오케스트레이터-서브에이전트 구조를 씁니다. 리서치 요청 하나가 이 시스템을 거치는 순서를 올바르게 설명한 것은 무엇일까요?

- **①** 서브에이전트가 모든 관점을 각자 검색한다 → 리드가 그 결과로 계획을 쓴다 → 인용 단계가 출처를 붙인다 → 리드가 서브에이전트를 더 만들지 정한다
- **②** 리드가 계획을 쓴다 → 서브에이전트가 검색하면서 인용을 붙인다 → 리드가 서브에이전트 출력을 이어 붙인다 → 추가 조사 없이 보고서를 돌려준다
- **③** 리드가 요청을 분석하고 계획을 저장한다 → 구체적인 하위 작업을 맡은 서브에이전트를 만든다 → 서브에이전트가 검색하고 결과를 보고한다 → 리드가 종합하고 추가 조사가 필요한지 정한다 → 별도의 인용 단계가 출처를 붙인다
- **④** 리드가 검색 결과마다 서브에이전트를 하나씩 만든다 → 서브에이전트가 최종 보고서의 각 절을 쓴다 → 리드가 인용을 붙인다 → 다음 요청을 위해 계획을 메모리에 저장한다

> **핵심 진단:** Anthropic 리서치 시스템의 흐름은 **계획 → 위임 → 탐색·보고 → 종합·반복 판단 → 인용** 입니다. 리드 에이전트는 먼저 전략을 세우고, 컨텍스트가 길어지면 앞부분이 잘릴 수 있으므로 계획을 메모리에 저장합니다. 그다음 구체적인 하위 작업을 서브에이전트에 나눠 주고, 돌아온 결과를 종합하면서 더 조사할지 판단합니다(필요하면 다시 위임). 정보가 충분해지면 인용 전담 에이전트가 주장마다 출처를 붙입니다.

1. **오답** - 계획 없이 서브에이전트부터 풀면 각자 무엇을 조사해야 할지 경계가 없어 중복과 누락이 생깁니다. 계획은 위임보다 먼저입니다.
2. **오답** - 인용은 종합이 끝난 뒤 별도 단계로 처리됩니다. 또한 리드는 출력을 단순히 이어 붙이는 것이 아니라 종합하며 추가 조사 여부를 판단하는 반복 루프를 돕니다.
3. **정답** - 계획 저장, 구체적 위임, 탐색과 보고, 종합과 반복 판단, 마지막 인용 단계까지 리서치 시스템의 실제 흐름과 일치합니다.
4. **오답** - 서브에이전트는 검색 결과 단위가 아니라 조사할 하위 질문 단위로 만듭니다. 계획을 요청이 끝난 뒤에 저장하는 것도 순서가 뒤바뀐 것입니다.

> 💡 **시험 포인트:** 오케스트레이터-서브에이전트 문항에서는 '리드가 먼저 계획하고, 종합하면서 반복 여부를 정하며, 인용은 마지막 별도 단계'라는 세 가지를 확인하세요.

> 📚 근거 문서: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

---

## 문제 5
### **A release-notes generator works in three steps: (1) Claude drafts release notes from a changelog, (2) a script verifies that every ticket ID in the changelog appears in the draft and rejects the draft otherwise, and (3) Claude translates the approved draft into Japanese and German. The steps and their order never change. Which pattern does this system implement?**

| 보기 | 설명 |
|------|------|
| 1. Evaluator-optimizer, because the draft is evaluated before it moves on to translation. | |
| **2. Prompt chaining with a programmatic gate between steps.** | |
| 3. Orchestrator-workers, because the translation step fans out into two languages. | |
| 4. An autonomous agent, because Claude performs several different kinds of tasks. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

릴리스 노트 생성기는 세 단계로 동작합니다. (1) Claude가 변경 로그로 릴리스 노트 초안을 쓰고, (2) 스크립트가 변경 로그의 모든 티켓 ID가 초안에 있는지 확인해 없으면 초안을 반려하며, (3) Claude가 승인된 초안을 일본어와 독일어로 번역합니다. 단계와 순서는 절대 바뀌지 않습니다. 이 시스템이 구현한 패턴은 무엇일까요?

- **①** 평가자-최적화자. 초안이 번역으로 넘어가기 전에 평가되기 때문이다
- **②** 단계 사이에 프로그램 검사(게이트)를 둔 프롬프트 체이닝
- **③** 오케스트레이터-워커. 번역 단계가 두 언어로 갈라지기 때문이다
- **④** 자율 에이전트. Claude가 여러 종류의 작업을 수행하기 때문이다

> **핵심 진단:** **프롬프트 체이닝** 은 작업을 고정된 단계로 나누고, 각 LLM 호출이 앞 단계의 출력을 처리하는 패턴입니다. 중간 단계에 코드로 된 검사(게이트)를 넣어 과정이 궤도를 벗어나지 않게 할 수 있습니다. 이 시스템은 단계와 순서가 고정되어 있고, 실행 중에 무엇을 할지 정하는 주체가 없으며, 검사는 스크립트가 맡습니다. 체이닝의 교과서적인 예입니다.

1. **오답** - 평가자-최적화자는 한 LLM이 만들고 다른 LLM이 평가해 *피드백을 주고 다시 생성하는 루프* 입니다. 여기서는 스크립트가 통과·반려만 판정할 뿐 개선 피드백 루프가 없습니다.
2. **정답** - 고정된 순차 단계와 그 사이의 프로그램 게이트라는 체이닝의 두 특징을 모두 갖췄습니다. 실행 중 결정이 없으므로 더 자율적인 패턴이 아닙니다.
3. **오답** - 두 언어로 번역하는 갈래는 미리 정해져 있습니다. 오케스트레이터-워커는 중앙 LLM이 입력을 보고 하위 작업을 *실행 중에* 정할 때 해당합니다.
4. **오답** - 수행하는 작업의 종류가 많다고 에이전트가 되지는 않습니다. 다음 단계를 모델이 정하지 않고 코드가 정하므로 워크플로입니다.

> 💡 **시험 포인트:** "단계와 순서가 항상 같다 + 단계 사이에 코드 검사"는 프롬프트 체이닝의 신호입니다. 검사가 있다는 이유만으로 평가자-최적화자를 고르지 마세요. 그 패턴에는 생성-평가-재생성 루프가 있어야 합니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 6
### **With the Claude Agent SDK, you define a `log-auditor` subagent that must be able to read and search files but must never edit files or run shell commands. Which part of the configuration actually restricts the subagent to those capabilities?**

| 보기 | 설명 |
|------|------|
| **1. The subagent's `tools` field in its `AgentDefinition`, set to a list such as `["Read", "Grep", "Glob"]`.** | |
| 2. The `allowedTools` option on `query()`, listing only `Read`, `Grep`, and `Glob`. | |
| 3. The subagent's `description` field, stating that it must never modify files. | |
| 4. The subagent's `prompt` field, instructing it to use read-only tools only. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

Claude Agent SDK로 `log-auditor` 서브에이전트를 정의합니다. 이 서브에이전트는 파일을 읽고 검색할 수는 있어야 하지만, 파일을 수정하거나 셸 명령을 실행해서는 절대 안 됩니다. 설정의 어느 부분이 실제로 서브에이전트를 그 능력으로만 제한할까요?

- **①** 서브에이전트 `AgentDefinition`의 `tools` 필드를 `["Read", "Grep", "Glob"]` 같은 목록으로 지정한다
- **②** `query()`의 `allowedTools` 옵션에 `Read`, `Grep`, `Glob`만 나열한다
- **③** 서브에이전트의 `description` 필드에 절대 파일을 수정하지 말라고 적는다
- **④** 서브에이전트의 `prompt` 필드에 읽기 전용 도구만 쓰라고 지시한다

> **핵심 진단:** `AgentDefinition`의 **`tools`** 필드는 서브에이전트가 쓸 수 있는 도구 목록입니다. 목록에 없는 도구는 서브에이전트 세션에 *아예 존재하지 않으므로* , Claude는 권한 확인이나 오류 없이 그 도구 없이 일합니다. 반면 `query()`의 `allowedTools`는 **권한 확인 없이 실행할 도구의 자동 승인 목록** 일 뿐이라 목록에 없는 도구를 막지 않습니다. 설명과 프롬프트는 모델의 판단을 유도할 뿐 강제력이 없습니다.

```python
"log-auditor": AgentDefinition(
    description="Use to inspect application logs. Read-only.",
    prompt="Find error patterns in the logs and report them.",
    tools=["Read", "Grep", "Glob"],   # Edit·Write·Bash는 이 서브에이전트에 없다
)
```

1. **정답** - `tools`로 지정한 목록이 서브에이전트의 도구 집합 자체가 됩니다. 편집이나 명령 실행 도구가 세션에 없으므로 구조적으로 쓸 수 없습니다.
2. **오답** - `allowedTools`는 자동 승인 목록입니다. 목록에 없는 도구는 막히는 것이 아니라 권한 모드와 권한 확인 흐름으로 넘어가므로 제한이 보장되지 않습니다. 도구를 빼려면 `disallowedTools`를 써야 합니다.
3. **오답** - `description`은 Claude가 *언제* 이 서브에이전트에 일을 맡길지 판단하는 근거입니다. 행동 제약을 적어 두어도 도구 접근은 그대로입니다.
4. **오답** - 프롬프트 지시는 모델이 대체로 따르게 만들 뿐 보장하지 않습니다. "절대 안 된다"는 요구에는 설정으로 강제하는 수단이 필요합니다.

> 💡 **시험 포인트:** 서브에이전트의 도구를 좁히는 것은 `tools`, 도구를 빼는 것은 `disallowedTools`, `allowedTools`는 '묻지 않고 실행'일 뿐입니다. 이 세 가지를 바꿔 놓은 보기가 단골 함정입니다.

> 📚 근거 문서: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [Configure permissions (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/permissions)

---

## 문제 7
### **A literature-review assistant currently uses a single agent that runs five independent research queries one after another. The team plans to switch to a lead agent that runs five subagents in parallel, one per query. Based on Anthropic's guidance, which expectation is most accurate?**

| 보기 | 설명 |
|------|------|
| 1. Token usage and end-to-end time will both drop, because each subagent works with a smaller context. | |
| 2. End-to-end time will fall to about one-fifth, and total token usage will stay roughly the same. | |
| 3. Total token usage will fall, but end-to-end time will stay the same because the lead must wait for all subagents. | |
| **4. Total token usage will rise substantially, and end-to-end time may not improve and is often longer; the main gain is broader, more thorough exploration.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

문헌 조사 어시스턴트가 지금은 에이전트 하나로 서로 독립적인 조사 질의 다섯 개를 차례로 실행합니다. 팀은 질의마다 서브에이전트 하나씩, 다섯 개를 병렬로 돌리는 리드 에이전트 구조로 바꾸려 합니다. Anthropic의 안내에 비추어 볼 때 가장 정확한 예상은 무엇일까요?

- **①** 서브에이전트마다 컨텍스트가 작아지므로 토큰 사용량과 전체 소요 시간이 모두 줄어든다
- **②** 전체 소요 시간은 약 5분의 1로 줄고, 총 토큰 사용량은 거의 같다
- **③** 총 토큰 사용량은 줄지만, 리드가 모든 서브에이전트를 기다려야 하므로 전체 소요 시간은 같다
- **④** 총 토큰 사용량은 크게 늘고, 전체 소요 시간은 나아지지 않을 수 있으며 더 길어지는 경우도 많다. 주된 이득은 더 넓고 철저한 탐색이다

> **핵심 진단:** 멀티에이전트 구현은 같은 작업을 단일 에이전트로 할 때보다 보통 **3~10배** 토큰을 씁니다(Anthropic 리서치 시스템에서는 일반 채팅 대비 약 15배). 서브에이전트마다 지시를 받고, 탐색하고, 결과를 요약해 돌려주는 과정이 모두 추가 연산이기 때문입니다. 그래서 Anthropic은 병렬 시스템이 동시에 돌아가도 **전체적으로는 단일 에이전트보다 오래 걸리는 경우가 많다** 고 안내하고, 병렬화의 주된 이득을 속도가 아니라 *철저함* 으로 봅니다. 리서치 시스템처럼 복잡한 질의에서 시간을 크게 줄인 사례도 있지만, 그것은 설계를 다듬은 결과이지 병렬화의 기본값이 아닙니다.

1. **오답** - 각 서브에이전트의 컨텍스트가 작아지는 것은 맞지만, 서브에이전트 다섯 개와 리드의 조정 비용을 합친 총 토큰은 늘어납니다. 시간도 자동으로 줄지 않습니다.
2. **오답** - 단순히 다섯으로 나누면 시간이 5분의 1이 된다는 계산은 조정·종합 비용과 가장 느린 서브에이전트를 무시합니다. 토큰이 그대로라는 것도 사실과 반대입니다.
3. **오답** - 토큰 사용량이 준다는 전제가 틀렸습니다. 멀티에이전트는 토큰을 더 쓰는 대신 더 넓게 탐색하는 구조입니다.
4. **정답** - 토큰은 확실히 늘고, 시간은 보장되지 않으며, 얻는 것은 탐색의 폭과 철저함이라는 Anthropic 안내와 일치합니다.

> 💡 **시험 포인트:** "병렬 서브에이전트 = 더 빠르고 더 싸다"는 보기는 오답입니다. 멀티에이전트는 결과의 가치가 늘어난 토큰 비용을 정당화하는 작업에만 씁니다.

> 📚 근거 문서: [Building multi-agent systems: when and how to use them](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them) · [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

---

## 문제 8
### **A single-agent support copilot shows three problems: (a) its context fills with dozens of raw log files before it starts reasoning, (b) it investigates three unrelated root-cause hypotheses one after another, and (c) with 45 tools spanning billing, CRM, and infrastructure, it often picks the wrong tool. Which mapping of each problem to the subagent benefit that addresses it is correct?**

| 보기 | 설명 |
|------|------|
| 1. (a) parallel exploration, (b) specialization with focused toolsets, (c) context isolation | |
| 2. (a) specialization with focused toolsets, (b) context isolation, (c) parallel exploration | |
| **3. (a) context isolation, (b) parallel exploration, (c) specialization with focused toolsets** | |
| 4. (a) context isolation, (b) specialization with focused toolsets, (c) parallel exploration | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

에이전트 하나로 된 지원 코파일럿에 세 가지 문제가 있습니다. (a) 추론을 시작하기도 전에 원본 로그 파일 수십 개가 컨텍스트를 채우고, (b) 서로 관련 없는 근본 원인 가설 세 개를 하나씩 차례로 조사하며, (c) 결제·CRM·인프라에 걸친 도구 45개 중에서 엉뚱한 도구를 자주 고릅니다. 각 문제와 그것을 해결하는 서브에이전트의 이점을 올바르게 짝지은 것은 무엇일까요?

- **①** (a) 병렬 탐색, (b) 도구를 좁힌 전문화, (c) 컨텍스트 격리
- **②** (a) 도구를 좁힌 전문화, (b) 컨텍스트 격리, (c) 병렬 탐색
- **③** (a) 컨텍스트 격리, (b) 병렬 탐색, (c) 도구를 좁힌 전문화
- **④** (a) 컨텍스트 격리, (b) 도구를 좁힌 전문화, (c) 병렬 탐색

> **핵심 진단:** 서브에이전트가 결과를 개선하는 경우는 세 가지이고, 각각 해결하는 증상이 다릅니다.

| 증상 | 서브에이전트의 이점 | 작동 방식 |
|---|---|---|
| 대량의 중간 자료가 메인 컨텍스트를 채움 | **컨텍스트 격리** | 서브에이전트가 로그를 읽고 짧은 요약만 돌려준다 |
| 독립적인 갈래를 하나씩 조사 | **병렬 탐색** | 가설마다 서브에이전트를 두고 동시에 조사한다 |
| 도구가 너무 많아 선택이 흔들림 | **전문화** | 영역별 서브에이전트에 좁힌 도구와 맞춤 프롬프트를 준다 |

1. **오답** - 로그가 컨텍스트를 채우는 문제는 병렬화로 해결되지 않습니다. 도구 선택 혼란도 컨텍스트 격리가 아니라 도구를 좁힌 전문화가 해결합니다.
2. **오답** - 세 짝이 모두 어긋났습니다. 가설을 하나씩 조사하는 문제는 격리가 아니라 병렬 탐색, 도구가 너무 많은 문제는 병렬 탐색이 아니라 전문화가 해결합니다.
3. **정답** - 대량 자료는 격리, 독립 갈래는 병렬 탐색, 많은 도구는 좁힌 도구 세트의 전문화로 각각 해결됩니다.
4. **오답** - (a)는 맞지만 (b)와 (c)가 뒤바뀌었습니다. 독립 가설의 순차 조사는 병렬 탐색, 도구 혼란은 전문화가 해결합니다.

> 💡 **시험 포인트:** 서브에이전트를 쓸 근거는 '컨텍스트가 넘친다(격리)', '독립 갈래가 있다(병렬)', '도구·도메인이 너무 섞였다(전문화)' 세 가지입니다. 이 신호가 없으면 단일 에이전트가 기본입니다.

> 📚 근거 문서: [Building multi-agent systems: when and how to use them](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

---

## 문제 9
### **Every pull request is reviewed by three Claude calls that run at the same time: one checks for SQL injection risks, one for performance regressions, and one for missing tests. A script then merges the three sets of findings into a single PR comment. Which pattern is this?**

| 보기 | 설명 |
|------|------|
| 1. Parallelization by voting | |
| **2. Parallelization by sectioning** | |
| 3. Orchestrator-workers | |
| 4. Prompt chaining | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.1 Agent Architecture

**📝 문제 번역**

모든 풀 리퀘스트를 Claude 호출 세 개가 동시에 검토합니다. 하나는 SQL 인젝션 위험, 하나는 성능 저하, 하나는 누락된 테스트를 확인합니다. 그다음 스크립트가 세 가지 지적 사항을 PR 댓글 하나로 합칩니다. 이것은 어떤 패턴일까요?

- **①** 투표 방식 병렬화
- **②** 섹셔닝 방식 병렬화
- **③** 오케스트레이터-워커
- **④** 프롬프트 체이닝

> **핵심 진단:** 병렬화 패턴에는 두 변형이 있습니다. **섹셔닝** 은 작업을 서로 독립적인 하위 작업으로 나눠 동시에 실행하고 결과를 합치는 것이고, **투표** 는 *같은 작업* 을 여러 번 실행해 다양한 출력을 비교·집계하는 것입니다. 이 시스템의 세 호출은 서로 다른 관점(보안·성능·테스트)을 맡으므로 섹셔닝입니다. 갈래가 미리 고정되어 있고 결과는 스크립트가 합치므로, 실행 중에 하위 작업을 정하는 오케스트레이터도 없습니다.

1. **오답** - 투표라면 같은 검토(예: SQL 인젝션 검사)를 세 번 돌려 다수결이나 임계값으로 판정해야 합니다. 여기서는 세 호출이 서로 다른 일을 합니다.
2. **정답** - 독립적인 관점별 검토를 동시에 돌려 결과를 합치는 전형적인 섹셔닝입니다. 각 호출이 한 관점에 집중하므로 하나의 호출에 모든 검토를 맡길 때보다 결과가 좋아지는 경우가 많습니다.
3. **오답** - 오케스트레이터-워커는 중앙 LLM이 입력을 보고 어떤 하위 작업이 필요한지 *실행 중에* 정합니다. 이 시스템은 PR이 무엇이든 늘 같은 세 검토를 돌립니다.
4. **오답** - 체이닝은 앞 단계의 출력을 다음 단계가 받아 처리하는 순차 구조입니다. 세 검토는 서로의 출력을 쓰지 않고 동시에 실행됩니다.

> 💡 **시험 포인트:** 동시에 도는 갈래가 *서로 다른 일* 이면 섹셔닝, *같은 일의 반복* 이면 투표, 갈래를 *모델이 그때 정하면* 오케스트레이터-워커입니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 10
### **A logistics startup wants to embed an agent in its own Python backend. The agent must read and edit files in a working directory, run shell commands, resume earlier sessions, and fire lifecycle hooks, and the team wants all of it to run inside a process it operates. Which description matches the Claude Agent SDK, the option the team is considering?**

| 보기 | 설명 |
|------|------|
| 1. A hosted agent harness where Anthropic runs the loop in a cloud sandbox and the app exchanges events with it. | |
| 2. A thin API client where the team defines each tool schema, executes every tool, and writes the tool-use loop itself. | |
| **3. A library that runs Claude Code's agent loop, built-in tools, permissions, sessions, and hooks inside the team's own process.** | |
| 4. A terminal application built for interactive development and one-off tasks that a developer types by hand. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

한 물류 스타트업이 자사 Python 백엔드에 에이전트를 넣으려 합니다. 에이전트는 작업 디렉터리의 파일을 읽고 수정하고, 셸 명령을 실행하고, 이전 세션을 재개하고, 수명 주기 훅을 실행할 수 있어야 하며, 팀은 이 모든 것이 자기들이 운영하는 프로세스 안에서 돌기를 원합니다. 팀이 검토 중인 Claude Agent SDK를 올바르게 설명한 것은 무엇일까요?

- **①** Anthropic이 클라우드 샌드박스에서 루프를 돌리고 앱은 이벤트를 주고받는 호스팅형 에이전트 하네스다
- **②** 팀이 도구 스키마를 정의하고, 모든 도구를 실행하고, 도구 사용 루프도 직접 작성하는 얇은 API 클라이언트다
- **③** Claude Code의 에이전트 루프, 내장 도구, 권한, 세션, 훅을 팀 자신의 프로세스 안에서 실행하는 라이브러리다
- **④** 개발자가 직접 입력하는 대화형 개발과 일회성 작업을 위해 만든 터미널 애플리케이션이다

> **핵심 진단:** 공식 문서는 Agent SDK를 "Claude Code를 라이브러리로" 쓰는 방법으로 소개합니다. 내가 운영하는 Python·TypeScript 애플리케이션 안에 Claude Code의 **에이전트 루프, 내장 도구, 권한, 세션, 훅** 을 그대로 들여오는 것이 핵심입니다. 네 가지 구축 경로는 *루프를 누가 돌리고 도구를 누가 실행하느냐* 로 갈립니다. Client SDK는 루프와 도구 실행을 내가 맡고, Managed Agents는 Anthropic이 하네스를 호스팅하며, CLI는 터미널에서 쓰는 대화형 앱입니다.

1. **오답** - Anthropic이 하네스를 호스팅하고 앱이 이벤트로 소통하는 것은 Managed Agents입니다. 팀은 자기 프로세스 안에서 돌기를 원하므로 요구와도 맞지 않습니다.
2. **오답** - 도구 스키마 정의, 실행, 루프 작성을 모두 직접 하는 것은 Client SDK 경로입니다. Agent SDK는 내장 도구와 루프를 이미 제공합니다.
3. **정답** - Agent SDK는 Claude Code가 쓰는 도구·루프·컨텍스트 관리를 라이브러리로 제공하며, 권한·세션·훅·서브에이전트도 함께 씁니다.
4. **오답** - 대화형 개발과 일회성 작업용 터미널 인터페이스는 Claude Code CLI입니다. 제품 백엔드에 내장하는 용도가 아닙니다.

> 💡 **시험 포인트:** "Claude Code의 기능을 *우리 프로세스 안에서*"는 Agent SDK, "루프를 직접 짠다"는 Client SDK, "Anthropic이 호스팅"은 Managed Agents, "터미널에서 대화형으로"는 CLI입니다.

> 📚 근거 문서: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) · [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop)

---

## 문제 11
### **A team is mapping Claude Managed Agents concepts onto its design for a contract-review service. Which mapping of each concept to its role is correct? (a) Agent (b) Environment (c) Session (d) Events**

| 보기 | 설명 |
|------|------|
| **1. (a) reusable model, prompt, and tool configuration; (b) where sessions run, cloud or self-hosted sandbox; (c) one running agent instance doing a task; (d) messages exchanged between app and agent** | |
| 2. (a) one running agent instance doing a task; (b) reusable model, prompt, and tool configuration; (c) messages exchanged between app and agent; (d) where sessions run, cloud or self-hosted sandbox | |
| 3. (a) reusable model, prompt, and tool configuration; (b) the model version pinned for every session; (c) a file store shared by all agents in the org; (d) messages exchanged between app and agent | |
| 4. (a) where sessions run, cloud or self-hosted sandbox; (b) reusable model, prompt, and tool configuration; (c) one running agent instance doing a task; (d) a server-side audit log only Anthropic can read | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

한 팀이 계약서 검토 서비스 설계에 Claude Managed Agents의 개념을 대응시키고 있습니다. 각 개념과 역할을 올바르게 짝지은 것은 무엇일까요? (a) Agent (b) Environment (c) Session (d) Events

- **①** (a) 재사용하는 모델·프롬프트·도구 설정, (b) 세션이 실행되는 곳(클라우드 또는 자체 호스팅 샌드박스), (c) 작업 하나를 수행 중인 에이전트 인스턴스, (d) 앱과 에이전트가 주고받는 메시지
- **②** (a) 작업 하나를 수행 중인 에이전트 인스턴스, (b) 재사용하는 모델·프롬프트·도구 설정, (c) 앱과 에이전트가 주고받는 메시지, (d) 세션이 실행되는 곳(클라우드 또는 자체 호스팅 샌드박스)
- **③** (a) 재사용하는 모델·프롬프트·도구 설정, (b) 모든 세션에 고정되는 모델 버전, (c) 조직의 모든 에이전트가 공유하는 파일 저장소, (d) 앱과 에이전트가 주고받는 메시지
- **④** (a) 세션이 실행되는 곳(클라우드 또는 자체 호스팅 샌드박스), (b) 재사용하는 모델·프롬프트·도구 설정, (c) 작업 하나를 수행 중인 에이전트 인스턴스, (d) Anthropic만 읽을 수 있는 서버 측 감사 로그

> **핵심 진단:** Managed Agents는 네 개념으로 이루어집니다.

| 개념 | 공식 정의 |
|---|---|
| **Agent** | 모델, 시스템 프롬프트, 도구, MCP 서버, 스킬. 한 번 만들고 ID로 여러 세션에서 참조 |
| **Environment** | 세션이 실행될 곳의 설정. Anthropic 관리 클라우드 샌드박스 또는 내 인프라의 자체 호스팅 샌드박스 |
| **Session** | environment 안에서 특정 작업을 수행하며 산출물을 만드는 실행 중인 에이전트 인스턴스 |
| **Events** | 앱과 에이전트가 주고받는 메시지(사용자 턴, 도구 결과, 상태 업데이트) |

1. **정답** - 네 짝이 모두 공식 정의와 일치합니다. agent는 재사용 설정, environment는 실행 장소, session은 실행 중인 인스턴스, events는 둘 사이의 메시지입니다.
2. **오답** - 네 짝이 모두 어긋났습니다. 재사용 설정은 agent이고, 실행 중인 인스턴스가 session입니다.
3. **오답** - (a)와 (d)는 맞지만, 모델은 environment가 아니라 agent에 정합니다. session을 공유 파일 저장소로 본 것도 틀렸습니다.
4. **오답** - (c)만 맞습니다. 실행 장소와 재사용 설정이 뒤바뀌었고, events는 감사 로그가 아니라 앱이 직접 주고받고 다시 조회할 수 있는 메시지입니다.

> 💡 **시험 포인트:** 'agent = 무엇으로 일하나(설정)', 'environment = 어디서 도나', 'session = 지금 돌고 있는 일', 'events = 오가는 메시지'로 외워 두세요.

> 📚 근거 문서: [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)

---

## 문제 12
### **A bank's platform team moves its Claude Managed Agents sessions from an Anthropic cloud sandbox to a self-hosted sandbox, running the environment worker on hosts inside the bank's network. Before the switch, the team wants to predict what will run where. Which prediction is accurate?**

| 보기 | 설명 |
|------|------|
| 1. The model, the agent loop, and tool execution all move onto the bank's hosts; Anthropic only issues the environment key. | |
| 2. The worker runs the agent loop locally and calls the Messages API for each turn, so session history lives only on the bank's hosts. | |
| 3. Tool execution stays in Anthropic's cloud sandbox, and the worker only mirrors session files into the bank's network afterward. | |
| **4. Claude and the agent loop stay at Anthropic; the worker runs each requested tool call on a bank host and returns the result through Anthropic's control plane.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

한 은행의 플랫폼 팀이 Claude Managed Agents 세션을 Anthropic 클라우드 샌드박스에서 자체 호스팅 샌드박스로 옮기고, environment worker를 은행 네트워크 안의 호스트에서 실행하려 합니다. 전환 전에 무엇이 어디서 실행될지 예측해 보려 합니다. 올바른 예측은 무엇일까요?

- **①** 모델, 에이전트 루프, 도구 실행이 모두 은행 호스트로 옮겨 오고, Anthropic은 environment 키만 발급한다
- **②** 워커가 에이전트 루프를 로컬에서 돌리며 턴마다 Messages API를 호출하므로, 세션 기록은 은행 호스트에만 남는다
- **③** 도구 실행은 Anthropic 클라우드 샌드박스에 그대로 있고, 워커는 나중에 세션 파일을 은행 네트워크로 복사만 한다
- **④** Claude와 에이전트 루프는 Anthropic에 남고, 워커가 요청된 도구 호출을 은행 호스트에서 실행해 결과를 Anthropic 제어 평면을 거쳐 돌려준다

> **핵심 진단:** 자체 호스팅 샌드박스는 *도구 실행* 을 Anthropic 관리 샌드박스에서 내가 통제하는 인프라로 옮기고, **에이전트 실행은 Anthropic이 계속 맡습니다.** 자체 호스팅 environment는 작업 큐처럼 동작합니다. 세션이 큐에 들어가면 내 워커가 그것을 가져가 스킬과 메모리 저장소를 내려받고, Claude가 Anthropic 쪽에서 도구 호출을 요청하면 워커가 로컬에서 실행해 결과를 돌려보냅니다. 모델이 다음 행동을 정하려면 결과를 받아야 하므로 **도구 입력과 출력은 여전히 Anthropic 제어 평면을 거칩니다.**

1. **오답** - '완전한 온프레미스'로 착각한 보기입니다. 모델과 루프는 옮겨 오지 않습니다. 모델은 environment가 아니라 agent에 설정됩니다.
2. **오답** - 워커는 에이전트 루프를 돌리지 않습니다. 그리고 Managed Agents는 세션 기록을 서버 측에 저장하므로, 자체 호스팅이라도 기록이 은행 호스트에만 있게 되지 않습니다.
3. **오답** - 옮겨 가는 것이 바로 도구 실행입니다. 워커는 도구 호출을 실행하는 주체이지 파일 복사 도구가 아닙니다.
4. **정답** - 루프와 모델은 Anthropic, 도구 실행은 내 호스트라는 분담과 데이터 흐름을 정확히 설명합니다.

> 💡 **시험 포인트:** 자체 호스팅 샌드박스에서 옮겨 오는 것은 도구 실행·파일·네트워크 송신뿐입니다. 이 하위 기능도 ZDR·HIPAA BAA 적용 대상이 아니라는 점까지 함께 기억하세요.

> 📚 근거 문서: [Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) · [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)

---

## 문제 13
### **An agent for a semiconductor fab must run shell commands against a build-artifact server that is reachable only from inside the company's private network. The team does not want to build or operate an agent loop, a sandbox, or a session store. Which setup meets both requirements?**

| 보기 | 설명 |
|------|------|
| 1. Claude Managed Agents in an Anthropic cloud sandbox, with the artifact server's hostname added to the web fetch domain allowlist. | |
| **2. Claude Managed Agents with a self-hosted environment whose worker runs on a host inside the private network.** | |
| 3. The Messages API with the server-executed code_execution tool, running the shell commands against the artifact server. | |
| 4. The Agent SDK running in the team's own Kubernetes cluster inside the private network, with a custom session store. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

한 반도체 공장의 에이전트가 사내 사설망 안에서만 접근할 수 있는 빌드 산출물 서버를 대상으로 셸 명령을 실행해야 합니다. 팀은 에이전트 루프, 샌드박스, 세션 저장소를 만들거나 운영하고 싶지 않습니다. 두 요구를 모두 만족하는 구성은 무엇일까요?

- **①** Anthropic 클라우드 샌드박스의 Claude Managed Agents를 쓰고, 산출물 서버의 호스트 이름을 web fetch 도메인 허용 목록에 추가한다
- **②** 사설망 안의 호스트에서 워커가 실행되는 자체 호스팅 environment로 Claude Managed Agents를 쓴다
- **③** Messages API와 서버 실행 code_execution 도구를 써서 산출물 서버에 셸 명령을 실행한다
- **④** 사설망 안 팀 소유 Kubernetes 클러스터에서 Agent SDK를 실행하고, 맞춤 세션 저장소를 붙인다

> **핵심 진단:** 요구는 두 개입니다. 첫째, 도구(셸 명령)가 **사설망 안에서** 실행되어야 하고, 둘째, 루프·샌드박스·세션 저장소를 **직접 운영하지 않아야** 합니다. Managed Agents는 하네스와 세션 상태를 Anthropic이 맡으므로 둘째 요구를 채우고, 자체 호스팅 environment는 도구 실행을 내 인프라의 워커로 옮기므로 첫째 요구를 채웁니다. 워커는 아웃바운드 HTTPS만 있으면 되므로 사설망 안쪽 호스트에 둘 수 있습니다.

1. **오답** - 클라우드 샌드박스는 Anthropic 인프라에서 돌기 때문에, 허용 목록에 이름을 넣어도 사설망 안에서만 닿는 서버에는 접근할 수 없습니다. 허용 목록은 접근 범위를 *제한* 하는 장치이지 사설망으로 들어가는 통로가 아닙니다.
2. **정답** - 루프와 세션은 Anthropic이 운영하고, 셸 명령은 사설망 안의 워커가 실행합니다. 두 요구를 함께 만족하는 유일한 구성입니다.
3. **오답** - code_execution은 Anthropic이 실행하는 서버 도구라 사설망 안의 서버에 닿지 않습니다. 또한 Messages API 경로는 에이전트 루프를 직접 운영해야 합니다.
4. **오답** - 네트워크 요구는 채우지만, Agent SDK를 자체 호스팅하면 샌드박싱·세션 저장·확장을 팀이 운영해야 합니다. '운영하고 싶지 않다'는 요구를 어깁니다.

> 💡 **시험 포인트:** "Anthropic이 루프를 돌리되 도구는 우리 망 안에서"는 Managed Agents + 자체 호스팅 샌드박스입니다. 사설 *MCP 서버* 에 닿는 것만이 목적이라면 클라우드 샌드박스와 MCP 터널을 쓰는 방법도 있지만, 이 시나리오처럼 셸 명령이 사설망에서 실행되어야 하면 자체 호스팅이 답입니다.

> 📚 근거 문서: [Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) · [Hosting the Agent SDK](https://code.claude.com/docs/en/agent-sdk/hosting)

---

## 문제 14
### **An engineer logs every message that a single-shot Agent SDK query() yields while Claude makes two tool calls one after another and then answers. Which sequence of message types should the log show?**

| 보기 | 설명 |
|------|------|
| 1. AssistantMessage (tool_use) → SystemMessage (init) → UserMessage (tool_result) → AssistantMessage (tool_use) → UserMessage (tool_result) → ResultMessage → AssistantMessage (text only) | |
| 2. SystemMessage (init) → UserMessage (tool_result) → AssistantMessage (tool_use) → UserMessage (tool_result) → AssistantMessage (tool_use) → ResultMessage | |
| **3. SystemMessage (init) → AssistantMessage (tool_use) → UserMessage (tool_result) → AssistantMessage (tool_use) → UserMessage (tool_result) → AssistantMessage (text only) → ResultMessage** | |
| 4. SystemMessage (init) → AssistantMessage (tool_use) → AssistantMessage (tool_use) → ResultMessage → UserMessage (tool_result) → UserMessage (tool_result) | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

한 엔지니어가 단발성 Agent SDK `query()`가 내보내는 모든 메시지를 기록합니다. 이 실행에서 Claude는 도구를 두 번 차례로 호출한 뒤 답합니다. 기록에 나타나야 하는 메시지 유형의 순서는 무엇일까요?

- **①** AssistantMessage (tool_use) → SystemMessage (init) → UserMessage (tool_result) → AssistantMessage (tool_use) → UserMessage (tool_result) → ResultMessage → AssistantMessage (텍스트만)
- **②** SystemMessage (init) → UserMessage (tool_result) → AssistantMessage (tool_use) → UserMessage (tool_result) → AssistantMessage (tool_use) → ResultMessage
- **③** SystemMessage (init) → AssistantMessage (tool_use) → UserMessage (tool_result) → AssistantMessage (tool_use) → UserMessage (tool_result) → AssistantMessage (텍스트만) → ResultMessage
- **④** SystemMessage (init) → AssistantMessage (tool_use) → AssistantMessage (tool_use) → ResultMessage → UserMessage (tool_result) → UserMessage (tool_result)

> **핵심 진단:** 루프는 이렇게 흐릅니다. 프롬프트를 받으면 세션 메타데이터를 담은 **`SystemMessage`(`init`)** 가 먼저 나오고, Claude가 도구를 부르면 **`AssistantMessage`(`tool_use`)**, SDK가 도구를 실행한 뒤에는 결과를 담은 **`UserMessage`(`tool_result`)** 가 나옵니다. 이 쌍이 도구 호출마다 반복되고, 도구 호출이 없는 응답이 나오면 **텍스트만 있는 마지막 `AssistantMessage`** 와 최종 텍스트·사용량·비용·세션 ID를 담은 **`ResultMessage`** 로 끝납니다.

1. **오답** - `init`은 루프가 시작될 때 나오고, `ResultMessage`는 마지막 텍스트 응답 *뒤에* 루프의 끝을 표시합니다. 두 위치가 모두 틀렸습니다.
2. **오답** - 도구 결과가 도구 호출보다 먼저 나올 수는 없습니다. 마지막 텍스트 응답도 빠져 있습니다.
3. **정답** - init → (도구 호출 → 결과) × 2 → 텍스트만 있는 응답 → 결과 메시지라는 실제 순서와 일치합니다.
4. **오답** - 도구 결과는 각 호출이 실행된 직후 피드백되므로 `ResultMessage` 뒤로 밀리지 않습니다. 마지막 텍스트 응답도 없습니다.

> 💡 **시험 포인트:** 루프는 `ResultMessage`로 끝나지만, `prompt_suggestion` 같은 시스템 이벤트가 그 뒤에 몇 개 더 올 수 있습니다. 결과 메시지에서 바로 빠져나오지 말고 스트림을 끝까지 읽으세요.

> 📚 근거 문서: [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop)

---

## 문제 15
### **A legal-tech company wants agents that each spend two to six hours reviewing a data room with many tool calls, while users check back later. The team has no capacity to run containers, sandboxing, orchestration, or session persistence. Which approach fits best?**

| 보기 | 설명 |
|------|------|
| **1. Claude Managed Agents, which hosts the agent harness and sandbox and keeps session state on the server side.** | |
| 2. The Agent SDK on serverless functions, with each invocation resuming the session from the function's local disk. | |
| 3. The Agent SDK on a fleet of VMs that the team patches and scales, with a custom SessionStore adapter. | |
| 4. The Messages API with a hand-written loop that executes the review tools on each user's laptop. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

한 리걸테크 회사가 데이터룸 검토에 각각 두 시간에서 여섯 시간을 쓰며 도구를 많이 호출하는 에이전트를 원하고, 사용자는 나중에 결과를 확인합니다. 팀에는 컨테이너, 샌드박싱, 오케스트레이션, 세션 영속화를 운영할 여력이 없습니다. 가장 알맞은 방법은 무엇일까요?

- **①** 에이전트 하네스와 샌드박스를 호스팅하고 세션 상태를 서버 측에 보관하는 Claude Managed Agents
- **②** 서버리스 함수에서 Agent SDK를 돌리고, 호출마다 함수의 로컬 디스크에서 세션을 재개한다
- **③** 팀이 패치하고 확장하는 VM 무리에서 Agent SDK를 돌리고, 맞춤 SessionStore 어댑터를 붙인다
- **④** 사용자 노트북마다 검토 도구를 실행하는 수작업 루프를 Messages API로 만든다

> **핵심 진단:** 공식 문서는 Managed Agents를 **장시간 작업과 비동기 작업** 에 맞는 선택으로 설명하고, 적합한 조건으로 몇 분~몇 시간 이어지는 실행, 최소한의 인프라(루프·샌드박스·도구 실행 계층을 직접 만들 필요 없음), 상태를 가진 세션을 꼽습니다. 반대로 Agent SDK를 직접 호스팅하면 하위 프로세스·작업 디렉터리·세션 파일이 로컬 디스크에 묶이므로, 샌드박싱·세션 저장·확장·관측을 모두 팀이 맡아야 합니다.

1. **정답** - 하네스·샌드박스·세션 상태를 Anthropic이 운영하므로, 운영 여력이 없는 팀의 장시간 비동기 작업에 맞습니다.
2. **오답** - 서버리스 컨테이너의 로컬 디스크는 재시작이나 축소 때 사라집니다. 이런 패턴에는 SessionStore가 필수이고, 몇 시간짜리 실행과 샌드박싱도 팀이 감당해야 합니다.
3. **오답** - 기술적으로는 가능하지만, VM 패치·확장·세션 저장소를 운영하는 것이 바로 팀이 할 수 없다고 한 일입니다.
4. **오답** - 루프와 도구 실행을 모두 직접 만들어야 하고, 사용자 노트북에서 몇 시간씩 도구를 돌리는 것은 비동기 작업의 취지와도 맞지 않습니다.

> 💡 **시험 포인트:** '몇 시간짜리 비동기 작업 + 인프라를 운영하고 싶지 않다'는 Managed Agents의 신호입니다. 다만 ZDR이 요구 조건이면 Managed Agents는 후보에서 빠진다는 점도 함께 확인하세요.

> 📚 근거 문서: [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview) · [Hosting the Agent SDK](https://code.claude.com/docs/en/agent-sdk/hosting)

---

## 문제 16
### **A query() call sets allowedTools to `["Read", "Grep"]`, uses permissionMode `"default"`, and passes a canUseTool callback. During the run, Claude decides to run `npm install` with the Bash tool. What happens?**

| 보기 | 설명 |
|------|------|
| 1. The call fails immediately, because Bash is not in allowedTools and so Claude never sees the Bash tool. | |
| 2. The call runs without a prompt, because allowedTools restricts only the read-only tools it lists. | |
| 3. The SDK silently removes Bash from the session and returns an empty tool result to Claude. | |
| **4. Bash stays available; the call matches no allow rule, so it falls through to the permission mode and canUseTool decides.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

`query()` 호출이 allowedTools를 `["Read", "Grep"]`으로 설정하고, permissionMode는 `"default"`이며, canUseTool 콜백을 넘깁니다. 실행 중에 Claude가 Bash 도구로 `npm install`을 실행하기로 합니다. 어떻게 될까요?

- **①** Bash가 allowedTools에 없으므로 Claude는 Bash 도구를 보지 못하고 호출은 즉시 실패한다
- **②** allowedTools는 나열한 읽기 전용 도구에만 제한을 거므로 호출은 묻지 않고 실행된다
- **③** SDK가 조용히 Bash를 세션에서 빼고 Claude에게 빈 도구 결과를 돌려준다
- **④** Bash는 그대로 쓸 수 있다. 호출이 어떤 allow 규칙에도 맞지 않으므로 권한 모드로 넘어가고 canUseTool이 결정한다

> **핵심 진단:** `allowedTools`는 나열한 도구를 **자동 승인** 할 뿐, 나머지를 막지 않습니다. 공식 문서는 목록에 없는 도구도 여전히 사용할 수 있고, 승인이 필요한 호출은 권한 모드와 `canUseTool`로 넘어간다고 설명합니다. 평가 순서는 훅 → deny 규칙 → ask 규칙 → 권한 모드 → allow 규칙 → `canUseTool`입니다. `default` 모드는 모드 차원의 자동 승인이 없으므로, 읽기 전용이 아닌 `npm install`은 마지막 단계인 콜백까지 갑니다.

1. **오답** - 도구 정의를 요청에서 빼는 것은 `disallowedTools`에 도구 이름을 넣었을 때입니다. `allowedTools`에 없다는 이유로 도구가 사라지지는 않습니다.
2. **오답** - `allowedTools`는 '제한'이 아니라 '자동 승인 목록'입니다. 목록에 없는 Bash 호출이 묻지 않고 실행될 근거가 없습니다.
3. **오답** - SDK가 도구를 조용히 빼는 동작은 없습니다. 거부되는 경우에는 Claude가 거부 메시지를 도구 결과로 받습니다.
4. **정답** - 목록에 없는 도구는 남아 있고, 승인이 필요한 호출은 권한 모드를 거쳐 `canUseTool` 콜백이 허용·거부를 정합니다.

> 💡 **시험 포인트:** 도구를 *막으려면* `disallowedTools`, *묻지 않고 실행하려면* `allowedTools`입니다. `bypassPermissions`에서는 `allowedTools`에 없는 도구까지 승인되므로 더더욱 `allowedTools`를 제한 수단으로 보면 안 됩니다.

> 📚 근거 문서: [Configure permissions (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/permissions) · [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop)

---

## 문제 17
### **A data-pipeline agent runs with permissionMode set to bypassPermissions inside an isolated CI container. Security requires that the agent can never write to any .env file through the Write or Edit tools, even in that mode. Which control meets the requirement?**

| 보기 | 설명 |
|------|------|
| 1. Add the instruction "Never modify .env files" to the system prompt and to the project CLAUDE.md. | |
| 2. Remove Write and Edit from allowedTools so that calls to them are no longer auto-approved. | |
| **3. Register a PreToolUse hook with a Write or Edit matcher that returns permissionDecision "deny" for .env paths.** | |
| 4. Pass a canUseTool callback that rejects any call whose file_path argument names a .env file. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

데이터 파이프라인 에이전트가 격리된 CI 컨테이너 안에서 permissionMode를 bypassPermissions로 설정해 실행됩니다. 보안 요구사항은 그 모드에서도 에이전트가 Write나 Edit 도구로 .env 파일에 절대 쓸 수 없어야 한다는 것입니다. 이 요구를 만족하는 통제는 무엇일까요?

- **①** 시스템 프롬프트와 프로젝트 CLAUDE.md에 "절대 .env 파일을 수정하지 마라"는 지시를 넣는다
- **②** Write와 Edit를 allowedTools에서 빼서 더 이상 자동 승인되지 않게 한다
- **③** Write 또는 Edit 매처를 단 PreToolUse 훅을 등록해, .env 경로에 대해 permissionDecision "deny"를 돌려준다
- **④** file_path 인수가 .env 파일을 가리키는 호출을 거부하는 canUseTool 콜백을 넘긴다

> **핵심 진단:** 권한 평가는 **훅이 맨 앞** 입니다. 공식 문서는 모든 도구 호출에서 반드시 실행되어야 하는 검사에는 `PreToolUse` 훅을 쓰라고 하며, 훅은 다른 모든 단계보다 먼저 실행되고 훅의 deny는 `bypassPermissions` 모드에서도 적용된다고 설명합니다. 매처로 Write·Edit만 골라 콜백 안에서 `tool_input.file_path`를 검사하고, `.env`면 `permissionDecision: "deny"`와 이유를 돌려주면 됩니다.

```python
async def guard_env(input_data, tool_use_id, context):
    path = input_data["tool_input"].get("file_path", "")
    if path.split("/")[-1].lower() == ".env":
        return {"hookSpecificOutput": {
            "hookEventName": input_data["hook_event_name"],
            "permissionDecision": "deny",
            "permissionDecisionReason": "secrets file is read-only"}}
    return {}
```

1. **오답** - 프롬프트와 CLAUDE.md는 모델이 대체로 따르게 하는 맥락일 뿐 강제력이 없습니다. "절대"라는 요구에는 실행을 막는 장치가 필요합니다.
2. **오답** - `bypassPermissions`는 `allowedTools`에 없는 도구까지 승인하므로, 목록에서 빼도 Write·Edit는 그대로 실행됩니다.
3. **정답** - 훅은 권한 모드보다 먼저 평가되고, 훅의 deny는 bypass 모드에서도 유지됩니다. 거부 이유는 Claude에게 전달됩니다.
4. **오답** - 자동 승인된 호출은 `canUseTool`에 도달하지 않습니다. `bypassPermissions`에서는 거의 모든 호출이 콜백 전에 승인되므로 콜백 속 검사는 조용히 우회됩니다.

> 💡 **시험 포인트:** bypass 모드에서도 남는 통제는 훅, deny 규칙(`disallowedTools`·설정 파일), 명시적 ask 규칙입니다. 프롬프트 지시와 `canUseTool`은 남지 않습니다. 또 Write·Edit 매처는 Bash로 쓰는 경우를 잡지 못한다는 한계도 기억하세요.

> 📚 근거 문서: [Intercept and control agent behavior with hooks](https://code.claude.com/docs/en/agent-sdk/hooks) · [Configure permissions (Agent SDK)](https://code.claude.com/docs/en/agent-sdk/permissions)

---

## 문제 18
### **A compliance team writes `hooks={"____": [HookMatcher(hooks=[inspect_call])]}` so that inspect_call sees each tool call's arguments and can reject the call before the tool executes. Which event name fills the blank?**

| 보기 | 설명 |
|------|------|
| 1. PostToolUse | |
| **2. PreToolUse** | |
| 3. PermissionRequest | |
| 4. UserPromptSubmit | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

컴플라이언스 팀이 `hooks={"____": [HookMatcher(hooks=[inspect_call])]}`를 작성해, inspect_call이 모든 도구 호출의 인수를 보고 도구가 실행되기 전에 호출을 거부할 수 있게 하려 합니다. 빈칸에 들어갈 이벤트 이름은 무엇일까요?

- **①** PostToolUse
- **②** PreToolUse
- **③** PermissionRequest
- **④** UserPromptSubmit

> **핵심 진단:** **`PreToolUse`** 는 도구 호출 요청이 나온 뒤 *실행되기 전* 에 발생하며, 호출을 막거나 입력을 바꿀 수 있는 이벤트입니다. 콜백은 `tool_name`과 `tool_input`을 받고, `permissionDecision`으로 허용·거부·확인·보류를 정합니다. 매처를 생략하면 모든 도구 호출에 대해 실행되므로 '모든 호출 검사'라는 요구에도 맞습니다.

| 이벤트 | 발생 시점 |
|---|---|
| `PreToolUse` | 도구 실행 전 (차단·수정 가능) |
| `PostToolUse` | 도구가 결과를 돌려준 뒤 |
| `PermissionRequest` | 호출에 권한 결정이 필요할 때 |
| `UserPromptSubmit` | 프롬프트가 제출될 때 |

1. **오답** - `PostToolUse`는 도구가 이미 실행된 뒤에 발생합니다. 결과에 맥락을 더하거나 교체할 수는 있지만 실행을 막지는 못합니다.
2. **정답** - 실행 전에 모든 호출의 인수를 보고 거부할 수 있는 도구 이벤트입니다.
3. **오답** - `PermissionRequest`는 권한 결정이 *필요한* 호출에서만 발생합니다. 자동 승인되는 호출에서는 불리지 않으므로 '모든 호출 검사'를 보장하지 못합니다.
4. **오답** - `UserPromptSubmit`은 프롬프트 제출 시점의 이벤트로, 도구 호출의 인수를 다루지 않습니다.

> 💡 **시험 포인트:** "실행 *전* 에 막는다"는 PreToolUse, "실행 *후* 에 기록·변환한다"는 PostToolUse입니다. 이 둘이 빈칸 문항의 기본 짝입니다.

> 📚 근거 문서: [Intercept and control agent behavior with hooks](https://code.claude.com/docs/en/agent-sdk/hooks)

---

## 문제 19
### **A PreToolUse hook must quietly redirect every Write call from the project directory into a scratch directory, with no human prompt and without asking Claude to retry. What should the hook return in hookSpecificOutput?**

| 보기 | 설명 |
|------|------|
| **1. permissionDecision "allow", together with updatedInput that carries the rewritten file_path** | |
| 2. permissionDecision "ask", together with updatedInput that carries the rewritten file_path | |
| 3. permissionDecision "defer", together with updatedInput that carries the rewritten file_path | |
| 4. permissionDecision "deny", with a reason telling Claude to call Write again using the scratch path | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

PreToolUse 훅이 프로젝트 디렉터리로 향하는 모든 Write 호출을 사람의 확인 없이, 그리고 Claude에게 다시 시도하라고 하지 않고 조용히 임시 디렉터리로 돌려야 합니다. 훅은 hookSpecificOutput에 무엇을 돌려줘야 할까요?

- **①** permissionDecision "allow"와 함께, 바꾼 file_path를 담은 updatedInput
- **②** permissionDecision "ask"와 함께, 바꾼 file_path를 담은 updatedInput
- **③** permissionDecision "defer"와 함께, 바꾼 file_path를 담은 updatedInput
- **④** permissionDecision "deny"와 함께, 임시 경로로 Write를 다시 호출하라는 이유

> **핵심 진단:** 공식 문서는 `updatedInput`을 **`permissionDecision: "allow"`와 짝지으면 수정된 입력이 자동 승인** 되고, `"ask"`와 짝지으면 사용자에게 보여 준다고 설명합니다. 또 **`"defer"`와 함께 보내면 `updatedInput`이 무시됩니다.** 원래 `tool_input`을 바꾸지 말고 새 객체를 돌려줘야 하며, `updatedInput`은 최상위가 아니라 `hookSpecificOutput` 안에 넣어야 적용됩니다.

```python
return {"hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "updatedInput": {**tool_input, "file_path": "/scratch" + path},
}}
```

1. **정답** - 입력을 고친 채 묻지 않고 실행하므로 '사람 확인 없이, 재시도 요청 없이'라는 두 조건을 모두 만족합니다.
2. **오답** - `"ask"`는 수정된 입력을 사람에게 보여 주고 승인을 받습니다. '사람 확인 없이'라는 조건을 어깁니다.
3. **오답** - `"defer"`는 턴을 끝내고 나중에 재개하는 결정이며, 이때 `updatedInput`은 버려집니다.
4. **오답** - deny는 호출을 막고 이유를 모델에게 알리므로, Claude가 다시 호출해야 하는 추가 턴이 생깁니다. '조용히'가 아닙니다.

> 💡 **시험 포인트:** 입력을 조용히 고쳐 실행 = `allow` + `updatedInput`, 고친 입력을 사람이 확인 = `ask` + `updatedInput`, `defer`는 `updatedInput`을 무시합니다.

> 📚 근거 문서: [Intercept and control agent behavior with hooks](https://code.claude.com/docs/en/agent-sdk/hooks)

---

## 문제 20
### **A team defines a subagent named invoice-matcher with a detailed 600-word prompt and a narrow toolset, but its description field just says "Helper agent." Claude keeps handling invoice reconciliation in the main conversation and never delegates. Which change most directly addresses this?**

| 보기 | 설명 |
|------|------|
| 1. Expand the prompt field with more worked examples of how to reconcile invoices correctly. | |
| 2. Add more tools to the subagent's tools list so that it appears more capable to Claude. | |
| 3. Set the subagent's model to a larger model so that Claude trusts its output more. | |
| **4. Rewrite the description to say specifically which tasks the subagent handles and when to use it.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.2 Agent Construction with Claude

**📝 문제 번역**

한 팀이 invoice-matcher라는 서브에이전트를 600단어짜리 상세한 프롬프트와 좁은 도구 세트로 정의했지만, description 필드에는 "Helper agent."라고만 적었습니다. Claude는 계속 메인 대화에서 송장 대사 작업을 직접 처리하고 위임하지 않습니다. 이 문제를 가장 직접적으로 해결하는 변경은 무엇일까요?

- **①** 송장을 올바르게 대사하는 풀이 예시를 prompt 필드에 더 추가한다
- **②** 서브에이전트가 Claude에게 더 유능해 보이도록 tools 목록에 도구를 더 넣는다
- **③** Claude가 결과를 더 신뢰하도록 서브에이전트의 model을 더 큰 모델로 바꾼다
- **④** 서브에이전트가 어떤 작업을 맡고 언제 써야 하는지 구체적으로 적도록 description을 다시 쓴다

> **핵심 진단:** Claude는 작업 내용과 각 서브에이전트의 **`description`** 을 보고 위임 여부를 *자동으로* 정합니다. `description`은 "이 에이전트를 언제 쓰는가"를 설명하는 필수 필드이고, `prompt`는 위임된 *뒤* 서브에이전트가 어떻게 행동할지를 정합니다. "Helper agent." 같은 설명으로는 송장 대사와 연결할 근거가 없으니 위임이 일어나지 않습니다. 공식 문서의 문제 해결 안내도 설명을 명확하게 쓰는 것과 프롬프트에서 이름으로 지목하는 것을 꼽습니다.

1. **오답** - `prompt`는 위임된 뒤의 행동을 정합니다. 아무리 다듬어도 Claude가 위임을 결정하는 데에는 쓰이지 않습니다.
2. **오답** - 도구 목록은 서브에이전트가 할 수 있는 일을 정할 뿐 위임 판단의 근거가 되지 않습니다. 오히려 좁은 도구 세트의 이점을 잃습니다.
3. **오답** - 모델 크기는 위임 여부와 무관합니다. 위임 판단은 설명과 작업의 일치로 이루어집니다.
4. **정답** - 언제 쓰는지 구체적으로 적은 설명이 있어야 Claude가 송장 대사 요청을 이 서브에이전트와 맞출 수 있습니다.

> 💡 **시험 포인트:** 서브에이전트가 *불리지 않으면* description, *불렸는데 엉뚱하게 일하면* prompt, *해서는 안 될 일을 할 수 있으면* tools를 봅니다. 확실히 부르려면 프롬프트에서 이름으로 지목합니다.

> 📚 근거 문서: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

---

## 문제 21
### **A news-briefing app sends one Messages API request with the web_search server tool enabled. Claude runs three searches and then writes its answer, and the response comes back with stop_reason "end_turn". Predict how many tool_result blocks the app must build for those three searches.**

| 보기 | 설명 |
|------|------|
| 1. Three, one per search, sent together in the next user message before Claude can answer. | |
| 2. One, combining the output of all three searches into a single tool_result block. | |
| **3. None; Anthropic ran the searches, and the response already includes them and their results.** | |
| 4. Three, but only after the app re-sends the response with stop_reason set to pause_turn. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

뉴스 브리핑 앱이 web_search 서버 도구를 켠 Messages API 요청을 한 번 보냅니다. Claude는 검색을 세 번 실행한 뒤 답을 쓰고, 응답은 stop_reason "end_turn"으로 돌아옵니다. 이 세 번의 검색에 대해 앱이 만들어야 하는 tool_result 블록은 몇 개일지 예측해 보세요.

- **①** 세 개. 검색마다 하나씩 만들어 Claude가 답하기 전에 다음 사용자 메시지에 함께 보낸다
- **②** 한 개. 세 검색의 출력을 하나의 tool_result 블록으로 합친다
- **③** 없다. Anthropic이 검색을 실행했고, 응답에 검색과 그 결과가 이미 들어 있다
- **④** 세 개. 단, 앱이 stop_reason을 pause_turn으로 바꿔 응답을 다시 보낸 뒤에 만든다

> **핵심 진단:** 도구는 **코드가 어디서 실행되느냐** 로 나뉩니다. `web_search`·`web_fetch`·`code_execution`·`tool_search` 같은 **서버 실행 도구** 는 Anthropic이 실행하고, 공식 문서는 이런 도구에 대해 "`tool_result` 블록을 직접 만들 일이 없다"고 명시합니다. 서버 측 루프가 검색을 실행하고 결과를 모델에 되먹인 뒤 응답을 돌려주므로, 응답에는 무엇이 실행되었는지 보여 주는 `server_tool_use` 블록과 그 결과가 이미 들어 있습니다. 앱이 할 일은 도구를 켜고 최종 답을 읽는 것입니다.

1. **오답** - 사용자 정의 도구처럼 클라이언트가 실행하는 도구일 때의 처리입니다. 서버 도구의 결과는 Anthropic이 채워 넣습니다.
2. **오답** - 서버 도구에 대해서는 합친 결과든 개별 결과든 앱이 결과 블록을 만들지 않습니다.
3. **정답** - 실행과 결과 반영이 모두 서버 측 루프에서 끝났고, `end_turn`이므로 앱은 결과를 읽기만 하면 됩니다.
4. **오답** - `pause_turn`은 서버 측 루프가 반복 상한에 걸렸을 때 API가 돌려주는 값이지 앱이 설정하는 값이 아닙니다. 그때도 할 일은 받은 응답을 그대로 대화에 붙여 다시 보내는 것이지 결과 블록을 만드는 것이 아닙니다.

> 💡 **시험 포인트:** 서버 도구에서 앱이 개입하는 예외는 두 가지입니다. 루프가 상한에 걸려 `pause_turn`이 왔을 때(응답을 그대로 다시 보낸다)와, Claude가 서버 도구와 클라이언트 도구를 함께 불러 클라이언트 도구의 `tool_result`가 필요할 때입니다.

> 📚 근거 문서: [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) · [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

---

## 문제 22
### **A secondhand marketplace sends each new listing to three Claude prompts at the same time. All three ask the same question, "Is this item prohibited?", but each prompt is worded differently. If any one of them answers yes, the listing is held for human review. Which pattern is this, and why does a threshold of one make sense here?**

| 보기 | 설명 |
|------|------|
| **1. Parallelization by voting; a low threshold reduces missed prohibited items at the cost of more false positives.** | |
| 2. Parallelization by sectioning; the three prompts split the policy into separate areas, so one flag is enough. | |
| 3. Orchestrator-workers; a lead model decides at runtime how many reviewer prompts each listing needs. | |
| 4. Evaluator-optimizer; the later prompts critique and refine the first prompt's verdict before release. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

한 중고 거래 장터가 새 매물 하나를 Claude 프롬프트 세 개에 동시에 보냅니다. 세 프롬프트 모두 "이 물품은 금지 품목인가?"라는 같은 질문을 하지만 문구는 각각 다릅니다. 하나라도 '그렇다'고 답하면 매물은 사람 검토를 위해 보류됩니다. 이것은 어떤 패턴이고, 여기서 기준값을 1로 두는 이유는 무엇일까요?

- **①** 투표 방식 병렬화. 기준을 낮추면 오탐이 늘어나는 대신 금지 품목을 놓치는 경우가 줄어든다
- **②** 섹셔닝 방식 병렬화. 세 프롬프트가 정책을 서로 다른 영역으로 나눠 맡으므로 지적 하나로 충분하다
- **③** 오케스트레이터-워커. 리드 모델이 매물마다 검토 프롬프트가 몇 개 필요한지 실행 중에 정한다
- **④** 평가자-최적화자. 뒤의 프롬프트들이 첫 프롬프트의 판정을 비평하고 다듬은 뒤 내보낸다

> **핵심 진단:** 병렬화의 **투표** 변형은 *같은 작업* 을 여러 번 돌려 다양한 출력을 얻고 집계합니다. Anthropic은 투표의 예로 여러 프롬프트가 같은 코드를 각각 검토해 취약점을 찾으면 표시하는 구성, 그리고 서로 다른 표 기준으로 오탐과 미탐의 균형을 맞추는 콘텐츠 검토를 듭니다. 문구만 다를 뿐 세 프롬프트가 같은 판정을 하므로 섹셔닝이 아니라 투표이고, '하나라도'라는 기준은 놓치면 위험한 금지 품목을 최대한 잡기 위한 선택입니다.

1. **정답** - 같은 질문을 여러 번 묻고 집계하는 투표이며, 낮은 기준값은 미탐을 줄이고 그 대가로 사람 검토가 늘어납니다.
2. **오답** - 섹셔닝은 서로 *다른* 하위 작업을 나눠 맡는 구조입니다. 이 시나리오의 세 프롬프트는 영역을 나누지 않고 같은 질문을 합니다.
3. **오답** - 프롬프트 수는 항상 세 개로 고정되어 있고, 실행 중에 하위 작업을 정하는 리드 모델이 없습니다.
4. **오답** - 세 프롬프트는 동시에 독립적으로 판정하며, 서로의 결과를 평가하거나 피드백해 다시 생성하는 루프가 없습니다.

> 💡 **시험 포인트:** 문구가 달라도 *같은 판정* 을 반복하면 투표입니다. 투표 문항에서는 기준값이 오탐·미탐 중 무엇을 줄이려는 선택인지까지 함께 묻는 경우가 많습니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 23
### **A developer-tools company builds a feature that applies requests such as "replace our deprecated metrics client everywhere" to customer repositories. Which files need changes, and what each change looks like, can only be known after the code is inspected. Which pattern fits best?**

| 보기 | 설명 |
|------|------|
| 1. Parallelization by sectioning, with fixed workers for source files, tests, and documentation. | |
| 2. Prompt chaining, with a fixed sequence of edit, test, and summarize prompts for every request. | |
| 3. Routing, sending each request to a prompt specialized for the repository's main language. | |
| **4. Orchestrator-workers, with a central model choosing the subtasks after inspecting the repository.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

한 개발 도구 회사가 "폐기 예정인 메트릭 클라이언트를 전부 교체해 줘" 같은 요청을 고객 저장소에 적용하는 기능을 만듭니다. 어떤 파일을 바꿔야 하는지, 각 변경이 어떤 모습인지는 코드를 살펴본 뒤에야 알 수 있습니다. 가장 알맞은 패턴은 무엇일까요?

- **①** 섹셔닝 방식 병렬화. 소스 파일·테스트·문서를 맡는 고정된 워커를 둔다
- **②** 프롬프트 체이닝. 모든 요청에 편집·테스트·요약 프롬프트를 고정된 순서로 돌린다
- **③** 라우팅. 요청을 저장소의 주 언어에 특화된 프롬프트로 보낸다
- **④** 오케스트레이터-워커. 중앙 모델이 저장소를 살펴본 뒤 하위 작업을 정한다

> **핵심 진단:** 오케스트레이터-워커는 중앙 LLM이 작업을 **동적으로** 쪼개 워커에 맡기고 결과를 종합하는 패턴입니다. Anthropic은 병렬화와의 핵심 차이를 *유연성* 으로 설명합니다. 하위 작업이 미리 정해져 있지 않고 **입력에 따라 오케스트레이터가 정한다** 는 점입니다. 대표 예가 바로 '여러 파일에 걸친 복잡한 코드 변경'이며, 바꿀 파일의 수와 변경 내용이 작업마다 달라집니다.

1. **오답** - 갈래가 미리 고정된 섹셔닝은 '어떤 파일을 바꿀지 살펴보기 전에는 모른다'는 조건과 맞지 않습니다. 고정 워커가 실제로 필요한 변경을 놓치거나 불필요한 일을 합니다.
2. **오답** - 체이닝은 단계가 고정되어 있을 때의 패턴입니다. 저장소마다 필요한 하위 작업 자체가 다르므로 고정 순서로 처리할 수 없습니다.
3. **오답** - 라우팅은 입력을 정해진 범주로 나눌 뿐, 범주 안에서 무엇을 몇 개 고칠지를 정해 주지 않습니다.
4. **정답** - 저장소를 본 뒤에야 하위 작업이 정해지는 상황이므로, 실행 중에 작업을 나누는 오케스트레이터-워커가 맞습니다.

> 💡 **시험 포인트:** "살펴보기 전에는 무엇을 해야 할지 모른다"는 오케스트레이터-워커의 결정적 신호입니다. 갈래가 미리 정해져 있으면 아무리 병렬이어도 섹셔닝입니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 24
### **A team built its claims assistant on a third-party agent framework. Some answers ignore an instruction the team is sure it supplied, but the framework's abstractions make it hard to see the exact prompt the model received. What does Anthropic's guidance recommend?**

| 보기 | 설명 |
|------|------|
| 1. Add another framework layer that summarizes each prompt before it is sent to the model. | |
| **2. Rebuild the failing step with direct API calls so the exact prompt and response can be inspected.** | |
| 3. Raise the sampling temperature so the model is more likely to pick up the missing instruction. | |
| 4. Add an evaluator model that keeps rejecting answers until they follow the instruction. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

한 팀이 보험 청구 어시스턴트를 서드파티 에이전트 프레임워크 위에 만들었습니다. 일부 답변이 팀이 분명히 넣었다고 생각하는 지시를 무시하는데, 프레임워크의 추상화 때문에 모델이 실제로 받은 프롬프트를 확인하기 어렵습니다. Anthropic의 안내는 무엇을 권할까요?

- **①** 모델에 보내기 전에 각 프롬프트를 요약하는 프레임워크 층을 하나 더 추가한다
- **②** 문제가 되는 단계를 직접 API 호출로 다시 만들어, 실제 프롬프트와 응답을 확인할 수 있게 한다
- **③** 모델이 빠진 지시를 더 잘 따르도록 샘플링 temperature를 높인다
- **④** 지시를 따를 때까지 답변을 계속 거부하는 평가자 모델을 추가한다

> **핵심 진단:** Anthropic은 프레임워크가 시작을 쉽게 해 주지만 **추상화 층이 실제 프롬프트와 응답을 가려** 디버깅을 어렵게 하고, 불필요한 복잡성을 더하게 만든다고 경고합니다. 권장 방식은 **LLM API를 직접 호출하는 것부터 시작** 하는 것이고(대부분의 패턴은 몇 줄이면 된다), 프레임워크를 쓰더라도 그 아래 코드를 이해하라고 합니다. 프레임워크 내부에 대한 잘못된 가정이 흔한 오류 원인이기 때문입니다. 지시가 실제로 모델에 들어갔는지부터 눈으로 확인해야 원인을 가릴 수 있습니다.

1. **오답** - 가시성이 문제인데 추상화 층을 하나 더 얹으면 모델이 받은 입력이 더 멀어집니다.
2. **정답** - 직접 호출로 재현하면 지시가 빠졌는지, 위치가 잘못됐는지, 다른 내용에 덮였는지 바로 확인할 수 있습니다.
3. **오답** - 지시가 프롬프트에 없다면 샘플링 설정은 아무것도 바꾸지 못합니다. 원인을 확인하지 않은 채 변수만 늘립니다.
4. **오답** - 평가 루프는 증상을 덮을 뿐 원인을 찾지 못하고, 호출과 비용만 늘립니다.

> 💡 **시험 포인트:** "프레임워크 때문에 모델이 무엇을 받았는지 모른다"는 문항의 정답은 '직접 API 호출로 내려가 확인한다'입니다. 단순성과 투명성은 Anthropic이 꼽는 에이전트 설계 원칙입니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 25
### **A lead agent delegates a code-search task to a subagent, which reads 40 files and runs 25 Grep calls before reporting back. In its next turn, the lead tries to list which of those files mention feature flags, a detail the report did not include. What does the lead's context contain from that delegation?**

| 보기 | 설명 |
|------|------|
| 1. Every file the subagent read, because subagents write into the parent's context window. | |
| 2. The subagent's tool calls and their results, but not the subagent's final report. | |
| **3. Only the subagent's final message; its tool calls and file contents stayed in its own context.** | |
| 4. A compacted transcript of the subagent's whole run, generated automatically when it stops. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

리드 에이전트가 코드 검색 작업을 서브에이전트에 맡기고, 서브에이전트는 파일 40개를 읽고 Grep을 25번 실행한 뒤 보고합니다. 리드는 다음 턴에서 그 파일들 중 기능 플래그를 언급하는 파일을 나열하려 하는데, 이 내용은 보고서에 없었습니다. 이 위임에서 리드의 컨텍스트에 남은 것은 무엇일까요?

- **①** 서브에이전트가 읽은 모든 파일. 서브에이전트는 부모의 컨텍스트 창에 기록하기 때문이다
- **②** 서브에이전트의 도구 호출과 그 결과. 단, 서브에이전트의 최종 보고서는 없다
- **③** 서브에이전트의 최종 메시지뿐이다. 도구 호출과 파일 내용은 서브에이전트 자신의 컨텍스트에 남았다
- **④** 서브에이전트가 멈출 때 자동으로 생성되는, 실행 전체를 압축한 기록

> **핵심 진단:** 서브에이전트는 별도의 대화에서 실행되며, **중간 도구 호출과 결과는 서브에이전트 안에 남고 최종 메시지만 부모에게 돌아갑니다.** 공식 문서는 이것을 컨텍스트 격리의 이점으로 설명합니다. 서브에이전트가 파일 수십 개를 탐색해도 그 내용이 메인 대화에 쌓이지 않고, 부모의 컨텍스트는 요약 한 덩어리만큼만 늘어납니다. 그래서 보고서에 없는 세부 사항은 리드가 알 수 없습니다. 필요하면 서브에이전트를 재개하거나, 처음부터 보고에 담을 내용을 위임 프롬프트에 지정해야 합니다.

1. **오답** - 서브에이전트는 부모의 창이 아니라 자기 창에서 일합니다. 그래서 컨텍스트 절약 수단이 됩니다.
2. **오답** - 정반대입니다. 부모가 받는 것은 최종 보고이고, 도구 호출과 결과는 부모에게 전달되지 않습니다.
3. **정답** - 부모의 컨텍스트에는 최종 메시지만 들어오므로, 보고서에 없는 '어떤 파일이 기능 플래그를 언급했나'는 리드가 알 수 없습니다.
4. **오답** - 서브에이전트 실행 기록을 압축해 부모에게 넣어 주는 동작은 없습니다. 서브에이전트 기록은 별도 파일로 저장되어 재개할 때 쓰입니다.

> 💡 **시험 포인트:** 서브에이전트는 '많이 읽고 짧게 보고하는' 컨텍스트 전략입니다. 리드가 나중에 필요로 할 정보가 있으면 보고 형식을 위임 프롬프트에 미리 지정하세요.

> 📚 근거 문서: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) · [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop)

---

## 문제 26
### **An application wants a second query() call to continue the work of a custom endpoint-mapper subagent that ran during an earlier call. Which sequence is correct?**

| 보기 | 설명 |
|------|------|
| **1. Run the first query() with the agent definitions → capture session_id and parse agentId from the Agent tool result → new query() with resume set to session_id and the same agents → name the agent ID in the prompt** | |
| 2. Run the first query() with the agent definitions → capture only the agentId from the Agent tool result → new query() with resume set to the agentId → ask the follow-up without naming any agent | |
| 3. Run the first query() with the agent definitions → capture session_id from the result message → new query() without resume → put the session ID in the prompt so Claude reloads the subagent | |
| 4. Start a new query() with resume set to a placeholder ID → run the first query() with the agent definitions → copy its session_id into the placeholder → name the agent in the prompt | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

한 애플리케이션이 앞선 호출에서 실행된 커스텀 endpoint-mapper 서브에이전트의 작업을 두 번째 `query()` 호출에서 이어 가려 합니다. 올바른 순서는 무엇일까요?

- **①** 에이전트 정의와 함께 첫 query()를 실행한다 → session_id를 확보하고 Agent 도구 결과에서 agentId를 파싱한다 → resume을 session_id로 하고 같은 agents를 넣어 새 query()를 시작한다 → 프롬프트에 에이전트 ID를 적는다
- **②** 에이전트 정의와 함께 첫 query()를 실행한다 → Agent 도구 결과에서 agentId만 확보한다 → resume을 agentId로 해 새 query()를 시작한다 → 어떤 에이전트도 지목하지 않고 후속 질문을 한다
- **③** 에이전트 정의와 함께 첫 query()를 실행한다 → 결과 메시지에서 session_id를 확보한다 → resume 없이 새 query()를 시작한다 → Claude가 서브에이전트를 다시 불러오도록 프롬프트에 세션 ID를 적는다
- **④** resume을 임시 ID로 해 새 query()를 먼저 시작한다 → 에이전트 정의와 함께 첫 query()를 실행한다 → 그 session_id를 임시 ID 자리에 복사한다 → 프롬프트에 에이전트를 지목한다

> **핵심 진단:** 공식 문서의 재개 절차는 세 단계입니다. **세션 ID를 확보** 하고(첫 질의의 메시지에서 `session_id`), **에이전트 ID를 추출** 하고(서브에이전트가 끝나면 Agent 도구 결과 텍스트에 `agentId: <id>`가 들어 있다), **세션을 재개** 합니다(두 번째 질의 옵션에 `resume: sessionId`를 넣고 프롬프트에 에이전트 ID를 포함). 각 `query()`는 기본으로 새 세션을 시작하므로, 서브에이전트의 기록에 닿으려면 같은 세션을 재개해야 합니다. 커스텀 에이전트라면 두 호출 모두 같은 `agents` 정의를 넘깁니다.

1. **정답** - 세션 ID와 에이전트 ID를 모두 확보하고, 같은 세션을 재개하면서 프롬프트로 재개할 에이전트를 지목합니다.
2. **오답** - `resume`에는 세션 ID가 들어가야 합니다. 에이전트 ID는 세션을 찾는 키가 아니라 그 세션 안에서 어떤 서브에이전트를 재개할지 알려 주는 정보이므로 프롬프트에 적어야 합니다.
3. **오답** - `resume` 없이 시작한 질의는 새 세션이라 이전 서브에이전트의 기록에 닿지 못합니다. 프롬프트에 세션 ID를 적는다고 세션이 재개되지 않습니다.
4. **오답** - 아직 존재하지 않는 세션을 미리 재개할 수는 없습니다. ID는 첫 실행이 끝난 뒤에야 생깁니다.

> 💡 **시험 포인트:** '`resume` = 세션 ID, 프롬프트 = 에이전트 ID'로 역할을 나눠 기억하세요. 내장 `Explore`·`Plan`은 일회성이라 `agentId`를 돌려주지 않으므로 재개할 수 없습니다.

> 📚 근거 문서: [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

---

## 문제 27
### **A pharmacy chain's recall pipeline always runs the same steps: (1) Claude extracts lot numbers and dates from a manufacturer's recall bulletin into fields, (2) code checks those fields against format rules and stops the run if any check fails, (3) Claude drafts the customer notice, and (4) Claude produces Spanish and Vietnamese versions of the notice. Which description fits this system?**

| 보기 | 설명 |
|------|------|
| 1. Routing, with the format check choosing which language prompt should run next. | |
| 2. Evaluator-optimizer, with the format check acting as an evaluator that sends feedback to the drafter. | |
| 3. Parallelization by sectioning, with the format check merging the extraction and drafting outputs. | |
| **4. Prompt chaining, with the format check acting as a programmatic gate between extraction and drafting.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

한 약국 체인의 리콜 파이프라인은 항상 같은 단계를 거칩니다. (1) Claude가 제조사의 리콜 공지에서 로트 번호와 날짜를 필드로 추출하고, (2) 코드가 그 필드를 형식 규칙과 대조해 하나라도 실패하면 실행을 멈추며, (3) Claude가 고객 안내문 초안을 쓰고, (4) Claude가 안내문의 스페인어판과 베트남어판을 만듭니다. 이 시스템을 올바르게 설명한 것은 무엇일까요?

- **①** 라우팅. 형식 검사가 다음에 실행할 언어 프롬프트를 고른다
- **②** 평가자-최적화자. 형식 검사가 평가자가 되어 초안 작성 단계에 피드백을 보낸다
- **③** 섹셔닝 방식 병렬화. 형식 검사가 추출 결과와 초안을 하나로 합친다
- **④** 프롬프트 체이닝. 형식 검사가 추출과 초안 작성 사이의 프로그램 게이트 역할을 한다

> **핵심 진단:** **프롬프트 체이닝** 은 작업을 고정된 단계로 나누고 각 호출이 앞 단계의 출력을 처리하는 패턴이며, 중간 단계에 프로그램 검사(**게이트**)를 넣어 과정이 궤도를 벗어나지 않게 할 수 있습니다. 이 파이프라인은 단계와 순서가 항상 같고, 코드 검사는 추출 결과를 다음 단계로 넘길지 말지만 정합니다. 번역 두 개도 미리 정해진 산출물일 뿐 실행 중에 정해지는 갈래가 아닙니다.

1. **오답** - 라우팅은 입력을 범주로 나눠 *한* 갈래로 보내는 패턴입니다. 여기서는 두 언어판이 모두 항상 만들어지고, 검사는 통과·중단만 정합니다.
2. **오답** - 평가자-최적화자는 평가 LLM이 피드백을 주고 생성 LLM이 다시 쓰는 루프입니다. 이 검사는 코드이고, 피드백도 재생성도 없이 실행을 멈출 뿐입니다.
3. **오답** - 추출과 초안 작성은 동시에 도는 독립 작업이 아니라 앞 단계의 출력이 다음 단계의 입력이 되는 순차 단계입니다.
4. **정답** - 고정된 순차 단계, 그 사이의 프로그램 게이트라는 체이닝의 두 특징을 모두 갖췄습니다.

> 💡 **시험 포인트:** 코드 검사가 '통과/중단'만 정하면 게이트, LLM이 '이렇게 고쳐라'는 피드백을 주며 다시 쓰게 하면 평가자-최적화자입니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## 문제 28
### **A tutoring app adds the memory tool (memory_20250818) so Claude can remember each student's weak topics across sessions. During a session, Claude calls the tool with command "create" and path /memories/student-482/weak-topics.md. What happens next?**

| 보기 | 설명 |
|------|------|
| 1. Anthropic writes the file to a managed memory store tied to the API key and confirms it in the same response. | |
| 2. The API stores the file temporarily and injects its full contents into every later request automatically. | |
| **3. The app's handler performs the write in storage the app controls and returns the outcome in a tool_result block.** | |
| 4. The SDK rejects the call because memory paths must be registered in the request before Claude creates them. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

한 튜터링 앱이 Claude가 학생마다 약한 주제를 세션을 넘어 기억하도록 메모리 도구(memory_20250818)를 추가합니다. 세션 중에 Claude가 command "create", path /memories/student-482/weak-topics.md로 도구를 호출합니다. 다음에 무슨 일이 일어날까요?

- **①** Anthropic이 API 키에 묶인 관리형 메모리 저장소에 파일을 쓰고, 같은 응답 안에서 완료를 알린다
- **②** API가 파일을 임시로 저장하고, 이후 모든 요청에 그 내용 전체를 자동으로 넣는다
- **③** 앱의 핸들러가 앱이 통제하는 저장소에서 쓰기를 수행하고, 그 결과를 tool_result 블록으로 돌려준다
- **④** Claude가 메모리 경로를 만들기 전에 요청에 등록해야 하므로 SDK가 호출을 거부한다

> **핵심 진단:** 메모리 도구는 **클라이언트 측** 에서 동작합니다. 공식 문서 표현대로 Claude는 파일 작업을 *요청* 할 뿐이고, 내 애플리케이션이 그 요청을 내가 통제하는 저장소에서 실행한 뒤 결과를 `tool_result` 블록으로 돌려줍니다. `/memories`는 내 핸들러가 실제 저장소(사용자별 디렉터리, DB 키 등)에 매핑하는 접두사이며, 메모리는 전적으로 내 애플리케이션 안에 있습니다. 같은 `tools` 항목을 보내고 핸들러가 같은 저장소를 쓰면 다음 대화가 같은 메모리에서 이어집니다.

1. **오답** - Anthropic이 메모리 파일을 보관하는 관리형 저장소는 없습니다. 저장 위치와 보존 기간은 앱이 정하며, 그래서 ZDR 적용 대상이 될 수 있습니다.
2. **오답** - 메모리는 컨텍스트에 자동으로 전부 주입되지 않습니다. Claude가 필요할 때 `view`로 읽어 오는 just-in-time 방식이 핵심입니다.
3. **정답** - 다른 클라이언트 도구와 똑같이 `tool_use`를 받아 핸들러가 실행하고 결과를 돌려주는 표준 도구 사용 루프입니다.
4. **오답** - 경로를 미리 등록하는 절차는 없습니다. 대신 핸들러가 모든 경로가 `/memories` 안에 머무는지 검증해 경로 이탈을 막아야 합니다.

> 💡 **시험 포인트:** 메모리 도구 = '요청은 Claude, 실행과 저장은 내 앱'입니다. 경로 이탈 방어, 파일 크기 상한, 오래된 파일 정리도 모두 앱의 책임입니다.

> 📚 근거 문서: [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) · [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

---

## 문제 29
### **A tax-filing app's help widget first has a small model label each question as "general FAQ", "account-specific", or "complex tax situation". FAQ questions go to a short prompt on a small, fast model; complex ones go to a larger model with a specialized prompt and a tax-code reference. Which pattern is this, and what does it buy the team?**

| 보기 | 설명 |
|------|------|
| 1. Orchestrator-workers; the classifier decides at runtime which subtasks each question needs. | |
| **2. Routing; each category gets a tuned prompt and a model sized to its difficulty, keeping costs down.** | |
| 3. Evaluator-optimizer; the small model grades each answer and sends hard ones back for another draft. | |
| 4. Parallelization by voting; the three labels are compared to pick the most likely category. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D1 · Agents and Workflows · 1.3 Agent Patterns and Frameworks

**📝 문제 번역**

한 세금 신고 앱의 도움말 위젯은 먼저 작은 모델로 각 질문에 "일반 FAQ", "계정 관련", "복잡한 세무 상황" 중 하나의 라벨을 붙입니다. FAQ 질문은 작고 빠른 모델의 짧은 프롬프트로 보내고, 복잡한 질문은 전문 프롬프트와 세법 참고 자료를 갖춘 더 큰 모델로 보냅니다. 이것은 어떤 패턴이고, 팀에 무엇을 가져다줄까요?

- **①** 오케스트레이터-워커. 분류기가 질문마다 필요한 하위 작업을 실행 중에 정한다
- **②** 라우팅. 범주마다 맞춘 프롬프트와 난이도에 맞는 크기의 모델을 써서 비용을 낮춘다
- **③** 평가자-최적화자. 작은 모델이 각 답변을 채점해 어려운 질문은 다시 쓰도록 돌려보낸다
- **④** 투표 방식 병렬화. 세 라벨을 비교해 가장 가능성 높은 범주를 고른다

> **핵심 진단:** **라우팅** 은 입력을 분류해 전문화된 후속 작업으로 보내는 패턴으로, 관심사를 분리하고 범주별로 특화된 프롬프트를 쓸 수 있게 해 줍니다. Anthropic이 드는 대표 예 중 하나가 바로 이 시나리오처럼 **쉬운 질문은 작은 모델로, 어려운 질문은 더 유능한 모델로** 보내 비용과 속도를 최적화하는 구성입니다. 범주가 미리 정해져 있고, 분류 결과가 한 갈래를 고를 뿐이므로 워크플로입니다.

1. **오답** - 분류기는 정해진 세 범주 중 하나를 고를 뿐, 질문마다 하위 작업을 새로 쪼개 여러 워커에 맡기지 않습니다.
2. **정답** - 분류 후 범주별 전용 경로로 보내는 라우팅이며, 질문 난이도에 맞는 모델을 써서 품질을 지키면서 비용을 줄입니다.
3. **오답** - 작은 모델은 질문을 분류할 뿐 답변을 채점하거나 피드백 루프를 돌리지 않습니다.
4. **오답** - 같은 작업을 여러 번 돌려 집계하는 구조가 아닙니다. 라벨 세 개는 범주의 후보일 뿐 투표의 표가 아닙니다.

> 💡 **시험 포인트:** 라우팅의 이득은 두 가지로 정리됩니다. 범주별 프롬프트를 따로 최적화할 수 있다는 것과, 난이도에 맞는 모델을 골라 비용·지연을 줄인다는 것입니다.

> 📚 근거 문서: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---
