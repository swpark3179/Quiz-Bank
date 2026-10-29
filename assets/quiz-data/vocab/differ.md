두 대상이 **서로 다르다, 구별된다**는 뜻입니다. *differ from* ~ (~와 다르다) 형태로 많이 씁니다.

## 문제 속 쓰임
> A structured error with errorCategory (e.g. transient) and isRetryable, so an access failure **differs** from an empty result.
> `errorCategory`(예: `transient`)와 `isRetryable` 을 담은 구조화된 오류를 반환해, 접근 실패가 빈 결과와 **구분되게** 한다

## 함께 쓰는 표현
- **differ from** ~ : ~와 다르다
- **differ in** ~ : ~ 면에서 다르다
- **differing** (형) 서로 다른 — *differing figures* 서로 다른 수치

## 시험 포인트
도구가 **접근 실패(timeout 등)** 와 **정상적인 빈 결과**를 같은 모양으로 돌려주면 에이전트는 재시도할지 판단할 수 없습니다. 오류 유형·재시도 가능 여부를 담은 **구조화된 오류**로 둘을 구별하는 보기가 정답입니다.
