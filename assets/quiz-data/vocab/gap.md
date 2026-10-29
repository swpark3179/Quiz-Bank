있어야 할 것이 **비어 있는 틈**입니다. 리서치에서는 아직 못 찾은 **빠진 정보**, 정책에서는 규정이 **다루지 않는 부분**을 가리킵니다.

## 문제 속 쓰임
> Logs show the document-analysis subagent attempting to invoke the web-search subagent directly to fill **gaps**, producing routing errors and duplicated searches.
> 로그를 보면 문서 분석 서브에이전트가 **빈 정보**를 채우려고 웹 검색 서브에이전트를 직접 호출하려 하고, 그 결과 라우팅 오류와 중복 검색이 발생한다.

## 함께 쓰는 표현
- **fill gaps / fill the gap** : 빈 곳을 채우다
- **coverage gap** : 다루지 못한 범위
- **policy gap** : 정책이 다루지 않는 부분

## 시험 포인트
서브에이전트가 빈 정보를 채우려고 **다른 서브에이전트를 직접 부르는** 것은 안티패턴입니다. 빈 정보를 코디네이터에 돌려보내고 **코디네이터가 후속 검색을 배분**하는 허브 앤 스포크가 정답입니다.
