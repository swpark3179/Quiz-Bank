같은 일이 **끊김 없이 연달아** 일어나는 것입니다. 숫자와 함께 *two consecutive* ~ (연속 두 번의 ~) 처럼 씁니다.

## 문제 속 쓰임
> Add a max-iteration cap and also stop after two **consecutive** text-only assistant responses, regardless of stop_reason.
> 최대 반복 횟수 상한을 두고, `stop_reason` 과 관계없이 텍스트만 있는 어시스턴트 응답이 두 번 **연속되면** 종료한다.

## 함께 쓰는 표현
- **N consecutive failures** : 연속 N번 실패
- **consecutively** (부) 연이어, 연속으로

## 시험 포인트
"연속 N번이면 종료" 같은 휴리스틱은 정상적인 다단계 작업을 끊을 수 있습니다. 에이전트 루프의 종료는 **`stop_reason`**(`end_turn`)으로 판단하는 것이 정답입니다.
