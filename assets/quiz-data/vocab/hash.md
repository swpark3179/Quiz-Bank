데이터를 해시 함수에 넣어 얻은 **고정 길이의 짧은 값**입니다. 내용이 같으면 해시도 같아 캐시 키·중복 확인에 쓰지만, 글자 하나만 달라도 전혀 다른 값이 됩니다.

## 문제 속 쓰임
> Use Redis to cache Claude's responses keyed by question **hash**
> Redis로 Claude 응답을 질문 **해시** 키로 캐시한다

## 함께 쓰는 표현
- **hash key** : 해시 키
- **hash function** : 해시 함수 (예: SHA-256)
- **hash table / map** : 해시 테이블

## 시험 포인트
질문 문장을 해시해 응답을 캐시하면 **표현이 조금만 달라도** 적중하지 않고, 문서 처리 비용도 줄지 않습니다. 같은 대형 문서가 반복된다면 문서 블록에 `cache_control` 을 거는 **프롬프트 캐싱**이 정답입니다.
