나라마다 쓰는 **돈의 단위(통화)** 입니다. 데이터에서는 금액에 붙는 통화 코드·기호(USD, $, ₩)와 그 표기 방식을 말합니다.

## 문제 속 쓰임
> ...amounts with inconsistent **currency** notation.
> 금액의 **통화** 표기도 일관되지 않습니다.

## 함께 쓰는 표현
- **currency code** : 통화 코드 (USD, EUR, KRW)
- **currency notation** : 통화 표기 방식
- **currency conversion** : 환전, 통화 변환

## 시험 포인트
도구마다 날짜·통화 형식이 달라 모델이 잘못 읽는다면, 프롬프트 지시가 아니라 **`PostToolUse` 훅에서 코드로 하나의 표준 형식으로 정규화**하는 것이 정답입니다.
