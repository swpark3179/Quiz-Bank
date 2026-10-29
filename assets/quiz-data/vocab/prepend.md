기존 내용의 **앞에 무언가를 덧붙이는** 것입니다. 뒤에 붙이는 *append* 의 반대말입니다.

## 문제 속 쓰임
> ...because Claude wraps its output in markdown code fences or **prepends** a sentence like "Here is the extracted data:".
> Claude가 출력을 마크다운 코드 펜스로 감싸거나 "Here is the extracted data:" 같은 문장을 **앞에 붙이기** 때문이다.

## 함께 쓰는 표현
- **prepend A to B** : B 앞에 A를 붙이다
- **prepend a header** : 머리말을 앞에 붙이다

## 반대말
- **append** — 뒤에 덧붙이다

## 시험 포인트
JSON 앞에 문장이 붙거나 펜스로 감싸져 파싱이 실패하면, 프롬프트 강조·정규식 후처리가 아니라 **도구 `input_schema` + `tool_choice` 강제**(또는 structured outputs)로 형식을 보장하는 보기가 정답입니다.
