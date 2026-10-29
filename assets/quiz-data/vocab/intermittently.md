**늘 그런 것이 아니라 가끔씩, 불규칙하게** 일어나는 것입니다. 재현이 잘 안 되는 버그나 오류를 설명할 때 자주 씁니다.

## 문제 속 쓰임
> **Intermittently** the synthesis subagent uses that phrase mid-analysis, halting the workflow.
> **간헐적으로** 합성 서브에이전트가 분석 도중에 이 문구를 쓰면서 워크플로가 중단된다.

## 함께 쓰는 표현
- **fail intermittently** : 간헐적으로 실패하다
- **intermittent** (형) 간헐적인 (*intermittent errors* 간헐적 오류)

## 비슷한 말
- **occasionally**, **sometimes** — 가끔 (불규칙성을 강조하지 않음)
- **flaky** — (테스트·게이트의) 결과가 들쭉날쭉한

## 시험 포인트
특정 문구가 나오면 루프를 끝내는 방식은 그 문구가 중간에 *간헐적으로* 나오면 바로 깨집니다. 종료는 **`stop_reason`** 으로 판단하는 것이 정답입니다.
