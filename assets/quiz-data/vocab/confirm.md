정보가 **맞는지 확인해 확정하는** 것입니다. 사람에게 "이대로 진행할까요?" 하고 **확인(승인)을 받는** 뜻으로도 자주 씁니다.

## 문제 속 쓰임
> A human-in-the-loop gate at the `payment_approve` tool call, requiring explicit human **confirmation** for payments above a threshold
> `payment_approve` 도구 호출 지점에, 임계값을 넘는 지급은 사람의 명시적 **확인**을 요구하는 human-in-the-loop 게이트

## 함께 쓰는 표현
- **user / human confirmation** : 사용자·사람의 확인(승인)
- **confirmed account** : (조회로) 확인이 끝난 계정
- **confirm before** ~ing : ~하기 전에 확인을 받다

## 시험 포인트
되돌리기 어려운 고위험 작업(대금 지급, 민감 데이터 조회)은 프롬프트 지시가 아니라 **도구 호출 지점에서 사람의 확인을 강제하는 게이트·훅**이 정답입니다.
