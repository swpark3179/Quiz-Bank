수치가 기준선보다 **아래로 내려가는** 것입니다. 임계값(threshold)·목표(target)와 함께 써서 "기준 미달"을 나타냅니다.

## 문제 속 쓰임
> Have the agent self-report a confidence score (1-10) and route to humans when confidence **falls below** a threshold.
> 에이전트가 신뢰도 점수(1~10)를 스스로 보고하게 하고, 점수가 임계값 **아래로 떨어지면** 사람에게 넘긴다.

## 함께 쓰는 표현
- **fall below a threshold / target** : 임계값·목표에 못 미치다
- **well below** ~ : ~에 한참 못 미치는 (*well below the 80% target*)

## 반대말
- **exceed**, **rise above** — (기준을) 넘다

## 시험 포인트
모델이 **스스로 매긴 신뢰도**는 보정이 부실해서, 그 점수가 기준 아래일 때 넘기는 방식은 오답이 되기 쉽습니다. 에스컬레이션 판단을 바로잡으려면 **명확한 기준 + few-shot 예시**가 정답입니다.
