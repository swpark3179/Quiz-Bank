입력을 보고 **미리 정해 둔 범주 중 하나로 나누는** 모델·규칙입니다. 에이전트 설계에서는 요청을 먼저 분류해 **어느 도구·에이전트로 보낼지 정하는 별도 단계**로 등장합니다.

## 문제 속 쓰임
> Add a pre-routing **classifier** that determines whether the user references uploaded files or web content.
> 사용자가 업로드한 파일을 말하는지 웹 콘텐츠를 말하는지 판별하는 사전 라우팅 **분류기**를 추가한다.

## 함께 쓰는 표현
- **pre-routing / pre-processing classifier** : 본 처리 전에 요청을 분류해 보내는 분류기
- **classify** (동) 분류하다 · **classification** (명) 분류

## 시험 포인트
도구 선택·에스컬레이션 오류를 고치려고 **별도 classifier 를 추가하는** 선택지는 대개 오답입니다. 컴포넌트를 하나 더 늘리는 과한 해법이므로, 먼저 **도구 설명을 명확히 하거나 기준·few-shot 예시를 주는** 쪽이 정답입니다.
