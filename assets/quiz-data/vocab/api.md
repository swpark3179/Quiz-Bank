프로그램이 다른 프로그램·서비스의 기능을 **정해진 요청·응답 형식으로 호출하는 창구**입니다. *Anthropic API* 는 Claude 모델을 부르는 Messages API 등을 말합니다.

## 문제 속 쓰임
> A tool definition for a flight search **API** is: ...
> 항공편 검색 **API**의 도구 정의가 위와 같습니다.
> Enable verbose logging on the Anthropic **API** client
> Anthropic **API** 클라이언트의 상세(verbose) 로깅을 켠다

## 함께 쓰는 표현
- **API call / request** : API 호출 / 요청
- **API key** : API 인증 키
- **Batch API** : 여러 요청을 묶어 비동기로 처리하는 API

## 시험 포인트
디버깅 문제에서는 "상세 로깅을 켠다"보다, 단계마다 **요청 페이로드·`stop_reason`·도구 입출력**을 세션 상관 ID 와 함께 남기는 **구조화된 트레이스 로깅**이 정답이었습니다.
