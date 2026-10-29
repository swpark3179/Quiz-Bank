Claude Code·Agent SDK 의 훅 이벤트 중 하나로, **도구가 실행을 마친 직후** 호출됩니다. 도구 결과를 검사하거나 정규화·정제하는 데 씁니다.

## 문제 속 쓰임
> Add a **PostToolUse** hook that normalizes each tool's raw output into one canonical schema before it enters the context.
> 각 도구의 원본 출력을 컨텍스트에 들어가기 전에 하나의 표준 스키마로 정규화하는 **PostToolUse** 훅을 추가한다.

## 함께 쓰는 표현
- **PostToolUse hook** : 도구 실행 후 훅
- **normalize tool output** : 도구 출력을 정규화하다

## 비교
- **PreToolUse** — 도구 *실행 전*: 호출 차단, 정책 강제, 입력 수정
- **PostToolUse** — 도구 *실행 후*: 출력 변환, 정규화, 정제

## 시험 포인트
"형식이 섞인 도구 출력을 모델이 잘못 읽는다"는 신호에는 프롬프트 지시나 컨텍스트 창 확대가 아니라 **PostToolUse 훅으로 코드 기반 정규화**를 하는 보기가 정답입니다.
