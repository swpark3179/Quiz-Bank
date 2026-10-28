한 번에 다 하지 않고 **조금씩 단계적으로** 진행하거나 덧붙이는 것입니다. 작게 바꾸고 확인하는 좋은 습관을 말할 때도, *큰 그림 없이 그때그때 바꾸는* 방식을 말할 때도 씁니다.

## 문제 속 쓰임
> Start with direct execution and make changes **incrementally**, letting the implementation reveal the natural service boundaries.
> 직접 실행으로 시작해 **점진적으로** 변경하면서, 구현 과정에서 자연스러운 서비스 경계가 드러나게 한다.

## 함께 쓰는 표현
- **incremental changes / updates** : 점진적인 변경·업데이트
- **incremental build** : 바뀐 부분만 다시 빌드하는 방식
- **incremental** (형) 점진적인 · **increment** (명) 증가분

## 시험 포인트
수십 개 파일에 걸쳐 **되돌리기 어려운 구조 결정**이 필요한 작업에서 "일단 조금씩 바꿔 보며 경계를 찾자"는 선택지는 오답입니다. 이런 작업은 변경 전에 plan mode로 탐색·설계하는 것이 정석입니다.
