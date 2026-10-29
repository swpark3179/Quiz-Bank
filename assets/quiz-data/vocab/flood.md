물이 넘치듯 **감당하기 힘들 만큼 많은 양**이 한꺼번에 밀려드는 것입니다. 문제에서는 장황한 검색·도구 출력이 **메인 세션의 컨텍스트를 가득 채우는** 상황에 씁니다.

## 문제 속 쓰임
> Done inline, this verbose discovery **floods** the main session's context and later steps degrade from lost-in-the-middle effects.
> 이 장황한 탐색을 메인 세션 안에서 바로 하면 메인 세션의 컨텍스트가 **넘쳐나고**, 이후 단계는 lost-in-the-middle 효과로 품질이 떨어진다.

## 함께 쓰는 표현
- **flood A with B** : A 를 B 로 가득 채우다 (*floods the main session with search output*)
- **a flood of** ~ : 엄청나게 많은 ~

## 비슷한 말
- **clutter** — 어수선하게 어지럽히다
- **pollute** — (컨텍스트를) 오염시키다

## 시험 포인트
탐색 출력이 메인 컨텍스트를 넘치게 한다면, 탐색을 **Explore 서브에이전트**(또는 스킬의 `context: fork`)로 격리하고 요약만 돌려받는 보기가 정답입니다.
