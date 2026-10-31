1. **(토큰의) 대상** — 이 토큰을 **받아 줄 서비스가 누구인지** 적은 값입니다. JWT의 `aud` 클레임이며, 받는 쪽은 자기가 대상이 아니면 토큰을 거부합니다
2. **청중, 독자** — 글·발표를 듣거나 읽는 사람입니다 (*target audience* 대상 독자)

## 문제 속 쓰임
> The exchange succeeds if the rule's **audience** matcher passes, because a single passing matcher is enough to accept a token.
> 규칙의 **audience(대상)** 매처가 통과하면 교환이 성공한다. 매처 하나만 통과하면 토큰을 받아들이기 때문이다.

## 함께 쓰는 표현
- **audience claim** : 토큰을 받을 대상을 적은 클레임 (`aud`)
- **subject claim** : 토큰의 주체를 적은 클레임 (`sub`)
- **target audience** : 대상 독자·청중

## 시험 포인트
페더레이션 규칙의 매처는 **모두 통과(AND)** 해야 합니다. *audience* 매처가 통과해도 `subject_prefix` 가 실패하면 교환은 거부되므로, "매처 하나면 충분하다"는 보기는 오답입니다.
