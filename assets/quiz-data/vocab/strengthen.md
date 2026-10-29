이미 있는 것을 **더 세게·튼튼하게** 만드는 것입니다. 문제에서는 프롬프트 지시를 더 강한 말로 고쳐 쓰는 것을 가리킵니다.

## 문제 속 쓰임
> **Strengthen** the system prompt with an emphatic "ALWAYS classify before extracting" rule plus two worked examples.
> 시스템 프롬프트를 강조형 "ALWAYS classify before extracting" 규칙과 풀이 예시 두 개로 **강화한다**

## 함께 쓰는 표현
- **strengthen the prompt / instructions** : 프롬프트·지시를 강화하다
- **strengthen validation** : 검증을 강화하다

## 반대말
- **weaken** — 약하게 하다

## 시험 포인트
첫 단계가 **항상 같은 도구**여야 한다면, 프롬프트 강화가 아니라 이름을 지정한 `tool_choice`(`{"type":"tool","name":"classify_document"}`)로 강제하는 것이 정답입니다.
