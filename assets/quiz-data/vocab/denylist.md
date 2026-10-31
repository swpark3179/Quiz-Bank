막을 대상을 적어 두고 **목록과 일치하는 것만 거부**하는 방식입니다. 목록에 없으면 막지 않을 뿐, **허용한다는 뜻은 아니라는** 점이 중요합니다.

## 문제 속 쓰임
> A developer writes a PreToolUse hook for Bash that checks each command against a short **denylist** and, when nothing matches, simply exits 0 without printing anything.
> 한 개발자가 Bash용 PreToolUse 훅을 작성한다. 명령을 짧은 **거부 목록**과 대조하고, 일치하는 것이 없으면 아무것도 출력하지 않고 exit 0으로 끝낸다.

## 함께 쓰는 표현
- **check against a denylist** : 거부 목록과 대조하다
- **deny rule / allow rule** : 거부 규칙 / 허용 규칙

## 비슷한 말 · 반대말
- **blocklist** — 같은 뜻
- **allowlist** — 허용 목록 (적힌 것만 허용)

## 시험 포인트
*denylist* 에 걸리지 않아 PreToolUse 훅이 출력 없이 exit 0으로 끝나면 **'결정 없음'이지 승인이 아닙니다**. 일반 권한 흐름이 그대로 적용되므로, allow 규칙이 없는 `npm publish` 는 Manual 모드에서 확인 프롬프트가 뜹니다.
