안에서 무슨 일이 일어나는지 **들여다볼 수 있는 정도(가시성)** 입니다. 시스템 운영에서는 로그·추적으로 내부 동작을 확인할 수 있느냐를 말합니다.

## 문제 속 쓰임
> The engineering team cannot reproduce bugs because they have no **visibility** into which tools were called, in what order, with what inputs...
> 어떤 도구가 어떤 순서로, 어떤 입력으로 호출됐는지 **볼 수 없어서** 버그를 재현하지 못한다...

## 함께 쓰는 표현
- **have (no) visibility into** ~ : ~을 들여다볼 수 있다(없다)
- **observability** (명) 관측 가능성 — 로그·지표·추적으로 내부 상태를 파악하는 능력

## 시험 포인트
"무엇이 호출됐는지 보이지 않는다"는 신호에는 단계별 **구조화된 추적 로그**(요청, `stop_reason`, 도구 입출력, 상관 ID)가 정답입니다.
