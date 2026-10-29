1. **접근 (권한)** — 시스템·데이터를 읽거나 쓸 수 있는 상태 (*give access to*)
2. **접근하다, 조회하다** — 동사로도 씁니다 (*access the database*)

## 문제 속 쓰임
> A company deploys an MCP server that gives Claude **access** to internal knowledge bases and HR systems.
> 한 회사가 Claude에게 사내 지식베이스와 HR 시스템 **접근 권한**을 주는 MCP 서버를 배포했습니다.
> ...a structured error with errorCategory (e.g. transient) and isRetryable, so an **access** failure differs from an empty result.
> ...구조화된 오류를 반환해, **접근** 실패가 빈 결과와 구분되게 한다

## 함께 쓰는 표현
- **access control** : 접근 제어
- **read / write access** : 읽기 / 쓰기 권한
- **accessible** (형) 접근할 수 있는

## 시험 포인트
도구가 **접근 실패(타임아웃·권한 오류)** 를 빈 결과처럼 돌려주면 에이전트는 "데이터 없음"으로 잘못 결론 냅니다. 오류 종류·재시도 가능 여부를 담은 **구조화된 오류**로 둘을 구분해야 합니다.
