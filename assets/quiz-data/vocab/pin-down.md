흐릿하던 것을 핀으로 꽂듯 **정확히 밝혀 확정하는** 것입니다. 원인·위치·값을 "딱 짚어 낸다"는 느낌입니다.

## 문제 속 쓰임
> tool_choice was set to auto rather than forcing the Grep tool, so the entrypoint was never **pinned down**
> `tool_choice` 가 `Grep` 도구 강제가 아니라 `auto` 로 설정되어 있어, 진입점이 끝내 **확정되지** 않았다.

## 함께 쓰는 표현
- **pin down the cause** : 원인을 정확히 짚어 내다
- **hard to pin down** : 딱 꼬집어 말하기 어려운

## 비슷한 말
- **identify**, **determine** — 알아내다, 밝히다

## 시험 포인트
원인을 `tool_choice` 로 돌리는 이 보기는 오답입니다. 서브에이전트가 이미 찾은 진입점을 다시 찾는 이유는 **부모 대화를 상속하지 않기 때문**이며, 이전 발견 사항을 Task 프롬프트에 넣어 넘겨야 합니다.
