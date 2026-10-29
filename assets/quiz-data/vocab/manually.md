자동화된 장치가 아니라 **사람이 직접** 실행·처리하는 것입니다. 형용사는 *manual*(수동의).

## 문제 속 쓰임
> Create a custom slash command `/lint` that the developer runs **manually** after edits
> 개발자가 편집 후 **수동으로** 실행하는 `/lint` 커스텀 슬래시 커맨드를 만든다

## 함께 쓰는 표현
- **run manually** : 수동으로 실행하다
- **manual review** : 사람이 직접 하는 검토
- **manual step** : 사람이 손으로 해야 하는 단계

## 반대말
- **automatically** — 자동으로 (*auto-invoke* 자동 호출)

## 시험 포인트
"편집할 때마다 **반드시** 린트" 같은 요구에 사람이 수동으로 실행하는 커맨드는 빠뜨릴 수 있어 오답이고, `PostToolUse` 훅처럼 결정적으로 실행되는 장치가 정답입니다. 반대로 스킬을 **수동으로만** 실행하게 하려면 `disable-model-invocation: true` 를 씁니다.
