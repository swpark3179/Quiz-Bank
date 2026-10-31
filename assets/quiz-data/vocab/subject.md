1. **(토큰의) 주체** — 인증 토큰이 **누구(어떤 계정·워크로드)를 나타내는지** 적은 값입니다. JWT 에서는 `sub` 클레임에 담깁니다
2. **주제, 대상** — 이야기·연구·이메일의 주제 (*subject line* 이메일 제목)
3. **(be subject to) ~의 적용을 받다** — 규칙·한도·검토의 대상이 된다 (*subject to rate limits*)

## 문제 속 쓰임
> The exchange is denied, because the prefix match is a literal string comparison and the staging **subject** does not start with the prod prefix.
> 교환이 거부된다. 접두어 일치는 문자 그대로의 문자열 비교이고, staging **주체**는 prod 접두어로 시작하지 않기 때문이다.

## 함께 쓰는 표현
- **sub claim** : 토큰의 주체를 담은 클레임
- **subject_prefix** : 주체가 이 문자열로 시작해야 한다는 매칭 조건
- **be subject to** ~ : ~의 적용을 받다

## 시험 포인트
`subject_prefix` 는 **문자 그대로의 접두어 비교**입니다. 끝의 `*` 는 접두어 뒤의 나머지만 허용하므로 `staging` 주체는 `prod:*` 규칙을 통과하지 못하고, 그것이 의도된 환경 격리입니다.
