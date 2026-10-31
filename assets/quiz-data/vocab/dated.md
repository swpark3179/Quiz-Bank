1. **(ID·버전에) 날짜가 붙은** — `claude-haiku-4-5-20251001` 처럼 끝에 날짜가 있는 것입니다. *dateless* 는 날짜가 없는 것
2. **낡은, 시대에 뒤진** — 일상에서 더 흔한 뜻입니다 (*a dated design* 낡은 디자인)

## 문제 속 쓰임
> A team hard-codes `claude-sonnet-4-6` in its service, believing that this **dateless** ID will automatically move to newer Sonnet releases.
> 한 팀이 이 **날짜 없는** ID가 새 Sonnet 출시를 자동으로 따라간다고 믿고 서비스에 `claude-sonnet-4-6`을 하드코딩했다.

> (b) a pointer to the newest **dated** snapshot of that minor version...
> (b) 그 마이너 버전의 가장 최신 **날짜 붙은** 스냅숏을 가리키는 포인터...

## 함께 쓰는 표현
- **dated snapshot** : 날짜가 붙은 고정 스냅숏
- **out of date / up to date** : 낡은 / 최신의

## 시험 포인트
4.6 이후 모델의 *dateless* ID(예: `claude-sonnet-4-6`)는 포인터가 아니라 **하나의 고정 스냅숏**이라 새 버전이 나와도 바뀌지 않습니다. 4.6 이전의 날짜 없는 이름(예: `claude-sonnet-4-5`)은 그 마이너 버전의 최신 *dated* 스냅숏을 가리키는 별칭입니다.
