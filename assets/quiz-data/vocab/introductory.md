본론에 들어가기 전에 붙는 **도입부·서두의** 것입니다. 모델 출력에서는 데이터 앞에 붙는 *"Here is the ..."* 같은 **군말 문장**을 가리킵니다.

## 문제 속 쓰임
> In production, 30% of responses include markdown code fences or **introductory** prose.
> 운영에서 응답의 30%에 마크다운 코드 펜스나 **서두** 문장이 섞여 나온다.

## 함께 쓰는 표현
- **introductory prose / text** : 서두 문장 (본론 앞의 설명)
- **introduction** (명) 소개, 도입

## 비슷한 말
- **preamble** — 서문, 머리말
- **leading prose** — 앞머리 문장

## 시험 포인트
JSON 앞에 서두 문장이 붙는 문제는 프롬프트 지시나 정규식 후처리가 아니라, **도구 스키마 + `tool_choice` 강제**로 구조화된 출력을 받는 것이 정답입니다.
