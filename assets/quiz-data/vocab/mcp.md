**Model Context Protocol** 의 약자로, 모델 쪽 애플리케이션에 **외부 도구·데이터 소스를 표준 방식으로 연결**하는 프로토콜입니다. 기능을 제공하는 쪽을 *MCP 서버*라고 하며, 서버는 도구(tools)·리소스(resources)·프롬프트(prompts)를 노출합니다.

## 문제 속 쓰임
> A company deploys an **MCP** server that gives Claude access to internal knowledge bases and HR systems.
> 한 회사가 Claude에게 사내 지식베이스와 HR 시스템 접근 권한을 주는 **MCP** 서버를 배포했습니다.

## 함께 쓰는 표현
- **MCP server / client** : MCP 서버 / 클라이언트
- **MCP tool** : MCP 서버가 제공하는 도구
- **`.mcp.json`** : 프로젝트 범위 MCP 설정 파일 (팀이 함께 커밋)

## 시험 포인트
MCP 도구가 내장 도구보다 덜 쓰이면 먼저 **도구 설명(description)을 보강**합니다. 팀이 함께 쓰는 서버 설정은 커밋되는 `.mcp.json`(project scope)에 두고, 비밀값은 환경 변수로 넣습니다.
