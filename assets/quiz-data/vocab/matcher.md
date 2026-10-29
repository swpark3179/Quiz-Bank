훅 설정에서 **어떤 도구에 이 훅을 걸지 정하는 패턴**입니다. 도구 이름 하나를 적거나, `Write|Edit` 처럼 여러 도구를 한꺼번에 지정할 수 있습니다.

## 문제 속 쓰임
> 💡 실무 팁: 편집(`Edit`)까지 잡으려면 **matcher**를 `Write|Edit` 로 지정하세요.

## 함께 쓰는 표현
- **"matcher": "Write|Edit"** : 쓰기·편집 도구 둘 다에 반응
- **match** (동) 일치하다 — *matcher* 는 "맞춰 보는 것"

## 시험 포인트
`PreToolUse` / `PostToolUse` 훅은 matcher 로 대상 도구를 고릅니다. 같은 해설에서 훅은 파일 경로를 환경 변수가 아니라 **stdin JSON 의 `tool_input.file_path`** 로 받는다고 설명합니다.
