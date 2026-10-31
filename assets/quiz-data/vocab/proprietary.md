특정 회사가 **소유하고 직접 만든, 외부에 공개되지 않은** 것을 말합니다. 그래서 바로 쓸 수 있는 공개 연동(MCP 서버 등)이 없다는 뉘앙스가 함께 따라옵니다.

## 문제 속 쓰임
> An Agent SDK agent must look up employee leave balances in a **proprietary** internal HR service.
> Agent SDK 에이전트가 **사내 독점** HR 서비스에서 직원의 남은 휴가 일수를 조회해야 한다.

## 함께 쓰는 표현
- **proprietary system / software** : 독점 시스템·소프트웨어
- **proprietary data** : 회사 소유의 비공개 데이터
- **proprietary format** : 독자 형식

## 비슷한 말 · 반대말
- **in-house** — 사내에서 만든 (비슷한 뜻)
- **open-source / third-party** — 공개 소스 / 외부 업체의

## 시험 포인트
"**독점 사내 서비스 + 기존 MCP 서버 없음 + Agent SDK**" 조합이면, `tool()` 로 커스텀 도구를 정의해 **인프로세스 SDK MCP 서버**에 등록하는 것이 정답입니다. 사내 서비스를 공개 MCP 서버로 내놓는 것은 불필요한 노출입니다.
