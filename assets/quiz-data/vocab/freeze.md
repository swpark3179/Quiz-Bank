움직이거나 바뀌지 않도록 **그 상태로 고정한다**는 말입니다. 소프트웨어에서는 버전·설정·코드를 더 바꾸지 않기로 묶어 두는 것(*code freeze*)을 가리키며, *frozen* 은 "고정된, 동결된"입니다.

## 문제 속 쓰임
> Keep the alias, because an alias is **frozen** permanently once its minor version has been released.
> 별칭은 마이너 버전이 출시되면 영구히 **고정되므로** 별칭을 유지한다.

## 함께 쓰는 표현
- **code freeze** : (릴리스 전) 코드 변경 동결
- **frozen until** ~ : ~까지 동결된

## 비슷한 말 · 반대말
- **pin** — (정확한 버전을) 고정하다
- **unfreeze / thaw** — 동결을 풀다

## 시험 포인트
별칭이 *frozen* 이라는 보기는 함정입니다. 4.6 이전 모델의 별칭은 최신 날짜 스냅숏을 가리키는 포인터라 바뀔 수 있으므로, 변경 통제가 필요하면 `claude-haiku-4-5-20251001` 같은 **정확한 스냅숏 ID로 고정**합니다.
