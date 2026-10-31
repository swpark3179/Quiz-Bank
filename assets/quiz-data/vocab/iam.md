**Identity and Access Management** 의 줄임말로, 클라우드에서 **누가(사람·서비스 계정) 어떤 자원에 무엇을 할 수 있는지** 정하는 권한 체계입니다. AWS·Google Cloud 등은 역할(role)과 정책(policy)으로 이 권한을 부여합니다.

## 문제 속 쓰임
> Give its service account only the minimal **IAM** permissions it needs, and route sensitive access such as the billing API through a proxy outside its boundary.
> 서비스 계정에는 필요한 최소한의 **IAM** 권한만 주고, 결제 API 같은 민감한 접근은 경계 밖 프록시를 거치게 한다.

## 함께 쓰는 표현
- **IAM role / policy** : IAM 역할 / 정책
- **least privilege** : 최소 권한 원칙
- **service account** : 사람이 아닌 워크로드용 계정

## 시험 포인트
클라우드에 배포한 에이전트는 서비스 계정에 **최소 IAM 권한**만 주고 민감한 호출은 경계 밖 프록시로 보냅니다. 넓은 관리자 권한, 배포 파이프라인 역할 재사용, 개발자의 장기 키 마운트는 모두 오답입니다.
