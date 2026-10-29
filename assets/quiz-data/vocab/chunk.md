큰 데이터를 다루기 좋게 **잘라 낸 한 조각**, 또는 그렇게 자르는 것입니다. RAG 에서는 문서를 검색 단위로 나눈 조각을 말합니다.

## 문제 속 쓰임
> Split the document into 10k **chunks** and cache each **chunk** separately
> 문서를 1만 토큰 **청크**로 나눠 각각 따로 캐시한다
> The PDFs should be **chunked** into 1,000-token segments before ingestion
> PDF를 수집 전에 1,000토큰 단위로 **쪼개야** 한다

## 함께 쓰는 표현
- **chunking** (명) 청킹 — 문서를 조각으로 나누는 일
- **chunk size** : 조각 크기

## 시험 포인트
청크로 나누는 보기는 그럴듯하지만 오답인 경우가 많습니다. 같은 문서를 여러 사용자가 묻는 비용 문제는 문서를 **한 블록째 캐시**하고, 긴 대화의 품질 저하는 **요약/압축** 전략으로 풉니다.
