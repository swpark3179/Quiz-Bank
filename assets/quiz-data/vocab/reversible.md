한 일을 **나중에 원래대로 되돌릴 수 있는** 성질입니다. 데이터베이스 마이그레이션·배포처럼 실수했을 때 복구 가능해야 하는 작업에 붙는 요건입니다.

## 문제 속 쓰임
> The project's CLAUDE.md states that every database migration must be **reversible**.
> 프로젝트의 CLAUDE.md 에는 모든 데이터베이스 마이그레이션은 **되돌릴 수 있어야** 한다는 규칙이 있다.

## 함께 쓰는 표현
- **reversible migration** : 되돌릴 수 있는 마이그레이션
- **irreversible action** : 되돌릴 수 없는 작업
- **reverse** (동) : 되돌리다, 뒤집다

## 비슷한 말 · 반대말
- **irreversible** — 되돌릴 수 없는
- **rollback** — 되돌리기(롤백). *reversible* 한 변경이어야 할 수 있습니다

## 시험 포인트
쟁점은 규칙 내용이 아니라 **서브에이전트가 그 규칙을 보느냐**입니다. 커스텀 서브에이전트는 `omitClaudeMd` 를 켜지 않는 한 CLAUDE.md 계층을 로드하므로 규칙을 봅니다. 부모의 *대화 기록*을 받지 않는 것과 혼동하지 마세요.
