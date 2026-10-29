**목록에 적힌 것만 통과시키고** 나머지는 막는 방식입니다. 예전 용어 *whitelist* 를 대신하는 말입니다.

## 문제 속 쓰임
> Expand the regex **allowlist** of closing phrases so it also matches every polite sign-off variant the model might emit.
> 마무리 문구 정규식 **허용 목록**을 넓혀, 모델이 낼 수 있는 모든 정중한 맺음말 변형까지 매칭되게 한다

## 반대말
- **denylist** (blocklist) — 목록에 적힌 것만 막는 방식

## 시험 포인트
맺음말 문구를 정규식 허용 목록으로 찾아 루프를 끝내는 방식은 버그를 만든 **취약한 텍스트 파싱** 그 자체입니다. 종료는 **`stop_reason`** 으로 판단합니다.
