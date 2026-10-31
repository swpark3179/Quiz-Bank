여러 모델의 벤치마크 점수를 매겨 **순서대로 늘어놓은 공개 순위표**입니다. 일반적인 성능을 비교해 줄 뿐, **우리 사용 사례에서의 성능은 보여 주지 않습니다**.

## 문제 속 쓰임
> Read public **leaderboard** scores → switch production traffic → collect user complaints → roll back if complaints rise
> 공개 **리더보드** 점수를 읽는다 → 프로덕션 트래픽을 전환한다 → 사용자 불만을 모은다 → 불만이 늘면 롤백한다

## 함께 쓰는 표현
- **public leaderboard** : 공개 순위표
- **benchmark** : 성능을 재는 표준 테스트
- **top the leaderboard** : 순위표 1위에 오르다

## 비슷한 말 · 반대말
- **ranking** — 순위 (일반적인 말)
- **eval set** — 우리 사용 사례에 맞춘 평가 세트. 리더보드 대신 써야 하는 것

## 시험 포인트
모델 교체 절차에서 공개 리더보드를 첫 단계로 두는 보기는 **오답**입니다. 정답 순서는 사용 사례 벤치마크 구축 → 실제 프롬프트·데이터로 실행 → 품질 비교 → 비용 저울질입니다.
