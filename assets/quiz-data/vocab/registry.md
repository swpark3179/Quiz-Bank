쓸 수 있는 항목을 **한곳에 등록해 모아 둔 목록**입니다. *package registry*(npm 등), *tool registry*(시스템이 가진 도구 전체 목록)처럼 씁니다.

## 문제 속 쓰임
> The synthesis subagent is initialized with the full **registry** of 18 tools shared across the system...
> 합성 서브에이전트가 시스템 전체에서 공유하는 18개 도구 **레지스트리** 전부를 가진 채 초기화된다.

## 함께 쓰는 표현
- **tool registry** : 도구 목록(레지스트리)
- **package / container registry** : 패키지 / 컨테이너 이미지 저장소

## 시험 포인트
서브에이전트에 **전체 도구 레지스트리를 다 주면** 역할과 무관한 도구를 호출하고 도구 선택도 흐려집니다. **역할에 필요한 몇 개로 도구를 제한하는** 보기가 정답입니다.
