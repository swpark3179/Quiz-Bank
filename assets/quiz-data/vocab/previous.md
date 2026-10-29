시간·순서상 **바로 앞의, 이전의** 것입니다.

## 문제 속 쓰임
> ...but issues each Task call only after the **previous** subagent returns.
> **앞선** 서브에이전트가 결과를 돌려준 뒤에야 다음 Task 호출을 보낸다.

## 함께 쓰는 표현
- **previous turn / step** : 이전 턴 / 단계
- **"Ignore previous instructions"** : 프롬프트 인젝션의 대표 문구
- **previously** (부) 이전에

## 시험 포인트
앞 호출이 끝나야 다음 호출을 보내면 순차 실행입니다. 독립 작업이면 **한 응답에 여러 Task 호출을 함께** 내보내 병렬로 돌리는 보기가 정답입니다.
