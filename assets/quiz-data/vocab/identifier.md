대상을 **하나로 콕 집어 구별해 주는 값**입니다. 고객 ID·주문 번호·이메일처럼 "누구/무엇"인지 확정하는 데 쓰는 정보를 말합니다.

## 문제 속 쓰임
> Generate a structured handoff summary: issue, verified **identifiers**, tool results, actions attempted, and recommended next step.
> 문제 내용, 확인된 **식별자**, 도구 결과, 시도한 조치, 권장 다음 단계를 담은 구조화된 핸드오프 요약을 생성한다
> Put the confirmed customer record and **identifiers** explicitly in each subagent's Task prompt...
> 확인된 고객 레코드와 **식별자**를 각 서브에이전트의 `Task` 프롬프트에 명시적으로 넣는다

## 함께 쓰는 표현
- **unique identifier** : 고유 식별자
- **customer / order identifier** : 고객 / 주문 식별자
- **identify** (동) 식별하다 · **identification** (명) 식별

## 시험 포인트
사람에게 넘기거나 서브에이전트에게 위임할 때는 **이미 확인된 식별자를 명시적으로 전달**하는 보기가 정답입니다. 받는 쪽이 다시 조회하게 하면 엉뚱한 대상과 매칭될 수 있습니다.
