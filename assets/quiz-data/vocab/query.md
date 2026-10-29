1. **질의, 검색어(쿼리)** — 검색 엔진·데이터베이스·도구에 던지는 질문 하나
2. **조회하다, 질의하다** — 데이터베이스나 시스템에 물어 값을 가져온다

## 문제 속 쓰임
> It routes **queries** to the wrong tool in 31% of cases — for example, sending peer-reviewed-literature **queries** to search_web.
> 31%의 경우 **쿼리**를 잘못된 도구로 보낸다. 예를 들어 동료 심사 문헌을 찾는 **쿼리**를 `search_web` 으로 보낸다.

## 함께 쓰는 표현
- **search query** : 검색어
- **query a database** : 데이터베이스를 조회하다
- **example queries** : 예시 쿼리 (도구 설명에 넣으면 도구 선택이 정확해짐)

## 시험 포인트
쿼리를 엉뚱한 도구로 보내는 문제의 첫 처방은 **도구 설명 보강**(입력 형식, 예시 쿼리, 사용 경계)입니다. 라우터 모델 추가나 `tool_choice` 강제는 그다음이거나 오답입니다.
