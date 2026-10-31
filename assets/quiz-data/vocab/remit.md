어떤 사람·팀·에이전트가 **맡아서 처리하도록 정해진 업무 범위**입니다. 주로 *outside one's remit*(자기 소관 밖의) 형태로 "맡지 않은 일에 손을 댄다"는 장면에 씁니다.

## 문제 속 쓰임
> The team reports agents occasionally reaching for tools clearly outside their **remit**, like the QA agent invoking a deploy tool.
> QA 에이전트가 배포 도구를 부르는 것처럼, 에이전트가 명백히 자기 **소관** 밖의 도구를 쓰는 일이 가끔 있다고 팀이 보고한다.

## 함께 쓰는 표현
- **outside / within one's remit** : 소관 밖의 / 소관 안의
- **a narrow remit** : 좁은 업무 범위

## 비슷한 말 · 반대말
- **scope** — 범위 (거의 같은 뜻)
- **responsibility** — 책임, 맡은 일

## 시험 포인트
소관 밖 도구 오용은 **각 에이전트의 도구 세트를 역할에 필요한 것으로 제한**해 풉니다. 이때 `tool_choice` 는 `auto` 로 두어야 에이전트가 매 턴 도구를 쓸지 스스로 정할 수 있습니다(`any`·`none`·특정 도구 강제는 오답).
