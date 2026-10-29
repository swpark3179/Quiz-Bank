품질·성능이 **점점 나빠지는(떨어지는)** 것입니다. 갑자기 고장 나는 것이 아니라 **서서히 저하**된다는 느낌입니다.

## 문제 속 쓰임
> After turn 25, response quality **degrades** — the model starts forgetting earlier findings and repeating tool calls it already made.
> 25턴 이후 응답 품질이 **떨어져**, 모델이 앞서 찾은 내용을 잊고 이미 했던 도구 호출을 반복합니다.

## 함께 쓰는 표현
- **degrade in quality** : 품질이 떨어지다
- **graceful degradation** : 일부가 실패해도 기능을 줄여 계속 동작하게 하는 설계
- **degradation** (명) 저하

## 시험 포인트
긴 대화나 장황한 출력 때문에 품질이 떨어지면, 더 큰 컨텍스트 창보다 **요약·압축, 출력 정리, 서브에이전트(`context: fork`)로 격리**하는 보기가 정답입니다.
