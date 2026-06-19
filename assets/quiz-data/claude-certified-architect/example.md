## 문제 1
### **You're creating a custom `/explore-alternatives` skill that your team uses to brainstorm and evaluate different implementation approaches before committing to one. However, developers report that after running this skill, Claude's subsequent responses are influenced by the exploration discussion—sometimes referencing abandoned approaches or maintaining exploratory context that confuses actual implementation work. What's the most effective way to configure this skill?**

| 보기 | 설명 |
|------|------|
| 1. Split the skill into two separate skills—`/explore-start` and `/explore-end`—to demarcate when exploration context should be discarded. | |
| 2. Create the skill in `~/.claude/skills/` instead of `.claude/skills/`. | |
| 3. Use the `!` prefix in the skill to execute the exploration logic as a bash subprocess. | |
| **4. Add `context: fork` to the skill's frontmatter.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

팀이 구현 방식을 확정하기 전에 여러 접근법을 브레인스토밍·평가하는 `/explore-alternatives` 스킬을 만들고 있습니다. 그런데 개발자들이 이 스킬을 실행한 *뒤* Claude의 후속 응답이 탐색 논의에 영향을 받는다고 보고합니다 — 폐기된 접근법을 다시 언급하거나, 탐색용 맥락을 계속 유지해서 실제 구현 작업을 혼란스럽게 만듭니다. 이 스킬을 구성하는 **가장 효과적인** 방법은 무엇입니까?

- **①** 스킬을 `/explore-start`·`/explore-end` 두 개로 쪼개 탐색 맥락을 버릴 시점을 표시한다
- **②** `.claude/skills/` 대신 `~/.claude/skills/` 에 스킬을 만든다
- **③** 스킬에서 `!` 접두사를 써서 탐색 로직을 bash 서브프로세스로 실행한다
- **④** 스킬의 frontmatter에 `context: fork` 를 추가한다

> **핵심 진단:** 문제의 본질은 **탐색용 대화가 메인 대화 기록(context window)에 그대로 누적**된다는 점입니다. 대화 기록은 *추가만 될 뿐(additive)* 중간에서 임의로 지울 수 없으므로, 해법은 탐색 작업을 **격리된 서브에이전트 컨텍스트**에서 돌려 메인 대화를 오염시키지 않는 것입니다. 그것이 `context: fork` 입니다.

```yaml
---
name: explore-alternatives
context: fork   # ← 격리된 sub-agent 컨텍스트에서 실행, 결과 요약만 반환
---
```

1. **오답** - 스킬을 시작/종료 두 개로 쪼개도 **대화 도중 맥락을 제거하는 메커니즘 자체가 없습니다**. 대화 기록은 추가만 되므로, 스킬을 둘로 나눈다고 해서 앞서 쌓인 탐색 논의가 컨텍스트에서 사라지지 않습니다.
2. **오답** - `~/.claude/skills/`(개인 스킬)에 두는 것은 **스킬의 적용 범위(개인 vs 프로젝트)** 를 바꿀 뿐, 실행 후 탐색 맥락이 메인 대화에 남는 문제와는 무관합니다.
3. **오답** - `!` 접두사는 bash 명령을 실행할 뿐이며, 그 출력은 오히려 메인 컨텍스트로 다시 들어옵니다. 컨텍스트 오염을 막아주지 못합니다.
4. **정답** - `context: fork` frontmatter 옵션은 스킬을 **격리된 sub-agent 컨텍스트**에서 실행시켜, 탐색 논의가 메인 대화 기록을 오염시키지 않게 합니다. 따라서 폐기된 접근법이나 탐색용 맥락이 이후 구현 작업에 영향을 주지 않습니다.

---

## 문제 2
### **Your team has created a `/migration` skill that generates database migration files. The skill accepts a migration name via `$ARGUMENTS`. In production, you're seeing three issues: (1) developers often invoke the skill without arguments, resulting in poorly-named files, (2) the skill sometimes incorporates database schema details from unrelated earlier conversations, and (3) a developer accidentally triggered destructive test cleanup when the skill had broad tool access. Which configuration approach addresses all three issues?**

| 보기 | 설명 |
|------|------|
| **1. Add `argument-hint` frontmatter to prompt for required parameters, use `context: fork` to isolate execution, and restrict `allowed-tools` to file write operations.** | |
| 2. Use positional parameters `$1` and `$2` instead of `$ARGUMENTS`, include explicit schema file references via `@` syntax, and add `description` frontmatter warning about destructive operations. | |
| 3. Include validation instructions in the skill's SKILL.md to verify `$ARGUMENTS`, add prompts to ignore prior conversation context, and list forbidden operations Claude should avoid. | |
| 4. Split into separate `/migration-create` and `/migration-apply` skills, add instructions to request a name if not provided, and use different `allowed-tools` scopes for each. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

팀이 DB 마이그레이션 파일을 생성하는 `/migration` 스킬을 만들었고, 이 스킬은 `$ARGUMENTS` 로 마이그레이션 이름을 받습니다. 운영에서 세 가지 문제가 보입니다: (1) 개발자들이 인자 없이 스킬을 자주 호출해 파일 이름이 엉망이고, (2) 스킬이 *무관한 과거 대화* 의 스키마 세부정보를 끌어다 쓰며, (3) 스킬에 광범위한 도구 접근권이 있어 한 개발자가 **파괴적인 테스트 정리 작업을 실수로 트리거**했습니다. 세 문제를 *모두* 해결하는 구성 방식은?

- **①** `argument-hint` frontmatter로 필요한 파라미터를 안내하고, `context: fork` 로 실행을 격리하며, `allowed-tools` 를 파일 쓰기 작업으로 제한한다
- **②** `$ARGUMENTS` 대신 위치 파라미터 `$1`·`$2` 사용, `@` 문법으로 스키마 파일 명시 참조, `description` frontmatter에 파괴적 작업 경고 추가
- **③** SKILL.md에 `$ARGUMENTS` 검증 지침, 이전 대화 무시 프롬프트, 금지 작업 목록을 넣는다
- **④** `/migration-create`·`/migration-apply` 로 분리하고, 이름이 없으면 요청하도록 지침을 넣고, 각각 다른 `allowed-tools` 범위를 준다

> **핵심 진단:** 세 문제는 각각 **세 가지 스킬 구성 기능**에 1:1로 대응됩니다. *선언적(frontmatter) 구성* 이 *프롬프트 지침(soft instruction)* 보다 안정적으로 강제됩니다.

| 문제 | 해결 기능 |
|------|-----------|
| 인자 누락 → 잘못된 이름 | `argument-hint` (자동완성 시 기대 파라미터 표시) |
| 과거 대화 맥락 오염 | `context: fork` (대화 기록과 분리된 서브에이전트 실행) |
| 광범위 도구 → 파괴적 작업 | `allowed-tools` (파일 쓰기로만 제한 = 최소 권한) |

1. **정답** - 세 가지 문제를 각기 다른 스킬 기능으로 정확히 해결합니다: `argument-hint` 가 자동완성 시 기대 파라미터를 보여주고(인자 누락 해결), `context: fork` 가 대화 기록과 분리된 서브에이전트에서 실행하며(맥락 오염 방지), `allowed-tools` 가 파일 쓰기로만 도구를 제한합니다(파괴적 작업 차단).
2. **오답** - 위치 파라미터·`@` 참조·`description` 경고는 *일부* 만 다룹니다. 특히 `description` 의 "경고 문구"는 **강제력이 없는 안내**일 뿐이라, 광범위한 도구 접근으로 인한 파괴적 작업을 실제로 막지 못합니다.
3. **오답** - "이전 대화를 무시하라", "금지 작업을 피하라" 같은 **프롬프트 지침은 LLM이 무시하거나 잘못 해석할 수 있어** 신뢰할 수 없는 방어책입니다. 컨텍스트 격리와 도구 제한은 구성 수준에서 강제해야 합니다.
4. **오답** - 스킬을 둘로 나누는 것은 인자/도구 범위 일부에 도움이 될 수 있으나, **과거 대화 맥락 오염 문제를 해결하지 못합니다**(`context: fork` 부재). 세 문제를 모두 다루지 못합니다.

---

## 문제 3
### **You want to create a custom `/review` slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?**

| 보기 | 설명 |
|------|------|
| 1. In a `.claude/config.json` file with a `commands` array | |
| 2. In `~/.claude/commands/` in each developer's home directory | |
| 3. In the `CLAUDE.md` file at the project root | |
| **4. In the `.claude/commands/` directory in the project repository** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

팀의 표준 코드 리뷰 체크리스트를 실행하는 커스텀 `/review` 슬래시 커맨드를 만들려고 합니다. 이 커맨드는 **리포지토리를 clone/pull 하는 모든 개발자에게** 제공되어야 합니다. 이 커맨드 파일을 어디에 만들어야 합니까?

- **①** `.claude/config.json` 의 `commands` 배열
- **②** 각 개발자 홈 디렉터리의 `~/.claude/commands/`
- **③** 프로젝트 루트의 `CLAUDE.md`
- **④** 프로젝트 리포지토리의 `.claude/commands/` 디렉터리

> **핵심 진단:** "모든 개발자가 자동으로 받는다" = **버전 관리(git)에 포함되는 프로젝트 범위** 여야 합니다. 슬래시 커맨드는 전용 파일(`.claude/commands/*.md`)로 정의되며, 프로젝트 디렉터리에 두면 리포와 함께 배포됩니다.

| 위치 | 범위 | git 공유 |
|------|------|----------|
| `.claude/commands/` (프로젝트) | 프로젝트 | ✅ clone/pull 시 자동 |
| `~/.claude/commands/` (홈) | 개인 | ❌ 개인 PC에만 존재 |

1. **오답** - `.claude/config.json` 의 `commands` 배열로 슬래시 커맨드를 정의하는 방식은 존재하지 않습니다. 커맨드는 `.claude/commands/` 안의 개별 `.md` 파일로 정의합니다.
2. **오답** - `~/.claude/commands/`(개인 홈)에 두면 **그 개발자에게만** 적용되고 git으로 공유되지 않으므로, 다른 팀원은 clone/pull 해도 커맨드를 받지 못합니다.
3. **오답** - `CLAUDE.md` 는 프로젝트 지침·컨벤션·맥락을 제공하는 파일이지, **슬래시 커맨드를 정의하는 곳이 아닙니다**. 커맨드는 별도 전용 파일이 필요합니다.
4. **정답** - 프로젝트 리포지토리의 `.claude/commands/` 디렉터리에 두면 **버전 관리되어** clone/pull 하는 모든 개발자에게 자동으로 제공됩니다. 프로젝트 범위 커스텀 커맨드의 표준 위치입니다.

---

## 문제 4
### **Your team created an `/analyze-codebase` skill that performs comprehensive code analysis—dependency scanning, test coverage calculation, and code quality metrics. After running this command, team members report that Claude becomes less responsive in the session and loses track of their original task. What's the most effective way to address this while preserving full analysis capability?**

| 보기 | 설명 |
|------|------|
| **1. Add `context: fork` to the skill's frontmatter to run the analysis in an isolated sub-agent context** | |
| 2. Add instructions to the skill to compress all outputs into a brief summary before displaying | |
| 3. Split the skill into three smaller skills that each generate less output | |
| 4. Add `model: haiku` to the frontmatter to use a faster, more efficient model for the analysis | |

**정답: 1.**

**해설:**

**📝 문제 번역**

팀이 의존성 스캔·테스트 커버리지 계산·코드 품질 지표 등 **종합 코드 분석**을 수행하는 `/analyze-codebase` 스킬을 만들었습니다. 이 커맨드 실행 후, 팀원들은 Claude가 세션에서 응답성이 떨어지고 원래 작업을 잊어버린다고 보고합니다. **전체 분석 능력은 유지하면서** 이를 해결하는 가장 효과적인 방법은?

- **①** frontmatter에 `context: fork` 를 추가해 격리된 sub-agent 컨텍스트에서 분석 실행
- **②** 출력을 표시 전에 짧은 요약으로 압축하라는 지침 추가
- **③** 출력이 적은 세 개의 작은 스킬로 분리
- **④** frontmatter에 `model: haiku` 를 추가해 더 빠른 모델 사용

> **핵심 진단:** 장황한 분석 출력이 **메인 대화 컨텍스트를 가득 채워** 원래 작업의 맥락을 밀어내는 것이 원인입니다. 분석 능력을 줄이지 않으면서 이를 막으려면 분석을 **별도 컨텍스트로 격리**하고 요약만 돌려받으면 됩니다.

1. **정답** - `context: fork` 는 분석을 **격리된 sub-agent 컨텍스트**에서 실행시켜, 장황한 출력이 메인 대화의 컨텍스트 윈도를 오염시키지 않게 합니다. 전체 분석 능력은 그대로 유지하면서 메인 세션의 응답성을 지킵니다.
2. **오답** - 출력을 요약하도록 지시하면 컨텍스트 사용은 줄지만, 분석 *결과 자체* 가 손실되어 **전체 분석 능력 유지** 라는 요구를 위반합니다. 또한 요약 지침은 LLM이 일관되게 따르지 않을 수 있습니다.
3. **오답** - 스킬을 셋으로 쪼개도 세 번 실행하면 결국 같은 양의 출력이 메인 컨텍스트에 쌓입니다. 근본 원인(컨텍스트 오염)을 해결하지 못합니다.
4. **오답** - `model: haiku` 는 속도·비용에 영향을 줄 뿐, **출력량이 컨텍스트를 채우는 문제**와는 무관하며 분석 품질만 떨어뜨릴 수 있습니다.

---

## 문제 5
### **Your CLAUDE.md has grown to over 400 lines containing coding standards, testing conventions, a detailed PR review checklist, deployment workflow instructions, and database migration procedures. You want Claude to always follow the coding standards and testing conventions, but only apply PR review, deployment, and migration guidance when you're actually performing those tasks. What's the most effective restructuring approach?**

| 보기 | 설명 |
|------|------|
| **1. Keep universal standards in CLAUDE.md and create Skills for task-specific workflows (PR reviews, deployments, migrations) with trigger keywords** | |
| 2. Keep all content in CLAUDE.md but use @import syntax to organize it into separately maintained files by category | |
| 3. Split the CLAUDE.md into files in .claude/rules/ with path-specific glob patterns so each rule loads only for matching file types | |
| 4. Move all guidance into separate Skills files organized by workflow type, keeping only a brief project description in CLAUDE.md | |

**정답: 1.**

**해설:**

**📝 문제 번역**

CLAUDE.md가 400줄을 넘겨 코딩 표준, 테스트 컨벤션, 상세 PR 리뷰 체크리스트, 배포 워크플로 지침, DB 마이그레이션 절차를 담고 있습니다. 코딩 표준과 테스트 컨벤션은 **항상** 따르되, PR 리뷰·배포·마이그레이션 지침은 **실제로 그 작업을 할 때만** 적용되길 원합니다. 가장 효과적인 재구성 방식은?

- **①** 보편 표준은 CLAUDE.md에 두고, 작업별 워크플로(PR 리뷰·배포·마이그레이션)는 트리거 키워드를 가진 Skill로 만든다
- **②** 모든 내용을 CLAUDE.md에 두되 @import로 카테고리별 파일로 정리
- **③** CLAUDE.md를 경로별 glob 패턴을 가진 `.claude/rules/` 파일로 분리
- **④** 모든 지침을 워크플로별 Skill로 옮기고 CLAUDE.md엔 간단한 프로젝트 설명만 남김

> **핵심 진단:** **"항상"(always-on)** 콘텐츠는 매 대화마다 로드되는 `CLAUDE.md`, **"필요할 때만"(on-demand)** 콘텐츠는 트리거 키워드로 호출되는 **Skill** 이 정확한 분담입니다.

| 콘텐츠 | 적절한 위치 | 로딩 방식 |
|--------|-------------|-----------|
| 코딩 표준·테스트 컨벤션 | `CLAUDE.md` | 항상 로드 |
| PR 리뷰·배포·마이그레이션 | Skills | 키워드 감지 시 on-demand |

1. **정답** - CLAUDE.md 내용은 모든 대화에서 로드되므로 코딩 표준·테스트 컨벤션을 항상 적용하기에 적합하고, Skill은 관련 트리거 키워드가 감지될 때만 호출되므로 작업별 워크플로에 이상적입니다. 요구사항과 정확히 일치합니다.
2. **오답** - `@import` 는 파일을 *정리* 할 뿐, import된 내용도 결국 매번 컨텍스트에 로드됩니다. "필요할 때만 적용"이라는 핵심 요구를 충족하지 못합니다.
3. **오답** - `.claude/rules/` 의 glob 패턴은 **파일 경로/타입** 기준으로 적용됩니다. 코딩 표준에는 맞을 수 있지만, "배포·마이그레이션 작업을 *수행* 할 때" 같은 **작업 의도** 기반 트리거에는 적합하지 않습니다.
4. **오답** - 코딩 표준·테스트 컨벤션까지 Skill로 옮기면 **항상 적용되어야 할 표준이 키워드 감지에 의존**하게 되어, 매번 적용된다는 보장이 사라집니다.

---

## 문제 6
### **You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?**

| 보기 | 설명 |
|------|------|
| **1. Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.** | |
| 2. Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation. | |
| 3. Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured. | |
| 4. Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

모놀리식 애플리케이션을 마이크로서비스로 재구성하는 일을 맡았습니다. 수십 개 파일에 걸친 변경이 필요하고 서비스 경계·모듈 의존성에 대한 결정이 요구됩니다. 어떤 접근을 취해야 합니까?

- **①** plan mode로 들어가 코드베이스를 탐색하고 의존성을 이해한 뒤, 변경 전에 구현 방식을 설계한다
- **②** 직접 실행 모드로 시작하고, 예상치 못한 복잡성을 만나면 그때 plan mode로 전환
- **③** 각 서비스 구조를 정확히 지시하는 포괄적 사전 지침과 함께 직접 실행
- **④** 직접 실행으로 시작해 점진적으로 변경하며 구현이 자연스러운 서비스 경계를 드러내게 함

> **핵심 진단:** 수십 개 파일에 걸친 **되돌리기 어려운 아키텍처 결정** 이 필요한 작업입니다. 이런 경우 변경 전에 안전하게 탐색·설계하는 **plan mode** 가 정석입니다.

1. **정답** - 모놀리스 분해처럼 복잡한 아키텍처 재구성에서는 plan mode로 코드베이스를 탐색하고 의존성을 파악한 뒤 접근을 설계하는 것이 옳습니다. 비용이 큰 변경을 확정하기 전에 서비스 경계에 대해 안전하게 탐색하고 정보에 기반한 의사결정을 할 수 있습니다.
2. **오답** - 직접 실행으로 시작하면 이미 대규모 변경이 이뤄진 *뒤에야* 복잡성을 발견하게 되어, plan mode로 늦게 전환해도 이미 잘못된 경계를 따라 작업이 진행됐을 수 있습니다.
3. **오답** - "정확한 사전 지침"은 코드베이스 탐색 없이는 작성할 수 없습니다. 의존성을 먼저 이해하지 않은 지침은 잘못된 경계를 강제할 위험이 큽니다.
4. **오답** - 점진적 직접 실행으로 경계를 "드러나게" 하는 방식은 일관성 없는 임시 결정을 누적시켜, 나중에 값비싼 재작업을 초래합니다. 사전 설계가 필요한 작업입니다.

---

## 문제 7
### **Your team has been using Claude Code for several months. Recently, three developers report that Claude correctly follows your "always include comprehensive error handling" guideline, but a fourth developer who just joined reports Claude isn't following this guideline. All four developers are working in the same repository and have the latest code pulled. What's the most likely cause and appropriate fix?**

| 보기 | 설명 |
|------|------|
| 1. Claude Code builds per-user preference models over time. The new developer needs to repeatedly specify the requirement until Claude learns their preferences. | |
| 2. The new developer's ~/.claude/CLAUDE.md contains conflicting instructions overriding project settings. Have them remove the conflicting section. | |
| **3. The guideline exists in the original developers' ~/.claude/CLAUDE.md files (user-level) instead of the project's .claude/CLAUDE.md. Move the instruction to the project-level file.** | |
| 4. Claude Code caches CLAUDE.md contents after first read. Have all developers clear their Claude Code cache. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

팀이 몇 달째 Claude Code를 사용 중입니다. 최근 세 개발자는 *"항상 포괄적인 에러 처리를 포함하라"* 는 지침을 Claude가 잘 따른다고 하는데, 막 합류한 네 번째 개발자는 Claude가 이 지침을 따르지 않는다고 합니다. 네 명 모두 같은 리포에서 최신 코드를 받은 상태입니다. 가장 가능성 높은 원인과 적절한 해결책은?

- **①** Claude Code가 시간이 지나며 사용자별 선호 모델을 학습한다 → 신규 개발자가 반복 지정해 학습시켜야
- **②** 신규 개발자의 `~/.claude/CLAUDE.md` 에 충돌 지침이 있어 프로젝트 설정을 덮어쓴다 → 충돌 부분 제거
- **③** 그 지침이 프로젝트의 `.claude/CLAUDE.md` 가 아니라 기존 개발자들의 *개인* `~/.claude/CLAUDE.md` 에 있다 → 프로젝트 레벨 파일로 옮긴다
- **④** Claude Code가 첫 읽기 후 CLAUDE.md를 캐시한다 → 모두 캐시를 비운다

> **핵심 진단:** **"같은 리포·최신 코드인데 신규 멤버만 다르다"** = 그 지침이 *공유되는 프로젝트 파일* 이 아니라 **기존 멤버 각자의 개인 설정** 에 들어 있다는 신호입니다.

| 위치 | 공유 여부 |
|------|-----------|
| `~/.claude/CLAUDE.md` (개인) | ❌ 각 PC에만 — 신규 멤버는 못 받음 |
| `.claude/CLAUDE.md` (프로젝트) | ✅ git으로 모두에게 |

1. **오답** - Claude Code는 세션을 가로질러 **지속적인 사용자별 선호 모델을 학습하지 않습니다**. 각 세션은 CLAUDE.md와 현재 대화 맥락으로 새로 시작하므로, 반복 지정해도 영구 학습되지 않습니다.
2. **오답** - 신규 개발자의 개인 파일에 "충돌 지침"이 있다는 근거가 없습니다. 증상은 *지침이 아예 없는* 쪽(누락)에 가깝지, 덮어쓰기(충돌)가 아닙니다.
3. **정답** - 에러 처리 지침이 프로젝트의 `.claude/CLAUDE.md` 가 아니라 기존 개발자 각자의 개인 `~/.claude/CLAUDE.md` 에 들어 있었다면, 신규 멤버는 받을 수 없습니다. 지침을 **프로젝트 레벨 파일로 옮기면** 현재·미래의 모든 팀원이 자동으로 받습니다.
4. **오답** - "최초 읽기 후 영구 캐시"라는 동작은 사실이 아닙니다. 또한 모두가 최신 코드를 받았는데 한 명만 다른 점을 캐시로는 설명할 수 없습니다.

---

## 문제 8
### **Your team's CLAUDE.md file has grown to over 500 lines, mixing TypeScript conventions, testing guidelines, API patterns, and deployment procedures. Developers find it difficult to locate and update relevant sections. What approach does Claude Code support for organizing project-level instructions into focused, topic-specific modules?**

| 보기 | 설명 |
|------|------|
| 1. Create multiple files named `CLAUDE.md` at different levels of the directory tree, each overriding the parent's instructions | |
| **2. Create separate markdown files in `.claude/rules/`, each covering one topic (e.g., `testing.md`, `api-conventions.md`)** | |
| 3. Split instructions into README.md files in relevant subdirectories, which Claude automatically loads as instructions | |
| 4. Define a `.claude/config.yaml` file that maps file patterns to specific sections within CLAUDE.md | |

**정답: 2.**

**해설:**

**📝 문제 번역**

팀의 CLAUDE.md가 500줄을 넘겨 TypeScript 컨벤션, 테스트 가이드라인, API 패턴, 배포 절차가 뒤섞여 있습니다. 개발자들이 관련 섹션을 찾고 수정하기 어려워합니다. 프로젝트 지침을 **주제별 모듈** 로 정리하기 위해 Claude Code가 지원하는 방식은?

- **①** 디렉터리 트리 여러 레벨에 `CLAUDE.md` 를 만들고 각자 상위 지침을 덮어쓴다
- **②** `.claude/rules/` 에 주제별 마크다운 파일을 만든다 (`testing.md`, `api-conventions.md` 등)
- **③** 하위 디렉터리의 README.md로 나누면 Claude가 지침으로 자동 로드
- **④** `.claude/config.yaml` 로 파일 패턴을 CLAUDE.md의 특정 섹션에 매핑

> **핵심 진단:** 하나의 큰 지침 묶음을 **주제별 모듈** 로 쪼개는 표준 기능은 `.claude/rules/` 디렉터리입니다.

1. **오답** - 디렉터리별 `CLAUDE.md` 는 *코드베이스의 영역별 맥락* 을 주는 기능이지, 한 프로젝트의 지침을 주제별로 나누는 용도가 아닙니다. 또한 하위 `CLAUDE.md` 는 상위를 **덮어쓰는 게 아니라 보완** 합니다(설명 자체가 틀림).
2. **정답** - Claude Code는 `.claude/rules/` 디렉터리를 지원하며, 여기에 주제별 마크다운 파일(`testing.md`, `api-conventions.md` 등)을 두어 큰 지침 집합을 **집중적이고 유지보수 가능한 모듈** 로 정리할 수 있습니다.
3. **오답** - Claude Code가 하위 디렉터리의 `README.md` 를 지침으로 자동 로드하지는 않습니다.
4. **오답** - `.claude/config.yaml` 로 CLAUDE.md 내부 섹션을 매핑하는 기능은 존재하지 않습니다.

---

## 문제 9
### **You've created a `/commit` skill in `.claude/skills/commit/SKILL.md` that your team uses. One developer wants to customize it for their personal workflow (different commit message format, additional checks) without affecting teammates. What should you recommend?**

| 보기 | 설명 |
|------|------|
| **1. Create a personal version in `~/.claude/skills/` with a different name like `/my-commit`** | |
| 2. Add username-based conditional logic to the project skill's frontmatter | |
| 3. Create a personal version at `~/.claude/skills/commit/SKILL.md` with the same name | |
| 4. Set `override: true` in the personal skill's frontmatter to take precedence over the project version | |

**정답: 1.**

**해설:**

**📝 문제 번역**

팀이 사용하는 `/commit` 스킬을 `.claude/skills/commit/SKILL.md` 에 만들었습니다. 한 개발자가 팀원들에게 영향을 주지 않으면서 자신의 워크플로(다른 커밋 메시지 형식, 추가 검사)에 맞게 커스터마이즈하고 싶어 합니다. 무엇을 추천해야 합니까?

- **①** `~/.claude/skills/` 에 `/my-commit` 처럼 **다른 이름** 으로 개인 버전을 만든다
- **②** 프로젝트 스킬 frontmatter에 사용자명 기반 조건 로직 추가
- **③** `~/.claude/skills/commit/SKILL.md` 에 **같은 이름** 으로 개인 버전 생성
- **④** 개인 스킬 frontmatter에 `override: true` 를 설정해 프로젝트 버전보다 우선

> **핵심 진단:** **프로젝트 스킬이 같은 이름의 개인 스킬보다 우선** 합니다. 따라서 개인 커스텀을 확실히 쓰려면 **다른 이름** 을 써야 합니다.

1. **정답** - 같은 이름이면 프로젝트 스킬이 우선하므로, 개인 `~/.claude/skills/` 에 `/my-commit` 같은 **다른 이름** 으로 만들어야 팀의 `/commit` 과 나란히 자신의 버전을 쓸 수 있습니다.
2. **오답** - 프로젝트 스킬에 사용자명 조건 로직을 넣으면 **공유 파일을 한 사람을 위해 오염** 시키게 되고, 다른 팀원에게도 영향을 줄 수 있어 부적절합니다.
3. **오답** - 시험 가이드에서는 팀원에게 영향을 주지 않도록 `~/.claude/skills/` 폴더에 **다른 이름**으로 개인 변형 파일을 생성하는 방식으로 해야 한다고 명시하고 있습니다. 같은 이름으로 만드는 것은 가이드에 부합하지 않습니다.
4. **오답** - `override: true` 같은 frontmatter 옵션으로 프로젝트 우선순위를 뒤집는 기능은 존재하지 않습니다.

---

## 문제 10
### **You've found that including 2-3 full exemplar endpoint implementations as context significantly improves consistency when generating new API endpoints. However, this context is only useful for creating new endpoints—not for bug fixes, code reviews, or other API directory work. What's the most efficient configuration approach?**

| 보기 | 설명 |
|------|------|
| 1. Add the exemplar endpoint code with pattern documentation to the project CLAUDE.md file so it's automatically available. | |
| **2. Create a skill that references the exemplar endpoints and includes pattern-following instructions, invoked on-demand via slash command.** | |
| 3. Reference the exemplar endpoints manually in each generation request by copying relevant code into your prompt. | |
| 4. Configure path-specific rules in .claude/rules/api/ that include the exemplar code and activate when working in the API directory. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

새 API 엔드포인트를 생성할 때, 완성된 예시 엔드포인트 구현 2~3개를 컨텍스트로 넣으면 일관성이 크게 좋아진다는 것을 알았습니다. 그러나 이 컨텍스트는 *새 엔드포인트 생성* 에만 유용하고 버그 수정·코드 리뷰·기타 API 디렉터리 작업에는 불필요합니다. 가장 효율적인 구성 방식은?

- **①** 예시 코드와 패턴 문서를 프로젝트 CLAUDE.md에 넣어 자동 제공
- **②** 예시 엔드포인트를 참조하고 패턴 준수 지침을 담은 Skill을 만들어 슬래시 커맨드로 on-demand 호출
- **③** 매 생성 요청마다 관련 코드를 프롬프트에 수동 복사
- **④** `.claude/rules/api/` 에 경로별 규칙으로 예시 코드를 넣어 API 디렉터리 작업 시 활성화

> **핵심 진단:** **"특정 작업(새 엔드포인트 생성)에서만 필요"** = 매번 로드되는 CLAUDE.md나 경로 기반 rules가 아니라, **필요할 때만 호출하는 Skill** 이 가장 효율적입니다.

1. **오답** - CLAUDE.md에 넣으면 작업 종류와 무관하게 **모든 세션에서 로드** 되어, 버그 수정·코드 리뷰 때도 불필요하게 컨텍스트 윈도를 낭비합니다.
2. **정답** - 예시 엔드포인트와 패턴 준수 지침을 담은 Skill을 만들면 슬래시 커맨드로 **필요할 때만(on-demand)** 호출되어, 새 엔드포인트 생성 시에만 컨텍스트가 로드되고 무관한 작업에는 영향을 주지 않습니다.
3. **오답** - 매번 수동 복사는 비효율적이고 사람이 빠뜨리거나 일관되지 않게 붙여넣을 수 있어 신뢰성이 떨어집니다.
4. **오답** - `.claude/rules/api/` 경로 규칙은 **API 디렉터리에서 작업하는 모든 경우**(버그 수정·리뷰 포함)에 활성화되므로, "새 엔드포인트 생성에만"이라는 조건을 만족하지 못합니다.

---

## 문제 11
### **You're adding error handling wrappers to external API calls across a 120-file codebase. The task has three phases: (1) discovering all API call locations and patterns, (2) designing the error handling approach collaboratively, and (3) implementing wrappers consistently. During Phase 1, Claude generates verbose output listing hundreds of call sites with context. Your context window is filling rapidly before you've finished discovery. What's the most effective approach to complete this while maintaining implementation consistency?**

| 보기 | 설명 |
|------|------|
| 1. Continue all phases in the main conversation, using /compact periodically to reduce context usage. | |
| 2. Define your error handling pattern in CLAUDE.md, then process files in batches across multiple sessions, relying on the shared memory file. | |
| 3. Switch to headless mode with --continue, passing explicit context summaries between batch invocations. | |
| **4. Use the Explore subagent for Phase 1 to isolate verbose output and return a summary, then continue Phases 2-3 in the main conversation.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

120개 파일의 외부 API 호출에 에러 처리 래퍼를 추가하는 작업입니다. 3단계로 구성됩니다: (1) 모든 API 호출 위치·패턴 탐색, (2) 에러 처리 방식 협업 설계, (3) 래퍼 일관 구현. 1단계에서 Claude가 수백 개 호출 지점을 맥락과 함께 장황하게 출력해, 탐색이 끝나기도 전에 컨텍스트 윈도가 빠르게 차버립니다. **구현 일관성을 유지하면서** 이를 완수하는 가장 효과적인 방법은?

- **①** 모든 단계를 메인 대화에서 진행하고 주기적으로 `/compact` 사용
- **②** CLAUDE.md에 패턴 정의 후 여러 세션에 걸쳐 배치 처리, 공유 메모리 파일에 의존
- **③** `--continue` headless 모드로 전환, 배치 호출 간 명시적 요약 전달
- **④** 1단계에 Explore 서브에이전트를 써서 장황한 출력을 격리하고 요약만 반환받은 뒤, 2~3단계는 메인 대화에서 진행

> **핵심 진단:** 1단계의 장황한 *탐색 출력* 만 격리하면 됩니다. **Explore 서브에이전트** 가 별도 컨텍스트에서 탐색을 수행하고 요약만 돌려주면, 메인 컨텍스트는 협업 설계·일관 구현에 온전히 쓸 수 있습니다.

1. **오답** - `/compact` 는 컨텍스트를 회수하지만 **손실 압축** 이라, 1단계에서 발견한 중요한 패턴·엣지 케이스가 사라져 2~3단계의 일관성을 해칠 수 있습니다.
2. **오답** - 여러 세션에 걸쳐 배치 처리하면 세션 간 맥락이 단절되고, CLAUDE.md/메모리 파일만으로는 발견된 모든 호출 지점의 세부 패턴을 유지하기 어렵습니다.
3. **오답** - headless `--continue` 로 요약을 수동 전달하는 방식은 복잡하고 오류가 나기 쉬우며, 협업 설계(2단계)의 상호작용에 부적합합니다.
4. **정답** - 1단계에 Explore 서브에이전트를 쓰면 장황한 탐색 출력이 별도 컨텍스트에 격리되고 **간결한 요약만** 메인 대화로 돌아옵니다. 가장 중요한 협업 설계·일관 구현 단계를 위해 메인 컨텍스트 윈도가 보존됩니다.

---

## 문제 12
### **You need to add Slack as a new notification channel. The existing codebase has clear patterns for email, SMS, and push. However, the Slack API offers fundamentally different integration approaches—incoming webhooks (simple, one-way), bot tokens (delivery confirmation, programmatic control), or Slack Apps (bidirectional, requires workspace approval). Your ticket says "add Slack support" without specifying which method or whether advanced features will be needed. How should you approach this task?**

| 보기 | 설명 |
|------|------|
| 1. Start direct execution using incoming webhooks to match the existing one-way notification pattern. | |
| 2. Start direct execution using the bot token approach to enable delivery confirmation. | |
| **3. Enter plan mode to explore the integration options and their architectural implications, then present a recommendation before implementing.** | |
| 4. Start direct execution to scaffold the Slack channel class, deferring the integration method decision until later. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

새 알림 채널로 Slack을 추가해야 합니다. 기존 코드베이스는 email·SMS·push에 명확한 패턴이 있습니다. 그런데 Slack API는 근본적으로 다른 통합 방식을 제공합니다 — incoming webhooks(단순·단방향), bot tokens(전달 확인·프로그램 제어), Slack Apps(양방향 이벤트, 워크스페이스 승인 필요). 티켓에는 어느 방식인지, 전달 추적 같은 고급 기능이 필요한지 명시 없이 "add Slack support"라고만 적혀 있습니다. 어떻게 접근해야 합니까?

- **①** 기존 단방향 패턴에 맞춰 incoming webhooks로 직접 실행 시작
- **②** 전달 확인을 위해 bot token 방식으로 직접 실행 시작
- **③** plan mode로 통합 옵션과 아키텍처 영향을 탐색한 뒤, 구현 전에 권고안을 제시한다
- **④** Slack 채널 클래스를 먼저 스캐폴딩하고 통합 방식 결정은 나중으로 미룸

> **핵심 진단:** **요구사항이 모호하고**, 선택지마다 **아키텍처적 함의가 크게 다릅니다**. 이런 경우 확정 전에 트레이드오프를 탐색하고 권고안을 제시하는 **plan mode** 가 적합합니다.

1. **오답** - webhooks가 기존 단방향 패턴엔 맞지만, 전달 추적 같은 고급 기능 필요 여부를 평가하지 않은 채 **특정 방식에 성급히 확정** 하는 것입니다.
2. **오답** - bot token도 마찬가지로, 요구사항이 불명확한 상태에서 특정 아키텍처를 미리 못박는 것이라 부적절합니다.
3. **정답** - 여러 유효한 통합 방식이 서로 다른 아키텍처적 함의를 가지고 요구사항도 모호하므로, plan mode로 webhooks·bot token·Slack App의 트레이드오프를 탐색해 정보에 기반한 권고안을 내고 팀 합의를 이룬 뒤 구현하는 것이 옳습니다.
4. **오답** - 통합 방식을 미룬 채 스캐폴딩부터 하면, 핵심 아키텍처 결정이 정해지지 않아 잘못된 추상화 위에 작업하게 될 위험이 있습니다.

---

## 문제 13
### **You've asked Claude Code to implement a function that transforms API responses into a normalized internal format. After two iterations, the output structure still doesn't match—some fields are nested differently and timestamps aren't formatted correctly. You've been describing the requirements in prose, but Claude interprets them differently each time. What's the most effective approach for the next iteration?**

| 보기 | 설명 |
|------|------|
| 1. Ask Claude to explain its current interpretation of the requirements so you can identify where understanding diverges. | |
| 2. Write a JSON schema defining the expected output structure and validate Claude's output against it after each iteration. | |
| 3. Rewrite your requirements with greater technical precision, specifying exact field mappings, nesting rules, and timestamp format strings. | |
| **4. Provide 2-3 concrete input-output examples showing the expected transformation for representative API responses.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

API 응답을 정규화된 내부 형식으로 변환하는 함수를 Claude Code에 요청했습니다. 두 번 반복했지만 출력 구조가 여전히 기대와 다릅니다 — 일부 필드는 중첩이 다르고 타임스탬프 형식도 틀립니다. 요구사항을 산문(prose)으로 설명해 왔는데, Claude가 매번 다르게 해석합니다. 다음 반복에서 가장 효과적인 접근은?

- **①** Claude에게 현재 해석을 설명하게 해 이해가 갈리는 지점을 찾는다
- **②** 기대 출력 구조를 JSON 스키마로 정의하고 매 반복마다 검증
- **③** 정확한 필드 매핑·중첩 규칙·타임스탬프 포맷 문자열을 명시해 요구사항을 더 정밀하게 재작성
- **④** 대표적 API 응답에 대해 기대 변환을 보여주는 **구체적 입력-출력 예시 2~3개** 를 제공한다

> **핵심 진단:** 산문 설명은 본질적으로 **모호** 합니다. 근본 원인은 "산문 요구사항의 오해석"이므로, 가장 직접적인 해법은 **구체적인 입출력 예시(few-shot)** 로 기대 결과를 명확히 보여주는 것입니다.

1. **오답** - 해석을 설명하게 하는 것은 유용한 *진단* 이지만 문제를 직접 해결하진 못합니다. 오해를 찾은 뒤에도 결국 올바른 변환을 전달할 별도 방법(예: 구체적 예시)이 필요합니다.
2. **오답** - JSON 스키마는 *구조* 는 강제하지만 **필드 매핑·타임스탬프 포맷 같은 변환 의미** 는 표현하지 못하고, 사후 검증일 뿐 모호함의 근본을 없애지 못합니다.
3. **오답** - 더 정밀한 산문도 여전히 산문이라 해석 편차가 남습니다. 정밀도를 높이는 것보다 **예시로 보여주는 것** 이 모호함 제거에 더 효과적입니다.
4. **정답** - 구체적 입출력 예시는 산문의 모호함을 제거하고 Claude에게 기대 변환을 정확히 보여줍니다. 필드 중첩·타임스탬프 포맷에 대한 명확한 목표를 제공해 오해석이라는 근본 원인을 직접 해결합니다.

---

## 문제 14
### **Your team wants to add a GitHub MCP server to enable PR lookups and CI status checks through Claude Code. Each of the six developers has their own GitHub personal access token. You want consistent tooling across the team without committing credentials to version control. What's the most effective configuration approach?**

| 보기 | 설명 |
|------|------|
| **1. Add the server to a project-scoped `.mcp.json` with environment variable expansion (`${GITHUB_TOKEN}`), and document the required variable in your README.** | |
| 2. Have each developer configure the server in user scope with `claude mcp add --scope user`. | |
| 3. Configure the server in project scope with a placeholder token, then instruct developers to override it in local scope. | |
| 4. Create an MCP server wrapper that reads tokens from a `.env` file and proxies requests to the GitHub API. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

팀이 Claude Code에서 PR 조회·CI 상태 확인을 하려고 GitHub MCP 서버를 추가하려 합니다. 6명 개발자 각자 자신의 GitHub PAT를 가지고 있습니다. **자격증명을 버전 관리에 커밋하지 않으면서** 팀 전체에 일관된 도구를 제공하고 싶습니다. 가장 효과적인 구성 방식은?

- **①** 프로젝트 범위 `.mcp.json` 에 환경 변수 확장(`${GITHUB_TOKEN}`)으로 서버를 추가하고, 필요한 변수를 README에 문서화한다
- **②** 각 개발자가 `claude mcp add --scope user` 로 사용자 범위에 설정
- **③** 프로젝트 범위에 플레이스홀더 토큰으로 설정 후 로컬 범위에서 덮어쓰게 지시
- **④** `.env` 에서 토큰을 읽어 GitHub API로 프록시하는 MCP 래퍼 서버를 만듦

> **핵심 진단:** 요구는 두 가지 — **① 팀 공통 구성(버전 관리)**, **② 개인 자격증명은 커밋하지 않음**. `.mcp.json` 에 서버 설정을 두되 토큰만 `${GITHUB_TOKEN}` 환경 변수로 주입하면 둘을 동시에 만족합니다.

```jsonc
// .mcp.json  (git에 커밋 — 단, 토큰 값은 들어가지 않음)
{
  "mcpServers": {
    "github": {
      "command": "...",
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }  // ← 각자 환경에서 주입
    }
  }
}
```

1. **정답** - 프로젝트 범위 `.mcp.json` 에 환경 변수 확장(`${GITHUB_TOKEN}`)을 쓰는 것이 정석입니다. 팀의 MCP 구성을 버전 관리되는 단일 소스로 두면서, 각 개발자가 환경 변수로 자기 자격증명을 공급합니다. README에 변수를 문서화하면 온보딩도 쉽고 비밀은 절대 커밋되지 않습니다.
2. **오답** - 각자 사용자 범위에 설정하면 **일관성이 깨지고**(설정이 6번 따로), 구성 변경 시 버전 관리되는 단일 소스가 없습니다.
3. **오답** - 플레이스홀더 토큰을 커밋하면 더럽고, 로컬에서 매번 덮어써야 해 실수가 잦으며 깔끔하지 않습니다.
4. **오답** - 프록시 래퍼 서버를 직접 만드는 것은 과도한 엔지니어링입니다. 환경 변수 확장이라는 내장 기능으로 충분히 해결됩니다.

---

## 문제 15
### **Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., `Button.test.tsx` next to `Button.tsx`), and you want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions?**

| 보기 | 설명 |
|------|------|
| 1. Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions | |
| **2. Create rule files in `.claude/rules/` with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths** | |
| 3. Create skills in `.claude/skills/` for each code type that include the relevant conventions in their SKILL.md files | |
| 4. Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies | |

**정답: 2.**

**해설:**

**📝 문제 번역**

코드베이스에 서로 다른 컨벤션을 가진 영역들이 있습니다: React 컴포넌트는 hooks 기반 함수형, API 핸들러는 특정 에러 처리를 동반한 async/await, DB 모델은 repository 패턴. 테스트 파일은 대상 코드 옆에 흩어져 있고(`Button.test.tsx` 가 `Button.tsx` 옆에), 위치와 무관하게 **모든 테스트가 동일 컨벤션** 을 따르길 원합니다. Claude가 올바른 컨벤션을 자동 적용하게 하는 **가장 유지보수하기 좋은** 방법은?

- **①** 각 하위 디렉터리에 해당 영역 컨벤션을 담은 별도 CLAUDE.md 배치
- **②** `.claude/rules/` 에 YAML frontmatter로 **glob 패턴** 을 지정해 파일 경로 기준으로 컨벤션을 조건부 적용
- **③** 코드 타입별로 `.claude/skills/` 에 스킬을 만들어 컨벤션 포함
- **④** 루트 CLAUDE.md에 영역별 헤더로 모두 모으고 Claude가 알아서 추론하게 함

> **핵심 진단:** 핵심은 **경로 기반 자동 적용** + **여러 디렉터리에 흩어진 테스트 파일(cross-cutting)** 처리입니다. glob 패턴(`**/*.test.tsx`, `src/api/**/*.ts`)을 지원하는 `.claude/rules/` 가 정확히 이 문제를 해결합니다.

1. **오답** - 디렉터리별 CLAUDE.md는 디렉터리 범위 컨벤션엔 맞지만, **여러 디렉터리에 흩어진 테스트 파일** 에는 테스트 컨벤션을 모든 디렉터리에 중복해야 해 유지보수가 불가능해집니다.
2. **정답** - `.claude/rules/` 의 YAML frontmatter + glob 패턴(`**/*.test.tsx`, `src/api/**/*.ts` 등)은 파일이 어디 있든 **경로 기준으로 결정적으로** 컨벤션을 적용합니다. 흩어진 테스트 파일 같은 cross-cutting 관심사를 중복 없이 처리하는 가장 유지보수 좋은 방식입니다.
3. **오답** - 스킬은 on-demand 호출 방식이라, "코드 생성 시 자동으로" 올바른 컨벤션을 적용하는 요구에 맞지 않습니다.
4. **오답** - 루트 CLAUDE.md에 모두 모으고 추론에 맡기면 결정적이지 않아, 영역이 섞일 때 잘못된 컨벤션을 적용할 수 있습니다.

---

## 문제 16
### **When researching a broad topic, you observe that the web search agent and document analysis agent are both investigating the same subtopics, resulting in significant overlap. Token usage has nearly doubled without proportionally increasing breadth or depth. What's the most effective way to address this?**

| 보기 | 설명 |
|------|------|
| 1. Implement a shared state mechanism where agents log their current focus area, allowing others to dynamically avoid duplicate work | |
| **2. Have the coordinator explicitly partition the research space before delegation, assigning distinct subtopics or source types to each agent** | |
| 3. Allow both agents to complete their parallel work, then have the coordinator deduplicate overlapping findings before synthesis | |
| 4. Convert to sequential execution where document analysis runs only after web search completes, using its findings to avoid duplication | |

**정답: 2.**

**해설:**

**📝 문제 번역**

광범위한 주제를 조사할 때, 웹 검색 에이전트와 문서 분석 에이전트가 **같은 하위 주제** 를 둘 다 조사해 상당한 중복이 발생합니다. 토큰 사용량은 거의 두 배가 됐는데 조사의 폭·깊이는 비례해 늘지 않았습니다. 가장 효과적인 해결책은?

- **①** 에이전트가 현재 집중 영역을 기록하는 공유 상태로 동적 중복 회피
- **②** 코디네이터가 위임 *전에* 조사 공간을 명시적으로 분할해 각 에이전트에 서로 다른 하위 주제/소스 타입을 배정한다
- **③** 둘 다 병렬 작업을 끝낸 뒤 코디네이터가 중복 결과를 제거
- **④** 순차 실행으로 바꿔 웹 검색 후 문서 분석이 그 결과를 참고해 중복 회피

> **핵심 진단:** 근본 원인은 **위임 시 작업 경계가 불분명** 한 것입니다. 가장 단순·확실한 해법은 코디네이터가 **사전에 조사 공간을 분할(partition)** 하는 것 — 병렬성의 이점을 지키면서 중복을 원천 차단합니다.

1. **오답** - 공유 상태 메커니즘은 이론상 가능하나 불필요한 복잡성·경쟁 조건(race condition)을 유발하고, 서로의 영역을 감지하기 전까지 일부 중복 작업은 이미 일어납니다. 사전 분할이 더 단순·신뢰성 높습니다.
2. **정답** - 코디네이터가 위임 전에 조사 공간을 명시적으로 분할하면 **불분명한 작업 경계** 라는 근본 원인을 작업 시작 전에 제거합니다. 병렬 실행의 이점을 유지하면서 중복과 토큰 낭비를 막습니다.
3. **오답** - 사후 중복 제거는 **이미 두 배의 토큰을 소비한 뒤** 이므로 비용 문제를 해결하지 못합니다.
4. **오답** - 순차 실행으로 바꾸면 중복은 줄지만 병렬성의 속도 이점을 희생합니다. 사전 분할이면 병렬을 유지하면서도 중복을 피할 수 있습니다.

---

## 문제 17
### **During a materials research task, the web search subagent queries three source categories: academic databases returned 15 relevant papers, industry reports returned "0 results found," and patent databases returned "Connection timeout." When designing error propagation to the coordinator, what approach enables the best recovery decisions?**

| 보기 | 설명 |
|------|------|
| **1. Distinguish access failures (timeout) needing retry decisions from valid empty results ("0 results") representing successful queries.** | |
| 2. Report both the timeout and "0 results" as failures requiring coordinator intervention. | |
| 3. Aggregate outcomes into a single success rate metric (e.g., "67% source coverage") with detailed logs available on request. | |
| 4. Have the subagent retry transient failures internally and only report persistent errors. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

소재 조사 작업에서 웹 검색 서브에이전트가 세 소스 카테고리를 조회합니다: 학술 DB는 관련 논문 15편 반환, 산업 보고서는 "0 results found", 특허 DB는 "Connection timeout". 코디네이터로의 에러 전파를 설계할 때, **최선의 복구 결정** 을 가능하게 하는 접근은?

- **①** 접근 실패(timeout, 재시도 결정 필요)와 유효한 빈 결과("0 results", 성공한 조회)를 구분한다
- **②** timeout과 "0 results"를 모두 코디네이터 개입이 필요한 실패로 보고
- **③** 단일 성공률 지표(예: "67% 커버리지")로 집계, 상세 로그는 요청 시
- **④** 서브에이전트가 일시적 실패를 내부 재시도하고 지속 오류만 보고

> **핵심 진단:** **"0 results"(유효한 빈 결과)** 와 **"timeout"(접근 실패)** 은 의미가 전혀 다릅니다. 전자는 *성공적으로 답을 얻었으나 비어 있음*, 후자는 *답을 못 얻음 → 재시도 가능*. 이를 구분해야 코디네이터가 올바른 복구 결정을 내립니다.

| 결과 | 의미 | 적절한 대응 |
|------|------|-------------|
| 15편 반환 | 성공 | 사용 |
| "0 results" | 성공(빈 결과) | 유효한 발견으로 수용 |
| "timeout" | 접근 실패 | 재시도 검토 |

1. **정답** - timeout(접근 실패)과 "0 results"(유효한 빈 결과)는 의미적으로 구별되어 서로 다른 대응이 필요합니다. 이를 구분하면 코디네이터가 timeout된 특허 DB는 재시도하고, 빈 산업 보고서는 유효한 발견으로 수용할 수 있습니다.
2. **오답** - 둘 다 "실패"로 묶으면 코디네이터가 유효한 빈 결과까지 불필요하게 재처리하려 해, 정보 손실과 헛된 재시도를 유발합니다.
3. **오답** - 단일 성공률 지표로 뭉뚱그리면 **각 결과의 의미적 차이가 사라져** 어디를 재시도할지 결정할 수 없습니다.
4. **오답** - 서브에이전트가 내부 재시도만 하면 코디네이터가 전체 맥락(어떤 소스가 왜 실패했는지)을 보지 못해 더 나은 전략적 복구 결정을 내릴 수 없습니다.

---

## 문제 18
### **The document analysis subagent encounters a corrupted PDF file it cannot parse. When designing the system's error handling, what is the most effective way to handle this failure?**

| 보기 | 설명 |
|------|------|
| 1. Throw an exception that terminates the entire research workflow. | |
| 2. Silently skip the corrupted document and continue processing other files. | |
| **3. Return the error with context to the coordinator agent, letting it decide how to proceed.** | |
| 4. Automatically retry parsing the document three times with exponential backoff before reporting failure. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

문서 분석 서브에이전트가 파싱할 수 없는 손상된 PDF 파일을 만났습니다. 시스템 에러 처리를 설계할 때, 이 실패를 다루는 가장 효과적인 방법은?

- **①** 전체 조사 워크플로를 종료시키는 예외 발생
- **②** 손상 문서를 조용히 건너뛰고 다른 파일 계속 처리
- **③** 맥락과 함께 에러를 코디네이터에 반환해 코디네이터가 진행 방식을 결정하게 한다
- **④** 실패 보고 전 지수 백오프로 3회 자동 재시도

> **핵심 진단:** 손상 파일은 **재시도로 고쳐지지 않습니다**. 한 파일 실패로 전체를 죽이는 것도, 조용히 숨기는 것도 부적절합니다. 맥락과 함께 **코디네이터에 보고** 해 정보에 기반한 결정을 맡기는 것이 옳습니다.

1. **오답** - 파일 하나가 손상됐다고 전체 워크플로를 종료하면 그동안의 모든 진행을 버리고 나머지 유효 문서 처리도 막는, 지나친 대응입니다.
2. **오답** - 조용히 건너뛰면 **가시성이 사라져** 코디네이터/사용자가 어떤 문서가 누락됐는지 모르게 됩니다. 투명성이 결여됩니다.
3. **정답** - 맥락과 함께 에러를 코디네이터에 반환하면, 코디네이터가 파일 건너뛰기·대체 파싱 시도·사용자 통지 등 정보에 기반한 결정을 내릴 수 있고 실패에 대한 가시성도 유지됩니다.
4. **오답** - 손상된 PDF는 본질적으로 재시도해도 결과가 동일하므로, 지수 백오프 재시도는 **무의미한 지연** 만 추가합니다(일시적 실패가 아님).

---

## 문제 19
### **A colleague suggests having the document analysis agent send its output directly to the synthesis agent instead of routing through the coordinator. What is the main advantage of keeping the coordinator as the central hub for all subagent communication?**

| 보기 | 설명 |
|------|------|
| 1. Subagents operate with isolated memory, and direct communication would require complex serialization that only the coordinator can perform | |
| 2. The coordinator batches multiple subagent requests together, reducing the total number of API calls and overall latency | |
| 3. Routing through the coordinator enables automatic retry logic that direct agent-to-agent calls cannot support | |
| **4. The coordinator can observe all interactions, handle errors consistently, and decide what information each subagent should receive** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

동료가 문서 분석 에이전트의 출력을 코디네이터를 거치지 않고 **합성(synthesis) 에이전트로 직접** 보내자고 제안합니다. 모든 서브에이전트 통신의 중앙 허브로 코디네이터를 유지하는 주된 이점은?

- **①** 서브에이전트는 격리된 메모리로 동작하고, 직접 통신은 코디네이터만 할 수 있는 복잡한 직렬화가 필요하다
- **②** 코디네이터가 여러 요청을 배치로 묶어 API 호출 수·지연을 줄인다
- **③** 코디네이터 경유는 직접 통신이 못하는 자동 재시도를 가능케 한다
- **④** 코디네이터가 모든 상호작용을 관찰하고, 에러를 일관되게 처리하며, 각 서브에이전트가 받을 정보를 결정할 수 있다

> **핵심 진단:** 이것은 **orchestrator-workers(hub-and-spoke)** 패턴의 핵심 이점 — **중앙 가시성·일관된 에러 처리·정보 흐름 통제** 입니다.

1. **오답** - 직렬화는 코디네이터만의 고유 능력이 아닙니다. 어떤 컴포넌트든 데이터를 직렬화·전달할 수 있으므로, 직접 통신에 특별한 직렬화 장벽이 있는 것이 아닙니다.
2. **오답** - 코디네이터의 본질적 가치는 배치를 통한 지연 감소가 아닙니다(그것은 별개 최적화이며 hub 패턴의 주된 이점이 아님).
3. **오답** - 자동 재시도는 직접 통신 구조에서도 구현할 수 있으므로 코디네이터만의 고유 이점이 아닙니다.
4. **정답** - 코디네이터 패턴은 모든 상호작용에 대한 중앙 가시성, 시스템 전반의 일관된 에러 처리, 각 서브에이전트가 받을 정보에 대한 세밀한 통제를 제공합니다. 이것이 hub-and-spoke 통신의 핵심 이점입니다.

---

## 문제 20
### **The web search subagent returns results for only 3 of 5 requested source categories (competitor websites and industry reports succeeded; news archives and social media feeds timed out). The document analysis subagent successfully processed all documents. The synthesis subagent must now produce a findings summary from this mixed-quality input. What's the most effective error propagation strategy?**

| 보기 | 설명 |
|------|------|
| 1. Proceed with synthesis using only the successful sources, without indicating which data was unavailable. | |
| **2. Structure the synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources.** | |
| 3. Have the synthesis subagent request the coordinator retry the timed-out sources with extended timeouts before proceeding. | |
| 4. Have the synthesis subagent return an error to the coordinator indicating incomplete upstream data, triggering a full retry or task failure. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

웹 검색 서브에이전트가 요청한 5개 소스 카테고리 중 3개만 결과를 반환했습니다(경쟁사 웹사이트·산업 보고서 성공, 뉴스 아카이브·소셜 미디어 피드 timeout). 문서 분석 서브에이전트는 모든 문서를 성공적으로 처리했습니다. 이제 합성 서브에이전트가 이 **혼합 품질 입력** 으로 요약을 만들어야 합니다. 가장 효과적인 에러 전파 전략은?

- **①** 성공한 소스만으로 합성을 진행하되 어떤 데이터가 없었는지 표시하지 않음
- **②** 합성 출력에 **커버리지 주석** 을 달아 어떤 발견이 충분히 뒷받침되는지 vs 어떤 영역이 소스 부재로 공백인지 표시한다
- **③** 합성 전에 코디네이터에 timeout 소스를 더 긴 타임아웃으로 재시도 요청
- **④** 합성 서브에이전트가 상류 데이터 불완전 에러를 반환해 전체 재시도/작업 실패 유발

> **핵심 진단:** **투명성을 동반한 우아한 성능 저하(graceful degradation)** 가 핵심입니다. 완료된 작업의 가치는 살리면서, 불확실성(어디에 공백이 있는지)을 명시적으로 전파해야 합니다.

1. **오답** - 어떤 소스가 빠졌는지 표시하지 않으면 다운스트림 소비자에게 **중요한 정보를 숨겨** 오해를 부르는 보고서가 될 수 있습니다. 사용자는 특정 영역이 커버되지 않았음을 알 길이 없어 신뢰성이 훼손됩니다.
2. **정답** - 커버리지 주석을 단 합성 출력은 투명성을 동반한 우아한 성능 저하를 구현합니다. 어떤 발견이 잘 뒷받침되고 어떤 영역에 공백이 있는지 알 수 있어, 완료된 작업의 가치를 보존하면서 불확실성 정보를 전파해 신뢰 수준에 대한 정보에 기반한 판단을 가능케 합니다.
3. **오답** - 합성 단계에서 무조건 재시도를 요구하면, 일부 소스가 영구히 불가용일 때 작업이 무한정 지연됩니다. 부분 결과로 진행 + 공백 표시가 더 견고합니다.
4. **오답** - 상류 데이터가 불완전하다고 전체를 실패시키면 성공적으로 수집한 3개 소스와 모든 문서 분석 결과까지 버리게 되어 지나칩니다.

---

## 문제 21
### **After running the system on "impact of AI on creative industries," each subagent completes successfully, but the final reports cover only visual arts, completely missing music, writing, and film production. The coordinator's logs show it decomposed the topic into three subtasks: "AI in digital art creation," "AI in graphic design," and "AI in photography." What is the most likely root cause?**

| 보기 | 설명 |
|------|------|
| **1. The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic.** | |
| 2. The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives. | |
| 3. The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria. | |
| 4. The web search agent's queries are not comprehensive enough and need to be expanded to cover more sectors. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

"AI가 창작 산업에 미치는 영향" 주제로 시스템을 돌렸더니 각 서브에이전트는 성공적으로 완료했지만, 최종 보고서가 *시각 예술* 만 다루고 음악·글쓰기·영화 제작은 완전히 빠졌습니다. 코디네이터 로그를 보니 주제를 "AI in digital art creation", "AI in graphic design", "AI in photography" 세 하위 작업으로 분해했습니다. 가장 가능성 높은 근본 원인은?

- **①** 코디네이터의 작업 분해가 너무 좁아, 주제의 모든 관련 영역을 커버하지 못하는 서브에이전트 배정이 됐다
- **②** 합성 에이전트가 커버리지 공백을 식별하는 지침이 없다
- **③** 문서 분석 에이전트가 지나치게 엄격한 기준으로 비시각 창작 소스를 걸러냈다
- **④** 웹 검색 에이전트 쿼리가 충분히 포괄적이지 않다

> **핵심 진단:** 로그가 직접 답을 보여줍니다 — 코디네이터가 주제를 **시각 예술 3개로만 분해** 했습니다. 서브에이전트들은 *배정받은 일을 정확히 수행* 했으므로, 누락의 원인은 명백히 **코디네이터의 좁은 분해** 입니다.

1. **정답** - 코디네이터 로그가 주제를 디지털 아트·그래픽 디자인·사진(모두 시각 예술)으로만 분해하고 음악·글쓰기·영화를 완전히 누락했음을 직접 보여줍니다. 서브에이전트는 모두 배정 작업을 올바로 수행했으므로, 좁은 분해가 명백한 근본 원인입니다.
2. **오답** - 합성 에이전트가 공백을 표시하면 *증상 보고* 에는 도움이 되지만, 애초에 음악·글쓰기 데이터가 *수집되지 않은* 근본 원인은 코디네이터의 분해에 있습니다.
3. **오답** - 로그상 문서 분석은 배정된 작업을 잘 수행했고, 비시각 소스가 *배정 자체에 없었으므로* 필터링 문제가 아닙니다.
4. **오답** - 웹 검색 쿼리도 배정된(시각 예술) 범위 안에서 정상 동작했습니다. 쿼리 확장이 아니라 분해 범위가 문제입니다.

---

## 문제 22
### **Production logs reveal that requests to "analyze the quarterly report I uploaded" are routed to the web search agent 45% of the time instead of the document analysis agent. The web search agent has an `analyze_content` tool described as "analyzes content and extracts key information," while the document analysis agent has an `analyze_document` tool described as "analyzes documents and extracts key information." How should you address this misrouting?**

| 보기 | 설명 |
|------|------|
| 1. Add few-shot examples to the coordinator's prompt showing correct routing. | |
| 2. Expand the document analysis tool's description to include example use cases, leaving the web search tool unchanged. | |
| 3. Add a pre-routing classifier that determines whether the user references uploaded files or web content. | |
| **4. Rename the web search tool to `extract_web_results` and update its description to "processes and returns information retrieved from web searches and URLs."** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

운영 로그에서 "내가 업로드한 분기 보고서를 분석해줘" 요청이 45% 확률로 문서 분석 에이전트 대신 웹 검색 에이전트로 라우팅됩니다. 웹 검색 에이전트는 *"analyzes content and extracts key information"* 으로 설명된 `analyze_content` 도구를, 문서 분석 에이전트는 *"analyzes documents and extracts key information"* 으로 설명된 `analyze_document` 도구를 가집니다. 이 오라우팅을 어떻게 해결해야 합니까?

- **①** 코디네이터 프롬프트에 올바른 라우팅 few-shot 예시 추가
- **②** 웹 검색 도구는 그대로 두고 문서 분석 도구 설명만 확장
- **③** 업로드 파일 vs 웹 콘텐츠를 판별하는 사전 라우팅 분류기 추가
- **④** 웹 검색 도구를 `extract_web_results` 로 **이름 변경** 하고 설명을 "웹 검색·URL에서 가져온 정보를 처리·반환"으로 갱신한다

> **핵심 진단:** 두 도구의 **이름·설명이 거의 동일** (`analyze_content` vs `analyze_document`, 둘 다 "extracts key information")해서 의미적으로 겹칩니다. 근본 원인은 이 **모호한 도구 정의** 이므로, 웹 도구의 이름·설명을 명확히 구별해 겹침을 제거해야 합니다.

1. **오답** - few-shot 예시는 증상을 다루는 우회책이며, 모호한 도구 정의라는 근본 문제는 그대로 남아 다양한 표현에 일반화되지 못합니다.
2. **오답** - 문서 도구 설명만 확장하면 웹 도구의 모호한 `analyze_content` "extracts key information"이 그대로 남아 겹침이 완전히 해소되지 않습니다.
3. **오답** - 사전 분류기는 또 하나의 컴포넌트를 추가하는 복잡한 해법으로, 도구 정의를 명확히 하면 불필요합니다.
4. **정답** - 웹 검색 도구를 `extract_web_results` 로 이름 변경하고 설명을 웹 검색·URL에 명확히 한정하면, 두 도구 간 의미적 겹침이 제거되어 코디네이터가 문서 분석과 웹 검색을 명확히 구별할 수 있습니다. 근본 원인을 직접 해결합니다.

---

## 문제 23
### **The web search and document analysis agents have both completed their tasks and returned findings to the coordinator. What is the appropriate next step for producing an integrated research output?**

| 보기 | 설명 |
|------|------|
| 1. Each agent directly sends its findings to the report generation agent, bypassing the coordinator | |
| **2. The coordinator passes both sets of findings to the synthesis agent for unified integration** | |
| 3. The document analysis agent requests the web search results and merges them internally | |
| 4. The coordinator concatenates the raw outputs from both agents and returns them as the final result | |

**정답: 2.**

**해설:**

**📝 문제 번역**

웹 검색 에이전트와 문서 분석 에이전트가 모두 작업을 마치고 결과를 코디네이터에 반환했습니다. **통합된 조사 결과물** 을 만들기 위한 적절한 다음 단계는?

- **①** 각 에이전트가 코디네이터를 우회해 보고서 생성 에이전트로 직접 전송
- **②** 코디네이터가 두 결과 세트를 **합성(synthesis) 에이전트** 에 넘겨 통합한다
- **③** 문서 분석 에이전트가 웹 검색 결과를 요청해 내부에서 병합
- **④** 코디네이터가 두 원시 출력을 단순 연결해 최종 결과로 반환

> **핵심 진단:** orchestrator-workers 패턴에서 **코디네이터는 결과를 모아 적절한 다음 컴포넌트로 라우팅** 합니다. 통합·정제는 **합성 에이전트** 의 전담 역할입니다.

1. **오답** - 에이전트가 코디네이터를 우회해 직접 통신하면 중앙 통제 원칙을 위반하고, 관리되지 않는 P2P 통신을 만들어 코디네이터의 워크플로 감독 능력을 없앱니다.
2. **정답** - orchestrator-workers 패턴은 코디네이터가 중앙 통제를 유지하며 서브에이전트 결과를 모아 다음 컴포넌트(여기서는 발견을 일관되게 통합·정제하도록 설계된 합성 에이전트)로 라우팅하도록 요구합니다.
3. **오답** - 문서 분석 에이전트가 웹 결과를 직접 가져와 병합하면 역할 경계를 침범하고 우회 통신을 만듭니다.
4. **오답** - 원시 출력을 단순 연결하는 것은 *통합* 이 아니라 나열일 뿐, 일관된 결과물을 만들지 못합니다.

---

## 문제 24
### **The document analysis agent discovers that two credible sources contain directly conflicting statistics: a government report states 40% growth while an industry analysis states 12% growth. Both appear legitimate and the discrepancy could significantly affect conclusions. What's the most effective way for the document analysis agent to handle this?**

| 보기 | 설명 |
|------|------|
| **1. Complete the analysis with both figures included, explicitly annotate the conflict with source attribution, and let the coordinator decide how to reconcile before synthesis.** | |
| 2. Include both figures without flagging them as conflicting, allowing the synthesis agent to determine which to use. | |
| 3. Halt analysis and escalate to the coordinator immediately, asking it to determine which source is authoritative. | |
| 4. Apply source credibility heuristics to select the most likely accurate figure and include a footnote about the discrepancy. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

문서 분석 에이전트가 신뢰할 만한 두 소스에서 **직접 상충하는 통계** 를 발견했습니다: 정부 보고서는 40% 성장, 산업 분석은 12% 성장. 둘 다 합법적으로 보이고 이 불일치는 결론에 큰 영향을 줄 수 있습니다. 문서 분석 에이전트가 이를 다루는 가장 효과적인 방법은?

- **①** 두 수치를 모두 포함해 분석을 완료하고, 출처를 명시해 충돌을 표시한 뒤, 합성 전에 코디네이터가 조정을 결정하게 한다
- **②** 충돌로 표시하지 않고 두 수치를 포함, 합성 에이전트가 선택하게 함
- **③** 분석을 중단하고 즉시 코디네이터에 에스컬레이션해 어느 소스가 권위 있는지 결정 요청
- **④** 신뢰도 휴리스틱으로 정확할 가능성 높은 수치를 선택하고 불일치를 각주로
> **핵심 진단:** **관심사 분리(separation of concerns)** 가 핵심입니다. 문서 분석 에이전트는 자기 일(데이터 추출)을 *차단 없이* 끝내되, 상충 데이터를 **출처와 함께 보존** 하고 *조정 결정* 은 더 넓은 맥락을 가진 코디네이터에 맡깁니다.

1. **정답** - 관심사 분리를 존중하는 가장 효과적인 방식입니다. 문서 분석 에이전트는 작업을 막지 않고 완료하며, 상충하는 두 데이터를 출처 명시와 함께 보존하고, 조정 결정은 더 넓은 맥락을 가진 코디네이터에 적절히 위임합니다.
2. **오답** - 충돌을 표시하지 않으면 다운스트림에서 두 수치가 모순임을 모른 채 잘못 통합할 수 있습니다. 충돌은 **명시적으로 표시** 되어야 합니다.
3. **오답** - 분석을 중단하고 즉시 에스컬레이션하면 나머지 문서 처리를 막아(blocking) 비효율적입니다. 충돌을 기록하고 작업을 계속하는 편이 낫습니다.
4. **오답** - 에이전트가 휴리스틱으로 한 수치를 임의 선택하면, 그 판단이 틀릴 경우 잘못된 결론으로 이어집니다. 조정은 더 넓은 맥락을 가진 코디네이터의 몫입니다.

---

## 문제 25
### **The synthesis agent frequently needs to verify specific claims. Currently it returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis—adding 2-3 round trips per task and increasing latency by 40%. 85% of verifications are simple fact-checks (dates, names, statistics); 15% require deeper investigation. What's the most effective approach to reduce overhead while maintaining reliability?**

| 보기 | 설명 |
|------|------|
| 1. Give the synthesis agent access to all web search tools so it can handle any verification directly. | |
| 2. Have the web search agent proactively cache extra context around each source during initial research. | |
| **3. Give the synthesis agent a scoped `verify_fact` tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator.** | |
| 4. Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

합성 에이전트가 특정 주장을 자주 검증해야 합니다. 현재는 코디네이터로 제어를 돌려보내면 코디네이터가 웹 검색 에이전트를 호출하고 다시 합성을 호출해, 작업당 2~3회 왕복과 40% 지연 증가가 발생합니다. 검증의 85%는 단순 팩트체크(날짜·이름·통계), 15%는 깊은 조사가 필요합니다. 신뢰성을 유지하면서 오버헤드를 줄이는 가장 효과적인 방법은?

- **①** 합성 에이전트에 모든 웹 검색 도구 접근권을 줘 직접 처리
- **②** 웹 검색 에이전트가 초기 조사 때 소스 주변 맥락을 미리 캐싱
- **③** 합성 에이전트에 단순 조회용 **범위 한정 `verify_fact` 도구** 를 주고, 복잡한 검증은 계속 코디네이터를 통해 웹 검색 에이전트에 위임한다
- **④** 합성 에이전트가 모든 검증 필요를 모아 마지막에 배치로 코디네이터에 반환

> **핵심 진단:** **최소 권한 원칙** 입니다. 85%의 단순 조회는 합성 에이전트에 좁은 `verify_fact` 도구를 줘 직접 처리(왕복 제거)하고, 15%의 복잡 검증만 기존 위임 경로를 유지합니다.

1. **오답** - 모든 웹 검색 도구를 주면 관심사 분리를 위반하고 필요 이상으로 과다 권한을 부여해, 합성 본연의 작업 성능을 떨어뜨리고 오용 위험을 키웁니다.
2. **오답** - 미리 캐싱하면 무엇을 검증할지 예측해야 하는데 불확실하고, 불필요한 맥락으로 토큰만 낭비될 수 있습니다.
3. **정답** - 범위 한정 팩트 검증 도구로 85%의 단순 조회를 직접 처리해 대부분의 왕복을 없애고, 15%의 복잡 검증은 코디네이터 위임 경로를 유지합니다. 최소 권한 원칙을 적용해 합성 에이전트를 본연의 작업에 집중시키면서 지연을 크게 줄입니다.
4. **오답** - 검증을 마지막까지 모아 배치하면, 합성 *진행 중* 에 필요한 사실 확인이 지연되어 합성 품질이 떨어집니다.

---

## 문제 26
### **You gave the document analysis agent a general-purpose `fetch_url` tool to load documents from URLs. Production logs reveal it now frequently fetches search engine result pages to conduct ad-hoc web searches—behavior that should route through the web search agent. What's the most effective fix?**

| 보기 | 설명 |
|------|------|
| 1. Add instructions to the agent's prompt clarifying it should only use `fetch_url` for loading document URLs, not searching. | |
| **2. Replace `fetch_url` with a `load_document` tool that validates URLs point to document formats.** | |
| 3. Remove `fetch_url` and route all URL loading through the coordinator to the web search agent. | |
| 4. Implement filtering that blocks `fetch_url` calls to known search engine domains while allowing other URLs. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

문서 분석 에이전트에 URL에서 문서를 불러오도록 범용 `fetch_url` 도구를 줬습니다. 운영 로그를 보니 이 에이전트가 검색 엔진 결과 페이지를 자주 가져와 임시 웹 검색을 수행합니다 — 원래 웹 검색 에이전트로 라우팅되어야 할 동작입니다. 가장 효과적인 수정은?

- **①** 프롬프트에 `fetch_url` 은 문서 URL 로딩에만 쓰라고 명시
- **②** `fetch_url` 을 **문서 형식 URL인지 검증하는 `load_document` 도구** 로 교체한다
- **③** `fetch_url` 을 제거하고 모든 URL 로딩을 코디네이터 통해 웹 검색 에이전트로
- **④** 알려진 검색 엔진 도메인 호출만 차단하는 필터 구현

> **핵심 진단:** 프롬프트 지침(soft)으로 제약하면 LLM이 무시할 수 있습니다. **인터페이스(도구) 수준에서 능력 자체를 제약** 하는 것이 최소 권한 원칙에 맞고 견고합니다.

1. **오답** - 프롬프트 지침은 도구가 기술적으로 허용하는 한 LLM이 무시·오해할 수 있어 강제력이 약합니다. 증상에 대한 soft guidance일 뿐입니다.
2. **정답** - 범용 도구를 **문서 형식 URL인지 검증하는 전용 도구** 로 교체하면 인터페이스 수준에서 능력을 제약합니다. 최소 권한 원칙을 따라 원치 않는 검색 동작을 *불가능* 하게 만듭니다(단지 권장하지 않는 것이 아님).
3. **오답** - `fetch_url` 을 아예 제거하면 정당한 문서 로딩까지 매번 코디네이터를 거쳐야 해 불필요한 왕복·복잡성이 늘어납니다.
4. **오답** - 도메인 블랙리스트 필터는 알려진 검색 엔진만 막아 우회가 쉽고(새 도메인·프록시 등) 근본적으로 능력을 제약하지 못합니다.

---

## 문제 27
### **The document analysis subagent frequently fails on PDFs—some have corrupted sections, others are password-protected, and occasionally the parser times out on large files. Currently any exception immediately terminates the subagent and returns an error to the coordinator, causing excessive coordinator involvement in routine error handling. What's the most effective architectural improvement?**

| 보기 | 설명 |
|------|------|
| **1. Have the subagent implement local recovery for transient failures and only propagate errors it cannot resolve to the coordinator, including what was attempted and any partial results.** | |
| 2. Configure the subagent to always return partial results with success status, embedding error details in metadata. | |
| 3. Have the coordinator validate all documents before dispatching, rejecting documents likely to fail. | |
| 4. Create a dedicated error-handling agent that monitors all subagent failures via a shared queue. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

문서 분석 서브에이전트가 PDF에서 자주 실패합니다 — 일부는 섹션 손상, 일부는 암호 보호, 가끔 큰 파일에서 파서 timeout. 현재는 어떤 예외든 즉시 서브에이전트를 종료시키고 코디네이터에 에러를 반환해, **일상적 에러 처리에 코디네이터가 과도하게 개입** 합니다. 가장 효과적인 아키텍처 개선은?

- **①** 서브에이전트가 일시적 실패는 로컬 복구하고, 스스로 해결 못하는 에러만 (시도 내역·부분 결과 포함해) 코디네이터에 전파한다
- **②** 항상 성공 상태로 부분 결과를 반환하고 에러는 메타데이터에 담음
- **③** 코디네이터가 디스패치 전에 모든 문서를 검증해 실패 가능 문서를 거부
- **④** 공유 큐로 모든 실패를 감시하는 전용 에러 처리 에이전트 신설

> **핵심 진단:** **에러는 해결 가능한 가장 낮은 수준에서 처리** 한다는 원칙입니다. 일시적 실패(timeout 등)는 서브에이전트가 로컬 복구하고, *진짜* 해결 불가능한 것만 맥락과 함께 코디네이터로 올립니다.

1. **정답** - 일시적 실패를 서브에이전트 내부에서 로컬 복구하는 것은 "해결 가능한 가장 낮은 수준에서 처리" 원칙을 따릅니다. 코디네이터의 과도한 개입을 줄이면서, 진짜 해결 불가한 문제만 시도 내역·부분 결과 등 충분한 맥락과 함께 에스컬레이션합니다.
2. **오답** - 모든 응답을 성공으로 처리하면 코디네이터가 실패를 인지하지 못해 가시성이 사라지고, 합성 단계로 문제 데이터가 흘러갈 위험이 있습니다.
3. **오답** - 코디네이터가 사전 검증하면 또 다른 병목·과부하를 만들고, 손상 여부는 실제 파싱 전엔 확정하기 어려워 비현실적입니다.
4. **오답** - 전용 에러 처리 에이전트 + 공유 큐는 상당한 복잡성을 더하는 과잉 설계입니다. 로컬 복구가 더 단순·효과적입니다.

---

## 문제 28
### **The web search subagent times out while researching a complex topic. You need to design how this failure flows back to the coordinator. Which error propagation approach best enables intelligent recovery?**

| 보기 | 설명 |
|------|------|
| 1. Implement automatic retry with exponential backoff within the subagent, returning a generic "search unavailable" status only after all retries are exhausted. | |
| 2. Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow. | |
| **3. Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches.** | |
| 4. Catch the timeout within the subagent and return an empty result set marked as successful. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

웹 검색 서브에이전트가 복잡한 주제 조사 중 timeout 됐습니다. 이 실패 정보가 코디네이터로 흘러가는 방식을 설계해야 합니다. **지능적 복구** 를 가장 잘 가능케 하는 에러 전파 방식은?

- **①** 서브에이전트 내부에서 지수 백오프 자동 재시도, 모두 소진 후 일반적 "search unavailable" 상태만 반환
- **②** timeout 예외를 최상위 핸들러로 직접 전파해 전체 워크플로 종료
- **③** 실패 유형, 시도한 쿼리, 부분 결과, 가능한 대안 접근을 포함한 **구조화된 에러 맥락** 을 코디네이터에 반환한다
- **④** 서브에이전트가 timeout을 잡아 성공으로 표시된 빈 결과 반환

> **핵심 진단:** 코디네이터가 **지능적 복구 결정** 을 내리려면 단순 성공/실패가 아니라 **풍부한 구조화된 맥락**(유형·쿼리·부분 결과·대안)이 필요합니다.

1. **오답** - 백오프 재시도는 유용할 수 있으나, 소진 후 *일반적* "search unavailable"만 반환하면 코디네이터가 쿼리 수정·대안 시도 같은 정보에 기반한 결정을 내릴 맥락을 잃습니다.
2. **오답** - 최상위로 전파해 전체를 종료하면 한 번의 timeout으로 모든 진행을 버리는 지나친 대응입니다.
3. **정답** - 실패 유형·시도 쿼리·부분 결과·대안 접근을 담은 구조화된 에러 맥락은, 코디네이터가 수정된 쿼리로 재시도하거나 부분 결과로 진행하는 등 지능적 복구를 하기에 필요한 모든 정보를 제공합니다. 조정 수준에서 최대 맥락을 보존하므로 최선입니다.
4. **오답** - 성공으로 표시된 빈 결과는 **실패를 숨겨**, 코디네이터가 실제로는 데이터가 없는데 있는 것처럼 오판하게 만듭니다.

---

## 문제 29
### **Production monitoring reveals inconsistent synthesis quality. When aggregated results total ~75K tokens, the synthesis agent reliably cites the first 15K tokens and the final 10K tokens, but frequently omits critical findings in the middle 50K tokens—even when they directly address the research question. How should you restructure the aggregated input?**

| 보기 | 설명 |
|------|------|
| 1. Summarize all subagent outputs to under 20K tokens total before aggregation. | |
| 2. Stream subagent results incrementally, processing web search results first to completion before document analysis findings. | |
| 3. Implement rotation that alternates which subagent's results appear first across tasks. | |
| **4. Place a key findings summary at the beginning of the aggregated input and organize detailed results with explicit section headers.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

운영 모니터링에서 합성 품질이 들쭉날쭉합니다. 집계 결과가 ~75K 토큰일 때 합성 에이전트는 처음 15K와 마지막 10K는 안정적으로 인용하지만, **중간 50K** 의 중요한 발견은 — 연구 질문에 직접 답하는 것조차 — 자주 빠뜨립니다. 집계 입력을 어떻게 재구성해야 합니까?

- **①** 집계 전 모든 출력을 20K 미만으로 요약
- **②** 결과를 점진적으로 스트리밍, 웹 검색을 먼저 완료 후 문서 분석
- **③** 작업마다 어느 서브에이전트 결과가 먼저 오는지 교대(rotation)
- **④** 집계 입력 **맨 앞에 핵심 발견 요약** 을 두고, 상세 결과를 **명시적 섹션 헤더** 로 정리한다

> **핵심 진단:** 전형적인 **"lost in the middle"** 현상입니다. 모델은 시작(primacy)·끝(recency)에 강하고 중간을 놓칩니다. 핵심 요약을 맨 앞(가장 신뢰도 높은 위치)에 두고, 헤더로 중간 탐색을 돕습니다.

1. **오답** - 20K 미만으로 공격적 요약하면 lost-in-the-middle은 피하지만 **상세 발견의 정보 손실** 이 원 문제보다 더 나쁠 수 있습니다.
2. **오답** - 스트리밍/순차 처리는 어느 쪽을 먼저 처리하든 여전히 긴 컨텍스트의 중간 누락 문제를 근본적으로 해결하지 못합니다.
3. **오답** - 시작 위치를 교대시키면 *평균적으로* 공평해질 뿐, 매 작업에서 중간 콘텐츠 누락은 그대로 발생합니다.
4. **정답** - 핵심 발견 요약을 맨 앞에 두면 primacy 효과로 가장 안정적으로 주목되는 위치를 차지합니다. 명시적 섹션 헤더는 모델이 중간 콘텐츠를 탐색·주목하도록 도와 'lost in the middle'을 직접 완화합니다.

---

## 문제 30
### **Combined outputs from the web search agent (85K tokens including page content) and the document analysis agent (70K tokens including reasoning chains) total 155K tokens, but the synthesis agent performs optimally under 50K tokens. What's the most effective solution?**

| 보기 | 설명 |
|------|------|
| **1. Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning** | |
| 2. Store findings in a vector database and give the synthesis agent retrieval tools to query during its work | |
| 3. Have the synthesis agent process findings in sequential batches, maintaining running state between calls | |
| 4. Add an intermediate summarization agent that condenses findings before passing to synthesis | |

**정답: 1.**

**해설:**

**📝 문제 번역**

웹 검색 에이전트(페이지 콘텐츠 포함 85K)와 문서 분석 에이전트(추론 체인 포함 70K)의 합산 출력이 155K 토큰인데, 합성 에이전트는 50K 미만에서 최적 동작합니다. 가장 효과적인 해법은?

- **①** 상류 에이전트가 장황한 콘텐츠·추론 대신 **구조화된 데이터**(핵심 사실·인용·관련성 점수)를 반환하도록 수정한다
- **②** 발견을 벡터 DB에 저장하고 합성 에이전트에 검색 도구 제공
- **③** 합성 에이전트가 순차 배치로 처리하며 상태 유지
- **④** 합성 전에 발견을 압축하는 중간 요약 에이전트 추가

> **핵심 진단:** 토큰 폭증의 원인은 **상류 출력의 장황함**(원문 페이지 콘텐츠·추론 체인)입니다. **소스(상류)에서** 구조화된 핵심 데이터만 반환하게 하면 근본 원인을 제거하면서 정보 가치는 보존합니다.

1. **정답** - 상류 에이전트가 핵심 사실·인용·관련성 점수 같은 구조화된 데이터를 반환하면 근본 원인(소스의 장황함)을 해결합니다. 합성에 가치 없는 원문 페이지·추론 체인을 제거해 토큰을 줄이면서 핵심 정보는 보존합니다.
2. **오답** - 벡터 DB + 검색은 상당한 인프라를 더하는 과잉 설계이며, 합성 에이전트가 무엇을 검색해야 할지 모를 위험도 있습니다.
3. **오답** - 순차 배치 처리는 상태 관리가 복잡하고, 배치 간 맥락 단절로 통합 품질이 떨어질 수 있습니다.
4. **오답** - 중간 요약 에이전트는 추가 LLM 호출·비용·실패 지점을 만들고, 요약 과정에서 정보가 손실됩니다. 소스에서 구조화하는 것이 더 직접적입니다.

---

## 문제 31
### **A pull request modifies 14 files across the stock tracking module. Your single-pass review analyzing all files together produces inconsistent results: detailed feedback for some files but superficial comments for others, obvious bugs missed, and contradictory feedback—flagging a pattern as problematic in one file while approving identical code elsewhere in the same PR. How should you restructure the review?**

| 보기 | 설명 |
|------|------|
| **1. Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow.** | |
| 2. Run three independent review passes on the full PR and only flag issues that appear in at least two of three runs. | |
| 3. Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass. | |
| 4. Require developers to split large PRs into smaller submissions of 3-4 files before review. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

PR이 재고 추적 모듈의 14개 파일을 수정합니다. 모든 파일을 한 번에 분석하는 단일 패스 리뷰가 일관되지 않은 결과를 냅니다: 일부 파일엔 상세 피드백, 일부엔 피상적 코멘트, 명백한 버그 누락, 그리고 모순된 피드백(같은 PR에서 한 파일의 패턴은 문제로 표시하면서 다른 곳의 동일 코드는 승인). 리뷰를 어떻게 재구성해야 합니까?

- **①** 집중 패스로 분리: 각 파일을 개별 분석해 국소 이슈를 보고, 별도의 통합 패스로 파일 간 데이터 흐름을 검사한다
- **②** 전체 PR에 3회 독립 리뷰 후 2회 이상 나온 이슈만 표시
- **③** 더 큰 컨텍스트의 상위 모델로 전환해 한 패스로
- **④** 개발자에게 큰 PR을 3~4개 파일로 쪼개 제출하게 강제

> **핵심 진단:** 근본 원인은 **주의 분산(attention dilution)** — 14개 파일을 한꺼번에 보면 각 파일에 주의가 고르게 가지 않습니다. 파일별 집중 패스(국소 이슈) + 별도 통합 패스(교차 관심사)로 분리하면 두 차원을 모두 일관되게 다룹니다.

1. **정답** - 파일별 집중 패스로 분리하면 주의 분산이라는 근본 원인을 직접 해결해 일관된 깊이를 보장하고 국소 이슈를 안정적으로 잡습니다. 별도의 통합 중심 패스가 데이터 흐름 의존성 같은 교차 파일 관심사를 처리해 리뷰 품질의 두 차원을 모두 커버합니다.
2. **오답** - 같은 단일 패스를 3번 돌려 투표하면 비용이 3배가 되고, 모든 패스가 동일한 주의 분산을 겪으므로 일관되게 *놓치는* 이슈는 계속 놓칩니다.
3. **오답** - 더 큰 컨텍스트 모델도 여전히 한 번에 14개 파일을 보면 주의 분산이 발생할 수 있어 근본 해결이 아닙니다.
4. **오답** - PR 크기 제한은 프로세스에 부담을 주는 우회책이며, 큰 PR을 *그대로* 일관되게 리뷰하는 문제를 해결하지 못합니다.

---

## 문제 32
### **Your automated code review averages 15 findings per PR, with a 40% false positive rate. The bottleneck is investigation time: developers must click into each finding to read Claude's reasoning before deciding. Your CLAUDE.md already contains comprehensive rules, and stakeholders have rejected any approach that filters findings before developer review. What change would best address the investigation time bottleneck?**

| 보기 | 설명 |
|------|------|
| 1. Configure Claude to only surface findings it assesses as high confidence, filtering out uncertain flags. | |
| 2. Add a post-processor that suppresses findings matching historical false positive signatures. | |
| **3. Require Claude to include its reasoning and confidence assessment inline with each finding.** | |
| 4. Categorize findings as "blocking issues" versus "suggestions" with tiered review requirements. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

자동 코드 리뷰가 PR당 평균 15개 발견을 내고 오탐률은 40%입니다. 병목은 **조사 시간** — 개발자가 각 발견을 클릭해 Claude의 추론을 읽어야 처리/기각을 결정합니다. CLAUDE.md에는 이미 포괄적 규칙이 있고, 이해관계자들은 **개발자 리뷰 전에 발견을 필터링하는 방식을 거부** 했습니다. 조사 시간 병목을 가장 잘 해결하는 변경은?

- **①** 고신뢰 발견만 노출하고 불확실한 것은 필터링
- **②** 과거 오탐 시그니처와 일치하는 발견을 억제하는 후처리기
- **③** 각 발견에 **추론과 신뢰도 평가를 인라인** 으로 포함하도록 요구한다
- **④** 발견을 "차단 이슈" vs "제안"으로 분류하고 차등 리뷰

> **핵심 진단:** 제약이 핵심 — **필터링 금지**. 병목은 "각 발견을 클릭해 추론을 읽어야 함"이므로, 추론·신뢰도를 **인라인으로 같이 표시** 하면 클릭 없이 빠르게 트리아지할 수 있고 필터링도 하지 않습니다.

1. **오답** - 고신뢰만 노출하면 **개발자 리뷰 전 필터링 금지** 라는 제약을 정면으로 위반합니다.
2. **오답** - 후처리 억제 역시 발견을 사전에 걸러내는 것이라 같은 제약을 위반합니다.
3. **정답** - 추론·신뢰도 평가를 각 발견에 인라인으로 포함하면, 개발자가 각각을 클릭하지 않고도 빠르게 평가할 수 있어 조사 시간 병목을 직접 해결합니다. 모든 발견이 그대로 보이므로 필터링 금지 제약도 지킵니다.
4. **오답** - 차단/제안 분류도 일종의 우선순위 차등이며, 조사 시간 자체(추론을 읽어야 하는 클릭 비용)를 줄이지 못합니다.

---

## 문제 33
### **Your pipeline script runs `claude "Analyze this pull request for security issues"` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct approach to run Claude Code in an automated pipeline?**

| 보기 | 설명 |
|------|------|
| 1. Set the environment variable `CLAUDE_HEADLESS=true` before running the command | |
| **2. Add the `-p` flag: `claude -p "Analyze this pull request for security issues"`** | |
| 3. Add the `--batch` flag: `claude --batch "Analyze this pull request for security issues"` | |
| 4. Redirect stdin from /dev/null: `claude "Analyze this pull request for security issues" < /dev/null` | |

**정답: 2.**

**해설:**

**📝 문제 번역**

파이프라인 스크립트가 `claude "..."` 를 실행하는데 작업이 무한정 멈춥니다. 로그를 보면 Claude Code가 **대화형 입력을 기다리는** 중입니다. 자동화 파이프라인에서 Claude Code를 실행하는 올바른 방법은?

- **①** 실행 전 환경 변수 `CLAUDE_HEADLESS=true` 설정
- **②** `-p` 플래그 추가: `claude -p "..."`
- **③** `--batch` 플래그 추가
- **④** stdin을 `/dev/null` 에서 리다이렉트

> **핵심 진단:** Claude Code는 기본 **대화형(interactive)** 모드라 입력을 기다립니다. CI/CD에선 입력이 없어 hang이 발생합니다. 해법은 비대화형 실행 플래그 **`-p`(`--print`)** 입니다.

```bash
# ❌ 멈춤: 대화형 모드
claude "Analyze this pull request for security issues"

# ✅ 정상: 비대화형 — 결과를 stdout에 출력하고 종료
claude -p "Analyze this pull request for security issues"
```

1. **오답** - `CLAUDE_HEADLESS=true` 는 Claude Code의 문서화된/지원되는 기능이 아닙니다. 비대화형으로 전환되지 않아 여전히 멈춥니다.
2. **정답** - `-p`(또는 `--print`)는 비대화형 실행의 공식 방법입니다. 프롬프트를 처리해 결과를 stdout에 출력하고 입력을 기다리지 않고 종료하므로 CI/CD에 이상적입니다.
3. **오답** - `--batch` 는 존재하지 않는 플래그라 오류가 나거나 무시됩니다.
4. **오답** - `/dev/null` 리다이렉트는 문서화된 공식 비대화형 방식이 아닌 임시 우회책으로, 출력 형식·종료 코드가 자동화에 맞게 보장되지 않습니다.

---

## 문제 34
### **Your CI pipeline runs the Claude Code CLI (`--print` mode) using CLAUDE.md for code reviews. Reviews are insightful, but Claude produces narrative paragraphs that must be manually copied into PR comments. Your team wants to automatically post each finding as a separate inline PR comment, which requires structured data with file path, line number, severity, and suggested fix. What's the most effective approach?**

| 보기 | 설명 |
|------|------|
| 1. Keep the narrative format but add a summarization step that uses Claude to generate a structured JSON summary. | |
| 2. Include formatting instructions in your prompt requiring a parseable template like `[FILE:path] [LINE:n] [SEVERITY:level] ...`. | |
| 3. Add a "Review Output Format" section to CLAUDE.md with examples of structured findings. | |
| **4. Use CLI flags `--output-format json` and `--json-schema` to enforce structured findings, then parse output to post inline comments via the GitHub API.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

CI 파이프라인이 CLAUDE.md를 사용해 Claude Code CLI(`--print` 모드)로 코드 리뷰를 합니다. 리뷰는 통찰력 있지만, 서술형 문단으로 나와 PR 코멘트에 수동 복사해야 합니다. 팀은 각 발견을 별도 인라인 PR 코멘트로 **자동 게시** 하고 싶고, 이를 위해 파일 경로·라인 번호·심각도·제안 수정이 담긴 **구조화 데이터** 가 필요합니다. 가장 효과적인 접근은?

- **①** 서술형 유지 + Claude로 구조화 JSON 요약을 만드는 단계 추가
- **②** 프롬프트에 `[FILE:path] [LINE:n] ...` 같은 파싱 가능 템플릿 지침 추가
- **③** CLAUDE.md에 "Review Output Format" 섹션과 예시 추가
- **④** CLI 플래그 `--output-format json` 과 `--json-schema` 로 구조화 출력을 강제하고, 파싱해 GitHub API로 인라인 코멘트 게시한다

> **핵심 진단:** **CLI 수준에서** 구조화 출력을 *강제* 하는 것이 가장 신뢰성 높습니다. `--output-format json` + `--json-schema` 는 필수 필드를 가진 well-formed JSON을 보장합니다.

1. **오답** - 서술형을 다시 JSON으로 요약하는 두 번째 LLM 호출은 불필요한 복잡성·비용·또 다른 실패 지점을 더합니다. 원래 호출에서 구조화를 강제하면 더 직접적입니다.
2. **오답** - 프롬프트로 템플릿을 요구하는 방식은 **강제력이 약해** 모델이 가끔 형식을 벗어나며, 파싱 실패가 발생할 수 있습니다.
3. **오답** - CLAUDE.md 예시로 형식을 유도하는 것도 soft guidance라 일관성이 보장되지 않습니다.
4. **정답** - `--output-format json` 과 `--json-schema` 는 CLI 수준에서 구조화 출력을 강제해, 필수 필드(파일 경로·라인·심각도·수정 제안)를 가진 well-formed JSON을 보장합니다. 이를 안정적으로 파싱해 GitHub API로 인라인 코멘트를 게시할 수 있어 가장 효과적입니다.

---

## 문제 35
### **Your CI/CD system performs three types of Claude-powered analysis: (1) quick style checks on each PR that block merging, (2) comprehensive security audits run weekly, and (3) test case generation triggered nightly. The Message Batches API offers 50% cost savings but can take up to 24 hours. Which combination correctly matches each task to its API approach?**

| 보기 | 설명 |
|------|------|
| **1. Use synchronous calls for PR style checks; use the Message Batches API for weekly security audits and nightly test generation.** | |
| 2. Use the Message Batches API for all three tasks to maximize cost savings, polling for completion. | |
| 3. Use synchronous calls for PR style checks and nightly test generation; use Message Batches API only for weekly security audits. | |
| 4. Use synchronous calls for all three tasks for consistent response times, relying on prompt caching to reduce costs. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

CI/CD가 세 종류 Claude 분석을 수행합니다: (1) 머지를 차단하는 PR별 빠른 스타일 검사, (2) 주간 종합 보안 감사, (3) 야간 테스트 케이스 생성. Message Batches API는 50% 비용 절감을 주지만 최대 24시간 걸립니다. 각 작업을 API 방식에 올바르게 매칭한 조합은?

- **①** PR 스타일 검사는 동기 호출, 주간 보안 감사·야간 테스트 생성은 Batches API
- **②** 셋 다 Batches API + 폴링
- **③** PR 스타일 검사·야간 테스트 생성은 동기, 주간 보안 감사만 Batches API
- **④** 셋 다 동기 + 프롬프트 캐싱

> **핵심 진단:** 기준은 **지연 허용 여부**. *머지를 차단해 개발자가 기다리는* 작업은 동기, *예약·야간 작업* 은 24시간 배치 윈도를 견디므로 Batches API로 50% 절감.

| 작업 | 지연 허용 | API |
|------|-----------|-----|
| PR 스타일 검사(머지 차단) | ❌ 즉시 필요 | 동기 |
| 주간 보안 감사 | ✅ 유연 | Batches |
| 야간 테스트 생성 | ✅ 유연 | Batches |

1. **정답** - PR 스타일 검사는 개발자를 차단하므로 동기 호출로 즉시 응답해야 하고, 주간 보안 감사·야간 테스트 생성은 일정이 유연해 최대 24시간 배치 윈도를 쉽게 견디므로 둘 다 50% 절감을 얻습니다.
2. **오답** - 셋 다 배치로 하면 PR 스타일 검사가 머지를 차단하는데 최대 24시간 걸려 개발 흐름을 망칩니다.
3. **오답** - 야간 테스트 생성은 지연 허용 작업이므로 배치로 돌려 절감해야 하는데, 동기로 두면 절감 기회를 놓칩니다.
4. **오답** - 셋 다 동기로 하면 지연 허용 작업의 50% 절감 기회를 모두 놓칩니다. 프롬프트 캐싱은 다른 종류의 절감이라 배치 절감을 대체하지 못합니다.

---

## 문제 36
### **Your CI pipeline includes two Claude-powered modes: a `pre-merge-commit` hook that blocks PR merging until complete, and "deep analysis" that runs overnight, polls for batch completion, then posts suggestions. You want to reduce costs using the Message Batches API (50% savings, requires polling, up to 24 hours). Which mode should use batch processing?**

| 보기 | 설명 |
|------|------|
| **1. Deep analysis only** | |
| 2. Pre-merge-commit hook only | |
| 3. Neither mode | |
| 4. Both modes | |

**정답: 1.**

**해설:**

**📝 문제 번역**

CI 파이프라인에 두 모드가 있습니다: 완료될 때까지 PR 머지를 차단하는 `pre-merge-commit` 훅, 그리고 야간에 돌며 배치 완료를 폴링한 뒤 제안을 게시하는 "deep analysis". Message Batches API(50% 절감, 폴링 필요, 최대 24시간)로 비용을 줄이려 합니다. 어느 모드가 배치 처리를 써야 합니까?

- **①** Deep analysis만
- **②** Pre-merge-commit 훅만
- **③** 둘 다 아님
- **④** 둘 다

> **핵심 진단:** Deep analysis는 이미 *야간 실행 + 폴링* 구조라 배치 API의 비동기·폴링 설계와 완벽히 맞습니다. Pre-merge 훅은 머지를 *차단* 하므로 24시간 지연을 견딜 수 없습니다.

1. **정답** - Deep analysis는 이미 야간에 돌고 지연을 허용하며 완료를 폴링하는 모델이라, Message Batches API의 비동기·폴링 설계와 정확히 맞으면서 50% 절감을 얻습니다.
2. **오답** - Pre-merge 훅은 머지를 차단하므로 최대 24시간 배치 지연은 치명적입니다(반대).
3. **오답** - Deep analysis는 배치에 이상적인데 "둘 다 아님"은 명백한 절감 기회를 버립니다.
4. **오답** - Pre-merge 훅까지 배치로 하면 머지가 최대 하루 막혀 개발이 멈춥니다.

---

## 문제 37
### **Currently, real-time Claude calls power two workflows: (1) a blocking pre-merge check that must complete before merging, and (2) a technical debt report generated overnight for the next morning. Your manager proposes switching both to the Message Batches API for 50% savings. How should you evaluate this proposal?**

| 보기 | 설명 |
|------|------|
| 1. Switch both to batch processing with a timeout fallback to real-time if batches take too long. | |
| 2. Switch both workflows to batch processing with status polling. | |
| 3. Keep real-time calls for both workflows to avoid batch result ordering issues. | |
| **4. Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

현재 실시간 Claude 호출이 두 워크플로를 구동합니다: (1) 머지 전 완료되어야 하는 차단형 pre-merge 검사, (2) 다음 날 아침을 위해 야간 생성되는 기술 부채 보고서. 매니저가 50% 절감을 위해 둘 다 Batches API로 바꾸자고 제안합니다. 어떻게 평가해야 합니까?

- **①** 둘 다 배치 + 너무 오래 걸리면 실시간으로 timeout 폴백
- **②** 둘 다 배치 + 상태 폴링
- **③** 배치 결과 순서 문제를 피하려 둘 다 실시간 유지
- **④** 기술 부채 보고서만 배치, pre-merge 검사는 실시간 유지

> **핵심 진단:** 각 워크플로를 **지연 요구에 맞는 API** 에 매칭 — 차단형 pre-merge는 실시간, 야간 보고서는 배치(50% 절감).

1. **오답** - timeout 폴백은 불필요한 복잡성을 더하고, pre-merge 워크플로에 여전히 지연·비일관 동작 위험을 남깁니다.
2. **오답** - 둘 다 배치면 차단형 pre-merge가 최대 24시간 막혀 개발자가 머지하지 못합니다.
3. **오답** - 야간 보고서는 지연 허용이라 배치로 절감해야 하는데, 둘 다 실시간으로 두면 절감 기회를 놓칩니다("순서 문제"는 batch에 custom_id가 있어 실제 장애물이 아님).
4. **정답** - Batches API의 최대 24시간·SLA 미보장 특성은 야간 기술 부채 보고서엔 이상적이지만, 개발자가 기다리는 차단형 pre-merge 검사엔 부적합합니다. 각 워크플로를 지연 요구에 맞게 매칭하는 것이 옳습니다.

---

## 문제 38
### **The code review component works iteratively: Claude analyzes a changed file, then may request related files (imports, base classes, tests) via tool calling before providing feedback. You're evaluating batch processing to reduce costs. What is the primary technical constraint?**

| 보기 | 설명 |
|------|------|
| 1. Batch processing lacks request correlation identifiers for matching outputs to input requests. | |
| 2. The batch API doesn't support tool definitions in request parameters. | |
| 3. Batch processing latency of up to 24 hours is too slow for PR feedback, though the workflow could otherwise function. | |
| **4. The asynchronous model prevents executing tools mid-request and returning results for Claude to continue analysis.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

코드 리뷰 컴포넌트가 반복적으로 동작합니다: Claude가 변경 파일을 분석하다 도구 호출로 관련 파일(import·기반 클래스·테스트)을 요청해 맥락을 얻은 뒤 피드백을 줍니다. 비용 절감을 위해 배치 처리를 검토 중입니다. **주된 기술적 제약** 은?

- **①** 배치는 출력-입력 매칭용 상관 식별자가 없다
- **②** 배치 API는 요청 파라미터에 도구 정의를 지원하지 않는다
- **③** 최대 24시간 지연이 PR 피드백엔 너무 느리다(다른 면은 동작 가능)
- **④** 비동기 모델이라 요청 *도중* 도구를 실행하고 결과를 돌려줘 Claude가 분석을 이어가게 할 수 없다

> **핵심 진단:** 배치 API는 **fire-and-forget 비동기** 모델입니다. 반복적 tool-calling은 *한 논리적 상호작용 안에서* 여러 차례 도구 호출→결과 반환→계속이 필요한데, 비동기 배치는 그 중간 개입이 불가능합니다.

1. **오답** - 배치는 각 요청에 `custom_id` 를 제공해 출력을 입력에 매칭할 수 있으므로 제약이 아닙니다.
2. **오답** - 배치 API도 요청에 도구 정의를 포함할 수 있으므로 제약이 아닙니다.
3. **오답** - 24시간 지연은 *불편* 하지만, 질문이 묻는 "근본적 기술 제약"은 지연이 아니라 반복 tool-calling 자체가 깨진다는 점입니다.
4. **정답** - 배치 API의 비동기 fire-and-forget 모델은 요청 도중 도구 호출을 가로채 실행하고 결과를 돌려줘 Claude가 분석을 이어가게 하는 메커니즘이 없습니다. 이는 여러 라운드의 도구 호출·응답을 요구하는 반복적 워크플로를 근본적으로 깨뜨립니다.

---

## 문제 39
### **Your automated review generates test case suggestions. When reviewing a PR that adds course completion tracking, Claude suggests 10 test cases but developers indicate 6 duplicate scenarios already covered in the existing test suite. What change would most effectively reduce duplicate suggestions?**

| 보기 | 설명 |
|------|------|
| 1. Reduce requested suggestions from 10 to 5, assuming Claude will prioritize the most valuable cases. | |
| **2. Include the existing test file in the context so Claude can identify what scenarios are already covered.** | |
| 3. Add instructions directing Claude to focus exclusively on edge cases and error conditions. | |
| 4. Implement post-processing that filters suggestions whose descriptions match keywords from existing test names. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

자동 리뷰가 테스트 케이스 제안을 생성합니다. 과정 이수 추적을 추가하는 PR을 리뷰할 때 Claude가 10개를 제안하는데, 개발자들은 그중 6개가 **기존 테스트 스위트에 이미 있는** 시나리오라고 합니다. 중복 제안을 가장 효과적으로 줄이는 변경은?

- **①** 제안 수를 10→5로 줄이면 가치 높은 것 우선할 것
- **②** **기존 테스트 파일을 컨텍스트에 포함** 해 Claude가 이미 커버된 시나리오를 식별하게 한다
- **③** 엣지 케이스·에러 조건에만 집중하라는 지침 추가
- **④** 기존 테스트 이름 키워드와 일치하는 제안을 거르는 후처리

> **핵심 진단:** 중복의 근본 원인은 Claude가 **기존 테스트가 무엇인지 모른다** 는 것입니다. 기존 테스트 파일을 컨텍스트에 넣어주면 무엇이 새롭고 가치 있는지 추론할 수 있습니다.

1. **오답** - 단순히 개수를 줄여도 어떤 시나리오가 이미 커버됐는지 정보가 없어 비중복을 우선할 근거가 없습니다. 오히려 가장 뻔한(이미 있는) 제안이 남기 쉽습니다.
2. **정답** - 기존 테스트 파일을 컨텍스트에 포함하면 중복의 근본 원인을 직접 해결합니다. Claude는 이미 존재하는 테스트를 알아야만 정말로 새롭고 가치 있는 제안을 추론할 수 있습니다.
3. **오답** - 엣지 케이스에만 집중하라는 지침은 유용한 정상 경로 테스트까지 배제할 수 있고, 여전히 기존 커버리지를 모르므로 중복을 근본적으로 막지 못합니다.
4. **오답** - 키워드 매칭 후처리는 표현이 다른 중복은 못 거르고, 이름이 비슷한 정당한 신규 제안을 잘못 제거할 수 있어 취약합니다.

---

## 문제 40
### **Your automated code review shows inconsistent severity ratings—similar issues like null pointer risks receive "critical" in some PRs but "medium" in others. Developer trust is declining. What's the most effective way to improve severity consistency?**

| 보기 | 설명 |
|------|------|
| 1. Add a CLAUDE.md file listing issue types and default severities, instructing Claude to reference this mapping. | |
| **2. Include explicit severity criteria in your prompt with concrete code examples for each severity level.** | |
| 3. Modify the prompt to rate severity relative to other issues in the same PR. | |
| 4. Request Claude include reasoning for each severity, then manually calibrate during review. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

자동 코드 리뷰의 심각도 등급이 일관되지 않습니다 — null 포인터 위험 같은 비슷한 이슈가 어떤 PR에선 "critical", 다른 PR에선 "medium". 개발자 신뢰가 떨어지고 있습니다. 심각도 일관성을 높이는 가장 효과적인 방법은?

- **①** CLAUDE.md에 이슈 유형별 기본 심각도 매핑을 적고 참조하게 함
- **②** 프롬프트에 각 심각도 수준에 대한 **명확한 기준 + 구체적 코드 예시** 를 포함한다
- **③** 같은 PR 내 다른 이슈 대비 상대 평가하도록 프롬프트 수정
- **④** 각 심각도에 추론을 포함시킨 뒤 리뷰 중 수동 보정

> **핵심 진단:** 일관성 없음의 근본 원인은 **"각 심각도가 무엇을 의미하는지"가 모호** 한 것입니다. 구체적 코드 예시를 동반한 명확한 기준이 모델에 분명한 기준점을 줍니다.

1. **오답** - 정적 유형→심각도 매핑은 맥락을 잃습니다. 같은 null 포인터라도 코드 경로·노출도·영향 컴포넌트의 중요도에 따라 심각도가 달라져야 하는데, 경직된 매핑은 이를 단순화해 부정확해집니다.
2. **정답** - 각 심각도 수준에 대한 명확한 기준과 구체적 코드 예시를 프롬프트에 포함하면 "각 수준이 무엇을 의미하는가"의 모호함을 제거합니다. 검증된 프롬프트 엔지니어링 기법으로, 모델에 명확한 분류 기준점을 줘 더 신뢰할 수 있고 예측 가능한 등급을 만듭니다.
3. **오답** - 같은 PR 내 상대 평가는 **PR마다 기준이 달라져** 오히려 일관성을 해칩니다(심각한 이슈가 없는 PR에선 사소한 것이 critical이 됨).
4. **오답** - 추론 포함 + 수동 보정은 사람 손이 매번 개입해야 해 확장성이 없고, 모델의 일관성 자체를 개선하지 못합니다.

---

## 문제 41
### **Your team uses Claude Code to generate code suggestions, but subtle issues—performance optimizations that break edge cases, cleanups that change behavior—only surface when a different team member reviews the PR. Claude's reasoning during generation shows it considered these cases but concluded its approach was correct. Which approach directly addresses the root cause of this self-review limitation?**

| 보기 | 설명 |
|------|------|
| 1. Add explicit self-review instructions to the generation prompt, asking Claude to critique its own suggestions before finalizing. | |
| **2. Have a second, independent Claude Code instance review the changes without seeing the generator's reasoning.** | |
| 3. Enable extended thinking mode for the generation pass for more thorough deliberation. | |
| 4. Include comprehensive test files and documentation in the prompt context so Claude better understands expected behavior. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

팀이 Claude Code로 코드 제안을 생성하는데, 미묘한 이슈(엣지 케이스를 깨는 성능 최적화, 동작을 바꾸는 정리)가 **다른 팀원이 PR을 리뷰할 때야** 드러납니다. 생성 중 Claude의 추론을 보면 이런 케이스를 고려했지만 자기 접근이 옳다고 결론지었습니다. 이 자기 리뷰의 한계의 근본 원인을 직접 해결하는 방법은?

- **①** 생성 프롬프트에 자기 비평 지침 추가
- **②** **추론을 보지 않는 독립적인 두 번째 Claude Code 인스턴스** 가 변경을 리뷰하게 한다
- **③** 생성 패스에 extended thinking 활성화
- **④** 테스트 파일·문서를 컨텍스트에 포함

> **핵심 진단:** 근본 원인은 **확증 편향(confirmation bias)** — 같은 맥락에서 이미 "내 접근이 맞다"고 합리화한 모델은 자기 비평을 해도 같은 결론에 이릅니다. 생성기의 추론을 *모르는* 독립 인스턴스가 신선한 관점으로 봐야 합니다.

1. **오답** - 같은 맥락에서 자기 제안을 비평하게 해도, 이미 옳다고 결론짓게 만든 동일한 확증 편향이 자기 리뷰에도 작용해 같은 결론에 도달합니다. 문제 설명대로 Claude는 이미 케이스를 고려하고 합리화했습니다.
2. **정답** - 생성기의 추론에 접근하지 않는 독립적인 두 번째 인스턴스를 쓰면 확증 편향을 제거해 근본 원인을 직접 해결합니다. 다른 팀원의 동료 리뷰가 원작자가 합리화해 넘긴 이슈를 잡아내는 효과를 그대로 재현합니다.
3. **오답** - extended thinking은 더 깊은 숙고를 주지만, 여전히 *같은 맥락·같은 편향* 안에서 이뤄져 자기 합리화를 깨지 못합니다.
4. **오답** - 테스트·문서 추가는 생성 품질엔 도움될 수 있으나, "이미 고려했지만 옳다고 합리화한" 자기 리뷰의 편향 문제를 직접 해결하지 못합니다.

---

## 문제 42
### **Your automated reviews identify valid issues but feedback isn't actionable—findings say "complex ticket allocation logic" or "potential null pointer" without specifying what to change. When you add instructions like "always include specific fix suggestions," output is still inconsistent. What prompting technique would most reliably produce consistently actionable feedback?**

| 보기 | 설명 |
|------|------|
| 1. Implement a two-pass approach where one prompt identifies issues and a second generates fixes. | |
| 2. Expand the context window to include more of the surrounding codebase. | |
| 3. Further refine the instructions with more explicit requirements for each part of the feedback format. | |
| **4. Add 3-4 few-shot examples showing the exact format you want: issue identified, code location, specific fix suggestion.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

자동 리뷰가 유효한 이슈를 찾지만 피드백이 실행 가능하지 않습니다 — "복잡한 티켓 할당 로직", "잠재적 null 포인터"처럼 *무엇을 바꿔야 할지* 명시가 없습니다. "항상 구체적 수정 제안을 포함하라" 같은 지침을 추가해도 출력이 여전히 들쭉날쭉합니다(때론 상세, 때론 모호). 일관되게 실행 가능한 피드백을 가장 안정적으로 만드는 프롬프트 기법은?

- **①** 이슈 식별 프롬프트 + 수정 생성 프롬프트의 2패스
- **②** 주변 코드베이스를 더 포함하도록 컨텍스트 확장
- **③** 피드백 형식의 각 부분에 더 명시적인 요구를 더해 지침을 재정련
- **④** 원하는 정확한 형식(이슈·위치·구체적 수정)을 보여주는 **few-shot 예시 3~4개** 추가

> **핵심 진단:** **추상적 지침만으로 출력이 들쭉날쭉할 때** 일관된 형식을 얻는 가장 효과적인 기법은 **few-shot 예시** 입니다. 따라야 할 구체적 패턴을 보여주기 때문입니다.

1. **오답** - 2패스는 아키텍처 복잡성만 더하고, *왜 때때로 모호한 출력이 나오는지* 라는 형식 일관성 문제를 직접 해결하지 못합니다.
2. **오답** - 컨텍스트 확장은 정보는 늘리지만, 문제는 정보 부족이 아니라 **출력 형식의 일관성** 이라 핵심을 빗나갑니다.
3. **오답** - 이미 명시적 지침이 실패했습니다. 추상적 지침을 더 정련해도 모델이 일관되게 따르지 못하는 근본 한계는 남습니다.
4. **정답** - few-shot 예시는 지침만으로 출력이 변동할 때 일관된 형식을 달성하는 가장 효과적인 기법입니다. 원하는 형식(이슈·위치·구체적 수정)을 보여주는 예시 3~4개가 추상적 지침보다 신뢰성 높은 구체적 패턴을 제공합니다.

---

## 문제 43
### **Your automated review analyzes comments and docstrings. The current prompt instructs Claude to "check that comments are accurate and up-to-date." Findings frequently flag acceptable patterns (TODO markers, straightforward descriptions) while missing comments that describe behavior the code no longer implements. What change addresses the root cause of this inconsistent analysis?**

| 보기 | 설명 |
|------|------|
| 1. Filter out TODO, FIXME, and descriptive comment patterns before analysis to reduce noise | |
| 2. Add few-shot examples of misleading comments to help the model recognize similar patterns | |
| 3. Include git blame data so Claude can identify comments that predate recent code modifications | |
| **4. Specify explicit criteria: flag comments only when their claimed behavior contradicts actual code behavior** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

자동 리뷰가 주석과 docstring을 분석합니다. 현재 프롬프트는 *"주석이 정확하고 최신인지 확인하라"* 고 지시합니다. 그 결과 허용 가능한 패턴(TODO 표시·단순 설명)은 자주 문제로 표시하면서, **코드가 더 이상 수행하지 않는 동작을 설명하는 주석** 은 놓칩니다. 이 일관성 없는 분석의 근본 원인을 해결하는 변경은?

- **①** 분석 전 TODO·FIXME·서술형 주석을 걸러 노이즈 감소
- **②** 오해를 부르는 주석의 few-shot 예시 추가
- **③** git blame 데이터로 최근 수정보다 앞선 주석 식별
- **④** 명확한 기준 명시: 주석이 주장하는 동작이 **실제 코드 동작과 모순될 때만** 플래그

> **핵심 진단:** 근본 원인은 *"정확하고 최신인지 확인"* 이라는 **모호한 지시문** 입니다. *무엇을 문제로 볼지* 정의가 없어 오탐(정상 주석 표시)과 누락(잘못된 주석 놓침)이 동시에 발생합니다. 검증 가능한 명확한 기준으로 대체해야 합니다.

| 구분 | 판단 기준 |
|------|-----------|
| 🔴 기존 (모호) | "정확하고 최신인지 확인" → 매번 기준이 달라짐 |
| 🟢 개선 (명확) | "주장하는 동작이 **실제 코드와 모순될 때만**" |

1. **오답** - TODO·FIXME 사전 필터링은 *오탐(false positive)* 한 증상만 다루고, **코드가 더 이상 안 하는 동작을 설명하는 주석을 놓치는 누락(false negative)** 문제는 그대로 둡니다.
2. **오답** - few-shot 예시는 특정 패턴 인식엔 도움되지만, "무엇이 문제인가"의 기준이 정의되지 않아 예시에 없는 새 형태는 계속 놓치고 모호한 오탐도 남습니다.
3. **오답** - git blame(작성 시점)은 주석이 *언제* 쓰였는지 알려줄 뿐 **정확성과 무관** 합니다. 오래된 주석도 옳을 수 있고 새 주석도 틀릴 수 있습니다.
4. **정답** - "주장하는 동작이 실제 코드와 모순될 때만 플래그"라는 명확하고 검증 가능한 기준으로 모호한 지시를 대체하면, 정상 패턴의 오탐과 진짜 오해를 부르는 주석의 누락을 한 번에 해결합니다.

---

## 문제 44
### **After an initial review generates 12 findings, a developer pushes new commits to address them. When the review runs again, it produces 8 findings—but developers report 5 duplicate earlier comments on code already fixed. What's the most effective way to eliminate this redundant feedback while maintaining thorough analysis?**

| 보기 | 설명 |
|------|------|
| **1. Include prior review findings in context, instructing Claude to only report new or still-unaddressed issues.** | |
| 2. Restrict the review scope to only files modified in the most recent push. | |
| 3. Run reviews only on initial PR creation and final pre-merge state, skipping intermediate commits. | |
| 4. Add a post-processing filter that removes findings matching previous file paths and issue descriptions. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

초기 리뷰가 12개 발견을 내고 개발자가 이를 고치는 새 커밋을 푸시합니다. 리뷰를 다시 돌리니 8개가 나오는데, 그중 5개가 **이미 고친 코드에 대한** 이전 코멘트의 중복이라고 합니다. 철저한 분석을 유지하면서 이 중복 피드백을 없애는 가장 효과적인 방법은?

- **①** **이전 리뷰 발견을 컨텍스트에 포함** 하고, 새롭거나 아직 미해결인 이슈만 보고하라고 지시한다
- **②** 리뷰 범위를 최근 푸시에서 수정된 파일로만 제한
- **③** 초기 PR 생성과 최종 pre-merge 상태에서만 리뷰, 중간 커밋 생략
- **④** 이전 파일 경로·이슈 설명과 일치하는 발견을 제거하는 후처리 필터

> **핵심 진단:** 이전 발견을 컨텍스트에 주면 Claude가 **"이미 해결됨" vs "새 이슈"** 를 추론으로 구별할 수 있습니다. 철저함은 유지하면서 중복만 제거합니다.

1. **정답** - 이전 리뷰 발견을 컨텍스트에 포함하면 Claude가 추론 능력으로 새 이슈와 최근 커밋이 해결한 이슈를 지능적으로 구별합니다. 철저한 분석을 유지하면서 고쳐진 코드에 대한 중복 피드백을 피합니다.
2. **오답** - 최근 푸시 파일로만 제한하면 **다른 파일의 새 이슈를 놓쳐** 철저함이 깨집니다.
3. **오답** - 중간 커밋을 건너뛰면 개발 중 도입된 문제에 대한 적시 피드백을 잃습니다.
4. **오답** - 경로·설명 매칭 후처리는 표현이 조금만 달라도 못 거르고, 진짜 새 이슈를 잘못 제거할 수 있어 취약합니다(LLM 추론 기반 구별이 더 정확).

---

## 문제 45
### **Analysis shows variation in false positive rates: security/correctness 8%, performance 18%, style/naming 52%, documentation 48%. Developers are dismissing findings without review because "half are wrong," and high false positive categories are undermining confidence in the accurate ones. What approach best restores trust while improving the system?**

| 보기 | 설명 |
|------|------|
| 1. Keep all categories but display a confidence score with each finding. | |
| 2. Keep all categories enabled while adding few-shot examples to improve accuracy over coming weeks. | |
| **3. Temporarily disable high false positive categories (style, naming, documentation) and run only high-precision categories while improving prompts.** | |
| 4. Apply a uniform strictness reduction across all categories to bring the overall false positive rate down. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

오탐률이 카테고리별로 크게 다릅니다: 보안/정확성 8%, 성능 18%, 스타일/네이밍 52%, 문서 48%. 개발자들이 "절반이 틀렸다"며 리뷰 없이 발견을 기각하기 시작했고, 고오탐 카테고리가 정확한 카테고리의 신뢰까지 갉아먹습니다. 시스템을 개선하면서 신뢰를 회복하는 최선의 접근은?

- **①** 모든 카테고리 유지 + 각 발견에 신뢰도 점수 표시
- **②** 모두 유지하며 몇 주간 few-shot로 정확도 개선
- **③** 고오탐 카테고리(스타일·네이밍·문서)를 일시 비활성화하고 고정밀 카테고리만 돌리며 프롬프트 개선
- **④** 모든 카테고리에 균일한 엄격도 완화 적용

> **핵심 진단:** 신뢰 붕괴의 원인은 **고오탐 카테고리의 노이즈** 입니다. 이를 일시 비활성화하면 신뢰 침식을 즉시 멈추고, 고정밀 카테고리(보안·정확성)의 가치는 보존하며, 그동안 문제 카테고리 프롬프트를 개선할 수 있습니다.

1. **오답** - 신뢰도 점수는 평가 부담을 개발자에게 전가할 뿐 노이즈를 실제로 줄이지 못하고, 이미 신뢰를 잃은 개발자는 시스템의 자체 신뢰도 점수도 믿지 않습니다.
2. **오답** - 모두 켠 채 몇 주간 개선하면 그동안 노이즈가 계속되어 신뢰 침식이 멈추지 않습니다(시급성 무시).
3. **정답** - 고오탐 카테고리를 일시 비활성화하면 모든 발견을 기각하게 만드는 노이즈를 제거해 신뢰 침식을 즉시 멈추고, 보안·정확성 같은 고정밀 카테고리의 가치는 보존합니다. 그동안 문제 카테고리 프롬프트를 개선해 정확도를 입증한 뒤 재활성화하여 신뢰를 재건합니다.
4. **오답** - 균일한 엄격도 완화는 8% 오탐의 우수한 카테고리(보안)까지 둔감하게 만들어 진짜 중대한 이슈를 놓치게 됩니다.

---

## 문제 46
### **Your `get_customer` tool returns all matches when searching by name. Claude currently picks the customer with the most recent order when multiple results are returned, but production data shows this causes 15% of multi-match cases to proceed with the wrong customer account. How should you address this?**

| 보기 | 설명 |
|------|------|
| 1. Modify `get_customer` to return only the single most likely match based on a ranking algorithm. | |
| **2. Instruct Claude to ask for an additional identifier (email, phone, or order number) when `get_customer` returns multiple matches, before taking any customer-specific action.** | |
| 3. Add few-shot examples showing Claude how to use conversational context to infer the correct customer without clarification. | |
| 4. Implement a confidence scoring system that proceeds automatically above 85% confidence and prompts below it. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

`get_customer` 도구가 이름 검색 시 모든 일치를 반환합니다. 현재 Claude는 여러 결과가 오면 가장 최근 주문 고객을 고르는데, 운영 데이터상 다중 일치의 15%가 **잘못된 고객 계정** 으로 진행됩니다. 어떻게 해결해야 합니까?

- **①** `get_customer` 가 랭킹 알고리즘으로 단일 최유력 일치만 반환하도록 수정
- **②** 다중 일치 시 고객별 작업 전에 **추가 식별자(이메일·전화·주문번호)를 요청** 하도록 Claude에 지시한다
- **③** 대화 맥락으로 올바른 고객을 추론하는 few-shot 예시 추가
- **④** 85% 이상이면 자동 진행, 미만이면 확인하는 신뢰도 점수 시스템

> **핵심 진단:** 동명이인 모호성은 **추측으로 해결할 수 없습니다**. 자신의 신원을 확실히 아는 *사용자* 에게 추가 식별자를 묻는 한 번의 대화가 15% 오류를 없앱니다.

1. **오답** - 랭킹으로 단일 일치만 반환하면 모호성을 Claude에게서 숨겨, 동명이인 상황을 인지·처리할 능력을 제거합니다. 랭킹이 틀리면 여전히 잘못된 고객으로 진행됩니다.
2. **정답** - 사용자에게 추가 식별자(이메일·전화·주문번호)를 묻는 것이 다중 일치를 해소하는 가장 신뢰성 높은 방법입니다. 사용자는 자기 신원을 확실히 알기 때문입니다. 한 번의 추가 대화로 15% 오류를 없애는 작은 비용입니다.
3. **오답** - 대화 맥락 추론은 여전히 *추측* 이라, 맥락이 불충분하면 틀립니다. 확정적 식별자 확인이 필요합니다.
4. **오답** - 자동 진행 임계값(85%)도 결국 모호한 경우의 일부를 추측으로 진행시켜, 잘못된 계정 위험을 완전히 제거하지 못합니다.

---

## 문제 47
### **When your agent resolves complex cases (billing disputes, multi-order returns), customer satisfaction is 15% lower than for simple cases—even when resolutions are correct. The agent provides accurate resolutions but inconsistently explains reasoning: sometimes omitting policy details, other times missing timeline information or next steps. The gaps vary by case. You want to improve quality without adding human review. Which approach is most effective?**

| 보기 | 설명 |
|------|------|
| **1. Add a self-critique step where the agent evaluates its draft response for completeness—addressing the concern, including relevant context, and anticipating follow-ups.** | |
| 2. Add a confirmation step where the agent asks "Does this fully address your concern?" before closing. | |
| 3. Implement few-shot examples showing complete resolution explanations for five common complex case types. | |
| 4. Increase the model tier from Haiku to Sonnet for complex cases. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

에이전트가 복잡한 케이스(청구 분쟁·다중 주문 반품)를 해결할 때 고객 만족도가 단순 케이스보다 15% 낮습니다 — 해결이 정확해도 그렇습니다. 정확한 해결을 제공하지만 *추론 설명* 이 들쭉날쭉합니다(때론 정책 세부 누락, 때론 타임라인·다음 단계 누락). **공백이 케이스마다 다릅니다.** 사람 리뷰 없이 품질을 높이려면 가장 효과적인 접근은?

- **①** 에이전트가 초안 응답의 완전성(우려 해결·관련 맥락·후속 질문 예상)을 스스로 평가하는 **자기 비평 단계** 추가
- **②** 종료 전 "이게 우려를 완전히 해결했나요?" 묻는 확인 단계
- **③** 5개 일반 복잡 케이스 유형의 완전한 설명을 보여주는 few-shot
- **④** 복잡 케이스는 모델을 Haiku→Sonnet으로 상향

> **핵심 진단:** 공백이 **케이스마다 다르다** 는 점이 핵심입니다. 고정된 few-shot이나 모델 상향으로는 가변적 공백을 다 못 메웁니다. **자기 비평(evaluator-optimizer)** 이 각 초안을 기준(정책·타임라인·다음 단계)에 비춰 케이스별 공백을 잡아냅니다.

1. **정답** - 자기 비평 단계(evaluator-optimizer 패턴)는 에이전트가 제시 전에 자기 초안을 정책 맥락·타임라인·다음 단계 같은 구체 기준에 비춰 평가하게 해, 케이스마다 다른 설명 완전성 공백을 사람 리뷰 없이 직접 잡아냅니다.
2. **오답** - 종료 전 확인 질문은 부담을 *고객* 에게 떠넘기고, 고객이 무엇이 빠졌는지 모를 수 있어 근본적으로 설명 완전성을 보장하지 못합니다.
3. **오답** - few-shot은 다섯 *유형* 의 모범을 보여주지만, 공백이 케이스마다 *가변적* 이라 예시에 없는 상황의 누락은 메우지 못합니다.
4. **오답** - 모델 상향은 정확성을 높일 순 있으나, 문제는 정확성이 아니라 *설명의 일관된 완전성* 이라 핵심을 빗나갑니다.

---

## 문제 48
### **Production logs reveal: when customers include "account" in messages, the agent calls `get_customer` first 78% of the time. When customers phrase similar requests without "account," it calls `lookup_order` first 93% of the time. The tool descriptions are well-written and unambiguous. What is the most likely root cause?**

| 보기 | 설명 |
|------|------|
| 1. The tool descriptions need negative examples specifying when NOT to use each tool. | |
| **2. The system prompt contains keyword-sensitive instructions that steer behavior based on terms like "account," creating unintended tool selection patterns.** | |
| 3. The model's base training creates associations between "account" terminology and customer operations that override tool descriptions. | |
| 4. The model requires more training data on multi-concept messages and should be fine-tuned. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

운영 로그: 고객 메시지에 "account"가 포함되면 에이전트가 78% 확률로 `get_customer` 를 먼저 호출. "account" 없이 비슷한 요청을 하면 93% 확률로 `lookup_order` 를 먼저 호출. **도구 설명은 잘 쓰여 있고 모호하지 않습니다.** 가장 가능성 높은 근본 원인은?

- **①** 도구 설명에 "쓰지 말아야 할 때" 부정 예시 필요
- **②** **시스템 프롬프트에 "account" 같은 용어에 반응하는 키워드 민감 지침** 이 있어 의도치 않은 도구 선택 패턴을 만든다
- **③** 모델의 기본 학습이 "account"↔고객 연관을 만들어 도구 설명을 덮어씀
- **④** 다중 개념 메시지 학습 데이터 부족 → 파인튜닝 필요

> **핵심 진단:** **체계적이고 키워드 트리거된 패턴(78% vs 93%)** 은 명시적 라우팅 로직의 신호입니다. 도구 설명이 이미 명확하다고 했으므로, 원인은 상류의 **시스템 프롬프트 지침** 이 "account"에 반응하는 것입니다.

1. **오답** - 도구 설명에 부정 예시를 더하라는 것은 "설명이 이미 잘 쓰여 있고 모호하지 않다"는 전제와 모순됩니다. 문제는 설명이 아니라 상류 프롬프트입니다.
2. **정답** - 체계적이고 키워드 트리거된 패턴(78% vs 93%)은 "account"에 반응해 고객 관련 도구로 유도하는 명시적 라우팅 로직이 시스템 프롬프트에 있음을 강하게 시사합니다. 도구 설명이 이미 명확하므로 원인은 프롬프트 수준의 의도치 않은 행동 유도입니다.
3. **오답** - 기본 학습 연관이라면 이렇게 *날카롭고 일관된 임계 패턴(78%/93%)* 보다 더 분산된 행동이 나옵니다. 깔끔한 키워드 경계는 명시적 지침을 가리킵니다.
4. **오답** - 파인튜닝은 과도하고 비현실적인 해법이며, 증거(키워드 트리거 패턴)는 프롬프트 문제를 가리키지 학습 데이터 부족을 가리키지 않습니다.

---

## 문제 49
### **Production logs show the agent frequently calls `get_customer` when users ask about orders (e.g., "check my order #12345"), instead of `lookup_order`. Both tools have minimal descriptions ("Retrieves customer information" / "Retrieves order details") and accept similar identifier formats. What's the most effective first step to improve tool selection reliability?**

| 보기 | 설명 |
|------|------|
| **1. Expand each tool's description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus similar tools.** | |
| 2. Consolidate both tools into a single `lookup_entity` tool that internally determines which backend to query. | |
| 3. Add few-shot examples to the system prompt demonstrating correct tool selection (5-8 examples). | |
| 4. Implement a routing layer that parses user input and pre-selects the appropriate tool based on keywords. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

운영 로그상 에이전트가 주문 관련 질문("check my order #12345")에도 `lookup_order` 대신 `get_customer` 를 자주 호출합니다. 두 도구 모두 **최소한의 설명**("Retrieves customer information" / "Retrieves order details")만 있고 유사한 식별자 형식을 받습니다. 도구 선택 신뢰성을 높이는 가장 효과적인 **첫 단계** 는?

- **①** 각 도구 설명을 **입력 형식·예시 쿼리·엣지 케이스·유사 도구 대비 사용 경계** 까지 담도록 확장한다
- **②** 두 도구를 단일 `lookup_entity` 로 통합
- **③** 시스템 프롬프트에 올바른 선택을 보여주는 few-shot 5~8개 추가
- **④** 키워드로 도구를 미리 고르는 라우팅 레이어 구현

> **핵심 진단:** 근본 원인은 **최소한의 도구 설명** 입니다. LLM이 도구를 고르는 1차 메커니즘이 설명이므로, 입력 형식·예시·경계를 담아 확장하는 것이 저비용·고효과의 첫 단계입니다.

1. **정답** - 입력 형식·예시 쿼리·엣지 케이스·사용 경계를 담아 도구 설명을 확장하는 것은 근본 원인(유사 도구를 구별 못 하게 만드는 빈약한 설명)을 직접 해결합니다. LLM의 도구 선택 1차 메커니즘을 개선하는 저비용·고레버리지 첫 단계입니다.
2. **오답** - 두 도구를 하나로 통합하면 표면적 혼동은 줄지만 관심사 분리를 잃고, 백엔드 판별 로직을 도구 내부로 숨겨 디버깅·제어가 어려워집니다(첫 단계로 과함).
3. **오답** - few-shot도 도움되지만, *먼저* 해야 할 근본 조치는 빈약한 설명 자체를 고치는 것입니다. 좋은 설명이 1차 메커니즘입니다.
4. **오답** - 외부 라우팅 레이어는 또 다른 컴포넌트를 더하는 복잡한 해법으로, 첫 단계로는 과합니다.

---

## 문제 50
### **Production data shows that in 12% of cases, your agent skips `get_customer` entirely and calls `lookup_order` using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?**

| 보기 | 설명 |
|------|------|
| 1. Implement a routing classifier that enables only the subset of tools appropriate for each request type. | |
| 2. Add few-shot examples showing the agent always calling `get_customer` first, even when customers volunteer order details. | |
| **3. Add a programmatic prerequisite that blocks `lookup_order` and `process_refund` calls until `get_customer` has returned a verified customer ID.** | |
| 4. Enhance the system prompt to state that customer verification via `get_customer` is mandatory before any order operations. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

운영 데이터상 12%의 경우 에이전트가 `get_customer` 를 완전히 건너뛰고 고객이 말한 이름만으로 `lookup_order` 를 호출해, 때때로 계정 오인·잘못된 환불로 이어집니다. 이 신뢰성 문제를 가장 효과적으로 해결하는 변경은?

- **①** 요청 유형에 맞는 도구 부분집합만 활성화하는 라우팅 분류기
- **②** 고객이 주문 정보를 먼저 줘도 항상 `get_customer` 를 먼저 부르는 few-shot 추가
- **③** `get_customer` 가 검증된 고객 ID를 반환할 때까지 `lookup_order`·`process_refund` 호출을 **프로그램적으로 차단** 하는 전제조건 추가
- **④** 시스템 프롬프트에 주문 작업 전 `get_customer` 검증이 필수라고 명시

> **핵심 진단:** 핵심은 **필수 순서(검증 → 주문 작업)를 강제** 하는 것입니다. 프롬프트/few-shot은 LLM이 가끔 어길 수 있는 soft 방어책입니다. **프로그램적 전제조건** 만이 결정적으로 순서를 보장합니다.

1. **오답** - 라우팅 분류기는 *어떤* 도구가 가용한지를 다룰 뿐, *어떤 순서로* 호출해야 하는지를 강제하지 못합니다. 핵심 이슈는 순서 강제입니다.
2. **오답** - few-shot은 올바른 순서를 *유도* 하지만 강제하지 못해, LLM이 여전히 12% 같은 경우에 건너뛸 수 있습니다.
3. **정답** - `get_customer` 가 검증된 고객 ID를 반환하기 전엔 다운스트림 도구를 차단하는 프로그램적 전제조건은 필수 순서를 **결정적으로 보장** 합니다. LLM 행동과 무관하게 검증 건너뛰기를 불가능하게 만들어 가장 효과적입니다.
4. **오답** - 시스템 프롬프트의 "필수"라는 지시도 soft guidance라 LLM이 가끔 무시할 수 있어, 12% 오류를 완전히 없애지 못합니다.

---

## 문제 51
### **Production metrics show your agent averages 4+ API round-trips per resolution. Analysis reveals Claude frequently requests `get_customer` and `lookup_order` in separate sequential turns even when both are needed upfront. What's the most effective way to reduce round-trips?**

| 보기 | 설명 |
|------|------|
| 1. Increase `max_tokens` to give Claude more space to plan ahead and naturally batch its tool requests. | |
| 2. Implement speculative execution that automatically calls likely-needed tools alongside any requested tool. | |
| 3. Create composite tools like `get_customer_with_orders` that bundle common lookup combinations into single calls. | |
| **4. Prompt Claude to batch tool requests per turn, and return all tool results together before the next API call.** | |

**정답: 4.**

**해설:**

**📝 문제 번역**

운영 지표상 에이전트가 해결당 평균 4회 이상 API 왕복을 합니다. 분석하니 Claude가 둘 다 처음부터 필요한데도 `get_customer` 와 `lookup_order` 를 **별도의 순차 턴** 으로 따로 요청합니다. 왕복을 줄이는 가장 효과적인 방법은?

- **①** `max_tokens` 를 늘려 미리 계획·배치하게 함
- **②** 요청된 도구와 함께 필요할 법한 도구를 자동 호출하는 추측 실행
- **③** `get_customer_with_orders` 같은 복합 도구로 흔한 조합 번들
- **④** Claude가 턴당 도구 요청을 **배치(batch)** 하도록 프롬프트하고, 다음 API 호출 전에 모든 결과를 함께 반환한다

> **핵심 진단:** Claude는 **한 턴에 여러 도구를 동시에 요청** 하는 네이티브 능력이 있습니다. 이를 활용하도록 프롬프트하고 결과를 함께 돌려주면, 최소 변경으로 순차 호출 패턴을 해결합니다.

1. **오답** - `max_tokens` 는 Claude 텍스트 출력의 최대 길이에만 영향을 줄 뿐, 여러 도구를 한 턴에 배치할지 여부와 무관해 왕복 감소에 의미 있는 효과가 없습니다.
2. **오답** - 추측 실행은 불필요한 도구까지 호출해 비용·부작용 위험을 키우고, 요청과 무관한 결과를 돌려줘 혼란을 줄 수 있습니다.
3. **오답** - 복합 도구는 *특정 조합* 만 해결하며, 가능한 모든 조합마다 도구를 만들면 도구 수가 폭증하고 유지보수가 어렵습니다.
4. **정답** - 관련 도구 요청을 한 턴에 배치하고 모든 결과를 함께 반환하도록 프롬프트하면 Claude의 네이티브 병렬 도구 호출 능력을 활용합니다. 최소한의 아키텍처 변경으로 순차 호출 패턴을 직접 해결하는 가장 효과적인 방법입니다.

---

## 문제 52
### **You're implementing the agentic loop for your support agent. After each API call to Claude, you need to determine whether to continue the loop (execute the requested tools and call Claude again) or stop (present the final response). What determines this decision?**

| 보기 | 설명 |
|------|------|
| 1. Check whether the response includes any assistant text content—if Claude generated text, the loop should end. | |
| **2. Check the `stop_reason` field in Claude's response—continue when it equals `"tool_use"` and stop when it equals `"end_turn"`.** | |
| 3. Parse Claude's response text for phrases like "I've completed" or "Is there anything else?" | |
| 4. Set a maximum iteration count (e.g., 10 calls) and stop when reached, regardless of whether Claude indicates more work. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

지원 에이전트의 agentic 루프를 구현 중입니다. Claude API 호출마다 루프를 계속할지(요청된 도구 실행 후 다시 호출) 멈출지(최종 응답 제시) 결정해야 합니다. 무엇이 이 결정을 좌우합니까?

- **①** 응답에 어시스턴트 텍스트가 있는지 확인 — 텍스트가 있으면 루프 종료
- **②** 응답의 **`stop_reason` 필드** 확인 — `"tool_use"` 면 계속, `"end_turn"` 이면 종료
- **③** "I've completed", "Is there anything else?" 같은 문구를 텍스트에서 파싱
- **④** 최대 반복 횟수(예: 10회)를 두고 도달 시 종료

> **핵심 진단:** `stop_reason` 은 Claude가 주는 **명시적·구조화된 루프 제어 신호** 입니다. `"tool_use"` = 도구 실행 후 결과를 돌려달라, `"end_turn"` = 응답 완료.

```python
while True:
    resp = client.messages.create(...)
    if resp.stop_reason == "tool_use":
        results = run_tools(resp)      # 도구 실행
        messages.append(results)       # 결과 추가 후 계속
    elif resp.stop_reason == "end_turn":
        break                          # 최종 응답 → 종료
```

1. **오답** - Claude는 도구 사용 요청과 *함께* 설명 텍스트를 같은 응답에 자주 생성합니다. 텍스트의 존재가 작업 완료를 의미하지 않으므로 잘못된 기준입니다.
2. **정답** - `stop_reason` 은 루프 제어를 위한 명시적·구조화된 신호입니다. `"tool_use"` 는 도구를 실행해 결과를 받고 싶다는 뜻, `"end_turn"` 은 응답을 마쳤으니 루프를 종료해야 한다는 뜻입니다.
3. **오답** - 자연어 문구 파싱은 깨지기 쉽습니다. 표현이 다양하고 Claude가 그런 문구 없이 끝내거나, 중간에 비슷한 말을 할 수도 있어 신뢰할 수 없습니다.
4. **오답** - 최대 반복 횟수는 **무한 루프 안전장치** 로는 유용하지만, 작업 완료 여부를 판단하는 *주된* 기준이 될 수 없습니다(작업이 덜 끝났어도 끊거나, 끝났는데 계속함).

---

## 문제 53
### **Your support agent uses progressive summarization—when context reaches 70% capacity, older turns are summarized while recent ones remain verbatim. Customers reference specific amounts ("the 15% discount I mentioned"), but the agent responds with incorrect values. These details were stated 20+ turns ago and got condensed into vague summaries like "discussed promotional pricing." What's the most effective fix?**

| 보기 | 설명 |
|------|------|
| 1. Increase the summarization threshold from 70% to 85% capacity. | |
| **2. Extract transactional facts (amounts, dates, order numbers) into a persistent "case facts" block included in each prompt, outside the summarized history.** | |
| 3. Revise the summarization prompt to explicitly preserve all numerical values, percentages, dates, and customer-stated expectations verbatim. | |
| 4. Store full conversation history externally and implement retrieval when the agent detects reference phrases like "as I mentioned." | |

**정답: 2.**

**해설:**

**📝 문제 번역**

지원 에이전트가 점진적 요약을 씁니다 — 컨텍스트가 70% 차면 오래된 턴을 요약하고 최근 턴은 원문 유지. 고객이 특정 수치("내가 말한 15% 할인")를 언급하는데 에이전트가 틀린 값으로 답합니다. 이 세부는 20턴 이상 전에 말해졌고 "프로모션 가격 논의" 같은 모호한 요약으로 압축됐습니다. 가장 효과적인 수정은?

- **①** 요약 임계값을 70%→85%로 상향
- **②** 거래 사실(금액·날짜·주문번호)을 **요약된 기록 밖의 영속 "case facts" 블록** 으로 추출해 매 프롬프트에 포함한다
- **③** 모든 수치·퍼센트·날짜·고객 진술을 원문 보존하도록 요약 프롬프트 수정
- **④** 전체 대화를 외부 저장하고 "as I mentioned" 감지 시 검색

> **핵심 진단:** 요약은 본질적으로 정밀 세부에 **손실 압축** 입니다. 근본 해법은 거래 사실을 **요약 대상 밖** 의 구조화된 블록에 보존해, 몇 턴이 요약되든 매 프롬프트에 항상 존재하게 하는 것입니다.

1. **오답** - 70%→85% 상향은 요약 시점을 늦출 뿐입니다. 긴 대화는 결국 요약을 트리거해 같은 세부를 잃으므로 임시 우회책입니다.
2. **정답** - 거래 사실(금액·날짜·주문번호)을 영속 "case facts" 블록으로 추출하면 근본 원인을 해결합니다. 요약은 정밀 세부에 손실적이지만, 핵심 정보를 요약 기록 밖의 구조화된 블록에 보존하면 몇 턴이 요약되든 매 프롬프트에서 안정적으로 가용합니다.
3. **오답** - 요약 프롬프트에 "모두 보존하라"고 해도 결국 *무엇을 보존할지* 모델 판단에 의존해 신뢰성이 낮고, 대화가 길어지면 보존 대상조차 다시 압축됩니다.
4. **오답** - 외부 저장 + 검색은 강력하지만 인프라가 무겁고, "as I mentioned" 같은 트리거 구문 감지에 의존해 누락 위험이 있습니다. 핵심 사실 블록이 더 단순·신뢰성 높습니다.

---

## 문제 54
### **Production logs reveal that the agent misinterprets data from your MCP tools: Unix timestamps from `get_customer`, ISO 8601 dates from `lookup_order`, and numeric status codes (1=pending, 2=shipped). Some tools are third-party MCP servers you cannot modify. What's the most maintainable approach to normalize data formats?**

| 보기 | 설명 |
|------|------|
| **1. Use a PostToolUse hook to intercept tool results and apply formatting transformations before agent processing** | |
| 2. Create a `normalize_data` tool that the agent calls after each data retrieval to transform values | |
| 3. Modify tools you control to return human-readable formats; create wrapper tools for third-party tools | |
| 4. Add detailed format documentation to your system prompt explaining each tool's data conventions | |

**정답: 1.**

**해설:**

**📝 문제 번역**

운영 로그상 에이전트가 MCP 도구 데이터를 오해석합니다: `get_customer` 의 Unix 타임스탬프, `lookup_order` 의 ISO 8601 날짜, 숫자 상태 코드(1=pending, 2=shipped). 일부 도구는 **수정할 수 없는 서드파티 MCP 서버** 입니다. 데이터 형식을 정규화하는 **가장 유지보수하기 좋은** 방법은?

- **①** **PostToolUse 훅** 으로 도구 결과를 가로채 에이전트 처리 전에 형식 변환 적용
- **②** 데이터 조회마다 에이전트가 호출하는 `normalize_data` 도구 생성
- **③** 제어 가능한 도구는 사람이 읽기 좋은 형식으로 수정, 서드파티는 래퍼 도구 생성
- **④** 시스템 프롬프트에 각 도구 데이터 규약을 상세 문서화

> **핵심 진단:** 서드파티 포함 **모든 도구 출력** 을 한 지점에서 결정적으로 정규화해야 합니다. **PostToolUse 훅** 이 코드 기반의 중앙·결정적 변환 지점을 제공합니다.

1. **정답** - PostToolUse 훅은 서드파티 MCP 서버 출력을 포함한 모든 도구 결과를 에이전트가 처리하기 *전에* 가로채 정규화하는 중앙·결정적 지점을 제공합니다. LLM 해석이나 에이전트 행동에 의존하지 않고 코드로 균일하게 변환하므로 가장 유지보수하기 좋습니다.
2. **오답** - `normalize_data` 도구는 에이전트가 *매번 잊지 않고 호출* 해야 동작하는데, LLM이 이를 건너뛸 수 있어 신뢰성이 낮고 왕복도 늘립니다.
3. **오답** - 제어 도구 수정 + 서드파티 래퍼는 여러 곳을 손봐야 해 유지보수 지점이 분산됩니다. 훅 하나로 중앙화하는 편이 낫습니다.
4. **오답** - 프롬프트 문서화는 soft guidance라 LLM이 일관되게 해석한다는 보장이 없습니다(이미 오해석이 발생 중). 결정적 변환이 필요합니다.

---

## 문제 55
### **For simple requests like "refund order #1234", your agent succeeds in 3-4 tool calls with 91% resolution. For complex requests like "I've been charged twice, my discount didn't apply, and I want to cancel", the agent averages 12+ tool calls with only 54% resolution—often investigating concerns sequentially and gathering redundant customer data for each. What's the most effective change?**

| 보기 | 설명 |
|------|------|
| **1. Decompose the request into distinct concerns, then investigate each in parallel using shared customer context before synthesizing a resolution.** | |
| 2. Add explicit verification gates between steps requiring the agent to checkpoint after resolving each concern. | |
| 3. Reduce the number of available tools by consolidating into a single `investigate_issue` tool. | |
| 4. Add few-shot examples demonstrating ideal tool call sequences for multi-part billing scenarios. | |

**정답: 1.**

**해설:**

**📝 문제 번역**

"환불 order #1234" 같은 단순 요청은 3~4회 도구 호출로 91% 해결. 반면 "이중 청구됐고, 할인이 적용 안 됐고, 취소하고 싶다" 같은 복잡 요청은 평균 12회 이상 호출에 54% 해결 — 우려를 *순차적으로* 조사하고 각각에 대해 **고객 데이터를 중복 수집** 합니다. 가장 효과적인 변경은?

- **①** 요청을 별개 우려로 분해한 뒤, **공유 고객 컨텍스트** 로 각각을 **병렬 조사** 하고 해결을 통합한다
- **②** 단계 사이에 명시적 검증 게이트(각 우려 해결 후 체크포인트)
- **③** 단일 `investigate_issue` 도구로 통합해 도구 수 감소
- **④** 다부분 청구 시나리오의 이상적 호출 순서 few-shot 추가

> **핵심 진단:** 두 가지 비효율 — **순차 조사** 와 **고객 데이터 중복 수집**. 요청을 분해해 *공유 컨텍스트* 로 *병렬* 조사하면 둘 다 해결됩니다.

1. **정답** - 요청을 별개 우려로 분해해 공유 고객 컨텍스트로 병렬 조사하면 두 핵심 문제를 모두 직접 해결합니다: 컨텍스트 재사용으로 중복 데이터 수집을 없애고, 병렬화로 총 도구 호출을 줄인 뒤 통합된 해결을 합성합니다.
2. **오답** - 검증 게이트/체크포인트는 *순차성을 더 강화* 해 오히려 호출 수와 지연을 늘리고, 중복 수집 문제도 해결하지 못합니다.
3. **오답** - 단일 도구 통합은 도구 수만 줄일 뿐, 여러 우려를 순차 처리하며 중복 수집하는 근본 패턴을 바꾸지 못합니다.
4. **오답** - few-shot은 호출 순서를 유도할 수 있으나, 병렬화·컨텍스트 공유라는 구조적 비효율을 직접 해결하지는 못합니다.

---

## 문제 56
### **After calling `get_customer` and `lookup_order`, the agent has all available system data but faces uncertainty. Which situation represents the most appropriate trigger for calling `escalate_to_human`?**

| 보기 | 설명 |
|------|------|
| 1. The customer claims they never received their order, but tracking shows it was delivered and signed for three days ago. Escalate to avoid damaging the relationship. | |
| **2. The customer requests a price match against a competitor. Your policies allow adjustments for price drops on your own site within 14 days but are silent on competitor pricing. Escalate for policy interpretation.** | |
| 3. The customer's message mentions both a billing question and a product return. Escalate so a human can coordinate both. | |
| 4. The customer wants to cancel an order that shipped yesterday, delivery tomorrow. Escalate because they might change their mind. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

`get_customer` 와 `lookup_order` 호출 후 에이전트는 가용한 모든 시스템 데이터를 가졌지만 불확실성에 직면합니다. `escalate_to_human` 호출에 **가장 적절한** 트리거는?

- **①** 고객은 주문을 못 받았다 주장하나 추적상 3일 전 배송·서명 완료 → 관계 손상 우려로 에스컬레이션
- **②** 경쟁사 가격 매칭 요청. 정책은 *자사* 사이트 14일 내 가격 인하 조정은 허용하나 **경쟁사 가격엔 침묵** → 정책 해석을 위해 에스컬레이션
- **③** 메시지에 청구 질문과 반품이 모두 있음 → 사람이 둘을 조율하도록 에스컬레이션
- **④** 어제 발송, 내일 배송 예정 주문 취소 요청 → 마음 바꿀 수 있으니 에스컬레이션

> **핵심 진단:** 에스컬레이션의 정당한 트리거는 **진짜 정책 공백** — 에이전트가 규칙을 *지어낼 수 없고* 사람 판단이 필요한 경우입니다. ②가 정확히 그 사례입니다.

1. **오답** - 모순 정보가 있지만, 에이전트에겐 고객에게 공유할 *사실(추적 데이터)* 이 있어 표준 절차대로 처리할 수 있습니다. 관계 손상 우려로 피하는 것은 운영적 필요가 아닌 감정적 회피입니다.
2. **정답** - 자사 가격 인하는 다루지만 경쟁사 가격 매칭엔 침묵하는 **진짜 정책 공백** 입니다. 에이전트가 정책을 지어낼 수 없으므로, 기존 규칙을 어떻게 해석·확장할지 사람 판단을 위해 에스컬레이션해야 합니다.
3. **오답** - 청구 + 반품 두 우려는 에이전트가 각각 처리할 수 있는 *일상적 다중 작업* 일 뿐, 사람 조율이 본질적으로 필요하지 않습니다.
4. **오답** - 발송된 주문 취소도 정해진 절차(취소/반송 정책)가 있을 가능성이 높고, "마음을 바꿀 수도"는 추측이라 에스컬레이션 사유가 못 됩니다.

---

## 문제 57
### **Your agent handles single-concern requests with 94% accuracy. However, when customers include multiple concerns in one message (e.g., "I need a refund for order #1234 and also want to update my shipping address for order #5678"), tool selection accuracy drops to 58%—the agent addresses only one concern or mixes up parameters. What's the most effective approach to improve reliability for multi-concern requests?**

| 보기 | 설명 |
|------|------|
| 1. Implement response validation that detects incomplete responses and re-prompts the agent. | |
| **2. Add few-shot examples to your prompt demonstrating the correct reasoning and tool sequence for multi-concern requests.** | |
| 3. Implement a preprocessing layer that uses a separate model call to decompose multi-concern messages into individual requests. | |
| 4. Consolidate related tools into fewer, more general-purpose tools. | |

**정답: 2.**

**해설:**

**📝 문제 번역**

에이전트가 단일 우려 요청은 94% 정확도로 처리합니다. 그러나 한 메시지에 여러 우려가 있으면(예: "order #1234 환불 + order #5678 배송지 변경") 도구 선택 정확도가 58%로 떨어집니다 — 한 우려만 처리하거나 파라미터를 섞습니다. 다중 우려 요청의 신뢰성을 높이는 가장 효과적인 접근은?

- **①** 불완전 응답을 감지해 재프롬프트하는 응답 검증
- **②** 다중 우려 요청의 올바른 추론·도구 순서를 보여주는 **few-shot 예시** 추가
- **③** 별도 모델 호출로 다중 우려 메시지를 개별 요청으로 분해하는 전처리 레이어
- **④** 관련 도구를 더 적은 범용 도구로 통합

> **핵심 진단:** 에이전트는 *개별 우려는 이미 94%로 잘 처리* 합니다. 단지 **여러 우려를 한 메시지에서 분해·라우팅** 하는 패턴 가이드가 부족할 뿐이라, 저비용·검증된 **few-shot** 이 가장 적합합니다.

1. **오답** - 불완전 응답 감지·재프롬프트는 사후 반응 전략이라 놓친 우려만 다루고, **파라미터 혼동(섞임)** 이라는 핵심 문제를 예방하지 못합니다.
2. **정답** - 에이전트가 이미 개별 우려를 94%로 잘 처리하므로 다중 우려 분해·파라미터 라우팅에 대한 패턴 가이드만 있으면 됩니다. few-shot 예시는 다중 우려 메시지를 분해하고 파라미터를 올바로 라우팅하는 근본 원인을 직접 다루는 저비용·검증된 기법입니다.
3. **오답** - 별도 모델 호출 전처리는 추가 지연·비용·복잡성을 더하는 과한 해법입니다. 에이전트 자체가 이미 유능하므로 프롬프트 내 few-shot이면 충분합니다.
4. **오답** - 도구 통합은 다중 우려를 한 메시지에서 처리하는 추론 문제와 무관하며, 오히려 도구 구별을 모호하게 만들 수 있습니다.

---

## 문제 58
### **The agent sometimes selects `get_customer` when `lookup_order` would be more appropriate, particularly for ambiguous requests like "I need help with my recent purchase." You decide to add few-shot examples to your system prompt. Which approach will most effectively address this?**

| 보기 | 설명 |
|------|------|
| 1. Add explicit "use when" and "do not use when" guidelines in each tool's description covering the ambiguous cases. | |
| 2. Add examples grouped by tool—all `get_customer` scenarios together, then all `lookup_order` scenarios. | |
| **3. Add 4-6 examples targeting ambiguous scenarios, each showing reasoning for why one tool was chosen over plausible alternatives.** | |
| 4. Add 10-15 examples of clear, unambiguous requests that demonstrate correct tool selection. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

에이전트가 "내 최근 구매 관련 도움이 필요해" 같은 모호한 요청에서 특히 `lookup_order` 가 더 적절한데도 `get_customer` 를 고르기도 합니다. few-shot 예시를 시스템 프롬프트에 추가하기로 했습니다. 이를 가장 효과적으로 해결하는 접근은?

- **①** 각 도구 설명에 모호한 케이스를 다루는 "use when"/"do not use when" 가이드라인 추가
- **②** 도구별로 묶은 예시(모든 `get_customer` 시나리오 다음 모든 `lookup_order`)
- **③** **모호한 시나리오를 겨냥한 4~6개 예시**, 각각 그럴듯한 대안 대비 왜 한 도구를 골랐는지 추론을 보여줌
- **④** 명확·모호하지 않은 요청의 10~15개 예시로 올바른 선택 시연

> **핵심 진단:** 문제는 **모호한(edge-case) 요청** 입니다. 따라서 모호한 시나리오를 정조준하고, *왜* 한 도구를 다른 도구보다 골랐는지 **추론 과정** 을 보여주는 예시가 가장 효과적입니다.

1. **오답** - 질문은 few-shot 접근을 묻는데 ①은 선언적 규칙입니다. 또한 정적 규칙보다 추론을 보여주는 worked example이 미묘한 엣지 케이스 학습에 더 효과적입니다.
2. **오답** - 도구별로 묶으면 명확한 케이스 분류는 보여주지만, *대안 사이에서 비교 판단* 하는 추론을 가르치지 못합니다.
3. **정답** - 오류가 나는 모호한 시나리오를 정조준한 예시에 *왜 한 도구가 다른 도구보다 선호되는지* 명시적 추론을 담으면, 엣지 케이스에 필요한 비교적 의사결정 과정을 직접 가르칩니다. 추론을 보여주는 worked example이 선언적 규칙보다 미묘한 도구 선택에 효과적입니다.
4. **오답** - 명확한 요청 예시 10~15개는 *이미 잘 처리하는* 경우만 강화하고, 정작 문제인 모호한 케이스를 다루지 못합니다. 양보다 표적화가 중요합니다.

---

## 문제 59
### **Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?**

| 보기 | 설명 |
|------|------|
| 1. Have the agent self-report a confidence score (1-10) and route to humans when confidence falls below a threshold. | |
| 2. Deploy a separate classifier model trained on historical tickets to predict which requests need escalation. | |
| **3. Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.** | |
| 4. Implement sentiment analysis to detect customer frustration and escalate when negative sentiment exceeds a threshold. | |

**정답: 3.**

**해설:**

**📝 문제 번역**

에이전트의 첫 접촉 해결률이 55%로 목표 80%에 한참 못 미칩니다. 로그상 *간단한 케이스*(사진 증거가 있는 표준 손상 교체)는 에스컬레이션하면서, *정책 예외가 필요한 복잡한 상황* 은 자율 처리하려 합니다. 에스컬레이션 보정을 개선하는 가장 효과적인 방법은?

- **①** 에이전트가 신뢰도 점수(1~10)를 자가 보고하고 임계값 미만이면 사람에게
- **②** 과거 티켓으로 학습한 별도 분류 모델로 에스컬레이션 필요 예측
- **③** 시스템 프롬프트에 **명확한 에스컬레이션 기준 + 언제 에스컬레이션/자율 해결하는지 보여주는 few-shot** 추가
- **④** 감정 분석으로 불만을 감지해 부정 감정이 임계값 초과 시 에스컬레이션

> **핵심 진단:** 근본 원인은 **간단↔복잡 사이의 결정 경계가 불명확** 한 것입니다. 명확한 기준 + few-shot으로 *언제 에스컬레이션하고 언제 자율 처리할지* 를 직접 가르치는 것이 가장 비례적이고 효과적인 1차 개입입니다.

1. **오답** - LLM의 자가 신뢰도는 보정이 매우 부실하기로 악명 높고, 로그상 이미 *복잡 케이스엔 과신, 단순 케이스엔 과도 신중* 합니다. 자가 점수는 같은 오보정을 재현할 뿐입니다.
2. **오답** - 별도 분류 모델은 학습 데이터·인프라가 필요한 과한 해법으로, 프롬프트 수준 개입을 먼저 시도하는 것이 비례적입니다.
3. **정답** - 명확한 에스컬레이션 기준과 few-shot 예시는 간단·복잡 케이스 사이의 불명확한 결정 경계라는 근본 원인을 직접 다룹니다. 추가 인프라 없이 언제 에스컬레이션/자율 해결할지 정밀하게 가르치는, 가장 비례적이고 효과적인 1차 개입입니다.
4. **오답** - 감정 분석은 *불만 수준* 을 볼 뿐, 케이스의 *복잡성/정책 예외 여부* 라는 실제 에스컬레이션 기준과 무관합니다(차분한 복잡 케이스는 놓침).

---

## 문제 60
### **In testing, you notice the agent frequently calls `get_customer` when users ask about order status, even though `lookup_order` would be more appropriate. What should you examine first to address this issue?**

| 보기 | 설명 |
|------|------|
| 1. Reduce the number of tools available to the agent to simplify selection | |
| 2. Add few-shot examples covering every possible order-related query pattern to the system prompt | |
| **3. Review tool descriptions to ensure they clearly distinguish each tool's purpose** | |
| 4. Implement a pre-processing classifier that detects order queries and routes directly to `lookup_order` | |

**정답: 3.**

**해설:**

**📝 문제 번역**

테스트 중 사용자가 주문 상태를 물을 때 `lookup_order` 가 더 적절한데도 에이전트가 `get_customer` 를 자주 호출하는 것을 발견했습니다. 이 문제를 다루기 위해 **가장 먼저** 무엇을 살펴야 합니까?

- **①** 선택을 단순화하려 도구 수를 줄임
- **②** 가능한 모든 주문 관련 쿼리 패턴의 few-shot을 시스템 프롬프트에 추가
- **③** 도구 설명이 각 도구의 목적을 명확히 구별하는지 **검토**한다
- **④** 주문 쿼리를 감지해 `lookup_order` 로 직접 라우팅하는 전처리 분류기 구현

> **핵심 진단:** 도구 설명은 모델이 도구를 고르는 **1차 입력** 입니다. 잘못된 도구를 일관되게 고를 때 **가장 먼저** 할 진단은 도구 설명이 목적을 명확히 구별·명시하는지 확인하는 것입니다.

1. **오답** - 도구 수 감소는 필요한 기능을 희생할 뿐, *왜* 두 도구를 혼동하는지(대개 불명확한 설명)라는 근본 원인을 다루지 않습니다.
2. **오답** - 모든 패턴을 망라하는 few-shot은 도움될 수 있으나, *첫 단계* 로는 과합니다. 먼저 1차 메커니즘인 도구 설명을 점검해야 합니다.
3. **정답** - 도구 설명은 모델이 어떤 도구를 호출할지 결정하는 1차 입력입니다. 에이전트가 일관되게 잘못된 도구를 고를 때, 첫 진단 단계는 도구 설명이 각 도구의 목적을 명확히 구별하고 언제 써야 하는지 명시하는지 살피는 것입니다.
4. **오답** - 전처리 분류기는 또 다른 컴포넌트를 더하는 복잡한 해법으로, 가장 먼저 시도할 단계가 아닙니다(저비용 진단부터).

---





