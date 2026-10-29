사용자가 보는 화면(*frontend*) 뒤에서 **데이터 저장·업무 로직을 처리하는 서버 쪽 시스템**입니다.

## 문제 속 쓰임
> ...reaches **backend** systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human).
> 커스텀 MCP 도구(`get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`)로 **백엔드** 시스템에 접근합니다.
> get_customer and lookup_order call two different **backend** systems that return dates in different formats...
> `get_customer` 와 `lookup_order` 는 서로 다른 두 **백엔드** 시스템을 호출하는데, 두 시스템은 날짜를 서로 다른 형식으로 반환하고...

## 반대말
- **frontend** — 사용자 화면 쪽

## 시험 포인트
여러 백엔드가 **제각각 형식**(날짜·통화)으로 돌려주면, 결과가 컨텍스트에 들어가기 전에 **PostToolUse hook** 으로 하나의 표준 형식으로 정규화하는 것이 견고한 해결책입니다.
