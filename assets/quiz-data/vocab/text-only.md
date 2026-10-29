도구 호출(`tool_use`) 같은 다른 블록 없이 **글만 담긴** 응답·입력을 말합니다.

## 문제 속 쓰임
> ...and also stop after two consecutive **text-only** assistant responses, regardless of stop_reason.
> `stop_reason` 과 관계없이 **텍스트만 있는** 어시스턴트 응답이 두 번 연속되면 종료한다

## 함께 쓰는 표현
- **text-only response** : 텍스트만 있는 응답
- **plain text** : 서식 없는 일반 텍스트

## 시험 포인트
응답이 텍스트뿐인지 세는 휴리스틱으로 루프를 끝내면 안 됩니다. 루프 종료는 항상 **`stop_reason`**(`end_turn` 이면 종료, `tool_use` 면 도구 실행 후 계속)으로 판단합니다.
