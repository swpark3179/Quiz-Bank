**허용되는 값을 미리 정해 둔 목록 타입**(열거형)입니다. 스키마에서 `"enum": ["invoice", "receipt", ...]` 처럼 쓰면 그 밖의 값은 나올 수 없습니다.

## 문제 속 쓰임
> The extraction schema uses an **enum** with six known values for document_type.
> 추출 스키마는 `document_type` 에 알려진 값 6개로 된 **enum**을 쓴다.

## 함께 쓰는 표현
- **enum value** : 열거형 값 하나
- **switch on an enum** : enum 값에 따라 분기하다
- **enumerate** (동) 하나하나 열거하다

## 시험 포인트
enum 에 맞는 값이 없으면 모델은 **가장 가까운 값에 억지로 끼워 맞춥니다**. 새 유형이 들어올 수 있다면 `"other"`(또는 `"unclear"`) 값과 **상세 설명용 문자열 필드**를 함께 두는 설계가 정답입니다.
