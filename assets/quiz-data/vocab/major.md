**크고 중요한** 것을 뜻합니다. 버그·문제에 붙이면 "심각한, 큰" 정도로, 심각도 등급에서는 보통 *critical* 보다 한 단계 아래입니다.

## 문제 속 쓰임
> ...Claude phrases severe findings differently each run — "severe issue," "**major** bug," "critical defect."
> Claude가 심각한 발견 사항을 실행할 때마다 "severe issue", "**major** bug", "critical defect"처럼 다르게 표현합니다.

## 함께 쓰는 표현
- **major issue** : 중대한 문제
- **major version** : 메이저 버전 (호환이 깨질 수 있는 큰 변경)

## 반대말
- **minor** — 사소한, 작은

## 시험 포인트
같은 심각도를 *major / severe / critical* 처럼 매번 다르게 쓰는 자연어 출력을 grep 으로 판정하면 불안정합니다. `--output-format json` + `--json-schema` 로 **구조화된 필드**를 받는 보기가 정답입니다.
