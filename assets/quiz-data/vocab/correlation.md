두 대상이 **서로 짝지어져 연결된 관계**를 말합니다. 시스템 설계에서는 요청과 응답처럼 *어느 것이 어느 것에 대응하는지* 이어 주는 것을 가리킬 때가 많습니다.

## 문제 속 쓰임
> Batch processing lacks request **correlation** identifiers for matching outputs to input requests.
> 배치 처리에는 출력을 입력 요청과 매칭할 **상관** 식별자가 없다.

## 함께 쓰는 표현
- **correlation ID** : 요청·응답·로그를 서로 이어 주는 고유 식별자
- **correlate A with B** : A와 B를 연결해 대조하다
- **correlation between A and B** : A와 B 사이의 상관관계

## 시험 포인트
Message Batches API 는 요청마다 `custom_id` 를 붙여 결과를 입력과 매칭할 수 있습니다. 그래서 "배치에는 대응 식별자가 없다"는 보기는 **사실과 다른 설명**입니다.
