상대를 해치거나 시스템을 악용하려는 의도가 담긴 것을 가리킵니다. 사람을 향하면 **폭언·괴롭힘**, 시스템을 향하면 **악용**(*abuse*)이라는 뜻이 됩니다.

## 문제 속 쓰임
> A marketplace chatbot wants to stop clearly **abusive** requests cheaply, before spending tokens on its large main model.
> 한 마켓플레이스 챗봇은 대형 메인 모델에 토큰을 쓰기 전에, 명백히 **악의적인** 요청을 저렴하게 걸러 내고 싶어 한다.

## 함께 쓰는 표현
- **abusive messages** : 폭언·괴롭힘이 담긴 메시지
- **abuse of** ~ : ~의 악용, 남용

## 비슷한 말 · 반대말
- **harmful** — 해로운 (더 넓은 말)
- **malicious** — 악의적인 (공격 의도에 초점)

## 시험 포인트
*abusive* 요청을 값싸게 거르는 문항은 **메인 턴 앞에 둔 경량 분류기**(제한된 출력 형식)가 정답입니다. 지속적인 *abusive* 메시지 끝에 Claude가 세션을 끝냈다면 그 호출은 `EndConversation` 이며, 이 도구는 PreToolUse·PostToolUse 훅을 모두 건너뜁니다.
