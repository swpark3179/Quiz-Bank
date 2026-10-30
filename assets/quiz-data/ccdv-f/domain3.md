<!-- 출처·작성 원칙: CertSafari CCDV-F 레슨(https://certsafari.com/anthropic/claude-developer-foundations/learn) 도메인 3(3.1)의 체크포인트·Predict-first 문항 14개에 1:1로 대응한다. 각 체크포인트가 묻는 개념과 정답 근거만 따르고, 시나리오·문장·보기는 새로 썼다(원문은 옮기지 않음). 순서 맞추기·짝 맞추기·빈칸·예측 형식은 4지선다로 바꿨다. 해설은 Anthropic 공식 문서(2026년 10월 기준)를 확인해 한글로 작성. -->

## 문제 1
### **A developer on a shared repository wants Claude Code to use her personal staging API URL and a fake test account whenever she works in this one project. Teammates must not see these instructions, and they should not apply to her other projects. Where should she put them?**

| 보기 | 설명 |
|------|------|
| 1. In ~/.claude/CLAUDE.md, since files in the home directory are never committed to the repository. | |
| **2. In a CLAUDE.local.md file at the project root, which she adds to .gitignore.** | |
| 3. In .claude/CLAUDE.md, since files inside the .claude directory are private to each developer. | |
| 4. In a .claude/rules/ file whose paths field matches only the files she personally edits. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

공유 저장소에서 일하는 한 개발자가, 이 프로젝트에서 작업할 때마다 Claude Code가 자기 개인 스테이징 API URL과 가짜 테스트 계정을 쓰기를 원합니다. 팀원은 이 지시를 보면 안 되고, 그녀의 다른 프로젝트에도 적용되면 안 됩니다. 이 지시를 어디에 두어야 할까요?

- **①** ~/.claude/CLAUDE.md. 홈 디렉터리의 파일은 저장소에 커밋되지 않기 때문이다
- **②** 프로젝트 루트의 CLAUDE.local.md 파일. 그리고 이 파일을 .gitignore에 추가한다
- **③** .claude/CLAUDE.md. .claude 디렉터리 안의 파일은 개발자마다 비공개이기 때문이다
- **④** 자기가 직접 편집하는 파일에만 맞는 paths 필드를 둔 .claude/rules/ 파일

> **핵심 진단:** CLAUDE.md의 네 범위 중 **'나만, 현재 프로젝트만'** 에 해당하는 것이 `./CLAUDE.local.md`입니다. 공식 문서는 용도를 "개인적인 프로젝트별 선호"로 설명하며, 예로 바로 '내 샌드박스 URL, 선호하는 테스트 데이터'를 듭니다. 이 파일은 같은 디렉터리의 CLAUDE.md 뒤에 이어 붙어 로드됩니다. Claude Code가 자동으로 git에서 빼 주지 않으므로 `.gitignore`에 직접 추가해야 합니다.

| 범위 | 위치 | 공유 대상 |
|---|---|---|
| User | `~/.claude/CLAUDE.md` | 나만, 모든 프로젝트 |
| Project | `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` | 소스 관리로 팀 전체 |
| Local | `./CLAUDE.local.md` | 나만, 현재 프로젝트 |

1. **오답** - 팀원에게 보이지 않는 것은 맞지만 사용자 범위라 그녀의 *모든* 프로젝트에 적용됩니다. '이 프로젝트에서만'이라는 조건을 어깁니다.
2. **정답** - 나만 보고 현재 프로젝트에만 적용되는 local 범위입니다. gitignore로 커밋을 막으면 두 조건을 모두 만족합니다.
3. **오답** - `.claude/CLAUDE.md`는 `./CLAUDE.md`와 같은 *프로젝트* 범위로, 소스 관리를 통해 팀과 공유됩니다.
4. **오답** - 규칙 파일도 프로젝트 `.claude/` 아래에 있어 커밋되면 팀과 공유되고, `paths`는 *파일* 경로로 로드 시점을 정할 뿐 사람을 구분하지 않습니다.

> 💡 **시험 포인트:** 여러 git worktree에서 같은 개인 지시를 쓰려면 gitignore된 CLAUDE.local.md는 만든 worktree에만 있으므로, 홈 디렉터리의 파일을 `@` 가져오기로 불러오는 방법이 권장됩니다.

> 📚 근거 문서: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 2
### **A project's CLAUDE.md contains two references on separate lines: @docs/api-conventions.md written as plain text, and @config/legacy.json wrapped in backticks as a Markdown code span. When a new session starts, which files does Claude Code import into context?**

| 보기 | 설명 |
|------|------|
| 1. Both files, because an @ reference is resolved wherever it appears in a CLAUDE.md file. | |
| 2. Neither file until Claude reads something inside the docs or config directories. | |
| 3. Only config/legacy.json, because a code span marks a reference as an explicit import. | |
| **4. Only docs/api-conventions.md; the reference inside the code span stays literal text.** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

한 프로젝트의 CLAUDE.md에 두 참조가 서로 다른 줄에 있습니다. 하나는 일반 텍스트로 쓴 @docs/api-conventions.md이고, 다른 하나는 마크다운 코드 스팬으로 백틱에 감싼 @config/legacy.json입니다. 새 세션이 시작될 때 Claude Code는 어떤 파일을 컨텍스트로 가져올까요?

- **①** 두 파일 모두. @ 참조는 CLAUDE.md 안 어디에 있든 해석되기 때문이다
- **②** 둘 다 아니다. Claude가 docs나 config 디렉터리 안의 무언가를 읽을 때까지 가져오지 않는다
- **③** config/legacy.json만. 코드 스팬은 참조를 명시적인 가져오기로 표시하기 때문이다
- **④** docs/api-conventions.md만. 코드 스팬 안의 참조는 글자 그대로 남는다

> **핵심 진단:** CLAUDE.md는 `@path/to/import` 문법으로 다른 파일을 가져오고, 가져온 파일은 그것을 참조한 CLAUDE.md와 함께 컨텍스트에 로드됩니다. 공식 문서는 **"가져오기 해석은 마크다운 코드 스팬과 펜스 코드 블록을 건너뛴다"** 고 명시하고, 경로를 가져오지 않고 언급만 하려면 백틱으로 감싸라고 안내합니다. 그래서 일반 텍스트의 참조는 가져오고, 백틱 안의 참조는 문자열로 남습니다.

1. **오답** - 코드 스팬과 코드 블록은 해석에서 제외됩니다. 어디에 있든 가져온다는 전제가 틀렸습니다.
2. **오답** - '필요할 때 로드'되는 것은 하위 디렉터리의 CLAUDE.md와 `paths`가 있는 규칙입니다. `@` 가져오기는 참조한 CLAUDE.md와 함께 실행 시점에 로드됩니다.
3. **오답** - 정반대입니다. 백틱은 가져오기를 *막는* 표시입니다.
4. **정답** - 일반 텍스트 참조는 가져오고, 코드 스팬 안의 참조는 문자 그대로 남는다는 문서 설명과 일치합니다.

> 💡 **시험 포인트:** 가져오기는 정리에는 좋지만 컨텍스트를 줄이지 않습니다. 가져온 파일도 실행 시점에 함께 로드되기 때문입니다. 로드량을 줄이려면 `paths`가 있는 규칙 파일이나 스킬로 옮기세요.

> 📚 근거 문서: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 3
### **A team is adopting Claude Code on a five-year-old repository that has no CLAUDE.md yet. Which sequence follows the documented way to bootstrap a useful project CLAUDE.md?**

| 보기 | 설명 |
|------|------|
| **1. Run /init → Claude analyzes the codebase and drafts CLAUDE.md → the team reviews it, removing wrong or obvious items and adding what Claude can't discover → commit it to version control** | |
| 2. Write CLAUDE.md by hand → run /init so it overwrites the file with the discovered commands → commit it → review it later only when problems appear | |
| 3. Run /init → commit the generated file immediately → let Claude remove wrong items on its own in later sessions → review the file once a quarter | |
| 4. Run /init → add the generated CLAUDE.md to .gitignore → review it → share it by copying the file into each teammate's clone | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

한 팀이 아직 CLAUDE.md가 없는 5년 된 저장소에 Claude Code를 도입하려 합니다. 쓸모 있는 프로젝트 CLAUDE.md를 처음 만드는 공식 방법을 따른 순서는 무엇일까요?

- **①** /init을 실행한다 → Claude가 코드베이스를 분석해 CLAUDE.md 초안을 쓴다 → 팀이 검토하며 틀리거나 뻔한 항목을 지우고 Claude가 알아낼 수 없는 내용을 더한다 → 버전 관리에 커밋한다
- **②** CLAUDE.md를 손으로 쓴다 → /init을 실행해 찾아낸 명령으로 파일을 덮어쓴다 → 커밋한다 → 문제가 생길 때만 나중에 검토한다
- **③** /init을 실행한다 → 생성된 파일을 바로 커밋한다 → 이후 세션에서 Claude가 틀린 항목을 스스로 지우게 둔다 → 분기마다 한 번 파일을 검토한다
- **④** /init을 실행한다 → 생성된 CLAUDE.md를 .gitignore에 넣는다 → 검토한다 → 팀원의 클론마다 파일을 복사해 공유한다

> **핵심 진단:** 공식 문서는 `/init`을 실행하면 **Claude가 코드베이스를 분석해** 빌드 명령, 테스트 방법, 발견한 프로젝트 관례를 담은 파일을 만든다고 설명하고, 거기서부터 **Claude가 스스로 알아낼 수 없는 지시를 더해 다듬으라** 고 안내합니다. 프로젝트 CLAUDE.md는 빌드·테스트 명령, 코딩 표준, 아키텍처 결정처럼 프로젝트에서 일하는 모두에게 해당하는 내용을 담고 **버전 관리로 팀과 공유** 하는 파일입니다. 따라서 생성 → 사람의 검토·보완 → 커밋 순서가 맞습니다.

1. **정답** - 자동 초안을 사람이 검토해 잘못된 것과 불필요한 것을 덜고 빠진 것을 보탠 뒤 팀이 공유하도록 커밋합니다.
2. **오답** - CLAUDE.md가 이미 있으면 `/init`은 덮어쓰지 않고 개선안을 제안합니다. 검토를 문제가 생길 때까지 미루는 것도 잘못된 내용이 팀 전체에 퍼지게 둡니다.
3. **오답** - 검토 없이 커밋하면 잘못된 명령이나 관례가 모든 팀원의 세션에 들어갑니다. Claude가 틀린 항목을 알아서 지운다는 동작도 없습니다.
4. **오답** - 프로젝트 CLAUDE.md는 소스 관리로 공유하는 파일입니다. gitignore하고 손으로 복사하면 팀원마다 내용이 달라집니다.

> 💡 **시험 포인트:** `/init`은 출발점일 뿐입니다. CLAUDE.md는 짧고 구체적일수록 잘 지켜지므로(파일당 200줄 이하 권장), 생성 결과에서 덜어 내는 검토가 꼭 필요합니다.

> 📚 근거 문서: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 4
### **A team wants a rule file in .claude/rules/ to load only when Claude works with TypeScript files under src/api/. In the file's YAML frontmatter, which field should hold a glob that matches every .ts file below src/api/?**

| 보기 | 설명 |
|------|------|
| 1. globs | |
| 2. applyTo | |
| **3. paths** | |
| 4. include | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

한 팀이 .claude/rules/의 규칙 파일을 Claude가 src/api/ 아래의 TypeScript 파일을 다룰 때만 로드되게 하려 합니다. 파일의 YAML 프런트매터에서 src/api/ 아래의 모든 .ts 파일에 맞는 글로브를 담을 필드는 무엇일까요?

- **①** globs
- **②** applyTo
- **③** paths
- **④** include

> **핵심 진단:** 규칙 파일은 YAML 프런트매터의 **`paths`** 필드로 특정 파일에만 적용되게 할 수 있습니다. 공식 문서는 **`paths`가 Claude Code가 규칙에서 읽는 유일한 필드이고, 다른 필드는 오류 없이 무시된다** 고 설명합니다. `paths`가 있는 규칙은 Claude가 일치하는 파일을 Read·Write·Edit할 때 로드되고, `paths`가 없는 규칙은 실행 시점에 매번 로드됩니다.

```markdown
paths:
  - "src/api/**/*.ts"
```

(실제 파일에서는 위 내용을 위아래 프런트매터 구분선 사이에 둡니다.)

1. **오답** - 다른 도구의 규칙 형식에서 볼 수 있는 이름이지만, Claude Code는 이 필드를 읽지 않습니다. 무시되므로 규칙이 매번 로드됩니다.
2. **오답** - 역시 다른 도구의 지시 파일 형식에서 쓰는 이름입니다. Claude Code에서는 오류 없이 무시됩니다.
3. **정답** - Claude Code 규칙 파일에서 적용 범위를 정하는 유일한 프런트매터 필드입니다.
4. **오답** - Claude Code 규칙의 필드가 아닙니다. 인식되지 않는 필드는 경고 없이 무시되므로 오타나 잘못된 이름은 특히 알아채기 어렵습니다.

> 💡 **시험 포인트:** 프런트매터 YAML이 깨지면 Claude Code는 프런트매터를 무시하고 `paths`가 없는 것처럼 규칙을 매번 로드합니다. 범위가 듣지 않으면 `claude --debug`로 파싱 오류를 확인하세요.

> 📚 근거 문서: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 5
### **Claude Code's auto memory records a type for each note it saves. Match each note to its type: (a) "The user is a data engineer who prefers Polars over pandas." (b) "The user corrected me: integration tests must hit the real database, not mocks." (c) "The billing migration is frozen until the November 14 release; decided in planning." (d) "Incidents are tracked on the OPS board in Linear; the latency dashboard is in Grafana."**

| 보기 | 설명 |
|------|------|
| **1. (a) user (b) feedback (c) project (d) reference** | |
| 2. (a) user (b) project (c) feedback (d) reference | |
| 3. (a) reference (b) feedback (c) project (d) user | |
| 4. (a) feedback (b) user (c) reference (d) project | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

Claude Code의 자동 메모리는 저장하는 노트마다 유형을 기록합니다. 각 노트를 유형과 짝지으세요. (a) "사용자는 데이터 엔지니어이며 pandas보다 Polars를 선호한다." (b) "사용자가 교정했다: 통합 테스트는 목(mock)이 아니라 실제 데이터베이스를 써야 한다." (c) "결제 마이그레이션은 11월 14일 릴리스까지 동결한다. 기획 회의에서 결정했다." (d) "장애는 Linear의 OPS 보드에서 관리하고, 지연 시간 대시보드는 Grafana에 있다."

- **①** (a) user (b) feedback (c) project (d) reference
- **②** (a) user (b) project (c) feedback (d) reference
- **③** (a) reference (b) feedback (c) project (d) user
- **④** (a) feedback (b) user (c) reference (d) project

> **핵심 진단:** 자동 메모리는 네 종류의 노트를 저장하고, 종류를 메모리 파일 프런트매터의 `type` 필드에 기록합니다.

| `type` | 담는 내용 | 이 문제의 노트 |
|---|---|---|
| `user` | 사용자의 역할, 전문성, 작업 선호 | (a) 직무와 라이브러리 선호 |
| `feedback` | 사용자가 준 교정과 확인해 준 접근법 | (b) 목 대신 실제 DB라는 교정 |
| `project` | 코드나 git 기록으로 알 수 없는 진행 중 작업·마감·결정 | (c) 동결 결정과 날짜 |
| `reference` | 프로젝트 밖 정보의 위치 | (d) 이슈 트래커와 대시보드 위치 |

1. **정답** - 네 노트가 모두 공식 정의와 맞게 짝지어졌습니다.
2. **오답** - (b)와 (c)가 뒤바뀌었습니다. 사용자의 교정은 feedback, 일정과 결정은 project입니다.
3. **오답** - (a)와 (d)가 뒤바뀌었습니다. 사람에 대한 정보는 user, 외부 정보의 위치는 reference입니다.
4. **오답** - 네 짝이 모두 어긋났습니다.

> 💡 **시험 포인트:** Claude는 코드베이스에서 알아낼 수 있는 것(아키텍처, 파일 경로, 디버깅 수정)과 CLAUDE.md에 이미 있는 것은 저장하지 않습니다. 메모리는 *코드에 없는* 사람·교정·결정·바깥 위치를 위한 것입니다.

> 📚 근거 문서: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 6
### **The same settings key is set in four places: the organization's managed settings, a JSON string passed with --settings at launch, the project's .claude/settings.local.json, and the developer's ~/.claude/settings.json. Which order lists them from highest to lowest precedence?**

| 보기 | 설명 |
|------|------|
| 1. ~/.claude/settings.json → .claude/settings.local.json → --settings JSON → managed settings | |
| 2. --settings JSON → managed settings → ~/.claude/settings.json → .claude/settings.local.json | |
| 3. managed settings → .claude/settings.local.json → --settings JSON → ~/.claude/settings.json | |
| **4. managed settings → --settings JSON → .claude/settings.local.json → ~/.claude/settings.json** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

같은 설정 키가 네 곳에 있습니다. 조직의 managed 설정, 실행할 때 --settings로 넘긴 JSON 문자열, 프로젝트의 .claude/settings.local.json, 개발자의 ~/.claude/settings.json입니다. 우선순위가 높은 것부터 낮은 것 순으로 나열한 것은 무엇일까요?

- **①** ~/.claude/settings.json → .claude/settings.local.json → --settings JSON → managed 설정
- **②** --settings JSON → managed 설정 → ~/.claude/settings.json → .claude/settings.local.json
- **③** managed 설정 → .claude/settings.local.json → --settings JSON → ~/.claude/settings.json
- **④** managed 설정 → --settings JSON → .claude/settings.local.json → ~/.claude/settings.json

> **핵심 진단:** 공식 문서의 우선순위는 높은 것부터 **managed → 명령줄(`--settings`) → project local(`.claude/settings.local.json`) → shared project(`.claude/settings.json`) → user(`~/.claude/settings.json`)** 입니다. 높은 단계의 키가 아래 단계의 같은 키를 덮어씁니다. managed 키는 사용자의 어떤 파일로도, `--settings`로도 덮어쓸 수 없습니다. `--settings`는 그 세션에만 적용되며 사용자·프로젝트·local 파일보다 위, managed보다 아래입니다.

1. **오답** - 순서를 통째로 뒤집었습니다. 사용자 설정은 가장 낮고 managed가 가장 높습니다.
2. **오답** - 명령줄 JSON도 managed를 넘지 못합니다. 또 project local은 user보다 높습니다.
3. **오답** - `--settings`는 project local보다 높습니다. 한 세션만 바꾸려고 명시적으로 넘긴 값이기 때문입니다.
4. **정답** - managed, 명령줄, project local, user 순서가 문서와 일치합니다.

> 💡 **시험 포인트:** `permissions.allow` 같은 목록 키는 덮어쓰지 않고 *병합* 됩니다. 그리고 권한 규칙에서는 어느 단계든 deny된 도구를 다른 단계가 허용할 수 없습니다.

> 📚 근거 문서: [Settings files and precedence](https://code.claude.com/docs/en/settings)

---

## 문제 7
### **A developer has a personal skill at ~/.claude/skills/release-notes/SKILL.md. The repository she works in also commits a project skill at .claude/skills/release-notes/SKILL.md with different steps. No enterprise skill uses that name. She types /release-notes. Which skill runs?**

| 보기 | 설명 |
|------|------|
| 1. The project skill, because the skill closest to the working directory takes precedence. | |
| 2. Both skills, merged into a single prompt in the order Claude Code discovered them. | |
| **3. The personal skill, because personal skills take precedence over project skills.** | |
| 4. Neither; Claude Code reports a name conflict and asks her to rename one of them. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

한 개발자가 ~/.claude/skills/release-notes/SKILL.md에 개인 스킬을 두고 있습니다. 그녀가 작업하는 저장소에도 단계가 다른 프로젝트 스킬이 .claude/skills/release-notes/SKILL.md로 커밋되어 있습니다. 같은 이름의 엔터프라이즈 스킬은 없습니다. 그녀가 /release-notes를 입력하면 어떤 스킬이 실행될까요?

- **①** 프로젝트 스킬. 작업 디렉터리에 가장 가까운 스킬이 우선하기 때문이다
- **②** 두 스킬 모두. Claude Code가 찾은 순서대로 하나의 프롬프트로 합친다
- **③** 개인 스킬. 개인 스킬이 프로젝트 스킬보다 우선하기 때문이다
- **④** 둘 다 아니다. Claude Code가 이름 충돌을 알리고 하나의 이름을 바꾸라고 한다

> **핵심 진단:** 스킬은 enterprise(managed 설정 디렉터리), personal(`~/.claude/skills/`), project(`.claude/skills/`), plugin에 둘 수 있고, 이름이 겹치면 공식 문서의 규칙은 **"enterprise가 personal보다, personal이 project보다 우선한다"** 입니다. 문서는 같은 `deploy`가 `~/.claude/skills/`와 프로젝트 `.claude/skills/`에 모두 있으면 `/deploy`는 개인 스킬을 실행한다는 예를 직접 듭니다. 플러그인 스킬은 `/plugin-name:skill-name`으로 네임스페이스가 붙어 이 충돌에 끼지 않습니다.

1. **오답** - CLAUDE.md는 작업 디렉터리에 가까운 내용이 나중에 읽히지만, 스킬 이름 충돌은 위치의 가까움이 아니라 범위 순서로 정해집니다.
2. **오답** - 같은 이름의 스킬을 합치는 동작은 없습니다. 하나만 실행됩니다.
3. **정답** - personal이 project보다 우선하므로 개인 스킬이 실행됩니다.
4. **오답** - 충돌은 우선순위 규칙으로 해결되며 오류를 내지 않습니다.

> 💡 **시험 포인트:** 스킬은 *개인이 프로젝트를* 이기지만, 서브에이전트는 *프로젝트 `.claude/agents/`가 사용자 `~/.claude/agents/`를* 이깁니다. 두 순서를 바꿔 놓은 보기에 주의하세요. 같은 이름의 `.claude/commands/` 파일과 스킬이 있으면 스킬이 이깁니다.

> 📚 근거 문서: [Skills](https://code.claude.com/docs/en/skills)

---

## 문제 8
### **A team defines a custom subagent in .claude/agents/schema-reviewer.md and does not set omitClaudeMd. The project's CLAUDE.md states that every database migration must be reversible. When Claude delegates a review to schema-reviewer, does the subagent see that rule?**

| 보기 | 설명 |
|------|------|
| 1. No; a subagent starts with only its own system prompt and the delegation message. | |
| **2. Yes; custom subagents load the CLAUDE.md hierarchy unless omitClaudeMd is set to true.** | |
| 3. No; only the built-in Explore and Plan agents load CLAUDE.md files at startup. | |
| 4. Yes, but only if the rule is also listed in the subagent's skills field. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

한 팀이 .claude/agents/schema-reviewer.md에 커스텀 서브에이전트를 정의하고 omitClaudeMd는 설정하지 않았습니다. 프로젝트의 CLAUDE.md에는 모든 데이터베이스 마이그레이션은 되돌릴 수 있어야 한다는 규칙이 있습니다. Claude가 schema-reviewer에 검토를 맡기면, 서브에이전트는 그 규칙을 볼 수 있을까요?

- **①** 아니다. 서브에이전트는 자기 시스템 프롬프트와 위임 메시지만 가지고 시작한다
- **②** 그렇다. 커스텀 서브에이전트는 omitClaudeMd를 true로 설정하지 않는 한 CLAUDE.md 계층을 로드한다
- **③** 아니다. 시작할 때 CLAUDE.md를 로드하는 것은 내장 Explore와 Plan 에이전트뿐이다
- **④** 그렇다. 단, 그 규칙이 서브에이전트의 skills 필드에도 나열되어 있을 때만이다

> **핵심 진단:** 서브에이전트는 부모의 대화 기록 없이 새 컨텍스트에서 시작하지만, 비어 있지는 않습니다. 공식 문서는 커스텀 서브에이전트의 초기 컨텍스트에 **메인 대화가 로드하는 CLAUDE.md 계층 전체** (`~/.claude/CLAUDE.md`, 프로젝트 규칙, `CLAUDE.local.md`, managed 정책 파일 등)가 들어간다고 설명합니다. `omitClaudeMd: true`를 설정해야 사용자·프로젝트·local CLAUDE.md 없이 시작하며(managed 정책 파일은 여전히 로드), 이 값은 설정하지 않으면 꺼져 있습니다.

1. **오답** - 부모의 *대화 기록* 을 받지 않는다는 것과 CLAUDE.md를 받지 않는다는 것은 다릅니다. CLAUDE.md는 기본으로 로드됩니다.
2. **정답** - `omitClaudeMd`를 켜지 않았으므로 프로젝트 CLAUDE.md의 규칙이 서브에이전트 컨텍스트에 들어갑니다.
3. **오답** - 정반대입니다. 내장 `Explore`와 `Plan`이 CLAUDE.md와 git 상태 스냅숏 *없이* 시작하는 예외입니다.
4. **오답** - `skills` 필드는 시작할 때 미리 넣을 스킬을 정하는 것으로, CLAUDE.md 로드와는 관계가 없습니다.

> 💡 **시험 포인트:** `omitClaudeMd`는 위임 프롬프트에서 필요한 것을 모두 받는 서브에이전트에 쓰는 옵션입니다. 기본값(미설정)이면 커스텀 서브에이전트는 프로젝트 지시를 따릅니다.

> 📚 근거 문서: [Subagents](https://code.claude.com/docs/en/sub-agents) · [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)

---

## 문제 9
### **Match each need to the Claude Code command that serves it: (a) from the shell, reopen the most recent conversation in the current directory; (b) at launch, choose an older conversation from an interactive list; (c) while already inside a session, switch to a different saved conversation.**

| 보기 | 설명 |
|------|------|
| 1. (a) claude --resume (b) claude --continue (c) /resume | |
| 2. (a) /resume (b) claude --resume (c) claude --continue | |
| 3. (a) claude --continue (b) /resume (c) claude --resume | |
| **4. (a) claude --continue (b) claude --resume (c) /resume** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

각 요구와 그것을 처리하는 Claude Code 명령을 짝지으세요. (a) 셸에서 현재 디렉터리의 가장 최근 대화를 다시 연다, (b) 실행할 때 대화형 목록에서 예전 대화를 고른다, (c) 이미 세션 안에 있는 상태에서 저장된 다른 대화로 전환한다.

- **①** (a) claude --resume (b) claude --continue (c) /resume
- **②** (a) /resume (b) claude --resume (c) claude --continue
- **③** (a) claude --continue (b) /resume (c) claude --resume
- **④** (a) claude --continue (b) claude --resume (c) /resume

> **핵심 진단:** 세션 관리 문서의 표는 세 명령을 이렇게 나눕니다.

| 명령 | 하는 일 |
|---|---|
| `claude --continue` | 현재 디렉터리의 가장 최근 세션을 다시 연다 |
| `claude --resume` | 세션 선택기를 연다(이름·ID를 주면 바로 재개) |
| `/resume` | 활성 세션 안에서 다른 세션으로 전환한다 |

1. **오답** - (a)와 (b)가 뒤바뀌었습니다. `--continue`는 고르지 않고 가장 최근 것을 열고, 목록을 띄우는 것은 `--resume`입니다.
2. **오답** - `/resume`은 세션 안에서 쓰는 명령이라 셸에서 최근 대화를 여는 용도가 아니고, `--continue`는 세션 안에서 전환하는 명령이 아닙니다.
3. **오답** - (b)와 (c)가 뒤바뀌었습니다. 실행 시 목록은 셸의 `--resume`, 세션 안 전환은 `/resume`입니다.
4. **정답** - 최근 대화는 `--continue`, 실행 시 선택은 `--resume`, 세션 안 전환은 `/resume`입니다.

> 💡 **시험 포인트:** 원본을 그대로 두고 다른 시도를 하려면 `--fork-session`이나 `/branch`로 갈라집니다. `claude -p`나 Agent SDK로 만든 세션은 선택기와 `--continue`에서 빠지지만 세션 ID로 `--resume`할 수 있습니다.

> 📚 근거 문서: [Manage sessions](https://code.claude.com/docs/en/sessions)

---

## 문제 10
### **A long-running project's auto memory index, MEMORY.md, has grown to 340 short lines (well under 25KB), and Claude has also written a dozen topic files in the same memory directory. What does a new session load from auto memory at startup?**

| 보기 | 설명 |
|------|------|
| **1. The first 200 lines of MEMORY.md; the remaining lines are not loaded at start, and topic files are read only when needed.** | |
| 2. All 340 lines of MEMORY.md plus every topic file, because auto memory always loads completely. | |
| 3. Only the topic files, because MEMORY.md is an index that Claude consults on demand. | |
| 4. The last 200 lines of MEMORY.md, because the most recent memories are the most relevant ones. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

오래 진행된 프로젝트의 자동 메모리 색인 MEMORY.md가 짧은 줄 340개로 늘었고(25KB보다 훨씬 작음), Claude는 같은 메모리 디렉터리에 주제 파일도 열두 개 써 두었습니다. 새 세션은 시작할 때 자동 메모리에서 무엇을 로드할까요?

- **①** MEMORY.md의 첫 200줄. 나머지 줄은 시작 시점에 로드되지 않고, 주제 파일은 필요할 때만 읽는다
- **②** MEMORY.md 340줄 전부와 모든 주제 파일. 자동 메모리는 항상 전부 로드되기 때문이다
- **③** 주제 파일만. MEMORY.md는 Claude가 필요할 때 참고하는 색인이기 때문이다
- **④** MEMORY.md의 마지막 200줄. 가장 최근 메모리가 가장 관련이 깊기 때문이다

> **핵심 진단:** 공식 문서는 **"`MEMORY.md`의 첫 200줄 또는 첫 25KB 중 먼저 닿는 쪽까지가 매 대화 시작 때 로드되고, 그 뒤의 내용은 시작 시점에 로드되지 않는다"** 고 설명합니다. 이 색인은 340줄이지만 25KB보다 작으므로 200줄에서 끊깁니다. 주제 파일은 시작 때 로드되지 않으며, Claude가 정보가 필요할 때 일반 파일 도구로 읽습니다. 이 한도는 `MEMORY.md`에만 적용되고, 실행 시점에 로드되는 CLAUDE.md는 4 MiB 이하라면 전체가 들어갑니다.

1. **정답** - 색인은 첫 200줄까지, 나머지는 시작 시 제외, 주제 파일은 필요할 때 읽기라는 설명과 일치합니다.
2. **오답** - 자동 메모리는 전부 로드되지 않습니다. 이것이 흔한 오해이며, 바로 그 때문에 색인을 짧게 유지해야 합니다.
3. **오답** - 반대입니다. 시작 때 들어가는 것은 색인이고, 주제 파일이 필요할 때 읽힙니다.
4. **오답** - 잘리는 쪽은 뒤쪽입니다. 앞에서부터 200줄이 로드됩니다.

> 💡 **시험 포인트:** Claude가 `MEMORY.md`에 쓴 뒤 파일이 한도에 가까우면 Claude Code가 줄이라고 알리고, 넘으면 쓰기는 성공하지만 다음 로드에서 한도 너머가 버려지므로 색인을 다시 쓰라는 오류를 돌려줍니다.

> 📚 근거 문서: [How Claude remembers your project](https://code.claude.com/docs/en/memory)

---

## 문제 11
### **A CI job runs `claude -p "fix the lint errors" --output-format ____` and must show each tool call and each API retry on a dashboard as they happen, rather than receiving a single JSON object at the end. Which value fills the blank?**

| 보기 | 설명 |
|------|------|
| 1. text | |
| 2. json | |
| **3. stream-json** | |
| 4. ndjson | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

CI 작업이 `claude -p "fix the lint errors" --output-format ____`를 실행하며, 마지막에 JSON 객체 하나를 받는 대신 각 도구 호출과 API 재시도를 일어나는 대로 대시보드에 보여 줘야 합니다. 빈칸에 들어갈 값은 무엇일까요?

- **①** text
- **②** json
- **③** stream-json
- **④** ndjson

> **핵심 진단:** 헤드리스 실행(`-p`)의 출력 형식은 세 가지입니다. **`text`** (기본, 일반 텍스트), **`json`** (결과·세션 ID·메타데이터를 담은 구조화 JSON), **`stream-json`** (실시간 스트리밍을 위한 줄 단위 JSON)입니다. `stream-json`은 줄마다 이벤트 하나를 내보내고, 재시도 가능한 오류로 다시 시도할 때 `system/api_retry` 이벤트를 내며, 마지막 줄은 최종 응답과 비용을 담은 `result` 메시지입니다. 토큰 단위 텍스트까지 받으려면 `--verbose`와 `--include-partial-messages`를 함께 씁니다.

1. **오답** - 일반 텍스트는 사람이 읽는 출력이라 이벤트 단위로 파싱할 수 없습니다.
2. **오답** - `json`은 실행이 끝난 뒤 결과를 담은 JSON 하나를 돌려줍니다. '일어나는 대로'라는 요구를 채우지 못합니다.
3. **정답** - 줄 단위 JSON 이벤트를 실시간으로 내보내므로 도구 호출과 재시도를 진행 중에 보여 줄 수 있습니다.
4. **오답** - 형식 이름처럼 보이지만 `--output-format`이 받는 값이 아닙니다.

> 💡 **시험 포인트:** 스키마에 맞는 결과가 필요하면 `--output-format json`과 `--json-schema`를 함께 쓰고 `structured_output` 필드를 읽습니다. CI에서는 기계마다 결과가 같도록 `--bare`를 권합니다.

> 📚 근거 문서: [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)

---

## 문제 12
### **A teammate commits `"permissions": {"defaultMode": "auto"}` to the repository's .claude/settings.json so that "everyone gets auto mode." Before pulling the change, predict its effect on how your interactive terminal sessions in that repository start.**

| 보기 | 설명 |
|------|------|
| 1. Your sessions start in auto mode once you trust the folder, because shared project settings apply to everyone. | |
| **2. The committed value has no effect, because auto is honored as a defaultMode only from user or managed settings or the flag.** | |
| 3. Your sessions start in auto mode only when your own ~/.claude/settings.json sets no defaultMode of its own. | |
| 4. Claude Code rejects the entire project settings file as invalid and starts without any project settings. | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

팀원이 "모두가 auto 모드를 쓰도록" 저장소의 .claude/settings.json에 `"permissions": {"defaultMode": "auto"}`를 커밋했습니다. 변경을 받기 전에, 이것이 그 저장소에서 여는 내 대화형 터미널 세션의 시작 방식에 어떤 영향을 줄지 예측해 보세요.

- **①** 폴더를 신뢰하고 나면 세션이 auto 모드로 시작한다. 공유 프로젝트 설정은 모두에게 적용되기 때문이다
- **②** 커밋된 값은 효과가 없다. defaultMode의 auto는 사용자·managed 설정이나 플래그에서만 인정되기 때문이다
- **③** 내 ~/.claude/settings.json에 defaultMode가 없을 때만 세션이 auto 모드로 시작한다
- **④** Claude Code가 프로젝트 설정 파일 전체를 잘못된 파일로 거부하고 프로젝트 설정 없이 시작한다

> **핵심 진단:** 설정 문서는 "설정한 값이 무시될 때"의 한 사례로 **`permissions.defaultMode`의 `auto`와 `bypassPermissions`는 프로젝트·local 설정에서 효과가 없다** 고 명시하고, 사용자나 managed 설정에 두거나 `--permission-mode`로 한 세션만 지정하라고 안내합니다. 저장소 파일 하나로 모든 클론의 권한 수준을 올리지 못하게 막는 설계입니다. 커밋된 줄은 무시될 뿐 파일 전체를 망가뜨리지 않으며, 다른 키는 정상 적용됩니다.

1. **오답** - 신뢰 단계를 기다리는 것은 `permissions.allow` 같은 키입니다. `defaultMode`의 auto는 신뢰와 무관하게 프로젝트 파일에서 인정되지 않습니다.
2. **정답** - auto(와 bypassPermissions)는 프로젝트·local 파일에서 시작 모드로 쓰이지 않습니다.
3. **오답** - 사용자 설정의 유무와 관계없이 프로젝트 파일의 auto는 효과가 없습니다.
4. **오답** - 파일이 거부되지 않습니다. 해당 값만 효과가 없고 나머지 설정은 그대로 적용됩니다.

> 💡 **시험 포인트:** 프로젝트 파일의 `"bypassPermissions"`도 무시되며 세션은 Manual로 시작합니다. auto 모드 분류기 설정인 `autoMode` 블록도 프로젝트 설정에서는 읽지 않습니다.

> 📎 참고: 문서상 새 터미널 세션의 모드는 플래그 → 설정 파일의 `defaultMode` → 내장 기본값 순으로 정해지고, 최신 버전(v2.1.283 이상)에서 대화형 터미널 세션의 내장 기본값은 auto 모드를 쓸 수 있으면 `auto`입니다. 따라서 '세션이 auto로 시작하지 않는다'고 단정하기보다 '커밋된 값이 시작 모드를 정하지 못한다'로 이해해야 정확합니다.

> 📚 근거 문서: [Settings files and precedence](https://code.claude.com/docs/en/settings) · [Permission modes](https://code.claude.com/docs/en/permission-modes)

---

## 문제 13
### **A platform team lets developers use auto mode but must guarantee that `terraform destroy` never runs, regardless of what a user says in the conversation or how the auto mode classifier is configured. Which control provides that guarantee?**

| 보기 | 설명 |
|------|------|
| **1. A permissions.deny rule matching the command, which blocks it before the classifier is consulted.** | |
| 2. A line in the project CLAUDE.md telling Claude never to run terraform destroy. | |
| 3. A permissions.ask rule matching the command, so that a human is always prompted first. | |
| 4. An autoMode.soft_deny entry that describes terraform destroy as a destructive action. | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

플랫폼 팀이 개발자에게 auto 모드 사용을 허용하면서도, 사용자가 대화에서 무엇이라 하든, auto 모드 분류기가 어떻게 설정되어 있든 `terraform destroy`가 절대 실행되지 않도록 보장해야 합니다. 이 보장을 제공하는 통제는 무엇일까요?

- **①** 그 명령에 일치하는 permissions.deny 규칙. 분류기에 묻기 전에 막는다
- **②** 프로젝트 CLAUDE.md에 terraform destroy를 절대 실행하지 말라고 적은 줄
- **③** 그 명령에 일치하는 permissions.ask 규칙. 항상 사람에게 먼저 확인을 받는다
- **④** terraform destroy를 파괴적 행동으로 설명하는 autoMode.soft_deny 항목

> **핵심 진단:** auto 모드 설정 문서는 경계의 강도에 따라 수단을 나눕니다. **'절대 실행하지 않음'은 `permissions.deny`** 이며, 분류기에 묻기 전에 막고 **분류기도 사용자 의도도 뒤집을 수 없습니다.** 또 사용자 의도나 분류기 설정과 무관하게 반드시 막아야 하는 행동에는 managed 설정의 `permissions.deny`를 쓰라고 안내합니다. deny 규칙은 `bypassPermissions`를 포함한 모든 모드에서 막습니다.

| 원하는 경계 | 수단 | auto 모드에서 |
|---|---|---|
| 실행 전에 확인 | `permissions.ask` | 항상 확인을 띄움(승인하면 실행) |
| 절대 실행 금지 | `permissions.deny` | 분류기 전에 차단, 무엇으로도 뒤집지 못함 |
| 이번 세션만 | 대화로 말하기 | 압축으로 사라질 수 있음 |

1. **정답** - deny 규칙은 분류기보다 먼저 평가되어 무조건 막습니다. 요구한 '보장'을 주는 유일한 수단입니다.
2. **오답** - 분류기는 CLAUDE.md를 읽으므로 행동을 어느 정도 이끌지만, CLAUDE.md는 강제되는 설정이 아니라 맥락입니다.
3. **오답** - ask는 확인을 강제할 뿐, 사람이 승인하면 명령은 실행됩니다. '절대 실행 금지'가 아닙니다.
4. **오답** - `soft_deny`는 분류기 안의 규칙으로, 사용자의 명시적 의도나 `allow` 예외가 뒤집을 수 있습니다. 개발자가 추가한 `allow` 항목이 조직의 `soft_deny`를 덮을 수도 있습니다.

> 💡 **시험 포인트:** auto 모드에서 '확인'은 ask, '금지'는 deny, '대화로 한 약속'은 일시적입니다. 조직 차원의 금지라면 managed 설정에 deny를 둡니다.

> 📚 근거 문서: [Configure auto mode](https://code.claude.com/docs/en/auto-mode-config) · [Permission modes](https://code.claude.com/docs/en/permission-modes)

---

## 문제 14
### **Your organization's managed settings deny `Bash(curl *)`. A repository's .claude/settings.json allows `Bash(curl *)`, and you also launch Claude Code with `--allowedTools "Bash(curl *)"`. Claude then tries to run `curl https://status.example.com/health`. What happens?**

| 보기 | 설명 |
|------|------|
| 1. It runs, because a command-line flag has higher precedence than every settings file. | |
| 2. It runs, because the project allow rule and the flag together outweigh a single managed deny. | |
| **3. It is denied; a deny at any level can't be allowed elsewhere, and managed rules can't be overridden.** | |
| 4. It prompts you for approval, because conflicting rules from different scopes fall back to asking. | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D3 · Claude Code · 3.1 Claude Code Operation

**📝 문제 번역**

조직의 managed 설정이 `Bash(curl *)`를 거부합니다. 저장소의 .claude/settings.json은 `Bash(curl *)`를 허용하고, 사용자는 `--allowedTools "Bash(curl *)"`로 Claude Code를 실행하기도 했습니다. 그런 다음 Claude가 `curl https://status.example.com/health`를 실행하려 합니다. 어떻게 될까요?

- **①** 실행된다. 명령줄 플래그는 모든 설정 파일보다 우선하기 때문이다
- **②** 실행된다. 프로젝트 allow 규칙과 플래그가 합쳐져 managed deny 하나를 이기기 때문이다
- **③** 거부된다. 어느 단계의 deny든 다른 곳에서 허용할 수 없고, managed 규칙은 덮어쓸 수 없다
- **④** 승인을 요청한다. 서로 다른 범위의 규칙이 충돌하면 확인 요청으로 넘어가기 때문이다

> **핵심 진단:** 권한 문서는 두 원칙을 명시합니다. 첫째, 권한 규칙은 다른 설정과 같은 우선순위를 따르며 **managed가 가장 높아 명령줄 인수를 포함한 어떤 단계도 managed 권한 규칙을 덮어쓸 수 없다.** 둘째, **어느 단계에서든 도구가 거부되면 다른 단계가 그것을 허용할 수 없다.** 문서는 예로 managed 설정의 deny는 `--allowedTools`로 뒤집을 수 없다고 듭니다. 또 규칙 평가 자체가 deny → ask → allow 순이라, deny가 일치하면 allow는 볼 필요도 없습니다.

1. **오답** - 명령줄은 managed 바로 아래입니다. 그리고 권한 규칙에서는 단계 순서와 별개로 deny가 이깁니다.
2. **오답** - 규칙은 개수로 겨루지 않습니다. deny 하나가 일치하면 호출은 막힙니다.
3. **정답** - managed deny는 프로젝트 allow로도 플래그로도 뒤집히지 않습니다.
4. **오답** - 충돌이 확인 요청으로 바뀌는 동작은 없습니다. deny가 먼저 평가되어 바로 거부됩니다.

> 💡 **시험 포인트:** 범위가 달라도 deny는 이긴다, managed는 무엇으로도 덮어쓸 수 없다. 반대로 `--disallowedTools`로 managed 설정보다 *더 좁히는* 것은 가능합니다.

> 📚 근거 문서: [Configure permissions](https://code.claude.com/docs/en/permissions) · [Settings files and precedence](https://code.claude.com/docs/en/settings)

---
