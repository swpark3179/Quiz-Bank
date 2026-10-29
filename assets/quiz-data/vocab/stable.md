쉽게 흔들리거나 바뀌지 않고 **일정하게 유지되는** 상태입니다. 출력에 쓰면 "실행마다 같은 결과가 나오는"이라는 뜻입니다.

## 문제 속 쓰임
> Set temperature to 0 so the phrasing of findings stays **stable** between runs and the grep matches consistently
> temperature를 0으로 설정해 실행 간 발견 사항의 표현이 **안정되고** grep이 일관되게 매칭되도록 한다

## 함께 쓰는 표현
- **stable output / API** : 안정된 출력 / API
- **stability** (명) 안정성

## 반대말
- **flaky** — (같은 조건에서도) 됐다 안 됐다 하는
- **unstable** — 불안정한

## 시험 포인트
temperature 0 으로도 출력이 완전히 같아진다는 보장은 없습니다. 기계가 읽을 결과는 **구조화된 출력(JSON 스키마)** 으로 받아야 안정적입니다.
