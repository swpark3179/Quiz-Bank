1. **(데이터를) 넣어 주다, 공급하다** — 앞 단계의 결과를 다음 단계의 입력으로 흘려 넣는다 (*feed A into B*)
2. **피드** — 새 항목이 계속 갱신되어 들어오는 데이터 목록 (*product feed*, *news feed*)

## 문제 속 쓰임
> ...Claude calls `get_metric` nine times in a row, **feeding** each result into the next call...
> Claude가 `get_metric` 을 아홉 번 연달아 호출하며 각 결과를 다음 호출에 **넣는다**.

## 함께 쓰는 표현
- **feed A into B** : A를 B에 입력으로 넣다
- **product feed** : (공급사가 주는) 상품 정보 피드
- **feedback** : 피드백, 되먹임

## 시험 포인트
결과를 다음 호출에 차례로 *feed* 하는 연쇄 호출은 **프로그래밍 방식 도구 호출**로 묶어 중간 결과가 대화 이력에 쌓이지 않게 합니다. 도구 정의가 많으면 도구 검색, 반복 비용은 캐싱, 오래된 결과는 컨텍스트 편집과 짝짓습니다.
