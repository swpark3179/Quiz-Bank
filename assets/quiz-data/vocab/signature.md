1. **서명** — 암호학에서 데이터가 **위·변조되지 않았는지 확인하는 값**입니다. 받는 쪽이 서명을 검증해 내용이 원본 그대로인지 확인합니다
2. **(함수) 시그니처** — 함수의 이름·인자·반환형을 묶은 겉모양 (*function signature*)

## 문제 속 쓰임
> ...(c) carries the integrity **signature**; (d) adds to the thinking field
> ...(c) 무결성 **서명**을 전달, (d) thinking 필드에 추가

## 함께 쓰는 표현
- **signature_delta** : 스트리밍에서 thinking 블록의 서명을 전하는 델타
- **integrity signature** : 무결성 서명
- **verify a signature** : 서명을 검증하다

## 시험 포인트
`signature_delta` 는 thinking 블록의 **마지막 델타**(`content_block_stop` 직전)로 무결성 검증용입니다. 메시지 전체의 끝(`message_stop`)이나 `stop_reason` 과 헷갈리지 마세요. 멀티턴·도구 사용에서 thinking 블록을 돌려보낼 때 이 서명이 그대로 있어야 합니다.
