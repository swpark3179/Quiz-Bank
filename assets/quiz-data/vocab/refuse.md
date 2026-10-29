요청·제안을 **하지 않겠다고 거부하는** 것입니다. 명사 *refusal* 은 "거부"이며, API 의 `stop_reason` 값 `refusal` 도 같은 말입니다.

## 문제 속 쓰임
> Claude Code **refuses** — `CLAUDE.md` rules are enforced like permission denials
> Claude Code는 **거부한다** — `CLAUDE.md` 규칙은 권한 거부처럼 강제된다.

## 함께 쓰는 표현
- **refuse to do** ~ : ~하기를 거부하다
- **refusal** (명) 거부, 거절

## 비슷한 말
- **decline** — (정중하게) 거절하다
- **reject** — (제출된 것을) 받아들이지 않다, 퇴짜 놓다

## 시험 포인트
`CLAUDE.md` 는 **참고용 지침(advisory)** 일 뿐 강제 장치가 아니라서, 사용자가 직접 요청하면 Claude Code는 거부하지 않고 따릅니다. 반드시 막아야 하면 `settings.json` 의 deny 규칙이나 훅을 씁니다.
