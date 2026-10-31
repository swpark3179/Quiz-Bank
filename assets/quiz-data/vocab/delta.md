전체를 다시 보내지 않고 **이전 상태에서 바뀐 부분만** 담은 조각입니다. 스트리밍에서는 응답이 `content_block_delta` 이벤트로 조금씩 도착하고, 클라이언트가 이를 이어 붙여 전체를 만듭니다.

## 문제 속 쓰임
> A streaming client renders each content block in its own UI panel and wants to mark a panel as complete as soon as Claude will send no more **deltas** for that block.
> 한 스트리밍 클라이언트가 콘텐츠 블록마다 별도의 UI 패널을 그리고, Claude가 그 블록에 더는 **델타**를 보내지 않는 즉시 패널을 완료로 표시하려 한다.

## 함께 쓰는 표현
- **`text_delta`** : 텍스트 블록에 이어 붙일 조각
- **`input_json_delta`** : 도구 입력의 부분 JSON 문자열
- **`message_delta`** : 메시지 수준 변경 (`stop_reason` 등)

## 시험 포인트
블록 하나에 더 이상 *delta* 가 오지 않는다는 신호는 그 블록 `index` 의 **`content_block_stop`** 입니다(`message_stop` 은 스트림 전체 종료). `input_json_delta` 의 `partial_json` 은 부분 문자열이라 모았다가 블록이 끝날 때 파싱합니다.
