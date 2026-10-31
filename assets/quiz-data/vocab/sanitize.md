들어온 입력에서 **위험하거나 불필요한 부분을 걸러 내 안전한 형태로 만드는** 것입니다. 보안 코드에서는 사용자 입력을 쓰기 전에 거치는 정제 함수를 *sanitization helper* 라고 부릅니다.

## 문제 속 쓰임
> A `detected_pattern` field naming the code construct that triggered the finding, such as a call to the team's **sanitization** helper
> 지적을 촉발한 코드 구조(예: 팀의 **입력 정제(sanitization)** 헬퍼 호출)를 이름으로 기록하는 `detected_pattern` 필드

## 함께 쓰는 표현
- **input sanitization** : 입력 정제
- **sanitize user input** : 사용자 입력을 정제하다
- **sanitized value** : 정제를 거친 값

## 비슷한 말 · 반대말
- **validate** — 검증하다. 형식이 맞는지 확인해 통과·거부할 뿐 내용을 고치지는 않습니다
- **escape** — 특수 문자를 무해한 형태로 바꾸다

## 시험 포인트
이 보기가 정답입니다. 기각을 **지적을 촉발한 코드 구조**별로 묶어야 어떤 기준을 고칠지 알 수 있습니다(예: "sanitization 헬퍼를 거친 값은 정제된 것으로 본다"). `dismissal_reason`·`confidence`·`severity` 는 원인 구조를 드러내지 못해 오답입니다.
