**따로 떼어 내지 않고 그 자리에서 바로** 처리하는 것입니다. 에이전트 문제에서는 탐색 같은 작업을 서브에이전트에 맡기지 않고 **메인 세션 안에서 직접** 하는 것을 말합니다.

## 문제 속 쓰임
> Doing this discovery **inline** reads dozens of files and floods the main session with search output...
> 이 탐색을 **메인 세션에서 직접** 하면 수십 개 파일을 읽어 메인 세션이 검색 출력으로 넘쳐난다.

## 함께 쓰는 표현
- **do ~ inline** : ~을 그 자리(메인 흐름)에서 바로 하다
- **inline A into B** (동) : A의 내용을 (참조 대신) B에 직접 붙여 넣다
- **inline code** : 문장 중간에 넣은 짧은 코드 표기

## 비교
- **inline** — 메인 세션 안에서 직접
- **delegate to a subagent** — 별도 컨텍스트에 맡기고 요약만 받기

## 시험 포인트
장황한 탐색을 **inline 으로 하면** 메인 컨텍스트가 넘쳐 이후 품질이 떨어집니다. 정답은 **Explore 서브에이전트**에 탐색을 맡기고 간결한 결과만 돌려받는 것입니다.
