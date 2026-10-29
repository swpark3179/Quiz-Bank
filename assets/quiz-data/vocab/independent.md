다른 것에 **기대거나 묶이지 않고 따로 성립하는** 것입니다. 작업 사이에서는 "서로 결과를 기다릴 필요가 없다", 리뷰어에게는 "생성 과정과 컨텍스트를 공유하지 않는다"는 뜻이 됩니다.

## 문제 속 쓰임
> The coordinator dispatches three **independent** regional web-search subagents (EU, US, APAC)...
> 코디네이터가 서로 **독립적인** 지역별 웹 검색 서브에이전트 세 개(EU, US, APAC)에 작업을 배분한다
> ...so that it **independently** establishes and verifies the account...
> **스스로** 계정을 확인하고 검증하게 한다

## 함께 쓰는 표현
- **independent tasks** : 서로 독립적인 작업 → 병렬 실행 가능
- **independent instance / reviewer** : 생성 세션과 분리된 인스턴스·리뷰어
- **independently** (부) 따로, 스스로

## 시험 포인트
서로 **독립적인** 하위 작업은 한 응답에서 위임 호출을 함께 내보내 **병렬로** 돌리는 것이 정답입니다. 또 자기 결과물 리뷰는 **독립 인스턴스**에 맡기는 것이 정답 신호입니다.
