"자동"이라는 뜻으로, 문제에서는 주로 **`tool_choice` 의 기본값 `"auto"`** 를 가리킵니다. 이때 모델이 도구를 부를지, 그냥 텍스트로 답할지를 **스스로 정합니다**.

## 문제 속 쓰임
> Set tool_choice to "**auto**" so the model can respond directly when no tool is required for the input.
> `tool_choice` 를 **`"auto"`** 로 설정해, 입력에 도구가 필요 없을 때는 모델이 직접 응답할 수 있게 한다

## 비교
- **`auto`** — 도구를 쓸지 말지 모델이 판단 (기본값)
- **`any`** — 도구 중 아무거나 **반드시** 하나 호출
- **`{"type": "tool", "name": ...}`** — 지정한 도구를 **강제** 호출
- **`none`** — 도구 호출 금지

## 시험 포인트
"도구가 필요 없는 입력도 있다"면 `auto`, "어떤 도구든 꼭 하나 불러야 한다"면 `any`, "특정 도구를 꼭"이면 도구 지정이 정답 신호입니다.
