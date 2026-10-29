남이 고쳐 주기 전에 **스스로 실수를 알아차리고 바로잡는** 것입니다. 명사형 *self-correction* 은 "자기 교정"입니다.

## 문제 속 쓰임
> tool_choice should be "any" rather than forced, so the model can **self-correct** the arithmetic before it returns the final tool_use result.
> `tool_choice` 를 강제 대신 `"any"` 로 두어, 모델이 최종 `tool_use` 결과를 반환하기 전에 산술을 **스스로 교정할** 수 있게 해야 한다

## 함께 쓰는 표현
- **self-correction loop** : 오류를 되먹여 스스로 고치게 하는 반복
- **self-correcting** (형) 스스로 바로잡는

## 시험 포인트
`tool_choice` 설정을 바꾼다고 모델이 계산을 스스로 고치지는 않습니다. 합계 불일치 같은 의미 오류는 **코드로 다시 계산해 검사**하고, 어긋나면 표시하거나 **오류 내용을 붙여 재시도**하게 하는 보기가 정답입니다.
