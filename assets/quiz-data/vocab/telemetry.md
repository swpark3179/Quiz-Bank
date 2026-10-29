프로그램이 **사용·동작 데이터를 자동으로 모아 보내는** 것, 또는 그렇게 모인 데이터입니다. 문제에서는 "실제로 어떻게 쓰이고 있는지" 보여 주는 근거로 나옵니다.

## 문제 속 쓰임
> ...but **telemetry** shows teammates invoke it with no argument or a malformed one about a third of the time
> **텔레메트리**를 보면 팀원들이 약 3분의 1의 경우 인자 없이 또는 잘못된 형식의 인자로 호출한다

## 함께 쓰는 표현
- **telemetry data** : 텔레메트리 데이터
- **usage metrics / logs** : 사용 지표 / 로그 (비슷한 근거 자료)

## 시험 포인트
사람이 스킬을 **호출할 때** 인자를 빠뜨린다는 신호에는, 호출 시점에 기대 인자 형식을 보여 주는 frontmatter 의 `argument-hint` 가 정답입니다.
