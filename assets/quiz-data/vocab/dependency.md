1. **의존 관계** — 한 부분이 동작하려면 다른 부분이 꼭 있어야 하는 관계 (모듈·서비스 사이)
2. **의존성 패키지** — 프로젝트가 가져다 쓰는 외부 라이브러리

## 문제 속 쓰임
> This will involve changes across dozens of files and requires decisions about service boundaries and module **dependencies**.
> 수십 개 파일에 걸친 변경이 필요하고, 서비스 경계와 모듈 **의존성**에 대한 결정이 요구된다.
> ...comprehensive code analysis—**dependency** scanning, test coverage calculation, and code quality metrics.
> **의존성** 스캔, 테스트 커버리지 계산, 코드 품질 지표 같은 종합 코드 분석.

## 함께 쓰는 표현
- **depend on** ~ : ~에 의존하다 · **dependent** (형) 의존하는
- **dependency scanning** : 외부 패키지의 취약점·버전을 검사하기
- **circular dependency** : 서로가 서로를 필요로 하는 순환 의존

## 시험 포인트
여러 파일과 의존 관계가 얽힌 대규모 변경이면, 바로 실행하기보다 **plan mode 로 먼저 탐색·설계**하는 보기가 정답입니다.
