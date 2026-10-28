스킬·규칙 같은 Markdown 파일에서 본문(지침)과 따로, 이름·실행 방식·허용 도구 같은 **동작 설정을 YAML로 적는 머리 부분**입니다. *front matter* 처럼 띄어 쓰기도 합니다.

## 문제 속 쓰임
> Add `context: fork` to the skill's **frontmatter**.
> 스킬의 **프론트매터**에 `context: fork` 를 추가한다.

## 함께 쓰는 표현
- **YAML frontmatter** : YAML 형식의 프론트매터
- **frontmatter field / option** : 프론트매터 항목·옵션

## 시험 포인트
`context: fork`, `allowed-tools`, `argument-hint` 같은 프론트매터 설정은 **설정 수준에서 강제**되므로 프롬프트 지침보다 확실합니다. 다만 `override: true` 처럼 존재하지 않는 옵션을 내세운 오답도 있으니 주의합니다.
