넘지 못하도록 정한 **최대치(상한)**, 또는 그 상한을 두는 것입니다. *limit* 과 비슷하지만 "위를 덮어 막는다"는 느낌입니다.

## 문제 속 쓰임
> Add a max-iteration **cap** and also stop after two consecutive text-only assistant responses, regardless of stop_reason.
> 최대 반복 횟수 **상한**을 두고, `stop_reason` 과 관계없이 텍스트만 있는 어시스턴트 응답이 두 번 연속되면 종료한다.

## 함께 쓰는 표현
- **max-iteration cap** : 최대 반복 횟수 상한
- **cap A at B** : A를 B로 제한하다 · **capped** (형) 상한이 걸린

## 시험 포인트
반복 상한은 무한 루프를 막는 **안전장치**일 뿐입니다. 루프를 끝낼지는 `stop_reason`(`tool_use` 면 계속, `end_turn` 이면 종료)으로 판단하므로, 횟수·문구로 종료를 정하는 보기는 오답입니다.
