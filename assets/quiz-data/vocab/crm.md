**Customer Relationship Management** 의 약자로, 고객 정보·연락 이력·거래 기록을 한곳에 모아 관리하는 시스템입니다 (예: Salesforce). 지원 에이전트 문제에서는 고객 조회용 백엔드로 나옵니다.

## 문제 속 쓰임
> A customer support agent has 14 tools: **CRM** lookup, order history, payment read, payment write, fraud check...
> 고객지원 에이전트가 14개의 도구(**CRM** 조회, 주문 이력, 결제 조회, 결제 쓰기, 사기 검사...)를 갖고 있습니다.

## 함께 쓰는 표현
- **CRM lookup** : CRM에서 고객 정보 조회
- **CRM record** : CRM에 저장된 고객 기록

## 시험 포인트
한 에이전트에 도구가 너무 많아 엉뚱한 도구를 고른다면 **역할별 서브에이전트(허브 앤 스포크)로 도구를 나누고**, 결제 전 사기 검사 같은 필수 순서는 **훅으로 결정적으로 강제**하는 것이 정답입니다.
