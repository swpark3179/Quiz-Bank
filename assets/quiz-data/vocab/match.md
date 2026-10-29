1. **(조건·패턴과) 일치하다, 맞다** — 문자열이 지정한 패턴과 같거나, 훅 설정이 특정 도구에 걸리는 것
2. **일치하는 것, 일치 결과** — 검색에서 찾아낸 항목 (*multiple matches* 여러 건 일치)

## 문제 속 쓰임
> Add a `PostToolUse` hook in `settings.json` **matching** the `Write` tool that runs `npm run lint:fix`
> `settings.json` 에 `Write` 도구와 **매칭되는** `PostToolUse` 훅을 추가해 `npm run lint:fix` 를 실행한다
> `stop_sequence` — a custom stop string was **matched**
> `stop_sequence` — 지정한 중단 문자열과 **일치했다**

## 함께 쓰는 표현
- **exact match** : 정확히 일치
- **pattern matching** : 패턴 매칭
- **match against** ~ : ~와 대조해 맞춰 보다

## 시험 포인트
모델이 쓴 **문장을 문자열 매칭해서** 루프 종료나 도구 호출을 판단하는 보기는 오답입니다. 계속·종료는 `stop_reason`, 빌드 판정은 구조화된 출력처럼 **결정적인 필드**로 판단합니다.
