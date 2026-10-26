사람의 판단이나 프롬프트 지시가 아니라 **코드로 처리·강제한다**는 뜻입니다. 시험에서는 "LLM이 어길 수 없게 만든다"는 의미로 자주 나옵니다.

## 문제 속 쓰임
> Add a **programmatic** prerequisite that blocks `lookup_order` and `process_refund` calls.
> `lookup_order`·`process_refund` 호출을 막는 **프로그램 방식의** 전제 조건을 추가한다.

## 함께 쓰는 표현
- **programmatic control** : 코드로 제어하기
- **programmatic access** : (API 등을 통한) 프로그램 접근
- **programmatically** (부) 프로그램으로, 코드로

## 비교
- **programmatic** — 코드가 **결정적으로** 강제 (매번 같은 결과)
- **prompt-based** — 지시로 **유도**할 뿐, 가끔 어길 수 있음

## 시험 포인트
반드시 지켜야 하는 규칙(검증 순서 등)은 시스템 프롬프트나 few-shot보다 **programmatic 한 강제**가 정답인 경우가 많습니다.
