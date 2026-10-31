1. **(데이터) 상주 위치** — 데이터가 **어느 지역에서 저장·처리되는지**. *data residency* 는 그 지역을 정하거나 보장하는 것을 말합니다
2. **거주** — 사람이 어떤 곳에 사는 것 (*permanent residency* 영주권)

## 문제 속 쓰임
> It also needs Claude API features such as per-request `inference_geo` **residency** controls and beta features passed through `anthropic-beta` headers, available as soon as they ship.
> 동시에 요청 단위 `inference_geo` 데이터 **레지던시** 제어나 `anthropic-beta` 헤더로 전달하는 베타 기능 같은 Claude API 기능을 출시 즉시 써야 한다.

## 함께 쓰는 표현
- **data residency** : 데이터 상주 위치(레지던시)
- **residency controls** : 처리 지역을 지정하는 설정
- **US-only data residency** : 미국 안에서만 처리

## 시험 포인트
"**AWS 로 청구 + Claude API 와 같은 기능**(`inference_geo` 포함)"이면 Claude Platform on AWS 입니다. Amazon Bedrock 은 추론 지역을 엔드포인트·추론 프로파일로 정해 `inference_geo` 가 적용되지 않습니다. 데이터 레지던시 가격 배수는 fast mode 등 다른 가격 기능과 겹쳐 적용됩니다.
