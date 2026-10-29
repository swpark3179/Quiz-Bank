겉으로 잘 드러나지 않는 것을 **알아채거나 찾아내는** 것입니다. 시스템이 어떤 상태·신호를 "감지한다"고 할 때 씁니다.

## 문제 속 쓰임
> The engineer is parsing Claude's conversational text output to **detect** tool calls...
> ...Claude의 대화형 텍스트 출력을 파싱해 도구 호출을 **감지하고** 있다

## 함께 쓰는 표현
- **detect changes / errors** : 변경·오류를 감지하다
- **detection** (명) 감지, 탐지 (*fraud detection* 사기 탐지)
- **detected type** : 감지된 (문서) 유형

## 시험 포인트
도구 호출이나 완료 여부는 텍스트나 스트리밍으로 짐작해 감지하지 말고, API가 주는 **`stop_reason`**(`tool_use`, `end_turn`)으로 판단합니다.
