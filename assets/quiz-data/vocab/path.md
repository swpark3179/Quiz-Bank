1. **(파일) 경로** — `src/orders/api.ts` 처럼 파일 위치를 나타내는 문자열
2. **(일이 흘러가는) 길, 경로** — *happy path*, *escalation path* 처럼 처리가 진행되는 길

## 문제 속 쓰임
> ...and proposes edits against **paths** that no longer exist.
> 더는 존재하지 않는 **경로**를 대상으로 수정을 제안한다.

## 함께 쓰는 표현
- **file path** : 파일 경로
- **relative / absolute path** : 상대 / 절대 경로
- **happy path** : 문제 없이 흘러가는 기본 경로

## 시험 포인트
코드가 바뀐 뒤 `--resume` 으로 재개한 세션이 낡은 도구 결과로 없는 경로를 다룬다면, **새 세션을 열고 이전 결론 요약만 주입**하는 보기가 정답입니다.
