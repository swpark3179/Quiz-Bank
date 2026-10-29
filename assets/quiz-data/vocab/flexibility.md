정해진 틀에 묶이지 않고 **조건에 따라 다르게 처리하거나 세밀하게 조정할 수 있는 여지**입니다. 형용사는 *flexible*(유연한)입니다.

## 문제 속 쓰임
> Both the `settings.json` deny rules and the `PreToolUse` hook are valid architectural approaches; the hook provides more **flexibility**
> `settings.json` deny 규칙과 `PreToolUse` 훅 모두 유효한 아키텍처적 접근이며, 훅이 더 **유연하다**

## 함께 쓰는 표현
- **provide / offer flexibility** : 유연성을 주다
- **flexible** (형) 유연한 · **inflexible** (형) 융통성 없는

## 비교
- **deny 규칙** — 알려진 패턴을 선언으로 막아 단순하고 명확함
- **PreToolUse 훅** — 명령을 코드로 검사하므로 변형·조건까지 다룰 수 있어 더 유연함

## 시험 포인트
"어떤 상황에서도 막아야 한다"면 `CLAUDE.md` 지시가 아니라 Claude Code 가 강제하는 **deny 규칙과 PreToolUse 훅**이 정답입니다. 둘 다 결정적이고, 함께 쓰면 가장 견고합니다.
