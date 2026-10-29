상대가 원하든 아니든 **반드시 그렇게 되도록 만드는** 것입니다. 문제에서는 모델이 특정 도구·형식을 쓰도록 **설정으로 강제**하는 상황에 자주 나옵니다.

## 문제 속 쓰임
> Use a tool definition with the invoice schema and `tool_choice: any` to **force** schema-compliant extraction
> 송장 스키마를 담은 도구 정의와 `tool_choice: any` 를 써서 스키마에 맞는 추출을 **강제한다**

## 함께 쓰는 표현
- **force a tool** : 특정 도구를 쓰도록 강제하다 (`tool_choice`)
- **force termination** : 종료를 강제하다
- **forced** (형) 강제된, 억지스러운

## 시험 포인트
`tool_choice`·스키마·훅처럼 **설정으로 강제**하는 보기는 정답 쪽이지만, 시스템 프롬프트에 "Always respond with end_turn" 같은 문장을 넣어 **말로 강제**하는 보기는 오답입니다. 루프 종료는 `stop_reason` 으로 판단합니다.
