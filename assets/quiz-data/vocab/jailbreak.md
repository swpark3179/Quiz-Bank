원래는 휴대폰의 제한을 푸는 '탈옥'입니다. LLM 에서는 **사용자 자신이** 교묘한 프롬프트로 모델이 안전 규칙(가드레일)을 우회하도록 꾀는 공격을 말합니다. 핵심은 **공격자가 사용자 본인**이라는 점입니다.

## 문제 속 쓰임
> A **jailbreak**, because the recruiter who uploaded the file is trying to get around the assistant's guardrails.
> **탈옥**이다. 파일을 올린 리크루터가 어시스턴트의 가드레일을 우회하려 하기 때문이다

## 함께 쓰는 표현
- **jailbreak attempt** : 탈옥 시도
- **known jailbreak phrasings** : 알려진 탈옥 문구
- **get around the guardrails** : 안전 장치를 우회하다

## 비슷한 말 · 반대말
- **direct prompt injection** — 사용자가 직접 넣은 악성 지시 (탈옥과 같은 위협 모델)
- **indirect prompt injection** — 사용자가 건넨 이메일·문서 속에 **제3자가** 숨긴 지시

## 시험 포인트
"누가 그 지시를 썼는가"를 먼저 봅니다. 이력서 속 숨은 문장은 제3자가 쓴 것이라 *jailbreak* 보기는 오답이고 간접 인젝션이 정답이었습니다. 알려진 탈옥 문구와 대조하는 통제의 이름은 **입력 검증(input validation)** 입니다.
