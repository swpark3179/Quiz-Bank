정해진 **유효 기간이 끝나 더는 쓸 수 없게 된다**는 말입니다. 토큰·API 키·캐시·인증서처럼 수명이 정해진 것에 씁니다.

## 문제 속 쓰임
> Configure a static `headers` entry with the token value hardcoded, then rotate the config file manually whenever the token **expires**.
> 토큰 값을 하드코딩한 정적 `headers` 항목을 설정하고, 토큰이 **만료될** 때마다 설정 파일을 수동으로 교체한다.

## 함께 쓰는 표현
- **expired API key** : 만료된 API 키
- **expiration date** : 만료일
- **short-lived token** : 금방 만료되는 단기 토큰

## 시험 포인트
연결마다 새 토큰이 필요한 MCP 인증(Kerberos 등)은 정적 헤더가 아니라, 연결할 때마다 헤더를 만들어 내는 `headersHelper` 로 처리합니다. 수동 교체는 이미 *expire* 된 뒤에야 값을 바꾸므로 오답입니다.
