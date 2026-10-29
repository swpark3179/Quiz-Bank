정도가 **아주 심한, 심각한** 상태를 나타냅니다. 명사 *severity* 는 "심각도"입니다.

## 문제 속 쓰임
> The gate is flaky because Claude phrases **severe** findings differently each run — "severe issue," "major bug," "critical defect."
> Claude가 **심각한** 발견 사항을 실행할 때마다 "severe issue", "major bug", "critical defect"처럼 다르게 표현하기 때문에 게이트 결과가 들쭉날쭉합니다.

## 함께 쓰는 표현
- **severe issue / bug** : 심각한 문제 / 버그
- **severely** (부) 심하게

## 시험 포인트
자유 문장을 grep 해서 심각도를 판정하면 표현이 바뀔 때마다 깨집니다. `--output-format json` 과 `--json-schema` 로 **심각도를 정해진 필드 값으로** 받게 하는 보기가 정답이고, temperature 0 이나 동의어 사전은 오답입니다.
