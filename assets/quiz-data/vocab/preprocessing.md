본 처리에 들어가기 **전에 입력을 미리 걸러 내거나 다듬는 단계**입니다.

## 문제 속 쓰임
> Keep "any" but add a **preprocessing** stage that strips plain-text inputs out of the batch before dispatch to the subagent.
> `"any"` 는 유지하되, 서브에이전트로 보내기 전에 일반 텍스트 입력을 배치에서 걸러 내는 **전처리** 단계를 추가한다.

## 함께 쓰는 표현
- **preprocessing step / stage** : 전처리 단계
- **preprocess** (동) 전처리하다

## 반대말
- **post-processing** — 후처리

## 시험 포인트
이 보기는 원인(`"any"` 설정)을 그대로 두고 구성 요소만 늘려 오답입니다. 도구가 필요 없는 입력이 섞여 있다면 `tool_choice` 를 **`auto`** 로 바꾸는 한 줄 수정이 정답입니다.
