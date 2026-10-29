<!-- 출처: https://www.certsafari.com/anthropic/claude-certified-architect-foundations/learn — CCAR-F 레슨 도메인 2(레슨 2.1~2.5)의 Exam question·Check yourself 객관식 문항. 문제·보기·정답은 원문 그대로 옮기고 보기 기호만 A–D → 1–4로 바꿨다. 해설은 원문 해설과 공식 문서를 바탕으로 한글로 작성. -->

## 문제 1
### **Your agent has two user-defined tools, and Claude keeps calling the wrong one. You can make only one change. Which change can actually affect which tool Claude chooses?**

| 보기 | 설명 |
|------|------|
| 1. Move the intended tool to the first position in the tools array | |
| 2. Give the intended tool a higher priority weight in your backend router | |
| **3. Rewrite each tool's description so it says what the tool does and when to use it rather than the other tool** | |
| 4. Rename the internal function that each tool is mapped to in your codebase | |

**정답: 3.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — Tool descriptions: how Claude picks a tool, and how to stop it picking the wrong one

**📝 문제 번역**

에이전트에 사용자 정의 도구가 두 개 있는데, Claude가 계속 엉뚱한 쪽을 호출합니다. 딱 한 가지만 바꿀 수 있다면, Claude가 어느 도구를 고를지에 **실제로 영향을 줄 수 있는** 변경은 무엇입니까?

- **①** 의도한 도구를 `tools` 배열의 첫 번째 자리로 옮긴다
- **②** 백엔드 라우터에서 의도한 도구에 더 높은 우선순위 가중치를 준다
- **③** 각 도구의 설명을, 그 도구가 무엇을 하는지와 다른 도구 대신 **언제** 써야 하는지를 말하도록 다시 쓴다
- **④** 코드베이스에서 각 도구가 연결된 내부 함수의 이름을 바꾼다

> **핵심:** Claude는 사용자 요청과 각 도구의 **설명**을 보고 호출할 도구를 정하므로, 선택을 바꾸려면 Claude가 읽는 도구 정의를 고쳐야 합니다.

1. **오답** - 배열 안의 순서는 모델에게 두 도구를 구분할 신호가 되지 않습니다. 두 설명이 여전히 같은 일을 말한다면 순서를 바꿔도 판단 근거는 그대로입니다.
2. **오답** - 백엔드 라우터의 가중치는 모델이 읽는 프롬프트에 들어가지 않습니다. 모델 바깥의 설정이므로 Claude가 어떤 `tool_use` 블록을 만들지에는 영향을 주지 못합니다.
3. **정답** - API는 도구 정의(이름·설명·입력 스키마)와 시스템 프롬프트를 묶어 하나의 프롬프트로 Claude에게 보여 줍니다. 설명에 기능과 사용 시점, 그리고 비슷한 도구 대신 이 도구를 고를 조건을 적으면 Claude가 둘을 가를 근거가 생깁니다.
4. **오답** - 도구가 연결된 내부 함수 이름은 여러분의 코드 안에만 있고 모델에게 전달되지 않습니다. Claude가 보는 것은 도구 정의의 `name`·`description`·`input_schema`입니다.

📚 근거: [Tool use with Claude (overview)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "Claude determines when to call a tool based on the user's request and the tool's description."

---

## 문제 2
### **A team names two tools `process_data` and `process_information`, and both share the description "Processes data provided by the user." The model routes roughly half of matching tasks to the wrong tool. What is the most likely root cause?**

| 보기 | 설명 |
|------|------|
| 1. The tools were declared in the wrong order in the tools array, and reordering them so that the intended tool is listed first will correct the routing behavior. | |
| **2. The near-duplicate descriptions give the model no differentiating signal, since descriptions are its main basis for choosing similar tools.** | |
| 3. The model's context window is too small to hold both full tool definitions during a single request's generation pass, leading to ambiguous routing. | |
| 4. The user's request phrasing was too vague to reliably distinguish between the tools, so the fix belongs in the user's prompt rather than the tool definitions. | |

**정답: 2.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — Tool descriptions: how Claude picks a tool, and how to stop it picking the wrong one

**📝 문제 번역**

한 팀이 `process_data`와 `process_information`이라는 두 도구를 만들었고, 두 도구 모두 설명이 "Processes data provided by the user."(사용자가 준 데이터를 처리한다)로 같습니다. 해당 작업의 대략 절반이 엉뚱한 도구로 라우팅됩니다. 가장 가능성 높은 근본 원인은 무엇입니까?

- **①** `tools` 배열에서 도구 선언 순서가 잘못되었으므로, 의도한 도구를 먼저 나열하도록 순서를 바꾸면 라우팅이 바로잡힌다
- **②** 거의 똑같은 설명이 모델에게 둘을 구별할 신호를 주지 못한다. 비슷한 도구 사이에서 고를 때 설명이 모델의 주된 근거이기 때문이다
- **③** 모델의 컨텍스트 윈도가 너무 작아 한 요청의 생성 과정에서 두 도구 정의를 다 담지 못해 라우팅이 모호해진다
- **④** 사용자 요청의 표현이 너무 모호해서 두 도구를 구분할 수 없으므로, 고칠 곳은 도구 정의가 아니라 사용자 프롬프트다

> **핵심:** 설명이 같으면 Claude에게는 두 도구를 가를 근거가 없고, 거의 무작위에 가까운 절반 정도의 오라우팅은 바로 그 결과입니다.

1. **오답** - 배열 안의 위치는 선택에 영향을 주지 않습니다. 모델은 위치가 아니라 설명의 내용을 근거로 고르므로, 순서를 바꿔도 모호한 라우팅은 그대로 남습니다.
2. **정답** - 두 설명이 사실상 같으니 모델은 둘을 믿을 만하게 구별할 수 없습니다. 이름도 `process_data`와 `process_information`처럼 거의 동의어라, 남은 신호가 없습니다. 각 설명에 무엇을 받고 무엇을 돌려주는지, 언제 상대 도구 대신 이 도구를 쓰는지를 적어 갈라야 합니다.
3. **오답** - 요즘 컨텍스트 윈도는 수많은 도구 정의를 담을 만큼 큽니다. 짧은 설명 두 개는 한도 근처에도 가지 않으므로 원인이 될 수 없습니다.
4. **오답** - 두 도구의 설명이 같으면 사용자가 어떻게 말하든 모델은 둘을 구분하지 못합니다. 근본 원인은 도구 정의에 있으니 설명을 고치는 것이 해결책이고, 사용자에게 부담을 넘기는 것은 맞지 않습니다.

📚 근거: [Tool use with Claude (overview)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "Provide extremely detailed descriptions. This is by far the most important factor in tool performance."

---

## 문제 3
### **A teammate wants to cut a nested-input tool's description down to one line and add three schema-valid `input_examples` instead, since "examples show Claude more than prose does." What is wrong with this plan?**

| 보기 | 설명 |
|------|------|
| 1. Nothing: examples are validated against the schema, so they carry more reliable information than a written description | |
| **2. Examples show what a well-formed call looks like, but not when to use the tool or where its scope ends. The description comes first, and examples only add to it.** | |
| 3. input_examples are only read when tool_choice forces that specific tool, so they won't help with selection | |
| 4. input_examples replace the input_schema, so the parameter descriptions would be lost | |

**정답: 2.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — Tool descriptions: how Claude picks a tool, and how to stop it picking the wrong one

**📝 문제 번역**

동료가 중첩 입력을 받는 도구의 설명을 한 줄로 줄이고, 대신 스키마를 통과하는 `input_examples` 세 개를 넣자고 합니다. "예시가 글보다 Claude에게 더 많은 걸 보여 준다"는 이유입니다. 이 계획의 문제는 무엇입니까?

- **①** 문제없다. 예시는 스키마로 검증되므로 글로 쓴 설명보다 더 믿을 만한 정보를 담는다
- **②** 예시는 올바른 형태의 호출이 어떤 모습인지 보여 주지만, 도구를 언제 쓰는지나 범위가 어디서 끝나는지는 알려 주지 않는다. 설명이 먼저이고 예시는 보탤 뿐이다
- **③** `input_examples`는 `tool_choice`가 그 도구를 강제할 때만 읽히므로 도구 선택에는 도움이 안 된다
- **④** `input_examples`는 `input_schema`를 대체하므로 파라미터 설명이 사라진다

> **핵심:** 자세한 설명이 도구 성능의 가장 중요한 요소이고, `input_examples`는 복잡하거나 형식이 까다로운 입력에 덧붙이는 **선택적 보조 수단**입니다.

1. **오답** - 예시가 스키마로 검증된다는 것(맞지 않으면 400 오류)은 사실이지만, 그것은 예시의 **형식**이 올바르다는 보장일 뿐입니다. 언제 이 도구를 쓰고 언제 쓰지 말지, 무엇을 반환하지 않는지 같은 정보는 예시에 담기지 않습니다.
2. **정답** - Define tools 문서는 설명을 우선하고, 중첩 객체나 형식에 민감한 파라미터가 있는 복잡한 도구에 한해 `input_examples`를 고려하라고 합니다. 예시는 호출을 어떻게 구성하는지 보여 줄 뿐, 설명이 맡는 사용 시점과 범위의 경계를 대신하지 못합니다.
3. **오답** - 예시는 도구 스키마와 함께 프롬프트에 실려 늘 Claude에게 보입니다. `tool_choice` 강제 여부와 상관없이 읽히며, 비슷한 두 도구 중 어느 쪽이 맞는지 보여 주는 데도 쓰일 수 있습니다.
4. **오답** - `input_examples`는 `input_schema`와 별도의 선택 필드이며, 각 예시는 그 스키마를 통과해야 합니다. 스키마를 대체하지 않으므로 파라미터 설명도 그대로 남습니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)

> "Clear descriptions are most important, but for tools with complex inputs, nested objects, or format-sensitive parameters, you can use the input_examples field"

---

## 문제 4
### **After a web-extraction tool was added, `analyze_content` kept its old description: "Summarizes any content: emails, notes, web pages." Both tools now have detailed descriptions of what they do, but some web tasks still go to `analyze_content`. Which fix targets the actual cause?**

| 보기 | 설명 |
|------|------|
| 1. Move the new web tool ahead of analyze_content in the tools array so Claude considers it first | |
| **2. Rename analyze_content to match the scope it has left, and rewrite its description so it excludes web content, which the new tool now handles** | |
| 3. Add schema-valid input_examples of web pages to the new tool and leave both descriptions as they are | |
| 4. Add more detail to both descriptions about how each tool processes content internally | |

**정답: 2.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — Tool descriptions: how Claude picks a tool, and how to stop it picking the wrong one

**📝 문제 번역**

웹 추출 도구가 새로 추가된 뒤에도 `analyze_content`는 예전 설명 "Summarizes any content: emails, notes, web pages."(이메일·메모·웹 페이지 등 모든 콘텐츠를 요약한다)를 그대로 갖고 있습니다. 이제 두 도구 모두 무엇을 하는지 자세히 설명되어 있지만, 일부 웹 작업이 여전히 `analyze_content`로 갑니다. 실제 원인을 겨냥한 수정은 무엇입니까?

- **①** 새 웹 도구를 `tools` 배열에서 `analyze_content` 앞으로 옮겨 Claude가 먼저 고려하게 한다
- **②** `analyze_content`를 남은 범위에 맞는 이름으로 바꾸고, 이제 새 도구가 맡은 웹 콘텐츠는 제외한다고 설명을 다시 쓴다
- **③** 새 도구에 웹 페이지를 다루는 스키마 준수 `input_examples`를 넣고, 두 설명은 그대로 둔다
- **④** 두 설명에 각 도구가 내부적으로 콘텐츠를 어떻게 처리하는지 더 자세히 적는다

> **핵심:** 비슷한 도구는 **무엇을** 하는지만이 아니라 **언제** 쓰는지로 갈라야 하며, 오래된 도구는 남은 범위로 이름을 바꾸고 새 도구가 맡은 경우를 설명에서 빼야 합니다.

1. **오답** - 배열 순서는 선택 신호가 아닙니다. 두 설명이 모두 웹 페이지를 다룬다고 주장하는 한, 앞에 놓아도 겹침은 그대로입니다.
2. **정답** - 원인은 옛 설명이 아직 웹 페이지를 자기 범위라고 말한다는 점입니다. 이름을 남은 범위(예: 붙여 넣은 텍스트·이메일 요약)에 맞추고 "웹 콘텐츠에는 쓰지 않는다"고 명시하면 경계가 이름과 설명 양쪽에 드러나 웹 요청이 더는 두 도구에 동시에 들어맞지 않습니다.
3. **오답** - 예시는 설명을 보완할 뿐 겹친 범위를 지우지 못합니다. `analyze_content`의 설명이 여전히 웹 페이지를 포함한다고 말하므로 일부 요청은 계속 그쪽으로 갑니다.
4. **오답** - 내부 처리 방식을 더 적는 것은 "무엇을 하는지"를 늘릴 뿐입니다. Troubleshooting 문서의 처방은 "언제 쓰는지"로 구분하는 것이고, 내부 구현 설명은 겹침을 해소하지 못합니다.

📚 근거: [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "Sharpen descriptions. Differentiate tools by WHEN to use them, not only WHAT they do."

---

## 문제 5
### **A tool named `analyze_content` was originally built to summarize any pasted content, including emails and internal notes, but its description was never updated after a web-specific successor tool was introduced. The model now sometimes calls the general tool for web-only tasks. What is the recommended remediation?**

| 보기 | 설명 |
|------|------|
| 1. Leave both tools with their original names, but ask users to specify which tool they want by internal ID every time. | |
| **2. Rename the general tool to reflect its remaining scope, and update its description to exclude the case the newer tool now handles.** | |
| 3. Increase the priority weight of the newer tool in the backend routing configuration without touching either tool's description. | |
| 4. Delete the description text from both tools so the model relies entirely on tool names for disambiguation. | |

**정답: 2.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — Tool descriptions: how Claude picks a tool, and how to stop it picking the wrong one

**📝 문제 번역**

`analyze_content`라는 도구는 원래 이메일이나 내부 메모를 포함해 붙여 넣은 모든 콘텐츠를 요약하려고 만들었는데, 웹 전용 후속 도구가 도입된 뒤에도 설명이 갱신되지 않았습니다. 이제 모델이 웹 전용 작업에도 가끔 이 범용 도구를 호출합니다. 권장되는 개선책은 무엇입니까?

- **①** 두 도구의 이름은 그대로 두고, 사용자에게 매번 내부 ID로 원하는 도구를 지정해 달라고 한다
- **②** 범용 도구의 이름을 남은 범위에 맞게 바꾸고, 새 도구가 이제 처리하는 경우를 제외하도록 설명을 갱신한다
- **③** 두 도구의 설명은 건드리지 않고, 백엔드 라우팅 설정에서 새 도구의 우선순위 가중치를 높인다
- **④** 두 도구의 설명 텍스트를 모두 지워 모델이 도구 이름만으로 구분하게 한다

> **핵심:** 오라우팅의 원인이 갱신되지 않은 설명이라면, 해결도 그 도구의 **이름과 설명**을 좁혀 겹침을 없애는 데 있습니다.

1. **오답** - 사용자에게 내부 도구 ID를 말하게 하면 자연어로 도구를 고르게 하는 목적 자체가 무너집니다. 게다가 낡은 설명이라는 원인도 그대로 남습니다.
2. **정답** - 범용 도구의 이름과 설명을 좁아진 남은 범위에 맞추면 웹 전용 새 도구와의 겹침이 사라집니다. 이름은 경계를 드러내는 첫 신호이고, 설명에서 "웹 콘텐츠는 다른 도구가 맡는다"를 밝히면 선택 근거가 분명해집니다.
3. **오답** - 백엔드 우선순위 가중치는 모델의 판단 밖에서 작동하며 모델에게 보이지 않습니다. 혼동을 일으킨 낡은 설명은 그대로이므로 문제가 해결되지 않습니다.
4. **오답** - 설명을 지우면 유용한 정보까지 통째로 사라집니다. 고쳐야 할 것은 범위에 대한 낡은 주장 하나이지 설명 전체가 아니며, 문서는 오히려 도구당 최소 3~4문장의 자세한 설명을 권합니다.

📚 근거: [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "Sharpen descriptions. Differentiate tools by WHEN to use them, not only WHAT they do."

---

## 문제 6
### **A tool named `analyze_content`, originally built for summarizing pasted text, has its description copied almost verbatim onto a newer tool, `analyze_document`, meant for uploaded PDFs. Following the pattern of renaming a tool to eliminate overlap, what should the team do?**

| 보기 | 설명 |
|------|------|
| 1. Delete `analyze_document` and require users to always paste document contents in as plain text from now on. | |
| **2. Rename `analyze_content` to a more specific name, such as `summarize_pasted_text`, and limit its description to pasted text only, while `analyze_document` handles uploaded PDFs.** | |
| 3. Give both tools identical descriptions but different internal function names so backend routing can disambiguate them. | |
| 4. Add a disclaimer inside each tool's error message stating the wrong tool may have been called, shown after execution fails. | |

**정답: 2.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — Tool descriptions: how Claude picks a tool, and how to stop it picking the wrong one

**📝 문제 번역**

붙여 넣은 텍스트를 요약하려고 만든 `analyze_content`의 설명이, 업로드된 PDF용으로 만든 새 도구 `analyze_document`에 거의 그대로 복사되었습니다. 겹침을 없애려고 도구 이름을 바꾸는 패턴을 따른다면, 팀은 무엇을 해야 합니까?

- **①** `analyze_document`를 삭제하고, 앞으로 사용자가 문서 내용을 항상 일반 텍스트로 붙여 넣게 한다
- **②** `analyze_content`를 `summarize_pasted_text`처럼 더 구체적인 이름으로 바꾸고 설명을 붙여 넣은 텍스트로만 한정하며, 업로드된 PDF는 `analyze_document`가 맡게 한다
- **③** 두 도구에 같은 설명을 주되 내부 함수 이름을 다르게 해서 백엔드 라우팅이 구분하게 한다
- **④** 실행이 실패한 뒤 보이도록, 각 도구의 오류 메시지에 엉뚱한 도구가 호출되었을 수 있다는 안내를 넣는다

> **핵심:** 복사된 설명 때문에 생긴 겹침은 한쪽 도구의 이름과 설명을 **입력 종류에 맞게 좁혀** 원천에서 없앱니다.

1. **오답** - 필요한 기능(업로드된 문서 처리)을 없애고 사용자에게 우회를 강요하는 방식입니다. 목적별로 도구를 구분하라는 권고와도 맞지 않고, 설명이 겹친다는 문제를 고치지도 않습니다.
2. **정답** - 도구마다 겹치지 않는 고유한 설명을 가져야 모델이 혼동하지 않습니다. `analyze_content`를 입력 종류(붙여 넣은 텍스트)가 드러나는 이름으로 바꾸고 설명을 그 범위로 한정하면, 업로드된 PDF 요청은 더 이상 이 도구와 맞지 않고 `analyze_document`로 갑니다.
3. **오답** - 내부 함수 이름은 모델이 도구를 고를 때 쓰지 않습니다. 설명이 같은 한 모델은 여전히 둘을 구분하지 못하므로 오라우팅이 계속됩니다.
4. **오답** - 오류 메시지에 경고를 넣는 것은 이미 잘못 호출된 뒤에야 작동하는 사후 대응입니다. 선택 시점에서 오라우팅을 막으려면 설명의 겹침을 미리 없애야 합니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use)

---

## 문제 7
### **You propose splitting a generic analyze_document into extract_data_points, summarize_content and verify_claim_against_source. A reviewer objects: "Anthropic says to consolidate related operations into fewer tools, so splitting makes selection worse." What is the best response?**

| 보기 | 설명 |
|------|------|
| 1. The reviewer is right. Keep analyze_document and add an action parameter with the values extract, summarize and verify, the same pattern used for pull request tools. | |
| 2. Consolidation is a token-saving measure for large MCP tool libraries. It has no bearing on how Claude selects between tools. | |
| **3. Consolidation fits several actions on one resource that share a contract, like create, review and merge on a pull request. Extraction, summarization and claim verification take different inputs and return different outputs, so each needs its own tool and description.** | |
| 4. Consolidation applies only to server tools that Anthropic runs. User-defined tools should always get one tool per verb. | |

**정답: 3.**

**해설:**

> 📘 레슨 2.1 · 도구 설명 설계 — Tool descriptions: how Claude picks a tool, and how to stop it picking the wrong one

**📝 문제 번역**

범용 `analyze_document`를 `extract_data_points`, `summarize_content`, `verify_claim_against_source`로 나누자고 제안했습니다. 리뷰어가 반대합니다. "Anthropic은 관련 작업을 더 적은 도구로 합치라고 하니, 나누면 선택이 더 나빠진다." 가장 좋은 대답은 무엇입니까?

- **①** 리뷰어가 맞다. `analyze_document`를 유지하고 값이 extract, summarize, verify인 `action` 파라미터를 추가한다. 풀 리퀘스트 도구에 쓰는 패턴과 같다
- **②** 합치기는 큰 MCP 도구 라이브러리에서 토큰을 아끼기 위한 조치일 뿐, Claude가 도구를 고르는 방식과는 상관이 없다
- **③** 합치기는 계약을 공유하는, 한 자원에 대한 여러 동작(풀 리퀘스트의 생성·리뷰·병합처럼)에 맞는다. 추출·요약·주장 검증은 입력도 출력도 다르므로 각각 별도의 도구와 설명이 필요하다
- **④** 합치기는 Anthropic이 실행하는 서버 도구에만 적용된다. 사용자 정의 도구는 항상 동사 하나당 도구 하나여야 한다

> **핵심:** "합쳐라"와 "나눠라"는 서로 다른 모양의 도구에 대한 규칙입니다. 기준은 동작들이 **같은 입출력 계약을 공유하는가**입니다.

1. **오답** - PR 도구 패턴은 같은 풀 리퀘스트라는 자원에 대한 동작들이 계약을 공유하기 때문에 통합니다. 추출·요약·검증은 받는 입력(예: 검증기는 주장과 출처, 요약기는 콘텐츠만)과 돌려주는 출력이 달라, `action` 파라미터 뒤에 숨기면 진짜 선택이 파라미터 값으로 숨어 버립니다.
2. **오답** - Define tools 문서는 합치기의 이유로 "선택의 모호함을 줄인다"를 듭니다. 즉 합치기는 선택 품질에 관한 조언이지, 토큰 절약에만 관한 것이 아닙니다.
3. **정답** - 합치기 권고는 `create_pr`·`review_pr`·`merge_pr`처럼 같은 자원에 대한 동작을 `action` 파라미터를 가진 도구 하나로 묶는 경우를 말합니다. 서로 다른 입출력 계약을 가진 여러 목적을 한 도구에 숨겼다면 나누어야, 각 설명이 무엇을 반환하고 언제 형제 도구 대신 골라야 하는지 말할 수 있습니다.
4. **오답** - 합치기 권고는 Define tools 문서의 사용자 정의 도구 모범 사례에 실려 있습니다. 서버 도구에만 적용된다는 근거는 없고, "동사 하나당 도구 하나" 같은 규칙도 문서에 없습니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Managed Agents: Tools](https://platform.claude.com/docs/en/managed-agents/tools)

> "Rather than creating a separate tool for every action (create_pr, review_pr, merge_pr), group them into a single tool with an action parameter."

---

## 문제 8
### **Your refund tool's handler catches every failure and returns `isError: true` with the text "Operation failed". A customer asks for a refund that company policy does not allow. What is the most likely result?**

| 보기 | 설명 |
|------|------|
| **1. The agent can't tell that a policy blocked the request. It may keep resending a request that can never succeed, or tell the customer it was a temporary system problem.** | |
| 2. The agent works out from `isError: true` that the failure is permanent, so it stops and correctly explains the refund policy to the customer. | |
| 3. Nothing goes wrong. The `isError` flag alone gives the agent enough to choose between retrying, asking the user, or explaining the limitation. | |
| 4. The MCP server turns the generic message into a JSON-RPC protocol error, so the model never sees that the call failed. | |

**정답: 1.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — Structured error responses for MCP tools

**📝 문제 번역**

환불 도구의 핸들러가 모든 실패를 잡아 `isError: true`와 "Operation failed"라는 텍스트로 돌려줍니다. 고객이 회사 정책상 허용되지 않는 환불을 요청했습니다. 가장 가능성 높은 결과는 무엇입니까?

- **①** 에이전트는 정책이 요청을 막았다는 사실을 알 수 없다. 결코 성공할 수 없는 요청을 계속 다시 보내거나, 고객에게 일시적인 시스템 문제라고 안내할 수 있다
- **②** 에이전트가 `isError: true`로부터 영구적인 실패임을 알아내고, 멈춘 뒤 고객에게 환불 정책을 올바르게 설명한다
- **③** 아무 문제 없다. `isError` 플래그 하나만으로도 에이전트는 재시도, 사용자에게 질문, 한계 설명 중 하나를 고를 수 있다
- **④** MCP 서버가 일반 메시지를 JSON-RPC 프로토콜 오류로 바꾸므로 모델은 호출이 실패했다는 것조차 보지 못한다

> **핵심:** `isError` 플래그는 "실패했다"만 알려 줍니다. 재시도·입력 수정·한계 설명 중 무엇을 할지는 **왜** 실패했는지를 알아야 고를 수 있습니다.

1. **정답** - "Operation failed"만 받은 에이전트는 실패의 종류를 추측해야 합니다. 일시적 장애로 추측하면 결코 성공하지 못할 요청을 반복해 턴과 토큰을 낭비하고, 시스템 문제라고 고객에게 사과하면 실제로는 정책이 막았다는 사실을 잘못 전하게 됩니다.
2. **오답** - `isError: true`는 실패가 영구적인지 일시적인지 구분하지 않습니다. 타임아웃·잘못된 날짜·거절된 환불·권한 없는 토큰이 모두 같은 신호로 오므로, 에이전트가 정책을 설명할 근거가 없습니다.
3. **오답** - Build a tool-using agent 튜토리얼은 Claude가 오류를 읽고 입력을 고쳐 재시도하거나, 사용자에게 묻거나, 한계를 설명할 수 있다고 하지만, 그 선택은 오류 내용에 달려 있습니다. 플래그만으로는 셋 중 무엇이 맞는지 알 수 없습니다.
4. **오답** - 핸들러가 `isError: true` 결과를 돌려주면 그것은 정상적인 결과(result)로 전달되고, 모델은 그 텍스트를 읽습니다. 서버가 이를 프로토콜 오류로 바꾸는 일은 없습니다. 문제는 전달 채널이 아니라 내용이 비어 있다는 점입니다.

📚 근거: [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent) · [MCP Specification: Tools (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)

> "Claude reads the error and can retry with corrected input, ask the user for clarification, or explain the limitation."

---

## 문제 9
### **Fifteen attendees are passed to `create_calendar_event`, and the calendar refuses with "Too many attendees (max 10)". Which error metadata from the handler lets the agent respond best?**

| 보기 | 설명 |
|------|------|
| **1. errorCategory "business", isRetryable false, plus a customer-friendly explanation of the 10-attendee limit that the agent can pass on to the user** | |
| 2. errorCategory "transient", isRetryable true, so the agent waits and resends the same request with backoff | |
| 3. errorCategory "validation", isRetryable true, because the agent can cut the list down and call again | |
| 4. errorCategory "permission", isRetryable false, so the agent asks for a credential with broader access | |

**정답: 1.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — Structured error responses for MCP tools

**📝 문제 번역**

참석자 15명을 `create_calendar_event`에 넘겼더니 캘린더가 "Too many attendees (max 10)"(참석자가 너무 많음, 최대 10명)으로 거절했습니다. 핸들러가 어떤 오류 메타데이터를 돌려줘야 에이전트가 가장 잘 대응할 수 있습니까?

- **①** errorCategory "business", isRetryable false, 그리고 에이전트가 사용자에게 그대로 전할 수 있는 10명 제한에 대한 고객용 설명
- **②** errorCategory "transient", isRetryable true. 에이전트가 기다렸다가 백오프와 함께 같은 요청을 다시 보내게 한다
- **③** errorCategory "validation", isRetryable true. 에이전트가 명단을 줄여 다시 호출할 수 있기 때문이다
- **④** errorCategory "permission", isRetryable false. 에이전트가 더 넓은 접근 권한을 가진 자격 증명을 요청하게 한다

> **핵심:** 누가 어떤 형식으로 보내든 거절되는 규칙 위반은 **비즈니스 오류**이고, 같은 요청은 결코 성공하지 않으므로 재시도 불가이며 사용자에게 전할 설명이 필요합니다.

1. **정답** - 캘린더의 참석자 상한은 요청 내용에 적용되는 규칙이므로 business입니다. 같은 요청을 다시 보내도 결과가 같으니 isRetryable은 false이고, 고객용 설명이 있으면 에이전트가 시스템 장애라고 사과하는 대신 "이벤트당 10명까지라 두 세션으로 나눌 수 있다" 같은 대안을 제시할 수 있습니다.
2. **오답** - transient는 타임아웃·속도 제한·일시적 장애처럼 아무것도 바꾸지 않아도 나중에 성공할 수 있는 경우입니다. 참석자 상한은 기다린다고 바뀌지 않으므로, 백오프 재시도는 같은 거절만 반복합니다.
3. **오답** - 명단을 줄여 다시 보내는 것은 같은 요청의 재시도가 아니라 내용이 바뀐 새 요청입니다. isRetryable은 "똑같은 요청을 다시 보내면 성공하는가"를 묻는 값이므로 true는 틀립니다. 또한 입력 형식이 잘못된 것이 아니라 규칙에 걸린 것이므로 validation도 맞지 않습니다.
4. **오답** - permission은 **누가** 호출하느냐(자격 증명·역할)의 문제입니다. 이 거절은 호출자와 상관없이 요청 내용 때문에 일어나므로, 더 넓은 자격 증명을 구해도 해결되지 않습니다.

📚 근거: [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

> "I tried to schedule the all-hands but the calendar only allows 10 attendees per event. I can split this into two sessions"

---

## 문제 10
### **A team is reviewing an MCP tool's error contract before launch. The current design returns `isError: true` with additional custom fields `errorCategory: "validation"` and `isRetryable: true` whenever the caller omits a required `customer_id` argument, on the reasoning that the agent might supply it correctly on a later attempt within the same conversation. What is the primary flaw in this retry guidance?**

| 보기 | 설명 |
|------|------|
| 1. The error contract includes fields that are not part of the MCP specification. MCP tool responses only define `isError` to indicate an error; there is no standard `errorCategory` or `isRetryable` field, so consumers may ignore these custom fields and miss the intended recovery guidance. | |
| **2. The flaw is that `isRetryable` should be `false`. A missing required argument is a validation error, which means the request is malformed. Retrying the same request will not succeed; the agent must correct the input before retrying. Setting `isRetryable` to `true` misleads the agent into thinking the same request can be retried as-is.** | |
| 3. The `errorCategory` should be set to `'transient'` instead of `'validation'` because the error can be resolved later by the agent, implying a temporary condition. | |
| 4. The `isError` field should be set to `false` because the tool can still return a result when the `customer_id` is missing, making the invocation technically successful. | |

**정답: 2.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — Structured error responses for MCP tools

**📝 문제 번역**

출시 전 한 팀이 MCP 도구의 오류 계약을 검토합니다. 현재 설계는 호출자가 필수 인자 `customer_id`를 빠뜨리면 `isError: true`에 사용자 정의 필드 `errorCategory: "validation"`과 `isRetryable: true`를 붙여 돌려줍니다. 같은 대화 안의 다음 시도에서 에이전트가 올바르게 채울 수도 있다는 이유입니다. 이 재시도 안내의 주된 결함은 무엇입니까?

- **①** 오류 계약에 MCP 명세에 없는 필드가 들어 있다. MCP 도구 응답은 오류를 나타내는 `isError`만 정의하며 표준 `errorCategory`·`isRetryable` 필드는 없으므로, 소비자가 이 필드를 무시해 의도한 복구 안내를 놓칠 수 있다
- **②** 결함은 `isRetryable`이 `false`여야 한다는 점이다. 필수 인자 누락은 요청이 잘못된 형식이라는 뜻의 검증 오류다. 같은 요청을 재시도해도 성공하지 않으며 에이전트가 먼저 입력을 고쳐야 한다. `true`로 두면 같은 요청을 그대로 다시 보내도 된다고 오해하게 만든다
- **③** 에이전트가 나중에 해결할 수 있으니 일시적인 상황이라는 뜻이므로, `errorCategory`를 `'validation'` 대신 `'transient'`로 해야 한다
- **④** `customer_id`가 없어도 도구가 결과를 돌려줄 수 있어 호출은 기술적으로 성공이므로 `isError`를 `false`로 해야 한다

> **핵심:** `isRetryable`은 "**똑같은** 요청을 다시 보내면 성공하는가"에 대한 답입니다. 입력을 고쳐야 성공하는 오류는, 에이전트가 쉽게 고칠 수 있더라도 false입니다.

1. **오답** - 부분적으로는 맞는 상호운용성 지적이지만 주된 결함은 아닙니다. MCP 명세는 `isError`와 결과 내용(`content`, 선택적 `structuredContent`)까지만 정하므로 분류 필드는 서버의 자체 규약이 맞습니다. 그러나 그것을 결과 내용에 넣는 것은 명세 위반이 아니라 합리적인 설계이고, 진짜 실수는 `isRetryable: true`라는 값입니다.
2. **정답** - 필수 필드 누락과 잘못된 입력은 검증 오류이고 재시도 불가입니다. 같은 잘못된 요청은 매번 같은 검증에서 실패하므로 `isRetryable`은 `false`여야 하고, 에이전트는 빠진 `customer_id`를 채운 **새** 호출을 보내야 합니다. `errorCategory: "validation"` 자체는 적절하며, 틀린 것은 재시도 플래그뿐입니다.
3. **오답** - 필수 인자 누락은 백엔드나 네트워크의 일시적 상태가 아니라 클라이언트 쪽 검증 실패입니다. transient는 429, 5xx, 네트워크 오류처럼 저절로 풀릴 수 있는 경우에 씁니다. "나중에 고칠 수 있다"와 "저절로 사라진다"는 다른 이야기입니다.
4. **오답** - 필수 인자를 빠뜨린 호출은 도구의 계약을 이행하지 못했으므로 `isError: true`로 실패를 알리는 것이 맞습니다. MCP 명세도 입력 검증 오류를 `isError: true`인 도구 실행 오류로 보고하라고 예시합니다.

📚 근거: [MCP Specification: Tools (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

> "Input validation errors (e.g., date in wrong format, value out of range)"

---

## 문제 11
### **A `deploy_service` MCP tool requires an API token scoped to the `deploy` role. An agent calls it using a token scoped only to `read`. The server returns `isError: true` with generic text "Operation failed." Under a structured error design, how should this failure be categorized and handled differently from a network timeout on the same tool?**

| 보기 | 설명 |
|------|------|
| **1. Use `errorCategory: "permission"` with `isRetryable: false`; the same token keeps failing on resubmission, so the caller needs one with a wider role first** | |
| 2. Use `errorCategory: "transient"` with `isRetryable: true`; the deploy service refused the call as it does during an outage, so retrying with backoff should get through | |
| 3. Use `errorCategory: "validation"` with `isRetryable: true`; the token was rejected as malformed input, so resubmitting it in the expected format should be accepted | |
| 4. Use `errorCategory: "business"` with `isRetryable: false`; the refusal is a policy rule on the request, so the caller should escalate it instead of resubmitting | |

**정답: 1.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — Structured error responses for MCP tools

**📝 문제 번역**

`deploy_service` MCP 도구는 `deploy` 역할로 범위가 지정된 API 토큰을 요구합니다. 에이전트가 `read` 범위만 가진 토큰으로 호출했고, 서버는 `isError: true`와 일반 텍스트 "Operation failed."를 돌려줍니다. 구조화된 오류 설계에서 이 실패는 어떻게 분류하고, 같은 도구의 네트워크 타임아웃과는 어떻게 다르게 처리해야 합니까?

- **①** `errorCategory: "permission"`, `isRetryable: false`. 같은 토큰은 다시 보내도 계속 실패하므로 호출자는 먼저 더 넓은 역할의 토큰을 구해야 한다
- **②** `errorCategory: "transient"`, `isRetryable: true`. 배포 서비스가 장애 때처럼 호출을 거절한 것이니 백오프로 재시도하면 통과한다
- **③** `errorCategory: "validation"`, `isRetryable: true`. 토큰이 잘못된 입력으로 거절되었으니 기대 형식으로 다시 보내면 받아들여진다
- **④** `errorCategory: "business"`, `isRetryable: false`. 요청에 대한 정책 규칙 때문에 거절된 것이니 다시 보내지 말고 상위로 올려야 한다

> **핵심:** **누가** 호출하느냐(자격 증명의 역할) 때문에 거절되면 권한 오류이고, 같은 토큰으로는 매번 실패하므로 재시도 불가입니다. 저절로 풀릴 수 있는 타임아웃과는 정반대입니다.

1. **정답** - `read` 범위 토큰에는 도구가 요구하는 역할이 없습니다. 가용성이 아니라 접근의 문제이고, 같은 자격 증명은 매번 같은 거절을 받으므로 올바른 역할의 토큰을 얻을 때까지 재시도 불가로 표시해야 합니다. 반면 타임아웃은 기다리면 풀릴 수 있어 transient·재시도 가능입니다.
2. **오답** - 서버는 응답했고 명시적인 오류를 돌려주었으므로 장애를 암시하는 것이 없습니다. 토큰의 범위는 호출자 자격 증명의 고정된 속성이라 기다리거나 백오프해도 바뀌지 않으며, 재시도는 매번 똑같이 실패합니다.
3. **오답** - 토큰은 형식이 올바른 자격 증명이고 범위가 좁을 뿐입니다. 형식을 바꾸거나 다시 보내도 빠진 역할이 생기지 않으므로 입력 형식이 아니라 인가의 문제입니다. 재시도 가능으로 표시하면 에이전트가 실패하는 시도를 반복하게 됩니다.
4. **오답** - 비즈니스 오류는 환불 기간처럼 요청 **내용**에 대한 규칙에서 나옵니다. 이 호출은 호출자의 자격 증명에 deploy 역할이 없어서 거절되었으므로 권한 오류의 전형입니다. business로 표시하면 진짜 원인을 가리고 엉뚱한 해결책을 가리키게 됩니다.

📚 근거: [MCP Specification: Tools (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) · [MCP Specification: Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

---

## 문제 12
### **Which report should reach the coordinator when a subagent enriching 50 customer records through `lookup_address` gets 47 successes and 3 `isError: true` results with errorCategory "permission" because its credentials don't cover those customers' region?**

| 보기 | 설명 |
|------|------|
| **1. The enriched records, plus the unresolved customers each with their permission error and description, plus a record of which lookups were attempted** | |
| 2. Nothing yet: the subagent first retries the permission failures with backoff, then reports once they clear | |
| 3. A single `isError: true` result for the whole batch, because not every record could be enriched | |
| 4. Only the enriched records, leaving the failed customers out so the coordinator receives a clean batch | |

**정답: 1.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — Structured error responses for MCP tools

**📝 문제 번역**

`lookup_address`로 고객 레코드 50건을 보강하던 서브에이전트가 47건은 성공했고, 3건은 자격 증명이 해당 고객의 지역을 다루지 못해 errorCategory "permission"인 `isError: true` 결과를 받았습니다. 코디네이터에게는 어떤 보고가 가야 합니까?

- **①** 보강된 레코드, 해결되지 않은 고객 각각과 그 권한 오류 및 설명, 그리고 어떤 조회를 시도했는지의 기록
- **②** 아직 아무것도 보내지 않는다. 서브에이전트가 먼저 권한 실패를 백오프로 재시도하고, 풀리면 그때 보고한다
- **③** 모든 레코드를 보강하지 못했으므로 배치 전체에 대해 `isError: true` 결과 하나를 보낸다
- **④** 보강된 레코드만 보내고, 코디네이터가 깔끔한 배치를 받도록 실패한 고객은 뺀다

> **핵심:** 서브에이전트는 스스로 고칠 수 없는 오류를 멈추고 올려야 하며, 보고에는 **부분 결과·해결되지 않은 오류·시도 내역**이 함께 담겨야 합니다.

1. **정답** - 권한 오류는 같은 자격 증명으로 다시 보내도 결과가 바뀌지 않으므로 재시도 불가이고, 서브에이전트가 로컬에서 고칠 수 없습니다. 47건의 결과를 넘기면 좋은 작업이 보존되고, 3건의 오류와 설명으로 빈틈이 보이며, 시도 내역 덕분에 코디네이터가 이미 실패한 조회를 반복하지 않습니다.
2. **오답** - 백오프는 일시적 오류에 쓰는 처방입니다. 권한 오류는 결정적이라 같은 자격 증명으로는 결코 풀리지 않으므로, 보고가 끝없이 미뤄지고 호출만 낭비됩니다.
3. **오답** - 배치 전체를 오류로 표시하면 3건의 실패 때문에 멀쩡한 47건의 결과까지 버리게 됩니다. 코디네이터는 쓸 수 있는 것이 하나도 없는 상태가 됩니다.
4. **오답** - 실패를 빼고 보내면 빈틈이 숨겨집니다. 코디네이터는 배치가 완전하다고 믿고, 3건이 왜 보강되지 않았는지 끝내 알지 못합니다.

📚 근거: [MCP Specification: Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) · [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent)

> "Tool Execution Errors contain actionable feedback that language models can use to self-correct and retry with adjusted parameters"

---

## 문제 13
### **A subagent responsible for enriching customer records calls an internal `lookup_address` tool for 50 customers. For 47 the lookup succeeds; for 3 the tool returns `isError: true` with `errorCategory: "permission"` because the subagent's credentials lack access to those records' region. The subagent cannot obtain broader credentials itself. What should it send back to the coordinator?**

| 보기 | 설명 |
|------|------|
| **1. Return the 47 enriched records as partial results, with a report listing the 3 unresolved customers, the permission error and the lookups attempted** | |
| 2. Return the 47 enriched records as the batch result and leave out the 3 customers whose lookups failed with the permission error | |
| 3. Return an `isError: true` result for the whole batch with the permission category, and hold back the 47 records until the 3 lookups are fixed | |
| 4. Return the batch after retrying the 3 failed lookups with exponential backoff and the same credentials, until the permission error clears | |

**정답: 1.**

**해설:**

> 📘 레슨 2.2 · MCP 오류 응답 — Structured error responses for MCP tools

**📝 문제 번역**

고객 레코드 보강을 맡은 서브에이전트가 내부 `lookup_address` 도구를 고객 50명에게 호출합니다. 47명은 조회에 성공했고, 3명은 서브에이전트의 자격 증명이 그 레코드의 지역에 접근할 수 없어 `errorCategory: "permission"`인 `isError: true`가 돌아왔습니다. 서브에이전트는 스스로 더 넓은 자격 증명을 얻을 수 없습니다. 코디네이터에게 무엇을 돌려줘야 합니까?

- **①** 보강된 47건을 부분 결과로 돌려주고, 해결되지 않은 고객 3명, 권한 오류, 시도한 조회를 나열한 보고를 함께 보낸다
- **②** 보강된 47건을 배치 결과로 돌려주고, 권한 오류로 조회에 실패한 고객 3명은 뺀다
- **③** 배치 전체에 대해 권한 분류를 담은 `isError: true` 결과를 돌려주고, 3건이 고쳐질 때까지 47건은 보류한다
- **④** 실패한 3건을 같은 자격 증명으로 지수 백오프와 함께 권한 오류가 풀릴 때까지 재시도한 뒤 배치를 돌려준다

> **핵심:** 자격 증명 범위의 빈틈은 서브에이전트가 고칠 수 없으므로 **위로 넘기되**, 성공한 결과와 실패한 대상·원인·시도 내역을 함께 넘겨야 코디네이터가 다음 단계를 정할 수 있습니다.

1. **정답** - 서브에이전트는 자격 증명 범위 문제를 직접 해결할 수 없으니 문제를 위로 넘깁니다. 완료된 47건, 해결되지 않은 3명, 권한 오류와 시도 내역을 함께 보내면 코디네이터가 다른 자격 증명으로 재위임할지, 사람에게 넘길지 결정할 수 있습니다.
2. **오답** - 실패 정보 없이 47건만 보내면 해결되지 않은 권한 문제가 숨겨집니다. 코디네이터는 배치가 끝났다고 여기고, 3명이 보강되지 않았다는 사실도 그 이유도 알지 못합니다.
3. **오답** - 47건의 조회는 성공했고 그 레코드는 유효하므로 보류하면 완료된 작업을 낭비합니다. 서브에이전트는 3건의 권한 실패를 고칠 수도 없으니, 코디네이터는 쓸 수 있는 것도 진행할 방법도 받지 못합니다.
4. **오답** - 백오프는 일시적 장애에 도움이 되지만 권한 오류는 결정적입니다. 서브에이전트가 더 넓은 자격 증명을 얻을 수 없으므로 같은 호출은 계속 실패하고 배치는 영영 돌아오지 않습니다.

📚 근거: [MCP Specification: Tools (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) · [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent)

---

## 문제 14
### **A research agent has grown from 5 tools to 18, and several of them now partly overlap. It increasingly calls the wrong tool for a request. Which change most directly fixes this?**

| 보기 | 설명 |
|------|------|
| **1. Split it into specialised agents, each choosing from about 4–5 tools for its stage** | |
| 2. Leave it as it is until it reaches 30–50 tools, the point where accuracy visibly degrades | |
| 3. Switch to a more capable model, because the selection errors show the current model can't handle the task | |
| 4. Cache tool results and reduce the number of API calls the agent makes each turn | |

**정답: 1.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — Scoping tools per agent and configuring tool_choice

**📝 문제 번역**

리서치 에이전트의 도구가 5개에서 18개로 늘었고, 그중 몇 개는 기능이 일부 겹칩니다. 요청에 맞지 않는 도구를 부르는 일이 점점 잦아집니다. 이를 가장 직접적으로 고치는 변경은 무엇입니까?

- **①** 단계별로 약 4~5개 도구 중에서만 고르는 전문 에이전트들로 나눈다
- **②** 정확도가 눈에 띄게 떨어지는 지점인 30~50개에 이를 때까지 그대로 둔다
- **③** 선택 오류는 현재 모델이 작업을 감당하지 못한다는 뜻이므로 더 뛰어난 모델로 바꾼다
- **④** 도구 결과를 캐시하고 에이전트가 턴마다 하는 API 호출 수를 줄인다

> **핵심:** 후보가 많고 서로 비슷할수록 한 번의 선택이 복잡해지므로, 해결은 구조적으로 **에이전트당 후보 수를 줄이는 것**입니다.

1. **정답** - 역할별 전문 에이전트로 나누면 각 에이전트가 매 턴 비교하는 후보가 4~5개로 줄어듭니다. Writing tools for agents 글도 도구가 너무 많거나 겹치면 에이전트가 효율적인 전략에서 벗어난다고 경고합니다.
2. **오답** - Agent SDK tool search 문서의 "30~50개를 넘게 한 번에 실으면 선택 정확도가 떨어진다"는 눈에 띄는 저하가 시작되는 지점일 뿐입니다. 18개로도 이미 필요 이상으로 어려운 선택을 하고 있고, 겹치는 도구가 이를 더 악화시킵니다.
3. **오답** - 모델이 덜 유능해진 것이 아니라, 비슷해 보이는 선택지를 더 많이 구분하라고 요구받는 것입니다. 모델을 바꿔도 결정의 복잡도는 그대로입니다.
4. **오답** - 캐시와 호출 수 감소는 비용과 지연을 줄일 수 있지만, 턴마다 고르는 후보 집합은 그대로입니다. 선택 오류의 원인을 건드리지 못합니다.

📚 근거: [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) · [Agent SDK: Tool search](https://code.claude.com/docs/en/agent-sdk/tool-search)

> "Too many tools or overlapping tools can also distract agents from pursuing efficient strategies."

---

## 문제 15
### **A single generalist agent handling an entire content pipeline (research, outline, draft, edit, publish) has 20 tools and shows declining tool-selection accuracy as more tools were added over time. The architect proposes splitting it into five specialized subagents, each scoped to roughly 4 tools for its stage, coordinated by a lightweight orchestrator. What is the main reliability benefit of this redesign, based on the relationship between tool count and selection accuracy?**

| 보기 | 설명 |
|------|------|
| **1. Each subagent now discriminates among a much smaller candidate set, which directly reduces the decision complexity that was degrading tool selection at 20 tools** | |
| 2. Splitting into subagents reduces the total number of API calls made across the whole pipeline, which is the main source of the earlier selection errors | |
| 3. Each subagent now runs on a smaller context window, which forces the model to think more carefully before selecting a tool | |
| 4. The orchestrator caches tool results across subagents, which eliminates the need for most subagents to make tool calls at all | |

**정답: 1.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — Scoping tools per agent and configuring tool_choice

**📝 문제 번역**

콘텐츠 파이프라인 전체(리서치·개요·초안·편집·게시)를 맡은 범용 에이전트 하나가 도구 20개를 갖고 있고, 도구가 추가될수록 도구 선택 정확도가 떨어졌습니다. 설계자는 이를 가벼운 오케스트레이터가 조율하는, 단계별로 약 4개 도구만 가진 전문 서브에이전트 5개로 나누자고 제안합니다. 도구 수와 선택 정확도의 관계에 비춰 볼 때, 이 재설계의 주된 신뢰성 이점은 무엇입니까?

- **①** 각 서브에이전트가 훨씬 작은 후보 집합에서 고르게 되어, 20개 도구에서 선택을 떨어뜨리던 결정의 복잡도가 직접 줄어든다
- **②** 서브에이전트로 나누면 파이프라인 전체의 API 호출 수가 줄어드는데, 그것이 앞선 선택 오류의 주된 원인이었다
- **③** 각 서브에이전트가 더 작은 컨텍스트 윈도에서 실행되어 모델이 도구를 고르기 전에 더 신중하게 생각하게 된다
- **④** 오케스트레이터가 서브에이전트들 사이에서 도구 결과를 캐시해 대부분의 서브에이전트가 도구를 아예 부를 필요가 없어진다

> **핵심:** 결정의 복잡도는 에이전트가 비교해야 하는 도구 수에 비례해 커지므로, 에이전트마다 도구를 약 4개로 좁히면 후보 집합이 줄어 선택 신뢰도가 돌아옵니다.

1. **정답** - 핵심 원리는 결정 복잡도가 비교 대상 도구 수와 함께 커진다는 것입니다. 각 서브에이전트를 자기 단계의 4개 정도로 좁히면 후보 집합이 직접 작아지고, 20개에서 떨어졌던 선택 신뢰도가 회복됩니다.
2. **오답** - 서브에이전트로 나눈다고 파이프라인 전체의 API 호출이 반드시 줄지는 않습니다. 게다가 호출 수는 선택 오류의 원인으로 지목된 적도 없으므로 신뢰성 이점을 설명하지 못합니다.
3. **오답** - 서브에이전트의 컨텍스트 크기는 이 도구 선택 문제와 관계가 없습니다. 문제는 경쟁하는 도구의 수였지, 추론에 쓸 수 있는 컨텍스트의 양이 아니었습니다.
4. **오답** - 시나리오에는 캐시 장치가 없고, 도구 호출을 없애는 것이 목표도 아닙니다. 각 서브에이전트는 여전히 자기 범위의 도구를 불러 일해야 합니다.

📚 근거: [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "Fewer, more capable tools reduce selection ambiguity and make your tool surface easier for Claude to navigate."

---

## 문제 16
### **In a multi-agent pipeline, every subagent shares the same tool set. The synthesis agent keeps running its own web searches, and the QA agent once called the deploy tool. What is the most dependable fix?**

| 보기 | 설명 |
|------|------|
| 1. Keep the shared tool set and set each subagent's tool_choice to "any" so tool calls are tightly controlled | |
| **2. Give each subagent a tools list containing only the tools its role needs, and leave tool_choice at "auto"** | |
| 3. Leave out the tools field on each subagent so it falls back to a safe default set | |
| 4. Keep the shared tool set and add role instructions to each prompt telling the agent not to use other roles' tools | |

**정답: 2.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — Scoping tools per agent and configuring tool_choice

**📝 문제 번역**

멀티에이전트 파이프라인에서 모든 서브에이전트가 같은 도구 세트를 공유합니다. 종합(synthesis) 에이전트는 자꾸 직접 웹 검색을 하고, QA 에이전트는 한 번 배포 도구를 호출했습니다. 가장 믿을 만한 해결책은 무엇입니까?

- **①** 공유 도구 세트는 유지하고 각 서브에이전트의 `tool_choice`를 "any"로 설정해 도구 호출을 엄격하게 통제한다
- **②** 각 서브에이전트에 그 역할에 필요한 도구만 담은 `tools` 목록을 주고, `tool_choice`는 "auto"로 둔다
- **③** 각 서브에이전트에서 `tools` 필드를 생략해 안전한 기본 세트로 돌아가게 한다
- **④** 공유 도구 세트는 유지하고 각 프롬프트에 다른 역할의 도구를 쓰지 말라는 역할 지시를 넣는다

> **핵심:** 오용은 도구가 손에 있기 때문에 일어납니다. 역할 밖 도구는 **범위에서 빼고**, `tool_choice`는 auto로 두어 에이전트가 턴마다 행동할지 답할지 고르게 합니다.

1. **오답** - `tool_choice`는 도구를 **호출할지 여부**를 정할 뿐 에이전트가 **어떤 도구를 가졌는지**는 바꾸지 않습니다. any로 바꾸면 QA 에이전트는 여전히 배포 도구를 갖고 있고, 오히려 매 턴 무언가를 호출해야 해서 텍스트로 답할 수도 없게 됩니다.
2. **정답** - 역할에 필요한 도구만 `tools`에 나열하면 웹 검색과 배포 도구가 해당 에이전트의 세션에서 사라져 오용 자체가 불가능해집니다. auto를 유지하면 에이전트는 여전히 매 턴 도구를 부를지 직접 답할지 스스로 판단합니다.
3. **오답** - Claude Code 서브에이전트 문서에 따르면 `tools`를 생략하면 서브에이전트가 쓸 수 있는 모든 도구를 물려받습니다. "안전한 기본 세트"는 없고, 사실상 전체 도구의 합집합을 받게 됩니다.
4. **오답** - 프롬프트 지시는 확률적인 억제일 뿐 도구는 여전히 선택지에 남아 있습니다. 오용을 완전히 막지 못하므로 가장 믿을 만한 방법이 아닙니다.

📚 근거: [Agent SDK: Subagents](https://code.claude.com/docs/en/agent-sdk/subagents) · [Claude Code: Create custom subagents](https://code.claude.com/docs/en/sub-agents)

> "Tool restrictions: subagents can be limited to specific tools, reducing the risk of unintended actions."

---

## 문제 17
### **Your document-processing agent holds a generic fetch_url tool. It has started pulling arbitrary web pages that are not documents, even though its prompt says to load only documents. What is the most dependable fix?**

| 보기 | 설명 |
|------|------|
| 1. Keep fetch_url and add stronger prompt instructions listing which URLs count as documents | |
| **2. Replace fetch_url with a load_document tool that checks the URL points to a document before fetching it** | |
| 3. Keep fetch_url and set tool_choice to {"type": "tool", "name": "fetch_url"} so every call goes through one controlled tool | |
| 4. Remove fetch_url and send every document load through the coordinator to the research agent | |

**정답: 2.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — Scoping tools per agent and configuring tool_choice

**📝 문제 번역**

문서 처리 에이전트가 범용 `fetch_url` 도구를 갖고 있습니다. 프롬프트에 문서만 불러오라고 했는데도, 문서가 아닌 임의의 웹 페이지를 가져오기 시작했습니다. 가장 믿을 만한 해결책은 무엇입니까?

- **①** `fetch_url`을 유지하고, 어떤 URL이 문서에 해당하는지 나열하는 더 강한 프롬프트 지시를 넣는다
- **②** `fetch_url`을 가져오기 전에 URL이 문서를 가리키는지 확인하는 `load_document` 도구로 바꾼다
- **③** `fetch_url`을 유지하고 `tool_choice`를 `{"type": "tool", "name": "fetch_url"}`로 설정해 모든 호출이 통제된 도구 하나를 거치게 한다
- **④** `fetch_url`을 없애고, 모든 문서 로딩을 코디네이터를 거쳐 리서치 에이전트에 보낸다

> **핵심:** 범용 도구는 역할이 필요로 하는 것보다 큰 힘을 줍니다. 규칙을 **도구 안에** 넣은 좁은 도구로 바꾸면 모델이 규칙을 우회할 수 없습니다.

1. **오답** - 프롬프트 지시는 원래의 범용 능력을 그대로 남깁니다. 모델은 여전히 어떤 URL이든 가져올 수 있고, 지시는 그 사용을 확률적으로 줄일 뿐입니다.
2. **정답** - 특정 워크플로를 위한 좁은 도구를 만들면 "문서만"이라는 규칙이 도구 구현 안에 들어가 모델이 말로 비켜 갈 수 없습니다. Writing tools for agents 글이 `list_contacts` 대신 `search_contacts`를 만들라고 하는 것과 같은 원리입니다.
3. **오답** - `fetch_url`을 강제해도 그 도구는 여전히 어떤 URL이든 받습니다. 강제 호출은 호출 여부만 정할 뿐 범위를 좁히지 못하고, 매 턴 같은 도구를 부르게 만들어 다른 단계로 넘어가지도 못합니다.
4. **오답** - 문서 로딩은 이 에이전트 역할의 핵심이자 잦은 작업입니다. 매번 코디네이터를 거치게 하면 핵심 작업마다 왕복이 추가됩니다. 코디네이터 경유는 드물고 복잡한 교차 역할 작업에 맞는 처방입니다.

📚 근거: [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) · [Claude Code: Create custom subagents](https://code.claude.com/docs/en/sub-agents)

> "In the address book case, you might choose to implement a search_contacts or message_contact tool instead of a list_contacts tool."

---

## 문제 18
### **A coordinator agent delegates tasks to a research agent, a coding agent, and a QA agent. Currently, every subagent is configured with the full union of all tools used anywhere in the pipeline, so each has around 15 tools available, and each agent's tool choice is left at {"type": "auto"} in every turn. The team reports agents occasionally reaching for tools clearly outside their remit, like the QA agent invoking a deploy tool. What combination of changes best addresses this while preserving each agent's ability to decide when to act versus respond?**

| 보기 | 설명 |
|------|------|
| **1. Restrict each subagent's tool set to only what its role needs, while keeping tool_choice at {"type": "auto"} so each agent still decides per turn whether to call a tool.** | |
| 2. Keep the shared 15-tool set for all subagents, but switch every subagent's tool_choice to {"type": "any"} so a tool call is always forced, ensuring subagents cannot respond without selecting a tool. | |
| 3. Keep the shared 15-tool set for all subagents, but switch every subagent's tool_choice to {"type": "none"} so no subagent can call tools directly, requiring the coordinator to invoke tools on its behalf. | |
| 4. Restrict each subagent's tool set to only what its own role needs, and also force every subagent's tool_choice to a single named tool for all turns, such as search tool for research and test tool for QA. | |

**정답: 1.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — Scoping tools per agent and configuring tool_choice

**📝 문제 번역**

코디네이터 에이전트가 리서치·코딩·QA 에이전트에 작업을 위임합니다. 지금은 모든 서브에이전트가 파이프라인 어디선가 쓰이는 모든 도구의 합집합을 받아 각자 15개 정도의 도구를 갖고 있고, 모든 턴에서 `tool_choice`는 `{"type": "auto"}`입니다. QA 에이전트가 배포 도구를 부르는 것처럼 에이전트가 명백히 자기 소관 밖의 도구를 쓰는 일이 가끔 있습니다. 각 에이전트가 행동할지 답할지 스스로 정하는 능력을 지키면서 이 문제를 가장 잘 해결하는 변경 조합은 무엇입니까?

- **①** 각 서브에이전트의 도구 세트를 그 역할에 필요한 것으로 제한하되, `tool_choice`는 `{"type": "auto"}`로 유지해 각 에이전트가 턴마다 도구를 부를지 계속 판단하게 한다
- **②** 모든 서브에이전트에 공유 15개 도구 세트를 유지하되, `tool_choice`를 `{"type": "any"}`로 바꿔 항상 도구 호출을 강제해 서브에이전트가 도구 없이 답하지 못하게 한다
- **③** 모든 서브에이전트에 공유 15개 도구 세트를 유지하되, `tool_choice`를 `{"type": "none"}`으로 바꿔 서브에이전트가 직접 도구를 부르지 못하게 하고 코디네이터가 대신 호출하게 한다
- **④** 각 서브에이전트의 도구 세트를 역할에 맞게 제한하고, 리서치는 검색 도구, QA는 테스트 도구처럼 모든 턴에서 `tool_choice`를 도구 하나로 강제한다

> **핵심:** 도구 **범위**는 무엇을 쓸 수 있는지를, `tool_choice`는 **호출 여부**를 정합니다. 역할 밖 도구 오용은 범위로 풀고, 판단의 자유는 auto로 지킵니다.

1. **정답** - 역할에 필요한 도구로 제한하면 QA 에이전트의 배포 도구처럼 오용의 원인이 된 역할 밖 도구가 직접 사라집니다. `auto`를 유지하면 각 에이전트가 매 턴 도구가 필요한지 스스로 판단하는 능력도 요구대로 보존됩니다.
2. **오답** - 지나치게 넓은 15개 세트를 그대로 두므로 QA 에이전트는 여전히 배포 도구를 가집니다. `any`는 매 턴 도구 호출을 보장하므로 부적절한 사용 가능성을 오히려 높이고, 텍스트로 답할 선택지도 없앱니다.
3. **오답** - `none`은 서브에이전트의 도구 호출을 완전히 막아 위임 파이프라인을 망가뜨립니다. 범위 문제를 다루지도 않고, 시나리오가 지키라고 한 "행동할지 정하는 능력"까지 없앱니다.
4. **오답** - 범위를 역할에 맞추는 것은 옳은 방향이지만, 모든 턴에서 도구 하나를 강제하면 작업에 따라 알맞은 도구를 고르거나 텍스트로 끝낼 유연성이 사라집니다. 에이전트가 언제, 어떤 도구를 쓸지 정하게 하라는 요구와 충돌합니다.

📚 근거: [Agent SDK: Subagents](https://code.claude.com/docs/en/agent-sdk/subagents) · [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "auto allows Claude to determine whether to call any provided tools."

---

## 문제 19
### **A document-processing agent has both an extract_metadata tool and several enrichment tools (add_tags, link_related, generate_summary). The enrichment tools depend on fields that only extract_metadata produces, and in early tests the model sometimes calls an enrichment tool first with guessed values. What is the recommended way to guarantee correct ordering for this first step?**

| 보기 | 설명 |
|------|------|
| **1. Set tool_choice to {"type": "tool", "name": "extract_metadata"} on the turn where metadata is needed, then let the model choose from the enrichment tools with auto or any on subsequent turns.** | |
| 2. Remove the enrichment tools from the agent's tool list on the first turn and only provide extract_metadata, then after extract_metadata returns, re-add add_tags, link_related, and generate_summary for subsequent turns. | |
| 3. Add a detailed description to each enrichment tool stating that they require metadata fields only extract_metadata can provide, and keep tool_choice set to auto throughout the conversation. | |
| 4. Set tool_choice to {"type": "any"} for the entire conversation, so the model must select a tool on every turn, relying on its training to choose extract_metadata first when metadata is absent. | |

**정답: 1.**

**해설:**

> 📘 레슨 2.3 · 도구 범위·tool_choice — Scoping tools per agent and configuring tool_choice

**📝 문제 번역**

문서 처리 에이전트에 `extract_metadata` 도구와 여러 보강(enrichment) 도구(`add_tags`, `link_related`, `generate_summary`)가 있습니다. 보강 도구는 `extract_metadata`만 만들어 내는 필드에 의존하는데, 초기 테스트에서 모델이 가끔 추측한 값으로 보강 도구를 먼저 불렀습니다. 이 첫 단계의 올바른 순서를 **보장**하는 권장 방법은 무엇입니까?

- **①** 메타데이터가 필요한 턴에 `tool_choice`를 `{"type": "tool", "name": "extract_metadata"}`로 설정하고, 이후 턴에서는 auto나 any로 모델이 보강 도구 중에서 고르게 한다
- **②** 첫 턴에는 도구 목록에서 보강 도구를 빼고 `extract_metadata`만 제공한 뒤, 결과가 돌아오면 이후 턴을 위해 `add_tags`, `link_related`, `generate_summary`를 다시 추가한다
- **③** 각 보강 도구에 `extract_metadata`만 제공할 수 있는 메타데이터 필드가 필요하다는 자세한 설명을 넣고, 대화 내내 `tool_choice`는 auto로 둔다
- **④** 대화 전체에 `tool_choice`를 `{"type": "any"}`로 설정해 매 턴 도구를 고르게 하고, 메타데이터가 없으면 학습된 판단으로 `extract_metadata`를 먼저 고르리라고 기대한다

> **핵심:** 순서를 **보장**하는 것은 특정 도구를 지정한 강제 호출뿐입니다. 첫 턴만 강제하고, 결과를 돌려준 뒤에는 auto(또는 any)로 풀어 줍니다.

1. **정답** - 메타데이터가 필요한 턴에 `{"type": "tool", "name": "extract_metadata"}`를 주면 모델은 반드시 그 도구를 먼저 호출합니다. 결과가 대화에 들어온 뒤 auto나 any로 바꾸면 모델이 실제 메타데이터를 바탕으로 보강 도구를 자유롭게 고를 수 있습니다. (단, Define tools 문서 기준으로 Claude Opus 5.5·Sonnet 5.5·Fable 5.1·Mythos 5.1과 수동 extended thinking 요청은 `any`·`tool`을 400 오류로 거부하므로, 그런 환경에서는 auto와 strict tool use 등으로 대신해야 합니다.)
2. **오답** - 보강 도구를 뺐다가 다시 넣어도 동작은 하지만, `tool_choice`라는 표준 장치보다 무겁고 덜 일반적인 방식입니다. 권장 방법은 턴마다 도구 목록을 바꾸는 것이 아니라 첫 턴에서 특정 도구를 강제하는 것입니다.
3. **오답** - 설명을 보강하고 auto에 맡기는 것은 이미 테스트에서 믿을 수 없다고 드러난 "유도"에 해당합니다. 설명은 모델에 영향을 줄 수는 있어도 순서를 보장하지 않습니다.
4. **오답** - `any`는 매 턴 **어떤** 도구든 하나를 부르게 할 뿐 어느 것인지는 정하지 않습니다. 모델은 여전히 보강 도구를 먼저 고를 수 있으므로 순서가 보장되지 않습니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Tool choice (Cookbook)](https://platform.claude.com/cookbook/tool-use-tool-choice)

> "any tells Claude that it must use one of the provided tools, but doesn't force a particular tool."

---

## 문제 20
### **Your team is rolling out a shared GitHub MCP server, and each engineer authenticates with their own personal access token. Which setup gives every contributor the server without committing anyone's token?**

| 보기 | 설명 |
|------|------|
| **1. Add the server with --scope project, set the header to "Authorization: Bearer ${GITHUB_TOKEN}" in .mcp.json, and have each engineer export GITHUB_TOKEN in their own shell** | |
| 2. Add the server with --scope user and paste your token into the header, since ~/.claude.json is never committed to git | |
| 3. Add the server with --scope project and write the header as "Bearer ${GITHUB_TOKEN:-YOUR_REAL_TOKEN}", so the server still works for anyone who hasn't set the variable | |
| 4. Add the server with --scope project with the token written into the header, then add .mcp.json to .gitignore so the token stays out of the repository | |

**정답: 1.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — Configuring MCP servers in Claude Code: scopes, secrets and authentication

**📝 문제 번역**

팀이 공유 GitHub MCP 서버를 배포하는데, 엔지니어마다 자기 개인 액세스 토큰(PAT)으로 인증합니다. 누구의 토큰도 커밋하지 않고 모든 기여자가 서버를 받게 하는 설정은 무엇입니까?

- **①** `--scope project`로 서버를 추가하고, `.mcp.json`에서 헤더를 "Authorization: Bearer ${GITHUB_TOKEN}"으로 설정한 뒤, 엔지니어마다 자기 셸에서 GITHUB_TOKEN을 export한다
- **②** `--scope user`로 서버를 추가하고 헤더에 자기 토큰을 붙여 넣는다. `~/.claude.json`은 git에 커밋되지 않기 때문이다
- **③** `--scope project`로 서버를 추가하고 헤더를 "Bearer ${GITHUB_TOKEN:-YOUR_REAL_TOKEN}"으로 써서, 변수를 설정하지 않은 사람에게도 서버가 동작하게 한다
- **④** 토큰을 헤더에 직접 쓴 채 `--scope project`로 서버를 추가하고, 토큰이 저장소에 들어가지 않도록 `.mcp.json`을 `.gitignore`에 넣는다

> **핵심:** 공유는 커밋되는 `.mcp.json`(project 스코프)으로 하고, 비밀값은 `${VAR}` 확장으로 각자의 환경에서 채웁니다.

1. **정답** - project 스코프는 팀원이 받는 커밋된 `.mcp.json`에 기록됩니다. `${GITHUB_TOKEN}`은 Claude Code를 실행하는 사람의 환경에서 채워지므로 엔지니어마다 자기 토큰이 쓰이고, 파일에는 비밀값이 남지 않습니다.
2. **오답** - user 스코프는 `~/.claude.json`의 최상위 `mcpServers`에 저장되어 내 모든 프로젝트에서 로드되지만 공유되지 않습니다. 토큰은 git 밖에 머물지만 서버가 팀원에게 가지 않으므로 팀 배포가 아닙니다.
3. **오답** - `${VAR:-default}`는 변수가 없을 때 기본값으로 확장됩니다. 실제 토큰을 기본값으로 적으면 결국 비밀값을 커밋하는 셈입니다. 기본값은 리전 이름처럼 비밀이 아닌 값에만 씁니다.
4. **오답** - `.mcp.json`을 무시 목록에 넣으면 비밀값은 막지만 파일 자체가 공유되지 않습니다. project 스코프를 고른 이유인 팀 공유가 사라집니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) · [Connect to MCP servers (quickstart)](https://code.claude.com/docs/en/mcp-quickstart)

> "${VAR}: expands to the value of environment variable VAR"

---

## 문제 21
### **An architect is rolling out a GitHub MCP server for the whole engineering team. Every teammate has their own GitHub personal access token, and the config must be checked into the repo without ever committing a real secret. How should the architect configure this?**

| 보기 | 설명 |
|------|------|
| **1. Add the server with project scope in .mcp.json, and set the header to `Authorization: Bearer ${GITHUB_TOKEN}`, with each teammate defining that variable in their shell environment** | |
| 2. Add the server with user scope in ~/.claude.json, and set the header to `Authorization: Bearer <token>`, with each teammate filling in their own token on their machine | |
| 3. Add the server with local scope, and set the header to `Authorization: Bearer <token>` in .mcp.json, with each teammate replacing the placeholder with their own token | |
| 4. Add the server with project scope in .mcp.json, and add that file to .gitignore, with each teammate keeping their own token in the header of their local copy | |

**정답: 1.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — Configuring MCP servers in Claude Code: scopes, secrets and authentication

**📝 문제 번역**

설계자가 엔지니어링 팀 전체에 GitHub MCP 서버를 배포합니다. 팀원마다 자기 GitHub 개인 액세스 토큰이 있고, 설정은 저장소에 체크인하되 실제 비밀값은 절대 커밋하면 안 됩니다. 어떻게 구성해야 합니까?

- **①** `.mcp.json`에 project 스코프로 서버를 추가하고, 헤더를 `Authorization: Bearer ${GITHUB_TOKEN}`으로 설정한 뒤 팀원마다 셸 환경에 그 변수를 정의한다
- **②** `~/.claude.json`에 user 스코프로 서버를 추가하고, 헤더를 `Authorization: Bearer <token>`으로 설정한 뒤 팀원마다 자기 머신에서 토큰을 채운다
- **③** local 스코프로 서버를 추가하고 `.mcp.json`의 헤더를 `Authorization: Bearer <token>`으로 설정한 뒤, 팀원마다 자리표시자를 자기 토큰으로 바꾼다
- **④** `.mcp.json`에 project 스코프로 서버를 추가하고 그 파일을 `.gitignore`에 넣은 뒤, 팀원마다 로컬 사본의 헤더에 자기 토큰을 둔다

> **핵심:** 체크인되는 팀 설정은 project 스코프의 `.mcp.json`뿐이며, 그 안의 비밀값은 `${VAR}` 참조로 남겨 두고 값은 각자의 환경에서 채웁니다.

1. **정답** - project 스코프는 커밋되어 팀과 공유되는 `.mcp.json`에 서버를 씁니다. Claude Code는 연결하는 사람의 환경에서 `${GITHUB_TOKEN}`을 확장하므로 팀원 각자의 토큰이 쓰이고 파일에는 비밀값이 나타나지 않습니다.
2. **오답** - user 스코프는 한 머신의 사용자별 파일인 `~/.claude.json`에 저장됩니다. 저장소에는 아무것도 추가되지 않으므로 시나리오가 요구하는 체크인된 팀 설정이 생기지 않습니다.
3. **오답** - local 스코프는 한 프로젝트 안에서 한 사용자에게만 적용되며 `~/.claude.json`의 프로젝트 항목에 저장되고 `.mcp.json`에는 쓰지 않습니다. 또한 추적되는 `.mcp.json`에 팀원이 실제 토큰을 넣게 하면 비밀값이 커밋될 위험도 있습니다.
4. **오답** - `.mcp.json`을 무시하면 버전 관리에서 빠지므로 서버 정의가 저장소를 통해 공유되지 않습니다. 팀원마다 사본을 따로 만들어야 하므로 체크인된 팀 설정이라는 요구를 충족하지 못합니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) · [Connect to MCP servers (quickstart)](https://code.claude.com/docs/en/mcp-quickstart)

> "${VAR}: expands to the value of environment variable VAR"

---

## 문제 22
### **A developer has a local-scoped `analytics` server that still points at an old staging endpoint. The repository's committed .mcp.json also defines `analytics`, pointing at the team's production endpoint. `/mcp` now shows a conflict warning. The developer wants the team's production definition. What should they do?**

| 보기 | 설명 |
|------|------|
| 1. Nothing. Project scope always takes priority over local scope, so the production definition is already the one loading | |
| 2. Delete the url field from the local entry so the merged configuration takes its url from .mcp.json | |
| **3. Run `claude mcp remove analytics --scope local` so the project definition is the only `analytics` left** | |
| 4. Remove `analytics` from .mcp.json so the local entry stops conflicting with it | |

**정답: 3.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — Configuring MCP servers in Claude Code: scopes, secrets and authentication

**📝 문제 번역**

개발자에게 아직 예전 스테이징 엔드포인트를 가리키는 local 스코프 `analytics` 서버가 있습니다. 저장소에 커밋된 `.mcp.json`에도 팀의 프로덕션 엔드포인트를 가리키는 `analytics`가 정의되어 있습니다. 이제 `/mcp`에 충돌 경고가 보입니다. 개발자는 팀의 프로덕션 정의를 쓰고 싶습니다. 무엇을 해야 합니까?

- **①** 아무것도 하지 않는다. project 스코프가 항상 local 스코프보다 우선하므로 이미 프로덕션 정의가 로드되고 있다
- **②** local 항목에서 url 필드를 지워, 병합된 설정이 `.mcp.json`에서 url을 가져오게 한다
- **③** `claude mcp remove analytics --scope local`을 실행해 project 정의만 `analytics`로 남게 한다
- **④** `.mcp.json`에서 `analytics`를 지워 local 항목과 더는 충돌하지 않게 한다

> **핵심:** 같은 이름이 여러 스코프에 있으면 Claude Code는 우선순위가 가장 높은 출처(local → project → user)의 **정의 전체**를 하나만 쓰고, 필드를 섞지 않습니다.

1. **오답** - 우선순위는 local이 project보다 높습니다. 지금 이 개발자에게 로드되는 것은 오히려 local의 스테이징 정의입니다.
2. **오답** - 스코프 사이에는 필드 병합이 없습니다. url을 지운 local 항목은 그 자체로 불완전한 정의가 될 뿐, `.mcp.json`의 url을 물려받지 않습니다.
3. **정답** - 문서의 처방대로 원하는 엔드포인트만 남기고 나머지를 `claude mcp remove <name> --scope <scope>`로 지웁니다. local 항목을 지우면 이 개발자에게도 팀의 project 정의가 로드됩니다.
4. **오답** - `.mcp.json`에서 지우면 충돌은 없어지지만 프로덕션 정의가 모든 팀원에게서 사라지고, 이 개발자에게는 원치 않는 스테이징 정의만 남습니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) · [Connect to MCP servers (quickstart)](https://code.claude.com/docs/en/mcp-quickstart)

> "Keep the endpoint you want and remove the others with claude mcp remove <name> --scope <scope>."

---

## 문제 23
### **A repository's .mcp.json defines a server named `analytics`, and a developer also has a server named `analytics` added with local scope on their machine pointing at a different endpoint entirely. When that developer runs Claude Code in the project, which server definition is used?**

| 보기 | 설명 |
|------|------|
| **1. The local-scoped entry is used for this developer, and nothing from the project entry in .mcp.json is blended into its definition** | |
| 2. The project-scoped entry in .mcp.json is used for this developer, and the local entry is ignored until it is removed or renamed | |
| 3. Both entries are combined for this developer, and the local entry's fields override the project entry's only where they are set | |
| 4. Neither entry is used for this developer, and Claude Code reports a duplicate-name conflict until one of the two servers is renamed | |

**정답: 1.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — Configuring MCP servers in Claude Code: scopes, secrets and authentication

**📝 문제 번역**

저장소의 `.mcp.json`에 `analytics`라는 서버가 정의되어 있고, 한 개발자는 자기 머신에 완전히 다른 엔드포인트를 가리키는 `analytics`를 local 스코프로도 추가했습니다. 그 개발자가 이 프로젝트에서 Claude Code를 실행하면 어떤 서버 정의가 쓰입니까?

- **①** 이 개발자에게는 local 스코프 항목이 쓰이며, `.mcp.json`의 project 항목에서는 아무것도 섞여 들어오지 않는다
- **②** 이 개발자에게는 `.mcp.json`의 project 항목이 쓰이며, local 항목은 지우거나 이름을 바꿀 때까지 무시된다
- **③** 이 개발자에게는 두 항목이 합쳐지며, local 항목에 설정된 필드만 project 항목의 필드를 덮어쓴다
- **④** 이 개발자에게는 어느 항목도 쓰이지 않으며, 두 서버 중 하나의 이름을 바꿀 때까지 Claude Code가 이름 중복 충돌을 보고한다

> **핵심:** 이름 충돌은 병합이 아니라 **하나의 정의 전체를 고르는 것**으로 풀리며, local 스코프가 project보다 우선합니다.

1. **정답** - local 스코프는 project보다 순위가 높으므로, 이름이 겹치면 Claude Code는 local 항목을 통째로 씁니다. project 항목의 필드는 하나도 섞이지 않습니다. 이 오버라이드가 없는 다른 팀원들은 계속 project 정의를 받습니다.
2. **오답** - 버전 관리로 공유된다고 해서 `.mcp.json`이 더 높은 순위를 갖지는 않습니다. local이 project보다 우선하므로 이 개발자에게는 local 항목이 이기고, 밀려나는 쪽은 project 항목입니다.
3. **오답** - 같은 이름의 항목은 필드 단위로 합쳐지지 않습니다. 한 출처가 이기고 그 정의 전체가 쓰이므로, local의 필드가 project의 필드와 섞이는 일은 없습니다.
4. **오답** - 스코프 사이의 같은 이름은 오류가 아닙니다. 우선순위가 정리하므로 한 정의가 로드되어 연결됩니다. 엔드포인트가 다르면 `claude mcp list`와 `/mcp`에 경고가 뜰 뿐, 건너뛰거나 이름을 바꿔야 하는 것은 아닙니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

> "The entire server entry from that source is used; fields are not merged across scopes."

---

## 문제 24
### **An internal MCP server requires a Kerberos-derived token that must be freshly minted for every connection, and no OAuth authorization server is involved. According to Anthropic documentation, which approach is recommended for handling this authentication scheme in Claude Code?**

| 보기 | 설명 |
|------|------|
| **1. Configure `headersHelper` to run a script that generates the token and writes the resulting header JSON to stdout on each connection.** | |
| 2. Configure the `oauth` block with `authServerMetadataUrl` pointed at the internal Kerberos realm so Claude Code discovers the flow automatically. | |
| 3. Configure a static `headers` entry with the token value hardcoded, then rotate the config file manually whenever the token expires. | |
| 4. Do not attempt to configure Kerberos directly in Claude Code MCP authentication; use an intermediary service that authenticates via Kerberos and then uses Anthropic-supported credentials such as API keys or OAuth tokens. | |

**정답: 1.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — Configuring MCP servers in Claude Code: scopes, secrets and authentication

**📝 문제 번역**

사내 MCP 서버가 연결마다 새로 발급해야 하는 Kerberos 기반 토큰을 요구하고, OAuth 인가 서버는 관여하지 않습니다. Anthropic 문서에 따르면 Claude Code에서 이 인증 방식을 다루는 권장 방법은 무엇입니까?

- **①** 토큰을 생성하고 결과 헤더 JSON을 연결마다 stdout에 쓰는 스크립트를 `headersHelper`로 설정한다
- **②** `oauth` 블록의 `authServerMetadataUrl`을 사내 Kerberos 영역(realm)으로 지정해 Claude Code가 흐름을 자동으로 찾게 한다
- **③** 토큰 값을 하드코딩한 정적 `headers` 항목을 설정하고, 토큰이 만료될 때마다 설정 파일을 수동으로 교체한다
- **④** Claude Code의 MCP 인증에 Kerberos를 직접 설정하려 하지 말고, Kerberos로 인증한 뒤 API 키나 OAuth 토큰 같은 Anthropic 지원 자격 증명을 쓰는 중간 서비스를 둔다

> **핵심:** OAuth가 아닌 맞춤 인증(Kerberos, 수명이 짧은 토큰, 사내 SSO)은 연결 시점에 헤더를 만들어 내는 `headersHelper`로 처리합니다.

1. **정답** - Claude Code MCP 문서의 dynamic headers 절은 Kerberos·단기 토큰·사내 SSO처럼 연결 시점에 헤더가 필요할 때 `headersHelper`에 명령을 지정하라고 합니다. 명령은 문자열 키·값 쌍의 JSON 객체를 stdout에 써야 하고, Claude Code는 연결할 때마다 새로 실행하며 결과를 캐시하지 않으므로 연결마다 새 토큰이 필요한 요구에 정확히 맞습니다.
2. **오답** - `oauth` 블록의 `authServerMetadataUrl`은 OAuth 인가 서버의 메타데이터 문서를 가리키는 값입니다. Kerberos 영역은 그런 메타데이터를 게시하지 않고, 시나리오도 OAuth 인가 서버가 없다고 했으므로 찾아낼 것이 없습니다.
3. **오답** - 하드코딩한 정적 헤더는 연결마다 새로 발급해야 한다는 요구를 충족할 수 없습니다. 수동 교체는 이미 만료된 뒤에야 값을 바꿉니다. 또한 같은 이름이면 동적 헤더가 정적 헤더를 덮어쓰고, 거절된 정적 `Authorization` 헤더는 연결 실패로 보고됩니다.
4. **오답** - 이 보기는 사내 MCP 서버 인증과 Anthropic API 인증을 혼동합니다. Anthropic API 키나 OAuth 토큰은 Anthropic 서비스용 자격 증명이라 사내 서버의 Kerberos 요구를 충족하지 못합니다. 문서는 Kerberos를 헤더 생성 명령으로 처리하는 경우로 명시하므로 중간 서비스가 필요 없습니다.

📚 근거: [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

> "When authentication such as Kerberos, short-lived tokens, or internal SSO needs headers generated at connection time, set the server's `headersHelper` to a command."

---

## 문제 25
### **A team's MCP server exposes `find_code`, described only as "Searches code." Claude keeps reaching for Grep instead. Which change most directly fixes this?**

| 보기 | 설명 |
|------|------|
| **1. Rewrite the description to say what it returns, when to prefer it over Grep, and what each parameter means** | |
| 2. Rename the tool to `grep_replacement` so the name signals its purpose | |
| 3. Move the server from project scope to user scope so it loads for the developer | |
| 4. Cut the description to a single word so it is easier to match | |

**정답: 1.**

**해설:**

> 📘 레슨 2.4 · MCP 서버 연동 — Configuring MCP servers in Claude Code: scopes, secrets and authentication

**📝 문제 번역**

한 팀의 MCP 서버가 "Searches code."(코드를 검색한다)라는 설명만 붙은 `find_code`를 노출합니다. Claude는 계속 Grep을 씁니다. 이를 가장 직접적으로 고치는 변경은 무엇입니까?

- **①** 설명을 다시 써서 무엇을 반환하는지, 언제 Grep 대신 이 도구를 써야 하는지, 각 파라미터가 무엇을 뜻하는지 적는다
- **②** 이름이 목적을 드러내도록 도구 이름을 `grep_replacement`로 바꾼다
- **③** 개발자에게 로드되도록 서버를 project 스코프에서 user 스코프로 옮긴다
- **④** 매칭이 쉬워지도록 설명을 한 단어로 줄인다

> **핵심:** MCP 도구도 설명을 근거로 선택됩니다. 한 줄 설명으로는 에이전트가 이미 익숙한 내장 도구를 떠날 이유가 없습니다.

1. **정답** - 설명에 반환 형태, 내장 Grep 대신 이 도구를 써야 하는 경우(그리고 Grep이 나은 경우), 파라미터의 의미, 한계를 적으면 에이전트가 MCP 도구를 고를 때 무엇을 얻는지 알게 됩니다. Define tools 문서는 도구에 관해 맥락을 많이 줄수록 Claude가 언제, 어떻게 쓸지 더 잘 판단한다고 합니다.
2. **오답** - 이름은 보조 신호일 뿐이고 `grep_replacement`라는 이름도 무엇을 반환하고 언제 써야 하는지는 말해 주지 않습니다. 짧은 설명이 남긴 열린 질문은 그대로입니다.
3. **오답** - 스코프는 **누가** 서버를 받는지를 정할 뿐, 도구가 얼마나 잘 이해되는지와는 무관합니다. Claude가 이미 도구를 보고도 Grep을 고르고 있다는 것이 문제입니다.
4. **오답** - 설명을 더 줄이면 판단 재료가 더 사라집니다. 문서는 도구당 최소 3~4문장의 자세한 설명을 권합니다.

📚 근거: [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

> "The more context you can give Claude about your tools, the better it will be at determining when and how to use them."

---

## 문제 26
### **Your React project has a fixed convention: every component `Foo.tsx` is tested by a file named `Foo.test.tsx`. You want an agent to list the components that have no test file, and to do it reliably and cheaply. Which approach should it take?**

| 보기 | 설명 |
|------|------|
| 1. Grep each component file for the word "test" and report the components with no match | |
| **2. Glob for the component files and Glob for the `*.test.tsx` files, then compare the two lists** | |
| 3. Run the test suite through Bash and treat any component missing from the output as untested | |
| 4. Read every component file into context and check each one for a reference to its test | |

**정답: 2.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Choosing Grep, Glob, Read, Write, Edit and Bash in Claude Code

**📝 문제 번역**

React 프로젝트에 고정된 규칙이 있습니다. 모든 컴포넌트 `Foo.tsx`는 `Foo.test.tsx`라는 파일로 테스트됩니다. 테스트 파일이 없는 컴포넌트 목록을, 믿을 만하고 저렴하게 에이전트가 뽑게 하려고 합니다. 어떤 방법을 써야 합니까?

- **①** 각 컴포넌트 파일에서 "test"라는 단어를 Grep하고, 일치하지 않는 컴포넌트를 보고한다
- **②** 컴포넌트 파일을 Glob하고 `*.test.tsx` 파일을 Glob한 뒤 두 목록을 비교한다
- **③** Bash로 테스트 스위트를 실행하고 출력에 없는 컴포넌트를 테스트되지 않은 것으로 본다
- **④** 모든 컴포넌트 파일을 컨텍스트에 Read하고 각 파일에 테스트에 대한 참조가 있는지 확인한다

> **핵심:** 이름 규칙이 있으면 "테스트가 있는가"는 **파일 경로**만으로 답할 수 있는 질문이므로, 파일을 열지 않는 Glob이 맞습니다.

1. **오답** - Grep은 파일 **내용**을 검색합니다. 컴포넌트 파일이 자기 테스트를 언급할 이유가 없으므로 신호가 엉뚱하고, 주석 속 "test" 같은 우연한 일치도 생깁니다.
2. **정답** - Glob은 파일을 열지 않고 경로만 패턴으로 맞추므로, 두 번의 Glob과 목록 비교만으로 답이 나옵니다. 구조에 관한 질문에 가장 저렴한 방법입니다.
3. **오답** - 테스트 스위트 실행은 코드를 돌려 동작을 측정하는 것이지 테스트 파일의 존재 여부를 확인하는 것이 아닙니다. 비용도 크고, 건너뛴 테스트 등 때문에 결과도 덜 믿을 만합니다.
4. **오답** - 모든 파일을 읽으면 컨텍스트를 크게 낭비하고, 소스 파일 안을 들여다봐도 별도 테스트 파일이 있는지는 확실히 알 수 없습니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

> "Glob | Finds files based on pattern matching."

---

## 문제 27
### **An architect asks Claude Code to count how many files in the `src/components` directory tree currently have no matching test file at all, as a first step in planning test coverage work. Assume that the project follows a consistent and reliable naming convention that pairs each component file with its corresponding test file (for example, `Button.tsx` is tested by `Button.test.tsx`). Which approach most directly answers this without unnecessary file reads?**

| 보기 | 설명 |
|------|------|
| **1. Use Glob to list component files and test files separately by their naming pattern, then compare the two path lists for gaps** | |
| 2. Use Bash to run the full test suite and count how many components report zero assertions executed against them | |
| 3. Use Read to open every file under src/components and manually inspect each one for an associated describe block before counting | |
| 4. Use Grep to search each component file's own contents for the word test, and count the files where that word never appears | |

**정답: 1.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Choosing Grep, Glob, Read, Write, Edit and Bash in Claude Code

**📝 문제 번역**

설계자가 테스트 커버리지 작업 계획의 첫 단계로, `src/components` 디렉터리 트리에서 대응하는 테스트 파일이 전혀 없는 파일이 몇 개인지 Claude Code에게 세어 달라고 합니다. 이 프로젝트는 각 컴포넌트 파일과 그 테스트 파일을 짝짓는 일관되고 믿을 만한 이름 규칙을 따른다고 가정합니다(예: `Button.tsx`는 `Button.test.tsx`로 테스트). 불필요한 파일 읽기 없이 가장 직접적으로 답하는 방법은 무엇입니까?

- **①** Glob으로 이름 패턴에 따라 컴포넌트 파일과 테스트 파일을 따로 나열한 뒤, 두 경로 목록을 비교해 빈틈을 찾는다
- **②** Bash로 전체 테스트 스위트를 실행하고, 실행된 단언(assertion)이 0개라고 보고되는 컴포넌트 수를 센다
- **③** Read로 `src/components` 아래 모든 파일을 열어, 세기 전에 연결된 describe 블록이 있는지 하나씩 살펴본다
- **④** Grep으로 각 컴포넌트 파일 내용에서 test라는 단어를 검색하고, 그 단어가 한 번도 나오지 않는 파일 수를 센다

> **핵심:** 일관된 이름 규칙이 있으면 테스트 파일의 존재 여부는 경로 비교로 정적으로 판단할 수 있고, 그 일은 Glob의 몫입니다.

1. **정답** - 이름 규칙이 확실하므로 파일 내용을 읽지 않고 경로 패턴만으로 맞출 수 있습니다. 예컨대 `src/components/**/*.tsx`(테스트 파일 제외)와 `src/components/**/*.test.tsx`를 따로 나열해 비교하면 테스트가 없는 컴포넌트가 바로 드러납니다. 이름 규칙을 믿을 수 없다면 커버리지 도구가 더 알맞습니다.
2. **오답** - 테스트 스위트 실행은 단언이나 커버리지 동작을 측정할 뿐, 짝이 되는 테스트 파일의 존재 여부를 알려 주지 않습니다. 건너뛰었거나 깨진 테스트 파일도 단언 0개로 보고될 수 있어 거짓 양성이 생기고, 정적 이름 비교보다 비싸고 간접적입니다.
3. **오답** - 모든 컴포넌트 파일을 읽는 것은 이 작업이 피하려는 불필요한 읽기 비용 그 자체이고, 수작업 확인은 실수하기 쉽습니다. `describe` 블록은 테스트 코드의 구현 세부일 뿐, 소스 파일 안을 봐서는 별도 테스트 파일이 있는지 확실히 알 수 없습니다.
4. **오답** - 컴포넌트 소스에서 "test" 문자열을 Grep하면 파일 내용을 읽으면서 엉뚱한 신호를 확인하게 됩니다. 주석이나 코드에 "test"가 있어도 테스트 파일이 없을 수 있고, 반대도 가능하므로 파일 이름의 짝을 직접 판단하지 못합니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference)

> "Glob | Finds files based on pattern matching."

---

## 문제 28
### **An agent must change one block in a generated file. The same block appears many times, and even with the neighbouring lines added, the text never occurs only once. Only that one block should change. Which approach updates the file reliably?**

| 보기 | 설명 |
|------|------|
| 1. Call Edit with replace_all: true so the call stops failing on the duplicate matches | |
| 2. Grep for the block first, then repeat the same Edit so it can use the search results to pick the right match | |
| **3. Read the whole file, make the change in the full contents, then Write the complete modified file back** | |
| 4. Call Write with just the corrected block so that only that part of the file is replaced | |

**정답: 3.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Choosing Grep, Glob, Read, Write, Edit and Bash in Claude Code

**📝 문제 번역**

에이전트가 생성된(generated) 파일에서 블록 하나를 바꿔야 합니다. 같은 블록이 여러 번 나오고, 앞뒤 줄을 덧붙여도 그 텍스트는 한 번만 나오는 경우가 없습니다. 그 블록 하나만 바꿔야 합니다. 파일을 믿을 만하게 갱신하는 방법은 무엇입니까?

- **①** 중복 일치 때문에 호출이 실패하지 않도록 `replace_all: true`로 Edit를 호출한다
- **②** 먼저 블록을 Grep한 뒤, 같은 Edit를 다시 실행해 검색 결과로 올바른 일치를 고르게 한다
- **③** 파일 전체를 Read하고, 전체 내용에서 변경을 만든 뒤, 수정된 파일 전체를 Write로 다시 쓴다
- **④** 그 부분만 교체되도록 고친 블록만 담아 Write를 호출한다

> **핵심:** 고유한 앵커를 만들 수 없을 때의 대안은 **Read + Write**이며, Write는 파일 전체를 덮어쓰므로 반드시 수정된 전체 내용을 받아야 합니다.

1. **오답** - `replace_all: true`는 모든 일치를 바꿉니다. 호출은 성공하겠지만 바꾸면 안 되는 나머지 블록까지 모두 바뀝니다.
2. **오답** - Edit는 `old_string` 텍스트만으로 일치를 찾고 검색 결과를 참고하지 않습니다. 같은 문자열은 여전히 여러 번 일치하므로 다시 실행해도 똑같이 실패합니다.
3. **정답** - Read로 현재 내용을 모두 확보한 뒤 원하는 블록 하나만 바꾼 전체 내용을 Write하면, 앵커가 고유하지 않아도 의도한 곳만 바뀝니다. 도구 문서상 기존 파일을 덮어쓰기 전에 읽어야 하는 규칙(모델과 조건에 따라 다름)과도 맞는 순서입니다.
4. **오답** - Write는 파일을 만들거나 통째로 덮어쓰는 도구라 부분만 교체하는 기능이 없습니다. 고친 블록만 넘기면 파일에는 그 블록만 남고 나머지 내용은 모두 사라집니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference)

> "Creates or overwrites files."

---

## 문제 29
### **A developer wants Claude Code to update a deprecated log statement `logger.warn("legacy-path")` that appears twice in the same file, in two different functions, where only one of the two occurrences should change. Claude issues an Edit call with old_string set to exactly that log statement and the call fails. What is the correct next step?**

| 보기 | 설명 |
|------|------|
| 1. Call Write with the updated log line and the file path, which replaces just that line in the function that needs the change | |
| **2. Extend old_string with the neighbouring lines from the target function, then retry Edit, which finds a single match in the file** | |
| 3. Set replace_all to true on the Edit call, which applies the replacement to the first match in the file and leaves the later one alone | |
| 4. Run Grep with the multiline flag to locate both matches, then retry Edit unchanged, which uses the Grep results to pick the target | |

**정답: 2.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Choosing Grep, Glob, Read, Write, Edit and Bash in Claude Code

**📝 문제 번역**

개발자가 폐기된 로그 문 `logger.warn("legacy-path")`를 Claude Code로 고치려 합니다. 이 문장은 같은 파일의 서로 다른 두 함수에 한 번씩 나오고, 그중 하나만 바꿔야 합니다. Claude가 `old_string`을 정확히 그 로그 문으로 지정해 Edit를 호출했더니 실패했습니다. 올바른 다음 단계는 무엇입니까?

- **①** 갱신한 로그 줄과 파일 경로로 Write를 호출한다. 그러면 변경이 필요한 함수의 그 줄만 바뀐다
- **②** 대상 함수의 이웃 줄을 `old_string`에 덧붙여 다시 Edit한다. 그러면 파일에서 한 곳만 일치한다
- **③** Edit 호출에 `replace_all`을 true로 준다. 그러면 파일의 첫 번째 일치만 바뀌고 뒤의 것은 그대로 남는다
- **④** multiline 플래그로 Grep해 두 일치를 찾은 뒤 Edit를 그대로 다시 실행한다. 그러면 Edit가 Grep 결과로 대상을 고른다

> **핵심:** Edit는 `old_string`이 파일에 **정확히 한 번** 나올 때만 적용되므로, 일치가 여러 개면 앞뒤 문맥을 더해 앵커를 고유하게 만드는 것이 첫 번째 복구입니다.

1. **오답** - Write는 주어진 내용으로 파일 전체를 바꾸며 한 줄만 겨냥하는 기능이 없습니다. 로그 한 줄만 넘기면 올바른 함수를 고치는 대신 파일의 나머지가 모두 사라집니다.
2. **정답** - 대상 함수에만 있는 이웃 줄(함수 시그니처나 근처의 특징적인 문장)을 덧붙이면 문자열이 고유해져 다시 시도한 Edit가 성공하고, 다른 함수는 건드리지 않습니다. 도구 문서가 설명하는 방식과 같습니다.
3. **오답** - `replace_all`은 첫 번째만이 아니라 `old_string`의 모든 일치를 다시 씁니다. 개발자가 남기려던 쪽까지 두 로그 문이 모두 바뀝니다.
4. **오답** - Grep은 읽기 전용 검색이고 그 결과는 Edit에 영향을 주지 않습니다. Edit는 `old_string` 텍스트로만 일치를 찾으므로 같은 문자열은 여전히 두 번 일치해 똑같이 실패합니다.

📚 근거: [Tools reference](https://code.claude.com/docs/en/tools-reference)

> "Claude either supplies a longer string with enough surrounding context to pin down one occurrence, or sets replace_all: true to replace them all."

---

## 문제 30
### **In a repository Claude has never seen, you need to trace a login request from its HTTP route handler down to the database query. Which exploration strategy gives the most useful context for the lowest cost?**

| 보기 | 설명 |
|------|------|
| 1. Read every file under src/ first, so nothing on the login path can be missed | |
| 2. Sort the files by size and Read the largest first, since core logic usually lives there | |
| **3. Read CLAUDE.md, Grep for the /login route to find the handler, then Read along its imports until reaching the query** | |
| 4. Glob for the most recently modified files and Read those, since recent changes usually touch the active flow | |

**정답: 3.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Choosing Grep, Glob, Read, Write, Edit and Bash in Claude Code

**📝 문제 번역**

Claude가 처음 보는 저장소에서, 로그인 요청을 HTTP 라우트 핸들러부터 데이터베이스 쿼리까지 추적해야 합니다. 가장 낮은 비용으로 가장 유용한 컨텍스트를 주는 탐색 전략은 무엇입니까?

- **①** 로그인 경로에서 놓치는 것이 없도록 `src/` 아래 모든 파일을 먼저 Read한다
- **②** 핵심 로직은 보통 큰 파일에 있으니 파일을 크기순으로 정렬해 가장 큰 것부터 Read한다
- **③** CLAUDE.md를 읽고, `/login` 라우트를 Grep해 핸들러를 찾은 뒤, 쿼리에 닿을 때까지 import를 따라가며 Read한다
- **④** 최근 변경이 보통 활성 흐름에 닿으니 가장 최근에 수정된 파일을 Glob해 Read한다

> **핵심:** 먼저 검색하고 호출 사슬을 따라 읽으면 경로 위의 파일만 컨텍스트에 실려, 질문에 답하는 **가장 작은 고신호 컨텍스트**가 됩니다.

1. **오답** - 모든 파일을 먼저 읽으면 질문과 무관한 코드로 컨텍스트가 차고, 중요한 몇 개 파일이 그 속에 묻힙니다. 낯선 코드베이스를 익히는 가장 비싼 방법입니다.
2. **오답** - 파일 크기는 로그인 흐름이 어디 있는지와 관계가 없습니다. 크기로 파일을 고르는 것은 운에 맡기는 선택입니다.
3. **정답** - CLAUDE.md(저장소에 따라 AGENTS.md)로 팀이 적어 둔 구조와 규칙을 먼저 파악하고, Grep으로 진입점 하나를 찾은 뒤, 그 파일의 import와 호출을 따라 서비스·데이터 계층으로 내려갑니다. 각 단계가 앞 단계의 결과로 정해져 경로 위의 파일만 읽게 됩니다.
4. **오답** - 수정 시각도 로그인 흐름과의 관련성을 보장하지 않습니다. 최근에 바뀐 파일은 다른 기능의 것일 수 있어, 이 역시 운에 맡기는 선택입니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

> "good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome"

---

## 문제 31
### **A newly onboarded architect asks Claude Code to trace how a login request flows from the HTTP route handler through to the database call, in a codebase Claude has not explored yet. To build this understanding efficiently while keeping context usage low, what is the best incremental strategy?**

| 보기 | 설명 |
|------|------|
| **1. Start by reading CLAUDE.md or AGENTS.md if they exist to gain high-level architecture context, then use Grep to locate the route handler and its imports, and read files incrementally along the call chain.** | |
| 2. Use Read to open every file under the src directory up front, building a complete mental model of the whole codebase before looking for the login flow specifically. | |
| 3. Use Bash to run a full-text word count across the repository and read the files with the highest counts, on the assumption larger files hold core business logic. | |
| 4. Use Glob to list every file in the repository sorted by modification time, then read the twenty most recently modified files on the assumption they relate to login. | |

**정답: 1.**

**해설:**

> 📘 레슨 2.5 · 내장 도구 선택 — Choosing Grep, Glob, Read, Write, Edit and Bash in Claude Code

**📝 문제 번역**

새로 합류한 설계자가, Claude가 아직 탐색하지 않은 코드베이스에서 로그인 요청이 HTTP 라우트 핸들러부터 데이터베이스 호출까지 어떻게 흐르는지 추적해 달라고 Claude Code에 요청합니다. 컨텍스트 사용을 낮게 유지하면서 효율적으로 이해를 쌓는 가장 좋은 점진적 전략은 무엇입니까?

- **①** CLAUDE.md나 AGENTS.md가 있으면 먼저 읽어 상위 구조를 파악하고, Grep으로 라우트 핸들러와 그 import를 찾은 뒤, 호출 사슬을 따라 파일을 점진적으로 읽는다
- **②** Read로 src 디렉터리 아래 모든 파일을 미리 열어, 로그인 흐름을 찾기 전에 코드베이스 전체의 정신 모델을 만든다
- **③** Bash로 저장소 전체의 단어 수를 세고, 큰 파일이 핵심 비즈니스 로직을 담는다는 가정 아래 수가 가장 많은 파일을 읽는다
- **④** Glob으로 저장소의 모든 파일을 수정 시각순으로 나열하고, 로그인과 관련 있으리라는 가정 아래 최근 수정된 20개 파일을 읽는다

> **핵심:** 프로젝트 지침 → 진입점 검색 → import를 따라 읽기의 순서로, 질문에 필요한 파일만 그때그때 불러오는 것이 컨텍스트를 아끼는 탐색입니다.

1. **정답** - CLAUDE.md(또는 저장소에 있는 AGENTS.md)는 Claude Code가 세션 시작 시 읽는 프로젝트 컨텍스트 파일로, 상위 구조를 먼저 알려 줍니다. 그다음 Grep으로 라우트 핸들러를 정확히 찾고 관련 파일만 차례로 읽으면 컨텍스트 사용이 낮게 유지되고 특정 호출 사슬에 집중할 수 있습니다.
2. **오답** - 모든 파일을 미리 읽으면 극도로 비효율적이고 컨텍스트 윈도를 낭비합니다. 목표는 특정 흐름 하나를 추적하는 것이지 코드베이스 전체를 한꺼번에 이해하는 것이 아닙니다.
3. **오답** - 파일 크기는 로그인 로직의 위치를 믿을 만하게 알려 주지 않습니다. 설정 파일, 테스트 픽스처, 생성된 코드처럼 무관한 큰 파일이 대거 섞여 컨텍스트만 낭비합니다.
4. **오답** - 최근 수정되었다고 로그인 흐름과 관련 있다는 보장은 없습니다. 다른 기능이 최근에 바뀌었을 수 있고, 프로젝트 구조와 호출 사슬을 무시하므로 실제 로그인 관련 파일을 놓치기 쉽습니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Common workflows](https://code.claude.com/docs/en/common-workflows) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

---
