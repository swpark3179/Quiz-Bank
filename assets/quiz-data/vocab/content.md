문서·메시지 **안에 담긴 내용물**입니다. Claude API에서는 메시지의 `content` 가 텍스트·`tool_use`·`tool_result` 같은 **콘텐츠 블록의 배열**입니다.

## 문제 속 쓰임
> ...to detect tool calls instead of using the structural `stop_reason` and `tool_use` **content** blocks
> 구조화된 `stop_reason` 과 `tool_use` **콘텐츠** 블록 대신 ... 도구 호출을 감지하고 있다
> ...tool calls made in direct response to retrieved document **content** without user confirmation
> 검색·업로드된 문서 **내용**에 직접 반응해 이뤄진 도구 호출을 사용자 확인 없이는...

## 함께 쓰는 표현
- **content block** : 응답을 이루는 블록 하나 (`text`, `tool_use` 등)
- **untrusted content** : 신뢰할 수 없는 외부 내용 (업로드 문서·웹 페이지)
- **table of contents** : 목차

## 시험 포인트
도구 호출은 텍스트를 파싱하지 말고 **`stop_reason` 과 `tool_use` 콘텐츠 블록**으로 판단합니다. 또 문서 내용 속 지시(프롬프트 인젝션)는 신뢰할 수 없는 콘텐츠로 분리해 다뤄야 합니다.
