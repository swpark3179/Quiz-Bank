미리 정한 순서를 따르지 않고 **입력이나 중간 결과를 보고 다음 행동을 그때그때 정하는** 성질입니다. 에이전트 설계에서는 하위 작업을 실행 중에 만들어 내는 방식을 가리킵니다.

## 문제 속 쓰임
> An **adaptive** agent that inspects each spec first and then generates subtasks based on what it finds
> 사양서를 먼저 살펴본 뒤 발견한 내용에 따라 하위 작업을 만드는 **적응형** 에이전트

## 함께 쓰는 표현
- **adaptive decomposition** : 적응형 분해 (하위 작업을 실행 중에 정함)
- **adapt to** ~ : ~에 맞추다, 적응하다

## 비슷한 말 · 반대말
- **fixed / predefined** — 고정된, 미리 정해진 (*fixed prompt chain* 고정 프롬프트 체인)

## 시험 포인트
단계와 순서가 미리 정해져 있고 입력 내용이 그것을 바꾸지 않으면 *adaptive* 보기는 오답입니다. 그때는 단계 사이에 코드 검사를 둔 **고정 프롬프트 체인**이 맞고, 적응형 분해는 다음 단계가 중간 발견에 달린 열린 조사에 씁니다.
