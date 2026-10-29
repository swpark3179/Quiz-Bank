작업이나 호출이 **제대로 끝나지 못한 것**입니다. 셀 수 있는 명사로 쓰면 *failures* 처럼 개별 실패 건을 가리키고, 동사는 *fail*(실패하다)입니다.

## 문제 속 쓰임
> A structured error with errorCategory (e.g. transient) and isRetryable, so an access **failure** differs from an empty result.
> `errorCategory`(예: `transient`)와 `isRetryable` 을 담은 구조화된 오류를 반환해, 접근 **실패**가 빈 결과와 구분되게 한다

## 함께 쓰는 표현
- **access failure** : 접근 실패 (권한·연결 문제로 데이터를 못 가져옴)
- **transient failure** : 일시적 실패 — 다시 시도하면 될 수 있는 실패
- **single point of failure** : 단일 장애 지점 — 여기 하나만 망가져도 전체가 멈추는 곳

## 시험 포인트
도구가 **실패를 빈 결과처럼 돌려주면** 에이전트는 "데이터가 없다"고 잘못 결론 내립니다. 실패 종류와 재시도 가능 여부를 담은 **구조화된 오류**로 둘을 구분하는 보기가 정답입니다.
