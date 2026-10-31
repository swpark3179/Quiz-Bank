*Zero Data Retention* 의 줄임말로, 조직이 Anthropic 과 맺는 **요청·응답 데이터를 보관하지 않기로 한 약정**입니다. 다만 데이터를 저장해 두어야 동작하는 기능(예: Batch API)은 대상이 아니라서, 그런 기능을 쓰면 **그 데이터에 한해 ZDR 밖**이 됩니다.

## 문제 속 쓰임
> An organization has a **zero data retention** (ZDR) arrangement with Anthropic.
> 한 조직이 Anthropic 과 **무보존(ZDR)** 약정을 맺고 있습니다.

## 함께 쓰는 표현
- **ZDR arrangement** : ZDR 약정
- **covered by ZDR** : ZDR 적용을 받는
- **data retention** : 데이터 보존

## 비슷한 말 · 반대말
- **HIPAA-ready** — HIPAA 준비 조직. 비대상 기능을 400 으로 **막는다**는 점이 ZDR 과 다름

## 시험 포인트
ZDR 조직이 Batch API 를 쓰면 **막히지 않고 실행되지만**, 그 데이터는 배치 자체의 보존 정책(결과 29일 보관)을 따릅니다. 또 ZDR 은 **조직마다 따로** 켜므로, 같은 계정에 새로 만든 조직에는 자동으로 적용되지 않습니다.
