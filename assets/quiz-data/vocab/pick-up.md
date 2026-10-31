1. **(중단한 곳부터) 이어받다, 다시 시작하다** — 멈췄던 작업·대화를 그 지점부터 계속한다 (*pick up where you left off*)
2. **(변경·설정을) 알아채 반영하다** — 새로 생긴 내용이나 지시를 받아들여 동작에 반영한다 (*pick up the new config*)

## 문제 속 쓰임
> The subagent inherited a stale cached copy of the conversation and needs its session resumed to **pick up** the recent turns
> 서브에이전트가 오래된 캐시 사본의 대화를 물려받았으므로, 세션을 재개해 최근 턴을 **불러와 반영해야** 한다.

## 함께 쓰는 표현
- **pick up where** ~ **left off** : ~가 멈춘 곳부터 다시 하다
- **pick up changes** : 변경 사항을 반영하다
- **pick up an instruction** : 지시를 알아채 따르다

## 시험 포인트
이 보기는 오답입니다. 서브에이전트는 부모 대화를 **아예 물려받지 않으므로** 재개해서 따라잡을 사본이 없습니다. 필요한 결정은 Agent 도구의 프롬프트에 직접 넣어야 합니다. temperature 를 올려 빠진 지시를 *pick up* 하게 한다는 보기도 같은 이유로 오답입니다(없는 지시는 샘플링으로 생기지 않음).
