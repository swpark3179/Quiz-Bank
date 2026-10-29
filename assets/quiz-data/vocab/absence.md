있어야 할 값·정보가 **없다는 사실 그 자체**를 말합니다. 형용사 *absent* 는 "없는, 빠져 있는"입니다.

## 문제 속 쓰임
> ...audit logs show Claude inventing plausible-looking PO numbers about 11% of the time instead of signaling **absence**.
> 감사 로그를 보면 Claude가 약 11%의 경우 **값이 없다고** 알리는 대신 그럴듯해 보이는 PO 번호를 지어냅니다.
> ...the tax ID is physically cut off at the page edge and simply **absent** from the source text...
> 세금 ID가 페이지 가장자리에서 물리적으로 잘려 원문 텍스트에 아예 **없는**...

## 함께 쓰는 표현
- **in the absence of** ~ : ~이 없을 때, ~이 없는 상황에서
- **absent from** ~ : ~에 빠져 있는, 없는

## 반대말
- **presence** — 있음, 존재 · **present** (형) 있는

## 시험 포인트
원문에 값이 없을 수 있는 필드는 **nullable** 로 두고 "없으면 null" 을 지시하는 것이 정답입니다. 원문에 **아예 없는** 정보는 재시도를 늘려도 생기지 않으므로 null 을 돌려주고 사람 검토로 보냅니다.
