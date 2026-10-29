충격·변화를 겪고도 **없어지지 않고 남아 있는** 것입니다. 기술 문맥에서는 데이터·상태가 재시작이나 컨텍스트 변화 **뒤에도 유지된다**는 뜻으로 씁니다.

## 문제 속 쓰임
> Keep a scratchpad manifest of migrated vs pending files, updated after each file, so progress **survives** context growth.
> 마이그레이션 완료 파일과 대기 파일을 기록한 scratchpad 매니페스트를 두고 파일마다 갱신해, 컨텍스트가 커져도 진행 상황이 **유지되게** 한다

## 함께 쓰는 표현
- **survive a restart / crash** : 재시작·장애 뒤에도 남다
- **survive compaction** : 압축(요약) 뒤에도 남다

## 시험 포인트
긴 작업에서 이미 한 일을 또 하거나 빠뜨린다면, 진행 상태를 대화 밖 **외부 파일**(매니페스트·scratchpad)에 두는 것이 정답입니다. 대화 기록은 요약·압축되면서 사라질 수 있기 때문입니다.
