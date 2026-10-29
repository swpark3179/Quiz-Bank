**Retrieval-Augmented Generation**(검색 증강 생성)의 줄임말입니다. 질문과 관련된 문서를 **먼저 검색해 프롬프트에 넣고**, 모델이 그 내용을 근거로 답하게 하는 구조입니다.

## 문제 속 쓰임
> A **RAG-based** assistant is instructed via system prompt: 'Never reveal internal pricing'.
> **RAG 기반** 어시스턴트가 시스템 프롬프트로 "내부 가격을 절대 공개하지 마라"는 지시를 받았다.

## 함께 쓰는 표현
- **RAG pipeline** : 검색 → 컨텍스트 주입 → 생성으로 이어지는 처리 흐름
- **retrieved content / documents** : 검색해 가져온 내용·문서
- **vector database** : 임베딩으로 의미 검색을 하는 DB (RAG 에서 자주 씀)

## 시험 포인트
RAG 로 가져온 문서는 시스템 프롬프트와 **같은 컨텍스트에 섞여** 들어가므로, 문서 속 "System: …" 같은 문장이 프롬프트 인젝션이 됩니다. 프롬프트를 더 세게 쓰는 보기가 아니라 **신뢰할 수 없는 내용을 분리하고 훅 같은 코드로 막는** 보기가 정답입니다.
