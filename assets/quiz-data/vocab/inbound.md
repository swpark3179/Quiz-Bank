시스템 **바깥에서 안으로 들어오는** 것을 가리킵니다. 보안 문제에서는 *inbound* 콘텐츠가 곧 **외부에서 온, 믿을 수 없는 데이터**라는 신호가 되기도 합니다.

## 문제 속 쓰임
> An email-triage agent appends each **inbound** email body to its system prompt before calling Claude.
> 한 이메일 분류 에이전트가 Claude를 호출하기 전에 **들어온** 이메일 본문을 시스템 프롬프트에 덧붙입니다.

## 함께 쓰는 표현
- **inbound email** : 수신 이메일, 들어온 메일
- **inbound request / traffic** : 들어오는 요청·트래픽

## 비슷한 말 · 반대말
- **incoming** — 들어오는 (거의 같은 뜻, 더 일상적인 말)
- **outbound** — 밖으로 나가는 (반대말)

## 시험 포인트
들어온 이메일처럼 제3자가 쓴 내용을 **시스템 프롬프트에 붙이는 보기는 오답**입니다. 출처를 밝혀 `tool_result` 로 전달하고, 검증된 사용자가 읽은 메일 속 지시는 **간접 프롬프트 인젝션**으로 판정합니다.
