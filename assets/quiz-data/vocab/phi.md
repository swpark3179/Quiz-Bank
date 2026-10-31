환자 이름·진료 기록처럼 **특정 환자와 연결되는 건강 정보**를 말합니다. 미국 의료정보 보호법 HIPAA 가 이 정보를 보호 대상으로 정합니다.

## 문제 속 쓰임
> Compiled schemas are cached apart from message content without the same **PHI** protections, so **PHI** must stay in message content.
> 컴파일된 스키마는 메시지 내용과 따로, 같은 **PHI** 보호 없이 캐시되므로 **PHI** 는 메시지 내용에만 두어야 한다.

## 함께 쓰는 표현
- **HIPAA-enabled organization** : HIPAA 가 활성화된 조직
- **PHI protections** : PHI 보호 조치
- **keep PHI out of** ~ : ~에 PHI 를 넣지 않다

## 비슷한 말 · 반대말
- **PII** — 개인 식별 정보. 건강 정보에 한정되지 않는 더 넓은 말입니다

## 시험 포인트
structured outputs·`strict: true` 의 JSON 스키마는 컴파일되어 **메시지와 따로 캐시되고 PHI 보호를 받지 않습니다.** 그래서 속성 이름·`enum`·`const`·`pattern` 에 PHI 를 넣으면 안 되고, 환자 정보는 메시지 내용에만 둡니다.
