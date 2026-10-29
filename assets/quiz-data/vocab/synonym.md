뜻이 같거나 아주 비슷한 **다른 말**입니다.

## 문제 속 쓰임
> Add a post-processing library with a **synonym** dictionary that normalizes severity wording before the grep step runs
> grep 단계가 실행되기 전에 **동의어** 사전을 가진 후처리 라이브러리를 추가해 심각도 표현을 정규화한다

## 함께 쓰는 표현
- **synonym dictionary / list** : 동의어 사전 / 목록
- **synonymous with** ~ : ~와 같은 뜻인

## 반대말
- **antonym** — 반의어

## 시험 포인트
"severe issue", "critical defect" 처럼 흔들리는 표현을 동의어 사전으로 맞추는 것은 자연어 파싱을 그대로 둔 오답입니다. `--output-format json` + `--json-schema` 로 **구조를 강제**하는 것이 정답입니다.
