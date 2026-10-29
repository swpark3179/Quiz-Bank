무언가를 **바깥에서 감싸는** 것입니다. 텍스트에서는 앞뒤에 표시를 덧붙여 둘러싸는 것, 코드에서는 기존 기능을 다른 함수로 감싸는 것을 말합니다.

## 문제 속 쓰임
> ...because Claude **wraps** its output in markdown code fences or prepends a sentence like "Here is the extracted data:".
> Claude가 출력을 마크다운 코드 펜스로 **감싸거나** "Here is the extracted data:" 같은 문장을 앞에 붙이기 때문이다.

## 함께 쓰는 표현
- **wrap A in B** : A를 B로 감싸다 (*wrap it in XML tags*)
- **wrapper** (명) 감싸는 층, 래퍼
- **wrap up** : 마무리하다

## 시험 포인트
출력이 코드 펜스로 감싸여 파싱이 깨지면 프롬프트를 다듬지 말고, 도구 **`input_schema` + `tool_choice` 강제**로 `tool_use` 블록에서 JSON 을 받는 것이 정답입니다.
