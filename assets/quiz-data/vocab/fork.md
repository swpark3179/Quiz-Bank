지금 상태를 **그대로 복사해 갈래를 하나 더 만드는** 것입니다. 원본은 그대로 두고 복사본에서 다른 방향으로 작업을 이어 갈 수 있습니다. 원래 뜻은 "갈림길", "(식사용) 포크"입니다.

## 문제 속 쓰임
> **Fork** the session to branch off a divergent line of work and continue the refactor in the **forked** copy of the history.
> 세션을 **포크해** 갈라지는 작업 갈래로 분기하고, **포크된** 기록 사본에서 리팩터링을 이어 간다

## 함께 쓰는 표현
- **fork a session** : 세션을 포크하다 (Agent SDK 의 `fork_session`)
- **context: fork** : 스킬을 격리된 컨텍스트에서 실행하는 frontmatter 설정
- **fork a repo** : 저장소를 복제해 내 저장소로 만들다

## 시험 포인트
**같은 기반 상태에서 서로 다른 갈래**가 필요하면 포크, 같은 작업을 이어 가는데 기록만 길어졌다면 `/compact`, 이전 결과가 낡았다면 **새 세션 + 요약 주입**이 정답입니다. 이 셋의 구분이 자주 나옵니다.
