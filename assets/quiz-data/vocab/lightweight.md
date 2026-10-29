무게가 **가벼운** 것에서 나와, 시스템에서는 **자원·비용·복잡도가 적게 드는** 것을 말합니다.

## 문제 속 쓰임
> Run a **lightweight** intent classifier over each assistant message to decide whether the turn is a genuine completion.
> 어시스턴트 메시지마다 **경량** 의도 분류기를 돌려, 그 턴이 진짜 완료인지 판단한다

## 함께 쓰는 표현
- **lightweight model / check** : 가벼운 모델 / 검사
- **lightweight fix** : 간단한 수정

## 반대말
- **heavyweight** — 무겁고 큰
- **over-engineered** — 과잉 설계된

## 시험 포인트
"가벼운" 분류기라도 **컴포넌트를 하나 더 붙이는** 보기는 대개 오답입니다. `stop_reason` 처럼 이미 있는 결정적 신호를 쓰는 쪽이 정답입니다.
