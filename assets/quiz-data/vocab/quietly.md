**누구에게도 묻거나 알리지 않고** 일을 처리하는 모습을 말합니다. 기술 문제에서는 "사람 확인도, 추가 턴도 없이 자동으로"라는 조건을 담는 말입니다.

## 문제 속 쓰임
> A PreToolUse hook must **quietly** redirect every Write call from the project directory into a scratch directory, with no human prompt and without asking Claude to retry.
> PreToolUse 훅이 프로젝트 디렉터리로 향하는 모든 Write 호출을 사람 확인 없이, Claude 에게 재시도를 요청하지도 않고 **조용히** 임시 디렉터리로 돌려야 한다.

## 함께 쓰는 표현
- **quietly redirect / rewrite** : 조용히 돌리다 / 고치다
- **fail quietly** : 오류를 알리지 않고 실패하다

## 비슷한 말 · 반대말
- **silently** — 소리 없이 (거의 같은 뜻)
- **explicitly** — 명시적으로, 드러내 놓고

## 시험 포인트
"조용히 입력을 고쳐 실행" = `permissionDecision: "allow"` + `updatedInput` 입니다. `ask` 는 사람에게 묻고, `deny` 는 재시도 턴을 만들고, `defer` 는 `updatedInput` 을 무시합니다. 한편 "폐기 예정 모델 요청을 API 가 *quietly* 대체 모델로 보낸다"는 보기는 오답입니다(자동 전환 없음).
