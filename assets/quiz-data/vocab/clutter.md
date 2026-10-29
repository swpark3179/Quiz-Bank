쓸모없는 것들이 잔뜩 쌓여 **어수선하게 만드는** 것, 또는 그 잡동사니입니다. 문제에서는 *cluttered* 로 "(컨텍스트가) 잡다한 출력으로 어지러워진"이라는 뜻입니다.

## 문제 속 쓰임
> Developers notice that after running it, the main session is **cluttered** with raw output and Claude's subsequent answers in that session degrade in quality.
> 개발자들은 이 스킬을 실행한 뒤 메인 세션이 원본 출력으로 **어수선해지고**, 그 세션에서 Claude가 이후에 내놓는 답변의 품질이 떨어진다는 것을 알아챘습니다.

## 함께 쓰는 표현
- **cluttered context** : 잡다한 내용으로 어지러운 컨텍스트
- **reduce clutter** : 어수선함을 줄이다

## 시험 포인트
장황한 탐색 출력이 메인 컨텍스트를 어지럽히면 **격리**가 정답입니다 — 스킬 frontmatter 의 `context: fork` 나 서브에이전트 위임으로 결과만 돌려받습니다. 더 큰 창·사후 요약 지시는 오답입니다.
