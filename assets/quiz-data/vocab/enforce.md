규칙·형식을 **부탁이 아니라 강제로 지키게 만드는** 것입니다. 시험에서는 프롬프트 지시처럼 *어길 수도 있는* 방법과 대비해, *구성·코드 수준에서 확실히 보장하는* 방법을 가리킬 때 씁니다.

## 문제 속 쓰임
> Use CLI flags `--output-format json` and `--json-schema` to **enforce** structured findings.
> CLI 플래그 `--output-format json` 과 `--json-schema` 로 구조화된 결과 출력을 **강제한다**.

## 함께 쓰는 표현
- **enforce a rule / policy** : 규칙·정책을 강제하다
- **strictly enforced** : 엄격히 적용되는
- **enforcement** (명) 강제, 시행

## 시험 포인트
정답은 자주 **강제(enforce)냐 유도(instruct)냐**에서 갈립니다. 반드시 지켜야 하는 형식·순서·권한이라면 프롬프트·CLAUDE.md 지시보다 **CLI 플래그·프로그램적 전제조건·도구 권한 제한**처럼 강제하는 보기를 고르세요.
