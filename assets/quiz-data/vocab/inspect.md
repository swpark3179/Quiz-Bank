**자세히 들여다보며 검사하는** 것입니다. 훅·검증 단계가 도구 호출의 입력을 살펴보고 허용할지 판단하는 장면에 자주 나옵니다.

## 문제 속 쓰임
> Add a global PreToolUse hook that **inspects** every Edit across all sessions and rejects any write outside the `docs/` folder
> 모든 세션의 모든 `Edit` 을 **검사해** `docs/` 폴더 밖 쓰기를 거부하는 전역 PreToolUse 훅을 추가한다

## 함께 쓰는 표현
- **inspect the input / tool call** : 입력 / 도구 호출을 검사하다
- **inspection** (명) 검사, 점검

## 비슷한 말
- **examine** — 꼼꼼히 살펴보다
- **intercept** — (가는 도중에) 가로채다

## 시험 포인트
훅으로 검사·차단하는 방향은 맞아도, **모든 세션의 모든 호출을 검사**하는 식으로 범위가 과하면 오답이 됩니다. 문제가 한 스킬에 한정되면 그 스킬의 `allowed-tools` 처럼 **범위에 맞는 통제**가 정답입니다.
