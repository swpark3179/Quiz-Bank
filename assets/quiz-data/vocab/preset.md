1. **미리 정해 둔** — 자유 입력 대신 고를 수 있는 값을 먼저 정해 둔 (*preset categories* 미리 정한 범주)
2. **사전 설정, 프리셋** — 이름 하나로 정해진 구성 묶음을 통째로 불러오는 설정

## 문제 속 쓰임
> Add a dismissal_reason field with **preset** categories like false_positive or wont_fix, so dismissal rates can be compared per reason
> false_positive 나 wont_fix 같은 **미리 정한** 범주의 dismissal_reason 필드를 추가해, 사유별 기각률을 비교할 수 있게 한다.

> A minimal prompt that covers tool calling only; getting the full Claude Code prompt requires the `claude_code` **preset**.
> 도구 호출만 다루는 최소 프롬프트다. Claude Code 의 전체 프롬프트를 쓰려면 `claude_code` **프리셋**이 필요하다.

## 함께 쓰는 표현
- **preset categories / values** : 미리 정한 범주·값
- **use a preset** : 프리셋을 쓰다

## 시험 포인트
첫 보기는 오답입니다. 미리 정한 기각 사유는 리뷰어가 **왜** 거부했는지만 말할 뿐, 지적이 **어떤 코드 구조**에서 나왔는지는 보여 주지 못합니다. Agent SDK 는 `system_prompt` 를 비우면 최소 프롬프트를 쓰므로, CLI 와 같은 동작이 필요하면 `claude_code` 프리셋을 명시합니다.
