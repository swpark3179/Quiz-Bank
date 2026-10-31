진행을 **막지(*block*) 않는** 것입니다. 훅 문맥의 비차단 오류는 훅이 실패했어도 **도구 호출은 그대로 진행되고 알림만 뜨는** 경우를 말합니다. 프로그래밍 일반에서는 결과를 기다리느라 멈추지 않는 방식(*non-blocking I/O*)을 뜻합니다.

## 문제 속 쓰임
> ...(d) **non-blocking** error, so the call proceeds
> (d) **비차단** 오류이므로 호출이 진행된다

## 함께 쓰는 표현
- **non-blocking error** : 비차단 오류 (알림만 뜨고 진행)
- **blocking error** : 차단 오류 (호출을 막음)

## 비슷한 말 · 반대말
- **blocking** — 막는, 차단하는 (반대말)

## 시험 포인트
PreToolUse 훅에서 exit 2 = 차단(사유가 Claude 에 전달), exit 0 + 출력 없음 = 결정 없음, exit 0 + JSON = JSON 대로, **exit 1 + 일반 텍스트 = 비차단 오류**입니다. 정책 훅에서 exit 1 을 쓰면 아무것도 막지 못합니다.
