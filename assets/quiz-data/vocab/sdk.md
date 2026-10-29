**Software Development Kit** 의 약자로, 어떤 플랫폼·서비스용 프로그램을 만들 때 쓰는 **라이브러리와 도구 묶음**입니다. 시험에서는 주로 *Claude Agent SDK* 로 나옵니다.

## 문제 속 쓰임
> Store the confirmed customer record in a global variable that the **SDK** automatically injects into every spawned subagent's context at startup.
> 확인된 고객 레코드를 전역 변수에 저장해, **SDK**가 생성되는 모든 서브에이전트의 컨텍스트에 시작 시점에 자동으로 주입하게 한다

## 함께 쓰는 표현
- **Claude Agent SDK** : 에이전트를 만들기 위한 Claude 의 SDK
- **Python / TypeScript SDK** : 언어별 SDK

## 시험 포인트
SDK 가 컨텍스트를 서브에이전트에 **자동으로 넣어 주는 기능은 없습니다**. 서브에이전트는 빈 기록에서 시작하므로, 필요한 사실·식별자는 **Task 프롬프트에 명시적으로** 담아야 합니다.
