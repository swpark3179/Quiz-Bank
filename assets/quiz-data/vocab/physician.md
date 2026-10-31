환자를 진찰하고 치료하는 **의사**를 가리키는 격식 있는 말입니다. 의료 문서·데이터 필드 이름에 자주 나옵니다.

## 문제 속 쓰임
> Many reports name no referring **physician**, but every record still has a plausible-looking name in that field.
> 많은 보고서에 **의뢰 의사** 이름이 없는데도, 모든 레코드의 그 필드에 그럴듯한 이름이 들어 있다.

## 함께 쓰는 표현
- **referring physician** : 진료를 의뢰한 의사
- **attending physician** : 담당 의사, 주치의
- **primary care physician** : 1차 진료 의사

## 비슷한 말 · 반대말
- **doctor** — 일상적인 말. *physician* 은 더 격식 있고 외과의(*surgeon*)와 구분해 쓰기도 합니다

## 시험 포인트
strict 도구에서 `referring_physician` 이 **필수 string** 이면, 원문에 이름이 없을 때 스키마상 유효한 출력은 지어낸 값뿐입니다. 없을 수 있는 필드는 **optional·null 허용**으로 바꾸는 것이 정답입니다.
