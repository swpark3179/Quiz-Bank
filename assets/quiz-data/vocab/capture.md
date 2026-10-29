흘러가 버릴 수 있는 정보를 **놓치지 않고 붙잡아 담아 두는** 것입니다. 데이터에서는 "기록하다, 포착하다"에 가깝습니다.

## 문제 속 쓰임
> Add an "other" value to the enum plus an optional document_type_detail string so novel types are **captured** instead of misclassified.
> enum에 `"other"` 값과 선택적 `document_type_detail` 문자열을 추가해, 새로운 유형이 잘못 분류되지 않고 **포착되게** 한다.

## 함께 쓰는 표현
- **capture details / context** : 세부 사항 / 맥락을 담아 두다
- **capture output** : 출력을 받아 저장하다

## 시험 포인트
enum 밖의 값이 기존 값으로 억지 분류된다면 `"other"` + 상세 문자열 필드로 **담아 두는** 것이 정답 패턴입니다.
