막아야 할 단어·패턴·대상을 **미리 적어 두고 일치하면 차단하는** 방식입니다. 목록에 없는 변형은 그대로 통과하므로 **우회에 약하다**는 한계가 있습니다.

## 문제 속 쓰임
> An engineer proposes a regular-expression **blocklist** of 300 known jailbreak phrases.
> 한 엔지니어가 알려진 탈옥 문구 300개로 된 정규식 **차단 목록**을 제안한다.

## 함께 쓰는 표현
- **regex blocklist** : 정규식 차단 목록
- **add to the blocklist** : 차단 목록에 올리다

## 비슷한 말 · 반대말
- **denylist** — 같은 뜻
- **allowlist** — 허용 목록 (적힌 것만 허용)

## 시험 포인트
"가장 싸고 믿을 만한 사전 스크린"을 물으면 문구 *blocklist* 가 아니라 **경량 모델(Claude Haiku 5.5) + structured outputs 판정**이 정답입니다. 고정 문구 목록은 철자 변형·다른 언어·인코딩으로 쉽게 피해 갑니다.
