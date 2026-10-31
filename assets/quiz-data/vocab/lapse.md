1. **(기간이 지나) 효력을 잃다, 만료되다** — 누가 끄는 것이 아니라 정해진 기간이 끝나 권한·계약·키가 **저절로 무효가 되는** 것
2. **작은 실수, 깜빡함** — *a lapse in judgment* 판단 착오, *memory lapse* 깜빡 잊음

## 문제 속 쓰임
> Session-level grants **lapse** after a set number of turns, and the resumed history had already passed that point
> 세션 단위 허용은 정해진 턴 수가 지나면 **만료되는데**, 재개된 이력이 이미 그 지점을 지났다

## 함께 쓰는 표현
- **lapse after** ~ : ~이 지나면 효력을 잃다
- **let ~ lapse** : (갱신하지 않고) ~을 만료되게 두다
- **lapsed** (형) 만료된, 실효된

## 비슷한 말 · 반대말
- **expire** — 만료되다 (거의 같은 뜻, 기술 문서에서 더 흔함)
- **revoke** — 일부러 취소하다. 저절로 끝나는 *lapse* 와 다릅니다

## 시험 포인트
위 보기는 오답입니다. 세션 단위 허용에는 턴 기반 만료가 없고, `--fork-session` 포크가 새 프로세스로 시작해 허용을 물려받지 않을 뿐입니다. API 키 만료는 생성 시 고정되어 늘릴 수 없으므로, 만료 전에 **새 키를 만들어 교체**합니다.
