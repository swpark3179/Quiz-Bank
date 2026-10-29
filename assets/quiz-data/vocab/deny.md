1. **(권한·요청을) 거부하다, 허용하지 않다** — 설정의 *deny* 규칙은 특정 동작을 막는 규칙
2. **부인하다** — 사실이 아니라고 말하다

## 문제 속 쓰임
> Add **deny** rules in the `permissions` section of `settings.json`
> `settings.json` 의 `permissions` 섹션에 **deny**(거부) 규칙을 추가한다
> Claude Code refuses — `CLAUDE.md` rules are enforced like permission **denials**
> Claude Code는 거부한다 — `CLAUDE.md` 규칙은 권한 **거부**처럼 강제된다

## 함께 쓰는 표현
- **deny rule / deny list** : 거부 규칙·목록 (`permissions.deny`)
- **allow / deny** : 허용 / 거부
- **denial** (명) 거부 · **denied** (형) 거부된

## 시험 포인트
CLAUDE.md는 권한 거부처럼 **강제되지 않는 컨텍스트**입니다. 반드시 막아야 하는 명령은 `settings.json` 의 **deny 규칙**이나 **`PreToolUse` 훅**으로 결정적으로 차단합니다.
