강의 상류처럼, 처리 흐름에서 **앞쪽(먼저 실행되는) 단계** 를 가리킵니다. 결과를 받아 쓰는 뒤 단계는 *downstream* 입니다.

## 문제 속 쓰임
> Modify **upstream** agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning
> **상류(앞 단계)** 에이전트가 장황한 콘텐츠·추론 대신 구조화된 데이터(핵심 사실·인용·관련성 점수)를 반환하도록 고친다.

## 함께 쓰는 표현
- **upstream data / service** : 앞 단계에서 넘어온 데이터 / 의존하는 상위 서비스
- **upstream repository** : (Git) 포크의 원본 저장소
- **fix it upstream** : 문제가 생기는 앞 단계에서 고치다

## 반대말
- **downstream** — 하류의, 뒤 단계의 (결과를 받아 쓰는 쪽)

## 시험 포인트
뒤 단계로 넘어오는 데이터가 너무 많거나 장황하면, 중간에 요약 단계를 끼우기보다 **데이터를 만드는 앞 단계에서** 필요한 것만 구조화해 내보내게 고치는 것이 근본 해결입니다.
