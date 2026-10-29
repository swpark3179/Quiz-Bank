1. **(처리 과정의) 단계** — 파이프라인에서 차례로 거치는 한 구간
2. **(git) 변경을 스테이징하다** — 커밋에 넣을 변경을 올려 두다 (*staged changes*)

## 문제 속 쓰임
> Keep "any" but add a preprocessing **stage** that strips plain-text inputs out of the batch before dispatch to the subagent.
> `"any"` 는 유지하되, 서브에이전트로 보내기 전에 일반 텍스트 입력을 배치에서 걸러 내는 전처리 **단계**를 추가한다

## 함께 쓰는 표현
- **preprocessing stage** : 전처리 단계
- **at this stage** : 현 단계에서
- **staging environment** : 운영 전 시험용 환경

## 시험 포인트
잘못된 설정(`"any"`)은 그대로 두고 앞에 **단계를 덧붙여 우회하는** 보기는 오답입니다. 원인인 설정을 `"auto"` 로 바로잡는 최소한의 수정이 정답입니다.
