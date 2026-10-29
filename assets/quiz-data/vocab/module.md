코드를 **기능 단위로 나눠 묶은 하나의 단위**입니다. 파일 하나일 수도 있고, 여러 파일로 된 패키지일 수도 있습니다.

## 문제 속 쓰임
> Run a mapping pass enumerating the repository's real **modules**, then dynamically spawn one subagent per discovered component
> 저장소의 실제 **모듈을** 열거하는 매핑 단계를 먼저 실행한 뒤, 발견된 구성 요소마다 서브에이전트를 하나씩 동적으로 생성한다

## 함께 쓰는 표현
- **module boundary** : 모듈 경계
- **import a module** : 모듈을 가져오다
- **modular** (형) 모듈식의, 부품처럼 나뉜

## 시험 포인트
구조를 모르는 레거시 코드에서 일부 영역이 빠진다면, 고정 목록 대신 **실제 모듈을 먼저 매핑하고** 발견된 구성 요소 기준으로 동적으로 나누는 보기가 정답입니다.
