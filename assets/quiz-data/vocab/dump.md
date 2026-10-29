많은 양의 데이터·출력을 **정리 없이 한꺼번에 쏟아 내는** 것입니다. 명사로는 통째로 뽑아낸 결과물(*log dump*, *memory dump*)을 말합니다.

## 문제 속 쓰임
> ...Claude keeps auto-invoking it mid-session whenever dependency files come up, **dumping** roughly 4,000 lines of resolution output into unrelated refactoring sessions.
> Claude가 의존성 파일 이야기가 나올 때마다 이 스킬을 자동으로 호출해, 관계없는 리팩터링 세션에 약 4,000줄의 의존성 해석 출력을 **쏟아 낸다**.

## 함께 쓰는 표현
- **dump A into B** : A를 B에 통째로 쏟아붓다
- **log dump / data dump** : 로그·데이터를 통째로 뽑아낸 것

## 시험 포인트
수천 줄의 출력이 메인 컨텍스트에 **쏟아지는** 상황이면, 그 작업을 서브에이전트나 분리된 컨텍스트에서 돌려 **요약만 받거나**, 자동 호출을 막아(`disable-model-invocation`) 필요할 때만 실행하게 하는 보기가 정답 쪽입니다.
