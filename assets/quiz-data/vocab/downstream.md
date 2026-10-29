강의 하류처럼, 처리 흐름에서 **뒤쪽 단계 — 앞 단계의 결과를 받아 쓰는 쪽**을 가리킵니다. 앞 단계는 *upstream* 입니다.

## 문제 속 쓰임
> Production logs show that 8% of extraction responses fail the **downstream** JSON.parse() step...
> 운영 로그를 보면 추출 응답의 8%가 **다운스트림** `JSON.parse()` 단계에서 실패한다.

## 함께 쓰는 표현
- **downstream system / consumer** : 결과를 받아 쓰는 뒤쪽 시스템
- **downstream check / validation** : 뒤 단계에서 하는 검사
- **propagate downstream** : (오류가) 뒤 단계로 번지다

## 반대말
- **upstream** — 앞 단계의, 상위의

## 시험 포인트
뒤 단계가 JSON 파싱에 실패한다면 프롬프트를 손보기보다 **도구 사용(tool use)·스키마로 출력 형식을 강제**하는 것이 확실한 해결입니다. 다만 스키마는 형식만 보장하므로 합계 불일치 같은 **의미 오류는 뒤 단계 검증**으로 따로 잡아야 합니다.
