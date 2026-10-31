1. **무결성** — 데이터가 중간에 깨지거나 바뀌지 않고 **원래대로 온전한** 상태. 제약 조건 검사나 서명·체크섬으로 확인합니다
2. **정직성, 고결함** — 사람이 원칙을 지키는 성품 (*academic integrity* 학업 윤리)

## 문제 속 쓰임
> ...a long prompt field describing SQL best practices, rollback strategy, and data **integrity** checks.
> SQL 모범 사례, 롤백 전략, 데이터 **무결성** 검사를 설명하는 긴 `prompt` 필드

## 함께 쓰는 표현
- **data integrity** : 데이터 무결성
- **integrity check** : 무결성 검사
- **integrity signature** : 위·변조 여부를 확인하는 무결성 서명

## 비슷한 말 · 반대말
- **corruption** — (데이터) 손상. 무결성이 깨진 상태

## 시험 포인트
스트리밍의 `signature_delta` 는 사고(thinking) 블록의 **무결성 서명**을 담아 `content_block_stop` 직전에 한 번 옵니다. 멀티턴·도구 사용에서 사고 블록을 돌려보낼 때 이 서명이 그대로 있어야 합니다.
