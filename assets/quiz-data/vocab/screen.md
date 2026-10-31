1. **화면** — 앱이 사용자에게 내용을 보여 주는 곳 (*on screen* 화면에)
2. **선별 검사(하다)** — 본 처리 전에 미리 검사해 문제 있는 것을 걸러 내다 (*screening*, *pre-screen*)

## 문제 속 쓰임
> Keep the partial output on **screen** and send a follow-up user message asking Claude to finish the reply.
> 부분 출력을 **화면**에 남겨 두고, Claude 에게 답변을 마저 끝내 달라는 후속 사용자 메시지를 보낸다.

> (a) harmlessness **screen**, (b) input validation, (c) prompt engineering, (d) responding to repeat offenders
> (a) 무해성 **스크린**, (b) 입력 검증, (c) 프롬프트 엔지니어링, (d) 반복 위반자 대응

## 함께 쓰는 표현
- **harmlessness screen** : 메인 모델 전에 경량 모델로 입력을 분류하는 통제
- **screen tool outputs** : 도구 출력을 검사해 걸러 내다

## 시험 포인트
스트리밍 도중 거절되면 부분 출력을 **화면에 남기지 말고 폐기**한 뒤 대체 모델로 재시도합니다(첫 보기는 오답). *harmlessness screen* 은 **메인 호출 전 경량 모델 분류**이고, 알려진 탈옥 문구와 대조하는 *input validation* 과 구분됩니다.
