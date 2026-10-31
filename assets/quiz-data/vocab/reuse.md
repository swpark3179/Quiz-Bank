이미 만들어 둔 것을 **새로 만들지 않고 다시 가져다 쓰는** 것입니다. 형용사 *reusable* 은 "여러 번 다시 쓸 수 있게 만든"이라는 뜻입니다.

## 문제 속 쓰임
> Add --continue so Claude Code **reuses** the previous session
> `--continue` 를 붙여 Claude Code 가 이전 세션을 **재사용**하게 한다.

## 함께 쓰는 표현
- **reuse a session** : 세션을 다시 쓰다
- **reusable configuration** : 재사용할 수 있는 설정
- **reuse across sessions** : 여러 세션에 걸쳐 재사용하다

## 비슷한 말 · 반대말
- **resume** — 멈춘 곳에서 이어 가다 (상태까지 이어받는 쪽)

## 시험 포인트
이 보기는 오답입니다. CI 작업이 멈추는 원인은 `claude "query"` 가 **대화형 세션**을 열기 때문이고, 해결은 `-p` 입니다. `--continue` 는 최근 대화를 이어 갈 뿐 비대화형으로 바꾸지 않습니다. 참고로 Managed Agents 에서 *reusable* 모델·프롬프트·도구 설정은 **agent** 입니다.
