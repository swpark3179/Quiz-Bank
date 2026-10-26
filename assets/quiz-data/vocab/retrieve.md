저장된 곳에서 **찾아서 꺼내 오는** 것입니다. AI 분야에서는 명사 *retrieval* 로 "필요한 정보를 검색해 가져오기"(RAG의 R)를 뜻할 때가 많습니다.

## 문제 속 쓰임
> Store findings in a vector database and give the synthesis agent **retrieval** tools to query during its work
> 결과를 벡터 DB에 저장하고, 합성 에이전트에게 작업 중 조회할 수 있는 **검색** 도구를 준다.

## 함께 쓰는 표현
- **data retrieval** : 데이터 조회
- **retrieval tool** : 검색(조회) 도구
- **retrieval-augmented generation (RAG)** : 검색 증강 생성
- **retrieve A from B** : B에서 A를 가져오다

## 비슷한 말
- **fetch** — (네트워크·저장소에서) 가져오다
- **look up** — 조회하다

## 시험 포인트
외부 저장소·벡터 DB에 **retrieval 을 새로 붙이는** 보기는 인프라가 무거워 과잉 설계로 오답 처리되는 경우가 많습니다. 상류 에이전트가 구조화된 데이터를 돌려주게 하거나 핵심 사실을 따로 보관하는 것처럼 더 단순한 방법이 있는지 먼저 보세요.
