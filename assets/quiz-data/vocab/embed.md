어떤 것을 다른 것 **안에 끼워 넣다, 심어 두다** 라는 뜻입니다. 보안 문제에서는 문서 안에 **몰래 심어 둔 지시문**, 멀티 에이전트 문제에서는 **프롬프트 안에 맥락을 직접 넣는 것**을 말합니다.

## 문제 속 쓰임
> ...Claude can retrieve HR data when users **embed** instructions in uploaded PDF documents...
> 사용자가 업로드한 PDF에 지시를 **심어 두면** Claude가 HR 데이터를 조회한다
> Have the coordinator **embed** the web-search and document-analysis findings verbatim in the synthesis Task prompt
> 코디네이터가 웹 검색과 문서 분석의 발견 사항을 합성 Task 프롬프트에 원문 그대로 **넣게** 한다

## 함께 쓰는 표현
- **embed A in B** : A를 B 안에 넣다
- **embedded instructions** : (문서 속에) 숨겨 넣은 지시 — 프롬프트 인젝션의 전형

## 시험 포인트
서브에이전트는 코디네이터의 대화를 **물려받지 않으므로**, 필요한 결과·맥락은 Task 프롬프트에 **직접 넣어 전달**해야 합니다. 또 문서 속에 심긴 지시는 명령이 아니라 **데이터**로 다뤄야 합니다.
