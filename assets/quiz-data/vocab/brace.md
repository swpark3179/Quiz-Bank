`{` 와 `}` 입니다. JSON 객체나 코드 블록의 시작과 끝을 표시하므로, "여는 중괄호로 시작한다"는 말은 곧 **JSON으로 답을 시작한다**는 뜻이 됩니다. 대괄호 `[ ]` 는 *bracket* 이라고 합니다.

## 문제 속 쓰임
> A legacy nightly job that is still pinned to `claude-haiku-4-5` makes Claude begin its answer with an opening **brace** by placing a partially written message as the last entry in `messages`.
> 여전히 `claude-haiku-4-5`에 고정된 오래된 야간 작업이, 일부만 쓴 메시지를 `messages`의 마지막 항목으로 넣어 Claude가 답을 **여는 중괄호**로 시작하게 만든다.

## 함께 쓰는 표현
- **opening / closing brace** : 여는 / 닫는 중괄호
- **curly brace** : 중괄호
- **bracket / parenthesis** : 대괄호 / 소괄호

## 시험 포인트
마지막 `assistant` 메시지에 앞부분을 넣어 이어 쓰게 하는 것이 **프리필**이며, Claude 4.6 이후 모델은 이를 지원하지 않아 400 오류가 납니다. JSON 형식을 확실히 지키려면 첫 *brace* 앞을 정규식으로 잘라 내는 후처리가 아니라 Structured Outputs를 씁니다.
