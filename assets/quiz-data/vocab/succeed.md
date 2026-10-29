1. **성공하다** — 시도한 일이 원하는 결과를 낸다 (*succeed in ~ing*)
2. **(뒤를) 잇다** — 다음 차례로 이어받다 (*succeeding steps* 뒤이은 단계)

## 문제 속 쓰임
> ...since repeated attempts eventually **succeed** for most declined refunds in the logs.
> 로그상 거절된 환불 대부분이 반복 시도하면 결국 **성공하므로**

## 함께 쓰는 표현
- **eventually succeed** : 결국 성공하다
- **success** (명) 성공 · **successful** (형) 성공한

## 반대말
- **fail** — 실패하다

## 시험 포인트
한도 초과처럼 **비즈니스 규칙에 따른 거절**은 재시도한다고 성공할 일이 아닙니다. `isRetryable: false` 같은 구조화된 오류로 재시도를 멈추고 에스컬레이션하는 보기가 정답입니다.
