화면이나 사람의 입력 없이 **스크립트·자동화 환경에서 돌아가는** 실행 방식입니다. CI 파이프라인에서 브라우저나 CLI 도구를 돌릴 때 자주 씁니다.

## 문제 속 쓰임
> Switch to **headless** mode with --continue, passing explicit context summaries between batch invocations.
> `--continue` 로 **헤드리스** 모드로 전환하고, 배치 호출 사이에 명시적인 맥락 요약을 넘긴다.

## 함께 쓰는 표현
- **headless mode** : 헤드리스 모드
- **headless browser** : 화면 없이 돌아가는 브라우저 (자동화 테스트용)

## 비슷한 말 · 반대말
- **non-interactive** — 비대화형, 사람의 입력을 기다리지 않는
- **interactive** — 대화형, 사람이 입력하며 쓰는

## 시험 포인트
그럴듯한 이름에 속지 않아야 합니다. `CLAUDE_HEADLESS=true` 같은 환경 변수는 문서화된 기능이 아니며, Claude Code를 비대화형으로 돌리는 공식 방법은 `-p`(`--print`) 플래그입니다.
