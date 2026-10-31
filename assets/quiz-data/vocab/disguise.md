겉모습을 바꿔 **정체를 숨긴다**는 말입니다. *in disguise* 는 "겉으로는 달라 보이지만 실은 ~인"이라는 뜻으로, *a blessing in disguise*(전화위복)처럼 씁니다.

## 문제 속 쓰임
> As refusals **in disguise**: route them to a fallback model while keeping the same `max_tokens` setting.
> **겉모습만 다른** 거절로 보고, 같은 `max_tokens` 설정으로 대체 모델에 보낸다.

## 함께 쓰는 표현
- **in disguise** : 위장한, 겉모습만 다른
- **a blessing in disguise** : 전화위복
- **disguised as** ~ : ~로 위장한

## 시험 포인트
거절은 `stop_reason: "refusal"` 로 분명히 표시되므로 "위장된 거절"이라는 해석은 오답입니다. `max_tokens` 와 함께 나타난 JSON 파싱 오류는 **잘린 출력**이니 한도를 높여 재시도합니다.
