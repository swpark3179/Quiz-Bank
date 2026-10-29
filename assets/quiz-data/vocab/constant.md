1. **(프로그래밍) 상수** — 값이 바뀌지 않도록 이름을 붙여 둔 값 (예: `MAX_RETRIES`)
2. **(형) 끊임없는, 일정한** — 계속되거나 변하지 않는

## 문제 속 쓰임
> The agent is asked to rename a shared **constant** throughout a generated client file.
> 에이전트에게 생성된 클라이언트 파일 전체에서 공유 **상수**의 이름을 바꾸라는 요청이 들어왔습니다.

## 함께 쓰는 표현
- **define a constant** : 상수를 정의하다
- **constant time** : (알고리즘) 상수 시간, O(1)
- **constantly** (부) 끊임없이, 계속

## 시험 포인트
같은 문자열이 여러 줄에 있어 `Edit` 이 고유하지 않은 일치로 실패하고 주변 문맥으로도 특정할 수 없다면, 파일 전체를 **`Read` 한 뒤 `Write` 로 다시 쓰는** 것이 정석 폴백입니다.
