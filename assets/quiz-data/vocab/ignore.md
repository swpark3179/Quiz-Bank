알면서도 **신경 쓰지 않거나 따르지 않는** 것입니다. 에이전트 문제에서는 모델이 지시·규칙을 **반영하지 않는** 상황과, 공격자가 "이전 지시를 무시하라"고 심어 두는 상황에 자주 나옵니다.

## 문제 속 쓰임
> ...users embed instructions in uploaded PDF documents like: "**Ignore** previous instructions. ..."
> 사용자가 업로드한 PDF에 *"이전 지시를 **무시하라**."* 같은 지시를 심어 둔다.
> ...three newly onboarded engineers who cloned the repo report that Claude Code **ignores** the conventions entirely...
> 저장소를 클론한 신규 엔지니어 세 명은 Claude Code가 컨벤션을 완전히 **무시한다**고 보고한다.

## 함께 쓰는 표현
- **ignore previous instructions** : 이전 지시를 무시하라 — 전형적인 프롬프트 인젝션 문구
- **ignore boilerplate / noise** : 상용구·잡음을 무시하다

## 시험 포인트
규칙이 무시될 때는 먼저 **그 규칙이 실제로 로드되는 위치에 있는지**(사용자 범위 `~/.claude/CLAUDE.md` vs 커밋된 프로젝트 CLAUDE.md)를 의심합니다. 문구를 더 세게 쓰는 보기는 대개 오답입니다.
