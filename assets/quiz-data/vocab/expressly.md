돌려 말하거나 짐작에 맡기지 않고 **분명하게 밝혀서**라는 뜻입니다. *explicitly* 와 비슷하며, 법·정책 문장에서 "명시적으로 허용·금지된"을 강조할 때 씁니다.

## 문제 속 쓰임
> ...confirming that the human review **expressly** passed, instead of relying on a separate boolean flag that can be set incorrectly.
> 잘못 설정될 수 있는 별도 불리언 플래그에 의존하는 대신, 사람 검토가 **분명히** 통과했는지 확인한다.

## 함께 쓰는 표현
- **expressly prohibited** : 명시적으로 금지된
- **expressly allowed** : 명시적으로 허용된

## 비슷한 말 · 반대말
- **explicitly** — 명시적으로 (거의 같은 뜻)
- **implicitly** — 암묵적으로

## 시험 포인트
게이트는 버그로 뒤집힐 수 있는 별도 플래그가 아니라, 도구 입력(`tool_input`)에 담긴 **분명한 확인 결과**를 PreToolUse 훅에서 검사해야 믿을 수 있습니다. PostToolUse 는 이미 실행된 환불을 막지 못해 오답입니다.
