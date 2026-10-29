<!-- 출처: https://www.certsafari.com/anthropic/claude-certified-architect-foundations/learn — CCAR-F 레슨 도메인 3(레슨 3.1~3.6)의 Exam question·Check yourself 객관식 문항. 문제·보기·정답은 원문 그대로 옮기고 보기 기호만 A–D → 1–4로 바꿨다. 해설은 원문 해설과 공식 문서를 바탕으로 한글로 작성. -->

## 문제 1
### **A developer notices that in Monday's session Claude followed the package's error-handling convention, but in Tuesday's session on the same repo it ignored it. Nobody edited any instruction file in between. What should they do first?**

| 보기 | 설명 |
|------|------|
| **1. Run /memory in the session where the convention is ignored and compare the CLAUDE.md files it lists with the ones that should be loaded** | |
| 2. Rewrite the convention with stronger wording such as IMPORTANT or MUST so Claude can't overlook it | |
| 3. Copy the convention into ~/.claude/CLAUDE.md, because the user level overrides conflicting project-level instructions | |
| 4. Paste the convention into every prompt, because Claude re-reads CLAUDE.md from disk only once a week | |

**정답: 1.**

**해설:**

> 📘 레슨 3.1 · CLAUDE.md 계층 — CLAUDE.md hierarchy, scope, imports and rules files

**📝 문제 번역**

월요일 세션에서는 Claude가 패키지의 오류 처리 규칙을 따랐는데, 같은 저장소의 화요일 세션에서는 무시했습니다. 그사이 지침 파일을 고친 사람은 없습니다. 가장 먼저 해야 할 일은?

- **①** 규칙이 무시된 세션에서 `/memory` 를 실행해, 목록에 나온 CLAUDE.md 파일을 원래 로드돼야 할 파일과 비교한다
- **②** IMPORTANT·MUST 같은 더 강한 표현으로 규칙을 다시 써서 Claude가 놓치지 못하게 한다
- **③** user 수준이 충돌하는 project 수준 지침을 덮어쓰므로, 규칙을 `~/.claude/CLAUDE.md` 에 복사한다
- **④** Claude는 CLAUDE.md를 일주일에 한 번만 디스크에서 다시 읽으므로, 매 프롬프트에 규칙을 붙여 넣는다

> **핵심:** 파일이 바뀌지 않았는데 세션마다 행동이 다르면 문구가 아니라 **어떤 메모리 파일이 로드됐는지** 부터 확인합니다.

1. **정답** - 세션 간 차이의 흔한 원인은 로드된 파일의 차이입니다. 다른 디렉터리에서 시작해 하위 디렉터리 CLAUDE.md가 빠졌거나, 오래된 `CLAUDE.local.md` 가 끼어든 경우가 대표적입니다. `/memory` 는 현재 범위의 메모리 파일을 나열하므로 바로 비교할 수 있습니다. 현재 문서는 시작 시 실제로 로드된 파일 확인에 `/context` 의 **Memory files** 목록도 안내합니다.
2. **오답** - 파일 내용은 그대로이고 월요일에는 같은 문구로 잘 지켜졌습니다. 문제는 표현의 강도가 아니라 화요일 세션에 그 파일이 들어왔는지 여부이므로, 강조어를 붙여도 원인을 건드리지 못합니다.
3. **오답** - CLAUDE.md 계층은 서로 덮어쓰지 않고 모두 이어 붙는(additive) 구조입니다. user 수준이 project 수준을 이기는 규칙은 없으므로, 복사해도 고쳐지는 것은 없고 두 곳의 지침이 어긋날 위험만 생깁니다.
4. **오답** - "일주일에 한 번" 같은 재로드 주기는 없습니다. CLAUDE.md는 세션 시작 시 읽히고, 세션 중 편집은 다음 `/compact`, `/memory` 로 파일을 열 때, 또는 다음 세션에 반영됩니다. 매 프롬프트 복붙은 원인을 찾지 않는 임시방편입니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Debug your configuration](https://code.claude.com/docs/en/debug-your-config)

> "To check which `CLAUDE.md` and rules files loaded at launch, run `/context`."

---

## 문제 2
### **Your compliance team wants a data-handling instruction to reach every developer in every repository, and no developer should be able to remove it. Which approach meets both requirements?**

| 보기 | 설명 |
|------|------|
| 1. Commit the same CLAUDE.md with the instruction to the root of every repository | |
| 2. Run an onboarding script that writes the instruction into each developer's ~/.claude/CLAUDE.md | |
| **3. Have IT/DevOps use configuration management to deploy it to the managed policy location, as a managed CLAUDE.md or in managed settings** | |
| 4. Add the instruction to a CLAUDE.local.md template that every developer copies into their projects | |

**정답: 3.**

**해설:**

> 📘 레슨 3.1 · CLAUDE.md 계층 — CLAUDE.md hierarchy, scope, imports and rules files

**📝 문제 번역**

컴플라이언스 팀이 데이터 처리 지침 하나를 모든 저장소의 모든 개발자에게 전달하고, 어떤 개발자도 그것을 제거할 수 없게 하려 합니다. 두 요구를 모두 만족하는 방법은?

- **①** 지침이 담긴 같은 CLAUDE.md를 모든 저장소 루트에 커밋한다
- **②** 온보딩 스크립트로 각 개발자의 `~/.claude/CLAUDE.md` 에 지침을 써 넣는다
- **③** IT/DevOps가 구성 관리 도구로 managed policy 위치에 배포한다 (managed CLAUDE.md 또는 managed settings)
- **④** 모든 개발자가 프로젝트에 복사해 쓰는 `CLAUDE.local.md` 템플릿에 지침을 넣는다

> **핵심:** "모두에게, 끌 수 없게"는 개발자·프로젝트보다 위에 있는 **managed 범위** 만 만족합니다.

1. **오답** - 커밋된 CLAUDE.md는 팀에 전달되지만 통제권도 팀에 있습니다. 개발자가 편집하거나 지울 수 있고, 누군가 갱신하지 않은 저장소는 아예 빠집니다.
2. **오답** - 한 번 써 넣은 user 파일은 그 개발자의 홈 디렉터리에 있으므로 언제든 고치거나 지울 수 있습니다. "제거할 수 없어야 한다"는 조건을 만족하지 못합니다.
3. **정답** - managed policy CLAUDE.md는 OS별 관리 경로(예: Linux `/etc/claude-code/CLAUDE.md`)에 배포되어 그 머신의 모든 사용자에게 적용되고, `claudeMdExcludes` 로도 제외할 수 없습니다. managed settings는 개발자의 설정 파일이나 `--settings` 값으로 덮어쓸 수 없는 강제 설정이라, `permissions.deny` 같은 실제 차단까지 걸 수 있습니다.
4. **오답** - `CLAUDE.local.md` 는 "나 · 이 프로젝트" 범위의 개인 파일이고 `.gitignore` 로 커밋에서 빠집니다. 복사 여부부터 내용까지 전부 개발자 손에 있습니다.

📚 근거: [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory) · [How Claude remembers your project](https://code.claude.com/docs/en/memory)

> "Enterprise-enforced settings that your own settings files and --settings values can’t override, apart from narrow exceptions."

---

## 문제 3
### **An architect is designing a configuration strategy for a company rolling out Claude Code to all engineering teams. They need security and compliance instructions that every developer receives on every machine, in every repository, and that individual developers or teams cannot disable through their own settings. Which approach satisfies this requirement?**

| 보기 | 설명 |
|------|------|
| **1. Deploy a `managed-settings.json` file to the system directory (e.g., `/etc/claude-code/` on Linux) using the organization's configuration management system, as it enforces policies that override developer and project settings.** | |
| 2. Commit a `CLAUDE.md` file to the root of each repository, as source control ensures every team member receives the same project-level instructions. | |
| 3. Populate each developer's personal `~/.claude/CLAUDE.md` via a one-time onboarding script, which developers can then edit as needed. | |
| 4. Place a `CLAUDE.local.md` at the root of each repository, distributed by an onboarding script and added to `.gitignore` to prevent accidental commits. | |

**정답: 1.**

**해설:**

> 📘 레슨 3.1 · CLAUDE.md 계층 — CLAUDE.md hierarchy, scope, imports and rules files

**📝 문제 번역**

Claude Code를 모든 엔지니어링 팀에 도입하는 회사의 설정 전략을 설계하고 있습니다. 보안·컴플라이언스 지침이 모든 머신·모든 저장소의 모든 개발자에게 전달되어야 하고, 개인이나 팀이 자기 설정으로 끌 수 없어야 합니다. 이 요구를 만족하는 방법은?

- **①** 조직의 구성 관리 시스템으로 `managed-settings.json` 을 시스템 디렉터리(예: Linux의 `/etc/claude-code/`)에 배포한다. 개발자·프로젝트 설정보다 우선하는 정책을 강제하기 때문이다
- **②** 각 저장소 루트에 `CLAUDE.md` 를 커밋한다. 소스 관리가 모든 팀원에게 같은 project 수준 지침을 보장하기 때문이다
- **③** 일회성 온보딩 스크립트로 각 개발자의 개인 `~/.claude/CLAUDE.md` 를 채우고, 이후에는 개발자가 필요에 따라 편집하게 한다
- **④** 각 저장소 루트에 `CLAUDE.local.md` 를 두되, 온보딩 스크립트로 배포하고 실수로 커밋되지 않게 `.gitignore` 에 추가한다

> **핵심:** 모든 개발자에게 강제해야 하는 지침은 구성 관리로 배포하는 **managed settings / managed policy** 에 둡니다.

1. **정답** - managed settings는 user·project·local 설정 어느 것으로도 덮어쓸 수 없도록 설계된 최상위 계층입니다. 구성 관리 도구로 시스템 디렉터리에 배포하면 모든 머신에 존재가 보장됩니다. 지침 문장은 managed settings의 `claudeMd` 필드나 같은 관리 경로의 managed CLAUDE.md로 전달하고, 도구 차단처럼 강제가 필요한 부분은 `permissions.deny` 등으로 겁니다.
2. **오답** - 저장소 CLAUDE.md는 공유는 되지만 강제력이 없습니다. 개발자가 수정·삭제할 수 있고, 커밋되지 않은 저장소나 갱신이 늦은 저장소에는 지침이 없습니다. 또한 CLAUDE.md 계층은 서로 덮어쓰지 않고 이어 붙으므로, 다른 파일에 상충하는 지침이 있으면 어느 쪽을 따를지 보장되지 않습니다.
3. **오답** - `~/.claude/CLAUDE.md` 는 그 사용자의 모든 프로젝트에 적용되지만, 개발자가 언제든 편집·삭제할 수 있는 개인 파일입니다. 잠글 방법이 없으므로 강제 요구를 만족하지 못합니다.
4. **오답** - `CLAUDE.local.md` 는 개인·프로젝트 한정 메모용 파일입니다. 스크립트로 배포해도 개발자가 지우거나 고칠 수 있고, `.gitignore` 에 들어가 있어 버전 관리로 일관성을 유지할 수도 없습니다.

📚 근거: [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory) · [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 4
### **To reduce the context used at launch, a team moves the frontend and database sections of its 300-line root CLAUDE.md into docs/frontend.md and docs/db.md. The root file now imports them with @docs/frontend.md and @docs/db.md. What effect does this have on context?**

| 보기 | 설명 |
|------|------|
| **1. Context use stays the same, because imported files load at launch with the root file. To load less, the guidance would need to go into subdirectory CLAUDE.md files or path-scoped rules** | |
| 2. Context use drops, because an imported file loads only when Claude reads files in the matching directory | |
| 3. Context use drops, because Claude opens an imported file only if it decides the file is relevant to the task | |
| 4. Context use drops, because imported files are summarized before they are added to the context | |

**정답: 1.**

**해설:**

> 📘 레슨 3.1 · CLAUDE.md 계층 — CLAUDE.md hierarchy, scope, imports and rules files

**📝 문제 번역**

시작 시 컨텍스트 사용량을 줄이려고, 300줄짜리 루트 CLAUDE.md의 프런트엔드·DB 섹션을 `docs/frontend.md` 와 `docs/db.md` 로 옮기고 루트 파일에서 `@docs/frontend.md`, `@docs/db.md` 로 가져오게 했습니다. 컨텍스트에는 어떤 영향이 있습니까?

- **①** 사용량은 그대로다. 가져온 파일은 루트 파일과 함께 시작 시 로드되기 때문이다. 덜 로드하려면 하위 디렉터리 CLAUDE.md나 경로 한정 규칙으로 옮겨야 한다
- **②** 사용량이 준다. 가져온 파일은 Claude가 해당 디렉터리의 파일을 읽을 때만 로드되기 때문이다
- **③** 사용량이 준다. Claude가 작업과 관련 있다고 판단할 때만 가져온 파일을 열기 때문이다
- **④** 사용량이 준다. 가져온 파일은 컨텍스트에 추가되기 전에 요약되기 때문이다

> **핵심:** `@path` 가져오기는 파일을 **정리** 할 뿐 **줄이지** 않습니다. 가져온 파일은 가져오는 CLAUDE.md와 함께 시작 시 로드됩니다.

1. **정답** - 문서는 가져오기가 긴 파일을 정리하는 데는 도움이 되지만 컨텍스트 비용은 줄이지 않는다고 명시합니다. 300줄이 세 파일로 나뉘었을 뿐 시작 시 전부 들어옵니다. 필요할 때만 로드되는 것은 하위 디렉터리 CLAUDE.md와 `paths` 가 지정된 규칙입니다.
2. **오답** - "그 디렉터리의 파일을 읽을 때 로드"는 하위 디렉터리 CLAUDE.md의 동작입니다. `@` 가져오기에는 이런 조건부 로드가 없습니다.
3. **오답** - Claude가 관련성을 판단해 여는 것은 CLAUDE.md가 말로만 "이 파일을 읽어라"라고 안내할 때의 동작입니다. `@` 가져오기는 그 판단 없이 시작 시 펼쳐져 함께 로드됩니다.
4. **오답** - 가져온 파일을 요약해서 넣는 단계는 없습니다. 내용이 그대로 컨텍스트에 들어갑니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

> "Imports help you organize a long file but don’t reduce its context cost, because imported files also load at launch."

---

## 문제 5
### **An engineer launches Claude Code from the `services/billing/` directory inside a larger repository. The repository contains three CLAUDE.md files: one at the repository root, one at `services/billing/CLAUDE.md`, and one at `services/billing/reports/CLAUDE.md`. The engineer has not yet read or edited any files in the `services/billing/reports/` subdirectory. At the moment the session starts, which files are loaded into context?**

| 보기 | 설명 |
|------|------|
| 1. Only `services/billing/CLAUDE.md` loads at launch; the root file is excluded, and the `reports/` file loads once Claude reads a file in that subdirectory. | |
| **2. The root file and `services/billing/CLAUDE.md` load at launch; the `reports/` file loads once Claude reads a file in that subdirectory.** | |
| 3. The root file, `services/billing/CLAUDE.md` and the `reports/` file load at launch; reading files in that subdirectory later adds no further CLAUDE.md content. | |
| 4. Only the root file loads at launch; the `services/billing/` and `reports/` files load once Claude reads a file in their own directories. | |

**정답: 2.**

**해설:**

> 📘 레슨 3.1 · CLAUDE.md 계층 — CLAUDE.md hierarchy, scope, imports and rules files

**📝 문제 번역**

엔지니어가 큰 저장소 안의 `services/billing/` 디렉터리에서 Claude Code를 실행합니다. 저장소에는 CLAUDE.md가 세 개 있습니다: 저장소 루트, `services/billing/CLAUDE.md`, `services/billing/reports/CLAUDE.md`. 엔지니어는 아직 `services/billing/reports/` 의 파일을 읽거나 고친 적이 없습니다. 세션이 시작되는 순간 컨텍스트에 로드된 파일은?

- **①** `services/billing/CLAUDE.md` 만 시작 시 로드된다. 루트 파일은 제외되고, `reports/` 파일은 Claude가 그 디렉터리의 파일을 읽으면 로드된다
- **②** 루트 파일과 `services/billing/CLAUDE.md` 가 시작 시 로드된다. `reports/` 파일은 Claude가 그 디렉터리의 파일을 읽으면 로드된다
- **③** 루트 파일, `services/billing/CLAUDE.md`, `reports/` 파일이 모두 시작 시 로드된다. 이후 그 디렉터리의 파일을 읽어도 추가되는 CLAUDE.md는 없다
- **④** 루트 파일만 시작 시 로드된다. `services/billing/` 과 `reports/` 파일은 각자의 디렉터리 파일을 읽을 때 로드된다

> **핵심:** 시작 시에는 **실행 디렉터리와 그 상위 디렉터리** 의 CLAUDE.md가 로드되고, 그 **아래** 하위 디렉터리의 파일은 필요할 때 로드됩니다.

1. **오답** - 가까운 파일이 상위 파일을 제외하지 않습니다. 실행 위치와 그 위의 모든 디렉터리에서 찾은 파일이 함께 로드되므로 루트 파일도 시작 시 들어옵니다. `reports/` 가 지연 로드된다는 뒷부분만 맞습니다.
2. **정답** - 실행 위치(`services/billing/`)와 그 상위(저장소 루트)의 CLAUDE.md가 시작 시 이어 붙어 로드됩니다. 더 깊은 `services/billing/reports/CLAUDE.md` 는 Claude가 그 디렉터리의 파일을 읽기·쓰기·편집할 때 로드되며, 아직 그런 적이 없으므로 시작 시점에는 없습니다.
3. **오답** - Claude Code는 시작 시 실행 위치 아래 하위 트리를 미리 로드하지 않습니다. `reports/` 의 CLAUDE.md는 해당 디렉터리 파일을 다루기 전까지 컨텍스트에 없습니다.
4. **오답** - 지연 로드는 실행 위치 **아래** 의 파일에만 적용됩니다. 실행한 디렉터리 자신의 CLAUDE.md는 상위 루트 파일과 함께 시작 시 로드됩니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview)

> "Files from your working directory and above load at launch; subdirectories load as you work in them."

---

## 문제 6
### **A project's single CLAUDE.md has grown to over 500 lines covering code style, testing, security requirements, and deployment steps, and the team notices Claude adheres to instructions less reliably than before. The architect wants to reorganize this into focused, maintainable files while keeping everything loaded for every session. Which restructuring best achieves this?**

| 보기 | 설명 |
|------|------|
| **1. Split the guidance into code-style.md, testing.md, security.md and deployment.md in .claude/rules/ with no paths frontmatter, and slim CLAUDE.md down** | |
| 2. Split the guidance into CLAUDE.md files in the src/, tests/, security/ and deploy/ directories next to the code, and slim the root CLAUDE.md down | |
| 3. Split the guidance into code-style.md, testing.md, security.md and deployment.md in .claude/rules/ with paths globs for each area, and slim CLAUDE.md down | |
| 4. Split the guidance into four skills under .claude/skills/, one each for style, testing, security and deployment, and slim CLAUDE.md down | |

**정답: 1.**

**해설:**

> 📘 레슨 3.1 · CLAUDE.md 계층 — CLAUDE.md hierarchy, scope, imports and rules files

**📝 문제 번역**

프로젝트의 단일 CLAUDE.md가 코드 스타일·테스트·보안 요구·배포 절차를 담은 500줄 넘는 파일이 되었고, 팀은 Claude의 지침 준수가 예전보다 떨어졌다고 느낍니다. 아키텍트는 이를 주제별로 관리하기 쉬운 파일로 재구성하되, **모든 내용이 매 세션 로드되는 상태는 유지** 하려 합니다. 가장 알맞은 재구성은?

- **①** `.claude/rules/` 에 `code-style.md`·`testing.md`·`security.md`·`deployment.md` 를 `paths` frontmatter 없이 두고, CLAUDE.md는 줄인다
- **②** `src/`·`tests/`·`security/`·`deploy/` 디렉터리마다 코드 옆에 CLAUDE.md를 두고, 루트 CLAUDE.md는 줄인다
- **③** `.claude/rules/` 에 네 파일을 두되 영역마다 `paths` glob을 지정하고, CLAUDE.md는 줄인다
- **④** `.claude/skills/` 아래 스타일·테스트·보안·배포 스킬 네 개로 나누고, CLAUDE.md는 줄인다

> **핵심:** `paths` 가 **없는** `.claude/rules/` 파일은 CLAUDE.md와 같은 우선순위로 매 세션 로드되므로, "나누되 항상 로드"에 맞는 유일한 선택입니다.

1. **정답** - frontmatter가 없는 규칙 파일은 조건 없이 시작 시 로드되어 CLAUDE.md와 똑같이 동작합니다. 주제별 파일로 관리가 쉬워지고, 모든 지침이 매 세션 컨텍스트에 남습니다. 압축 뒤에도 루트 CLAUDE.md처럼 디스크에서 다시 주입됩니다. 다만 총량은 줄지 않으므로 나누면서 낡거나 모순되는 지침을 함께 정리합니다.
2. **오답** - 하위 디렉터리 CLAUDE.md는 Claude가 그 디렉터리의 파일을 다룰 때만 로드됩니다. 보안·배포 폴더를 건드리지 않는 세션에서는 해당 지침이 빠지므로 "매 세션 로드" 요구를 어깁니다.
3. **오답** - `paths` 를 지정하면 일치하는 파일을 다룰 때만 로드되는 조건부 규칙이 됩니다. 컨텍스트 절약에는 좋지만, 모든 지침이 항상 있어야 한다는 요구와는 반대입니다.
4. **오답** - 스킬은 평소 설명만 로드되고 본문은 호출되거나 관련 있다고 판단될 때 들어옵니다. 보안 요구처럼 항상 적용돼야 하는 규칙을 담기에는 맞지 않습니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Explore the context window](https://code.claude.com/docs/en/context-window)

> "Rules without a `paths` field are loaded unconditionally and apply to all files."

---

## 문제 7
### **A developer wrote `/lint-report` as `~/.claude/skills/lint-report/SKILL.md`, and it works for them. After pulling the latest commit, a teammate finds the command doesn't exist. What makes `/lint-report` available to the whole team?**

| 보기 | 설명 |
|------|------|
| 1. Ask the teammate to restart Claude Code so it scans for new skills again | |
| 2. Move it to a single file at `~/.claude/commands/lint-report.md`, the older format that every session reads | |
| **3. Move the skill directory to `.claude/skills/lint-report/` inside the repository and commit it** | |
| 4. Add a line to the project CLAUDE.md telling Claude to load the `lint-report` skill | |

**정답: 3.**

**해설:**

> 📘 레슨 3.2 · 슬래시 명령·스킬 — Custom slash commands and skills in Claude Code

**📝 문제 번역**

개발자가 `/lint-report` 를 `~/.claude/skills/lint-report/SKILL.md` 로 만들었고 본인에게는 잘 동작합니다. 그런데 최신 커밋을 받은 팀원에게는 이 명령이 없습니다. `/lint-report` 를 팀 전체가 쓰게 하려면?

- **①** 팀원에게 Claude Code를 재시작해 새 스킬을 다시 스캔하게 한다
- **②** 모든 세션이 읽는 예전 형식인 단일 파일 `~/.claude/commands/lint-report.md` 로 옮긴다
- **③** 스킬 디렉터리를 저장소 안의 `.claude/skills/lint-report/` 로 옮기고 커밋한다
- **④** 프로젝트 CLAUDE.md에 `lint-report` 스킬을 로드하라는 한 줄을 추가한다

> **핵심:** 스킬을 팀과 공유하는 경로는 **저장소의 `.claude/skills/` 에 두고 커밋** 하는 것 하나뿐입니다.

1. **오답** - 팀원의 머신에는 스킬 파일 자체가 없으므로 재시작해도 찾을 것이 없습니다. 참고로 Claude Code는 스킬 디렉터리 변경을 감시해 같은 세션 안에서도 새 스킬을 반영합니다.
2. **오답** - 명령 파일 형식으로 바꿔도 위치가 여전히 홈 디렉터리(`~/.claude/`)라 git에 들어가지 않습니다. `~/.claude/commands/` 도 개인 범위입니다.
3. **정답** - `~/.claude/` 아래 파일은 저장소 밖이라 git이 보지 못합니다. 프로젝트 `.claude/skills/<name>/SKILL.md` 로 옮겨 커밋하면, 버전 관리가 배포 수단이 되어 pull한 모든 팀원이 같은 `/lint-report` 를 갖게 됩니다.
4. **오답** - CLAUDE.md에 "이 스킬을 쓰라"고 적어도 팀원 머신에 스킬 파일이 없으면 불러올 대상이 없습니다. 지침으로 파일 배포를 대신할 수는 없습니다.

📚 근거: [Extend Claude with skills](https://code.claude.com/docs/en/skills)

> "Sessions in this repository. Commit it so your team gets it too"

---

## 문제 8
### **After a developer adds a `/lint-report` skill, it works when they run Claude Code themselves, but a teammate who pulled the latest commit reports the skill doesn't exist. The developer confirms the file was never staged in any commit. What is the most likely cause?**

| 보기 | 설명 |
|------|------|
| 1. The skill was saved under .claude/skills/lint-report/SKILL.md, but the teammate needs to restart their machine before new skills are detected. | |
| 2. The skill was saved under .claude/commands/lint-report.md, which requires a separate enterprise license to be shared across teammates. | |
| 3. The skill was saved correctly, but skill availability only activates after the project's CI pipeline runs once successfully. | |
| **4. The skill was saved under ~/.claude/skills/lint-report/SKILL.md, which lives outside the repository and was never version-controlled.** | |

**정답: 4.**

**해설:**

> 📘 레슨 3.2 · 슬래시 명령·스킬 — Custom slash commands and skills in Claude Code

**📝 문제 번역**

개발자가 `/lint-report` 스킬을 추가했고 본인이 실행하면 동작합니다. 하지만 최신 커밋을 받은 팀원은 스킬이 없다고 합니다. 개발자는 그 파일이 어떤 커밋에도 스테이징된 적이 없음을 확인했습니다. 가장 가능성 높은 원인은?

- **①** 스킬이 `.claude/skills/lint-report/SKILL.md` 에 저장됐지만, 팀원이 머신을 재시작해야 새 스킬이 감지된다
- **②** 스킬이 `.claude/commands/lint-report.md` 에 저장됐는데, 팀원과 공유하려면 별도 엔터프라이즈 라이선스가 필요하다
- **③** 저장은 제대로 됐지만, 스킬은 프로젝트 CI 파이프라인이 한 번 성공해야 활성화된다
- **④** 스킬이 `~/.claude/skills/lint-report/SKILL.md` 에 저장됐다. 이 위치는 저장소 밖이라 버전 관리된 적이 없다

> **핵심:** "나는 되는데 팀원은 안 되고, 커밋된 적도 없다"는 스킬이 **개인 범위(`~/.claude/skills/`)** 에 있다는 신호입니다.

1. **오답** - 새 스킬을 감지하는 데 머신 재시작은 필요 없습니다. 무엇보다 이 선택지는 파일이 왜 한 번도 스테이징되지 않았는지를 설명하지 못합니다.
2. **오답** - 프로젝트 범위 스킬이나 명령 파일을 공유하는 데 라이선스 조건은 없습니다. `.claude/` 디렉터리를 커밋하는 것이 공유 방법의 전부입니다.
3. **오답** - 스킬의 사용 가능 여부는 CI 실행과 무관합니다. 스킬 디렉터리에 파일이 있으면 그 세션에서 바로 쓸 수 있습니다.
4. **정답** - 개인 `~/.claude/skills/` 는 git 저장소 밖의 홈 디렉터리에 있어 스테이징·커밋·공유될 수 없습니다. 그래서 개발자 본인 머신에서는 모든 프로젝트에서 동작하지만 저장소를 받은 팀원에게는 존재하지 않습니다. 프로젝트 `.claude/skills/` 로 옮겨 커밋해야 합니다.

📚 근거: [Extend Claude with skills](https://code.claude.com/docs/en/skills)

---

## 문제 9
### **Your team has committed `.claude/skills/review/SKILL.md`. You want a stricter version for your own use. When you type `/review`, it should still run the shared team workflow in every repository. Where should your variant go?**

| 보기 | 설명 |
|------|------|
| 1. `~/.claude/skills/review/SKILL.md`, because a personal copy only adds to the team skill and is merged with it | |
| **2. `~/.claude/skills/review-strict/SKILL.md`, a personal skill with its own name that you invoke as `/review-strict`** | |
| 3. `.claude/commands/review.md` in the repository, because a command file runs alongside a skill of the same name | |
| 4. `.claude/skills/review/SKILL.md`, edited in place and left unstaged so teammates don't receive the change | |

**정답: 2.**

**해설:**

> 📘 레슨 3.2 · 슬래시 명령·스킬 — Custom slash commands and skills in Claude Code

**📝 문제 번역**

팀이 `.claude/skills/review/SKILL.md` 를 커밋해 쓰고 있습니다. 나만 쓸 더 엄격한 버전을 원하지만, `/review` 를 입력하면 모든 저장소에서 여전히 팀 공용 워크플로가 실행돼야 합니다. 내 변형은 어디에 둬야 합니까?

- **①** `~/.claude/skills/review/SKILL.md` — 개인 사본은 팀 스킬에 더해져 합쳐지기 때문이다
- **②** `~/.claude/skills/review-strict/SKILL.md` — 이름이 다른 개인 스킬로 두고 `/review-strict` 로 호출한다
- **③** 저장소의 `.claude/commands/review.md` — 명령 파일은 같은 이름의 스킬과 나란히 실행되기 때문이다
- **④** `.claude/skills/review/SKILL.md` 를 직접 고치고 스테이징하지 않아 팀원에게 가지 않게 한다

> **핵심:** 스킬은 **이름으로 덮어쓰고, personal이 project를 이깁니다.** 팀 스킬을 지키면서 변형을 쓰려면 이름을 달리합니다.

1. **오답** - 같은 이름의 스킬은 합쳐지지 않습니다. 우선순위가 personal > project라서, 개인 `review` 가 내가 여는 모든 저장소에서 팀의 `/review` 를 경고 없이 대체합니다. 팀 버전이 갱신돼도 나는 받지 못합니다.
2. **정답** - 다른 이름의 개인 스킬은 어떤 이름과도 충돌하지 않습니다. `/review` 는 계속 팀 공용 워크플로를 실행하고, 엄격한 버전은 `/review-strict` 로 원할 때만 부릅니다.
3. **오답** - 스킬과 `.claude/commands/` 파일이 같은 이름이면 스킬이 실행되고 명령 파일은 무시됩니다. 둘이 나란히 실행되는 일은 없습니다.
4. **오답** - 스테이징하지 않아도 로컬 작업 트리의 파일이 바뀌었으므로, 내 세션의 `/review` 는 수정된 내용으로 실행됩니다. 팀 워크플로를 그대로 쓴다는 요구를 어기고, 실수로 커밋될 위험도 남습니다.

📚 근거: [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview)

> "when the same name exists at multiple levels, one definition wins based on priority (managed > user > project for skills"

---

## 문제 10
### **A project's `.claude/skills/review/SKILL.md` is checked into the repo for team-wide use. A senior engineer also keeps a `~/.claude/skills/review/SKILL.md` on their laptop for personal projects, unaware it uses the same name. When this engineer works in the shared repository and runs `/review`, which skill actually executes?**

| 보기 | 설명 |
|------|------|
| **1. The personal skill at `~/.claude/skills/review/SKILL.md`, because a skill with the same name at the personal level overrides one from the project level.** | |
| 2. The project skill at `.claude/skills/review/SKILL.md`, because project-scoped skills always take priority over personal ones with the same name. | |
| 3. Both skills execute in sequence, first the personal skill and then the project skill, since Claude Code merges same-named skills rather than choosing one. | |
| 4. Neither skill executes, and Claude Code reports a naming conflict error until one of the two files is renamed. | |

**정답: 1.**

**해설:**

> 📘 레슨 3.2 · 슬래시 명령·스킬 — Custom slash commands and skills in Claude Code

**📝 문제 번역**

프로젝트의 `.claude/skills/review/SKILL.md` 가 팀 공용으로 저장소에 커밋돼 있습니다. 한 시니어 엔지니어는 개인 프로젝트용으로 노트북에 `~/.claude/skills/review/SKILL.md` 를 두고 있는데, 이름이 같다는 사실을 모릅니다. 이 엔지니어가 공유 저장소에서 `/review` 를 실행하면 어느 스킬이 실행됩니까?

- **①** 개인 스킬 `~/.claude/skills/review/SKILL.md`. 같은 이름이면 personal 수준이 project 수준을 덮어쓰기 때문이다
- **②** 프로젝트 스킬 `.claude/skills/review/SKILL.md`. 같은 이름이면 프로젝트 범위 스킬이 항상 개인 스킬보다 우선하기 때문이다
- **③** 두 스킬이 차례로 실행된다(개인 → 프로젝트). Claude Code는 같은 이름의 스킬을 하나로 고르지 않고 합치기 때문이다
- **④** 어느 것도 실행되지 않고, 한쪽 이름을 바꿀 때까지 이름 충돌 오류가 표시된다

> **핵심:** 같은 이름의 스킬은 **enterprise > personal > project** 순으로 하나만 실행되며, 병합도 오류도 없습니다.

1. **정답** - 문서의 우선순위 표대로 personal(`~/.claude/skills/`)이 project(`.claude/skills/`)를 이깁니다. 그래서 이 엔지니어의 세션에서는 팀 스킬 대신 개인 스킬이 조용히 실행됩니다. 플러그인 스킬은 `/plugin-name:skill` 로 네임스페이스가 붙어 이 경쟁에 끼지 않습니다.
2. **오답** - 순서가 반대입니다. "커밋된 팀 스킬이 이긴다"는 흔한 오해이며, 같은 이름의 개인 스킬이 있으면 그 사용자에게는 프로젝트 스킬이 가려집니다.
3. **오답** - Claude Code는 같은 이름의 스킬을 합치거나 연달아 실행하지 않습니다. 우선순위로 정의 하나를 고르고 그것만 실행합니다.
4. **오답** - 이름 충돌은 우선순위로 조용히 해결되며 오류를 내지 않습니다. 의도치 않은 가림을 피하려면 처음부터 고유한 이름을 쓰는 것이 좋습니다.

📚 근거: [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview)

---

## 문제 11
### **A team's `explore-alternatives` skill asks Claude to brainstorm several competing architecture approaches before settling on a recommendation. The team wants that exploratory back-and-forth kept separate from the main conversation, with only the final recommendation surfacing back to the user. Which configuration accomplishes this?**

| 보기 | 설명 |
|------|------|
| **1. Set `context: fork` on the skill, so it runs in a subagent with its own context and hands back just its result to the caller.** | |
| 2. Set `disable-model-invocation: true` on the skill, so a teammate starts the brainstorm by typing the command and Claude cannot trigger it. | |
| 3. Set `user-invocable: false` on the skill, so it is hidden from the slash menu and Claude loads it when the topic comes up. | |
| 4. Set `paths: docs/architecture/*​*` on the skill, so it loads when Claude works on files in the architecture folder. | |

**정답: 1.**

**해설:**

> 📘 레슨 3.2 · 슬래시 명령·스킬 — Custom slash commands and skills in Claude Code

**📝 문제 번역**

팀의 `explore-alternatives` 스킬은 권장안을 정하기 전에 경쟁하는 아키텍처 접근을 여러 개 브레인스토밍하게 합니다. 팀은 이 탐색 과정을 메인 대화와 분리하고, 최종 권장안만 사용자에게 돌아오게 하려 합니다. 알맞은 설정은?

- **①** 스킬에 `context: fork` 를 설정해, 자체 컨텍스트를 가진 서브에이전트에서 실행하고 결과만 호출자에게 넘기게 한다
- **②** 스킬에 `disable-model-invocation: true` 를 설정해, 팀원이 명령을 입력해야만 브레인스토밍이 시작되고 Claude는 스스로 호출하지 못하게 한다
- **③** 스킬에 `user-invocable: false` 를 설정해, 슬래시 메뉴에서 숨기고 주제가 나오면 Claude가 로드하게 한다
- **④** 스킬에 `paths: docs/architecture/**` 를 설정해, Claude가 아키텍처 폴더의 파일을 다룰 때 로드되게 한다

> **핵심:** 스킬이 **어디서 실행되는지** 를 바꾸는 필드는 `context: fork` 하나뿐입니다. 나머지는 누가·언제 시작하는지를 정합니다.

1. **정답** - `context: fork` 는 스킬을 새 서브에이전트에서 실행하고, SKILL.md 본문을 그 프롬프트로 줍니다. 탐색 과정은 서브에이전트의 컨텍스트에 남고 최종 결과만 메인 대화로 돌아옵니다. `agent` 필드로 서브에이전트 종류를 고르며, 생략하면 `general-purpose` 가 쓰입니다.
2. **오답** - 이 설정은 호출 주체만 바꿉니다. 사용자가 `/explore-alternatives` 를 입력해 시작하면 스킬은 여전히 인라인으로 실행되어 브레인스토밍 내용이 모두 메인 대화에 쌓입니다.
3. **오답** - `/` 메뉴에서 숨기고 Claude만 호출하게 하는 설정입니다. 실행 위치는 그대로 메인 대화라 탐색 과정도 그대로 보입니다.
4. **오답** - 스킬의 `paths` 는 어떤 파일을 다룰 때 자동 로드할지를 제한할 뿐입니다. 실행을 별도 컨텍스트로 옮기지 않으므로 브레인스토밍은 메인 대화에서 진행됩니다.

📚 근거: [Extend Claude with skills](https://code.claude.com/docs/en/skills)

> "Set to `fork` to run in a forked subagent context."

---

## 문제 12
### **Your project CLAUDE.md holds two things: the one-line rule "Use pnpm, not npm" and a 300-line API style guide that matters only when someone writes endpoints. Every session currently loads both. How should you restructure them?**

| 보기 | 설명 |
|------|------|
| 1. Leave both in CLAUDE.md, because only instructions loaded into every session are reliably followed | |
| **2. Keep the pnpm rule in CLAUDE.md, move the style guide into a skill, and have CLAUDE.md say "follow our API conventions"** | |
| 3. Move both into skills so CLAUDE.md is empty and no instructions load until a task needs them | |
| 4. Keep the style guide in CLAUDE.md and move the pnpm rule into a skill, since a one-line rule is cheap to load on demand | |

**정답: 2.**

**해설:**

> 📘 레슨 3.2 · 슬래시 명령·스킬 — Custom slash commands and skills in Claude Code

**📝 문제 번역**

프로젝트 CLAUDE.md에 두 가지가 있습니다: 한 줄짜리 규칙 "npm 말고 pnpm을 쓴다"와, 엔드포인트를 작성할 때만 필요한 300줄짜리 API 스타일 가이드입니다. 지금은 매 세션 둘 다 로드됩니다. 어떻게 재구성해야 합니까?

- **①** 둘 다 CLAUDE.md에 둔다. 매 세션 로드되는 지침만 확실히 지켜지기 때문이다
- **②** pnpm 규칙은 CLAUDE.md에 두고, 스타일 가이드는 스킬로 옮긴 뒤 CLAUDE.md에는 "API 규칙을 따를 것"이라고 적는다
- **③** 둘 다 스킬로 옮겨 CLAUDE.md를 비우고, 작업에 필요할 때까지 아무 지침도 로드되지 않게 한다
- **④** 스타일 가이드는 CLAUDE.md에 두고 pnpm 규칙을 스킬로 옮긴다. 한 줄 규칙은 필요할 때 로드해도 싸기 때문이다

> **핵심:** **모든 작업에 적용되는 짧은 규칙은 CLAUDE.md**, **한 종류의 작업에만 필요한 긴 참고 자료는 스킬** 에 둡니다.

1. **오답** - 300줄 가이드는 엔드포인트와 무관한 모든 세션에서도 컨텍스트를 차지합니다. 문서는 CLAUDE.md가 길어질수록 컨텍스트를 더 쓰고 준수율도 떨어진다고 설명하므로, 전부 남기는 것이 오히려 준수에 불리합니다.
2. **정답** - 패키지 매니저 규칙은 모든 작업에 해당하고 로드 비용도 작아 CLAUDE.md에 맞습니다. 긴 스타일 가이드는 스킬로 옮기면 평소에는 설명만 로드되고 본문은 필요할 때 들어옵니다. CLAUDE.md가 가이드를 가리키게 하는 것이 문서가 소개하는 흔한 패턴입니다.
3. **오답** - pnpm 규칙은 어떤 작업에서든 지켜져야 하는 상시 규칙입니다. 스킬로 옮기면 Claude가 그 스킬을 떠올리지 않은 세션에서는 npm을 쓸 수 있습니다.
4. **오답** - 배치가 정반대입니다. 상시 규칙을 주문형으로, 가끔 필요한 대형 자료를 상시 로드로 두게 되어 두 가지 비용을 모두 치릅니다.

📚 근거: [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Extend Claude with skills](https://code.claude.com/docs/en/skills) · [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

> "CLAUDE.md holds always-on rules; skills hold reference material loaded on demand"

---

## 문제 13
### **A project's CLAUDE.md has grown to about 400 lines. Most of it is OpenAPI and validation conventions that only matter for the API handlers under src/api/. The team wants sessions spent on frontend work to stop paying the context cost of those conventions. What should they do?**

| 보기 | 설명 |
|------|------|
| 1. Move the API conventions into separate files and pull them into CLAUDE.md with @path imports | |
| 2. Move the API conventions into a .claude/rules/ file with no frontmatter | |
| **3. Move the API conventions into a .claude/rules/ file whose YAML frontmatter has a paths glob matching the API handler files** | |
| 4. Keep the conventions in CLAUDE.md but group them under clear markdown headers so Claude can skip them | |

**정답: 3.**

**해설:**

> 📘 레슨 3.3 · 경로별 규칙 — Path-scoped rules in .claude/rules/ with paths globs

**📝 문제 번역**

프로젝트 CLAUDE.md가 약 400줄로 늘었고, 대부분은 `src/api/` 의 API 핸들러에만 해당하는 OpenAPI·검증 규칙입니다. 팀은 프런트엔드 작업 세션이 이 규칙의 컨텍스트 비용을 더는 치르지 않게 하려 합니다. 어떻게 해야 합니까?

- **①** API 규칙을 별도 파일로 옮기고 CLAUDE.md에서 `@path` 가져오기로 불러온다
- **②** API 규칙을 frontmatter 없는 `.claude/rules/` 파일로 옮긴다
- **③** API 규칙을 `.claude/rules/` 파일로 옮기고, YAML frontmatter의 `paths` glob이 API 핸들러 파일과 일치하게 한다
- **④** 규칙은 CLAUDE.md에 두되 명확한 마크다운 제목으로 묶어 Claude가 건너뛸 수 있게 한다

> **핵심:** 컨텍스트 로드를 **일치 파일을 다룰 때까지 미루는** 방법은 `paths` 범위를 지정한 규칙뿐입니다.

1. **오답** - 가져온 파일은 가져오는 CLAUDE.md와 함께 시작 시 로드됩니다. 파일은 정리되지만 프런트엔드 세션도 똑같은 비용을 치릅니다.
2. **오답** - `paths` 가 없는 규칙 파일은 매 세션 무조건 로드됩니다. 위치만 바뀌고 로드량은 같습니다.
3. **정답** - `paths` 가 있는 규칙은 Claude가 일치하는 파일을 Read·Write·Edit할 때 로드되므로, API 핸들러를 건드리지 않는 프런트엔드 세션에서는 컨텍스트에 들어오지 않습니다. 문서도 코드베이스 일부에만 해당하는 지침은 경로 한정 규칙으로 옮기라고 권합니다.
4. **오답** - 제목은 Claude가 파일을 읽고 따르는 데 도움을 줄 뿐, 언제 로드되는지는 바꾸지 않습니다. 400줄 전체가 여전히 매 세션 들어옵니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview)

> "Move instructions that matter for only part of the codebase into path-scoped rules, which load only when Claude works with matching files."

---

## 문제 14
### **An API team wants a rule requiring input validation and OpenAPI comments to apply only to TypeScript files inside src/api/, including deeply nested route handler subfolders, but not to TypeScript files elsewhere in the repo such as src/utils/ or src/components/. Which paths frontmatter correctly scopes the rule to this requirement?**

| 보기 | 설명 |
|------|------|
| **1. `paths: ["src/api/*​*/*.ts"]`** | |
| 2. `paths: ["src/*​*/*.ts"]` | |
| 3. `paths: ["src/api/*.ts"]` | |
| 4. `paths: ["api/*​*/*.ts"]` | |

**정답: 1.**

**해설:**

> 📘 레슨 3.3 · 경로별 규칙 — Path-scoped rules in .claude/rules/ with paths globs

**📝 문제 번역**

API 팀이 입력 검증과 OpenAPI 주석을 요구하는 규칙을 `src/api/` 안의 TypeScript 파일(깊이 중첩된 라우트 핸들러 하위 폴더 포함)에만 적용하고, `src/utils/` 나 `src/components/` 같은 다른 곳의 TypeScript 파일에는 적용하지 않으려 합니다. 이 요구에 맞게 규칙 범위를 정하는 `paths` frontmatter는?

원문 보기는 아래와 같은 여러 줄 YAML이며, 앱에서는 한 줄 표기로 옮겼습니다.

```yaml
# ①
paths:
  - "src/api/**/*.ts"
# ②
paths:
  - "src/**/*.ts"
# ③
paths:
  - "src/api/*.ts"
# ④
paths:
  - "api/**/*.ts"
```

- **①** `paths: ["src/api/**/*.ts"]`
- **②** `paths: ["src/**/*.ts"]`
- **③** `paths: ["src/api/*.ts"]`
- **④** `paths: ["api/**/*.ts"]`

> **핵심:** 범위는 **대상 파일을 모두 담는 가장 작은 디렉터리에서 시작하고, 그 아래를 `**` 로** 덮습니다. 패턴은 프로젝트 루트 기준입니다.

1. **정답** - `src/api/` 로 시작하므로 다른 `src/` 하위 폴더는 제외되고, `**` 가 중첩된 라우트 핸들러 폴더(예: `src/api/v2/users/handler.ts`)까지 포함합니다.
2. **오답** - `src/` 아래 모든 TypeScript 파일과 일치하므로 `src/utils/`, `src/components/` 까지 포함됩니다. 경로 한정이 막으려던 무관한 컨텍스트가 그대로 들어옵니다.
3. **오답** - `*` 하나는 한 디렉터리 단계 안에서만 일치합니다. `src/api/` 바로 아래 파일만 잡고 `src/api/users/handlers.ts` 같은 중첩 파일은 놓칩니다.
4. **오답** - 패턴은 프로젝트 루트 기준이라 `api/**/*.ts` 는 최상위 `api/` 디렉터리를 뜻합니다. 실제 경로인 `src/api/` 와 맞지 않아 규칙이 로드되지 않습니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Set up Claude Code in a monorepo or large codebase](https://code.claude.com/docs/en/large-codebases)

> "Glob patterns that scope the rule to matching files. Accepts a YAML list or a comma-separated string"

---

## 문제 15
### **In a Claude Code rules file, the same conventions must apply to `.ts` and `.tsx` files at any depth under `src/`, plus `.ts` files at any depth under `lib/` (including nested subdirectories), using as few `paths` glob pattern entries as possible. Which `paths` frontmatter accomplishes this most efficiently?**

| 보기 | 설명 |
|------|------|
| **1. `paths: ["src/*​*/*.{ts,tsx}", "lib/*​*/*.ts"]`** | |
| 2. `paths: ["src/*​*/*.ts", "src/*​*/*.tsx", "lib/*​*/*.ts"]` | |
| 3. `paths: ["*​*/*.ts", "*​*/*.tsx"]` | |
| 4. `paths: ["src/*.{ts,tsx}", "lib/*.ts"]` | |

**정답: 1.**

**해설:**

> 📘 레슨 3.3 · 경로별 규칙 — Path-scoped rules in .claude/rules/ with paths globs

**📝 문제 번역**

Claude Code 규칙 파일에서, `src/` 아래 모든 깊이의 `.ts`·`.tsx` 파일과 `lib/` 아래 모든 깊이(중첩 하위 디렉터리 포함)의 `.ts` 파일에 같은 규칙을 적용하되, `paths` glob 항목 수는 최소로 하려 합니다. 가장 효율적인 `paths` frontmatter는?

원문 보기는 아래와 같은 여러 줄 YAML 코드 블록이며, 앱에서는 한 줄 표기로 옮겼습니다.

```yaml
# ①
paths:
  - "src/**/*.{ts,tsx}"
  - "lib/**/*.ts"
# ②
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "lib/**/*.ts"
# ③
paths:
  - "**/*.ts"
  - "**/*.tsx"
# ④
paths:
  - "src/*.{ts,tsx}"
  - "lib/*.ts"
```

- **①** `paths: ["src/**/*.{ts,tsx}", "lib/**/*.ts"]`
- **②** `paths: ["src/**/*.ts", "src/**/*.tsx", "lib/**/*.ts"]`
- **③** `paths: ["**/*.ts", "**/*.tsx"]`
- **④** `paths: ["src/*.{ts,tsx}", "lib/*.ts"]`

> **핵심:** 중괄호 `{ts,tsx}` 는 한 패턴 안에 대안을 나열하고, `**` 는 모든 깊이를 덮습니다. 정확한 범위를 **가장 적은 항목** 으로 표현하는 것이 정답입니다.

1. **정답** - `src/**/*.{ts,tsx}` 한 항목이 `src/` 아래 모든 깊이의 두 확장자를, `lib/**/*.ts` 가 `lib/` 아래 모든 깊이의 `.ts` 를 덮습니다. 요구 범위를 정확히 두 항목으로 표현합니다.
2. **오답** - 범위는 정확하지만 `src/` 를 두 항목으로 나눠 세 개를 씁니다. 중괄호 문법으로 같은 범위를 한 항목에 담을 수 있으므로 "최소 항목" 조건에서 밀립니다.
3. **오답** - 항목은 두 개지만 프로젝트 어디에 있든 모든 `.ts`·`.tsx` 와 일치합니다. `src/`·`lib/` 밖의 스크립트나 `lib/` 의 `.tsx` 까지 포함되어 규칙이 필요 이상으로 자주 로드됩니다.
4. **오답** - `**` 가 없으므로 `src/`·`lib/` 바로 아래 파일만 일치하고 중첩 하위 디렉터리로 내려가지 않습니다. "모든 깊이" 요구를 만족하지 못합니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 16
### **An infrastructure team wants Claude Code to load Terraform-specific formatting and tagging conventions only when Claude edits files under the terraform/ directory, at any subfolder depth. Which YAML frontmatter for a new .claude/rules/terraform.md file correctly scopes the rule to this requirement?**

| 보기 | 설명 |
|------|------|
| **1. `--- paths: ["terraform/*​*/*"] ---`** | |
| 2. `--- paths: ["terraform/*"] ---` | |
| 3. `--- include: ["terraform/*​*/*"] ---` | |
| 4. `--- paths: ["*​*/terraform/*"] ---` | |

**정답: 1.**

**해설:**

> 📘 레슨 3.3 · 경로별 규칙 — Path-scoped rules in .claude/rules/ with paths globs

**📝 문제 번역**

인프라 팀이 Terraform 전용 포맷·태그 규칙을 Claude가 `terraform/` 디렉터리 아래 파일을 편집할 때만(하위 폴더 깊이와 무관하게) 로드하려 합니다. 새 `.claude/rules/terraform.md` 파일에 알맞은 YAML frontmatter는?

원문 보기는 `---` 줄로 감싼 여러 줄 frontmatter이며, 앱에서는 한 줄 표기로 옮겼습니다. ①의 원래 모양은 다음과 같습니다(구분선 줄은 주석으로 표시).

```yaml
# --- (frontmatter 시작)  ① 원문
paths:
  - "terraform/**/*"
# --- (frontmatter 끝)

# ② paths: ["terraform/*"]
# ③ include: ["terraform/**/*"]
# ④ paths: ["**/terraform/*"]
```

- **①** `--- paths: ["terraform/**/*"] ---`
- **②** `--- paths: ["terraform/*"] ---`
- **③** `--- include: ["terraform/**/*"] ---`
- **④** `--- paths: ["**/terraform/*"] ---`

> **핵심:** 규칙 frontmatter에서 Claude Code가 읽는 키는 **`paths` 하나** 이고, 트리 전체를 덮으려면 `terraform/**/*` 처럼 `**` 가 필요합니다.

1. **정답** - `paths` 키에 YAML 목록을 주고, `terraform/**/*` 가 `terraform/` 아래 모든 깊이의 파일(예: `terraform/modules/network/main.tf`)과 일치합니다.
2. **오답** - `*` 하나는 `terraform/` 바로 아래 파일만 잡습니다. `terraform/main.tf` 는 맞지만 `terraform/modules/network/main.tf` 같은 중첩 모듈 파일은 놓칩니다.
3. **오답** - 경로 범위로 인정되는 키는 `paths` 뿐이고, 다른 필드는 오류 없이 무시됩니다. `include` 만 있는 파일은 `paths` 가 없는 규칙이므로 조건부가 아니라 매 세션 로드됩니다.
4. **오답** - `**/terraform/*` 는 저장소 어디에 있든 `terraform` 이라는 폴더 **바로 안** 의 파일만 일치합니다. 그 폴더 아래 중첩 하위 폴더는 여전히 빠집니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory)

---

## 문제 17
### **Your team's React test files live in `src/components/__tests__/`, in src/pages/tests/, next to the components they test, and in a root tests/ folder. You want one set of testing conventions to load only when Claude is working on these files. Which setup fits best?**

| 보기 | 설명 |
|------|------|
| 1. Put a CLAUDE.md with the test conventions in each folder that holds tests | |
| **2. Add a single .claude/rules/ file with `paths: ["*​*/*.test.tsx"]`** | |
| 3. Add a single .claude/rules/ file with `paths: ["tests/*​*/*.test.tsx"]` | |
| 4. Put the conventions in one src/CLAUDE.md, because nested CLAUDE.md files are the only instruction files that load lazily | |

**정답: 2.**

**해설:**

> 📘 레슨 3.3 · 경로별 규칙 — Path-scoped rules in .claude/rules/ with paths globs

**📝 문제 번역**

팀의 React 테스트 파일은 `src/components/__tests__/`, `src/pages/tests/`, 테스트 대상 컴포넌트 바로 옆, 그리고 루트 `tests/` 폴더에 흩어져 있습니다. 하나의 테스트 규칙 세트가 Claude가 이 파일들을 다룰 때만 로드되게 하려 합니다. 가장 알맞은 구성은?

- **①** 테스트가 있는 폴더마다 테스트 규칙을 담은 CLAUDE.md를 둔다
- **②** `paths: ["**/*.test.tsx"]` 를 지정한 `.claude/rules/` 파일 하나를 추가한다
- **③** `paths: ["tests/**/*.test.tsx"]` 를 지정한 `.claude/rules/` 파일 하나를 추가한다
- **④** 중첩 CLAUDE.md만 지연 로드되는 유일한 지침 파일이므로, 규칙을 `src/CLAUDE.md` 하나에 넣는다

> **핵심:** 규칙이 **위치가 아니라 파일 유형** 을 따른다면, 중앙 `.claude/rules/` 의 glob 규칙 하나로 흩어진 파일을 모두 덮습니다.

1. **오답** - 폴더마다 사본을 두면 새 테스트 폴더가 생길 때마다 사본이 늘고, 시간이 지나며 내용이 어긋납니다. 서로 모순되는 지침은 Claude가 어느 쪽을 따를지 보장되지 않습니다.
2. **정답** - `**/` 로 시작하는 패턴은 루트 고정을 풀어, `.test.tsx` 파일이 `__tests__` 안이든 컴포넌트 옆이든 루트 `tests/` 이든 모두 일치합니다. 규칙은 한곳에서 관리되고 테스트 파일을 다룰 때만 로드됩니다.
3. **오답** - `tests/**/*.test.tsx` 는 루트 `tests/` 폴더 아래 파일만 일치합니다. `src/` 아래의 테스트와 컴포넌트 옆 테스트는 빠집니다.
4. **오답** - 경로 한정 규칙도 지연 로드되므로 전제가 틀렸습니다. 또 `src/CLAUDE.md` 는 `src/` 밖의 루트 `tests/` 를 덮지 못하고, `src/` 아래 테스트가 아닌 파일을 다룰 때도 딸려 옵니다.

📚 근거: [Set up Claude Code in a monorepo or large codebase](https://code.claude.com/docs/en/large-codebases) · [How Claude remembers your project](https://code.claude.com/docs/en/memory)

> "You want all conventions in one place, or the same rule applies to many scattered paths"

---

## 문제 18
### **Midway through planning a multi-phase migration, Claude has to find every usage pattern of the old library across hundreds of files before it can propose an approach. You want the main session to keep enough context for the plan and the implementation that follows. What should happen to this discovery sweep?**

| 보기 | 설명 |
|------|------|
| 1. Set `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` so Claude reads every file itself and has the full contents on hand when it plans | |
| **2. Have Claude send the sweep to the Explore subagent, which reads the files in its own context window and returns only a summary** | |
| 3. Skip the sweep and start converting files directly, so the usage patterns show up as Claude works through the codebase | |
| 4. Switch from plan mode to default mode so each file read needs approval and fewer files get pulled into context | |

**정답: 2.**

**해설:**

> 📘 레슨 3.4 · 플랜 모드 — Plan mode vs direct execution in Claude Code

**📝 문제 번역**

여러 단계로 된 마이그레이션을 계획하는 도중, Claude가 접근 방식을 제안하려면 수백 개 파일에서 옛 라이브러리의 사용 패턴을 모두 찾아야 합니다. 메인 세션에는 계획과 이어질 구현에 쓸 컨텍스트가 충분히 남아 있어야 합니다. 이 탐색 작업은 어떻게 처리해야 합니까?

- **①** `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` 을 설정해 Claude가 모든 파일을 직접 읽고, 계획할 때 전체 내용을 갖고 있게 한다
- **②** Claude가 탐색을 Explore 서브에이전트에 맡기게 한다. Explore는 자기 컨텍스트 창에서 파일을 읽고 요약만 돌려준다
- **③** 탐색을 건너뛰고 바로 파일 변환을 시작해, Claude가 작업하면서 사용 패턴을 발견하게 한다
- **④** 플랜 모드에서 default 모드로 바꿔 파일 읽기마다 승인을 받게 하여, 컨텍스트에 들어오는 파일 수를 줄인다

> **핵심:** 장황한 탐색은 **Explore 서브에이전트** 의 별도 컨텍스트에서 돌리고, 메인 대화에는 요약만 받습니다.

1. **오답** - 이 환경 변수는 내장 Explore·Plan 서브에이전트를 끄는 설정입니다. 그러면 수백 개 파일 읽기가 모두 메인 대화에 쌓여, 계획과 구현에 쓸 컨텍스트가 줄어듭니다. 요구와 정반대입니다.
2. **정답** - Explore는 Write·Edit가 거부된 읽기 전용 내장 서브에이전트로, 자기 컨텍스트 창에서 파일 탐색·코드 검색을 하고 요약만 메인 대화로 돌려줍니다. 호출할 때 quick·medium·very thorough 중 탐색 깊이를 지정받습니다.
3. **오답** - 사전 탐색 없이 변환을 시작하면 변환 패턴이 파일마다 즉흥적으로 정해져, 앞 파일과 뒤 파일이 서로 다른 방식으로 바뀌는 재작업이 생깁니다.
4. **오답** - default 모드에서도 파일 읽기는 승인 없이 실행됩니다. 모드를 바꿔도 읽는 파일 수나 컨텍스트 사용량은 줄지 않습니다.

📚 근거: [Explore the context window](https://code.claude.com/docs/en/context-window) · [Create custom subagents](https://code.claude.com/docs/en/sub-agents)

> "a subagent handles the research in its own separate context window, so the large file reads stay out of yours."

---

## 문제 19
### **While in plan mode, an architect notices that Claude keeps reading files and running read-only search commands without prompting for approval on each one, even though no edits have occurred. What most plausibly explains this behavior?**

| 보기 | 설명 |
|------|------|
| 1. Plan mode has silently switched over to acceptEdits mode partway through this session, which is why operations proceed without prompts | |
| **2. Plan mode inherently blocks all edits and does not require approval for read operations, as the mode's read-only guarantee makes approval prompts unnecessary.** | |
| 3. Read-only commands are permanently exempt from every permission mode in Claude Code, no matter which mode is currently active | |
| 4. The architect's local settings have disabled every single permission check for the remainder of this particular session entirely | |

**정답: 2.**

**해설:**

> 📘 레슨 3.4 · 플랜 모드 — Plan mode vs direct execution in Claude Code

**📝 문제 번역**

플랜 모드에서, 편집은 한 번도 없었는데 Claude가 파일을 읽고 읽기 전용 검색 명령을 실행할 때마다 승인을 묻지 않는 것을 아키텍트가 발견했습니다. 이 동작을 가장 그럴듯하게 설명하는 것은?

- **①** 세션 도중 플랜 모드가 조용히 acceptEdits 모드로 바뀌어서 작업이 프롬프트 없이 진행된다
- **②** 플랜 모드는 본질적으로 모든 편집을 막고 읽기 작업에는 승인을 요구하지 않는다. 모드의 읽기 전용 보장 덕분에 승인 프롬프트가 필요 없다
- **③** 읽기 전용 명령은 현재 어떤 모드든 상관없이 모든 권한 모드에서 영구히 면제된다
- **④** 아키텍트의 로컬 설정이 이번 세션이 끝날 때까지 모든 권한 검사를 완전히 꺼 버렸다

> **핵심:** 플랜 모드에서 읽기·탐색이 자유롭고 편집이 없는 것은 **설계된 정상 동작** 입니다. 편집은 계획을 승인할 때까지 막힙니다.

1. **오답** - 플랜 모드는 스스로 다른 모드로 바뀌지 않습니다. 편집 가능한 모드로의 전환은 사용자가 계획을 승인하거나 Shift+Tab으로 직접 바꿀 때만 일어나며, 편집이 한 번도 없었다는 사실과도 맞지 않습니다.
2. **정답** - 플랜 모드는 Claude가 파일을 읽고 탐색 명령을 실행해 계획을 쓰게 하되 소스는 편집하지 않는 권한 모드입니다. 읽기 작업은 묻지 않고 진행되고, 편집은 계획 승인 뒤로 미뤄집니다. 참고로 파일 읽기는 default 모드에서도 묻지 않으므로, 플랜 모드의 특징은 "편집이 승인 뒤로 미뤄진다"는 점입니다.
3. **오답** - 읽기가 모든 검사에서 면제되는 것은 아닙니다. 예를 들어 `permissions.blockReadsOutsideWorkingDirectories` 가 켜져 있으면 작업 디렉터리 밖을 읽는 Bash 명령은 auto·bypassPermissions에서도 프롬프트가 뜨고, 명시적 ask 규칙도 모든 모드에서 묻습니다.
4. **오답** - 관찰된 동작은 플랜 모드 정의만으로 설명됩니다. 모든 검사를 끄는 상황이라면 편집도 프롬프트 없이 진행됐을 텐데, 편집은 한 번도 없었습니다.

📚 근거: [Choose a permission mode](https://code.claude.com/docs/en/permission-modes)

---

## 문제 20
### **A team lead reviewing a completed library migration finds that early file conversions used one pattern, while later files in the same migration used a different, incompatible pattern, forcing a second pass to reconcile them. Which earlier decision most likely caused this outcome?**

| 보기 | 설명 |
|------|------|
| 1. The team used the Explore subagent to catalog usage patterns across the codebase before starting the conversion work itself | |
| 2. The team approved a design in plan mode and then switched to direct execution to carry out the approved conversion steps | |
| 3. The migration was scoped to a single library instead of being combined into one larger project with an unrelated framework upgrade | |
| **4. The migration was executed directly from the start instead of first exploring the codebase in plan mode to settle on one pattern** | |

**정답: 4.**

**해설:**

> 📘 레슨 3.4 · 플랜 모드 — Plan mode vs direct execution in Claude Code

**📝 문제 번역**

완료된 라이브러리 마이그레이션을 검토하던 팀장이, 앞쪽 파일은 한 패턴으로 변환됐고 같은 마이그레이션의 뒤쪽 파일은 호환되지 않는 다른 패턴으로 변환돼 두 번째 정리 작업이 필요해진 것을 발견했습니다. 이 결과를 낳았을 가능성이 가장 큰 이전 결정은?

- **①** 변환 작업 전에 Explore 서브에이전트로 코드베이스 전반의 사용 패턴을 목록화했다
- **②** 플랜 모드에서 설계를 승인한 뒤, 승인된 변환 단계를 직접 실행으로 수행했다
- **③** 무관한 프레임워크 업그레이드와 합친 큰 프로젝트가 아니라, 라이브러리 하나로 범위를 정했다
- **④** 플랜 모드에서 먼저 코드베이스를 탐색해 한 가지 패턴으로 정하지 않고, 처음부터 직접 실행했다

> **핵심:** 여러 파일이 **서로 일관되어야 하는** 변경은, 편집 전에 전체를 조사해 패턴 하나를 정해 두지 않으면 파일마다 다르게 바뀝니다.

1. **오답** - 사전에 사용 패턴을 목록화하는 것은 불일치를 막는 예방 조치입니다. 패턴 차이를 미리 드러내 주므로 원인이 될 수 없습니다.
2. **오답** - 계획 승인 후 직접 실행은 이런 마이그레이션에 권장되는 순서입니다. 승인된 패턴을 기준으로 모든 파일을 바꾸므로 불일치를 막는 쪽입니다.
3. **오답** - 무관한 업그레이드를 합치면 범위만 커질 뿐입니다. 문제는 변환 패턴의 불일치이고, 이는 범위 선택이 아니라 사전 조사를 건너뛴 데서 옵니다.
4. **정답** - 처음부터 직접 실행하면 변환 패턴이 미리 정해지지 않아 파일마다 결정됩니다. 앞부분은 처음 본 방식으로, 코드베이스를 더 본 뒤의 뒷부분은 다른 방식으로 바뀌어 다시 맞춰야 합니다. 플랜 모드에서 편집이 막힌 상태로 전체를 조사하고 한 패턴을 합의하면 모든 파일이 같은 방식으로 변환됩니다.

📚 근거: [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Manage costs effectively](https://code.claude.com/docs/en/costs)

---

## 문제 21
### **A platform team is restructuring a monolith into three microservices, touching shared data models, service boundaries, and deployment topology, with several viable ways to split the code. Before any files are changed, which approach should the architect direct Claude Code to take?**

| 보기 | 설명 |
|------|------|
| 1. Use accept-edits mode so Claude extracts the first service right away, with the remaining boundaries adjusted as problems appear in the code | |
| **2. Use plan mode so Claude reads through the code and drafts a proposed split for review, with file edits held back until the plan is approved** | |
| 3. Describe the intended service layout in CLAUDE.md so Claude follows it while extracting code, with each edit approved in default permission mode | |
| 4. Run Claude headless in CI with bypassPermissions so it extracts the services on a branch, with the resulting pull request reviewed afterward | |

**정답: 2.**

**해설:**

> 📘 레슨 3.4 · 플랜 모드 — Plan mode vs direct execution in Claude Code

**📝 문제 번역**

플랫폼 팀이 모놀리스를 마이크로서비스 세 개로 재구성하려 합니다. 공유 데이터 모델, 서비스 경계, 배포 토폴로지가 모두 바뀌고, 코드를 나누는 방법도 여러 가지가 가능합니다. 파일을 바꾸기 전에 아키텍트가 Claude Code에 지시해야 할 방식은?

- **①** accept-edits 모드로 Claude가 첫 서비스를 바로 추출하게 하고, 나머지 경계는 코드에서 문제가 보일 때 조정한다
- **②** 플랜 모드로 Claude가 코드를 읽고 검토용 분리안을 작성하게 하고, 계획이 승인될 때까지 파일 편집은 보류한다
- **③** 의도한 서비스 구성을 CLAUDE.md에 적어 Claude가 코드를 추출하며 따르게 하고, default 권한 모드에서 편집마다 승인한다
- **④** CI에서 bypassPermissions로 Claude를 헤드리스 실행해 브랜치에서 서비스를 추출하게 하고, 결과 PR을 나중에 검토한다

> **핵심:** 대규모·다파일 변경에 **유효한 접근이 여럿** 이고 아키텍처 결정이 걸려 있으면, 편집 전에 플랜 모드로 설계를 정합니다.

1. **오답** - acceptEdits는 파일 편집을 프롬프트 없이 적용하므로, 분리안을 비교하기도 전에 코드가 바뀝니다. 첫 추출이 정한 경계를 나머지 서비스가 떠안게 됩니다.
2. **정답** - 플랜 모드는 Claude가 코드를 탐색하고 분리안을 작성하는 동안 소스 편집을 막습니다. 계획이 승인돼야 편집이 시작되므로, 여러 분리 방식 중 하나를 설계 단계에서 고를 수 있습니다. 방향이 틀렸을 때의 비용도 diff 되돌리기가 아니라 계획 수정 한 번으로 끝납니다.
3. **오답** - CLAUDE.md는 상시 맥락을 줄 뿐 Claude가 대안을 탐색·비교하게 만들지 않습니다. 구성을 미리 적으면 조사 전에 분리 방식을 하나로 정해 버리고, 편집별 승인은 큰 재설계를 조각조각 판단하게 만듭니다.
4. **오답** - bypassPermissions는 격리된 컨테이너·VM 전용 모드이고, 프롬프트 없이 바로 편집을 시작합니다. PR은 작업이 끝난 뒤에야 검토되므로 잘못된 분리가 코드 전반에 퍼진 다음에 발견됩니다.

📚 근거: [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) · [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

---

## 문제 22
### **Your team must decide whether a new payments integration should use a webhook receiver or a polling worker. The two need different infrastructure, but either way the code change will be fewer than 30 lines. How should you run this task in Claude Code?**

| 보기 | 설명 |
|------|------|
| 1. Direct execution in acceptEdits mode, because the final diff is small and fits in a single review | |
| **2. Plan mode first, because the hard part is choosing between valid approaches, and that choice should be settled before any edits** | |
| 3. Direct execution in default mode, approving each edit, because approving every step one by one does the same job as a plan | |
| 4. Headless with bypassPermissions, then review the resulting pull request to judge which approach Claude picked | |

**정답: 2.**

**해설:**

> 📘 레슨 3.4 · 플랜 모드 — Plan mode vs direct execution in Claude Code

**📝 문제 번역**

새 결제 연동을 웹훅 수신기로 할지 폴링 워커로 할지 팀이 정해야 합니다. 두 방식은 필요한 인프라가 다르지만, 어느 쪽이든 코드 변경은 30줄 미만입니다. Claude Code에서 이 작업을 어떻게 진행해야 합니까?

- **①** 최종 diff가 작아 한 번에 검토할 수 있으므로 acceptEdits 모드로 직접 실행한다
- **②** 어려운 부분은 유효한 접근 중 하나를 고르는 일이고 그 선택은 편집 전에 정해야 하므로, 먼저 플랜 모드로 진행한다
- **③** 단계별 승인이 계획과 같은 역할을 하므로 default 모드에서 편집마다 승인하며 직접 실행한다
- **④** bypassPermissions로 헤드리스 실행한 뒤, 결과 PR을 보고 Claude가 어떤 방식을 골랐는지 판단한다

> **핵심:** 플랜 모드는 **diff 크기가 아니라 남아 있는 결정** 때문에 고릅니다.

1. **오답** - 작은 diff는 플랜 모드를 건너뛸 이유가 되지 않습니다. 인프라 요구가 다른 두 접근 중 하나를 고르는 것이 이 작업의 핵심인데, acceptEdits는 그 결정을 Claude가 편집하면서 내리게 둡니다.
2. **정답** - 경쟁하는 접근이 있고 인프라 요구가 다르면, Claude가 코드를 조사해 설계를 제안하고 승인받는 동안 편집이 막혀 있어야 합니다. 선택이 끝나면 30줄 변경은 직접 실행으로 처리하면 됩니다.
3. **오답** - 편집마다 승인하는 것은 코드가 이미 쓰이고 있는 시점에 설계를 판단하는 일입니다. 두 방식을 비교한 계획을 먼저 검토하는 것과 같지 않습니다.
4. **오답** - 설계 판단을 코드가 다 쓰인 뒤로 미룹니다. bypassPermissions는 격리 환경 전용이기도 하며, 어떤 방식을 쓸지는 팀이 정해야 할 결정입니다.

📚 근거: [Choose a permission mode](https://code.claude.com/docs/en/permission-modes)

> "Explore before changing anything | claude --permission-mode plan | None | Claude Code blocks edits until you approve a plan"

---

## 문제 23
### **An architect is building a real-time collaborative editor for the first time. They don't yet know how cache invalidation, conflicting edits or clients dropping mid-edit should be handled. What should they ask Claude to do before any code is written?**

| 보기 | 설명 |
|------|------|
| 1. Write a full test suite for the editor first, then implement until every test passes | |
| **2. Interview them about anything ambiguous, putting first the questions whose answers would change the architecture, then write the result up as a spec** | |
| 3. Implement a first version using common industry practice, then refine it through rounds of feedback | |
| 4. Follow 2–3 concrete examples of edits, each paired with the exact document state it should produce, as the definition of correct behaviour | |

**정답: 2.**

**해설:**

> 📘 레슨 3.5 · 반복 개선 — Iterative refinement in Claude Code: examples, tests and interviews

**📝 문제 번역**

아키텍트가 실시간 공동 편집기를 처음 만듭니다. 캐시 무효화, 충돌하는 편집, 편집 도중 클라이언트가 끊기는 상황을 어떻게 처리해야 할지 아직 모릅니다. 코드를 쓰기 전에 Claude에게 무엇을 요청해야 합니까?

- **①** 편집기용 전체 테스트 스위트를 먼저 쓰게 하고, 모든 테스트가 통과할 때까지 구현하게 한다
- **②** 모호한 점을 인터뷰하게 하되 답에 따라 아키텍처가 바뀌는 질문을 먼저 하게 하고, 결과를 사양서로 정리하게 한다
- **③** 업계의 일반적 관행으로 첫 버전을 구현하게 한 뒤, 피드백을 여러 차례 주며 다듬는다
- **④** 편집 사례 2~3개와 각각이 만들어야 할 정확한 문서 상태를 "올바른 동작"의 정의로 따르게 한다

> **핵심:** 무엇이 올바른지 **아직 모를 때** 는 테스트·예시보다 먼저 **인터뷰 패턴** 으로 결정 사항을 드러냅니다.

1. **오답** - 테스트를 쓰려면 기대 동작을 알아야 합니다. 충돌 해결이나 연결 끊김 처리를 정하지 않은 상태에서 쓴 테스트는 Claude의 추측을 고정할 뿐입니다.
2. **정답** - 인터뷰는 Claude가 먼저 질문해 개발자가 미처 생각하지 못한 결정(캐시 무효화 전략, 충돌 해결, 끊김 시 동작)을 구현 전에 드러냅니다. 아키텍처를 바꾸는 질문을 앞에 두면 비싼 결정부터 정해지고, 결과 사양서는 이후 구현과 테스트의 기준이 됩니다. Claude Code에서는 AskUserQuestion 도구로 질문합니다.
3. **오답** - "일반적 관행"을 따르게 하면 Claude의 추측이 그대로 코드에 들어갑니다. 코드가 생긴 뒤에는 앞선 결정을 되돌리기가 더 어렵습니다.
4. **오답** - 입출력 예시는 원하는 결과를 이미 알고 있지만 말로 정확히 표현하지 못할 때 쓰는 기법입니다. 여기서는 그 결과 자체가 정해지지 않았습니다.

📚 근거: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

> "Interview me one question at a time about anything ambiguous, prioritize questions where my answer would change the architecture."

---

## 문제 24
### **A data engineer is iterating with Claude Code on a migration script that transforms legacy customer records into a new schema. After the first pass, records with a null middle-name field are being dropped instead of migrated with an empty string. What is the most effective way to fix this specific edge case handling?**

| 보기 | 설명 |
|------|------|
| **1. Show Claude a sample legacy record whose middle-name field is null, along with the migrated record it should become, with that field as an empty string** | |
| 2. Describe to Claude, in plain prose, that records with null values are being dropped, and ask it to handle nulls properly in the transformation function | |
| 3. Wrap the transformation function in a try/except that logs each failing record to a file and continues, then check the log for null middle-name cases | |
| 4. Ask Claude to regenerate the whole migration script from the original schema description in a fresh session, so the null handling is written again from scratch | |

**정답: 1.**

**해설:**

> 📘 레슨 3.5 · 반복 개선 — Iterative refinement in Claude Code: examples, tests and interviews

**📝 문제 번역**

데이터 엔지니어가 레거시 고객 레코드를 새 스키마로 바꾸는 마이그레이션 스크립트를 Claude Code와 함께 다듬고 있습니다. 첫 실행 후, middle-name 필드가 null인 레코드가 빈 문자열로 이전되지 않고 누락되고 있습니다. 이 엣지 케이스를 고치는 가장 효과적인 방법은?

- **①** middle-name이 null인 레거시 레코드 샘플과, 그 필드가 빈 문자열인 기대 이전 결과 레코드를 함께 보여 준다
- **②** null 값이 있는 레코드가 누락된다는 것을 평이한 문장으로 설명하고, 변환 함수에서 null을 제대로 처리해 달라고 한다
- **③** 변환 함수를 try/except로 감싸 실패 레코드를 파일에 기록하고 계속 진행한 뒤, 로그에서 null middle-name 사례를 확인한다
- **④** 새 세션에서 원래 스키마 설명을 바탕으로 마이그레이션 스크립트 전체를 다시 생성해 null 처리를 처음부터 새로 쓰게 한다

> **핵심:** 엣지 케이스는 말로 설명하지 말고 **구체적 입력과 정확한 기대 출력** 쌍으로 보여 줍니다.

1. **정답** - `middle_name: null` 입력과 `middle_name: ""` 출력의 쌍은 트리거(null)와 요구 결과(빈 문자열)를 모두 확정합니다. Claude는 해석 없이 고칠 목표와 확인 기준을 얻습니다.
2. **오답** - "null을 제대로 처리"는 빈 문자열, null 유지, 기본값, 건너뛰기 등 여러 해석을 허용합니다. 레코드를 누락시킨 것도 Claude가 이미 고른 해석 중 하나였습니다.
3. **오답** - 오류를 잡고 계속 진행하면 증상을 감출 뿐, null 레코드는 여전히 이전되지 않습니다. 요구는 기록이 아니라 빈 문자열로 이전하는 것입니다.
4. **오답** - 버그를 낳은 같은 스키마 설명으로 다시 생성하므로 새 정보가 없습니다. 이미 동작하는 코드를 버리고, null 처리가 다시 틀리거나 다른 결함이 생길 수 있습니다.

📚 근거: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

---

## 문제 25
### **A team lead wants Claude Code to implement a CSV-to-JSON conversion utility whose column-to-field mapping rules are difficult to describe precisely in words, since the exact handling of empty cells, quoted commas, and duplicate headers matters. Which approach best sets up an effective iterative refinement loop before implementation begins?**

| 보기 | 설명 |
|------|------|
| **1. Write a few sample input rows with the exact JSON each should produce, including one row with an empty cell and one with a quoted comma, and give them to Claude before it writes the converter.** | |
| 2. Write a detailed prose specification of how empty cells, quoted commas and duplicate headers map to JSON fields, give it to Claude with the converter request, and refine the wording after reviewing the output. | |
| 3. Name a widely used CSV parsing library in the prompt and tell Claude to build the converter on it, keeping the library's default handling of empty cells and quoted commas, then review the output. | |
| 4. Ask Claude to write the converter together with its own unit tests, deriving the expected output for empty cells, quoted commas and duplicate headers from the prompt, and iterate until the tests pass. | |

**정답: 1.**

**해설:**

> 📘 레슨 3.5 · 반복 개선 — Iterative refinement in Claude Code: examples, tests and interviews

**📝 문제 번역**

팀장이 Claude Code로 CSV→JSON 변환 유틸리티를 구현하려 합니다. 빈 셀, 따옴표 안의 쉼표, 중복 헤더의 정확한 처리가 중요해서, 열-필드 매핑 규칙을 말로 정확히 설명하기 어렵습니다. 구현 전에 효과적인 반복 개선 루프를 만드는 가장 좋은 방법은?

- **①** 입력 행 몇 개와 각 행이 만들어야 할 정확한 JSON을 작성하고(빈 셀이 있는 행 하나, 따옴표 쉼표가 있는 행 하나 포함), 변환기를 쓰기 전에 Claude에게 준다
- **②** 빈 셀·따옴표 쉼표·중복 헤더가 JSON 필드로 어떻게 매핑되는지 자세한 산문 사양을 써서 함께 주고, 결과를 본 뒤 문구를 다듬는다
- **③** 널리 쓰이는 CSV 파싱 라이브러리를 지정해 그 위에 변환기를 만들게 하고, 빈 셀·따옴표 쉼표는 라이브러리 기본 처리대로 둔 뒤 결과를 검토한다
- **④** Claude에게 변환기와 자체 단위 테스트를 함께 쓰게 하고, 빈 셀·따옴표 쉼표·중복 헤더의 기대 출력은 프롬프트에서 도출하게 해 테스트가 통과할 때까지 반복한다

> **핵심:** 말로 정하기 어려운 변환 규칙은 **입력과 정확한 기대 출력 예시** 로 고정해야 루프에 확인 기준이 생깁니다.

1. **정답** - 빈 셀과 따옴표 쉼표를 포함한 입력 행과 정확한 JSON의 쌍은 산문이 흔들리는 지점을 그대로 확정합니다. Claude는 구현할 목표와 수정 때마다 대조할 기준을 처음부터 갖습니다.
2. **오답** - 문제의 전제가 "말로 정확히 설명하기 어렵다"입니다. 산문을 다듬는 것은 같은 모호함을 반복할 뿐이고, 루프에 구체적인 기대 출력이 없습니다.
3. **오답** - 라이브러리 기본 처리는 범용 동작일 뿐 팀의 매핑 규칙과 같다는 보장이 없습니다. 미리 정한 기대 출력이 없으니 결과를 대조할 기준도 없습니다.
4. **오답** - 테스트가 같은 모호한 프롬프트에 대한 Claude 자신의 해석을 담게 됩니다. 동작이 팀 의도와 달라도 테스트는 통과할 수 있으므로, 기대 출력은 구현자가 아니라 팀이 제공해야 합니다.

📚 근거: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

---

## 문제 26
### **In a checkout module, orderTotal() calls applyDiscount() and addTax() internally. The latest run fails all three tests: test_applyDiscount, test_addTax and test_orderTotal. How should you report these failures to Claude?**

| 보기 | 설명 |
|------|------|
| 1. Report the test_orderTotal failure first because it is the user-facing function, then report the other two once it passes | |
| 2. Report each of the three failures in its own message, one after another, so that each fix can be confirmed on its own | |
| **3. Put all three failures in one detailed message and note that orderTotal() calls the other two, so its failure may be downstream of theirs** | |
| 4. Paste only the applyDiscount and addTax failures and leave out test_orderTotal so it doesn't distract Claude from the real bugs | |

**정답: 3.**

**해설:**

> 📘 레슨 3.5 · 반복 개선 — Iterative refinement in Claude Code: examples, tests and interviews

**📝 문제 번역**

결제 모듈에서 `orderTotal()` 은 내부에서 `applyDiscount()` 와 `addTax()` 를 호출합니다. 최근 실행에서 `test_applyDiscount`, `test_addTax`, `test_orderTotal` 세 테스트가 모두 실패했습니다. 이 실패들을 Claude에게 어떻게 보고해야 합니까?

- **①** 사용자에게 보이는 함수인 `test_orderTotal` 실패를 먼저 보고하고, 그것이 통과하면 나머지 둘을 보고한다
- **②** 세 실패를 각각 별도 메시지로 하나씩 보내, 수정마다 따로 확인할 수 있게 한다
- **③** 세 실패를 한 메시지에 자세히 담고, `orderTotal()` 이 나머지 둘을 호출하므로 그 실패가 하위 함수 실패의 결과일 수 있다고 적는다
- **④** `applyDiscount` 와 `addTax` 실패만 붙여 넣고, `test_orderTotal` 은 진짜 버그에서 주의를 돌리지 않도록 뺀다

> **핵심:** 수정끼리 **영향을 주는(얽힌)** 실패는 관계를 밝혀 **한 메시지** 로 보냅니다.

1. **오답** - `orderTotal()` 은 하위 두 함수의 버그 때문에 실패했을 가능성이 큽니다. 그 실패만 먼저 보고하면 멀쩡한 `orderTotal()` 을 불필요하게 고치는 과잉 수정을 부릅니다.
2. **오답** - 하나씩 보내는 방식은 서로 무관한 실패에 맞습니다. 여기서는 세 실패가 호출 관계로 얽혀 있어 따로 고치면 수정이 서로 겹치거나 상쇄될 수 있습니다.
3. **정답** - 관련 실패와 그 관계를 한 메시지에 담으면 Claude가 근본 원인에 대한 하나의 일관된 수정을 계획할 수 있습니다. 두 헬퍼를 고치면 `test_orderTotal` 은 `orderTotal()` 을 건드리지 않고도 통과할 수 있습니다.
4. **오답** - 실패를 빼면 그 정보가 사라지고, 정말로 `orderTotal()` 에 별도 버그가 있었다면 영영 고쳐지지 않을 수 있습니다. 관계를 설명하며 함께 주는 편이 낫습니다.

📚 근거: [Cookbook: iterate to fix failing tests](https://platform.claude.com/cookbook/managed-agents-cma-iterate-fix-failing-tests) · [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

> "One of the failures (test_mean) is downstream of the other two, which quietly teaches the agent not to over-fix"

---

## 문제 27
### **A test run against a newly generated report-export module in Claude Code produces two failures: a currency-formatting mismatch in the summary totals and a completely unrelated failure where the export filename generator omits the file extension on Windows paths. How should these two failures be presented to Claude for the next iteration?**

| 보기 | 설명 |
|------|------|
| **1. Report each failure sequentially in its own message: first address the currency-formatting mismatch, and once confirmed fixed, the filename extension issue, because the two problems are independent.** | |
| 2. Combine both failures into a single message that shows the full test run output, noting that the currency-formatting mismatch and the filename extension omission are unrelated defects, and ask Claude to fix both. | |
| 3. Withhold the filename extension failure and report only the currency-formatting mismatch as the primary defect found first, deferring the secondary extension issue to avoid distracting Claude from the more critical formatting fix. | |
| 4. Ask Claude to evaluate the test results and fix whichever failure appears more severe first, relying on its internal judgment of the impact on report correctness without stating the exact currency mismatch or missing extension details. | |

**정답: 1.**

**해설:**

> 📘 레슨 3.5 · 반복 개선 — Iterative refinement in Claude Code: examples, tests and interviews

**📝 문제 번역**

Claude Code로 새로 만든 리포트 내보내기 모듈의 테스트 실행에서 실패가 두 개 나왔습니다. 요약 합계의 통화 형식 불일치, 그리고 전혀 무관하게 Windows 경로에서 파일 이름 생성기가 확장자를 빠뜨리는 문제입니다. 다음 반복에서 두 실패를 Claude에게 어떻게 제시해야 합니까?

- **①** 두 문제가 독립적이므로 각각 별도 메시지로 순서대로 보고한다. 먼저 통화 형식 불일치를 다루고, 수정이 확인되면 파일 확장자 문제를 다룬다
- **②** 전체 테스트 출력을 보여 주는 한 메시지에 두 실패를 합치고, 서로 무관한 결함이라고 적은 뒤 둘 다 고쳐 달라고 한다
- **③** 파일 확장자 실패는 보류하고 먼저 발견된 주요 결함인 통화 형식 불일치만 보고한다. 더 중요한 형식 수정에서 주의를 돌리지 않기 위해서다
- **④** 정확한 통화 불일치나 누락된 확장자 내용을 적지 않고, 리포트 정확성에 미치는 영향을 Claude가 판단해 더 심각해 보이는 실패부터 고치게 한다

> **핵심:** **독립적인** 문제는 하나씩 순서대로, 각각의 정확한 실패 내용과 함께 보내고 수정을 확인한 뒤 다음으로 넘어갑니다.

1. **정답** - 시험 가이드 기준은 수정끼리 영향을 주면 한 메시지에 자세히, 독립적이면 하나씩 고치고 확인하며 진행하는 것입니다. 통화 형식과 파일 확장자는 서로 다른 코드 경로라, 따로 고치면 각 수정을 단독으로 확인할 수 있고 이후 문제가 생겨도 어느 변경 탓인지 바로 압니다.
2. **오답** - 한 메시지로 묶는 것은 한쪽 수정이 다른 쪽에 영향을 주거나 가릴 수 있는 얽힌 실패일 때의 방식입니다. 명시적으로 무관한 두 결함은 순차 반복에 해당합니다.
3. **오답** - 순차 반복은 모든 실패를 차례로 고친다는 뜻이지, 알려진 결함을 숨긴다는 뜻이 아닙니다. 보류한 결함은 잊히기 쉽습니다.
4. **오답** - 실패의 구체적 내용을 빼면 Claude가 진단에 필요한 정보를 잃습니다. 묶든 나누든 정확한 실패 출력은 항상 함께 줘야 하며, 심각도 추측은 오진 위험만 키웁니다.

📚 근거: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

---

## 문제 28
### **You are building a CSV-to-JSON converter with Claude. Twice, Claude has handled empty cells and quoted commas differently from what your written spec meant. What should you give Claude next?**

| 보기 | 설명 |
|------|------|
| 1. A longer, more detailed prose specification that spells out each rule for empty cells, quoted commas and duplicate headers | |
| 2. An instruction to build on a well-known CSV parsing library and accept its default handling of these cases | |
| 3. A request to write the converter plus its own unit tests, with expected outputs derived from your written spec | |
| **4. A few sample rows, one with an empty cell and one with a quoted comma, each paired with the exact JSON it must become** | |

**정답: 4.**

**해설:**

> 📘 레슨 3.5 · 반복 개선 — Iterative refinement in Claude Code: examples, tests and interviews

**📝 문제 번역**

Claude와 CSV→JSON 변환기를 만들고 있습니다. 두 번이나 Claude가 빈 셀과 따옴표 안의 쉼표를 작성한 사양의 의도와 다르게 처리했습니다. 다음에 Claude에게 무엇을 줘야 합니까?

- **①** 빈 셀·따옴표 쉼표·중복 헤더 규칙을 하나하나 풀어 쓴, 더 길고 자세한 산문 사양
- **②** 잘 알려진 CSV 파싱 라이브러리를 기반으로 하고 이런 경우는 라이브러리 기본 처리를 따르라는 지시
- **③** 변환기와 그 자체 단위 테스트를 쓰되, 기대 출력은 작성한 사양에서 도출하라는 요청
- **④** 빈 셀이 있는 행 하나, 따옴표 쉼표가 있는 행 하나 등 샘플 행 몇 개와 각 행이 되어야 할 정확한 JSON

> **핵심:** 말로 쓴 지시가 **계속 다르게 해석** 되면, 설명을 늘리지 말고 **입출력 쌍** 으로 변환을 보여 줍니다.

1. **오답** - 더 긴 사양도 여전히 여러 방식으로 읽힐 수 있습니다. 이미 두 번 엇갈린 해석을 문장 추가로 바로잡기는 어렵습니다.
2. **오답** - 라이브러리 기본값은 그 라이브러리의 동작이지 팀이 원하는 동작이 아닙니다. 사양이 기본값과 다르면 문제는 그대로입니다.
3. **오답** - Claude가 같은 모호한 사양으로 쓴 테스트는 Claude 자신의 해석을 담습니다. 동작이 틀려도 테스트는 통과할 수 있습니다.
4. **정답** - 경계 사례를 담은 입력과 정확한 기대 출력은 해석의 여지를 없애고, Claude가 직접 대조해 볼 수 있는 목표가 됩니다. 예시는 서로 다른 경계 사례를 하나씩 건드리게 골라야 우연한 공통점을 규칙으로 배우지 않습니다. 두 번 교정에 실패한 상황이니 `/clear` 후 예시를 담은 새 프롬프트로 시작하는 것도 문서가 권하는 방법입니다.

📚 근거: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

---

## 문제 29
### **A pipeline step runs `claude "explain the failing test"` and the job hangs until it times out. What is the most direct fix?**

| 보기 | 설명 |
|------|------|
| **1. Add -p so Claude Code runs the query and exits instead of opening an interactive session** | |
| 2. Add --continue so Claude Code reuses the previous session | |
| 3. Add --output-format stream-json so output is flushed continuously | |
| 4. Pipe the prompt through cat instead of passing it as an argument | |

**정답: 1.**

**해설:**

> 📘 레슨 3.6 · CI·CD 연동 — Headless Claude Code in CI: -p, Tool Permissions and JSON Output

**📝 문제 번역**

파이프라인 단계가 `claude "explain the failing test"` 를 실행하는데, 작업이 타임아웃될 때까지 멈춰 있습니다. 가장 직접적인 해결책은?

- **①** `-p` 를 붙여 Claude Code가 대화형 세션을 여는 대신 질의를 실행하고 종료하게 한다
- **②** `--continue` 를 붙여 이전 세션을 재사용하게 한다
- **③** `--output-format stream-json` 을 붙여 출력이 계속 흘러나오게 한다
- **④** 프롬프트를 인자로 넘기지 말고 `cat` 으로 파이프한다

> **핵심:** `claude "query"` 는 **대화형 세션** 을 엽니다. 한 번 실행하고 끝나게 하려면 `-p`(`--print`)가 필요합니다.

1. **정답** - CLI 참조에서 `claude "query"` 는 그 질의를 첫 메시지로 대화형 세션을 시작하고, `claude -p "query"` 는 질의한 뒤 종료합니다. CI 러너에는 다음 입력을 줄 사람이 없으므로 `-p` 가 없으면 타임아웃까지 대기합니다.
2. **오답** - `--continue` 는 가장 최근 대화를 이어 갈 뿐 실행 방식을 비대화형으로 바꾸지 않습니다. `-p` 없이 쓰면 여전히 대화형 세션이 열립니다.
3. **오답** - `stream-json` 은 `-p` 실행의 출력 형식을 정하는 옵션입니다. 대화형 세션에서 입력을 기다리는 문제와는 무관합니다.
4. **오답** - 프롬프트를 표준 입력으로 넣는 것 자체는 비대화형을 뜻하지 않습니다. 헤드리스 실행에서 파이프 입력을 쓰는 예시도 모두 `claude -p` 와 함께 씁니다.

📚 근거: [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)

> "Query via SDK, then exit"

---

## 문제 30
### **A platform team wraps `claude` inside a GitHub Actions job that fires on every pull request to summarize the diff. The first run hangs until the job times out, with no output ever written to the log. The team confirms the API key secret is valid and the prompt text is correct. What is the most likely cause of the hang?**

| 보기 | 설명 |
|------|------|
| **1. The step ran claude without the -p flag, so the CLI opened its interactive session and waited for keyboard input that the runner cannot provide** | |
| 2. The workflow stored ANTHROPIC_API_KEY as a secret but never exposed it to the step, so the CLI kept retrying authentication in a loop until the timeout | |
| 3. The checkout used a shallow fetch-depth, so the CLI could not resolve the diff against the base branch and sat scanning the git history for missing commits | |
| 4. The runner's Node.js version is older than the CLI supports, so the process stayed running while failing to parse its own command-line arguments | |

**정답: 1.**

**해설:**

> 📘 레슨 3.6 · CI·CD 연동 — Headless Claude Code in CI: -p, Tool Permissions and JSON Output

**📝 문제 번역**

플랫폼 팀이 모든 풀 리퀘스트마다 diff를 요약하는 GitHub Actions 작업 안에서 `claude` 를 실행합니다. 첫 실행이 로그에 아무것도 쓰지 않은 채 작업 타임아웃까지 멈춰 있었습니다. API 키 시크릿은 유효하고 프롬프트 텍스트도 맞다는 것을 확인했습니다. 가장 가능성 높은 원인은?

- **①** 단계가 `-p` 플래그 없이 claude를 실행해, CLI가 대화형 세션을 열고 러너가 줄 수 없는 키보드 입력을 기다렸다
- **②** 워크플로가 `ANTHROPIC_API_KEY` 를 시크릿으로 저장했지만 단계에 노출하지 않아, CLI가 타임아웃까지 인증을 반복 재시도했다
- **③** checkout이 얕은 fetch-depth를 써서 CLI가 기준 브랜치와의 diff를 구하지 못하고, 빠진 커밋을 찾아 git 이력을 계속 스캔했다
- **④** 러너의 Node.js 버전이 CLI 지원 버전보다 낮아, 프로세스가 자기 명령줄 인자를 파싱하지 못한 채 계속 실행 중이었다

> **핵심:** 출력 없이 타임아웃까지 멈춘 CI 실행은 **`-p` 없이 대화형 세션이 열려 입력을 기다린** 전형적인 증상입니다.

1. **정답** - `-p`(`--print`)가 없으면 claude는 대화형 세션을 시작해 터미널 입력을 기다립니다. CI 러너에는 입력을 줄 대화형 터미널이 없으므로, 로그가 빈 채로 작업이 강제 종료될 때까지 멈춰 있습니다.
2. **오답** - 단계에 키가 전달되지 않으면 CLI는 인증 오류를 보고하고 곧 종료합니다. 말없이 인증을 무한 재시도하지 않으므로, 로그에 아무 출력도 없는 증상을 설명하지 못합니다.
3. **오답** - 얕은 클론은 사용할 수 있는 이력을 제한할 뿐입니다. Claude Code는 있는 이력으로 작업하거나 오류를 보고하며, 빠진 커밋을 찾느라 멈추지 않습니다.
4. **오답** - 지원하지 않는 Node.js 버전이면 시작 단계에서 보이는 오류를 내고 종료합니다. 작업 시간 내내 조용히 살아 있지 않습니다.

📚 근거: [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Run Claude Code programmatically](https://code.claude.com/docs/en/headless) · [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)

---

## 문제 31
### **You want a CI review job in which any tool call you have not pre-approved is refused, not left waiting. Which setup matches?**

| 보기 | 설명 |
|------|------|
| **1. --permission-mode dontAsk with a narrow --allowedTools list** | |
| 2. --permission-mode acceptEdits with no --allowedTools | |
| 3. -p alone, because headless mode never prompts | |
| 4. --continue, so approvals from an earlier run carry over | |

**정답: 1.**

**해설:**

> 📘 레슨 3.6 · CI·CD 연동 — Headless Claude Code in CI: -p, Tool Permissions and JSON Output

**📝 문제 번역**

미리 승인하지 않은 도구 호출은 대기하지 않고 거부되는 CI 리뷰 작업을 만들려 합니다. 알맞은 설정은?

- **①** 좁은 `--allowedTools` 목록과 함께 `--permission-mode dontAsk`
- **②** `--allowedTools` 없이 `--permission-mode acceptEdits`
- **③** 헤드리스 모드는 프롬프트를 띄우지 않으므로 `-p` 만
- **④** 이전 실행의 승인이 이어지도록 `--continue`

> **핵심:** **dontAsk** 는 프롬프트가 필요한 호출을 모두 거부하는 모드로, 문서가 "잠긴 CI"용으로 소개합니다. 필요한 도구는 `--allowedTools` 로 미리 승인합니다.

1. **정답** - dontAsk는 사전 승인되지 않아 프롬프트가 필요한 호출을 즉시 거부합니다. `--allowedTools` 나 `permissions.allow` 에 해당하는 호출, 작업 디렉터리 안의 파일 읽기와 읽기 전용 명령 집합은 계속 실행되므로, 목록을 좁게 잡으면 허용 범위가 정확히 정해집니다.
2. **오답** - acceptEdits는 파일 쓰기와 mkdir·mv 같은 흔한 파일 명령을 자동 승인하는 모드입니다. 승인되지 않은 호출을 거부하라는 요구와 반대로 편집을 넓게 허용하며, 그 밖의 셸 명령은 여전히 허용 규칙이 필요합니다.
3. **오답** - `-p` 는 다음 채팅 입력을 기다리지 않게 할 뿐, 어떤 도구를 허용·거부할지는 정하지 않습니다. 승인이 필요한 호출의 처리는 권한 모드와 규칙, 권한 호스트 여부에 달려 있으므로 거부 동작을 원하면 모드를 명시합니다.
4. **오답** - `--continue` 는 대화를 이어 갈 뿐 권한 정책을 정하지 않습니다. 이전 실행의 승인이 이어진다는 전제도 근거가 없습니다.

📚 근거: [Run Claude Code programmatically](https://code.claude.com/docs/en/headless) · [Choose a permission mode](https://code.claude.com/docs/en/permission-modes)

> "dontAsk: Claude Code denies every call that would otherwise prompt, which is useful for locked-down CI runs."

---

## 문제 32
### **An engineering lead wants CI-invoked Claude Code reviews to consistently flag missing test coverage using the team's specific definition of a "valuable test" (asserts behavior, not implementation details) and to know which fixtures already exist in the test helpers directory. Where should this project-specific guidance be encoded so every CI run picks it up automatically without being repeated in each workflow prompt?**

| 보기 | 설명 |
|------|------|
| **1. Commit a CLAUDE.md file at the repository root containing the test-quality definition and fixture list** | |
| 2. Put the test-quality definition and fixture list in the `prompt` field of each review job in the workflow YAML | |
| 3. Add the test-quality definition and fixture list to the pull request template authors fill in per PR | |
| 4. Pass the test-quality definition and fixture list via --append-system-prompt in the CI shell profile | |

**정답: 1.**

**해설:**

> 📘 레슨 3.6 · CI·CD 연동 — Headless Claude Code in CI: -p, Tool Permissions and JSON Output

**📝 문제 번역**

엔지니어링 리드는 CI에서 호출된 Claude Code 리뷰가 팀 고유의 "가치 있는 테스트" 정의(구현 세부가 아니라 동작을 검증)로 누락된 테스트 커버리지를 일관되게 지적하고, 테스트 헬퍼 디렉터리에 이미 있는 픽스처를 알기를 원합니다. 각 워크플로 프롬프트에 반복하지 않고 모든 CI 실행이 자동으로 이 지침을 받게 하려면 어디에 둬야 합니까?

- **①** 테스트 품질 정의와 픽스처 목록을 담은 CLAUDE.md를 저장소 루트에 커밋한다
- **②** 테스트 품질 정의와 픽스처 목록을 워크플로 YAML의 각 리뷰 작업 `prompt` 필드에 넣는다
- **③** 작성자가 PR마다 채우는 풀 리퀘스트 템플릿에 테스트 품질 정의와 픽스처 목록을 추가한다
- **④** CI 셸 프로필에서 `--append-system-prompt` 로 테스트 품질 정의와 픽스처 목록을 넘긴다

> **핵심:** CI 실행에 프로젝트 맥락을 반복 없이 공급하는 곳은 **저장소에 커밋된 CLAUDE.md** 입니다.

1. **정답** - Claude Code는 세션 시작 시 저장소 루트의 CLAUDE.md를 프로젝트 맥락으로 로드하므로, CI에서 호출된 실행도 워크플로 프롬프트를 바꾸지 않고 같은 기준을 받습니다. 버전 관리되므로 기준이 바뀌어도 한 곳만 고치면 됩니다. 단, `--bare` 로 실행하면 CLAUDE.md 자동 로드를 건너뛰므로 그때는 `--append-system-prompt-file` 등으로 명시적으로 넘겨야 합니다.
2. **오답** - 각 작업의 프롬프트에 붙여 넣는 것은 팀이 피하려는 바로 그 반복입니다. 기준이 바뀔 때마다 여러 YAML 블록을 고쳐야 하고 서로 어긋나기 쉽습니다.
3. **오답** - PR 템플릿은 웹 UI에서 작성자가 보는 설명란을 미리 채울 뿐, CI에서 호출된 Claude Code 세션에 로드되지 않습니다. 작성자가 채우는지에 따라 달라지기도 합니다.
4. **오답** - `--append-system-prompt` 는 실제 플래그지만 실행마다 넘기는 값이고, 셸 프로필은 저장소의 일부가 아닙니다. 지침이 특정 러너 환경에 묶여 코드와 함께 이동하지 않고 다른 러너에는 적용되지 않습니다.

📚 근거: [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions) · [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)

---

## 문제 33
### **A PR-review workflow uses the code-review plugin with --comment, but no inline comments ever appear on the PR. The skill's frontmatter lists the inline-comment tool. What is most likely missing?**

| 보기 | 설명 |
|------|------|
| **1. claude_args does not pass --allowedTools naming `mcp__github_inline_comment__create_inline_comment`** | |
| 2. The workflow has no trigger_phrase input | |
| 3. The prompt input should be removed so Claude waits for @claude | |
| 4. The job needs --output-format stream-json | |

**정답: 1.**

**해설:**

> 📘 레슨 3.6 · CI·CD 연동 — Headless Claude Code in CI: -p, Tool Permissions and JSON Output

**📝 문제 번역**

PR 리뷰 워크플로가 code-review 플러그인을 `--comment` 와 함께 쓰는데, PR에 인라인 코멘트가 전혀 달리지 않습니다. 스킬의 frontmatter에는 인라인 코멘트 도구가 나열돼 있습니다. 무엇이 빠졌을 가능성이 가장 큽니까?

- **①** `claude_args` 가 `mcp__github_inline_comment__create_inline_comment` 를 지정한 `--allowedTools` 를 넘기지 않는다
- **②** 워크플로에 `trigger_phrase` 입력이 없다
- **③** Claude가 `@claude` 를 기다리도록 `prompt` 입력을 제거해야 한다
- **④** 작업에 `--output-format stream-json` 이 필요하다

> **핵심:** Claude Code GitHub Action은 `claude_args` 의 `--allowedTools` 가 인라인 코멘트 도구를 지정할 때만 그 MCP 서버를 시작합니다.

1. **정답** - 문서의 code-review 예시는 `claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'` 를 함께 둡니다. 스킬 frontmatter가 같은 도구를 나열해도, Action이 인라인 코멘트용 MCP 서버를 띄우는 조건은 `claude_args` 쪽입니다. 그래서 이 줄이 빠지면 코멘트를 게시할 도구 자체가 없습니다.
2. **오답** - `trigger_phrase` 는 멘션 기반 실행에서 어떤 문구에 반응할지를 정하는 입력입니다. `prompt` 를 준 자동화 실행에서 인라인 코멘트 도구가 시작되는지와는 무관합니다.
3. **오답** - `prompt` 입력이 있어야 PR 이벤트마다 멘션 없이 자동 실행됩니다. 제거하면 `@claude` 멘션을 기다리는 방식이 되어 매 PR 자동 리뷰라는 목적 자체가 사라집니다.
4. **오답** - 출력 형식은 결과를 어떤 모양으로 내보낼지의 문제입니다. 인라인 코멘트를 게시하는 도구가 시작되지 않은 원인을 해결하지 못합니다.

📚 근거: [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)

> "the Claude Code GitHub Action starts the MCP server that posts inline comments only when --allowedTools in claude_args names it"

---
