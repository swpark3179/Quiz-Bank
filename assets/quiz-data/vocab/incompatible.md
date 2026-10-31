두 가지가 **서로 맞지 않아 함께 쓰거나 섞을 수 없는** 상태입니다. 소프트웨어에서는 버전·형식·코드 패턴이 달라 같이 동작하지 않을 때 씁니다.

## 문제 속 쓰임
> ...later files in the same migration used a different, **incompatible** pattern, forcing a second pass to reconcile them.
> 같은 마이그레이션의 뒤쪽 파일은 **호환되지 않는** 다른 패턴으로 변환돼, 두 번째 정리 작업이 필요해졌습니다.

## 함께 쓰는 표현
- **incompatible with** ~ : ~와 호환되지 않는, ~와 맞지 않는
- **backward compatible** : 하위 호환되는
- **compatibility** : 호환성

## 비슷한 말 · 반대말
- **compatible** — 호환되는 (반대말)
- **inconsistent** — 일관되지 않은. 하나의 기준을 지키지 못한 상태

## 시험 포인트
여러 파일이 서로 맞아야 하는 변경에서 패턴이 갈렸다면, **플랜 모드로 먼저 조사해 패턴 하나를 정하지 않고** 바로 실행한 것이 원인입니다. "퓨샷 예시는 분류 작업과 *incompatible* 하다"는 보기도 오답으로, 원인은 예시의 다양성 부족이었습니다.
