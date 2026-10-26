요청을 보낸 뒤 **응답을 기다리며 멈춰 있지 않고**, 결과는 나중에 따로 받는 방식입니다. 코드에서는 줄여서 *async* 라고 씁니다.

## 문제 속 쓰임
> The **asynchronous** model prevents executing tools mid-request and returning results for Claude to continue analysis.
> **비동기** 모델이라, 요청 도중에 도구를 실행하고 결과를 돌려줘 Claude가 분석을 이어 가게 할 수 없다.

## 함께 쓰는 표현
- **async/await** : 비동기 코드를 순서대로 읽히게 쓰는 문법
- **asynchronously** (부) 비동기로

## 반대말
- **synchronous** — 동기의: 응답이 올 때까지 기다렸다가 다음으로 넘어가는

## 시험 포인트
Message Batches API 는 요청을 보내 두고 나중에 결과를 받는 **비동기 방식**이라, 요청 *도중* 에 도구를 실행해 결과를 돌려줘야 하는 **반복적인 tool calling 작업에는 맞지 않습니다**. 지연을 견딜 수 있는 야간·주간 작업에 적합합니다.
