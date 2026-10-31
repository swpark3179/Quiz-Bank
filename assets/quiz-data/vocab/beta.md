정식 출시 전에 **먼저 써 볼 수 있게 열어 둔 시험 단계**입니다. Claude API에서는 요청에 `anthropic-beta` 헤더를 붙여 해당 베타 기능을 켭니다.

## 문제 속 쓰임
> It also needs Claude API features such as per-request `inference_geo` residency controls and **beta** features passed through `anthropic-beta` headers, available as soon as they ship.
> 동시에 요청 단위 `inference_geo` 데이터 레지던시 제어나 `anthropic-beta` 헤더로 전달하는 **베타** 기능 같은 Claude API 기능을 출시 즉시 써야 한다.

## 함께 쓰는 표현
- **beta header** : 베타 기능을 켜는 요청 헤더
- **in beta** : 베타 단계인
- **general availability (GA)** : 정식 출시

## 시험 포인트
"AWS 청구서로 결제 + *beta* 기능을 Claude API와 같은 시점에 사용"이면 Anthropic이 운영하는 **Claude Platform on AWS**가 정답입니다(Bedrock은 AWS가 운영해 기능이 Bedrock 일정을 따름). 폐기 예정 모델을 쓰려면 *beta* 헤더가 필요하다는 보기는 오답입니다.
