잘 모르는 곳을 **두루 살펴보며 탐색하다** 라는 뜻입니다. Claude Code 에서 *Explore* 는 코드베이스를 읽고 검색하는 데 쓰는 **탐색용 서브에이전트** 이름이기도 합니다.

## 문제 속 쓰임
> Delegate discovery to an **Explore** subagent that returns only a summary of call sites, keeping the main context for edits.
> 탐색을 **Explore** 서브에이전트에 위임해 호출 지점 요약만 돌려받고, 메인 컨텍스트는 편집에 쓴다

## 함께 쓰는 표현
- **explore the codebase** : 코드베이스를 살펴보다
- **explore options / alternatives** : 여러 선택지를 검토하다
- **exploration** (명) 탐색 · **exploratory** (형) 탐색용의

## 시험 포인트
수십 개 파일을 훑는 탐색은 **Explore 서브에이전트에 맡기고 요약만 받으면** 메인 컨텍스트가 깨끗하게 유지됩니다. 장황한 탐색 출력이 메인 대화를 채우는 상황의 단골 정답입니다.
