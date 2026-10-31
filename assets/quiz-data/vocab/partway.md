일이 **끝까지 가지 못하고 중간 어딘가에 와 있는 상태**를 말합니다. 주로 *partway through* ~ 꼴로 "~을 하던 도중에"라는 뜻으로 씁니다.

## 문제 속 쓰임
> The loop can halt while stop_reason is still "tool_use", leaving a task Claude was **partway** through unfinished and its answer incomplete
> `stop_reason` 이 아직 `"tool_use"` 인데 루프가 멈춰, Claude가 **하던 도중인** 작업이 끝나지 않고 답도 불완전하게 남을 수 있다.

## 함께 쓰는 표현
- **partway through** ~ : ~하는 도중에
- **stop partway** : 중간에 멈추다
- **partway down the page** : 페이지 중간쯤에

## 비슷한 말 · 반대말
- **halfway** — 정확히 절반쯤. *partway* 는 "어느 정도 와 있음"만 뜻합니다
- **midway** — 중간 지점에서 (거의 같은 뜻)

## 시험 포인트
"작업 **도중에** 끊긴다"는 표현은 고정 반복 상한처럼 작업 완료와 무관한 장치를 주 종료 조건으로 쓴 잘못을 가리킵니다. 루프는 `stop_reason` 이 `"end_turn"` 일 때 끝나야 하고, 반복 상한은 안전망으로만 씁니다.
