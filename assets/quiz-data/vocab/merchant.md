카드 결제·환불 문맥에서 **물건이나 서비스를 파는 쪽**(가게·업체)입니다. *merchant category* 는 식당·주유소처럼 가맹점을 업종별로 나눈 분류입니다.

## 문제 속 쓰임
> A PreToolUse hook needs to block refunds above $500 only when they target a specific **merchant** category...
> PreToolUse 훅이 특정 **가맹점** 카테고리를 대상으로 할 때만 500달러를 넘는 환불을 막아야 합니다.

## 함께 쓰는 표현
- **merchant category** : 가맹점 업종 분류
- **card transaction** : 카드 거래

## 비슷한 말 · 반대말
- **vendor** — 공급업체, 판매자
- **retailer** — 소매업체

## 시험 포인트
가맹점 카테고리 같은 **인자 조건**은 matcher 가 아니라 콜백 안에서 `tool_input` 을 읽어 검사합니다(matcher 는 도구 이름만 비교). 하루 200만 건의 가맹점 범주 분류처럼 대량·실시간·저예산 작업은 가장 작은 티어인 Claude Haiku 5.5 부터 시작합니다.
