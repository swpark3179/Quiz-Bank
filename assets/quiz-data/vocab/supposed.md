*be supposed to* 형태로 써서 **원래 ~하기로 되어 있다(그런데 실제로는 그렇지 않다)** 는 뉘앙스를 줍니다. 기대와 현실이 어긋날 때 자주 씁니다.

## 문제 속 쓰임
> A shared `generate-docs` skill is **supposed to** read source and write Markdown into `docs/`, but twice it has run `Edit` and shell `rm` and overwritten source files.
> 공유 `generate-docs` 스킬은 소스를 읽고 `docs/` 에 Markdown을 **써야 하는데**, 두 번이나 `Edit` 과 셸 `rm` 을 실행해 소스 파일을 덮어썼다.

## 함께 쓰는 표현
- **be supposed to** ~ : ~하기로 되어 있다, ~해야 한다
- **be not supposed to** ~ : ~하면 안 된다

## 시험 포인트
"원래 이것만 해야 하는데 지켜지지 않는다"면 프롬프트 문구 추가가 아니라 하네스가 막는 결정적 장치를 고릅니다. 이 문제에서는 스킬 frontmatter 의 `allowed-tools` 선언이 정답입니다.
