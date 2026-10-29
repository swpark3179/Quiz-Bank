어떤 사람·구성 요소가 시스템 안에서 **맡은 일, 역할**입니다. 프롬프트에서 모델에게 역할을 정해 주는 것을 *role prompting* 이라고 합니다.

## 문제 속 쓰임
> Limit the synthesis subagent's tool configuration to the few tools its **role** needs, removing search and parsing tools.
> 합성 서브에이전트의 도구 구성을 **역할**에 필요한 소수의 도구로 제한하고, 검색·파싱 도구를 제거한다

## 함께 쓰는 표현
- **play a role in** ~ : ~에서 역할을 하다
- **role-based access** : 역할에 따른 접근 권한

## 시험 포인트
서브에이전트에게는 **역할에 필요한 도구만** 주는 것이 정석입니다. 필요 없는 도구가 보이면 불필요한 호출·잘못된 선택이 늘고, 프롬프트로 "쓰지 마라"고 하는 것보다 아예 빼는 쪽이 확실합니다.
