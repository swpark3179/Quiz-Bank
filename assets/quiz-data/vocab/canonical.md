여러 형태 중 **하나로 정해 둔 표준(정식) 형태**입니다. 날짜·통화처럼 표기가 제각각인 값을 한 가지 형식으로 맞출 때 씁니다.

## 문제 속 쓰임
> Add a PostToolUse hook that normalizes each tool's raw output into one **canonical** schema before it enters the context.
> 각 도구의 원본 출력을 컨텍스트에 들어가기 전에 하나의 **표준** 스키마로 정규화하는 PostToolUse 훅을 추가한다.

## 함께 쓰는 표현
- **canonical form / format** : 표준 형태 / 형식
- **canonical source** : 기준이 되는 원본

## 시험 포인트
도구 **출력**을 표준 형식으로 바꾸는 일은 `PostToolUse` 훅, 도구 **호출**을 막거나 고치는 일은 `PreToolUse` 훅입니다. 형식이 섞여 모델이 헷갈리면 프롬프트가 아니라 코드로 정규화하는 것이 정답입니다.
