운영 중에 **예기치 않게 일어나 대응이 필요한 사건**입니다. 일상어로는 '사건'이지만, IT 운영·보안 문맥에서는 서비스 장애나 보안 사고를 가리킵니다.

## 문제 속 쓰임
> In an **incident**, the `mark_verified` tool executed ... but due to a software bug the `is_verified` flag was incorrectly set to `true`.
> 한 **사고**에서 `mark_verified` 도구가 실행됐지만, 소프트웨어 버그로 `is_verified` 가 잘못 `true` 로 설정됐습니다.

## 함께 쓰는 표현
- **production incident** : 운영(프로덕션) 장애
- **incident response** : 사고 대응
- **security incident** : 보안 사고

## 비슷한 말 · 반대말
- **outage** — 서비스 중단. 장애 중에서도 서비스가 멈춘 경우
- **accident** — 우연한 사고 (주로 물리적인 사고)

## 시험 포인트
*In an incident, ...* 는 실제로 일어난 실패를 보여 주고 **같은 유형의 재발을 막는 설계**를 묻는 신호입니다. 사후 복구나 더 큰 모델이 아니라, 실행 전에 도구 입력을 **결정적으로 검사**하는 쪽이 정답이었습니다.
