1. **(측정·금액의) 단위** — 센트·달러, 초·밀리초처럼 값을 재는 기준
2. **(작업·기능의) 단위** — *unit test* 처럼 하나로 떼어 다룰 수 있는 묶음

## 문제 속 쓰임
> ...the model occasionally misreads these heterogeneous fields, e.g., treating a refund amount in the wrong **units**.
> 모델이 이런 이질적인 필드를 가끔 잘못 읽어, 예를 들어 환불 금액을 잘못된 **단위**로 해석한다.

## 함께 쓰는 표현
- **unit of work** : 작업 단위
- **unit test** : 단위 테스트 — 함수·모듈 하나를 따로 검사하는 테스트

## 시험 포인트
도구마다 단위·형식이 섞여 모델이 잘못 읽는다면, 프롬프트 지시나 컨텍스트 확대가 아니라 **`PostToolUse` 훅으로 출력을 하나의 표준 형식으로 정규화**하는 보기가 정답입니다.
