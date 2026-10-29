같은 명령·검색·프롬프트를 **한 번 더 실행하는** 것입니다. 과거형은 *re-ran*, 과거분사는 *re-run* 입니다.

## 문제 속 쓰임
> Those subagents return results that contradict the confirmed account — some even **re-run** get_customer and pick a different customer match.
> 이 서브에이전트들이 확인된 계정과 모순되는 결과를 돌려주고, 일부는 `get_customer` 를 **다시 실행해** 다른 고객과 매칭하기까지 한다.

## 함께 쓰는 표현
- **re-run the searches** : 검색을 다시 실행하다
- **re-run from scratch** : 처음부터 다시 실행하다
- **rerun** : 하이픈 없이 쓰는 같은 말

## 시험 포인트
서브에이전트가 이미 확인된 것을 **다시 실행해** 찾는다면 원인은 "서브에이전트는 코디네이터의 컨텍스트를 상속하지 않는다"입니다. 확인된 사실을 **Task 프롬프트에 명시적으로 넣는** 보기가 정답입니다. 반대로 이전 결과가 낡았다면 검색을 다시 돌리는 것이 맞습니다.
