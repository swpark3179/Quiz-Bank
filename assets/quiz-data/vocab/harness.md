1. **(명) 하네스, 실행 틀** — 모델 호출을 감싸 도구 실행·권한 검사·루프를 맡는 실행 환경. Claude Code 나 Agent SDK 가 여기에 해당합니다. *test harness* 는 테스트를 돌려 주는 틀입니다
2. **(동) (힘·자원을) 활용하다** — *harness the power of* ~의 힘을 활용하다

## 문제 속 쓰임
> Declare `allowed-tools` in the skill's SKILL.md frontmatter limited to Read/Glob/Write so the **harness** blocks Edit and Bash
> 스킬의 SKILL.md frontmatter에 `allowed-tools` 를 `Read`, `Glob`, `Write` 로 제한해 선언하고, **하네스**가 `Edit` 과 `Bash` 를 차단하게 한다

## 함께 쓰는 표현
- **agent harness** : 에이전트 실행 틀
- **test harness** : 테스트 실행 틀

## 시험 포인트
"하네스가 막는다"는 것은 모델의 판단이 아니라 **실행 환경이 설정으로 강제한다**는 뜻이라, 프롬프트 지시보다 확실한 **결정적 장치** 쪽 신호입니다.
