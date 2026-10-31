*Uniform Resource Identifier* 의 줄임말로, **자원 하나를 콕 집어 가리키는 문자열**입니다. `https://...` 같은 웹 주소(URL)뿐 아니라 `file:///...` 처럼 자원을 식별하는 모든 주소를 아우르는 더 넓은 말이며, MCP 에서는 서버가 제공하는 리소스를 URI 로 구분합니다.

## 문제 속 쓰임
> Clients must only read **URIs** that appeared in the most recent `resources/list` response from the server.
> 클라이언트는 서버의 가장 최근 `resources/list` 응답에 나온 **URI** 만 읽어야 한다.

## 함께 쓰는 표현
- **resource URI** : 리소스 URI
- **URI template** : `file:///{path}` 처럼 빈칸을 채워 URI 를 만드는 틀
- **URI scheme** : `file://`, `https://` 같은 앞부분

## 비슷한 말
- **URL** — 웹 주소. 위치를 나타내는 URI 의 한 종류

## 시험 포인트
이 보기는 오답입니다. 템플릿은 목록에 없는 URI 도 만들 수 있게 하려고 있는 것이라 이런 클라이언트 쪽 제한은 없습니다. 디렉터리 순회(`../`) 방어는 **서버가 URI 를 검증하고 파일 경로를 정제**해야 하는(MUST) 책임입니다.
