멈췄던 작업·세션을 처음부터가 아니라 **멈춘 지점에서 다시 이어 가는** 것입니다. Claude Code 에서는 `--resume` 으로 이전 세션을 대화 기록째 다시 엽니다.

## 문제 속 쓰임
> The **resumed** agent replays cached Read and Grep results from the old history and proposes edits against paths that no longer exist.
> **재개된** 에이전트는 옛 기록에 남아 있는 `Read`·`Grep` 결과를 그대로 재사용해, 더는 존재하지 않는 경로를 대상으로 수정을 제안합니다.

## 함께 쓰는 표현
- **resume a session** : 세션을 재개하다
- **resume where it left off** : 멈춘 곳에서부터 이어 가다

## 비교
- **resume** — 기존 기록을 그대로 이어 씀
- **fork** — 기존 기록을 복사해 갈라진 새 세션에서 따로 진행 (낡은 결과도 함께 복사됨)

## 시험 포인트
재개한 세션은 **예전 도구 결과까지 그대로 들고 옵니다**. 그사이 파일·데이터가 바뀌었다면 `--resume` 이나 fork 대신 **새 세션을 열고 이전 결론 요약만 넣은 뒤 다시 조회**하는 보기가 정답입니다.
