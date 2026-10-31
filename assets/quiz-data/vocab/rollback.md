배포·변경·마이그레이션을 **문제가 생기기 전 상태로 되돌리는** 것입니다. 동사로 쓸 때는 *roll back*(두 단어)으로 띄어 씁니다.

## 문제 속 쓰임
> An architect is defining a "database-migration" AgentDefinition with a long prompt field describing SQL best practices, **rollback** strategy, and data integrity checks.
> 아키텍트가 SQL 모범 사례, **롤백** 전략, 데이터 무결성 검사를 설명하는 긴 `prompt` 필드를 가진 "database-migration" `AgentDefinition` 을 정의하고 있다.

## 함께 쓰는 표현
- **rollback strategy / plan** : 롤백 전략·계획
- **roll back a change** : 변경을 되돌리다

## 비슷한 말 · 반대말
- **revert** — 되돌리다 (*git revert* 처럼 거의 같은 뜻)
- **roll forward** — 되돌리지 않고 새 수정으로 앞으로 고쳐 나가기

## 시험 포인트
롤백 전략처럼 **매번 같은 전문 지식은 `AgentDefinition.prompt`**(서브에이전트의 시스템 프롬프트)에, 어느 테이블을 바꿀지는 **호출별 프롬프트**에 둡니다. 두 프롬프트는 버려지거나 잘리지 않고 모두 서브에이전트에 전달됩니다.
