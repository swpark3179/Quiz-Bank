다시 쓸 데이터를 **저장해 두고 재사용하는** 것, 또는 그 저장소입니다. Claude API 의 **prompt caching** 은 매번 똑같이 보내는 앞부분(시스템 프롬프트·문서)을 저장해 두고 다시 읽어 비용과 지연을 줄입니다.

## 문제 속 쓰임
> Implement prompt **caching** for the static system prompt and core documents; route simple classification queries to Haiku while keeping Opus for complex analysis
> 정적인 시스템 프롬프트와 핵심 문서에 프롬프트 **캐싱**을 적용하고, 단순 질의는 Haiku로 라우팅하되 복잡한 분석은 Opus를 유지한다

## 함께 쓰는 표현
- **prompt caching** : 프롬프트 캐싱
- **cache hit / miss** : 캐시 적중 / 실패
- **cached results** : 캐시된(저장된) 결과

## 시험 포인트
여러 사용자가 같은 큰 문서를 물을 때는 그 문서 블록에 `cache_control` 을 붙여 **변하지 않는 앞부분**을 캐시하는 것이 정답입니다. 질문·응답을 캐시하거나 문서를 쪼개 따로 캐시하는 보기는 오답입니다.
