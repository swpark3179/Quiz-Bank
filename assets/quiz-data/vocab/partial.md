전체가 아니라 **일부만** 이루어진 상태를 말합니다. 오류 처리 문제에서는 실패하기 전까지 얻어 둔 결과, 즉 *부분 결과*를 뜻합니다.

## 문제 속 쓰임
> ...only propagate errors it cannot resolve to the coordinator, including what was attempted and any **partial** results.
> 스스로 해결하지 못한 오류만, 시도한 내역과 **부분** 결과를 함께 담아 코디네이터에 넘긴다.

## 함께 쓰는 표현
- **partial results** : 부분 결과
- **partial failure** : 일부만 실패한 상태
- **partially** (부) 부분적으로 · **partially completed** 일부만 완료된

## 반대말
- **complete**, **full**, **total** — 전부의, 완전한

## 시험 포인트
오류를 위로 넘길 때 **부분 결과를 버리지 않고 함께 전달**하는 보기가 정답인 경우가 많습니다. 다만 부분 결과를 *성공 상태로 포장*해 실패를 숨기는 보기는 오답입니다.
