**treat A as B** 형태로 "A를 B로 **여기고 그렇게 다룬다**"는 뜻이 핵심입니다. 어떻게 해석하느냐가 곧 어떻게 처리하느냐가 됩니다.

## 문제 속 쓰임
> ...the model occasionally misreads these heterogeneous fields, e.g., **treating** a refund amount in the wrong units.
> 모델이 이런 이질적인 필드를 가끔 잘못 읽어, 예를 들어 환불 금액을 잘못된 단위로 **해석한다**.
> **Treat** every unsuccessful get_customer response, whatever its cause, as an escalation trigger...
> 원인과 관계없이 실패한 `get_customer` 응답을 모두 에스컬레이션 트리거로 **본다**

## 함께 쓰는 표현
- **treat A as B** : A를 B로 여기다·취급하다
- **treat A differently** : A를 다르게 다루다
- **treatment** (명) 대우, 처리 방식

## 시험 포인트
도구 출력의 형식이 섞여 모델이 잘못 읽는다면, 출력을 컨텍스트에 넣기 전에 `PostToolUse` 훅으로 **정규화**하는 것이 정답입니다. 원인과 상관없이 모든 실패를 똑같이 취급하는 보기는 오답입니다.
