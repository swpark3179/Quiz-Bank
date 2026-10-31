여러 대상의 성능을 **같은 조건에서 비교하려고 만든 기준 테스트(세트)** 입니다. 공개 순위표의 *public benchmarks* 와, 내 사용 사례로 만든 평가 세트(*eval*)를 구분해 읽어야 합니다.

## 문제 속 쓰임
> Compare list prices → pick the cheapest candidate → try it with real prompts → build a **benchmark** only if problems appear
> 목록 가격을 비교한다 → 가장 싼 후보를 고른다 → 실제 프롬프트로 써 본다 → 문제가 생길 때만 **벤치마크**를 만든다

## 함께 쓰는 표현
- **benchmark tests** : 벤치마크 테스트
- **public benchmarks** : 공개 벤치마크 (리더보드)
- **eval set** : 내 사용 사례로 만든 평가 세트

## 시험 포인트
모델 변경 순서 문항의 정답은 **"사용 사례 벤치마크 먼저 → 실제 데이터로 실행 → 품질 비교 → 비용은 마지막"** 입니다. 두 모델이 모두 품질 기준을 넘었다면 공개 *benchmarks* 순위가 아니라 자기 평가 세트의 **완료 작업당 비용**으로 고릅니다.
