1. **심각한, 치명적인** — 심각도 등급의 최상위 (*critical bug*)
2. **비판적인** — 그대로 믿지 않고 따져 보는 (*review critically*)
3. **매우 중요한, 결정적인** — *critical path*, *business-critical*

## 문제 속 쓰임
> ...a shell gate script greps stdout for the word "**CRITICAL**" to fail the build.
> 셸 게이트 스크립트가 stdout에서 "**CRITICAL**" 이라는 단어를 grep해 빌드를 실패시킵니다.
> Instruct the generating session to "review **critically** and assume the code contains bugs"...
> 생성 세션에 "**비판적으로** 리뷰하고 코드에 버그가 있다고 가정하라"라고 지시한다...

## 함께 쓰는 표현
- **critical defect / issue** : 치명적 결함·이슈
- **critical path** : 전체 일정을 좌우하는 핵심 경로

## 시험 포인트
CI 게이트가 출력 속 단어를 grep하면 표현이 바뀔 때마다 흔들립니다. `--output-format json` + `--json-schema` 로 **심각도를 정해진 필드 값으로** 받는 것이 정답입니다. 자기 코드 리뷰에는 "비판적으로 보라"는 지시보다 **독립된 리뷰 인스턴스**가 정답입니다.
