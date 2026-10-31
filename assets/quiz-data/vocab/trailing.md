어떤 것의 **맨 끝·뒤쪽에 붙어 있거나 남아 있는** 것을 가리킵니다. 문자열에서는 끝에 붙은 공백·쉼표·별표처럼 본체 뒤에 따라붙은 부분을 말할 때 자주 씁니다.

## 문제 속 쓰임
> As valid JSON with **trailing** noise: strip the text after the last closing brace and parse whatever remains.
> 뒤에 잡음이 **붙은** 유효한 JSON 으로 보고, 마지막 닫는 중괄호 뒤의 텍스트를 지운 뒤 남은 것을 파싱한다.

## 함께 쓰는 표현
- **trailing whitespace** : 끝에 남은 공백
- **trailing comma** : 끝에 붙은 쉼표
- **trailing asterisk** : 끝에 붙은 별표(`*`)

## 비슷한 말 · 반대말
- **leading** — 앞에 붙은 (*leading space* 앞 공백)

## 시험 포인트
이 보기는 오답입니다. `stop_reason` 이 `max_tokens` 인 JSON 은 뒤에 잡음이 붙은 것이 아니라 **뒷부분이 없는(잘린)** 것이므로, 파싱하지 말고 `max_tokens` 를 올려 재시도합니다. WIF 규칙의 *trailing asterisk* 도 접두어 **뒤의 나머지**만 허용합니다.
