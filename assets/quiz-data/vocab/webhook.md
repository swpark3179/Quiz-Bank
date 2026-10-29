어떤 **이벤트가 생기면 미리 등록한 URL 로 HTTP 요청을 보내** 다른 시스템에 알려 주는 방식입니다. 결제 완료 같은 일이 생겼을 때 받는 쪽이 계속 물어보지 않아도 됩니다.

## 문제 속 쓰임
> The coordinator spawns a subagent with a single Task call to trace how a payment **webhook** propagates through the `orders` module.
> 코디네이터가 결제 **웹훅**이 `orders` 모듈을 통해 어떻게 전파되는지 추적하라며 `Task` 호출 한 번으로 서브에이전트를 생성한다.

## 함께 쓰는 표현
- **payment webhook** : 결제 웹훅 — 결제 결과를 알려 오는 요청
- **webhook handler / endpoint** : 웹훅을 받아 처리하는 코드·주소

## 비교
- **polling** — 받는 쪽이 주기적으로 "바뀐 것 있나?" 물어보는 방식
