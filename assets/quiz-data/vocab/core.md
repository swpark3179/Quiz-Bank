**가장 중심이 되는 핵심 부분**입니다. 명사 앞에서 "핵심의, 기본이 되는"이라는 뜻으로 자주 씁니다.

## 문제 속 쓰임
> ...70% of requests are semantically identical queries from different users hitting the same 10 **core** documents.
> 요청의 70%가 서로 다른 사용자들이 같은 **핵심** 문서 10개에 대해 보내는, 의미상 동일한 질의였습니다.

## 함께 쓰는 표현
- **core feature / logic** : 핵심 기능·로직
- **core documents** : 자주 쓰이는 핵심 문서
- **at its core** : 본질적으로는

## 시험 포인트
많은 요청이 **같은 대형 문서(고정된 앞부분)를 반복해서** 쓴다면 프롬프트 캐싱(`cache_control`)이 비용을 가장 크게 줄입니다. 질의 난이도별 모델 라우팅과 함께 쓰는 보기가 정답입니다.
