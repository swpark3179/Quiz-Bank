어떤 동작을 **해도 되는지 허락하는 것**, 또는 그 허락 설정입니다. Claude Code 에서는 도구 사용을 허용(allow)·거부(deny)하는 설정 규칙을 말합니다.

## 문제 속 쓰임
> Claude Code refuses — `CLAUDE.md` rules are enforced like **permission** denials
> Claude Code는 거부한다 — `CLAUDE.md` 규칙은 **권한** 거부처럼 강제된다.

## 함께 쓰는 표현
- **permission denial** : 권한 거부
- **grant / deny permission** : 권한을 주다 / 거부하다
- **permission mode** : (Claude Code) 권한 모드

## 시험 포인트
`CLAUDE.md` 는 강제력이 없는 **참고용 컨텍스트**라 이 보기는 오답입니다. 반드시 막아야 하면 `settings.json` 의 **deny 권한 규칙**이나 **훅** 같은 결정적 장치를 씁니다.
