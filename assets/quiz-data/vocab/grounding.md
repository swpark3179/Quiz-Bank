모델의 답을 원문·자료에 **단단히 묶어, 근거 없는 내용이 나오지 않게 하는 것**입니다. *direct-quote grounding* 은 작업 전에 문서에서 글자 그대로의 인용을 먼저 뽑게 하고 그 인용만으로 답하게 하는 환각 줄이기 기법입니다.

## 문제 속 쓰임
> (a) citation verification, (b) direct-quote **grounding**, (c) best-of-N verification, (d) external knowledge restriction
> (a) 인용 검증, (b) 직접 인용 **근거화**, (c) Best-of-N 검증, (d) 외부 지식 제한

## 함께 쓰는 표현
- **grounded in** ~ : ~에 근거한
- **direct-quote grounding** : 직접 인용 근거화
- **ungrounded claim** : 근거 없는 주장

## 시험 포인트
인용을 **작업 전에** 먼저 뽑으면 *grounding*, 초안을 쓴 **뒤에** 주장마다 인용을 찾아 없으면 철회하면 인용 검증입니다. 같은 프롬프트를 여러 번 돌려 불일치를 찾는 것은 Best-of-N 입니다.
