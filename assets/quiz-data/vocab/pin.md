1. **(버전을) 고정하다** — 별칭처럼 최신을 자동으로 따라가지 않게, 정확한 버전 ID 를 지정해 묶어 둔다
2. **핀, 고정 표시** — 항목을 맨 위에 붙여 두는 것 (*pin a message* 메시지를 고정하다)

## 문제 속 쓰임
> ...(b) the model version **pinned** for every session; ...
> (b) 모든 세션에 **고정되는** 모델 버전

## 함께 쓰는 표현
- **pin a version / pin the model ID** : 버전·모델 ID 를 고정하다
- **pinned dependency** : 버전이 고정된 의존성
- **unpin** : 고정을 풀다

## 비슷한 말 · 반대말
- **lock** — 잠가 두다 (*lock file* 처럼 거의 같은 뜻)
- **alias** — 별칭. 최신 스냅숏을 따라가므로 고정과 반대 성격입니다

## 시험 포인트
모델이 검토 없이 바뀌면 안 된다면 별칭 `claude-haiku-4-5` 대신 스냅숏 ID `claude-haiku-4-5-20251001` 로 **pin** 하고, 변경은 계획된 마이그레이션으로만 합니다. 위 인용은 Managed Agents 에서 *environment* 의 역할로 잘못 짝지은 오답 보기입니다(모델은 agent 설정에서 정함).
