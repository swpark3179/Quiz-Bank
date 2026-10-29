앞서 나온 결과나 대화를 **이어받아 뒤따라 하는** 질문·작업·조치입니다. 하이픈을 붙인 *follow-up* 은 명사·형용사, 띄어 쓴 *follow up* 은 동사구("후속 조치를 하다")입니다.

## 문제 속 쓰임
> Use dynamic decomposition: the coordinator spawns **follow-up** subtasks as earlier findings reveal them
> 동적 분해를 쓴다. 앞선 발견이 새로운 하위 작업을 드러내면 코디네이터가 그에 맞는 **후속** 하위 작업을 생성한다

## 함께 쓰는 표현
- **follow-up question / message** : 후속 질문·메시지
- **follow-up search / task** : 후속 검색·작업
- **follow up on** ~ : ~에 대해 후속 조치를 하다

## 시험 포인트
중간 발견에 따라 계획이 바뀌는 조사에서는 **코디네이터가 후속 작업을 동적으로 만들어 배분**하는 보기가 정답이고, 서브에이전트끼리 직접 호출하는 구조는 오답입니다. 추출 검증이 실패하면 실패한 출력과 오류를 **follow-up 메시지**로 돌려주는 재시도가 정답 패턴입니다.
