본래 **울타리**라는 뜻이고, 마크다운에서는 코드 블록 앞뒤를 둘러싸는 백틱 세 개짜리 줄을 **코드 펜스**라고 부릅니다. 울타리처럼 코드 영역의 경계를 짓는다는 비유입니다.

## 문제 속 쓰임
> ...Claude wraps its output in markdown code **fences** or prepends a sentence like "Here is the extracted data:".
> Claude가 출력을 마크다운 코드 **펜스**로 감싸거나 "Here is the extracted data:" 같은 문장을 앞에 붙인다

## 함께 쓰는 표현
- **code fence** : 코드 펜스
- **fenced code block** : 펜스로 감싼 코드 블록
- **wrap output in fences** : 출력을 코드 펜스로 감싸다

## 시험 포인트
"항상 JSON 으로만 답하라"고 해도 코드 펜스·서두 문장이 섞여 **파싱이 깨진다면**, 프롬프트 강조나 정규식 후처리가 아니라 **도구 `input_schema` + `tool_choice` 강제**(또는 structured outputs)로 출력 구조를 강제하는 보기가 정답입니다.
