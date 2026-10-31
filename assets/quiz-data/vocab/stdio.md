*standard input/output* 의 줄임말로, 프로그램이 **표준 입력(stdin)으로 받고 표준 출력(stdout)으로 내보내는** 기본 통로입니다. MCP 에서는 클라이언트가 서버를 **로컬 하위 프로세스로 띄우고** 이 통로로 메시지를 주고받는 전송 방식을 가리킵니다.

## 문제 속 쓰임
> A desktop host launched a local MCP server over **stdio** and now needs to shut it down cleanly on Linux.
> 데스크톱 호스트가 로컬 MCP 서버를 **stdio** 로 실행했고, 이제 Linux 에서 깔끔하게 종료하려 합니다.

## 함께 쓰는 표현
- **over stdio** : stdio 로 (통신하다)
- **stdio transport** : stdio 전송 방식
- **close stdin** : 서버로 가는 입력 스트림을 닫다

## 비슷한 말 · 반대말
- **Streamable HTTP** — URL 로 접속하는 원격 서버용 MCP 전송 방식

## 시험 포인트
stdio 서버 종료는 **stdin 을 닫고 기다리는 것**이 먼저이고, 끝나지 않으면 `SIGTERM` → `SIGKILL` 순으로 올립니다. 서버 안내에 URL 없이 **실행 명령만** 있으면 `command`·`args` 를 주는 stdio 방식으로 등록합니다.
