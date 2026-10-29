도구 사용을 **미리 허용해 두는 목록**입니다. Agent SDK 옵션으로는 `allowedTools`(Python 은 `allowed_tools`), 스킬의 SKILL.md frontmatter 에서는 `allowed-tools` 로 씁니다.

## 문제 속 쓰임
> The coordinator's **allowedTools** list omits 'Task', so it has no mechanism to spawn any subagents
> 코디네이터의 **`allowedTools`** 목록에 `Task` 가 빠져 있어, 서브에이전트를 생성할 수단이 아예 없다
> Restrict the skill with an **allowed-tools** list in its frontmatter so it can only run a few tools and reads fewer files
> 스킬 frontmatter에 **`allowed-tools`** 목록을 두어, 몇 가지 도구만 실행하고 파일을 덜 읽도록 스킬을 제한한다

## 비교
- **allowedTools / allowed-tools** — 나열한 도구를 승인 없이 쓰게 하는 **사전 승인** 목록
- **disallowedTools / disallowed-tools** — 도구를 아예 **빼는** 목록

## 시험 포인트
코디네이터가 위임을 **전혀 시도하지 않으면** 도구 구성에 `Task`(Agent) 도구가 있는지부터 봅니다. 또 `allowed-tools` 를 손봐도 탐색 출력이 메인 컨텍스트에 쌓이는 문제는 풀리지 않습니다(격리는 `context: fork`).
