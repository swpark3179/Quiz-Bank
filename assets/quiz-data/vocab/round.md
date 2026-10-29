1. **(되풀이되는 과정의) 한 차례, 한 회** — 질의·검토·대기를 몇 *rounds* 했는지 셀 때
2. **둥근 / 반올림하다** — *round up / round down* 올림·내림

## 문제 속 쓰임
> ...so the coordinator stops waiting after a set number of **rounds** and reports what it has
> 정해진 **라운드** 수가 지나면 코디네이터가 기다리기를 멈추고 그때까지의 결과로 보고하게 한다

## 함께 쓰는 표현
- **a round of review / feedback** : 한 차례의 검토 / 피드백
- **multiple rounds** : 여러 차례
- **round trip** : 왕복 (따로 등록된 표현)

## 시험 포인트
독립적인 서브에이전트를 하나씩 기다려 지연이 커진 경우, 라운드 상한을 두는 건 해법이 아닙니다. **한 응답에서 Task 호출을 함께 내보내 병렬로 실행**하는 보기가 정답입니다.
