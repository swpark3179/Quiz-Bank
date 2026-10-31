말이나 글이 **군더더기 없이 짧고 간결한** 것을 말합니다. 필요한 것만 담았다는 긍정적인 뜻도 있지만, 사람 말투에서는 "퉁명스럽게 짧다"는 뉘앙스가 섞이기도 합니다.

## 문제 속 쓰임
> The requests should use low, because long-running agents need **terse** tool calls to stay inside their budget.
> 요청을 low 로 바꿔야 한다. 오래 실행되는 에이전트는 예산 안에 머물려면 **간결한** 도구 호출이 필요하기 때문이다.

## 함께 쓰는 표현
- **terse response** : 짤막한 응답
- **terse output** : 간결한 출력

## 비슷한 말 · 반대말
- **concise** — 간결한 (긍정적 뉘앙스가 더 강함)
- **verbose** — 장황한

## 시험 포인트
이 보기는 오답입니다. `low` effort 는 짧고 범위가 좁은 작업용이라 장시간 자율 코딩에서는 탐색·검증을 건너뛰어 품질이 떨어질 수 있습니다. 이 문제(Opus 4.8)의 코딩·에이전트 작업은 `xhigh` 로 시작하되 **직접 설정**해야 합니다.
