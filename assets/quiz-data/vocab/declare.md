무엇을 **공식적으로 밝혀 정해 두는** 것입니다. 코드·설정에서는 변수·도구·권한 등을 "이렇게 쓴다"고 **선언**하는 뜻입니다.

## 문제 속 쓰임
> **Declare** `allowed-tools` in the skill's SKILL.md frontmatter limited to Read/Glob/Write so the harness blocks Edit and Bash
> 스킬의 SKILL.md frontmatter에 `allowed-tools` 를 `Read`, `Glob`, `Write` 로 제한해 **선언하고**, 하네스가 `Edit` 과 `Bash` 를 차단하게 한다

## 함께 쓰는 표현
- **declare a variable** : 변수를 선언하다
- **declaration** (명) 선언 · **declarative** (형) 선언적인 — '어떻게'가 아니라 '무엇을' 원하는지 적는 방식

## 시험 포인트
"절대 하지 못하게 **보장**"하라는 요구에는 프롬프트 문구가 아니라 **frontmatter·설정에 선언해 하네스가 강제하는 제한**을 고릅니다. 범위도 문제에 맞게 가장 좁은 곳(이 스킬)에 둡니다.
