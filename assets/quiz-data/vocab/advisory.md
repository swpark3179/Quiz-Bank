따르면 좋지만 **지키도록 강제되지는 않는 권고·참고용**이라는 뜻입니다. *enforcement*(강제)와 대비해서 자주 씁니다.

## 문제 속 쓰임
> Claude Code follows the instruction and commits to main — `CLAUDE.md` is **advisory** context, not enforcement
> Claude Code는 (사용자의) 지시를 따라 main에 커밋한다 — `CLAUDE.md` 는 **권고용** 컨텍스트일 뿐 강제 장치가 아니다

## 함께 쓰는 표현
- **advisory only** : 참고용일 뿐인
- **security advisory** : 보안 권고문 (취약점 공지)

## 비교
- **advisory** — 모델이 읽고 따르려 하지만 어길 수도 있음 (CLAUDE.md, 시스템 프롬프트)
- **enforced** — 하네스가 막아서 어길 수 없음 (hooks, `permissions.deny`)

## 시험 포인트
CLAUDE.md 는 강제되지 않아 **사용자의 직접 지시가 우선**할 수 있습니다. 반드시 막아야 하는 동작은 hook 이나 권한 deny 규칙 같은 **강제 장치**로 처리합니다.
