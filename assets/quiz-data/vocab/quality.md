결과물이 **얼마나 좋은지(질)** 를 말합니다. 문제에서는 응답·답변의 품질이 "떨어진다(degrade)"는 증상으로 자주 나옵니다.

## 문제 속 쓰임
> After turn 25, response **quality** degrades — the model starts forgetting earlier findings and repeating tool calls it already made.
> 25턴 이후 응답 **품질**이 떨어져, 모델이 앞서 찾은 내용을 잊고 이미 했던 도구 호출을 반복한다.

## 함께 쓰는 표현
- **quality degrades / drops** : 품질이 떨어지다
- **output quality** : 출력 품질
- **high-quality / low-quality** : 질 높은 / 질 낮은

## 시험 포인트
긴 대화나 장황한 탐색 뒤에 품질이 떨어지면 원인은 대개 **컨텍스트에 쌓인 내용**입니다. 더 큰 컨텍스트 창보다 요약·압축, 출력 다듬기, 서브에이전트나 `context: fork` 로 격리하는 보기가 정답 쪽입니다.
