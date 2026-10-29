1. **(값·맥락을) 넘기다, 전달하다** — 함수 인자나 프롬프트에 정보를 실어 보낸다
2. **(테스트·검사를) 통과하다** — *passing tests* 는 "통과한 테스트"

## 문제 속 쓰임
> Each spawned agent starts with a clean empty message history — context must be **passed** explicitly
> 생성된 각 에이전트는 비어 있는 새 메시지 기록으로 시작한다 — 맥락은 명시적으로 **전달해야** 한다.
> In testing, the model frequently **passes** malformed date strings...
> 테스트에서 모델이 날짜에 잘못된 문자열을 자주 **넣는다**.

## 함께 쓰는 표현
- **pass A to B** : A를 B에 넘기다
- **pass through** : 그대로 통과시키다
- **pass / fail** : 통과 / 실패

## 시험 포인트
서브에이전트는 부모 대화를 물려받지 않으므로, 필요한 사실은 **Task 프롬프트에 명시적으로 넘겨야** 합니다. "자동 상속·공유 메모리"를 전제로 한 보기는 오답입니다.
