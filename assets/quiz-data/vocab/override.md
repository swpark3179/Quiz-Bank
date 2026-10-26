이미 정해진 설정·규칙 위에 **덮어써서 그것보다 우선하게** 만든다는 뜻입니다. 설정 범위(프로젝트·사용자·로컬) 이야기에서 자주 나옵니다.

## 문제 속 쓰임
> Configure the server in project scope with a placeholder token, then instruct developers to **override** it in local scope.
> 프로젝트 범위에 플레이스홀더 토큰으로 설정한 뒤, 개발자들에게 로컬 범위에서 **덮어쓰게** 한다.

## 함께 쓰는 표현
- **override A with B** : A를 B로 덮어쓰다
- **override the default** : 기본값을 덮어쓰다
- **override** (명) 우선 적용되는 설정

## 시험 포인트
CLAUDE.md·스킬 문제에서 "덮어쓴다(override)"는 설명은 함정인 경우가 많습니다. 하위 디렉터리의 `CLAUDE.md` 는 상위 지침을 **덮어쓰지 않고 보완**하며, frontmatter의 `override: true` 같은 옵션은 없습니다.
