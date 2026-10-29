1. **유효한, 형식에 맞는** — *valid JSON* 처럼 규칙·문법 검사를 통과하는
2. **타당한, 근거 있는** — 논리·접근 방식이 받아들일 만한

## 문제 속 쓰임
> The system prompt says 'Always respond with **valid** JSON'.
> 시스템 프롬프트에는 *"항상 **유효한** JSON으로 응답하라"* 고 되어 있다.
> Both the `settings.json` deny rules and the `PreToolUse` hook are **valid** architectural approaches...
> `settings.json` deny 규칙과 `PreToolUse` 훅 모두 **유효한(타당한)** 아키텍처적 접근이다...

## 함께 쓰는 표현
- **validity** (명) 유효성, 타당성
- **invalid** (형) 유효하지 않은, 잘못된
- **validate** (동) 검증하다

## 시험 포인트
"항상 valid JSON 으로 답하라"는 프롬프트 지시만으로는 형식이 보장되지 않습니다. 스키마를 담은 **도구 정의 + `tool_choice` 강제**처럼 구조적으로 강제하는 보기가 정답입니다.
