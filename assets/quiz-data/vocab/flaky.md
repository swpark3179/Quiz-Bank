코드가 바뀌지 않았는데도 **실행할 때마다 통과했다 실패했다 하는** 불안정한 상태입니다. *flaky test*(가끔 실패하는 테스트)처럼 CI 에서 자주 쓰는 말입니다.

## 문제 속 쓰임
> The gate is **flaky** because Claude phrases severe findings differently each run — "severe issue," "major bug," "critical defect."
> Claude가 심각한 발견 사항을 실행할 때마다 "severe issue", "major bug", "critical defect"처럼 다르게 표현하기 때문에 게이트 결과가 **들쭉날쭉하다**.

## 함께 쓰는 표현
- **flaky test** : 가끔씩 실패하는 불안정한 테스트
- **flakiness** (명) 불안정성

## 시험 포인트
모델의 **자연어 출력을 grep 해서** 판정하면 결과가 흔들립니다. `--output-format json` + `--json-schema` 로 **구조화된 필드**를 출력해 게이트가 결정적으로 읽게 하는 보기가 정답이고, 프롬프트 강조·temperature 0·동의어 사전은 오답입니다.
