1. **변수** — 값을 담아 두고 이름으로 참조하는 것 (*environment variable* 환경 변수)
2. **변하기 쉬운, 일정하지 않은** (형) — *variable output* 들쭉날쭉한 출력

## 문제 속 쓰임
> Configure commands via environment **variables** in the CI pipeline
> CI 파이프라인의 환경 **변수**로 커맨드를 설정한다
> Store the confirmed customer record in a global **variable** that the SDK automatically injects...
> 확인된 고객 레코드를 전역 **변수**에 저장해, SDK가 자동으로 주입하게 한다...

## 함께 쓰는 표현
- **environment variable** : 환경 변수 — `${GITHUB_TOKEN}` 처럼 실행 환경에서 넣는 값
- **global variable** : 전역 변수

## 시험 포인트
서브에이전트는 코디네이터의 맥락을 자동으로 물려받지 않습니다. "전역 변수·공유 메모리로 자동 주입"을 전제로 한 보기는 오답이고, 필요한 사실은 **Task 프롬프트에 명시적으로** 넣어야 합니다.
