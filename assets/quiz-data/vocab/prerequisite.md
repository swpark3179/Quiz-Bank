어떤 일을 하기 **전에 반드시 갖춰져 있어야 하는 조건**입니다. "이게 먼저 끝나야 다음으로 갈 수 있다"처럼 순서가 중요할 때 씁니다.

## 문제 속 쓰임
> Add a programmatic **prerequisite** that blocks `lookup_order` and `process_refund` calls until `get_customer` has returned a verified customer ID.
> `get_customer` 가 검증된 고객 ID를 돌려줄 때까지 `lookup_order`·`process_refund` 호출을 막는 프로그램 방식의 **전제 조건**을 추가한다.

## 함께 쓰는 표현
- **prerequisite for** ~ : ~의 전제 조건
- **prerequisite check** : 선행 조건 확인
- **prerequisites** : (강의·설치의) 선수 조건, 사전 요구 사항

## 비슷한 말
- **precondition** — 전제 조건 (거의 같은 뜻)
- **requirement** — 요구 사항 (순서보다 "필요한 것" 자체)

## 시험 포인트
"반드시 이 순서로"가 지켜져야 하는 상황에서는 프롬프트·few-shot 같은 안내보다 **코드로 강제하는 전제 조건**이 정답입니다. LLM은 지시를 가끔 어길 수 있기 때문입니다.
