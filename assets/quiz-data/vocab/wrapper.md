기존 기능을 **바깥에서 감싸 동작을 덧붙이거나 제어하는 코드 층**입니다. 안쪽 기능은 그대로 두고 앞뒤 처리만 더할 때 씁니다.

## 문제 속 쓰임
> The engineering team wrote a **wrapper** loop that ends the conversation whenever the assistant's text matches a closing phrase...
> 엔지니어링 팀은 어시스턴트의 텍스트가 마무리 문구와 일치하면 대화를 끝내는 **래퍼** 루프를 작성했다...

## 함께 쓰는 표현
- **wrapper function / loop** : 래퍼 함수·루프
- **API wrapper** : API 호출을 감싼 편의용 코드

## 시험 포인트
래퍼가 텍스트를 보고 루프를 끊으면 대기 중인 `tool_use` 가 실행되지 않습니다. 계속·종료는 **`stop_reason`** 으로만 판단하는 것이 정답입니다.
