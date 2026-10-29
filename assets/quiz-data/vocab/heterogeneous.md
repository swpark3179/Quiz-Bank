성질·형식이 **서로 다른 것들이 섞여 있는** 상태입니다. 데이터에서는 출처마다 날짜 형식·통화 표기가 제각각인 것처럼 **형식이 통일되지 않은** 경우를 말합니다.

## 문제 속 쓰임
> Logs show the model occasionally misreads these **heterogeneous** fields, e.g., treating a refund amount in the wrong units.
> 로그를 보면 모델이 이런 **이질적인** 필드를 가끔 잘못 읽어, 예를 들어 환불 금액을 잘못된 단위로 해석한다.

## 함께 쓰는 표현
- **heterogeneous data / sources** : 형식이 제각각인 데이터 / 출처
- **heterogeneity** (명) 이질성

## 반대말
- **homogeneous** — 균질한, 같은 종류로 이루어진
- **uniform**, **canonical** — 통일된, 표준 형식의

## 시험 포인트
도구 출력 형식이 **제각각이라** 모델이 잘못 읽는다면, 컨텍스트에 들어가기 전에 **PostToolUse 훅으로 하나의 표준 스키마로 정규화**하는 보기가 정답입니다.
