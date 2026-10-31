*inter*(서로) + *dependent*(의존하는)로, **한쪽을 바꾸면 다른 쪽에 영향이 가는** 관계입니다. 이런 것들은 따로 떼어 보면 전체 그림을 놓치기 쉽습니다.

## 문제 속 쓰임
> Per-file passes on two **interdependent** files each recommend a different fix for what turns out to be the same underlying data-flow issue...
> **서로 의존하는** 두 파일에 대한 파일별 패스가 각각 다른 수정안을 냈는데, 알고 보니 같은 데이터 흐름 문제였습니다.

## 함께 쓰는 표현
- **interdependent files / modules** : 서로 의존하는 파일·모듈
- **interdependency** : 상호 의존 관계
- **dependent on** ~ : ~에 의존하는

## 비슷한 말 · 반대말
- **coupled** — 서로 묶인, 결합된
- **independent** — 독립적인 (반대말)

## 시험 포인트
서로 의존하는 파일을 파일별로만 보면 데이터 흐름의 절반만 봅니다. 충돌하는 지적은 **두 파일을 함께 보는 파일 간 통합 패스**로 풀어야 하고, 확신 있는 표현 고르기나 원래 생성자에게 중재 맡기기는 오답입니다.
