여러 항목을 **서로 비교해 1등부터 순서를 매기는** 것을 말합니다. 각 항목에 따로 점수를 주는 *rate* 와 달리, *rank* 는 항목끼리의 앞뒤 순서가 핵심입니다.

## 문제 속 쓰임
> Keep one pass over the diff, but have the model **rank** the files by risk first, then spend its review effort on the highest-risk ones
> 한 패스는 유지하되, 모델이 먼저 위험도로 파일 **순위를 매기고** 가장 위험한 파일에 리뷰 노력을 쏟게 한다.

## 함께 쓰는 표현
- **rank** A **by** B : B 기준으로 A 의 순위를 매기다
- **ranked summary / list** : 순위대로 정리한 요약·목록
- **ranking rubric** : 순위 평가 기준

## 비슷한 말 · 반대말
- **prioritize** — 우선순위를 정하다
- **rate / score** — 항목마다 점수를 매기다 (순서가 아니라 값)

## 시험 포인트
이 보기는 오답입니다. 한 패스 안에서 순위를 매겨도 40개 파일이 **같은 희석된 컨텍스트**에 남고, 순위가 낮은 파일에는 노력이 덜 갑니다. 정답은 **파일별 패스 + 파일 간 상호작용을 보는 통합 패스**입니다.
