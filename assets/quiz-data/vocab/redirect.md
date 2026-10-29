가던 흐름을 **다른 방향·목적지로 돌려 보내는** 것입니다. 웹에서는 한 주소로 온 요청을 다른 주소로 넘기는 "리디렉트"를 뜻합니다.

## 문제 속 쓰임
> Add a PreToolUse hook on process_refund that blocks any amount over $500 and **redirects** the flow to escalate_to_human.
> `process_refund` 에 PreToolUse 훅을 추가해 $500 초과 금액을 차단하고 흐름을 `escalate_to_human` 으로 **돌린다**.

## 함께 쓰는 표현
- **redirect A to B** : A를 B로 돌려 보내다
- **redirect output** : (셸에서) 출력을 파일 등으로 돌리다
- **redirection** (명) 방향 전환

## 시험 포인트
금액 한도처럼 **반드시 지켜야 하는 정책**은 프롬프트가 아니라 `PreToolUse` 훅으로 막고 **에스컬레이션으로 돌리는** 보기가 정답입니다. 도구를 아예 없애는 보기는 정상 흐름까지 막는 과잉 조치입니다.
