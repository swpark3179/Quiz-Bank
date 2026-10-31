원래는 조폐국(*mint*)에서 동전을 찍어 내는 일입니다. 기술 문맥에서는 토큰·자격 증명을 **그때그때 새로 만들어 발급하는** 것을 말합니다.

## 문제 속 쓰임
> An internal MCP server requires a Kerberos-derived token that must be freshly **minted** for every connection...
> 사내 MCP 서버가 연결마다 **새로 발급해야** 하는 Kerberos 기반 토큰을 요구합니다.

## 함께 쓰는 표현
- **freshly minted** : 막 새로 발급된
- **mint a token** : 토큰을 발급하다

## 비슷한 말 · 반대말
- **issue** — 발급하다 (더 일반적인 말)
- **generate** — 생성하다

## 시험 포인트
"연결마다 새로 *minted*" 는 **고정된 값을 쓸 수 없다**는 신호입니다. 연결할 때마다 명령을 실행해 헤더 JSON 을 stdout 으로 내는 `headersHelper` 가 정답이고, 정적 `headers` 하드코딩이나 `oauth` 블록은 오답입니다.
