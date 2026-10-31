*standard error* 의 줄임말로, 프로그램이 **정상 결과(stdout)와 따로 오류·경고 메시지를 내보내는 출력 통로**입니다. 결과와 섞이지 않게 분리되어 있어, 훅이나 스크립트가 "왜 막았는지·무엇이 문제인지"를 알릴 때 이 통로를 씁니다.

## 문제 속 쓰임
> (a) shows **stderr** to Claude after the tool already ran; (b) blocks the call before it runs; ...
> (a) 도구가 이미 실행된 뒤 **stderr**(오류 메시지)를 Claude 에 보여 준다, (b) 실행 전에 호출을 막는다, ...

## 함께 쓰는 표현
- **print to stderr** : 표준 오류로 출력하다
- **exit with code 2** : 종료 코드 2로 끝나다 (훅에서 stderr 가 Claude 에 전달됨)
- **stderr message** : 오류 출력 내용

## 비슷한 말 · 반대말
- **stdout** — 표준 출력. 정상 결과가 나가는 통로

## 시험 포인트
같은 exit 2 라도 이벤트에 따라 다릅니다. **PreToolUse** 는 실행 전이라 호출을 막고 stderr 가 거부 사유가 되지만, **PostToolUse** 는 도구가 이미 실행된 뒤라 막지 못하고 stderr 를 Claude 에 보여 줄 뿐입니다.
