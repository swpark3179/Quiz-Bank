**하라고 지시하는**, 일러두는 것입니다. 명사 *instruction(s)* 는 "지시, 지침"이며, 시험에서는 프롬프트로 지시하는 방식(소프트 통제)을 가리키는 핵심어입니다.

## 문제 속 쓰임
> Add a `validate_date` tool and **instruct** the model to call it before `search_flights`
> `validate_date` 도구를 추가하고 `search_flights` 전에 호출하라고 **지시한다**
> ...users embed **instructions** in uploaded PDF documents like: "Ignore previous **instructions**. ..."
> 사용자가 업로드한 PDF에 *"이전 **지시**를 무시하라."* 같은 **지시**를 심어 둔다

## 함께 쓰는 표현
- **instruct A to** + 동사 : A에게 ~하라고 지시하다
- **system prompt instruction** : 시스템 프롬프트 지시
- **embedded instructions** : (문서 속에) 숨겨 둔 지시 — 프롬프트 인젝션

## 시험 포인트
"모델에게 ~하라고 **지시한다**"는 보기는 확률적인 권고라서, **반드시** 지켜야 하는 규칙에는 대개 오답입니다. 훅·`tool_choice`·스키마 같은 **결정적 수단**이 있는 보기와 비교해 고릅니다.
