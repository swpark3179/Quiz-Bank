회의·행사에 **참석하는 사람**입니다. *-ee* 는 '~을 받는(하는) 사람'을 만드는 접미사로, *employee*(직원)·*trainee*(연수생)와 같은 구조입니다.

## 문제 속 쓰임
> Fifteen **attendees** are passed to `create_calendar_event`, and the calendar refuses with "Too many attendees (max 10)".
> **참석자** 15명을 `create_calendar_event`에 넘겼더니 캘린더가 "Too many attendees (max 10)"(참석자가 너무 많음, 최대 10명)으로 거절한다.

## 함께 쓰는 표현
- **attend a meeting** : 회의에 참석하다
- **attendee list** : 참석자 명단

## 비슷한 말 · 반대말
- **participant** — 참여자
- **invitee** — 초대받은 사람

## 시험 포인트
참석자 상한 초과는 같은 요청을 다시 보내도 결과가 같은 **비즈니스 오류**입니다. 정답은 `errorCategory` "business", `isRetryable` false에 사용자에게 전할 설명을 붙이는 것이고, 그래야 에이전트가 두 세션으로 나누는 등의 대안을 제시할 수 있습니다.
