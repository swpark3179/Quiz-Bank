## 문제 1
### **Your automated review analyzes comments and docstrings. The current prompt instructs Claude to "check that comments are accurate and up-to-date." Findings frequently flag acceptable patterns (TODO markers, straightforward descriptions) while missing comments that describe behavior the code no longer implements. What change addresses the root cause of this inconsistent analysis?**

| 보기 | 설명 |
|------|------|
| 1. Add few-shot examples of misleading comments to help the model recognize similar patterns in the codebase | |
| 2. Include git blame data so Claude can identify comments that predate recent code modifications | |
| **3. Specify explicit criteria: flag comments only when their claimed behavior contradicts actual code behavior** | |
| 4. Filter out TODO, FIXME, and descriptive comment patterns before analysis to reduce noise | |

**정답: 3.**

**해설:**
> **핵심 진단:** 분석이 일관되지 않은 **근본 원인**은 *"주석이 정확하고 최신인지 확인하라"* 는 **모호한 지시문** 그 자체입니다. *무엇을 문제로 볼지* 에 대한 정의가 없으니, 모델이 매번 다른 잣대로 판단해 **오탐(정상 주석을 문제로 표시)** 과 **누락(잘못된 주석을 놓침)** 이 동시에 발생합니다.

| 구분 | 판단 기준 |
|------|-----------|
| 🔴 기존 (모호) | "정확하고 최신인지 확인" → 실행할 때마다 기준이 달라짐 |
| 🟢 개선 (명확) | "주장하는 동작이 **실제 코드 동작과 모순될 때만** 플래그" |

1. **오답** - **Few-shot 예시 추가**는 특정 패턴 인식에는 도움이 되지만, *"무엇이 문제인가"* 라는 판단 기준이 정의되지 않은 채 그대로 남습니다. 예시에 없는 새로운 형태의 잘못된 주석은 계속 놓치고, 기준이 모호해 오탐도 사라지지 않습니다. → **증상 완화일 뿐 근본 해결이 아님**
2. **오답** - **git blame(작성 시점)** 정보는 주석이 *언제* 쓰였는지 알려줄 뿐, **정확성과는 무관**합니다. 오래된 주석도 여전히 옳을 수 있고, 방금 추가한 주석도 틀릴 수 있으므로, 시점은 "플래그할지"를 가르는 올바른 기준이 되지 못합니다.
3. **정답** - 모호한 지시를 **"주석이 주장하는 동작이 실제 코드 동작과 모순될 때만 플래그하라"** 는 **명확하고 검증 가능한 기준**으로 대체합니다. 이는 일관성 없는 분석의 **근본 원인(불명확한 기준)을 직접 제거**하여, 정상 패턴에 대한 *오탐* 과 진짜 오해를 부르는 주석에 대한 *누락* 을 **한 번에** 해결합니다.
4. **오답** - TODO·FIXME 등을 **사전 필터링**하면 일부 오탐은 줄지만, 정상 패턴을 기계적으로 걸러내는 방식이라 그 속에 숨은 진짜 문제(예: 옛 동작을 설명하는 서술형 주석)까지 함께 버립니다. 기준 자체를 바로잡는 게 아니므로 **누락은 오히려 악화**될 수 있습니다.

---

## 문제 2
### **Your pipeline script runs `claude "Analyze this pull request for security issues"` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct approach to run Claude Code in an automated pipeline?**

| 보기 | 설명 |
|------|------|
| **1. Add the -p flag: claude -p "Analyze this pull request for security issues"** | |
| 2. Redirect stdin from /dev/null: claude "Analyze this pull request for security issues" < /dev/null | |
| 3. Set the environment variable CLAUDE_HEADLESS=true before running the command | |
| 4. Add the --batch flag: claude --batch "Analyze this pull request for security issues" | |

**정답: 1.**

**해설:**
> **핵심 진단:** Claude Code는 기본적으로 **대화형(interactive)** 모드로 동작해 사용자 입력을 기다립니다. 그래서 CI/CD처럼 입력이 없는 환경에서는 무한 대기(hang)에 빠집니다. 해법은 한 번 실행한 뒤 결과만 출력하고 종료하는 **비대화형(headless)** 모드, 즉 `-p`(`--print`) 플래그입니다.

```bash
# ❌ 멈춤: 대화형 모드라 사용자 입력을 기다림
claude "Analyze this pull request for security issues"

# ✅ 정상: 비대화형 모드 — 결과를 stdout에 출력하고 즉시 종료
claude -p "Analyze this pull request for security issues"
```

1. **정답** - `-p`(또는 `--print`) 플래그는 Claude Code를 **비대화형 모드**로 실행하는 **공식적인 방법**입니다. 주어진 프롬프트를 처리해 결과를 **stdout으로 출력한 뒤 입력을 기다리지 않고 종료**하므로, CI/CD 파이프라인에 가장 적합합니다.
2. **오답** - stdin을 `/dev/null`로 리다이렉트하면 입력 대기는 피할 수 있을지 몰라도, 이는 **문서화된 공식 비대화형 실행 방식이 아닙니다**. 출력 형식이나 종료 코드가 자동화에 맞게 보장되지 않는 **임시 우회책**일 뿐이며, 의도를 분명히 드러내는 `-p`가 정석입니다.
3. **오답** - `CLAUDE_HEADLESS` 같은 **환경 변수는 존재하지 않습니다**. 문서에 없는 변수를 설정해도 무시되어 여전히 대화형 모드로 실행되고, 동일하게 멈춥니다.
4. **오답** - `--batch`는 Claude Code에 **존재하지 않는 플래그**입니다. 지원되지 않는 옵션이라 오류가 발생하거나 무시되어, 대화형 입력 대기 문제를 해결하지 못합니다.

---
