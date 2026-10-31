시스템을 악용하거나 해치려는 사람입니다. 프롬프트 인젝션 문제에서는 **누가 그 지시를 썼는가**를 가리킬 때 핵심이 되는 말입니다.

## 문제 속 쓰임
> Wrap the existing tag in a second, more unusual tag such as `<vendor_email_body_v2>` that an **attacker** is unlikely to guess.
> 기존 태그를 **공격자**가 짐작하기 어려운 `<vendor_email_body_v2>` 같은 특이한 태그로 한 번 더 감싼다.

## 함께 쓰는 표현
- **prompt injection attack** : 프롬프트 인젝션 공격
- **attacker-controlled content** : 공격자가 조작할 수 있는 콘텐츠

## 비슷한 말 · 반대말
- **adversary** — 적, 공격자 (보안 문서에서 쓰는 격식 있는 말)

## 시험 포인트
*attacker* 가 짐작하기 어렵게 태그·구분자 이름만 바꾸는 보기는 오답입니다. 경계를 구조적으로 보장하는 정답은 외부 텍스트를 `tool_result` 안에 **JSON 문자열로 인코딩**해 넣는 것입니다. 지시를 쓴 *attacker* 가 사용자가 아닌 제3자라면 간접 프롬프트 인젝션입니다.
