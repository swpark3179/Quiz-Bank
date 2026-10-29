들어오는 것을 **받아들이는 단계·창구**입니다. 업무에서는 요청·문서가 처음 들어와 **접수되는 곳**을 말합니다.

## 문제 속 쓰임
> Even when the type is already known from the **intake** folder that routed the document, the caller still sends all six tools with tool_choice "auto"...
> 문서를 라우팅한 **접수** 폴더로 유형을 이미 알고 있는데도, 호출자는 여전히 여섯 도구를 모두 보내고 `tool_choice` 를 `"auto"` 로 둔다

## 함께 쓰는 표현
- **intake form / queue** : 접수 양식 / 접수 대기열
- **intake folder** : (처리 전 문서가 들어오는) 접수 폴더

## 시험 포인트
접수 단계에서 유형이 **이미 결정적으로 정해졌다면** 도구 선택을 모델에게 다시 맡길 이유가 없습니다. `tool_choice` 를 `{"type": "tool", "name": ...}` 로 **강제**하는 것이 정답입니다.
