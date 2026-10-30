<!-- domain4.md 의 한글판. 문항·보기 순서·정답 번호는 영문판과 같다. 질문·보기는 영문판 해설의 '문제 번역'을 옮겼고, 해설은 영문판에서 '문제 번역' 블록만 뺐다. -->

## 문제 1
### **Anthropic 지원팀이 요청을 추적할 수 있도록, 보고하는 모든 실패한 Messages API 호출에 식별자 하나를 함께 적어 달라고 합니다. 앱은 Python SDK를 쓰며 `log.warning("claude call failed", extra={"trace": message.____})`로 기록합니다. 빈칸에 들어갈 속성은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. id | |
| 2. model | |
| **3. _request_id** | |
| 4. stop_sequence | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 모든 API 응답에는 `req_...` 형태의 고유한 **`request-id` 헤더** 가 있고, 같은 값이 오류 응답 본문의 `request_id` 필드로도 옵니다. 공식 문서는 특정 요청으로 지원팀에 문의할 때 이 ID를 포함하라고 안내합니다. Python·TypeScript SDK는 이 값을 최상위 응답 객체의 **`_request_id`** 속성으로 노출하며, 밑줄로 시작하지만 다른 `_` 속성과 달리 공개 속성입니다.

```python
message = client.messages.create(...)
print(message._request_id)   # req_018E... 지원 문의용
print(message.id)            # msg_01... 응답 메시지 객체의 ID
```

1. **오답** - `id`는 응답 메시지 객체의 ID(`msg_...`)입니다. 지원팀이 요청을 추적하는 데 쓰는 요청 ID와 다릅니다.
2. **오답** - 응답을 만든 모델 이름일 뿐, 개별 요청을 식별하지 못합니다.
3. **정답** - `request-id` 헤더에서 가져온 요청 ID로, 실패한 요청을 기록하고 Anthropic에 보고하는 용도입니다.
4. **오답** - 응답이 사용자 지정 정지 시퀀스로 끝났을 때 그 시퀀스를 담는 필드입니다.

> 💡 **시험 포인트:** 요청 ID는 응답 헤더 `request-id`, 오류 본문의 `request_id`, SDK의 `_request_id` 세 곳에서 같은 값입니다. 500 `api_error`가 계속되면 이 ID를 들고 지원팀에 문의합니다.

> 📚 근거 문서: [Claude API errors](https://platform.claude.com/docs/en/api/errors) · [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python)

---

## 문제 2
### **배포 도구의 백그라운드 워커 두 개가 같은 고유 이름으로 리소스를 동시에 만들려 하고, 그중 하나가 409 conflict_error를 받습니다. 자동 재시도도 똑같이 실패합니다. 올바른 대응은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 먼저 충돌을 해소한다. 예를 들어 워커를 차례로 실행하게 하거나 고유한 값을 고른 뒤 재시도한다** | |
| 2. 충돌이 저절로 풀릴 때까지 SDK가 계속 재시도하도록 max_retries를 10으로 올린다 | |
| 3. 409를 서버 측 장애로 보고 지터를 섞은 지수 백오프로 나중에 재시도한다 | |
| 4. 두 번째 워커의 요청을 다른 API 키로 보내 별개의 주체에서 온 것처럼 만든다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 409 `conflict_error`는 **요청이 리소스의 현재 상태와 충돌한다** 는 뜻입니다. 공식 문서는 원인 예로 리소스의 동시 수정, 고유해야 하는 값이 이미 사용 중인 경우를 들고, **"충돌을 해소한 뒤 요청을 재시도하라"** 고 안내합니다. SDK는 409도 기본으로 두 번 재시도하지만, 같은 이름이 이미 쓰이고 있다면 같은 요청을 몇 번 보내도 결과는 같습니다. 두 워커의 작업을 직렬화하거나, 다른 고유 값을 쓰거나, 현재 상태를 확인한 뒤 다시 보내야 합니다.

1. **정답** - 원인(동시 생성, 고유 값 중복)을 없앤 뒤 재시도하라는 문서의 대응과 일치합니다.
2. **오답** - 충돌의 원인이 그대로이므로 재시도 횟수를 늘려도 같은 409만 반복됩니다.
3. **오답** - 409는 4xx, 즉 요청과 리소스 상태의 문제입니다. 서버 장애로 볼 근거가 없습니다.
4. **오답** - 충돌은 리소스의 상태에서 생기는 것이지 호출 주체 때문이 아닙니다. 키를 바꿔도 같은 이름은 이미 쓰이고 있습니다.

> 💡 **시험 포인트:** 4xx는 '요청이나 상태를 고친다', 5xx·529는 '물러났다 재시도한다'가 기본입니다. 409는 SDK 자동 재시도 대상이지만 해결은 충돌 해소입니다.

> 📚 근거 문서: [Claude API errors](https://platform.claude.com/docs/en/api/errors) · [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python)

---

## 문제 3
### **야간 배치 작업이 retry-after 헤더가 20초인 429 rate_limit_error 응답을 받습니다. 작업의 맞춤 재시도 래퍼는 실패한 요청을 촘촘한 루프로 즉시 다시 보내고, 429는 계속 옵니다. 무엇을 바꿔야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 같은 조직의 API 키 여러 개에 요청을 돌려 부하를 분산한다 | |
| 2. 출력 토큰 한도는 max_tokens로 계산되므로 모든 요청의 max_tokens를 낮춘다 | |
| 3. 429는 조직이 영구적인 상한에 닿았다는 뜻이므로 실패한 요청을 버린다 | |
| **4. 다시 보내기 전에 최소한 retry-after 시간만큼 기다리고, 429가 반복되면 더 물러난다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** rate limit을 넘으면 429가 오고, 공식 문서는 **응답에 `retry-after` 헤더가 있으면 그 초만큼 기다린 뒤 재시도하라** 고 안내합니다. 헤더 설명도 "그보다 이른 재시도는 실패한다"입니다. 촘촘한 즉시 재시도는 한도가 채워질 시간을 주지 않고 요청 수만 늘려 상황을 악화시킵니다. 공식 SDK도 일시적 실패를 지수 백오프로 재시도하며 `retry-after`를 따르므로, 맞춤 래퍼도 같은 원칙을 지켜야 합니다.

1. **오답** - rate limit은 조직 단위로 걸립니다. 같은 조직의 키를 돌려 써도 한도는 그대로입니다.
2. **오답** - OTPM은 실제로 생성된 토큰만 세며 `max_tokens`는 계산에 들어가지 않는다고 문서가 명시합니다.
3. **오답** - `retry-after`가 있는 429는 일시적인 rate limit입니다. 헤더가 없고 지출 상한 오류 코드가 있는 경우와 구별해야 합니다.
4. **정답** - 헤더가 알려 준 시간 이상 기다리고, 반복되면 간격을 더 늘리는 것이 올바른 재시도입니다.

> 💡 **시험 포인트:** 토큰 버킷 방식이라 용량은 고정 주기가 아니라 계속 채워지고, 60 RPM이 초당 1건처럼 짧은 간격으로 적용될 수 있습니다. 짧은 폭주만으로도 429가 날 수 있으니 요청을 고르게 보내세요.

> 📚 근거 문서: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 4
### **한 팀이 맞춤 재시도 래퍼를 없애고 공식 SDK의 기본 재시도 동작에만 의존합니다. 다음 중 추가 설정 없이 SDK가 자동으로 재시도하는 오류는 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 잘못된 형식의 messages 배열 때문에 생긴 400 invalid_request_error | |
| **2. API에 부하가 몰린 동안 돌아온 529 overloaded_error** | |
| 3. 폐기된 API 키 때문에 생긴 401 authentication_error | |
| 4. 너무 큰 요청 본문 때문에 생긴 413 request_too_large | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** Python SDK 문서는 기본으로 **연결 오류, 408 Request Timeout, 409 Conflict, 429 Rate Limit, 500 이상의 내부 오류** 를 짧은 지수 백오프로 **2회** 재시도한다고 설명합니다. 529 `overloaded_error`는 500 이상이므로 재시도 대상입니다. 반대로 400·401·413은 요청 자체가 잘못된 것이라 같은 요청을 다시 보내도 결과가 같으므로 재시도하지 않습니다. 재시도 횟수는 `max_retries`로 바꾸거나 0으로 끌 수 있습니다.

1. **오답** - 요청 형식 오류는 요청을 고쳐야 풀립니다. 재시도 대상이 아닙니다.
2. **정답** - 일시적 과부하인 529는 500 이상의 오류로, SDK가 기본으로 재시도합니다.
3. **오답** - 키 문제는 다시 보내도 해결되지 않습니다. 키나 워크스페이스 설정을 확인해야 합니다.
4. **오답** - 요청 크기 한도 초과는 본문을 줄여야 풀립니다. 재시도는 소용없습니다.

> 💡 **시험 포인트:** SDK 재시도는 '일시적 실패'만 다룹니다. 재시도 대상이라도 지출 상한의 429처럼 원인이 남아 있으면 재시도는 계속 실패한다는 점도 함께 기억하세요.

> 📚 근거 문서: [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 5
### **야간 작업의 요청이 몇 시간째 429 rate_limit_error로 실패하고 있습니다. 어떤 응답에도 retry-after 헤더가 없고, error.details.error_code는 enforced_spend_limit_reached이며, SDK의 자동 재시도도 매번 실패합니다. 팀은 무엇을 해야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 트래픽이 가라앉으면 결국 통과하도록 max_retries를 10으로 올린다 | |
| 2. 상한이 1시간인 지터 섞인 지수 백오프를 추가하고 작업을 무인으로 계속 돌린다 | |
| **3. 재시도를 멈추고 담당자에게 알린 뒤, 더 높은 사용 등급을 요청하거나 접근이 재개될 때까지 기다린다** | |
| 4. 이 429는 직접 정한 한도 때문이므로 Billing 페이지에서 워크스페이스 지출 한도를 올린다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 사용 등급의 월 지출 상한에 닿으면 API 사용이 **다음 달 1일 00:00 UTC까지 멈추고**, 그동안 요청은 429를 받습니다. 공식 문서는 이 응답이 일반 rate limit과 같은 `rate_limit_error`지만 **`retry-after` 헤더가 없고, SDK 자동 재시도를 포함한 모든 재시도가 접근이 재개될 때까지 실패한다** 고 설명합니다. Messages API에서는 `error.details.error_code`가 `enforced_spend_limit_reached`라서 rate limit과 구별할 수 있습니다. 해결은 더 높은 등급으로 올라가거나 기다리는 것뿐이므로, 재시도를 멈추고 사람에게 넘겨야 합니다.

1. **오답** - 원인이 시간 단위의 트래픽이 아니라 월 상한이므로 재시도를 늘려도 계속 실패하고, 실패한 요청만 쌓입니다.
2. **오답** - 백오프는 일시적 한도에 맞는 처방입니다. 월 상한은 몇 시간을 기다려도 풀리지 않을 수 있고, 무인 재시도는 문제를 숨깁니다.
3. **정답** - 재시도로 풀리지 않는 상한임을 알아보고, 등급 상향이나 대기라는 실제 해결책으로 넘깁니다.
4. **오답** - 직접 정한 지출 한도에 닿으면 429가 아니라 400 `invalid_request_error`가 옵니다(Claude Code 워크스페이스 한도는 예외). 또 직접 정한 한도는 등급 상한을 넘게 올릴 수 없습니다.

> 💡 **시험 포인트:** 429라도 `retry-after`가 없고 `enforced_spend_limit_reached`면 '재시도 중단 + 등급 상향 또는 대기'입니다. 직접 정한 한도는 400으로 온다는 점과 짝지어 기억하세요.

> 📚 근거 문서: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 6
### **문서 질의응답 서비스가 스캔한 계약서 수십 건을 base64 PDF로 Messages API 요청 하나에 넣었다가 413 request_too_large를 받습니다. 문제를 실제로 해결하는 대응은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 요청 본문을 크기 한도 아래로 줄인다. 예를 들어 호출마다 더 적거나 더 작은 문서를 보낸다** | |
| 2. 413은 일시적 용량 압박을 뜻하므로 같은 요청을 지수 백오프로 재시도한다 | |
| 3. 같은 요청 본문이 들어가도록 컨텍스트 창이 더 큰 모델로 바꾼다 | |
| 4. 너무 큰 본문이 조각으로 올라가도록 요청에 스트리밍을 켠다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 413 `request_too_large`는 **요청이 엔드포인트가 허용하는 최대 바이트 수를 넘었다** 는 뜻입니다. 2026년 10월 기준 1st-party API의 한도는 Messages API 128 MB, Batch API 256 MB, Files API 500 MB이며, 1st-party API에서는 요청이 API 서버에 닿기 전에 Cloudflare가 이 오류를 돌려줍니다. 용량이나 일시적 상태의 문제가 아니므로 **본문 크기를 줄이는 것** 만이 해결책입니다.

1. **정답** - 요청당 문서 수나 크기를 줄여 바이트 한도 안에 들어오게 하면 오류가 사라집니다.
2. **오답** - 같은 크기의 요청은 몇 번을 보내도 같은 한도에 걸립니다. 413은 SDK 자동 재시도 대상도 아닙니다.
3. **오답** - 컨텍스트 창은 *토큰* 한도이고, 413은 요청의 *바이트* 크기 한도입니다. 모델을 바꿔도 요청 크기 제한은 그대로입니다.
4. **오답** - 스트리밍은 *응답* 을 이벤트로 나눠 받는 기능이지 요청 본문을 나눠 올리는 기능이 아닙니다. 긴 응답이나 504 대응에 쓰입니다.

> 💡 **시험 포인트:** '413 = 본문을 줄인다', '504 = 스트리밍이나 Batches로', '529 = 물러났다 재시도'로 구분하세요.

> 📎 참고: 학습 자료에 따라 Messages API 요청 한도를 32 MB로 적은 경우가 있지만, 현재 공식 오류 문서의 1st-party API 한도는 128 MB입니다. 다른 플랫폼의 한도는 API 개요 문서에서 따로 확인하세요.

> 📚 근거 문서: [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 7
### **각 API 응답과 그것이 요구하는 복구 조치를 짝지으세요. (a) retry-after 헤더가 있는 429 rate_limit_error, (b) error_code가 enforced_spend_limit_reached이고 retry-after가 없는 429 rate_limit_error, (c) 메시지가 "You have reached your specified API usage limits"로 시작하는 400 invalid_request_error, (d) 500 api_error.**

| 보기 | 설명 |
|------|------|
| 1. (a) retry-after만큼 기다린 뒤 재시도 (b) 직접 정한 지출 한도를 올리거나 없앤다 (c) 등급을 올리거나 기다린다 (d) 백오프 후, 계속되면 요청 ID로 지원 문의 | |
| 2. (a) 백오프 후, 계속되면 요청 ID로 지원 문의 (b) 등급을 올리거나 기다린다 (c) 직접 정한 지출 한도를 올리거나 없앤다 (d) retry-after만큼 기다린 뒤 재시도 | |
| 3. (a) retry-after만큼 기다린 뒤 재시도 (b) 등급을 올리거나 기다린다 (c) 요청 본문의 형식을 고친다 (d) 백오프 후, 계속되면 요청 ID로 지원 문의 | |
| **4. (a) retry-after만큼 기다린 뒤 재시도 (b) 등급을 올리거나 기다린다 (c) 직접 정한 지출 한도를 올리거나 없앤다 (d) 백오프 후, 계속되면 요청 ID로 지원 문의** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 같은 상태 코드라도 신호에 따라 조치가 다릅니다.

| 응답 | 원인 | 조치 |
|---|---|---|
| 429 + `retry-after` | 일반 rate limit | 헤더의 초만큼 기다린 뒤 재시도 |
| 429, `enforced_spend_limit_reached`, 헤더 없음 | 등급 월 지출 상한 | 재시도 중단, 등급 상향 요청 또는 접근 재개까지 대기 |
| 400 "You have reached your specified API usage limits…" | 내가 Console에서 정한 지출 한도 | 한도를 올리거나 없앤다 |
| 500 `api_error` | Anthropic 내부 오류 | 지수 백오프로 재시도, 계속되면 요청 ID로 지원 문의 |

1. **오답** - (b)와 (c)가 뒤바뀌었습니다. 헤더 없는 429는 등급 상한이고, 'specified … limits' 400이 내가 정한 한도입니다.
2. **오답** - (a)와 (d)가 뒤바뀌었습니다. `retry-after`가 있는 쪽이 헤더만큼 기다리는 경우이고, 500은 백오프 후 지원 문의입니다.
3. **오답** - (c)를 형식 오류로 본 것이 틀렸습니다. 'usage limits'로 시작하는 400은 요청 형식이 아니라 직접 정한 지출 한도 때문입니다.
4. **정답** - 네 응답이 모두 문서의 원인과 조치에 맞게 짝지어졌습니다.

> 💡 **시험 포인트:** 400이라고 다 형식 오류가 아니고, 429라고 다 재시도로 풀리지 않습니다. 상태 코드와 함께 헤더, `error_code`, 메시지 첫머리를 읽으세요.

> 📚 근거 문서: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 8
### **에이전트의 lookup_order 도구가 사내 주문 서비스를 호출합니다. 장애가 난 동안 도구 실행기가 연결 오류를 잡아 is_error를 true로 설정한 tool_result로 돌려주고, Claude는 고객에게 주문을 조회할 수 없다고 사과합니다. 근본 원인은 어디에 있고, 조회를 다시 시도할지는 누가 정해야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 모델. Claude가 실패한 도구를 더 끈질기게 재시도하도록 더 큰 모델로 바꾼다 | |
| **2. 통합 계층. 주문 서비스가 실패했으며, 도구를 언제 다시 시도할지는 애플리케이션이 정한다** | |
| 3. 프롬프트. 도구가 실패해도 절대 사과하지 말라는 지시를 추가한다 | |
| 4. Claude API. Messages API 요청 자체가 실패했으므로 SDK가 자동으로 재시도해야 한다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 도구 자체가 실행 중 오류를 내면(예: 데이터를 가져오다 네트워크 오류), 앱은 오류 메시지를 `content`에 담고 **`"is_error": true`** 로 돌려주며, Claude는 그 오류를 응답에 반영해 사용자에게 설명합니다. 공식 문서의 예시도 서비스가 응답하지 않아 날씨를 가져오지 못했다고 사과하는 문장입니다. 즉 Claude의 사과는 **모델이 고장 난 신호가 아니라 도구 백엔드가 실패했다는 증상** 입니다. 도구는 클라이언트 측에서 실행되므로, 백엔드를 다시 호출할지, 얼마나 기다릴지, 사용자에게 무엇을 안내할지는 통합 계층(애플리케이션)의 결정입니다.

1. **오답** - 모델은 받은 오류를 정상적으로 처리했습니다. 원인은 모델 밖의 주문 서비스에 있으므로 모델을 바꿔도 장애는 그대로입니다.
2. **정답** - 실패 지점은 도구 백엔드이고, 클라이언트 도구의 재시도 정책은 앱이 소유합니다. 무엇이 잘못됐고 다음에 무엇을 하면 되는지 적은 오류 메시지는 Claude의 대처도 돕습니다.
3. **오답** - 증상을 감출 뿐이고, 사용자에게 사실과 다른 인상을 줄 수 있습니다. 장애 자체는 해결되지 않습니다.
4. **오답** - Messages API 호출은 정상적으로 응답했습니다. 실패한 것은 앱이 실행한 도구 호출이라 SDK 재시도 대상이 아닙니다.

> 💡 **시험 포인트:** 오류가 *어느 계층* 에서 났는지부터 가립니다. HTTP 오류는 API 계층, `is_error` 도구 결과는 통합 계층(도구 백엔드), `refusal`·빈 응답 등은 모델 출력 쪽입니다.

> 📚 근거 문서: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

---

## 문제 9
### **한 스타트업의 운영 트래픽이 여섯 시간째 모든 요청에서 429 rate_limit_error를 받고 있습니다. 재시도 로직은 백오프를 두고 계속 시도하고, 어떤 응답에도 retry-after 헤더가 없으며, 팀 누구도 Console에서 지출 한도를 설정한 적이 없습니다. 가장 가능성 높은 원인을 예측해 보세요.**

| 보기 | 설명 |
|------|------|
| 1. 예전에 설정해 둔 워크스페이스 지출 한도. API가 이를 지속적인 429 응답으로 강제한다 | |
| 2. 트래픽 급증으로 생긴 가속 한도. 트래픽이 안정되면 몇 번의 재시도 안에 풀린다 | |
| **3. 조직의 사용 등급 월 지출 상한. 등급을 올리거나 다음 달이 될 때까지 접근이 멈춘다** | |
| 4. 분당 출력 토큰 한도. 토큰 버킷이 다시 차면 백오프로 바로 풀린다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 단서는 세 가지입니다. **몇 시간째 계속되고**, **`retry-after`가 없으며**, **직접 정한 한도가 없다.** Start·Build·Scale 등급에는 각각 월 지출 상한(예: Start $500)이 있고, 상한에 닿으면 다음 달 1일 00:00 UTC까지 사용이 멈추며 요청은 `retry-after` 없는 429를 받습니다. 공식 문서는 이 경우 SDK 자동 재시도를 포함한 모든 재시도가 접근이 재개될 때까지 실패한다고 설명합니다. 확인하려면 오류 본문의 `error.details.error_code`가 `enforced_spend_limit_reached`인지 봅니다.

1. **오답** - 팀이 한도를 설정한 적이 없을 뿐 아니라, 직접 정한 조직·워크스페이스 지출 한도에 닿으면 429가 아니라 400 `invalid_request_error`가 옵니다.
2. **오답** - 가속 한도는 급증 직후의 일시적 제한이라 여섯 시간씩 모든 요청을 막는 패턴과 맞지 않습니다.
3. **정답** - 헤더 없는 429가 몇 시간째 지속되는 것은 등급 월 지출 상한의 전형적인 신호입니다.
4. **오답** - 분당 한도는 토큰 버킷이 계속 채워지므로 백오프로 풀립니다. 그런 429에는 보통 `retry-after`도 붙습니다.

> 💡 **시험 포인트:** '429 + 헤더 없음 + 몇 시간째'는 등급 지출 상한, '400 + usage limits'는 내가 정한 한도, '급증 직후 공개 한도 아래의 429'는 가속 한도입니다.

> 📚 근거 문서: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 10
### **thinking과 도구를 쓰는 에이전트가 최신 어시스턴트 메시지의 thinking 또는 redacted_thinking 블록은 수정할 수 없다는 400 invalid_request_error를 받습니다. 통합 코드는 tool_result를 붙이기 전에 각 어시스턴트 턴에서 text와 tool_use 블록만 남겨 다시 조립합니다. 문서가 권하는 수정은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 어시스턴트 턴을 thinking과 redacted_thinking 블록까지 받은 그대로 돌려보내고, 그 뒤에 tool_result를 붙인다** | |
| 2. tool_result를 담은 요청마다 thinking을 끄고, 최종 답변에서만 다시 켠다 | |
| 3. 이전 턴까지 포함해 대화 기록 전체에서 thinking 블록을 모두 지운 뒤 요청한다 | |
| 4. Claude가 계속 읽을 수 있도록 thinking 텍스트를 tool_result 뒤의 사용자 텍스트 블록에 복사한다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 도구 사용과 다중 턴 대화에서는 이전 어시스턴트 메시지를 thinking 블록과 함께 돌려보내고, API는 그 블록이 **수정되지 않았는지 검증** 합니다. 공식 문서는 이 오류의 가장 흔한 원인으로 *코드가 콘텐츠 블록을 타입으로 걸러 `redacted_thinking`을 빠뜨리거나, 어시스턴트 메시지를 되돌려 보내지 않고 다시 조립하는 것* 을 들고, 해결책으로 **어시스턴트 턴을 thinking 블록까지 포함해 받은 그대로 돌려보내라** 고 안내합니다. `thinking` 필드가 빈 블록도 포함해야 하며, 블록을 타입으로 거른다면 두 타입을 모두 포함해야 합니다.

```python
messages.append({"role": "assistant", "content": resp.content})  # 손대지 않는다
messages.append({"role": "user", "content": tool_results})
```

1. **정답** - 오류의 원인이 재조립이므로, 받은 턴을 그대로 넣고 결과만 덧붙이면 해결됩니다.
2. **오답** - 최신 모델 중에는 thinking을 끌 수 없는 모델도 있고, 끄고 켜는 것은 원인(블록 변형)을 건드리지 않습니다. 사고 설정을 바꾸면 캐시도 깨집니다.
3. **오답** - 블록을 지우는 것도 결국 어시스턴트 턴을 변형하는 일입니다. 이 오류의 해결책은 받은 그대로 돌려보내는 것입니다.
4. **오답** - thinking 내용을 사용자 텍스트로 옮겨도 어시스턴트 메시지의 블록은 여전히 빠진 상태입니다. 도구 결과 뒤 텍스트는 빈 응답의 원인이 될 수도 있습니다.

> 💡 **시험 포인트:** 400 메시지는 문제 블록의 위치(예: `messages.1.content.0`)까지 알려 줍니다. thinking 관련 400은 대부분 '통합 코드가 기록을 손댔다'는 뜻이니, 기록을 추가 전용(append-only)으로 유지하세요.

> 📚 근거 문서: [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting) · [Claude API errors](https://platform.claude.com/docs/en/api/errors) · [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use)

---

## 문제 11
### **응답이 입력 JSON이 객체 중간에서 끊긴 tool_use 블록으로 끝납니다. 이 상황을 나타내는 stop_reason 값은 무엇이며, 문서는 이를 max_tokens를 더 크게 해서 요청을 다시 보내는 방법으로 고칩니다. 그 값은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. pause_turn | |
| 2. end_turn | |
| 3. model_context_window_exceeded | |
| **4. max_tokens** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 공식 문서는 Claude의 응답이 **`max_tokens` 한도에 닿아 잘렸고, 잘린 응답에 미완성 tool use 블록이 있으면 더 큰 `max_tokens`로 요청을 다시 보내 완전한 tool use를 받으라** 고 안내합니다. 이때 `stop_reason`은 `max_tokens`입니다. thinking을 쓰는 경우 사고 토큰도 `max_tokens`에 포함되므로, 긴 사고가 한도를 먼저 써 버려 잘릴 수도 있습니다.

```python
if resp.stop_reason == "max_tokens" and resp.content[-1].type == "tool_use":
    resp = client.messages.create(model=MODEL, max_tokens=8192,
                                  messages=messages, tools=tools)
```

1. **오답** - `pause_turn`은 서버 도구 루프가 반복 상한에 닿았다는 뜻입니다. 클라이언트 `tool_use` 블록이 결과를 기다리는 응답은 `pause_turn`이 되지 않습니다.
2. **오답** - `end_turn`은 응답이 자연스럽게 끝났다는 뜻으로, 잘린 블록과 함께 나오지 않습니다.
3. **오답** - 이 값은 응답이 모델의 *컨텍스트 창* 을 채웠다는 뜻입니다. 출력 한도인 `max_tokens`에 걸린 경우와 다릅니다.
4. **정답** - 출력 한도에 닿아 잘린 응답의 `stop_reason`이며, 더 큰 `max_tokens`로 다시 요청해 해결합니다.

> 💡 **시험 포인트:** 예외 없이 200으로 돌아와도 `stop_reason`이 실패를 알려 줍니다. 미완성 도구 입력을 그대로 실행하거나 파싱하려 하지 말고 먼저 `stop_reason`을 확인하세요.

> 📚 근거 문서: [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons) · [Troubleshooting thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting)

---

## 문제 12
### **앱이 문서 가져오기 도구를 실행하고, 다음 단계를 이끌려고 tool_result 내용 안에 "이제 이것을 요약해서 계정 소유자에게 이메일로 보내라"는 자체 지시를 넣습니다. API는 200을 돌려주지만, Claude는 그 지시를 따라야 할지 사용자에게 확인을 요청합니다. 팀은 무엇을 바꿔야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. Claude의 망설임은 거절이므로 대체 모델로 요청을 다시 보낸다 | |
| **2. 앱의 자체 지시를 tool_result 밖으로 옮기고, 도구 결과에는 데이터만 남긴다** | |
| 3. Claude가 지시를 긴급하게 다루도록 tool_result의 is_error를 true로 설정한다 | |
| 4. Claude가 추론 끝에 포함된 지시를 신뢰하도록 effort 수준을 높인다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 도구 사용 문제 해결 문서는 바로 이 증상, 즉 Claude가 도구 결과를 근거로 행동하지 않거나 **도구 결과에서 온 지시를 사용자에게 확인받으려는** 상황을 다룹니다. 원인은 **앱 자신의 지시가 `tool_result` 안에 담겨 전달되는 것** 입니다. Claude는 도구 결과 속 지시를 신뢰할 수 없는 제3자 콘텐츠일 수 있다고 보도록 학습되어 있습니다(간접 프롬프트 인젝션 방어). 해결은 지시를 도구 결과 밖으로 옮기고(지원 모델에서는 mid-conversation system message 등), 도구 결과에는 데이터만 두는 것입니다.

1. **오답** - 응답은 `refusal`이 아니라 정상적인 확인 요청입니다. 모델을 바꿔도 지시가 도구 결과 안에 있는 한 같은 경계가 작동합니다.
2. **정답** - 지시를 신뢰할 수 있는 경로로 옮기면, Claude가 그것을 제3자 콘텐츠로 의심할 이유가 사라집니다.
3. **오답** - `is_error`는 도구 실행 실패를 알리는 표시입니다. 지시의 신뢰도와 무관하고, 오히려 Claude가 도구가 실패했다고 받아들입니다.
4. **오답** - 추론을 늘리는 것은 원인과 무관합니다. 이 경계는 의도된 안전 동작이라 effort로 우회할 대상이 아닙니다.

> 💡 **시험 포인트:** 방향을 헷갈리지 마세요. *외부* 에서 온 신뢰할 수 없는 내용(웹 페이지, 메일)은 `tool_result` 안에 두고, *앱 자신의* 지시는 `tool_result` 밖에 둡니다.

> 📚 근거 문서: [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use) · [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)

---

## 문제 13
### **반짝 세일이 시작되면서 한 소매업체의 Messages API 트래픽이 10분 안에 분당 약 50건에서 1,500건으로 뛰었습니다. 등급의 공개된 RPM·ITPM·OTPM 한도보다는 여전히 한참 아래인데도 429 오류를 받기 시작합니다. 가장 가능성 높은 원인과 해결책은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 등급의 월 지출 상한에 닿았다. 즉시 등급 상향을 요청한다 | |
| 2. 프롬프트 캐시 미스가 ITPM에 계산된다. 모든 요청에 캐시 중단점을 더 추가한다 | |
| **3. 급격한 증가로 가속 한도가 걸렸다. 트래픽을 점진적으로 늘리고 사용 패턴을 일정하게 유지한다** | |
| 4. 직접 정한 워크스페이스 한도에 닿았다. Console의 Billing 페이지에서 그 한도를 없앤다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 공식 문서는 **조직의 사용량이 급격히 늘면 API의 가속 한도(acceleration limits) 때문에 429를 받을 수 있다** 고 경고하고, 이를 피하려면 **트래픽을 점진적으로 늘리고 사용 패턴을 일정하게 유지하라** 고 안내합니다. 이 시나리오의 핵심 단서는 '공개 한도보다 한참 아래'와 '몇 분 사이 30배 급증'입니다. 한도 자체가 아니라 증가 속도가 문제이므로, 등급을 올리는 것보다 증가를 완만하게 만드는 것이 해결책입니다.

1. **오답** - 지출 상한은 금액 기준이며, 그 429는 `retry-after` 없이 몇 시간씩 이어지고 `enforced_spend_limit_reached` 코드를 가집니다. 급증 직후라는 단서와 맞지 않습니다.
2. **오답** - 캐시는 ITPM 여유를 늘리는 좋은 방법이지만, 이미 공개 한도보다 한참 아래이므로 원인이 아닙니다.
3. **정답** - 공개 한도 아래에서 급증 직후에 생긴 429는 가속 한도의 전형이며, 점진적 증가로 피합니다.
4. **오답** - 직접 정한 지출 한도는 429가 아니라 400으로 옵니다(Claude Code 워크스페이스 예외).

> 💡 **시험 포인트:** 대형 출시나 이벤트 전에는 트래픽을 단계적으로 올리는 계획을 세우세요. 529 `overloaded_error`는 전체 사용자의 트래픽 때문에, 가속 한도의 429는 *내 조직의* 급증 때문에 생긴다는 점도 구별합니다.

> 📚 근거 문서: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 14
### **한 에이전트가 도구 결과 직후에 stop_reason이 end_turn인 빈 응답을 계속 받습니다. 이를 고치는 공식 방법을 따른 순서는 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 반복되는 빈 end_turn 응답을 감지한다 → tool_result 블록 바로 뒤에 붙인 텍스트 블록을 제거한다 → 고친 기록으로 다시 보낸다 → 그래도 계속 비어 있을 때만 새 사용자 메시지로 계속 진행 요청을 추가한다** | |
| 2. 빈 응답을 감지한다 → 같은 요청을 바꾸지 않고 여러 번 다시 보낸다 → 같은 메시지의 tool_result 뒤에 계속 진행 요청을 추가한다 → 그래도 실패할 때만 텍스트 블록을 제거한다 | |
| 3. 모든 요청에 미리 계속 진행 요청을 넣는다 → 빈 응답을 감지한다 → tool_result 블록 뒤의 텍스트 블록을 제거한다 → 빈 응답을 바꾸지 않고 그대로 돌려보낸다 | |
| 4. 빈 응답을 감지한다 → max_tokens를 올린다 → 더 큰 모델로 바꾼다 → 새 모델도 빈 출력을 낼 때만 tool_result 블록 뒤의 텍스트 블록을 제거한다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 공식 문서는 빈 `end_turn`(내용 없는 2~3토큰 응답)의 원인으로 **도구 결과 바로 뒤에 텍스트 블록을 붙이는 것** (기록에 '도구 결과 뒤엔 사용자 텍스트' 패턴이 쌓여 Claude가 그대로 턴을 끝냄)과 **완료된 응답을 아무것도 더하지 않고 다시 보내는 것** 을 듭니다. 해결 순서도 정해져 있습니다. 먼저 **메시지 구조를 고치고**(`tool_result` 뒤에 텍스트를 두지 않는다), 구조를 고친 뒤에도 비어 있을 때만 **빈 응답을 재시도하는 대신 새 사용자 메시지로 계속 진행 요청** 을 넣습니다. 계속 진행 요청은 최후의 수단입니다.

1. **정답** - 감지 → 구조 수정 → 재전송 → 최후 수단으로 계속 진행 요청이라는 문서의 순서와 일치합니다.
2. **오답** - 바꾸지 않은 재전송은 도움이 되지 않는다고 문서가 명시합니다. `tool_result` 뒤에 텍스트를 더하는 것은 원인을 되풀이하는 일입니다.
3. **오답** - 계속 진행 요청을 처음부터 넣는 것은 최후의 수단을 먼저 쓰는 것이고, 마지막 단계의 '그대로 돌려보내기'는 효과가 없습니다.
4. **오답** - 빈 `end_turn`은 출력 한도나 모델 크기 문제가 아니라 메시지 구조 문제입니다. 원인 수정을 맨 뒤로 미뤘습니다.

> 💡 **시험 포인트:** 빈 응답 문항의 정답은 언제나 '구조부터'입니다. 도구 결과를 담은 사용자 메시지에는 `tool_result` 블록만 두세요.

> 📚 근거 문서: [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

---

## 문제 15
### **한 챗봇이 도구 결과 직후에 stop_reason이 end_turn인 빈 응답을 받습니다. 개발자의 임시방편은 그 빈 어시스턴트 턴까지 포함해 똑같은 메시지를 아무것도 바꾸지 않고 다시 보내는 것입니다. 결과를 예측해 보세요.**

| 보기 | 설명 |
|------|------|
| 1. Claude가 완전한 답을 낸다. 빈 응답은 일회성 샘플링 오류이기 때문이다 | |
| 2. Claude가 처음부터 다시 답한다. 동일한 요청은 완전히 새로운 대화로 취급되기 때문이다 | |
| 3. Claude가 멈춘 곳에서 이어 간다. 재전송은 pause_turn 이어 가기처럼 동작하기 때문이다 | |
| **4. Claude는 또 빈 end_turn을 돌려줄 가능성이 크다. 이미 그 턴이 끝났다고 판단했기 때문이다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D4 · Eval, Testing, and Debugging · 4.1 Debugging and Error Handling

> **핵심 진단:** 공식 문서는 빈 응답의 원인 중 하나로 **Claude의 완료된 응답을 아무것도 더하지 않고 다시 보내는 것** 을 들며, "Claude가 이미 끝났다고 판단했으므로 계속 끝난 상태로 남는다"고 설명합니다. 그리고 **수정 없이 빈 응답을 재시도하지 말라. 빈 응답을 다시 보내도 도움이 되지 않는다** 고 못 박습니다. 기록이 같으면 같은 판단이 나오므로, 원인(대개 도구 결과 뒤의 텍스트 블록)을 고쳐야 합니다.

1. **오답** - 빈 `end_turn`은 우연한 샘플링 오류가 아니라 메시지 구조에서 나오는 패턴입니다. 같은 입력은 같은 결과로 이어집니다.
2. **오답** - Messages API는 상태를 갖지 않으므로 매 요청이 보낸 기록 전체를 그대로 봅니다. 같은 기록을 보내면 '새 대화'가 아니라 같은 상황이 재현됩니다.
3. **오답** - 응답을 그대로 다시 보내 이어 가는 것은 서버 도구 루프가 상한에 닿은 `pause_turn`의 처리법입니다. 완료로 판단된 `end_turn`에는 적용되지 않습니다.
4. **정답** - 이미 완료로 판단된 턴을 그대로 다시 보내면 다시 완료 상태가 됩니다. 구조를 고친 뒤에도 비면 새 사용자 메시지로 계속 진행을 요청합니다.

> 💡 **시험 포인트:** `pause_turn`은 '그대로 다시 보내면 이어 간다', 빈 `end_turn`은 '그대로 다시 보내면 또 빈다'. 두 처리법을 바꿔 놓은 보기가 함정입니다.

> 📚 근거 문서: [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

---
