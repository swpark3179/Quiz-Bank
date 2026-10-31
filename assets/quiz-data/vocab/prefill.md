1. **(입력란을) 미리 채워 두다** — 사용자가 확인하거나 고치기만 하도록 값을 먼저 넣어 둔다
2. **(API) prefill** — 요청 끝에 assistant 메시지를 넣어 두면 Claude가 그 글 뒤를 이어 씁니다. 응답의 첫머리·형식을 정하는 기법입니다

## 문제 속 쓰임
> It opens the session picker with 'auth-refactor' **pre-filled** as a search term, because the CI host has no exact match
> CI 호스트에 정확히 일치하는 것이 없으므로 'auth-refactor'가 검색어로 **미리 채워진** 세션 선택기가 열린다.

> Send the partial output to a fallback model as a **prefilled** assistant turn so that it can continue the text.
> 부분 출력을 **프리필된** assistant 턴으로 대체 모델에 보내 그 텍스트를 이어 쓰게 한다.

## 함께 쓰는 표현
- **prefill the assistant turn** : assistant 턴을 미리 채우다
- **pre-filled search term** : 미리 채워진 검색어

## 시험 포인트
두 보기 모두 오답입니다. 검색어가 채워진 선택기는 이름이 **여러** 세션과 일치할 때 뜨고, 일치하는 세션이 없으면 찾지 못합니다. 또 4.6 이후 모델에서는 마지막 assistant 턴 프리필이 **400 오류**를 내고, 거절된 부분 출력은 이어 쓸 것이 아니라 폐기해야 합니다.
