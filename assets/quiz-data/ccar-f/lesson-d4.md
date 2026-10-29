<!-- 출처: https://www.certsafari.com/anthropic/claude-certified-architect-foundations/learn — CCAR-F 레슨 도메인 4(레슨 4.1~4.6)의 Exam question·Check yourself 객관식 문항. 문제·보기·정답은 원문 그대로 옮기고 보기 기호만 A–D → 1–4로 바꿨다. 해설은 원문 해설과 공식 문서를 바탕으로 한글로 작성. -->

## 문제 1
### **A team's single-pass code reviewer flags too many non-issues, and they want it to filter its own findings. Which line should they add to the review prompt?**

| 보기 | 설명 |
|------|------|
| 1. "Be conservative and don't nitpick; only raise issues that really matter." | |
| 2. "Only report findings you are highly confident are real problems." | |
| **3. "Report any bugs that could cause incorrect behavior, a test failure, or a misleading result; only omit nits like pure style or naming preferences."** | |
| 4. "Only report important issues, and skip anything that seems minor." | |

**정답: 3.**

**해설:**

> 📘 레슨 4.1 · 명시적 기준 — Explicit review criteria that cut false positives

**📝 문제 번역**

한 팀의 단일 패스 코드 리뷰어가 문제가 아닌 것을 너무 많이 지적합니다. 팀은 리뷰어가 자기 발견을 스스로 거르게 하고 싶습니다. 리뷰 프롬프트에 어떤 문장을 넣어야 할까요?

- **①** "보수적으로 판단하고 트집 잡지 마라. 정말 중요한 문제만 제기하라."
- **②** "실제 문제라고 높은 확신이 드는 발견만 보고하라."
- **③** "잘못된 동작, 테스트 실패, 오해를 부르는 결과를 일으킬 수 있는 버그는 모두 보고하라. 순수한 스타일이나 명명 취향 같은 사소한 지적만 생략하라."
- **④** "중요한 문제만 보고하고, 사소해 보이는 것은 건너뛰어라."

> **핵심:** 단일 패스에서 스스로 거르게 하려면 "중요한", "확신" 같은 질적 표현 대신 **보고할 결과와 생략할 범주를 구체적으로** 적어야 합니다.

1. **오답** - "보수적으로", "트집 잡지 마라"는 태도를 지시할 뿐, 무엇이 문제인지에 대한 모델의 정의는 바꾸지 않습니다. 모델은 같은 판단으로 같은 오탐을 내고, 오히려 진짜 버그 중 덜 심각해 보이는 것을 보고하지 않을 수 있습니다.
2. **오답** - 오탐은 대개 모델이 확신이 없어서가 아니라 확신을 갖고 잘못된 범주를 문제로 보기 때문에 생깁니다. 확신 문턱만 올리면 같은 오탐이 그대로 통과하고 재현율만 떨어질 수 있습니다.
3. **정답** - Opus 4.8 프롬프팅 가이드가 단일 패스 자기 필터링에 권하는 문장 그대로입니다. 보고 대상이 되는 결과(잘못된 동작·테스트 실패·오해를 부르는 결과)와 빼도 되는 범주(순수 스타일·명명 취향)를 명시하므로, 모델이 어디에 선을 그어야 하는지 알 수 있습니다.
4. **오답** - "중요한", "사소해 보이는" 역시 질적 표현이라 기준선이 어디인지 알려 주지 않습니다. 문서는 바로 이런 표현 대신 기준선을 구체적으로 쓰라고 권합니다.

📚 근거: [Prompting Claude Opus 4.8](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "be concrete about where the bar is rather than using qualitative terms like "important""

---

## 문제 2
### **A prompt engineer tries to fix a noisy security-findings category by adding the line "only report high-confidence findings" to the system prompt. After a week of testing, the false positive rate is essentially unchanged. What is the most likely explanation for why this change failed to improve precision?**

| 보기 | 설명 |
|------|------|
| 1. Adding any qualifier to a system prompt increases output length, which expands the set of tokens the evaluator inspects and independently raises the chance that a finding is miscategorized as high severity. | |
| 2. High-confidence phrasing conflicts with the model's safety training, which is designed to avoid under-reporting risks, causing it to over-report findings as a precautionary default across a wider range of inputs. | |
| **3. General confidence language gives the model no concrete rule for what to report, so it still applies the same underlying judgment that produced the false positives before the change.** | |
| 4. The word "confidence" is not in the set of tokens the model is trained to parse for output constraints, so the instruction is treated as decorative text and ignored, leaving the original behavior unchanged. | |

**정답: 3.**

**해설:**

> 📘 레슨 4.1 · 명시적 기준 — Explicit review criteria that cut false positives

**📝 문제 번역**

프롬프트 엔지니어가 오탐이 많은 보안 발견 범주를 고치려고 시스템 프롬프트에 "only report high-confidence findings(확신이 높은 발견만 보고하라)"를 추가했습니다. 일주일 테스트 후에도 오탐률은 거의 그대로입니다. 이 변경이 정밀도를 높이지 못한 가장 그럴듯한 이유는?

- **①** 시스템 프롬프트에 수식어를 넣으면 출력이 길어지고, 평가자가 검사할 토큰이 늘어나 발견이 높은 심각도로 잘못 분류될 가능성이 독립적으로 커진다.
- **②** "높은 확신" 표현이 위험을 과소 보고하지 않도록 설계된 모델의 안전 학습과 충돌해, 모델이 예방 차원에서 더 넓은 입력에 대해 과다 보고한다.
- **③** 일반적인 확신 표현은 무엇을 보고할지에 대한 구체적 규칙을 주지 않으므로, 모델은 변경 전에 오탐을 만들던 같은 판단을 계속 적용한다.
- **④** "confidence"라는 단어는 모델이 출력 제약으로 해석하도록 학습된 토큰 집합에 없어서, 지시가 장식 문구로 취급되어 무시된다.

> **핵심:** 확신·신중함을 요구하는 말은 문턱만 옮길 뿐 **"무엇이 문제인가"의 정의를 바꾸지 않으므로** 오탐 범주가 그대로 살아남습니다.

1. **오답** - 오탐률이 그대로인 원인은 출력 길이나 토큰 수가 아닙니다. 수식어가 정밀도를 못 올린 이유는 구체적 기준이 없기 때문이지 출력이 길어져서가 아닙니다.
2. **오답** - 지시와 무관하게 과다 보고를 강제하는 안전 학습 충돌은 없습니다. 오히려 최신 모델은 이런 지시를 충실히 따라 보고량을 줄이는 쪽으로 반응합니다. 오탐이 남은 이유는 지시의 모호함입니다.
3. **정답** - 모호한 확신 표현은 진짜 발견과 오탐을 구분할 확인 가능한 규칙을 주지 않으므로, 모델은 같은 판단을 계속 적용합니다. 정밀도는 주관적 확신 문턱을 명시적인 범주 기준으로 바꿀 때 올라갑니다.
4. **오답** - 모델이 'confidence'라는 단어를 무시하는 것이 아닙니다. 문장은 정상적으로 처리되지만, 행동을 바꿀 구체적 제약을 담고 있지 않아서 효과가 없을 뿐입니다.

📚 근거: [Prompting Claude Opus 4.8](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "it may investigate the code just as thoroughly, identify the bugs, and then not report findings it judges to be below your stated bar."

---

## 문제 3
### **A reviewer flags a docstring that says "returns the cached value if present, otherwise fetches from the API," but the function under review always calls the API regardless of a cache. Under an explicit-criteria rule that only flags comments contradicted by actual code behavior, should this finding be reported?**

| 보기 | 설명 |
|------|------|
| **1. Report it, since the docstring promises a cache lookup before the API call and the function body goes straight to the API on each invocation.** | |
| 2. Skip it, since the code still returns correct data and the slower, uncached path is a performance matter for a separate review, not a comment fault. | |
| 3. Skip it, since caching is an internal detail rather than part of the function's contract, so the docstring's mention of it falls outside the criterion. | |
| 4. Report it only after confirming a caller depends on the cached behavior, since a stale docstring that nobody relies on does not affect behavior. | |

**정답: 1.**

**해설:**

> 📘 레슨 4.1 · 명시적 기준 — Explicit review criteria that cut false positives

**📝 문제 번역**

리뷰어가 "캐시에 값이 있으면 그 값을 반환하고, 없으면 API에서 가져온다"는 docstring을 지적했습니다. 그런데 리뷰 대상 함수는 캐시와 상관없이 항상 API를 호출합니다. "실제 코드 동작과 모순되는 주석만 지적한다"는 명시적 기준 아래에서 이 발견을 보고해야 할까요?

- **①** 보고한다. docstring은 API 호출 전에 캐시를 조회한다고 약속하는데, 함수 본문은 호출될 때마다 곧장 API로 간다.
- **②** 건너뛴다. 코드는 여전히 올바른 데이터를 반환하고, 캐시 없는 느린 경로는 별도의 성능 리뷰 대상이지 주석 결함이 아니다.
- **③** 건너뛴다. 캐싱은 함수 계약이 아닌 내부 구현 세부이므로 docstring의 캐시 언급은 기준 밖이다.
- **④** 호출자가 캐시 동작에 의존한다는 것을 확인한 뒤에만 보고한다. 아무도 의존하지 않는 낡은 docstring은 동작에 영향을 주지 않는다.

> **핵심:** 명시적 기준은 질문을 하나로 좁힙니다. **"주석이 주장하는 동작이 실제 동작과 모순되는가?"** 모순되면 다른 사정과 무관하게 보고 대상입니다.

1. **정답** - docstring은 "캐시 조회 후 API 호출"이라는 구체적이고 확인 가능한 동작을 주장하는데, 함수는 캐시를 전혀 보지 않습니다. 실제 동작과 모순되는 주석은 이 기준이 지적하라고 정한 바로 그 경우입니다.
2. **오답** - 반환 데이터가 여전히 맞는지, 캐시 없는 경로가 단지 느린지는 이 기준과 관계가 없습니다. 기준은 주석의 주장이 코드와 모순되는지만 묻고, 별도 성능 리뷰가 있다고 모순이 사라지지 않습니다.
3. **오답** - 기준은 내부 메커니즘에 대한 주석을 제외하지 않습니다. 이 docstring은 캐싱을 함수가 하는 일로 명시하므로, 그 주장은 코드와 대조해 확인할 수 있고 틀렸습니다.
4. **오답** - 기준은 호출자가 그 주장에 의존한다는 증거를 요구하지 않습니다. docstring은 쓰인 그대로 틀렸으므로 호출자를 추적하지 않아도 보고 대상입니다.

📚 근거: [Prompting Claude Opus 4.8](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8) · [Prompting Claude Sonnet 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5)

---

## 문제 4
### **In a legacy module, most functions use mixed old naming styles. A PR adds one helper named according to the project's documented convention in CLAUDE.md. How should well-written review criteria treat that helper's name?**

| 보기 | 설명 |
|------|------|
| 1. Flag it, because new code should match the style most common in the surrounding file | |
| **2. Don't flag it, because names are judged against the documented project standard and not against nearby code** | |
| 3. Flag every legacy function in the file as an Important finding, because they are the real inconsistency | |
| 4. Turn off naming checks completely, because naming always generates false positives | |

**정답: 2.**

**해설:**

> 📘 레슨 4.1 · 명시적 기준 — Explicit review criteria that cut false positives

**📝 문제 번역**

레거시 모듈의 함수 대부분은 여러 가지 옛 명명 스타일이 섞여 있습니다. 한 PR이 CLAUDE.md에 문서화된 프로젝트 규칙대로 이름 붙인 헬퍼 하나를 추가했습니다. 잘 작성된 리뷰 기준이라면 이 헬퍼의 이름을 어떻게 다뤄야 할까요?

- **①** 지적한다. 새 코드는 주변 파일에서 가장 흔한 스타일에 맞춰야 한다.
- **②** 지적하지 않는다. 이름은 주변 코드가 아니라 문서화된 프로젝트 표준에 비추어 판단한다.
- **③** 파일의 모든 레거시 함수를 Important 발견으로 지적한다. 그것들이 진짜 불일치다.
- **④** 명명 검사를 아예 끈다. 명명은 언제나 오탐을 만든다.

> **핵심:** 지역 관례는 그 자체가 레거시이거나 일관성이 없을 수 있으므로, 명명 기준의 기준선은 **주변 코드가 아니라 문서화된 표준(CLAUDE.md)** 이어야 합니다.

1. **오답** - 주변 코드에 맞추라는 기준은 표준을 지킨 유일한 함수를 지적하는 오탐을 만듭니다. 지역 관례는 오탐의 흔한 원인이라 별도의 건너뛰기 규칙이 필요합니다.
2. **정답** - 문서화된 표준을 기준선으로 삼으면 표준을 따른 헬퍼는 올바른 코드입니다. Code Review도 CLAUDE.md를 프로젝트 맥락으로 읽고 새로 생긴 위반을 지적하므로, 표준을 어긴 이름은 여전히 잡힙니다.
3. **오답** - 이 PR이 만들지 않은 기존 레거시 함수를 Important로 몰아 지적하면 리뷰 범위를 벗어난 소음이 됩니다. Code Review도 이 PR이 만들지 않은 기존 결함은 🟣 Pre-existing으로 따로 분류하고, 헬퍼 이름이 표준을 지켰다는 사실은 그대로입니다.
4. **오답** - 명명 검사를 끄면 표준을 실제로 어긴 이름까지 놓칩니다. 문제는 검사 자체가 아니라 잘못된 기준선이므로 기준선을 고치면 됩니다.

📚 근거: [Code Review](https://code.claude.com/docs/en/code-review) · [Customize Code Review](https://code.claude.com/docs/en/code-review-customize)

> "Code Review reads it as project context and flags newly introduced violations as nits."

---

## 문제 5
### **One review prompt holds security, correctness and style criteria, and each category has its own rules and severity examples. Security findings are now being judged against the style threshold. Which way of laying out the prompt best stops one category's rules from leaking into another?**

| 보기 | 설명 |
|------|------|
| 1. Write one prose paragraph per category and start each paragraph with the category's name | |
| 2. Combine all the rules into one list sorted by severity, so every Important item sits together | |
| 3. Put the rules first, then collect every category's examples in one shared examples block at the end | |
| **4. Put each category's rules and examples inside its own descriptively named XML tag, such as <security_criteria> and <style_criteria>** | |

**정답: 4.**

**해설:**

> 📘 레슨 4.1 · 명시적 기준 — Explicit review criteria that cut false positives

**📝 문제 번역**

하나의 리뷰 프롬프트에 보안·정확성·스타일 기준이 들어 있고, 범주마다 고유한 규칙과 심각도 예시가 있습니다. 그런데 보안 발견이 스타일 문턱으로 판단되고 있습니다. 한 범주의 규칙이 다른 범주로 새지 않게 하려면 프롬프트를 어떻게 배치하는 것이 가장 좋을까요?

- **①** 범주마다 산문 단락 하나씩 쓰고, 각 단락을 범주 이름으로 시작한다.
- **②** 모든 규칙을 심각도순으로 정렬한 목록 하나로 합쳐 Important 항목이 모두 함께 있게 한다.
- **③** 규칙을 먼저 쓰고, 모든 범주의 예시를 끝의 공용 예시 블록 하나에 모은다.
- **④** 각 범주의 규칙과 예시를 `<security_criteria>`, `<style_criteria>` 처럼 설명적인 이름의 XML 태그 안에 넣는다.

> **핵심:** 범주마다 **이름 붙은 XML 태그로 규칙과 예시를 함께 감싸면** 경계가 분명해져 한 범주의 문턱이 다른 범주로 새지 않습니다.

1. **오답** - 산문 단락은 시작과 끝이 명시적이지 않아, 범주가 어디서 끝나는지를 모델이 알아채야 합니다. 긴 프롬프트에서는 인접 범주의 규칙과 예시가 섞이기 쉽습니다.
2. **오답** - 심각도순 정렬은 세 범주의 규칙을 서로 끼워 넣어 각 범주를 프롬프트 전체에 흩어 놓습니다. 막으려는 혼합을 오히려 만듭니다.
3. **오답** - 공용 예시 블록은 각 예시를 그것이 설명하는 규칙에서 떼어 놓아, 보안 예시를 스타일 발견에 적용하는 식의 혼동을 부릅니다.
4. **정답** - 이름 붙은 태그는 범주의 규칙과 예시를 한 블록에 묶고 끝나는 지점을 분명히 표시합니다. 공식 문서도 지시·맥락·예시가 섞인 프롬프트에서 내용 유형별로 태그를 쓰면 오해가 줄어든다고 설명합니다.

📚 근거: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "Wrapping each type of content in its own tag (for example, <instructions>, <context>, <input>) reduces misinterpretation."

---

## 문제 6
### **An architect is structuring a long review prompt that defines separate criteria for security, correctness, and style categories, each with its own inclusion rules and severity examples. Which structuring approach best helps Claude apply the right criteria to the right category without cross-contamination?**

| 보기 | 설명 |
|------|------|
| 1. Write each category's criteria as its own prose paragraph, in the order security, correctness, style, and open each paragraph with a sentence naming the category it covers. | |
| 2. Merge the criteria into one bulleted list sorted by severity, with the category name in parentheses at the end of each bullet and the examples nested beneath it. | |
| 3. Gather the severity examples into one shared block at the end of the prompt, with each category's inclusion rules above it and the category named on each example. | |
| **4. Wrap each category's inclusion rules and severity examples in its own named XML tag, such as <security_criteria> and <correctness_criteria>, inside the review prompt.** | |

**정답: 4.**

**해설:**

> 📘 레슨 4.1 · 명시적 기준 — Explicit review criteria that cut false positives

**📝 문제 번역**

아키텍트가 보안·정확성·스타일 범주별로 별도 기준(각각 포함 규칙과 심각도 예시)을 정의한 긴 리뷰 프롬프트를 구성하고 있습니다. Claude가 범주끼리 섞이지 않고 올바른 기준을 올바른 범주에 적용하도록 돕는 구성 방식은?

- **①** 각 범주의 기준을 보안·정확성·스타일 순서의 산문 단락으로 쓰고, 단락마다 해당 범주를 밝히는 문장으로 시작한다.
- **②** 기준을 심각도순 글머리표 목록 하나로 합치고, 각 항목 끝 괄호에 범주 이름을 달고 예시는 그 아래에 둔다.
- **③** 심각도 예시를 프롬프트 끝의 공용 블록 하나에 모으고, 그 위에 범주별 포함 규칙을 두며 각 예시에 범주 이름을 표시한다.
- **④** 리뷰 프롬프트 안에서 각 범주의 포함 규칙과 심각도 예시를 `<security_criteria>`, `<correctness_criteria>` 같은 이름 붙은 XML 태그로 감싼다.

> **핵심:** 여러 지시 묶음이 섞인 프롬프트는 **범주별로 설명적인 XML 태그를 써서 규칙과 예시를 함께 묶는 것** 이 권장 구조입니다.

1. **오답** - 첫 문장은 긴 프롬프트에서 약한 표지입니다. 산문 단락에는 명시적인 시작과 끝이 없어 인접 범주의 규칙과 예시가 여전히 뒤섞일 수 있습니다. 구분된 섹션이 훨씬 확실하게 범주를 나눕니다.
2. **오답** - 심각도순 정렬은 세 범주의 규칙을 교차 배치하므로, 모델은 항목 끝 괄호의 라벨에 의존해 범주를 알아내야 합니다. 이것이 바로 아키텍트가 막으려는 혼합입니다.
3. **오답** - 각 범주의 심각도 예시는 그 범주의 포함 규칙과 짝을 이룹니다. 한 블록에 모으면 예시가 규칙에서 떨어져, 보안 예시를 스타일 발견에 적용하거나 그 반대가 일어나기 쉽습니다.
4. **정답** - 범주마다 설명적인 이름의 XML 태그를 주면 명시적 경계가 생기고, 규칙과 예시가 한곳에 머뭅니다. 여러 지시 묶음을 담는 프롬프트에 권장되는 구조입니다.

📚 근거: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs."

---

## 문제 7
### **After developers began dismissing all of a reviewer's comments, a team added its noisy performance-hints category to the skip list. Security and correctness comments are now trusted again, and the team has rewritten the performance criteria in explicit terms. What should decide when the category goes back on?**

| 보기 | 설명 |
|------|------|
| 1. Turn it back on right away, but add "only report high-confidence findings" to its criteria so it stays quiet | |
| 2. Leave it off for good, since it caused the noise and the other categories now work | |
| **3. Run the rewritten criteria against a set of real cases with known answers, and turn the category back on once recall or F1 shows it performs well** | |
| 4. Turn it back on when a trial run on a few PRs produces noticeably fewer comments than before | |

**정답: 3.**

**해설:**

> 📘 레슨 4.1 · 명시적 기준 — Explicit review criteria that cut false positives

**📝 문제 번역**

개발자들이 리뷰어의 모든 코멘트를 무시하기 시작하자, 팀은 오탐이 많은 "성능 힌트" 범주를 건너뛰기 목록에 넣었습니다. 이제 보안·정확성 코멘트는 다시 신뢰받고 있고, 팀은 성능 기준을 명시적인 문장으로 다시 썼습니다. 이 범주를 언제 다시 켤지는 무엇으로 정해야 할까요?

- **①** 바로 다시 켜되, 조용하도록 기준에 "only report high-confidence findings"를 추가한다.
- **②** 소음의 원인이었고 다른 범주는 이제 잘 동작하므로 영구히 꺼 둔다.
- **③** 다시 쓴 기준을 정답이 알려진 실제 사례 세트로 돌려 보고, 재현율이나 F1이 잘 나오면 다시 켠다.
- **④** 몇 개 PR에서 시험해 봤을 때 코멘트가 이전보다 눈에 띄게 줄면 다시 켠다.

> **핵심:** 범주를 끄는 것은 기준을 고치는 동안 신뢰를 지키는 **임시 조치** 이고, 재개는 **정답이 있는 평가 사례에서 재현율·F1로 검증한 뒤** 합니다.

1. **오답** - 확신 표현은 기준을 고치지 않고 문턱만 올립니다. 오탐 범주는 남고 진짜 성능 문제는 덜 보고될 수 있습니다.
2. **오답** - 영구히 끄는 것은 임시 조치를 해결책으로 착각하는 것입니다. 범주를 끈 목적은 기준을 다시 쓰는 동안 다른 범주의 신뢰를 지키는 것이지, 성능 문제가 중요하지 않다는 뜻이 아닙니다.
3. **정답** - 공식 가이드는 평가 세트나 테스트 사례로 재현율·F1 개선을 확인하며 프롬프트를 반복하라고 권합니다. 재현율은 실제 문제 중 보고된 비율이라, 진짜 발견을 버려서 조용해진 프롬프트를 걸러 냅니다.
4. **오답** - 코멘트 수가 줄었다는 것만으로는 수정이 효과가 있는지 알 수 없습니다. 진짜 문제까지 빠져서 조용해졌을 수도 있으므로, 정답이 있는 사례에 대한 측정이 필요합니다.

📚 근거: [Prompting Claude Opus 4.8](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8) · [Code Review](https://code.claude.com/docs/en/code-review)

> "Iterate on prompts against a subset of your evals or test cases to validate recall or F1 score gains."

---

## 문제 8
### **A team's code-review assistant prompt already spells out an exhaustive, itemized rubric for flagging issues, but reviewers still receive inconsistently formatted findings across runs: some list severity before location, others omit the suggested fix entirely. The team wants the most effective fix for this output-consistency problem. What should they do?**

| 보기 | 설명 |
|------|------|
| 1. Expand the rubric into a longer numbered checklist, naming each output field with its position and formatting rule | |
| **2. Add a few sample reviews to the prompt, each presenting the findings in one fixed field order and layout** | |
| 3. Set the temperature to zero in the API call, making token sampling more repeatable from one run to the next | |
| 4. Add a second model call that reformats the review findings into the required schema before reviewers see them | |

**정답: 2.**

**해설:**

> 📘 레슨 4.2 · 퓨샷 프롬프팅 — Few-shot prompting for consistent output and ambiguous cases

**📝 문제 번역**

한 팀의 코드 리뷰 어시스턴트 프롬프트에는 이미 이슈 지적용 루브릭이 항목별로 빠짐없이 적혀 있습니다. 그런데도 실행마다 지적 형식이 달라, 어떤 것은 위치보다 심각도를 먼저 쓰고 어떤 것은 수정 제안을 아예 빼먹습니다. 이 출력 일관성 문제를 가장 효과적으로 고치려면?

- **①** 루브릭을 더 긴 번호 체크리스트로 늘려, 각 출력 필드의 위치와 형식 규칙을 일일이 적는다.
- **②** 프롬프트에 샘플 리뷰 몇 개를 넣되, 각각 지적을 하나의 고정된 필드 순서와 레이아웃으로 보여 준다.
- **③** API 호출의 temperature를 0으로 설정해 실행 간 토큰 샘플링을 더 재현 가능하게 만든다.
- **④** 리뷰어가 보기 전에 지적을 필요한 스키마로 다시 포맷하는 두 번째 모델 호출을 추가한다.

> **핵심:** 자세한 지시가 이미 있는데도 형식이 흔들리면, **원하는 형식을 그대로 보여 주는 퓨샷 예시** 가 가장 신뢰할 만한 해법입니다.

1. **오답** - 이미 빠짐없는 루브릭이 있는데도 형식이 달라집니다. 구조를 글로 더 자세히 설명하면 모델은 여전히 산문에서 레이아웃을 추론해야 하므로 같은 불일치가 이어질 가능성이 큽니다.
2. **정답** - 모두 같은 필드 순서와 레이아웃을 쓰는 샘플 리뷰는 모델이 따라 할 정확한 구조를 보여 줍니다. 추가 설명보다 훨씬 확실하게 출력 형식을 고정하며, 자세한 지시만으로 형식이 흔들릴 때 쓰는 대표적인 처방입니다.
3. **오답** - temperature는 샘플링 무작위성에 영향을 주어 실행 간 변동을 줄일 수는 있지만, 어떤 필드 순서를 쓸지나 수정 제안이 필수라는 것을 알려 주지 않습니다. 형식이 여전히 모호하므로 순서가 달라지거나 수정 제안이 빠질 수 있습니다.
4. **오답** - 재포맷 단계는 받은 필드의 순서를 바꿀 수는 있어도, 첫 호출이 쓰지 않은 수정 제안을 만들어 내지는 못합니다. 지연과 비용만 늘고 첫 프롬프트의 모호함은 그대로 남습니다.

📚 근거: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Increase output consistency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency)

> "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure."

---

## 문제 9
### **An agent has a `search_docs` tool and a `search_code` tool. For requests like "where is the retry timeout set?" it picks a different tool from one session to the next. Which few-shot examples would fix this best?**

| 보기 | 설명 |
|------|------|
| **1. Two to four examples built around ambiguous requests like this one, each giving the chosen tool and the reason the other tool was the worse choice** | |
| 2. Several clear-cut examples, such as "open the API docs page" → `search_docs`, so the model sees each tool used correctly | |
| 3. One input-to-tool pair for every ambiguous question users have asked so far, with no explanation, so every known case is covered | |
| 4. One line in the instructions saying "always prefer `search_code`", with no examples, so the choice is always the same | |

**정답: 1.**

**해설:**

> 📘 레슨 4.2 · 퓨샷 프롬프팅 — Few-shot prompting for consistent output and ambiguous cases

**📝 문제 번역**

에이전트에 `search_docs` 도구와 `search_code` 도구가 있습니다. "재시도 타임아웃은 어디서 설정되나요?" 같은 요청에서 세션마다 다른 도구를 고릅니다. 어떤 퓨샷 예시가 이 문제를 가장 잘 고칠까요?

- **①** 이번 같은 모호한 요청을 중심으로 만든 예시 2~4개. 각 예시는 선택한 도구와 다른 도구가 더 나쁜 선택인 이유를 함께 보여 준다.
- **②** "API 문서 페이지를 열어 줘" → `search_docs` 같은 명확한 예시 여러 개. 모델이 각 도구의 올바른 사용을 보게 한다.
- **③** 지금까지 사용자가 물은 모든 모호한 질문마다 입력-도구 쌍 하나씩, 설명 없이. 알려진 사례를 모두 덮는다.
- **④** 예시 없이 지시문에 "항상 `search_code`를 우선하라"는 한 줄. 선택이 항상 같아진다.

> **핵심:** 모호한 경계 사례에서는 **정답만이 아니라 "왜 다른 그럴듯한 선택이 아닌가"를 담은 소수의 표적 예시** 가 판단을 일반화시킵니다.

1. **정답** - 두 도구 모두 그럴듯한 입력을 겨냥하고, 왜 한 도구가 이겼는지 설명합니다. 모델은 그 이유를 목록에 없는 요청에도 적용할 수 있습니다. 문서도 Claude가 설명으로부터 일반화할 수 있다고 말합니다.
2. **오답** - 명확한 사례는 이미 잘 처리되는 입력이라, 정작 흔들리는 모호한 경계를 다루지 않습니다.
3. **오답** - 이유 없는 입력-도구 쌍 목록은 매칭만 가르칩니다. 목록에 없는 비슷한 질문이 오면 다시 흔들리고, 모든 엣지 케이스를 나열하는 방식은 Anthropic이 권하지 않는 "laundry list"입니다.
4. **오답** - 일괄 규칙은 판단을 기본값으로 대체합니다. 문서가 정답 출처인 요청에서는 매번 틀린 도구를 고르게 됩니다.

📚 근거: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)

> "Claude is smart enough to generalize from the explanation."

---

## 문제 10
### **A team built a classification prompt with twenty exact input-output pairs, one for every edge case they had personally encountered in their historical data. The prompt performs well on those twenty inputs but degrades noticeably whenever a customer submits a new input that is similar to, but not identical to, one of the twenty. What change would best help the model generalize its judgment to these novel-but-similar inputs?**

| 보기 | 설명 |
|------|------|
| **1. Replace the twenty pairs with a handful of examples chosen to show the reasoning behind the labels** | |
| 2. Add a new input-output pair whenever a customer input is misclassified, extending the list over time | |
| 3. Remove the examples and describe the desired classification behavior in a single instruction sentence | |
| 4. Raise the max_tokens limit, giving the model more room to reason before it outputs its label | |

**정답: 1.**

**해설:**

> 📘 레슨 4.2 · 퓨샷 프롬프팅 — Few-shot prompting for consistent output and ambiguous cases

**📝 문제 번역**

한 팀이 과거 데이터에서 직접 겪은 모든 엣지 케이스마다 하나씩, 정확한 입력-출력 쌍 20개로 분류 프롬프트를 만들었습니다. 이 프롬프트는 그 20개 입력에서는 잘 동작하지만, 고객이 20개 중 하나와 비슷하지만 똑같지는 않은 새 입력을 보내면 눈에 띄게 성능이 떨어집니다. 이런 "새롭지만 비슷한" 입력으로 모델의 판단을 일반화시키려면 무엇을 바꿔야 할까요?

- **①** 20개 쌍을 라벨의 판단 근거를 보여 주도록 고른 소수의 예시로 교체한다.
- **②** 고객 입력이 잘못 분류될 때마다 새 입력-출력 쌍을 추가해 목록을 계속 늘린다.
- **③** 예시를 없애고 원하는 분류 동작을 지시문 한 문장으로 설명한다.
- **④** max_tokens 한도를 올려 모델이 라벨을 내기 전에 추론할 여유를 더 준다.

> **핵심:** 사례 목록은 **매칭** 을 가르치고, 이유를 보여 주는 소수의 대표 예시는 **판단 기준** 을 가르칩니다.

1. **정답** - 각 입력이 왜 그 라벨을 받는지 보여 주는 소수의 예시는 근본적인 결정 논리를 가르칩니다. 모델은 20개 쌍과 표면적으로 맞춰 보는 대신, 저장된 사례와 닮았지만 일치하지 않는 새 입력에도 그 논리를 적용합니다.
2. **오답** - 실패할 때마다 쌍을 추가하면 프롬프트는 계속 특정 사례의 카탈로그로 남습니다. 모델은 여전히 표면 유사성으로 매칭하고, 고객은 목록에 없는 변형을 계속 보내므로 성능 저하가 이어집니다.
3. **오답** - 한 문장 지시로는 라벨 사이의 경계가 어디인지 보여 줄 수 없습니다. 잘 고른 구체적 예시가 미묘한 분류 판단을 짧은 설명보다 더 잘 전달하므로, 오히려 더 나빠질 가능성이 큽니다.
4. **오답** - max_tokens는 출력 길이의 상한일 뿐, 팀의 라벨이 어떻게 정해지는지에 대한 정보를 주지 않습니다. 실패의 원인은 예시가 보여 주는 내용이지 추론할 공간 부족이 아닙니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "we recommend working to curate a set of diverse, canonical examples that effectively portray the expected behavior of the agent"

---

## 문제 11
### **Developers have started ignoring a review bot because it flags every broad `catch` block in a TypeScript service, including deliberate ones. You want fewer false positives, and you still want real problems caught in code the bot has never seen. Which few-shot examples should you add?**

| 보기 | 설명 |
|------|------|
| 1. A list of the files and functions where a broad `catch` is approved, each marked acceptable, so the bot skips those exact locations | |
| **2. Two examples that look alike: a top-level handler that logs and rethrows, marked acceptable, and a `catch` around a payment write that swallows the error, marked as an issue, each with a one-line reason** | |
| 3. Several examples of obviously bad code, such as an empty `catch {}`, each marked high severity, so the bot learns what a real issue looks like | |
| 4. No examples, just an instruction saying "do not flag broad catch blocks", so the deliberate uses stop showing up | |

**정답: 2.**

**해설:**

> 📘 레슨 4.2 · 퓨샷 프롬프팅 — Few-shot prompting for consistent output and ambiguous cases

**📝 문제 번역**

TypeScript 서비스에서 리뷰 봇이 의도된 것까지 포함해 모든 광범위한 `catch` 블록을 지적하자 개발자들이 봇을 무시하기 시작했습니다. 오탐은 줄이면서, 봇이 본 적 없는 코드의 진짜 문제는 계속 잡고 싶습니다. 어떤 퓨샷 예시를 추가해야 할까요?

- **①** 광범위한 `catch`가 승인된 파일·함수 목록을 각각 "허용"으로 표시해, 봇이 그 위치들만 건너뛰게 한다.
- **②** 겉보기에 비슷한 두 예시. 로그를 남기고 다시 던지는 최상위 핸들러는 "허용", 결제 쓰기를 감싸 오류를 삼키는 `catch`는 "문제"로 표시하고 각각 한 줄 이유를 붙인다.
- **③** 빈 `catch {}` 같은 명백히 나쁜 코드 예시 여러 개를 각각 높은 심각도로 표시해, 진짜 문제가 어떤 모습인지 배우게 한다.
- **④** 예시 없이 "광범위한 catch 블록은 지적하지 마라"는 지시만 넣어 의도된 사용이 더 이상 나오지 않게 한다.

> **핵심:** 표면은 같고 **판단 요인 하나만 다른 대비 쌍** 에 이유를 달면, 모델은 그 요인(오류가 드러나는가, 사라지는가)을 처음 보는 코드에도 적용합니다.

1. **오답** - 승인된 위치 목록은 그 위치들만 매칭하도록 가르칩니다. 목록 밖의 의도된 `catch`는 계속 지적되고, 새 코드에 대한 판단 기준은 생기지 않습니다.
2. **정답** - 두 예시는 겉으로 같고 오류가 보고되는지 사라지는지만 다릅니다. 이유가 그 차이를 짚어 주므로 봇은 다른 언어의 `catch`나 처음 보는 재시도 래퍼에도 같은 기준을 적용할 수 있습니다.
3. **오답** - 명백히 나쁜 예시만으로는 허용되는 코드가 어디서 끝나고 진짜 문제가 어디서 시작하는지 보여 줄 수 없습니다. 경계의 반대쪽(허용 사례)이 빠져 있어 오탐이 줄지 않습니다.
4. **오답** - 일괄 금지 지시는 오류를 정말로 삼키는 `catch` 블록까지 숨깁니다. 오탐을 줄이는 대가로 진짜 결함을 놓치게 됩니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "Instead, we recommend working to curate a set of diverse, canonical examples that effectively portray the expected behavior of the agent."

---

## 문제 12
### **A team adds five few-shot examples to a document-classification prompt to fix inconsistent labeling. All five examples happen to be English-language emails under 100 words. After deployment, the model performs well on similar short English emails but starts mislabeling longer documents and documents in other languages that it previously handled correctly under the old, example-free prompt. What is the most likely cause, and what should the team do?**

| 보기 | 설명 |
|------|------|
| **1. The examples unintentionally taught an unrelated pattern tied to length and language; diversify them** | |
| 2. The five examples are too few in number; keep them but duplicate each one three times | |
| 3. Few-shot examples are simply incompatible with document classification tasks, so remove them entirely | |
| 4. The regression is unrelated to the examples and is caused by unrelated model drift | |

**정답: 1.**

**해설:**

> 📘 레슨 4.2 · 퓨샷 프롬프팅 — Few-shot prompting for consistent output and ambiguous cases

**📝 문제 번역**

한 팀이 일관되지 않은 라벨링을 고치려고 문서 분류 프롬프트에 퓨샷 예시 5개를 넣었습니다. 그런데 5개 모두 우연히 100단어 미만의 영어 이메일이었습니다. 배포 후 모델은 비슷한 짧은 영어 이메일은 잘 처리하지만, 예전 예시 없는 프롬프트가 올바르게 처리하던 긴 문서와 다른 언어 문서를 잘못 분류하기 시작했습니다. 가장 그럴듯한 원인과 조치는?

- **①** 예시가 길이·언어와 관련된 무관한 패턴을 의도치 않게 가르쳤다. 예시를 다양화한다.
- **②** 예시 5개가 너무 적다. 그대로 두되 각각 세 번씩 복제한다.
- **③** 퓨샷 예시는 문서 분류 작업과 본래 맞지 않으므로 모두 제거한다.
- **④** 회귀는 예시와 무관하며, 관련 없는 모델 드리프트 때문이다.

> **핵심:** 모델은 예시가 의도한 특징뿐 아니라 **우연한 공통점(길이·언어)** 도 신호로 배웁니다. 처방은 예시를 지우는 것이 아니라 운영에서 실제로 달라지는 차원에 걸쳐 다양화하는 것입니다.

1. **정답** - 모든 예시가 언어나 길이 같은 부수적 특성을 공유하면, 모델은 그 표면 특성을 목표 패턴의 일부로 받아들일 수 있습니다. 팀이 고치려던 차원만이 아니라 운영에서 실제로 달라지는 차원 전반에 걸쳐 예시를 다양하게 만들어야 합니다.
2. **오답** - 같은 좁은 예시를 복제하면 의도치 않은 패턴이 더 강해질 뿐입니다. 문제는 반복 부족이 아니라 다양성 부족입니다.
3. **오답** - 퓨샷 예시는 분류 작업에 쓰이는 표준적이고 효과적인 기법입니다. 실패 원인은 기법이 아니라 대표성 없는 예시 세트이고, 예시를 지우면 원래의 라벨 불일치가 돌아옵니다.
4. **오답** - 회귀는 좁은 예시 세트를 추가한 시점과 정확히 겹칩니다. 대표성 없는 예시로부터 의도치 않은 패턴을 배우는 것은 잘 알려진 위험이라, 무관한 드리프트보다 훨씬 그럴듯한 설명입니다.

📚 근거: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "Diverse: Cover edge cases and vary enough that Claude doesn't pick up unintended patterns."

---

## 문제 13
### **Clinical intake notes say things like "a couple tablets" or "about half a cup". The extraction pipeline's examples all show crisp doses such as "400 mg", and the output keeps showing precise amounts the patient never gave. What change to the prompt best stops these made-up values?**

| 보기 | 설명 |
|------|------|
| 1. Add more examples with exact numeric doses so the model sees even more clearly what a correct extraction looks like | |
| **2. Add one example where a vague amount is extracted as written and one where the dose is absent and the output says it is not specified, and explicitly allow the model to admit uncertainty** | |
| 3. Add an instruction to convert every amount to a standard unit such as milligrams, so each dose field always holds a number | |
| 4. Remove the examples and write a more detailed description of the dose field, so the model stops copying a pattern | |

**정답: 2.**

**해설:**

> 📘 레슨 4.2 · 퓨샷 프롬프팅 — Few-shot prompting for consistent output and ambiguous cases

**📝 문제 번역**

임상 접수 기록에는 "알약 두어 개", "반 컵쯤" 같은 표현이 나옵니다. 추출 파이프라인의 예시는 모두 "400 mg"처럼 딱 떨어지는 용량뿐이고, 출력에는 환자가 말한 적 없는 정밀한 양이 계속 나옵니다. 이런 지어낸 값을 막으려면 프롬프트를 어떻게 바꿔야 할까요?

- **①** 정확한 숫자 용량 예시를 더 넣어, 올바른 추출이 어떤 모습인지 더 분명히 보여 준다.
- **②** 모호한 양을 적힌 그대로 추출하는 예시 하나와, 용량이 없어 "명시되지 않음"으로 출력하는 예시 하나를 넣고, 모델이 불확실함을 인정해도 된다고 명시적으로 허용한다.
- **③** 모든 양을 밀리그램 같은 표준 단위로 변환하라는 지시를 넣어 용량 필드에 항상 숫자가 들어가게 한다.
- **④** 예시를 없애고 용량 필드 설명을 더 자세히 써서 모델이 패턴을 베끼지 않게 한다.

> **핵심:** 전부 정밀한 예시는 "항상 정밀한 값을 내라"를 가르칩니다. **모호한 값·없는 값을 정직하게 처리한 예시 + 불확실함을 인정해도 된다는 명시적 허용** 이 날조를 줄입니다.

1. **오답** - 정밀한 예시를 더 넣으면 "용량은 항상 정확한 숫자"라는 패턴이 더 강해져, 모델이 정밀도를 지어내도록 더 밀어붙입니다.
2. **정답** - 모호한 값과 없는 값을 정직하게 다룬 예시는 출력 형식 안에서 정직한 답이 어떤 모습인지 보여 줍니다. Reduce hallucinations 문서도 Claude에게 불확실함을 인정할 수 있게 명시적으로 허용하면 잘못된 정보가 크게 줄어든다고 설명합니다.
3. **오답** - 강제 단위 변환은 "알약 두어 개"를 숫자로 바꾸도록 요구하므로, 원문에 없는 정밀도를 만들어 내라는 지시와 같습니다.
4. **오답** - 예시를 없애면 올바른 행동(모호한 값 보존, 없는 값 표시)을 보여 줄 수 있는 수단 자체를 버리게 됩니다. 문제는 예시의 존재가 아니라 예시의 구성입니다.

📚 근거: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) · [Best practices for prompt engineering](https://claude.com/blog/best-practices-for-prompt-engineering)

> "Explicitly give Claude permission to admit uncertainty. This simple technique can drastically reduce false information."

---

## 문제 14
### **An invoice pipeline reads records from a non-strict extraction tool. Sometimes `quantity` arrives as "2" instead of 2, and some records are missing the required `invoice_id`. Which change removes this whole class of failure?**

| 보기 | 설명 |
|------|------|
| 1. Add a system-prompt line such as "Return only valid JSON that matches the schema exactly." | |
| 2. Wrap the call in retry logic that re-sends the request whenever a record fails validation | |
| **3. Set `strict: true` on the extraction tool so sampling is limited to inputs that are valid under the schema** | |
| 4. Repeat the field types and required keys in the tool's `description` so Claude reads them more closely | |

**정답: 3.**

**해설:**

> 📘 레슨 4.3 · 구조화 출력 — Structured output with tool use and JSON schemas

**📝 문제 번역**

송장 파이프라인이 strict가 아닌 추출 도구에서 레코드를 읽습니다. 가끔 `quantity`가 2가 아니라 "2"로 오고, 일부 레코드에는 필수인 `invoice_id`가 빠져 있습니다. 이런 종류의 실패 전체를 없애는 변경은?

- **①** 시스템 프롬프트에 "스키마와 정확히 일치하는 유효한 JSON만 반환하라" 같은 문장을 추가한다.
- **②** 레코드가 검증에 실패할 때마다 요청을 다시 보내는 재시도 로직으로 호출을 감싼다.
- **③** 추출 도구에 `strict: true`를 설정해 샘플링이 스키마상 유효한 입력으로만 제한되게 한다.
- **④** 도구의 `description`에 필드 타입과 필수 키를 한 번 더 적어 Claude가 더 꼼꼼히 읽게 한다.

> **핵심:** `strict: true`는 스키마를 문법(grammar)으로 컴파일해 **토큰 샘플링 자체를 제한** 하므로, 잘못된 타입과 필수 필드 누락이 애초에 생성될 수 없습니다.

1. **오답** - 프롬프트 문구는 모델을 유도할 뿐 강제하지 않습니다. strict 없이도 도구 입력은 대체로 스키마를 따르지만, 문서는 "2" 같은 다른 타입이나 필수 필드 누락이 생길 수 있다고 명시합니다.
2. **오답** - 재시도는 실패가 일어난 뒤에 처리하는 방법일 뿐, 실패 자체를 없애지 못합니다. 요청마다 지연과 비용도 늘어납니다.
3. **정답** - strict 모드는 `input_schema`를 문법으로 컴파일하고 샘플링을 그 문법이 허용하는 출력으로만 제한합니다. 타입 오류와 필수 필드 누락이 생성될 수 없으므로 이 실패 유형 전체가 사라집니다.
4. **오답** - description을 반복하는 것도 유도일 뿐입니다. 모델이 더 꼼꼼히 읽을 수는 있어도 구조적 보장은 생기지 않습니다.

📚 근거: [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use) · [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)

> "Setting strict: true on a tool definition guarantees Claude's tool inputs match your JSON Schema by constraining the model's token sampling to schema-valid outputs"

---

## 문제 15
### **A contract-extraction request sets tool_choice to {"type": "tool", "name": "extract_clauses"}. The system prompt also says: "Before calling the tool, briefly explain which clauses look ambiguous." What does the response contain?**

| 보기 | 설명 |
|------|------|
| 1. A text block with the explanation, then the extract_clauses tool_use block | |
| **2. Only the extract_clauses tool_use block, with no explanation in front of it** | |
| 3. A plain-text explanation only, because the instruction to explain overrides the forced tool | |
| 4. A tool_use block for whichever registered tool Claude thinks fits best, with the explanation in front of it | |

**정답: 2.**

**해설:**

> 📘 레슨 4.3 · 구조화 출력 — Structured output with tool use and JSON schemas

**📝 문제 번역**

계약서 추출 요청이 tool_choice를 `{"type": "tool", "name": "extract_clauses"}`로 설정했습니다. 시스템 프롬프트에는 "도구를 호출하기 전에 어떤 조항이 모호해 보이는지 간단히 설명하라"는 지시도 있습니다. 응답에는 무엇이 들어 있을까요?

- **①** 설명이 담긴 text 블록, 그다음 `extract_clauses` tool_use 블록
- **②** 앞에 설명 없이 `extract_clauses` tool_use 블록만
- **③** 설명하라는 지시가 강제 도구보다 우선하므로 평문 설명만
- **④** Claude가 가장 알맞다고 판단한 등록된 도구의 tool_use 블록, 그 앞에 설명

> **핵심:** `any`나 이름 지정 `tool`을 쓰면 API가 assistant 턴을 **prefill해 tool_use 블록부터 시작** 하게 하므로, 요청해도 그 앞에 자연어 설명이 나오지 않습니다.

1. **오답** - 강제 호출에서는 응답이 tool_use 블록으로 시작합니다. 문서는 명시적으로 요청해도 tool_use 앞에 자연어 응답이나 설명을 내지 않는다고 적습니다.
2. **정답** - 이름 지정 강제 호출이므로 `extract_clauses` 호출이 보장되고, prefill 때문에 앞선 설명은 없습니다. 설명이 필요하면 `auto`로 두고 user 메시지에서 도구 사용을 지시해야 하지만, 그러면 호출이 보장되지 않습니다.
3. **오답** - 프롬프트 지시는 tool_choice 강제를 이기지 못합니다. 강제 설정에서는 도구 호출이 반드시 일어납니다.
4. **오답** - 이름을 지정한 강제 호출이므로 Claude가 다른 도구를 고를 수 없고, 앞선 설명도 붙지 않습니다. 도구 선택을 Claude에게 맡기는 것은 `any`이며, 그때도 설명은 나오지 않습니다.

📚 근거: [Define tools (Forcing tool use)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "the models will not emit a natural language response or explanation before tool_use content blocks, even if explicitly asked to do so."

---

## 문제 16
### **A pipeline first needs Claude to run extract_metadata on an uploaded document before any enrichment or summarization steps proceed. Other tools such as translate_text and summarize_document are also registered on the same request, and the team is worried Claude might call one of those first. Which tool_choice setting guarantees extract_metadata runs on this turn?**

| 보기 | 설명 |
|------|------|
| **1. tool_choice: {"type": "tool", "name": "extract_metadata"}** | |
| 2. tool_choice: {"type": "any"} | |
| 3. tool_choice: {"type": "auto"} | |
| 4. tool_choice: {"type": "none"} | |

**정답: 1.**

**해설:**

> 📘 레슨 4.3 · 구조화 출력 — Structured output with tool use and JSON schemas

**📝 문제 번역**

파이프라인은 보강이나 요약 단계가 진행되기 전에, 업로드된 문서에 대해 Claude가 먼저 extract_metadata를 실행해야 합니다. 같은 요청에 translate_text와 summarize_document 같은 다른 도구도 등록돼 있고, 팀은 Claude가 그중 하나를 먼저 부를까 걱정합니다. 이번 턴에 extract_metadata 실행을 보장하는 tool_choice 설정은?

- **①** `tool_choice: {"type": "tool", "name": "extract_metadata"}`
- **②** `tool_choice: {"type": "any"}`
- **③** `tool_choice: {"type": "auto"}`
- **④** `tool_choice: {"type": "none"}`

> **핵심:** 특정 추출이 반드시 먼저 끝나야 하면 **도구 이름을 지정한 강제 호출** 을 씁니다. `any`는 "어떤 도구든 하나"만 보장합니다.

1. **정답** - 이름을 지정한 강제 호출은 이번 턴에 바로 그 도구가 호출되도록 보장하므로, translate_text나 summarize_document보다 extract_metadata가 먼저 실행됩니다.
2. **오답** - `any`는 등록된 도구 중 하나가 호출된다는 것만 보장합니다. Claude가 extract_metadata 대신 translate_text나 summarize_document를 고를 수 있습니다.
3. **오답** - `auto`는 도구를 부를지, 어떤 도구를 부를지를 Claude가 자유롭게 정하므로 extract_metadata의 선행 실행을 보장하지 못합니다. 텍스트로만 답할 수도 있습니다.
4. **오답** - `none`은 도구 호출 자체를 막으므로 extract_metadata를 강제하기는커녕 실행을 막습니다.

> 💡 참고: 2026년 10월 문서 기준 Claude Opus 5.5·Sonnet 5.5·Fable 5.1·Mythos 5.1은 `any`와 `tool`을 400 오류로 거절합니다. 이런 모델에서는 `auto` + strict 도구 + 프롬프트 지시가 문서의 대안입니다.

📚 근거: [Define tools (Forcing tool use)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)

> "any tells Claude that it must use one of the provided tools, but doesn't force a particular tool."

---

## 문제 17
### **A team building a resume-parsing tool wants to guarantee that structured candidate data is extracted via a `parse_resume` tool on the current turn. They also want to know whether Claude can include natural-language reasoning about ambiguous resume sections before that tool call. Which `tool_choice` configuration should be used to guarantee the `parse_resume` call, and what does Anthropic documentation state about natural-language commentary before a forced tool call?**

| 보기 | 설명 |
|------|------|
| 1. `tool_choice: {"type": "auto"}`, combined with an explicit user-message instruction to use the `parse_resume` tool and share any relevant reasoning as text | |
| 2. `tool_choice: {"type": "any"}`, because `any` allows Claude to freely mix natural-language commentary with the forced tool call in the same response | |
| **3. `tool_choice: {"type": "tool", "name": "parse_resume"}`, because this is the documented way to force the specific tool; the trade-off is that forced tool use suppresses natural-language text before the tool call** | |
| 4. `tool_choice: {"type": "none"}`, so Claude can freely decide in text whether to also produce a `parse_resume` tool call afterward | |

**정답: 3.**

**해설:**

> 📘 레슨 4.3 · 구조화 출력 — Structured output with tool use and JSON schemas

**📝 문제 번역**

이력서 파싱 도구를 만드는 팀이 이번 턴에 `parse_resume` 도구로 구조화된 지원자 데이터가 반드시 추출되도록 보장하려고 합니다. 또 그 도구 호출 전에 Claude가 모호한 이력서 섹션에 대한 자연어 추론을 덧붙일 수 있는지도 알고 싶어 합니다. `parse_resume` 호출을 보장하려면 어떤 `tool_choice` 설정을 써야 하고, 강제 도구 호출 앞의 자연어 코멘트에 대해 Anthropic 문서는 뭐라고 말할까요?

- **①** `tool_choice: {"type": "auto"}`에 `parse_resume` 도구를 쓰고 관련 추론을 텍스트로 공유하라는 명시적인 user 메시지 지시를 결합한다.
- **②** `tool_choice: {"type": "any"}`. `any`는 같은 응답에서 자연어 코멘트와 강제 도구 호출을 자유롭게 섞을 수 있게 해 준다.
- **③** `tool_choice: {"type": "tool", "name": "parse_resume"}`. 특정 도구를 강제하는 문서화된 방법이다. 대가로, 강제 도구 사용은 도구 호출 앞의 자연어 텍스트를 억제한다.
- **④** `tool_choice: {"type": "none"}`. Claude가 텍스트로 자유롭게 판단한 뒤 `parse_resume` 호출을 이어서 낼지 정할 수 있다.

> **핵심:** 특정 도구 호출 **보장** 과 호출 **앞의 자연어 추론** 은 동시에 얻을 수 없습니다. 이름 지정 강제 호출은 호출을 보장하는 대신 앞선 텍스트를 없앱니다.

1. **오답** - `auto`는 기본 동작이며, 요청과 도구 설명을 보고 Claude가 도구를 부를지 정합니다. 명시적 지시는 영향을 줄 수는 있어도 `parse_resume` 호출을 보장하지 않습니다. 추론은 나올 수 있지만, Claude가 도구 대신 텍스트로 답하면 구조화 추출 보장이라는 요구를 충족하지 못합니다.
2. **오답** - `any`는 등록된 도구 중 하나를 쓰게 할 뿐 `parse_resume`을 특정해 강제하지 않습니다. 또 `any`도 강제 도구 사용이라 API가 assistant 메시지를 prefill하므로, tool_use 블록 앞의 자연어 코멘트가 억제됩니다. "자유롭게 섞을 수 있다"는 설명과 정반대입니다.
3. **정답** - 문서에 따르면 `{"type": "tool", "name": "parse_resume"}`는 지정한 도구 호출을 강제합니다. `tool`이나 `any`일 때 API가 assistant 메시지를 prefill하므로, 명시적으로 요청해도 tool_use 블록 앞에 자연어 응답이나 설명이 나오지 않습니다. 호출 보장은 충족하되 앞선 추론은 불가능하다는 한계를 정확히 설명합니다.
4. **오답** - `none`은 도구 사용을 명시적으로 막으므로 `parse_resume` 호출이 아예 일어나지 않습니다. 텍스트는 나올 수 있지만 도구 호출은 이어지지 않습니다.

📚 근거: [Define tools (Forcing tool use)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) · [Tool choice (cookbook)](https://platform.claude.com/cookbook/tool-use-tool-choice)

> "when you have tool_choice as any or tool, the API prefills the assistant message to force a tool to be used."

---

## 문제 18
### **Lab reports are extracted with a strict tool whose schema lists `referring_physician` as a required string. Many reports name no referring physician, but every record still has a plausible-looking name in that field. What is the right fix?**

| 보기 | 설명 |
|------|------|
| 1. Keep the field required and add a system-prompt line such as "Never invent a physician name that is not in the report." | |
| 2. Turn off strict mode on the tool so Claude is free to leave the required field out when the report lacks it | |
| **3. Make `referring_physician` optional and allow null, so "not in the report" is a valid answer that downstream code can see** | |
| 4. Keep the field required and add `input_examples` that show physician names in the correct format | |

**정답: 3.**

**해설:**

> 📘 레슨 4.3 · 구조화 출력 — Structured output with tool use and JSON schemas

**📝 문제 번역**

검사 보고서를 strict 도구로 추출하는데, 스키마에 `referring_physician`(의뢰 의사)이 필수 string으로 정의돼 있습니다. 많은 보고서에 의뢰 의사 이름이 없는데도, 모든 레코드의 그 필드에 그럴듯한 이름이 들어 있습니다. 올바른 수정은?

- **①** 필드를 필수로 유지하고 시스템 프롬프트에 "보고서에 없는 의사 이름을 절대 지어내지 마라" 같은 문장을 추가한다.
- **②** 도구의 strict 모드를 꺼서, 보고서에 값이 없을 때 Claude가 필수 필드를 생략할 수 있게 한다.
- **③** `referring_physician`을 optional로 바꾸고 null을 허용해, "보고서에 없음"이 다운스트림 코드가 볼 수 있는 유효한 답이 되게 한다.
- **④** 필드를 필수로 유지하고 올바른 형식의 의사 이름을 보여 주는 `input_examples`를 추가한다.

> **핵심:** strict 모드는 필수 필드를 강제하므로, 원문에 값이 없으면 **스키마상 유효한 유일한 출력은 지어낸 값** 입니다. 없을 수 있는 필드는 optional·nullable로 설계합니다.

1. **오답** - 프롬프트 지시는 문법(grammar)을 이길 수 없습니다. 스키마가 문자열을 요구하는 한 모델은 무언가를 채워야 합니다.
2. **오답** - strict를 끄면 구조적 보장(타입·필수 필드)을 통째로 포기하면서도 스키마 설계의 문제는 고치지 못합니다. 다른 필드에서 타입 오류나 누락이 다시 생길 수 있습니다.
3. **정답** - optional이면서 null을 허용하면 Claude가 값이 없다는 사실을 정직하게 보고할 수 있고, 다운스트림 코드는 null을 보고 후속 처리(사람 확인 등)를 할 수 있습니다. Agent SDK 문서도 작업에 정보가 없을 수 있으면 해당 필드를 optional로 두라고 권합니다.
4. **오답** - 형식 예시는 이름을 어떤 모양으로 쓸지 보여 줄 뿐, 값이 없을 때 무엇을 할지는 해결하지 못합니다. 필수 필드인 한 날조 압박은 그대로입니다.

📚 근거: [Agent SDK: Structured outputs](https://code.claude.com/docs/en/agent-sdk/structured-outputs) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

> "Match schema to task. If the task might not have all the information your schema requires, make those fields optional."

---

## 문제 19
### **During an audit of an expense-report extractor, the team finds records with the tax amount in the tip field and line items that don't add up to the total. The extractor runs with strict: true and a forced tool_choice, and every record passed schema validation. What should the team do?**

| 보기 | 설명 |
|------|------|
| 1. Switch tool_choice from the forced tool to {"type": "any"} so Claude can pick a schema that fits each report better | |
| 2. Mark more fields as required so Claude can't skip or misplace any values | |
| **3. Add checks in their own code after extraction, such as line items summing to the total and cross-field consistency, and send any failures back to Claude** | |
| 4. Add additionalProperties: false to the schema so values can't end up in the wrong field | |

**정답: 3.**

**해설:**

> 📘 레슨 4.3 · 구조화 출력 — Structured output with tool use and JSON schemas

**📝 문제 번역**

경비 보고서 추출기를 감사하다가, 세금 금액이 팁 필드에 들어가 있고 품목 합계가 총액과 맞지 않는 레코드가 발견됐습니다. 추출기는 `strict: true`와 강제 tool_choice로 동작하고, 모든 레코드가 스키마 검증을 통과했습니다. 팀은 무엇을 해야 할까요?

- **①** tool_choice를 강제 도구에서 `{"type": "any"}`로 바꿔 Claude가 보고서마다 더 맞는 스키마를 고르게 한다.
- **②** 더 많은 필드를 필수로 지정해 Claude가 값을 빠뜨리거나 엉뚱한 곳에 넣지 못하게 한다.
- **③** 추출 후 자체 코드에서 품목 합계가 총액과 맞는지, 필드 간 일관성이 있는지 검사하고, 실패하면 Claude에게 다시 보낸다.
- **④** 스키마에 `additionalProperties: false`를 추가해 값이 엉뚱한 필드에 들어가지 못하게 한다.

> **핵심:** strict 모드는 **구조(타입·필수 필드·선언 안 된 키 금지)만 보장** 합니다. 잘못된 필드에 들어간 값이나 맞지 않는 합계는 스키마상 유효하므로 앱의 의미 검증으로 잡아야 합니다.

1. **오답** - tool_choice는 도구가 실행되는지, 어떤 도구가 실행되는지만 정합니다. 값이 올바른 필드에 들어갔는지는 tool_choice와 무관합니다.
2. **오답** - 필수 필드를 늘리면 원문에 없는 값까지 채우도록 압박해 날조를 부릅니다. 값이 엉뚱한 칸에 들어가는 문제도 해결하지 못합니다.
3. **정답** - 의미 오류는 추출 뒤 자체 검증 코드에서만 잡힙니다. 품목 합 = 총액, 필드 간 일관성 같은 규칙을 검사하고 실패 내용을 Claude에게 되돌려 재추출하게 하는 것이 4.4 레슨의 재시도 패턴입니다.
4. **오답** - strict 스키마는 객체에 이미 `additionalProperties: false`를 요구합니다. 이 설정은 선언되지 않은 키를 막을 뿐, 선언된 두 필드 사이에서 값이 뒤바뀌는 것은 막지 못합니다.

📚 근거: [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

> "Type safe: Guaranteed field types and required fields"

---

## 문제 20
### **A financial services firm uses a tool-based schema to extract transaction records from PDF statements, including a required amount field and a required transaction_type field. An audit later finds several instances where deposits were mislabeled as withdrawals, even though every amount and transaction_type field is present and passes schema validation. What does this best illustrate about JSON schema enforcement via tool use?**

| 보기 | 설명 |
|------|------|
| **1. Schema validation confirms that required fields exist and have the correct types but it cannot verify that the values are semantically correct relative to the source document, so mislabeling errors like this can still occur.** | |
| 2. This indicates that the input_schema was likely malformed, since a correctly constructed JSON schema can apply constraints that verify the relationship between amount and transaction_type, preventing such semantic mislabeling. | |
| 3. The mislabeling proves that without a tool_choice that forces a specific tool invocation, the model may output transaction_type labels that diverge from the source document's content, leading to semantic inaccuracies in the extracted data. | |
| 4. This is expected only when strict mode is disabled, because strict mode enforces that field values must satisfy the schema's semantic rules, such as ensuring transaction_type accurately reflects the amount sign, thereby preventing mislabeling. | |

**정답: 1.**

**해설:**

> 📘 레슨 4.3 · 구조화 출력 — Structured output with tool use and JSON schemas

**📝 문제 번역**

한 금융 회사가 도구 기반 스키마로 PDF 거래 내역서에서 거래 레코드를 추출합니다. 스키마에는 필수 amount 필드와 필수 transaction_type 필드가 있습니다. 감사에서 입금이 출금으로 잘못 라벨링된 사례가 여럿 발견됐지만, 모든 amount와 transaction_type 필드는 존재하고 스키마 검증도 통과했습니다. 이것은 도구 사용을 통한 JSON 스키마 강제에 대해 무엇을 보여 줄까요?

- **①** 스키마 검증은 필수 필드가 존재하고 타입이 맞는지 확인하지만, 값이 원문 문서에 비추어 의미상 옳은지는 확인할 수 없으므로 이런 라벨링 오류는 여전히 생길 수 있다.
- **②** input_schema가 잘못 작성됐을 가능성이 높다. 올바르게 구성된 JSON 스키마는 amount와 transaction_type의 관계를 검증하는 제약을 걸어 이런 의미 오류를 막을 수 있다.
- **③** 특정 도구 호출을 강제하는 tool_choice가 없으면 모델이 원문 내용과 다른 transaction_type 라벨을 낼 수 있다는 것을 보여 준다.
- **④** strict 모드를 껐을 때만 생기는 일이다. strict 모드는 transaction_type이 금액의 부호를 정확히 반영하는지 같은 스키마의 의미 규칙까지 강제한다.

> **핵심:** 스키마 강제는 출력의 **모양** 을 보장할 뿐, 값이 원문과 맞는지는 보장하지 않습니다.

1. **정답** - JSON 스키마 검증은 필수 필드의 존재와 타입을 확인하지만, 값이 원문에 비추어 정확한지는 판단하지 못합니다. transaction_type은 유효한 값이었고 단지 틀린 값이었으므로, 입금을 출금으로 적은 오류도 검증을 통과합니다.
2. **오답** - JSON Schema는 구조와 타입을 검증하도록 설계됐지 값의 사실성을 검증하지 않습니다. 완벽하게 작성한 스키마라도 transaction_type이 문서 내용과 일치하는지 강제할 수 없습니다.
3. **오답** - tool_choice는 지정한 도구를 호출하게 할 뿐 반환된 값이 원문에 맞는지는 보장하지 않습니다. 이 라벨링 오류는 도구 호출 방식과 무관한 의미 오류입니다.
4. **오답** - strict 모드는 도구 입력이 스키마 구조(타입·필수 필드·추가 속성 금지)를 따르게 할 뿐, 금액 부호와 거래 유형의 일치 같은 의미 검증은 하지 않습니다. strict를 켜도 오류는 생깁니다.

📚 근거: [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

---

## 문제 21
### **A medical-records extractor uses strict tool use with a schema that has `patient` and `guardian` objects, each with a required `date_of_birth` string. Which error can still reach your code and needs a check you write yourself?**

| 보기 | 설명 |
|------|------|
| 1. A response that is not valid JSON and fails to parse | |
| 2. A response that leaves out the required `date_of_birth` key | |
| 3. A response that returns `date_of_birth` as a number when the schema asks for a string | |
| **4. A response that puts the patient's date of birth under `guardian` instead of `patient`** | |

**정답: 4.**

**해설:**

> 📘 레슨 4.4 · 검증·재시도 — Validation, retry with error feedback, and self-correcting extraction

**📝 문제 번역**

의료 기록 추출기가 strict 도구 사용으로 동작하며, 스키마에는 `patient`와 `guardian` 객체가 있고 각각 필수 `date_of_birth` 문자열을 가집니다. 다음 중 여전히 코드까지 도달할 수 있어 직접 작성한 검사가 필요한 오류는?

- **①** 유효한 JSON이 아니어서 파싱에 실패하는 응답
- **②** 필수 `date_of_birth` 키가 빠진 응답
- **③** 스키마가 문자열을 요구하는데 `date_of_birth`를 숫자로 반환한 응답
- **④** 환자의 생년월일을 `patient`가 아니라 `guardian` 아래에 넣은 응답

> **핵심:** 제약 디코딩은 **문법·타입·필수 키** 를 보장하므로 앞의 세 오류는 생길 수 없습니다. 남는 것은 각 필드가 단독으로는 유효한 **의미 오류** 입니다.

1. **오답** - structured outputs와 strict 도구 사용은 항상 유효한 JSON을 만듭니다. 문서의 표현대로 `JSON.parse()` 오류가 더 이상 생기지 않습니다.
2. **오답** - 필수 필드는 문법 수준에서 보장되므로 `date_of_birth` 키 누락은 생성될 수 없습니다.
3. **오답** - 필드 타입도 보장됩니다. 스키마가 string을 요구하면 숫자는 샘플링 단계에서 배제됩니다.
4. **정답** - 형식이 올바른 날짜가 잘못된 객체 아래에 들어간 것은 스키마를 통과합니다. 두 객체 모두 `date_of_birth` 문자열을 가질 수 있으므로 각 필드는 단독으로 유효하고, 이런 오류는 앱의 의미 검증만 잡을 수 있습니다.

📚 근거: [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)

> "Type safe: Guaranteed field types and required fields"

---

## 문제 22
### **A purchase-order extractor uses a strict JSON schema, so every response has correctly typed fields and no missing keys. On one order, the extracted line-item amounts sum to $940 while the extracted "order_total" field reads $980. Both values are individually valid against the schema. How should this discrepancy be classified and handled?**

| 보기 | 설명 |
|------|------|
| **1. Semantic error the schema cannot detect; add a post-extraction check that recomputes the line-item sum and compares it to order_total** | |
| 2. Schema definition gap; tighten the schema with a numeric range or pattern on order_total so that inconsistent totals are rejected | |
| 3. Prompt wording flaw; add worked examples with matching totals to the extraction prompt so the model keeps order_total consistent | |
| 4. Transient sampling artifact; retry the request at temperature 0 and accept the first response that passes schema validation | |

**정답: 1.**

**해설:**

> 📘 레슨 4.4 · 검증·재시도 — Validation, retry with error feedback, and self-correcting extraction

**📝 문제 번역**

구매 주문서 추출기가 strict JSON 스키마를 쓰므로 모든 응답은 필드 타입이 맞고 키 누락이 없습니다. 한 주문에서 추출된 품목 금액의 합은 $940인데, 추출된 "order_total" 필드는 $980입니다. 두 값 모두 스키마상 개별적으로 유효합니다. 이 불일치를 어떻게 분류하고 처리해야 할까요?

- **①** 스키마가 감지할 수 없는 의미 오류다. 추출 후 품목 합을 다시 계산해 order_total과 비교하는 검사를 추가한다.
- **②** 스키마 정의의 공백이다. order_total에 수치 범위나 패턴을 걸어 일관되지 않은 총액이 거부되게 스키마를 조인다.
- **③** 프롬프트 문구의 결함이다. 추출 프롬프트에 총액이 맞는 예시를 넣어 모델이 order_total을 일관되게 유지하게 한다.
- **④** 일시적인 샘플링 결함이다. temperature 0으로 재시도하고 스키마 검증을 통과한 첫 응답을 받아들인다.

> **핵심:** 개별적으로 유효한 두 값 사이의 불일치는 **의미 오류** 이며, 앱 코드가 합계를 다시 계산해 비교하는 **필드 간 검사** 로만 잡을 수 있습니다.

1. **정답** - strict 스키마는 타입과 필수 키를 강제하지만, 개별적으로 유효한 두 값의 불일치는 의미 오류입니다. 앱 코드가 품목에서 합을 다시 계산해 명시된 총액과 비교해야 합니다.
2. **오답** - 범위나 패턴은 그 필드 자신의 값만 검사합니다. JSON Schema로는 "이 숫자는 다른 필드들의 합과 같아야 한다"를 표현할 수 없으므로 $980은 여전히 통과합니다. 게다가 strict 스키마는 `minimum`·`maximum` 같은 수치 제약 자체를 지원하지 않습니다.
3. **오답** - 예시는 불일치를 덜 자주 일어나게 할 수는 있지만 보장도 감지도 하지 못합니다. 두 값이 이미 스키마를 만족하므로 불일치한 총액이 눈에 띄지 않고 반환될 수 있습니다.
4. **오답** - 스키마 검증만 통과하면 받아들이는 재시도는, 합계가 안 맞는 응답도 그 기준을 통과하므로 같은 불일치를 다시 받아들입니다. 결정적인 일관성 검사가 필요합니다.

📚 근거: [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)

> "Claude receives a simplified schema, but a helper that validates responses still enforces every constraint in your code."

---

## 문제 23
### **A contract extractor's schema has a required `renewal_date` string. The contract says only that renewal terms are set out in the Master Agreement, and that document was never sent to the pipeline. Three retries have each returned a different date that appears nowhere in the contract. What is the right next step?**

| 보기 | 설명 |
|------|------|
| 1. Retry again with the contract, the failed extraction and a more explicit validation error that says the date cannot be found | |
| 2. Switch to a larger model, which reads the contract more carefully and will find the date | |
| **3. Stop retrying, make `renewal_date` optional so the model can report that it is missing, and send the record to a person or supply the Master Agreement** | |
| 4. Add a date `format` to the field so the model has to return a well-formed date | |

**정답: 3.**

**해설:**

> 📘 레슨 4.4 · 검증·재시도 — Validation, retry with error feedback, and self-correcting extraction

**📝 문제 번역**

계약서 추출기 스키마에 필수 `renewal_date` 문자열이 있습니다. 계약서에는 갱신 조건이 Master Agreement(기본 계약서)에 정해져 있다고만 적혀 있고, 그 문서는 파이프라인에 들어오지 않았습니다. 세 번의 재시도가 매번 계약서 어디에도 없는 서로 다른 날짜를 반환했습니다. 올바른 다음 단계는?

- **①** 계약서, 실패한 추출 결과, 날짜를 찾을 수 없다는 더 명시적인 검증 오류를 함께 보내 다시 재시도한다.
- **②** 계약서를 더 꼼꼼히 읽어 날짜를 찾아낼 더 큰 모델로 바꾼다.
- **③** 재시도를 멈추고, 모델이 값이 없다고 보고할 수 있도록 `renewal_date`를 optional로 바꾸고, 레코드를 사람에게 보내거나 Master Agreement를 확보해 넣는다.
- **④** 필드에 날짜 `format`을 지정해 모델이 형식이 올바른 날짜를 반환하게 한다.

> **핵심:** 재시도는 **정답이 입력 안에 있을 때만** 효과가 있습니다. 매번 다른 날짜가 나온다는 것은 이미 지어내고 있다는 신호입니다.

1. **오답** - 날짜는 모델이 받은 어떤 입력에도 없습니다. 오류 메시지를 아무리 명확하게 써도 없는 정보는 생기지 않고, 필수 필드를 채우라는 압박만 반복됩니다.
2. **오답** - 큰 모델은 문서를 더 정확히 읽을 수는 있어도, 문서에 없는 값을 찾을 수는 없습니다.
3. **정답** - 필드를 필수로 두면 모델은 값을 지어낼 수밖에 없습니다. optional로 바꿔 "없음"을 정직하게 표현하게 하고, 재시도를 멈춘 뒤 사람 검토로 넘기거나 빠진 문서를 공급하는 것이 올바른 분기입니다.
4. **오답** - format은 출력의 모양을 다듬을 뿐 존재하지 않는 값을 만들어 내지 못합니다. 형식이 더 그럴듯한 가짜 날짜가 나올 뿐입니다.

📚 근거: [Agent SDK: Structured outputs](https://code.claude.com/docs/en/agent-sdk/structured-outputs) · [Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent)

> "Match schema to task. If the task might not have all the information your schema requires, make those fields optional."

---

## 문제 24
### **A reimbursement pipeline extracts a required "project_code" field from scanned expense reports. On one submission, the employee left the project code blank on the physical form, so it does not appear anywhere in the scanned image. After three retries with error feedback, the field is still empty. What should the pipeline do next?**

| 보기 | 설명 |
|------|------|
| **1. Stop the retry loop and send the record to a human reviewer, so the project code can be obtained from the submitter** | |
| 2. Keep retrying with a stricter schema and a sample project_code format, so the model returns a correctly formatted value | |
| 3. Re-render the scan at higher resolution and rerun extraction, so the model can read the project_code field more clearly | |
| 4. Switch to a larger model and resend the scan with the error history, so it can better locate the project_code on the form | |

**정답: 1.**

**해설:**

> 📘 레슨 4.4 · 검증·재시도 — Validation, retry with error feedback, and self-correcting extraction

**📝 문제 번역**

경비 정산 파이프라인이 스캔된 경비 보고서에서 필수 "project_code" 필드를 추출합니다. 한 제출 건에서 직원이 종이 양식의 프로젝트 코드 칸을 비워 두어, 스캔 이미지 어디에도 코드가 없습니다. 오류 피드백을 붙인 재시도를 세 번 했지만 필드는 여전히 비어 있습니다. 파이프라인은 다음에 무엇을 해야 할까요?

- **①** 재시도 루프를 멈추고 레코드를 사람 검토자에게 보내, 제출자에게서 프로젝트 코드를 받게 한다.
- **②** 더 엄격한 스키마와 project_code 형식 예시를 붙여 계속 재시도해, 모델이 올바른 형식의 값을 반환하게 한다.
- **③** 스캔을 더 높은 해상도로 다시 렌더링하고 추출을 다시 돌려, 모델이 project_code 필드를 더 선명하게 읽게 한다.
- **④** 더 큰 모델로 바꾸고 오류 이력과 함께 스캔을 다시 보내, 양식에서 project_code를 더 잘 찾게 한다.

> **핵심:** 값이 원문에 **없는** 실패는 재시도·스키마·해상도·모델 크기로 해결되지 않습니다. 멈추고 사람에게 넘깁니다.

1. **정답** - 재시도는 형식이나 구조의 실패에만 효과가 있습니다. 직원이 칸을 비워 두었으므로 값은 원문에 없고, 어떤 추출 시도도 그것을 만들어 낼 수 없습니다. 제출자에게서 코드를 받아 올 수 있는 사람이 필요합니다.
2. **오답** - 엄격한 스키마와 형식 예시는 잘못된 형식의 출력을 고치는 수단인데, 이 필드가 빈 이유는 양식에 값이 없기 때문입니다. 세 번의 재시도가 이미 형식 안내가 문제가 아님을 보여 줬고, 압박을 더하면 코드를 지어낼 위험만 커집니다.
3. **오답** - 해상도는 값이 있지만 읽기 어려울 때 도움이 됩니다. 칸이 비어 있으므로 선명한 이미지도 같은 빈칸을 보여 줄 뿐입니다.
4. **오답** - 큰 모델은 문서를 더 정확히 읽을 수는 있지만 페이지에 없는 값을 찾지는 못합니다. 오류 이력을 보내도 스캔은 그대로이므로, 필드가 계속 비어 있거나 모델이 코드를 지어낼 수 있습니다.

📚 근거: [Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent) · [Agent SDK: Structured outputs](https://code.claude.com/docs/en/agent-sdk/structured-outputs)

> "Claude reads the error and can retry with corrected input, ask the user for clarification, or explain the limitation."

---

## 문제 25
### **Over two months, developers have dismissed 40% of a security-review bot's findings. The team wants to know which prompt criterion to change. Which field, added to each structured finding and logged with every dismissal, makes that possible?**

| 보기 | 설명 |
|------|------|
| 1. A `dismissal_reason` enum such as false_positive or wont_fix, recorded when a developer rejects a finding | |
| 2. A model-reported `confidence` score, so low-confidence findings can be filtered out | |
| 3. A `severity` tier, so dismissal rates can be compared across critical, high and low findings | |
| **4. A `detected_pattern` field naming the code construct that triggered the finding, such as a call to the team's sanitization helper** | |

**정답: 4.**

**해설:**

> 📘 레슨 4.4 · 검증·재시도 — Validation, retry with error feedback, and self-correcting extraction

**📝 문제 번역**

두 달 동안 개발자들이 보안 리뷰 봇의 지적 중 40%를 기각했습니다. 팀은 어떤 프롬프트 기준을 바꿔야 할지 알고 싶습니다. 구조화된 지적마다 추가하고 기각될 때마다 함께 기록하면 그 분석을 가능하게 하는 필드는?

- **①** 개발자가 지적을 거부할 때 기록하는 false_positive, wont_fix 같은 `dismissal_reason` enum
- **②** 낮은 확신의 지적을 걸러 낼 수 있게 모델이 보고하는 `confidence` 점수
- **③** critical·high·low 지적 간 기각률을 비교할 수 있게 하는 `severity` 등급
- **④** 지적을 촉발한 코드 구조(예: 팀의 sanitization 헬퍼 호출)를 이름으로 기록하는 `detected_pattern` 필드

> **핵심:** 기각을 **바꿀 수 있는 기준 단위(코드 구조)** 로 묶어야 어떤 규칙을 고칠지 알 수 있습니다. 그 묶음 키가 `detected_pattern`입니다.

1. **오답** - 기각 사유는 왜 거부됐는지를 말할 뿐, 어떤 코드가 지적을 촉발했는지는 말하지 않습니다. 오탐이 많다는 것은 알아도 어디서 오는지는 알 수 없습니다.
2. **오답** - 확신 점수는 코드가 아니라 모델의 확신을 나타냅니다. sanitization 헬퍼에 대한 높은 확신의 지적도 여전히 오탐일 수 있습니다.
3. **오답** - 심각도 등급은 영향도로 묶기 때문에, 한 코드 구조에 대한 지적이 모든 등급에 흩어집니다. 추세가 드러나지 않고 오히려 퍼집니다.
4. **정답** - 지적을 촉발한 코드 구조를 이름으로 남기면 기각을 구조별로 집계할 수 있고, 리뷰 기준에서 바로 고칠 수 있는 단위가 나옵니다. 예를 들어 "sanitization 헬퍼를 거친 값은 정제된 것으로 본다"는 기준을 추가할 수 있습니다.

📚 근거: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) · [Evaluator-optimizer (cookbook)](https://platform.claude.com/cookbook/patterns-agents-evaluator-optimizer)

> "Make Claude's response auditable by having it cite quotes and sources for each of its claims."

---

## 문제 26
### **A security review assistant extracts structured findings from source code and developers frequently dismiss a large share of the findings tied to one particular helper function used for input sanitization. The team wants to analyze this dismissal trend systematically over time. What should be added to the structured finding schema to support this analysis?**

| 보기 | 설명 |
|------|------|
| **1. Add a detected_pattern field that names the code construct behind each finding, so dismissal rates can be compared per construct** | |
| 2. Add a dismissal_reason field with preset categories like false_positive or wont_fix, so dismissal rates can be compared per reason | |
| 3. Add a confidence_score field that rates how certain the model is about each finding, so dismissal rates can be compared per score band | |
| 4. Add a severity field that ranks the impact of each finding from low to critical, so dismissal rates can be compared per tier | |

**정답: 1.**

**해설:**

> 📘 레슨 4.4 · 검증·재시도 — Validation, retry with error feedback, and self-correcting extraction

**📝 문제 번역**

보안 리뷰 어시스턴트가 소스 코드에서 구조화된 지적을 추출하는데, 개발자들은 입력 sanitization에 쓰는 특정 헬퍼 함수와 관련된 지적의 상당수를 자주 기각합니다. 팀은 이 기각 추세를 시간에 따라 체계적으로 분석하고 싶습니다. 이를 지원하려면 구조화된 지적 스키마에 무엇을 추가해야 할까요?

- **①** 각 지적 뒤의 코드 구조를 이름으로 기록하는 detected_pattern 필드를 추가해, 구조별 기각률을 비교할 수 있게 한다.
- **②** false_positive나 wont_fix 같은 미리 정한 범주의 dismissal_reason 필드를 추가해, 사유별 기각률을 비교할 수 있게 한다.
- **③** 모델이 지적마다 얼마나 확신하는지 매기는 confidence_score 필드를 추가해, 점수 구간별 기각률을 비교할 수 있게 한다.
- **④** 각 지적의 영향을 low부터 critical까지 매기는 severity 필드를 추가해, 등급별 기각률을 비교할 수 있게 한다.

> **핵심:** 기각이 특정 헬퍼 함수 주변에 몰려 있으므로, **지적을 촉발한 구조를 기록하는 안정적인 그룹 키** 가 필요합니다.

1. **정답** - 각 지적이 어떤 코드 구조에서 나왔는지 기록하면 detected_pattern이 안정적인 그룹 키가 됩니다. 구조별 기각률을 시간에 따라 집계해 시끄러운 탐지 규칙을 분리해 낼 수 있습니다.
2. **오답** - 미리 정한 기각 범주는 구조화돼 있지만, 지적이 무엇에서 나왔는지가 아니라 리뷰어가 왜 거부했는지를 설명합니다. 여러 구조가 같은 범주를 공유하므로 헬퍼 함수 패턴을 분리해 추적할 수 없습니다.
3. **오답** - 확신 점수는 모델의 확신을 반영할 뿐 특정 구조와 연결돼 있지 않습니다. 점수 구간으로 묶어도 어떤 헬퍼의 지적이 거부되는지는 드러나지 않습니다.
4. **오답** - 심각도는 영향을 나타내므로 등급별로 묶으면 여러 구조의 지적이 섞입니다. 계속 거부되는 지적을 만드는 sanitization 헬퍼를 식별하지 못합니다.

📚 근거: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) · [Evaluator-optimizer (cookbook)](https://platform.claude.com/cookbook/patterns-agents-evaluator-optimizer)

---

## 문제 27
### **A nightly job submits 60,000 document-review requests in one batch. Each one embeds scanned page images, and the batch payload comes to about 400 MB. What happens, and what should the team change?**

| 보기 | 설명 |
|------|------|
| 1. It is accepted, because 60,000 is under the 100,000-request cap, which is the only per-batch limit that matters | |
| **2. It is rejected with a 413 request_too_large error because it goes over 256 MB, so the team should split the documents across at least two batches** | |
| 3. It is accepted but throttled to 1,000 requests per hour, so the team should spread the work across several nights | |
| 4. It is accepted, but its requests use up the Messages API rate limits, so the team should pause synchronous traffic while it runs | |

**정답: 2.**

**해설:**

> 📘 레슨 4.5 · 배치 처리 — Message Batches API: cost, latency, cadence and failed-request resubmission

**📝 문제 번역**

야간 작업이 문서 검토 요청 60,000건을 배치 하나로 제출합니다. 요청마다 스캔한 페이지 이미지가 들어 있어 배치 페이로드가 약 400 MB입니다. 어떻게 되고, 팀은 무엇을 바꿔야 할까요?

- **①** 받아들여진다. 60,000건은 100,000건 상한보다 적고, 배치당 의미 있는 한도는 그것뿐이다.
- **②** 256 MB를 넘으므로 413 request_too_large 오류로 거부된다. 문서를 최소 두 배치로 나눠야 한다.
- **③** 받아들여지지만 시간당 1,000건으로 제한되므로, 작업을 여러 밤에 나눠야 한다.
- **④** 받아들여지지만 요청이 Messages API 레이트 리밋을 소모하므로, 실행되는 동안 동기 트래픽을 멈춰야 한다.

> **핵심:** 배치 하나는 **요청 100,000건 또는 256 MB 중 먼저 닿는 쪽** 까지입니다. 두 상한이 동시에 적용됩니다.

1. **오답** - 요청 수 상한만 보고 크기 상한을 빠뜨렸습니다. 두 한도는 함께 적용되며, 먼저 닿는 쪽이 한도가 됩니다.
2. **정답** - 요청 수는 상한 아래지만 크기가 256 MB를 넘으므로 거부됩니다. 문서는 너무 큰 요청에 413 request_too_large 오류가 날 수 있다고 적고, 큰 데이터셋은 여러 배치로 나누라고 권합니다. 400 MB라면 최소 두 배치가 필요합니다.
3. **오답** - 배치에 시간당 처리 건수 상한 같은 것은 없습니다. 레이트 리밋은 Batches API HTTP 요청 수와 처리 대기 중인 요청 수에 별도로 걸립니다.
4. **오답** - 문서는 Batches API 사용량이 Messages API 레이트 리밋에 영향을 주지 않는다고 명시합니다. 동기 트래픽을 멈출 이유가 없습니다.

📚 근거: [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

> "A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first."

---

## 문제 28
### **Contracts arrive around the clock, and stakeholders have been promised every extraction result within 30 hours of a contract's arrival. The pipeline uses the Message Batches API. Which submission schedule keeps that promise in the worst case?**

| 보기 | 설명 |
|------|------|
| 1. Submit once a night, because most batches finish in under an hour, which leaves plenty of slack | |
| 2. Submit every 12 hours, because half a day plus a typical batch run fits well inside 30 hours | |
| 3. Submit every 8 hours, because three cycles a day keeps any document from waiting long | |
| **4. Submit every 4 hours, because a 4-hour wait plus the full 24-hour batch window still fits inside 30 hours with time to spare for overhead** | |

**정답: 4.**

**해설:**

> 📘 레슨 4.5 · 배치 처리 — Message Batches API: cost, latency, cadence and failed-request resubmission

**📝 문제 번역**

계약서가 24시간 내내 들어오고, 이해관계자에게는 계약서가 도착한 뒤 30시간 안에 모든 추출 결과를 주겠다고 약속했습니다. 파이프라인은 Message Batches API를 씁니다. 최악의 경우에도 이 약속을 지키는 제출 일정은?

- **①** 하루 한 번 밤에 제출한다. 대부분의 배치가 1시간 안에 끝나므로 여유가 충분하다.
- **②** 12시간마다 제출한다. 반나절에 일반적인 배치 실행 시간을 더해도 30시간 안에 넉넉히 들어온다.
- **③** 8시간마다 제출한다. 하루 세 번이면 어떤 문서도 오래 기다리지 않는다.
- **④** 4시간마다 제출한다. 4시간 대기에 24시간 배치 창 전체를 더해도 30시간 안에 들어오고, 오버헤드를 위한 여유까지 남는다.

> **핵심:** 최악 지연 = **제출 간격 + 배치 처리 최대 24시간**. 따라서 간격 ≤ SLA − 24h = 6시간이고, 조립·후처리 여유를 고려하면 4시간입니다.

1. **오답** - "대부분 1시간 안에 끝난다"는 경향이지 보장이 아닙니다. 제출 직후 도착한 문서는 24시간을 기다린 뒤 다시 최대 24시간 처리될 수 있어 48시간이 걸립니다.
2. **오답** - 12 + 24 = 36시간으로 30시간 SLA를 넘습니다. 일반적인 실행 시간으로 계산한 것이 오류입니다.
3. **오답** - 8 + 24 = 32시간으로 역시 SLA를 넘습니다. 제출 주기가 닫힌 직후 도착한 문서가 약속을 어기게 됩니다.
4. **정답** - 4 + 24 = 28시간으로 30시간 안에 들어오고, 남은 2시간이 배치 조립·제출·결과 처리 오버헤드를 덮습니다. 결과는 모든 요청이 끝나거나 24시간이 지나면 받을 수 있으므로 24시간을 최악값으로 잡아야 합니다.

📚 근거: [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

> "You can access batch results when all messages have completed or after 24 hours, whichever comes first."

---

## 문제 29
### **A developer is assembling a batch of translation requests and needs to assign each one an identifier that the Message Batches API will accept and later use to correlate a result with its original request. Which identifier is valid for this purpose?**

| 보기 | 설명 |
|------|------|
| **1. doc-2026-report_final, since it uses only letters, digits, hyphens, and underscores, staying under the 64-character limit** | |
| 2. doc/2026/report:final, since embedding the ingestion date and a colon-separated section label makes the request easier to trace during a later audit | |
| 3. doc 2026 report final v2, since spaces between each descriptive segment keep the identifier readable when scanning a long results file by eye | |
| 4. doc#2026#report#final#v2, since separating each descriptive segment with a distinct punctuation mark avoids any ambiguity about where one part ends | |

**정답: 1.**

**해설:**

> 📘 레슨 4.5 · 배치 처리 — Message Batches API: cost, latency, cadence and failed-request resubmission

**📝 문제 번역**

개발자가 번역 요청 배치를 구성하면서 각 요청에 식별자를 붙여야 합니다. Message Batches API가 받아들이고, 나중에 결과를 원래 요청과 연결하는 데 쓸 식별자입니다. 이 용도로 유효한 식별자는?

- **①** `doc-2026-report_final`. 영문자·숫자·하이픈·밑줄만 쓰고 64자 한도 안이다.
- **②** `doc/2026/report:final`. 수집 날짜와 콜론으로 구분한 섹션 라벨을 넣어 나중 감사 때 추적하기 쉽다.
- **③** `doc 2026 report final v2`. 각 설명 구간 사이의 공백 덕분에 긴 결과 파일을 눈으로 훑을 때 읽기 쉽다.
- **④** `doc#2026#report#final#v2`. 구간마다 뚜렷한 구두점으로 구분해 어디서 끝나는지 모호함이 없다.

> **핵심:** `custom_id`는 `^[a-zA-Z0-9_-]{1,64}$`, 즉 **영숫자·하이픈·밑줄만, 1~64자** 입니다.

1. **정답** - 이 식별자는 영숫자·하이픈·밑줄만 쓰고 64자 안이므로 패턴을 만족합니다. 가독성은 하이픈과 밑줄로 확보합니다.
2. **오답** - 슬래시와 콜론은 허용 문자가 아니어서 요청이 검증에서 거부됩니다.
3. **오답** - 공백은 아무리 읽기 쉬워도 허용 문자가 아닙니다.
4. **오답** - `#` 문자는 허용 문자 집합에 없으므로 검증에 실패합니다.

📚 근거: [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing) · [Retrieve Message Batch results](https://platform.claude.com/docs/en/api/messages/batches/results)

> "Must be 1 to 64 characters and contain only alphanumeric characters, hyphens, and underscores"

---

## 문제 30
### **A data-ingestion job needs to classify 150,000 scanned invoices in one nightly run using the Message Batches API. What must the team account for given the platform's per-batch limits?**

| 보기 | 설명 |
|------|------|
| **1. Split the 150,000 invoices across at least 2 batch submissions, because a single Message Batch is capped at 100,000 requests or 256 MB total payload, whichever comes first. (More batches may be needed if the total payload exceeds 256 MB.)** | |
| 2. Submit all 150,000 invoices in a single batch, because the Batches API has no request limit and only restricts the output size of each response. | |
| 3. Divide the invoices into batches of exactly 1,000, since this is the maximum batch size allowed by the API for any data type. | |
| 4. Use the synchronous Messages API instead of the Batches API, because batches are limited to 500 requests per hour and 150,000 invoices cannot be processed overnight. | |

**정답: 1.**

**해설:**

> 📘 레슨 4.5 · 배치 처리 — Message Batches API: cost, latency, cadence and failed-request resubmission

**📝 문제 번역**

데이터 수집 작업이 Message Batches API로 스캔한 송장 150,000건을 한 번의 야간 실행에서 분류해야 합니다. 플랫폼의 배치당 한도를 고려할 때 팀이 감안해야 할 것은?

- **①** 150,000건을 최소 2개 배치로 나눠 제출한다. Message Batch 하나는 요청 100,000건 또는 총 페이로드 256 MB 중 먼저 닿는 쪽까지이기 때문이다. (총 페이로드가 256 MB를 넘으면 배치가 더 필요할 수 있다.)
- **②** 150,000건을 배치 하나로 제출한다. Batches API에는 요청 수 한도가 없고 각 응답의 출력 크기만 제한한다.
- **③** 송장을 정확히 1,000건씩 배치로 나눈다. 데이터 유형과 무관하게 API가 허용하는 최대 배치 크기다.
- **④** Batches API 대신 동기 Messages API를 쓴다. 배치는 시간당 500건으로 제한되어 150,000건을 밤새 처리할 수 없다.

> **핵심:** 요청 수 상한(100,000건)과 크기 상한(256 MB)을 **모두** 계산합니다. 150,000건은 요청 수만으로도 최소 2개 배치입니다.

1. **정답** - 배치 하나에는 요청 100,000건 또는 256 MB 중 먼저 닿는 쪽까지 들어갑니다. 150,000 ÷ 100,000 = 1.5이므로 최소 2개 배치가 필요하고, 스캔 이미지로 어느 배치의 페이로드가 256 MB를 넘으면 더 나눠야 합니다.
2. **오답** - Batches API에는 요청 100,000건과 256 MB라는 명시적 한도가 있습니다. 150,000건을 한 배치에 넣으면 요청 수 한도를 넘습니다.
3. **오답** - 최대 크기는 1,000건이 아니라 100,000건입니다. 작은 배치로 나누면 관리와 복구가 쉬워질 수는 있지만 플랫폼의 최대치는 아닙니다.
4. **오답** - 시간당 500건 같은 제한은 없습니다. 배치 하나에 100,000건까지 넣을 수 있고 처리는 최대 24시간 안에 끝나거나 만료됩니다. 대량 분류에 동기 API를 쓰면 50% 할인을 버리게 됩니다.

📚 근거: [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

> "Consider breaking very large datasets into multiple batches for better manageability."

---

## 문제 31
### **Four teams want to move their Claude workloads to the Message Batches API to get the 50% discount. Which workload should stay on the synchronous Messages API?**

| 보기 | 설명 |
|------|------|
| 1. A weekly compliance audit that summarizes the past week's access logs for a Monday review meeting | |
| 2. Nightly regression-test generation for 40,000 modules, which engineers review the next morning | |
| **3. An in-app support assistant that drafts a reply while the customer waits in the chat window** | |
| 4. An overnight report that groups the day's support tickets by theme for the product team | |

**정답: 3.**

**해설:**

> 📘 레슨 4.5 · 배치 처리 — Message Batches API: cost, latency, cadence and failed-request resubmission

**📝 문제 번역**

네 팀이 50% 할인을 받으려고 Claude 작업을 Message Batches API로 옮기려 합니다. 다음 중 동기 Messages API에 남아야 하는 작업은?

- **①** 월요일 리뷰 회의용으로 지난주 접근 로그를 요약하는 주간 컴플라이언스 감사
- **②** 엔지니어가 다음 날 아침 검토하는, 40,000개 모듈의 야간 회귀 테스트 생성
- **③** 고객이 채팅 창에서 기다리는 동안 답장 초안을 쓰는 앱 내 지원 어시스턴트
- **④** 그날의 지원 티켓을 주제별로 묶어 제품팀에 주는 야간 리포트

> **핵심:** 판단 질문은 하나입니다. **결과를 기다리며 멈춰 있는 사람이 있는가?** 배치의 24시간은 만료 시한이지 지연 SLA가 아닙니다.

1. **오답** - 주간 감사는 월요일 회의 전에만 끝나면 되므로 아무도 실시간으로 기다리지 않습니다. 배치로 할인을 받기 좋은 작업입니다.
2. **오답** - 야간 테스트 생성은 다음 날 아침에 검토하므로 지연을 견딥니다. 대량·비긴급이라 배치에 딱 맞습니다.
3. **정답** - 채팅 창의 고객은 응답을 기다리며 막혀 있습니다. 배치는 24시간 안에 완료되거나 만료된다는 것만 약속하고 지연 시간은 보장하지 않으므로, 사용자 대면 작업은 동기 경로에 둡니다.
4. **오답** - 야간 리포트는 다음 날 제품팀이 보면 되므로 아무도 막지 않습니다. 배치로 할인을 받을 수 있습니다.

📚 근거: [Cost optimization (cookbook)](https://platform.claude.com/cookbook/cost-optimization-cost-optimization) · [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

> "that window is an expiry, not an SLA, so keep anything user-facing or deadline-bound on the synchronous path."

---

## 문제 32
### **A platform team runs an automated code-review gate that blocks a pull request from merging until Claude returns a verdict on the diff, typically within a few seconds. Which approach should they use for this workflow?**

| 보기 | 설명 |
|------|------|
| **1. Call the Messages API synchronously for each diff, and have the merge check read the verdict directly from the API response** | |
| 2. Submit each diff as a one-request batch to the Message Batches API, and have the merge check poll until the verdict is ready | |
| 3. Send each diff to the Message Batches API at the 50% discount, and have the merge check poll the batch until it has ended | |
| 4. Send each diff to the Messages API from a background job queue, and have the merge check pass while the verdict posts as a comment | |

**정답: 1.**

**해설:**

> 📘 레슨 4.5 · 배치 처리 — Message Batches API: cost, latency, cadence and failed-request resubmission

**📝 문제 번역**

플랫폼 팀이 Claude가 diff에 대한 판정을 돌려줄 때까지 PR 머지를 막는 자동 코드 리뷰 게이트를 운영합니다. 판정은 보통 몇 초 안에 나옵니다. 이 워크플로에는 어떤 방식을 써야 할까요?

- **①** diff마다 Messages API를 동기 호출하고, 머지 체크가 API 응답에서 판정을 바로 읽는다.
- **②** diff마다 요청 하나짜리 배치로 Message Batches API에 제출하고, 머지 체크가 판정이 준비될 때까지 폴링한다.
- **③** 50% 할인으로 diff를 Message Batches API에 보내고, 머지 체크가 배치가 끝날 때까지 폴링한다.
- **④** 백그라운드 작업 큐에서 diff를 Messages API로 보내고, 판정이 코멘트로 올라오는 동안 머지 체크는 통과시킨다.

> **핵심:** 머지를 막는 **블로킹 게이트** 는 동기 API로 판정을 같은 요청 안에서 받아야 합니다. 배치는 완료 시간을 보장하지 않고, 판정 없이 통과시키면 게이트가 사라집니다.

1. **정답** - 머지는 몇 초 안에 판정이 올 때까지 막혀 있고, 동기 Messages API 호출은 같은 요청에서 결과를 돌려줍니다. Message Batches API는 처리 시간이 보장되지 않고 최대 24시간까지 걸릴 수 있습니다.
2. **오답** - 요청 하나짜리 배치도 여전히 비동기로 처리되고 완료 시간이 보장되지 않습니다. PR이 몇 초가 아니라 몇 시간 동안 막힐 수 있습니다.
3. **오답** - 50% 할인은 비동기 처리와 보장 없는 완료 시간(최대 24시간)의 대가입니다. 몇 초 안에 판정이 필요한 게이트는 배치 종료를 기다릴 수 없습니다.
4. **오답** - API 선택은 맞지만, 판정이 나오기 전에 머지 체크를 통과시키면 게이트가 강제하려던 리뷰에 더 이상 의존하지 않게 됩니다. 워크플로는 판정이 올 때까지 PR을 막아야 합니다.

📚 근거: [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing) · [Cost optimization (cookbook)](https://platform.claude.com/cookbook/cost-optimization-cost-optimization)

> "Batches may take up to 24 hours for processing, but many finish sooner."

---

## 문제 33
### **An insurer's claims agent calls the company's own policy-database lookup tool, reads what comes back, and then decides on its next step, often over several turns. To get the 50% discount, the team wants to move the pipeline to the Message Batches API. What is the right design?**

| 보기 | 설명 |
|------|------|
| 1. Batch the whole agent. Include the lookup tool's definition in each request, and the batch worker will run the tool between turns until the agent reaches end_turn | |
| 2. Batch the whole agent, but remove the tool definitions first, because batch requests reject any request that includes tools | |
| **3. Keep the tool-calling agent on the synchronous Messages API, and batch only the single-pass triage step that decides which claims need the agent** | |
| 4. Batch the whole agent with stream: true, so the client can catch each tool_use block and send back a tool_result while the request is still running | |

**정답: 3.**

**해설:**

> 📘 레슨 4.5 · 배치 처리 — Message Batches API: cost, latency, cadence and failed-request resubmission

**📝 문제 번역**

보험사의 청구 에이전트가 회사 자체 보험 DB 조회 도구를 호출하고, 결과를 읽은 뒤 다음 단계를 정하는 일을 여러 턴에 걸쳐 반복합니다. 팀은 50% 할인을 위해 파이프라인을 Message Batches API로 옮기려 합니다. 올바른 설계는?

- **①** 에이전트 전체를 배치한다. 요청마다 조회 도구 정의를 넣으면 배치 워커가 턴 사이에 도구를 실행하며 end_turn까지 진행한다.
- **②** 에이전트 전체를 배치하되 도구 정의를 먼저 지운다. 배치 요청은 도구가 포함된 요청을 모두 거부하기 때문이다.
- **③** 도구를 호출하는 에이전트는 동기 Messages API에 두고, 어떤 청구에 에이전트가 필요한지 정하는 단일 패스 분류 단계만 배치한다.
- **④** `stream: true`로 에이전트 전체를 배치해, 요청이 실행되는 동안 클라이언트가 tool_use 블록을 잡아 tool_result를 돌려보낸다.

> **핵심:** 배치 요청은 **single-shot** 입니다. 요청 도중 우리 코드가 클라이언트 도구를 실행해 tool_result를 넣어 줄 통로가 없으므로, 다회 클라이언트 도구 루프는 동기 경로에 남깁니다.

1. **오답** - 배치 워커는 서버 도구(web search 등)의 서버 측 루프는 돌리지만, 회사 DB 조회 같은 클라이언트 도구는 실행하지 못합니다. 요청은 `tool_use`에서 멈춘 결과로 돌아오고, 이어 가려면 새 요청을 보내야 합니다.
2. **오답** - 배치 요청에도 도구 정의를 넣을 수 있습니다. 도구 정의가 거부되는 것이 아니라, 요청 도중 클라이언트 도구를 실행할 수 없을 뿐입니다.
3. **정답** - 한 번의 프롬프트로 한 번의 답이 나오는 분류 단계는 배치로 할인을 받고, 턴마다 도구 결과가 필요한 에이전트 루프는 동기 API에 둡니다. Anthropic 비용 최적화 쿡북이 제시하는 구성과 같습니다.
4. **오답** - 배치 요청에서 `stream: true`는 지원되지 않아 검증 오류가 납니다. 배치 결과는 스트림이 아니라 파일 하나로 돌아옵니다.

📚 근거: [Cost optimization (cookbook)](https://platform.claude.com/cookbook/cost-optimization-cost-optimization) · [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

> "Batch requests are single-shot (no mid-batch tool loop), so the natural fit for our agent is the initial classification pass"

---

## 문제 34
### **A team wants a review step that catches the subtle bugs its code-generation agent keeps missing. Which setup gives them a review that is actually independent?**

| 보기 | 설명 |
|------|------|
| 1. Add "challenge every design decision you made earlier" to the generating session's final prompt before it submits | |
| 2. Resume the subagent session that wrote the code and ask it to review its own diff | |
| **3. Start a new instance with the same model and tools, and give it only the code and the requirements** | |
| 4. Keep the same conversation but switch to a larger model for a second review round | |

**정답: 3.**

**해설:**

> 📘 레슨 4.6 · 다중 패스 리뷰 — Independent reviewers and multi-pass code review

**📝 문제 번역**

한 팀이 코드 생성 에이전트가 계속 놓치는 미묘한 버그를 잡을 리뷰 단계를 원합니다. 실제로 독립적인 리뷰가 되는 구성은?

- **①** 생성 세션이 제출하기 전 마지막 프롬프트에 "앞서 내린 모든 설계 결정에 이의를 제기하라"를 추가한다.
- **②** 코드를 작성한 subagent 세션을 재개해 자기 diff를 리뷰하게 한다.
- **③** 같은 모델과 도구로 새 인스턴스를 시작하고, 코드와 요구사항만 준다.
- **④** 같은 대화를 유지하되 두 번째 리뷰 라운드에서 더 큰 모델로 바꾼다.

> **핵심:** 리뷰의 독립성은 다른 모델이 아니라 **작성자의 추론이 없는 깨끗한 컨텍스트** 에서 나옵니다.

1. **오답** - 같은 세션에서 자기 결정에 이의를 제기하라고 해도, 그 결정을 정당화한 추론이 컨텍스트에 그대로 남아 있습니다. 작성자가 자기 근거를 보면서 자신과 논쟁하는 셈입니다.
2. **오답** - 재개한 세션은 이전 결론과 맥락을 모두 가져옵니다. subagent라는 형식이 아니라 작성 컨텍스트를 이어받는다는 점이 독립성을 없앱니다.
3. **정답** - 새 인스턴스는 코드와 요구사항만 보고, 작성자가 왜 그렇게 했는지 모릅니다. Managed Agents의 outcome grader도 작성자와 같은 모델·도구를 쓰되 컨텍스트만 새로 시작해 독립성을 얻습니다.
4. **오답** - 모델을 키워도 같은 대화라면 작성 추론이 그대로 보입니다. 리뷰어는 의심해야 할 추론을 다시 사용하게 됩니다.

📚 근거: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) · [Verify with outcome grader (cookbook)](https://platform.claude.com/cookbook/managed-agents-cma-verify-with-outcome-grader)

> "has a fresh model try to refute the result, so the agent doing the work isn’t the one grading it"

---

## 문제 35
### **A team built a pipeline where the same Claude instance that generates code is then asked, within the same conversation, to 'review your own work for bugs before finishing.' QA later finds subtle issues the model missed during that self-review step. Which architectural change is most effective at catching those issues going forward?**

| 보기 | 설명 |
|------|------|
| 1. Raise the extended thinking budget for the review step, so the model reasons longer over the code it just wrote | |
| 2. Tighten the review step's system prompt, instructing the model to challenge the design decisions it made earlier | |
| **3. Send the finished code to a separate Claude instance for review, one that never saw the generation session** | |
| 4. Run the review step a second time in the same session, asking the model to recheck its first review's conclusions | |

**정답: 3.**

**해설:**

> 📘 레슨 4.6 · 다중 패스 리뷰 — Independent reviewers and multi-pass code review

**📝 문제 번역**

같은 Claude 인스턴스가 코드를 생성한 뒤, 같은 대화 안에서 "끝내기 전에 자기 작업에 버그가 있는지 리뷰하라"는 요청을 받는 파이프라인이 있습니다. 나중에 QA가 그 자기 리뷰 단계에서 모델이 놓친 미묘한 문제들을 찾아냈습니다. 앞으로 이런 문제를 잡는 데 가장 효과적인 아키텍처 변경은?

- **①** 리뷰 단계의 extended thinking 예산을 올려, 모델이 방금 쓴 코드에 대해 더 오래 추론하게 한다.
- **②** 리뷰 단계의 시스템 프롬프트를 강화해, 앞서 내린 설계 결정에 이의를 제기하라고 지시한다.
- **③** 완성된 코드를 생성 세션을 본 적 없는 별도의 Claude 인스턴스에 보내 리뷰한다.
- **④** 같은 세션에서 리뷰 단계를 한 번 더 돌려, 첫 리뷰의 결론을 다시 확인하게 한다.

> **핵심:** 같은 컨텍스트 안에서 생각을 더 하거나 말투를 세게 해도 **작성 추론은 지워지지 않습니다.** 생성 세션을 보지 않은 별도 인스턴스가 필요합니다.

1. **오답** - extended thinking은 실제 설정이지만, 늘어난 추론도 코드를 만든 대화 안에서 돌아갑니다. 같은 초기 결정 위에 쌓이므로 미묘한 문제는 계속 숨겨지고 QA가 계속 찾게 됩니다.
2. **오답** - 강한 지시는 모델에게 요구하는 행동만 바꿀 뿐, 원래 코드를 정당화한 추론은 세션에 남아 있습니다. 모델은 이전 선택에 고정되고, 그 고정이 리뷰가 놓친 원인입니다.
3. **정답** - 완성된 코드만 받는 별도 인스턴스는 생성자의 추론을 기억하지 않으므로 그 결정에 고정되지 않습니다. 코드를 처음부터 살펴보므로 QA가 찾은 미묘한 문제를 잡을 가능성이 높습니다.
4. **오답** - 같은 세션의 두 번째 패스는 생성 추론과 첫 리뷰의 결론까지 봅니다. 결론에 이의를 제기하기보다 확인하는 경향이 있어 사각지대가 그대로 남습니다.

📚 근거: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) · [Verify with outcome grader (cookbook)](https://platform.claude.com/cookbook/managed-agents-cma-verify-with-outcome-grader)

> "The grader can't see the writer's reasoning and has no idea what shortcuts were taken."

---

## 문제 36
### **An engineer configures the generation session with a high extended thinking effort and instructs the model to reflect deeply on flaws before submitting its code. Bugs still slip through review. Why is extended thinking insufficient as a substitute for an independent review instance here?**

| 보기 | 설명 |
|------|------|
| 1. Reflection raises the reasoning budget but applies the same depth of checking to each issue, so extra effort adds little scrutiny | |
| **2. Reflection runs in the same context that wrote the code, so the model reuses the reasoning behind its earlier decisions when it checks them** | |
| 3. Reflection is limited by a thinking-token budget that is exhausted before the model can re-examine the full body of generated code | |
| 4. Reflection runs with tool use switched off, so the model cannot reopen the files it wrote to verify them against the requirements | |

**정답: 2.**

**해설:**

> 📘 레슨 4.6 · 다중 패스 리뷰 — Independent reviewers and multi-pass code review

**📝 문제 번역**

엔지니어가 생성 세션에 높은 extended thinking effort를 설정하고, 코드를 제출하기 전에 결함을 깊이 성찰하라고 지시했습니다. 그런데도 버그가 리뷰를 빠져나갑니다. 여기서 extended thinking이 독립 리뷰 인스턴스를 대신하기에 부족한 이유는?

- **①** 성찰은 추론 예산을 늘리지만 이슈마다 같은 깊이의 검사를 적용하므로, 노력을 더해도 검토가 크게 늘지 않는다.
- **②** 성찰은 코드를 쓴 바로 그 컨텍스트에서 이뤄지므로, 모델이 이전 결정을 점검할 때 그 결정의 근거였던 추론을 다시 사용한다.
- **③** 성찰은 사고 토큰 예산의 제약을 받는데, 모델이 생성된 코드 전체를 다시 살펴보기 전에 예산이 바닥난다.
- **④** 성찰 중에는 도구 사용이 꺼지므로, 모델이 자기가 쓴 파일을 다시 열어 요구사항과 대조할 수 없다.

> **핵심:** 문제는 검토의 양이 아니라 **검토가 이뤄지는 자리(같은 컨텍스트)** 입니다. 작성자의 추론을 보지 않는 리뷰어만 그 편향을 피합니다.

1. **오답** - 더 높은 thinking effort는 각 이슈를 더 깊이 추론하게 해 줍니다. 약점은 이슈당 정해진 검사량이 아니라, 검사가 어디서 이뤄지느냐입니다.
2. **정답** - 생성 세션 안의 성찰은 원래 결정을 정당화한 추론을 그대로 이어받습니다. 그래서 모델은 그 결정을 확인하는 쪽으로 기울고, 그런 맥락이 없는 새 리뷰어는 이 편향을 피합니다.
3. **오답** - effort와 예산은 올릴 수 있고, 이 구성은 이미 높은 설정을 쓰고 있습니다. 예산이 충분해도 성찰은 코드를 만든 컨텍스트에서 돌아가므로 같은 편향을 물려받습니다.
4. **오답** - extended thinking이 도구 사용을 끄지는 않으며, 모델은 자기가 쓴 파일을 여전히 읽을 수 있습니다. 버그가 남는 이유는 파일 접근이 아니라 리뷰어가 작성자의 추론 맥락을 공유하기 때문입니다.

📚 근거: [Verify with outcome grader (cookbook)](https://platform.claude.com/cookbook/managed-agents-cma-verify-with-outcome-grader) · [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

> "After each writer turn the platform spins up a fresh grader with the same model and tools as the writer"

---

## 문제 37
### **A refactor touches 300 files, and several modules pass data to one another. You need a review that catches local bugs and also bugs where a value is misused after it crosses a file boundary. Which plan fits?**

| 보기 | 설명 |
|------|------|
| 1. Run the per-file passes as successive turns in one conversation, so later passes can draw on what earlier files showed | |
| **2. Script one headless `claude -p` review per file, each in a fresh context, then run integration passes that read the files sharing data together** | |
| 3. Send the whole diff to a single review with a larger model so it can see every file and every data flow at once | |
| 4. Script one fresh per-file pass for every file and skip integration passes, since each file has already had full attention | |

**정답: 2.**

**해설:**

> 📘 레슨 4.6 · 다중 패스 리뷰 — Independent reviewers and multi-pass code review

**📝 문제 번역**

리팩터링이 300개 파일을 건드렸고, 여러 모듈이 서로 데이터를 주고받습니다. 파일 내부의 버그와, 값이 파일 경계를 넘은 뒤 잘못 쓰이는 버그를 모두 잡는 리뷰가 필요합니다. 어떤 계획이 맞을까요?

- **①** 파일별 패스를 한 대화의 연속된 턴으로 돌려, 뒤의 패스가 앞 파일에서 알게 된 것을 활용하게 한다.
- **②** 파일마다 새 컨텍스트에서 headless `claude -p` 리뷰를 하나씩 스크립트로 돌린 뒤, 데이터를 공유하는 파일들을 함께 읽는 통합 패스를 실행한다.
- **③** 더 큰 모델로 전체 diff를 한 번에 리뷰해, 모든 파일과 데이터 흐름을 동시에 보게 한다.
- **④** 모든 파일에 대해 새 파일별 패스를 스크립트로 돌리고, 각 파일이 이미 충분한 주의를 받았으니 통합 패스는 생략한다.

> **핵심:** **새 컨텍스트의 파일별 로컬 패스** 로 깊이를, **파일 간 통합 패스** 로 데이터 흐름을 확보합니다. 한 컨텍스트에 모두 넣으면 주의가 흩어집니다.

1. **오답** - 한 대화에서 턴을 이어 가면 그 대화에 모든 파일이 쌓여, 컨텍스트가 길어질수록 주의가 흐려지는 문제가 다시 생깁니다. 파일마다 새 컨텍스트를 써야 합니다.
2. **정답** - 파일마다 새 컨텍스트의 `claude -p`를 스크립트로 돌리면 각 패스가 자기 파일에 온전히 집중합니다. 그 뒤 데이터를 공유하는 파일을 함께 읽는 통합 패스가 로컬 패스로는 보이지 않는 파일 간 데이터 흐름 버그를 잡습니다.
3. **오답** - 300개 파일을 한 리뷰에 넣으면 주의가 희석됩니다. 컨텍스트 엔지니어링 글이 설명하듯 토큰이 늘수록 컨텍스트에서 정보를 정확히 떠올리는 능력이 떨어지고, 모델 크기가 이 구조적 문제를 없애지 않습니다.
4. **오답** - 파일별 패스만으로는 한 파일에서 나가 다른 파일에서 잘못 쓰이는 값을 볼 수 없습니다. 통합 패스를 빼면 문제의 두 번째 요구를 충족하지 못합니다.

📚 근거: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

> "as the number of tokens in the context window increases, the model’s ability to accurately recall information from that context decreases"

---

## 문제 38
### **Per-file passes on two interdependent files each recommend a different fix for what turns out to be the same underlying data-flow issue, and the two recommendations conflict. What architectural step should resolve this rather than picking one per-file recommendation at random?**

| 보기 | 설명 |
|------|------|
| **1. A separate cross-file integration pass that examines both files together and produces one recommendation based on the actual data flow** | |
| 2. Re-running each per-file pass a second time and keeping whichever recommendation is worded with higher confidence language | |
| 3. Merging the two files into one before review so a single per-file pass can cover both without needing an integration step | |
| 4. Asking the original generator to arbitrate between the two recommendations, since it has full context on why it wrote the code that way | |

**정답: 1.**

**해설:**

> 📘 레슨 4.6 · 다중 패스 리뷰 — Independent reviewers and multi-pass code review

**📝 문제 번역**

서로 의존하는 두 파일에 대한 파일별 패스가 각각 다른 수정안을 냈는데, 알고 보니 같은 데이터 흐름 문제였고 두 수정안은 서로 충돌합니다. 파일별 수정안 중 하나를 임의로 고르는 대신 이를 해결할 아키텍처 단계는?

- **①** 두 파일을 함께 살펴보고 실제 데이터 흐름에 근거해 하나의 수정안을 내는 별도의 파일 간 통합 패스
- **②** 각 파일별 패스를 한 번 더 돌리고, 더 확신에 찬 표현으로 쓰인 수정안을 채택한다.
- **③** 리뷰 전에 두 파일을 하나로 합쳐, 통합 단계 없이 파일별 패스 하나가 둘을 다 보게 한다.
- **④** 코드를 왜 그렇게 썼는지 전체 맥락을 아는 원래 생성자에게 두 수정안 사이를 중재하게 한다.

> **핵심:** 파일별 패스 간의 **모순된 지적은 통합 패스가 없다는 신호** 입니다. 각 로컬 패스는 데이터 흐름의 절반만 봤으므로, 두 파일을 함께 읽는 패스가 결론을 내야 합니다.

1. **정답** - 파일 간 통합 패스는 서로 의존하는 파일 사이의 데이터 흐름을 함께 살펴보도록 설계된 단계라, 이런 충돌을 해소하는 데 맞습니다. 두 로컬 패스가 각자 본 절반을 합쳐 실제 흐름에 근거한 하나의 수정안을 냅니다.
2. **오답** - 확신에 찬 표현은 어느 수정안이 실제 파일 간 데이터 흐름을 반영하는지 알려 주지 않습니다. 같은 좁은 시야로 다시 돌려도 결과는 같습니다.
3. **오답** - 파일을 합치는 것은 설계된 메커니즘이 아니고 일반화되지 않습니다. 리뷰 대상 파일 구조를 바꾸는 대신 전용 통합 패스를 두는 것이 의도된 해법이며, 합치면 패스를 나눠서 피하려던 주의 분산이 돌아옵니다.
4. **오답** - 원래 생성자에게 중재를 맡기면 독립 리뷰가 피하려던 작성 추론의 편향이 다시 들어옵니다.

📚 근거: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

> "LLMs generally perform better when each consideration is handled by a separate LLM call, allowing focused attention on each specific aspect."

---
