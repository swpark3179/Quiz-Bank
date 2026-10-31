**일부러 해를 끼치려는 의도가 있는** 것을 말합니다. 보안 문맥에서는 공격 목적으로 만든 입력·콘텐츠·코드를 가리키며, 단순한 실수나 버그와는 구분됩니다.

## 문제 속 쓰임
> ...ask the main model in the same turn whether the feed looks **malicious** → return the feed if the main model calls it safe...
> ...같은 턴에서 메인 모델에게 피드가 **악성**으로 보이는지 묻는다 → 메인 모델이 안전하다고 하면 피드를 돌려준다...

## 함께 쓰는 표현
- **malicious content / input** : 악성 콘텐츠·입력
- **malicious actor** : 악의적 행위자, 공격자
- **malware** : 악성 소프트웨어

## 비슷한 말 · 반대말
- **adversarial** — 적대적인 (*adversarial instructions* 적대적 지시)
- **benign** — 무해한, 악의 없는 (반대말)

## 시험 포인트
메인 모델이 이미 내용을 읽은 뒤 스스로 판단하게 하면 격리 효과가 없어 **오답**입니다. 정답은 Claude 가 보기 **전에** 별도의 작은 분류 모델이 구조화된 판정을 내리고, 깨끗할 때만 `tool_result` 로 넘기는 것입니다.
