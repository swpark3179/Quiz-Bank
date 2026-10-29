코드가 **어떤 조건에서 무엇을 할지 정해 둔 처리 흐름**을 말합니다. *loop logic*, *business logic* 처럼 "~을 처리하는 코드의 규칙"이라는 뜻으로 자주 씁니다.

## 문제 속 쓰임
> The loop **logic** is: `response = client.messages.create(model="claude-sonnet-4-6", ...)` / `text_output = response.content[0].text` / ...
> 루프 **로직**은 아래와 같습니다.

## 함께 쓰는 표현
- **business logic** : 업무 규칙을 구현한 코드
- **retry logic** : 재시도 처리 로직
- **logical** (형) 논리적인

## 시험 포인트
이 루프 로직은 모델의 **텍스트를 문자열로 파싱해** 도구 호출을 찾기 때문에 틀립니다. 도구 호출은 `stop_reason` 과 `tool_use` 콘텐츠 블록으로 판단해야 합니다.
