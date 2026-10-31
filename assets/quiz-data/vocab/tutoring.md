학생 한 명 한 명에게 맞춰 **공부를 도와주는 개인 지도**입니다. 문제에서는 *tutoring app* 처럼 학생의 질문에 답하고 약한 부분을 짚어 주는 **학습 도우미 앱**의 배경으로 자주 나옵니다. 가르치는 사람은 *tutor* 입니다.

## 문제 속 쓰임
> A **tutoring** app adds the memory tool (memory_20250818) so Claude can remember each student's weak topics across sessions.
> 한 **튜터링**(학습 도우미) 앱이 Claude 가 학생마다 약한 주제를 세션을 넘어 기억하도록 메모리 도구(memory_20250818)를 추가합니다.

## 함께 쓰는 표현
- **tutoring app** : 학습 도우미 앱
- **online tutoring** : 온라인 개인 지도
- **tutor** (명·동) : 개인 교사 / 가르치다

## 시험 포인트
메모리 도구는 **클라이언트 측**에서 동작합니다. Claude 는 파일 작업을 요청할 뿐이고, 앱의 핸들러가 앱이 통제하는 저장소에 쓴 뒤 결과를 `tool_result` 로 돌려줍니다. Anthropic 이 대신 보관해 주는 관리형 저장소는 없습니다.
