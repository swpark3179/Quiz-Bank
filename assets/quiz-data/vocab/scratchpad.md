작업하면서 **중간 메모·진행 상황을 적어 두는 임시 기록**입니다. 원래 "낙서장, 연습장"이라는 뜻입니다.

## 문제 속 쓰임
> Keep a **scratchpad** manifest of migrated vs pending files, updated after each file, so progress survives context growth.
> 마이그레이션 완료 파일과 대기 파일을 기록한 **scratchpad** 매니페스트를 두고 파일마다 갱신해, 컨텍스트가 커져도 진행 상황이 유지되게 한다

## 함께 쓰는 표현
- **scratchpad file** : 메모용 파일
- **progress manifest** : 진행 목록

## 시험 포인트
긴 작업에서 "무엇을 끝냈는지"를 대화 기억에 맡기면 중복·누락이 생깁니다. 진행 상황을 **디스크의 파일에 적고 매번 갱신**하는 보기가 정답이고, 더 큰 컨텍스트 모델이나 잦은 `/compact` 는 오답입니다.
