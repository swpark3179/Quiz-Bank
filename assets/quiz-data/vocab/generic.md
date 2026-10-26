특정한 상황에 맞춘 것이 아니라 **두루뭉술하게 어디에나 쓰는** 것을 말합니다. 오류 이야기에서는 *무엇이 왜 실패했는지 알 수 없는* 뭉뚱그린 응답이라는 부정적인 느낌이 있습니다.

## 문제 속 쓰임
> ...returning a **generic** "search unavailable" status only after all retries are exhausted.
> 재시도를 모두 소진한 뒤에야 **일반적인** "search unavailable" 상태만 돌려준다.

## 함께 쓰는 표현
- **generic error message** : 원인을 알 수 없는 일반 오류 메시지
- **generic tool** : 범용 도구 (= *general-purpose tool*)

## 반대말
- **specific**, **detailed** — 구체적인, 자세한

## 시험 포인트
오류를 위로 넘길 때 **generic** 한 상태값만 주면 상위에서 판단할 근거가 사라집니다. 실패 유형·시도한 쿼리·부분 결과를 담은 **구조화된 오류 정보**를 넘기는 선택지가 정답 쪽입니다.
