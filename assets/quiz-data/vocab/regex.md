**regular expression**(정규 표현식)의 줄임말로, `\d{3}-\d{4}` 처럼 **문자열 패턴을 기호로 적어** 찾거나 바꾸는 규칙입니다.

## 문제 속 쓰임
> Expand the **regex** allowlist of closing phrases so it also matches every polite sign-off variant the model might emit.
> 마무리 문구 **정규식** 허용 목록을 넓혀, 모델이 낼 수 있는 모든 정중한 맺음말 변형까지 매칭되게 한다.

## 함께 쓰는 표현
- **regex match** : 정규식 일치
- **post-process with regex** : 정규식으로 후처리하다

## 시험 포인트
모델이 쓴 **문장을 정규식으로 읽어** 루프 종료나 출력 형식을 판단하는 보기는 취약해서 대부분 오답입니다. 루프는 `stop_reason` 으로, 구조화 출력은 스키마를 담은 도구 정의와 `tool_choice` 로 보장합니다.
