1. **(토큰) 버킷** — *token bucket*: 허용량이 정해진 주기에 한꺼번에 초기화되지 않고 **일정한 속도로 계속 다시 차오르는** 한도 방식입니다
2. **양동이, 묶음** — 무언가를 담는 통입니다. 클라우드에서는 파일을 담는 저장 단위(*S3 bucket*)도 이렇게 부릅니다

## 문제 속 쓰임
> A per-minute output-token limit, which the backoff clears as soon as the token **bucket** refills.
> 분당 출력 토큰 한도. 토큰 **버킷**이 다시 차면 백오프로 바로 풀린다.

> An agent runs in containers on AWS and needs to read one S3 **bucket** and call an internal billing API.
> AWS의 컨테이너에서 도는 에이전트가 S3 **버킷** 하나를 읽고 사내 결제 API를 호출해야 한다.

## 함께 쓰는 표현
- **token bucket** : 토큰 버킷 (계속 채워지는 한도)
- **refill** : 다시 차다

## 시험 포인트
분당 한도의 429는 *token bucket* 이 다시 차므로 백오프로 풀립니다. 반면 `retry-after` 없는 429가 몇 시간째 계속되면 등급 월 지출 상한이라 백오프로 해결되지 않습니다.
