**세션이 진행되는 도중에**라는 뜻입니다. 세션 시작 때 한 번이 아니라, 작업하다가 중간에 무언가가 끼어드는 상황을 말할 때 씁니다.

## 문제 속 쓰임
> ...but Claude keeps auto-invoking it **mid-session** whenever dependency files come up, ...
> Claude가 **세션 도중** 의존성 파일 이야기가 나올 때마다 이 스킬을 자동으로 호출합니다.

## 함께 쓰는 표현
- **mid-session change** : 세션 중 변경
- **at startup** : (대비) 시작할 때

## 시험 포인트
스킬이 **세션 도중 자동으로 호출되는 것**을 막고 명시적 호출만 허용하려면 SKILL.md frontmatter 에 `disable-model-invocation: true` 를 둡니다. description 삭제나 CLAUDE.md 로 옮기기는 오답입니다.
