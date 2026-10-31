모델이 읽는 입력 속에 **공격 지시를 숨겨, 개발자의 원래 지시 대신 그 지시를 따르게 만드는** 공격입니다. 사용자 본인이 공격하면 *직접* 인젝션, 사용자가 건넨 문서·메일·웹 페이지 속에 제3자가 지시를 숨기면 *간접* 인젝션입니다.

## 문제 속 쓰임
> Indirect **prompt injection**, because a trusted user passed along third-party content that carries an attacker's instructions.
> 간접 **프롬프트 인젝션**이다. 신뢰할 수 있는 사용자가 공격자의 지시가 담긴 제3자 콘텐츠를 전달했기 때문이다.

## 함께 쓰는 표현
- **direct / indirect prompt injection** : 직접 / 간접 프롬프트 인젝션
- **injection attempt** : 인젝션 시도

## 비슷한 말 · 반대말
- **jailbreak** — 탈옥. 사용자가 직접 가드레일을 우회하려는 공격입니다
- **prompt leak** — 시스템 프롬프트를 빼내려는 공격. 행동을 시키는 인젝션과 목적이 다릅니다

## 시험 포인트
**"누가 그 지시를 썼는가"** 를 먼저 보세요. 같은 요청에 들어왔는지는 기준이 아닙니다. 제3자가 썼다면 간접 인젝션이고, 대책은 콘텐츠를 `tool_result` 에 격리·스크리닝하고 **최소 권한**으로 피해를 줄이는 것입니다.
