정해진 **이벤트가 일어날 때마다 자동으로 실행되도록 걸어 두는** 코드·명령입니다. Claude Code·Agent SDK 에서는 도구 호출 전(`PreToolUse`)·후(`PostToolUse`) 같은 시점에 걸어 호출을 막거나 결과를 바꿀 수 있습니다.

## 문제 속 쓰임
> Add a `PostToolUse` **hook** in `settings.json` matching the `Write` tool that runs `npm run lint:fix`
> `settings.json` 에 `Write` 도구와 매칭되는 `PostToolUse` **훅**을 추가해 `npm run lint:fix` 를 실행한다

## 함께 쓰는 표현
- **PreToolUse hook** : 도구 호출 전 훅 — 차단·정책 강제·입력 수정
- **PostToolUse hook** : 도구 호출 후 훅 — 출력 정규화·후처리(린트 등)
- **hook matcher** : 훅을 걸 도구를 고르는 조건

## 시험 포인트
훅은 모델의 판단과 상관없이 **항상 실행되는 결정적 장치**라, "반드시·보장" 요구에는 프롬프트 지시보다 훅이 정답입니다. 호출을 **막으려면** PreToolUse, 결과를 **고치려면** PostToolUse 를 고릅니다.
