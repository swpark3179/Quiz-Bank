부모·상위에게서 **그대로 이어받는** 것입니다. 프로그래밍에서는 클래스 상속을, 에이전트 설계에서는 상위(코디네이터)의 맥락·설정을 하위가 넘겨받는지를 말합니다.

## 문제 속 쓰임
> Subagents **inherit** the hub's full message history automatically
> 서브에이전트는 허브의 전체 메시지 기록을 자동으로 **상속한다**
> ...since subagents do not **inherit** the coordinator's context.
> 서브에이전트는 코디네이터의 컨텍스트를 **상속하지** 않으므로...

## 함께 쓰는 표현
- **inherit from** ~ : ~에게서 물려받다
- **inherited** (형) 물려받은 · **inheritance** (명) 상속

## 시험 포인트
서브에이전트는 코디네이터의 대화 기록을 **상속하지 않습니다**. "자동으로 상속된다"는 보기는 오답이고, 필요한 맥락을 **위임 프롬프트에 명시적으로 넣는** 보기가 정답입니다.
