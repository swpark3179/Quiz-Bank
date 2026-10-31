1. **(빠짐없는) 목록, 명세** — 어떤 범위 안의 것을 하나도 빼지 않고 전부 적은 목록
2. **재고** — 창고에 있는 물건과 그 수량. 쇼핑·물류 예제에서 서버·도구 이름으로 자주 나옵니다

## 문제 속 쓰임
> An agent connects to two MCP servers named "billing" and "**inventory**".
> 에이전트가 "billing"(청구)과 "**inventory**"(재고)라는 두 MCP 서버에 연결돼 있습니다.

> Build a complete **inventory** of every test file in the repository and return the paths as one list
> 저장소의 모든 테스트 파일 **목록**을 빠짐없이 만들어, 경로를 하나의 목록으로 반환한다

## 함께 쓰는 표현
- **a complete inventory of** ~ : ~의 전체 목록
- **inventory management** : 재고 관리
- **take inventory** : 재고·목록을 하나하나 조사하다

## 시험 포인트
저장소 전체의 *inventory* 만들기처럼 출력은 많지만 결과가 목록 하나로 압축되는 작업은 **서브에이전트에 맡기기 좋은 작업**입니다. 메인 대화에 남길 것은 작은 모듈에서 함수 하나를 찾는 국소 작업이었습니다.
