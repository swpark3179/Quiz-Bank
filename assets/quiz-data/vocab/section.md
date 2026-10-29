문서·설정 파일 안의 **한 부분, 항목**입니다. 보고서의 장·절, JSON 설정의 특정 키 아래 영역 등을 가리킵니다.

## 문제 속 쓰임
> Add deny rules in the `permissions` **section** of `settings.json`
> `settings.json` 의 `permissions` **섹션**에 deny 규칙을 추가한다

## 함께 쓰는 표현
- **the ~ section of** … : …의 ~ 섹션
- **report section** : 보고서의 각 부분

## 시험 포인트
`permissions` 의 deny 규칙은 CLAUDE.md 문구와 달리 **Claude Code 가 직접 강제하는** 차단입니다. 더 유연한 검사가 필요하면 `PreToolUse` 훅을 함께 씁니다.
