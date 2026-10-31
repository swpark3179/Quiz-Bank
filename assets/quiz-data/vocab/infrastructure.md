애플리케이션 코드 자체가 아니라 **그 코드를 돌리는 바탕**(서버, 네트워크, 데이터베이스, 클라우드 자원)입니다. Terraform 처럼 인프라를 코드로 관리하는 도구와 함께 자주 나옵니다.

## 문제 속 쓰임
> An **infrastructure** team wants Claude Code to load Terraform-specific formatting and tagging conventions only when Claude edits files under the terraform/ directory...
> **인프라** 팀이 Terraform 전용 포맷·태그 규칙을 Claude가 `terraform/` 디렉터리 아래 파일을 편집할 때만 로드하려 합니다.

## 함께 쓰는 표현
- **infrastructure team** : 인프라 팀
- **Infrastructure as Code (IaC)** : 인프라를 코드로 정의·관리하는 방식
- **need different infrastructure** : 서로 다른 인프라가 필요하다

## 시험 포인트
*The two need different infrastructure* 처럼 접근마다 필요한 인프라가 다르다는 말은 **편집 전에 정해야 할 설계 결정이 남았다**는 신호입니다. 코드 변경이 30줄 미만이어도 플랜 모드로 먼저 정하는 것이 정답이었습니다.
