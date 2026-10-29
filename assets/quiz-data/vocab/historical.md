지난 기록·이력에 바탕을 둔 것입니다. 데이터 문맥에서는 *historical data / tickets*(과거 데이터·티켓)처럼 **이전에 쌓인 기록**을 말합니다.

## 문제 속 쓰임
> Fine-tune the model on **historical** tickets so it learns the $500 threshold from past manager approvals and applies it.
> **과거** 티켓으로 모델을 파인튜닝해, 과거 관리자 승인 사례에서 $500 기준을 학습해 적용하게 한다

## 함께 쓰는 표현
- **historical data / records** : 과거 데이터 / 기록
- **historically** (부) 과거에는, 역사적으로

## 비교
- **historical** — 과거 기록의, 역사의 · **historic** — 역사적으로 중요한

## 시험 포인트
금액 한도처럼 **반드시 지켜야 하는 정책**을 과거 데이터로 **파인튜닝해 배우게** 하는 보기는 확률적이라 오답입니다. PreToolUse 훅처럼 코드로 강제하는 쪽이 정답입니다.
