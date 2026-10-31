한 번으로 끝나지 않고 **여러 번 다시 나타나는** 것을 말합니다. 동사 *recur* 는 "다시 일어나다", 형용사 *recurring* 은 "반복되는"입니다.

## 문제 속 쓰임
> ...then keep the comments that **recur** across runs
> ...여러 실행에서 **반복해 나온** 코멘트만 남긴다.

> Detect the **recurring** empty end_turn responses → remove text blocks placed right after tool_result blocks → ...
> **반복되는** 빈 end_turn 응답을 감지한다 → tool_result 블록 바로 뒤에 붙인 텍스트 블록을 제거한다 → ...

## 함께 쓰는 표현
- **recurring issue / error** : 반복되는 문제·오류
- **recur across runs** : 실행마다 되풀이되다

## 비슷한 말 · 반대말
- **repeated / persistent** — 거듭된 / 계속되는
- **one-off** — 일회성의

## 시험 포인트
반복된 코멘트만 남기는 첫 보기는 오답입니다. 매번 diff 전체를 한 패스에 담아 주의가 희석되고, **들쭉날쭉하게 드러나는 미묘한 문제가 버려집니다.** 반복되는 빈 `end_turn` 은 **메시지 구조부터** 고치는 것이 정답입니다.
