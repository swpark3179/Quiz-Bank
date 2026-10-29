데이터를 **메모리에 두고 아주 빠르게 읽고 쓰는** 오픈 소스 키-값 저장소입니다. 웹 서비스에서 캐시·세션 저장소로 많이 씁니다.

## 문제 속 쓰임
> Use **Redis** to cache Claude's responses keyed by question hash
> **Redis**로 Claude 응답을 질문 해시 키로 캐시한다.

## 함께 쓰는 표현
- **Redis cache** : Redis 로 만든 캐시
- **key-value store** : 키-값 저장소
- **cache hit / miss** : 캐시 적중 / 실패

## 시험 포인트
Redis 로 **응답 자체를 캐시하는** 보기는 질문이 정확히 같을 때만 적중해서, 표현이 조금만 달라도 빗나갑니다. 같은 대형 문서·시스템 프롬프트가 반복되는 비용 문제는 **프롬프트 캐싱**(`cache_control`)이 정답입니다.
