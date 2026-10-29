문서가 **어떤 종류인지**(송장·영수증·계약서 등)를 나타내는 말입니다. 추출 스키마에서는 `document_type` 필드로, 명사 앞에서는 *document-type classifier* 처럼 씁니다.

## 문제 속 쓰임
> Fine-tune a dedicated **document-type** classifier and run it before extraction to assign the type to every document.
> 전용 **문서 유형** 분류기를 파인튜닝해 추출 전에 실행하고, 모든 문서에 유형을 부여하게 한다

## 함께 쓰는 표현
- **document-type classifier** : 문서 유형 분류기
- **classify the document type** : 문서 유형을 분류하다

## 시험 포인트
기존 유형에 없는 새 문서가 들어와 억지로 끼워 맞춰진다면, 분류기를 따로 파인튜닝하기보다 **스키마의 enum 에 `"other"` 같은 값과 상세 설명 필드를 추가**하는 쪽이 간단하고 확실한 해결입니다.
