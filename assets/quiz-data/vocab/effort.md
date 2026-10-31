1. **노력, 수고** — 어떤 일에 들이는 힘과 시간 (*spend effort on* ~)
2. **(API) effort 설정** — 모델이 답 하나에 생각과 토큰을 얼마나 쓸지 정하는 수준 값입니다. 낮추면 토큰과 지연이 줄고, 높이면 더 깊이 추론합니다

## 문제 속 쓰임
> Keep one pass over the diff, but have the model rank the files by risk first, then spend its review **effort** on the highest-risk ones
> 한 패스는 유지하되, 모델이 먼저 위험도로 파일 순위를 매기고 가장 위험한 파일에 리뷰 **노력**을 쏟게 한다.

> An engineer configures the generation session with a high extended thinking **effort**...
> 엔지니어가 생성 세션에 높은 extended thinking **effort** 를 설정한다.

## 함께 쓰는 표현
- **spend effort on** ~ : ~에 힘을 쏟다
- **effort level** : effort 수준 (`low`·`medium`·`high`·`xhigh`·`max`)

## 시험 포인트
effort 를 높여도 코드를 쓴 **같은 컨텍스트**에서의 자기 검토는 원래 추론의 편향을 이어받아, 독립 리뷰 인스턴스를 대신하지 못합니다. 또 Opus 5.5·Haiku 5.5는 effort 기본값이 `medium` 이라, 그보다 토큰을 아끼려면 `low` 를 씁니다.
