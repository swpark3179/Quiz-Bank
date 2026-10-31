1. **(요청·설정을) 받아들여 지키다, 반영하다** — 시스템이 어떤 값이나 지시를 인정하고 실제로 그대로 적용한다 (*the setting is honored*)
2. **존중하다** — 사람·약속을 높이 여기고 지킨다 (*honor a commitment* 약속을 지키다)

## 문제 속 쓰임
> `inference_geo` is **honored** only inside the Message Batches API, so the Haiku calls must be resubmitted as an asynchronous batch job.
> `inference_geo` 는 Message Batches API 안에서만 **적용되므로**, Haiku 호출을 비동기 배치 작업으로 다시 제출해야 한다.

## 함께 쓰는 표현
- **be honored** : (설정·요청이) 받아들여지다, 적용되다
- **honor a request** : 요청을 들어주다

## 비슷한 말 · 반대말
- **respect / apply** — 존중하다 / 적용하다
- **ignore** — 무시하다

## 시험 포인트
`inference_geo` 가 Batches API 안에서만 *honored* 된다는 보기는 오답입니다. 이 필드는 동기 Messages API의 정식 파라미터이고, Haiku 4.5처럼 4.6 이전 모델에 보내면 무시되지 않고 **400 오류**가 납니다.
