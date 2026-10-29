바깥 시스템과 **격리된 안전한 공간**에서 코드나 콘텐츠를 다루는 것입니다. 그 안에서 무슨 일이 일어나도 밖에 영향을 주지 않게 막는 것이 핵심입니다.

## 문제 속 쓰임
> ...use PreToolCall hooks and explicit content **sandboxing** to separate untrusted content
> PreToolCall 훅과 명시적 콘텐츠 **샌드박싱**으로 신뢰할 수 없는 콘텐츠를 분리한다

## 함께 쓰는 표현
- **sandboxed environment** : 격리된 실행 환경
- **run in a sandbox** : 샌드박스 안에서 실행하다

## 비슷한 말
- **isolate** — 격리하다
- **untrusted content** — 신뢰할 수 없는 (외부) 콘텐츠: 샌드박싱의 대상

## 시험 포인트
검색·업로드된 외부 콘텐츠의 지시를 모델이 따라 버리는 문제에서는 시스템 프롬프트를 더 세게 쓰는 보기가 오답입니다. 외부 콘텐츠를 지시와 **분리·표시**하고 민감한 동작은 훅으로 검증하는 구조적 방어가 정답입니다.
