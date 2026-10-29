1. **저장하다, 보관하다** — 나중에 다시 쓰려고 어딘가에 넣어 둔다
2. **저장소** — 데이터를 넣어 두는 곳 (*key-value store*)

## 문제 속 쓰임
> **Store** the confirmed customer record in a global variable that the SDK automatically injects into every spawned subagent's context at startup.
> 확인된 고객 레코드를 전역 변수에 **저장해**, SDK가 생성되는 모든 서브에이전트의 컨텍스트에 시작 시점에 자동으로 주입하게 한다
> ...then overwrite the **stored** summary with the fresh results.
> ...**저장된** 요약을 새 결과로 덮어쓴다

## 함께 쓰는 표현
- **store A in B** : A를 B에 저장하다
- **storage** (명) 저장 공간, 저장소

## 시험 포인트
서브에이전트에 자동으로 주입되는 전역 변수·공유 메모리는 없습니다. 서브에이전트에게 필요한 사실은 **위임 프롬프트에 명시적으로** 넣어야 합니다.
