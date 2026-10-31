1. **(통신) 전송 방식, 트랜스포트** — 클라이언트와 서버가 **메시지를 실어 나르는 통로·방식**입니다. MCP 에는 로컬 하위 프로세스와 표준 입출력으로 통신하는 *stdio*, HTTP 로 통신하는 *Streamable HTTP* 가 있습니다
2. **운송하다, 수송** — 사람·물건을 실어 나르다 (일반적인 뜻)

## 문제 속 쓰임
> Which sequence follows the stdio **transport**'s shutdown guidance?
> stdio **트랜스포트**의 종료 지침을 따르는 순서는 무엇일까요?

## 함께 쓰는 표현
- **stdio transport** : 표준 입출력 기반 전송 방식
- **Streamable HTTP transport** : HTTP 기반 전송 방식 (단일 MCP 엔드포인트)
- **over the** ~ **transport** : ~ 트랜스포트로

## 시험 포인트
트랜스포트는 서버 안내로 고릅니다. **실행 명령**만 주어지면 stdio, **URL** 이 주어지면 HTTP 입니다. stdio 서버는 **stdin 을 닫고 기다린 뒤**, 끝나지 않으면 `SIGTERM` → `SIGKILL` 순으로 종료합니다.
