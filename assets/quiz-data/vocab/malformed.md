정해진 **형식·문법에 맞지 않게 잘못 만들어진** 값을 말합니다. 아예 없는 것(*missing*)이 아니라 **있긴 한데 모양이 틀린** 것입니다.

## 문제 속 쓰임
> In testing, the model frequently passes **malformed** date strings (`"next Tuesday"`, `"ASAP"`) ...
> 테스트에서 모델이 날짜에 `"next Tuesday"`, `"ASAP"` 같은 **잘못된** 문자열을 자주 넣습니다.

## 함께 쓰는 표현
- **malformed input / JSON** : 형식이 잘못된 입력 / JSON
- **malformed request** : 형식 오류가 있는 요청

## 비슷한 말 · 반대말
- **invalid** — 유효하지 않은 (더 넓은 말)
- **well-formed** — (반대말) 형식이 올바른

## 시험 포인트
도구 인자가 잘못된 형식으로 들어오면 시스템 프롬프트 지시보다 **도구 정의 자체**를 고칩니다. `required` 지정과 description 의 형식 예시·제약 보강이 가장 효과가 큰 수정입니다.
