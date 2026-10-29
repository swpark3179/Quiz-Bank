**값이 없음**을 나타내는 특별한 값입니다. 빈 문자열(`""`)이나 0 과 달리 "정보 자체가 없다"는 뜻이고, *nullable* 은 그 필드가 **null 을 허용한다**는 뜻입니다.

## 문제 속 쓰임
> Make the po_number field **nullable** and instruct the model to return **null** when the value is not present in the source.
> `po_number` 필드를 **nullable로** 만들고, 원문에 값이 없으면 **null을** 반환하라고 모델에 지시한다

## 함께 쓰는 표현
- **return null** : null 을 반환하다
- **nullable field** : null 을 허용하는 필드
- **non-null** : null 이 아닌, 반드시 값이 있는

## 시험 포인트
원문에 값이 없는데 모델이 **그럴듯한 값을 지어낸다면**, 필드를 nullable 로 만들고 "없으면 null"이라고 지시하는 보기가 정답입니다. 원문에 없는 데이터는 재시도로 복구되지 않으므로 null 을 반환하고 사람 검토로 보냅니다.
