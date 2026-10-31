1. **(모델) 스냅숏** — 특정 날짜에 **고정된 모델 버전**입니다. `claude-haiku-4-5-20251001` 처럼 날짜가 붙은 ID 로 가리키며, 그 ID 가 있는 동안 기반 모델이 바뀌지 않습니다
2. **그 시점의 사본** — 어떤 순간의 상태를 그대로 찍어 둔 복사본 (*database snapshot*)

## 문제 속 쓰임
> Pin the full **snapshot** ID `claude-haiku-4-5-20251001` and change it only through a planned, reviewed migration.
> 전체 **스냅숏** ID `claude-haiku-4-5-20251001` 로 고정하고, 계획되고 검토된 마이그레이션을 통해서만 바꾼다.

## 함께 쓰는 표현
- **pin a snapshot** : 특정 스냅숏으로 고정하다
- **dated snapshot** : 날짜가 붙은 스냅숏
- **latest snapshot** : 가장 최근 스냅숏

## 비슷한 말 · 반대말
- **alias** — 별칭. 4.6 이전 모델의 `claude-haiku-4-5` 같은 별칭은 최신 스냅숏을 가리키는 포인터라 바뀔 수 있습니다

## 시험 포인트
"검토 없이 모델이 바뀌면 안 된다"는 규정·감사 조건이 붙으면 **정확한 스냅숏 ID 로 고정**하는 것이 정답입니다. 응답의 `model` 필드를 사후에 감시하는 것은 통제가 아닙니다.
