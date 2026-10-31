사람이나 사회에 **해를 끼칠 수 있는** 것을 말합니다. AI 안전 문맥에서 *harmful content* 는 위험·불법·악용 가능한 내용을, *harmlessness* 는 그런 해를 끼치지 않는 성질을 가리킵니다.

## 문제 속 쓰임
> (a) **harmlessness** screen, (b) input validation, (c) prompt engineering, (d) responding to repeat offenders
> (a) **무해성** 스크린, (b) 입력 검증, (c) 프롬프트 엔지니어링, (d) 반복 위반자 대응

## 함께 쓰는 표현
- **harmful content** : 유해한 콘텐츠
- **harmlessness screen** : 무해성 스크린 (메인 모델 전에 입력을 분류하는 경량 모델)
- **harmless** : 무해한

## 비슷한 말 · 반대말
- **malicious** — 악의적인 (의도에 무게)
- **benign** — 무해한, 양성의

## 시험 포인트
메인 모델이 보기 **전에** 경량 모델이 입력을 분류하면 *harmlessness screen*, 알려진 탈옥 문구와 대조하면 입력 검증입니다. 메인 모델이 답변 첫머리에 유해 여부를 밝히게 하는 것은 이미 처리한 뒤라 사전 스크린이 아닙니다.
