프로그램이 어떻게 동작할지 **설정 값을 정해 두는** 것입니다. 명사 *configuration* 과 줄임말 *config* 는 그 "설정(파일)"을 말합니다.

## 문제 속 쓰임
> Where and how should this be **configured**?
> 어디에, 어떻게 **설정해야** 합니까?

## 함께 쓰는 표현
- **configuration file / config file** : 설정 파일 (예: `settings.json`, `.mcp.json`)
- **configure A via B** : B로 A를 설정하다 (*Configure commands via environment variables*)
- **misconfigured** : 잘못 설정된

## 시험 포인트
"매번 **자동으로**" 실행돼야 하는 동작은 CLAUDE.md 지시가 아니라 `settings.json` 의 **hooks**(예: `PostToolUse`)로 설정해야 결정적으로 보장됩니다.
