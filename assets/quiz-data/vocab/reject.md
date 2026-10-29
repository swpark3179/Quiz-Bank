제출·요청된 것을 **받아들이지 않고 돌려보내는** 것입니다. 검증·권한 검사에서 "통과시키지 않는다"는 뜻으로 많이 씁니다.

## 문제 속 쓰임
> Implement PreToolCall hooks that flag and **reject** tool calls made in direct response to retrieved document content without user confirmation
> 검색·업로드된 문서 내용에 직접 반응해 이뤄진 도구 호출을 사용자 확인 없이는 표시·**거부하는** PreToolCall 훅을 구현한다.

## 함께 쓰는 표현
- **reject a request / tool call** : 요청·도구 호출을 거부하다
- **rejection** (명) 거부, 거절

## 비슷한 말 · 반대말
- **refuse** — (하기를) 거부하다
- **deny** — (권한을) 허용하지 않다 — *deny rules*
- **accept**, **approve** — 받아들이다, 승인하다 (반대말)

## 시험 포인트
문서 속에 심어진 지시(프롬프트 인젝션)를 막으려면 프롬프트 문구보다 **훅으로 의심스러운 도구 호출을 거부하는** 결정적 장치가 정답입니다.
