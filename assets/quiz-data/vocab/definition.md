1. **정의** — 낱말·개념의 뜻을 정해 밝힌 것
2. **(도구·함수의) 정의, 명세** — *tool definition* 은 도구의 이름·설명(description)·입력 스키마(`input_schema`)를 적은 명세

## 문제 속 쓰임
> Tool **definitions** are missing `required` fields in the JSON schema
> 도구 **정의**의 JSON 스키마에 `required` 필드가 없다

## 함께 쓰는 표현
- **tool definition** : 도구 정의
- **category definitions** : 카테고리 정의 (분류 기준)
- **by definition** : 정의상, 당연히

## 시험 포인트
모델이 도구 입력을 자꾸 틀리면 프롬프트 지시나 검증 도구 추가보다 **도구 정의 자체**를 고칩니다. `required` 로 필수값을 밝히고 설명에 형식 예시와 제약을 넣는 보기가 정답입니다.
