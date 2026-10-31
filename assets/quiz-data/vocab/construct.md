1. **(코드의) 구문 요소** — 함수 호출·반복문·try 블록처럼 코드를 이루는 구성 단위입니다 (명사)
2. **구성하다, 만들다** — 여러 요소를 짜 맞춰 만드는 것입니다 (동사)

## 문제 속 쓰임
> ...since a correctly **constructed** JSON schema can apply constraints that verify the relationship between amount and transaction_type...
> ...올바르게 **구성된** JSON 스키마는 amount와 transaction_type의 관계를 검증하는 제약을 걸 수 있기 때문이다...

> A `detected_pattern` field naming the code **construct** that triggered the finding, such as a call to the team's sanitization helper
> 지적을 촉발한 **코드 구조**(예: 팀의 sanitization 헬퍼 호출)를 이름으로 기록하는 `detected_pattern` 필드

## 함께 쓰는 표현
- **language construct** : 언어의 구문 요소
- **construct a request** : 요청을 구성하다

## 시험 포인트
스키마가 아무리 잘 *constructed* 되어도 보장하는 것은 출력의 **모양**(필드 존재·타입)뿐이고, 값이 원문과 맞는지는 아닙니다. 리뷰 봇의 기각 원인을 찾으려면 지적을 촉발한 코드 *construct* 를 `detected_pattern` 으로 남겨 구조별로 집계합니다.
