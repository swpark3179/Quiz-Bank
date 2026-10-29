기호·문자로 무언가를 **적는 방식, 즉 표기법**입니다. 같은 값이라도 표기가 다르면 기계나 모델이 잘못 읽기 쉽습니다.

## 문제 속 쓰임
> ...return dates in different formats (ISO vs. US) and amounts with inconsistent currency **notation**.
> 두 시스템은 날짜를 서로 다른 형식(ISO와 미국식)으로 반환하고 금액의 통화 **표기**도 일관되지 않습니다.

## 함께 쓰는 표현
- **currency notation** : 통화 표기
- **dot notation** : 점 표기법 (`obj.field`)
- **scientific notation** : 지수 표기법 (`1.2e3`)

## 시험 포인트
도구 출력의 형식·표기가 섞여 있으면 프롬프트로 조심하라고 하기보다 `PostToolUse` 훅으로 **코드에서 정규화**하는 보기가 정답입니다.
