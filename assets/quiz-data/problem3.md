> 기출문제
# 251219 오전 연습문제

---

## 문제
LLM에서 "70B"가 의미하는 파라미터 개수는?
1. 7억 개
2. 70억 개
3. 700억 개
4. 7000억 개
5. 7조 개

## 정답
3

## 해설
**7억 개**: 틀렸습니다. 이는 0.7B에 해당합니다.

**70억 개**: 틀렸습니다. 이는 7B에 해당합니다.

**700억 개**: 정답입니다. B는 Billion(10억)을 의미하므로, 70B = 70 × 10억 = 700억 개입니다.

**7000억 개**: 틀렸습니다. 이는 700B에 해당합니다.

**7조 개**: 틀렸습니다. 이는 7T(Trillion)에 해당합니다.

---

## 문제
pandas DataFrame에서 최초 5개 행을 조회하는 함수는?
1. first()
2. head()
3. top()
4. take()
5. preview()

## 정답
2

## 해설
**first()**: DataFrame의 첫 번째 행만 반환하거나, 시계열 데이터에서 특정 기간의 첫 데이터를 반환합니다.

**head()**: 정답입니다. 기본적으로 DataFrame의 처음 5개 행을 반환합니다. head(n)으로 n개 행을 지정할 수도 있습니다.

**top()**: pandas에 존재하지 않는 메서드입니다.

**take()**: 인덱스 위치를 기반으로 특정 행을 선택하지만, 기본 5개를 반환하지는 않습니다.

**preview()**: pandas에 존재하지 않는 메서드입니다.

---

## 문제
RAGAS(RAG Assessment) 평가 지표 중 검색된 컨텍스트가 질문에 대한 정답을 얼마나 잘 포함하고 있는지 측정하는 지표는?
1. Answer Relevancy
2. Context Recall
3. Context Precision
4. Faithfulness
5. Answer Correctness

## 정답
2

## 해설
**Answer Relevancy**: 생성된 답변이 질문과 얼마나 관련이 있는지 측정합니다.

**Context Recall**: 정답입니다. 실제 정답에 필요한 정보가 검색된 컨텍스트에 얼마나 포함되어 있는지 측정합니다. 컨텍스트가 정답을 생성하는 데 충분한 정보를 제공하는지 평가합니다.

**Context Precision**: 검색된 컨텍스트 중 실제로 관련 있는 정보의 비율을 측정합니다.

**Faithfulness**: 생성된 답변이 검색된 컨텍스트에 충실한지 측정합니다.

**Answer Correctness**: 생성된 답변이 정답과 얼마나 일치하는지 측정합니다.

---

## 문제
이미지, 텍스트 등의 데이터를 임베딩 벡터로 저장하고 의미 기반 검색을 수행하는 데이터베이스는?
1. 관계형 데이터베이스 (RDBMS)
2. 벡터 데이터베이스
3. 키-값 데이터베이스
4. 문서 데이터베이스
5. 그래프 데이터베이스

## 정답
2

## 해설
**관계형 데이터베이스 (RDBMS)**: 테이블 형태로 데이터를 저장하고 SQL로 조회합니다. 벡터 유사도 검색에 최적화되어 있지 않습니다.

**벡터 데이터베이스**: 정답입니다. 고차원 벡터 데이터를 저장하고 유사도 기반 검색을 효율적으로 수행합니다. Pinecone, Milvus, Chroma, Weaviate 등이 대표적입니다.

**키-값 데이터베이스**: 키와 값 쌍으로 데이터를 저장합니다 (예: Redis).

**문서 데이터베이스**: JSON 등의 문서 형태로 저장합니다 (예: MongoDB).

**그래프 데이터베이스**: 노드와 엣지로 관계를 표현합니다 (예: Neo4j).

---

## 문제
RAFT(Retrieval-Augmented Fine-Tuning)에 대한 설명으로 올바른 것은?
1. 강화학습을 사용하여 모델을 학습시키는 기법이다
2. 양자화를 통해 모델 크기를 줄이는 기법이다
3. RAG 형식의 데이터로 모델을 Fine-tuning하여 검색 능력을 강화하는 기법이다
4. 프롬프트 엔지니어링 기법의 일종이다
5. 토큰화 방식을 개선하는 기법이다

## 정답
3

## 해설
**강화학습을 사용하여 모델을 학습시키는 기법이다**: 틀렸습니다. RAFT는 SFT(Supervised Fine-Tuning) 기반입니다.

**양자화를 통해 모델 크기를 줄이는 기법이다**: 틀렸습니다. 이것은 Quantization에 대한 설명입니다.

**RAG 형식의 데이터로 모델을 Fine-tuning하여 검색 능력을 강화하는 기법이다**: 정답입니다. RAFT는 관련 문서(Positive)와 관련 없는 문서(Negative)를 함께 제공하여, 모델이 노이즈 속에서 핵심 정보를 찾아 답변하도록 학습시킵니다.

**프롬프트 엔지니어링 기법의 일종이다**: 틀렸습니다. RAFT는 모델 학습 기법입니다.

**토큰화 방식을 개선하는 기법이다**: 틀렸습니다. 토큰화와는 관련이 없습니다.

---

## 문제
NumPy에서 행렬 A의 전치 행렬(Transpose)을 구하는 방법은?
1. A.reverse()
2. A.T
3. A.flip()
4. A.invert()
5. A.rotate()

## 정답
2

## 해설
**A.reverse()**: NumPy 배열에 존재하지 않는 메서드입니다.

**A.T**: 정답입니다. NumPy에서 배열의 전치(행과 열을 바꿈)를 반환하는 속성입니다. np.transpose(A)와 동일한 결과를 반환합니다.

**A.flip()**: 배열을 뒤집는 것이지, 전치가 아닙니다.

**A.invert()**: NumPy 배열에 존재하지 않는 메서드입니다.

**A.rotate()**: NumPy 배열에 존재하지 않는 메서드입니다.

---

## 문제
LangChain의 RunnablePassthrough()에 대한 설명으로 올바른 것은?
1. 체인 실행을 중단시킨다
2. 입력을 그대로 다음 단계로 전달한다
3. 모든 출력을 필터링한다
4. 에러를 처리한다
5. 비동기 실행을 강제한다

## 정답
2

## 해설
**체인 실행을 중단시킨다**: 틀렸습니다. 실행을 중단하지 않습니다.

**입력을 그대로 다음 단계로 전달한다**: 정답입니다. RunnablePassthrough()는 입력 데이터를 변환 없이 그대로 다음 단계로 전달합니다. 주로 RunnableParallel과 함께 사용하여 원본 입력을 보존하면서 다른 처리를 병렬로 수행할 때 활용됩니다.

**모든 출력을 필터링한다**: 틀렸습니다. 필터링 기능이 아닙니다.

**에러를 처리한다**: 틀렸습니다. 에러 처리와 관련이 없습니다.

**비동기 실행을 강제한다**: 틀렸습니다. 비동기 실행과 관련이 없습니다.

---

## 문제
LangChain의 RunnableParallel()에 대한 설명으로 올바른 것은?
1. 체인을 순차적으로 실행한다
2. 여러 Runnable을 병렬로 동시에 실행한다
3. 반복 실행을 담당한다
4. 캐싱을 수행한다
5. 로깅을 담당한다

## 정답
2

## 해설
**체인을 순차적으로 실행한다**: 틀렸습니다. 순차 실행은 '|' (파이프) 연산자로 수행합니다.

**여러 Runnable을 병렬로 동시에 실행한다**: 정답입니다. RunnableParallel은 여러 개의 Runnable을 동시에 실행하고, 각 결과를 딕셔너리 형태로 반환합니다. 예: `RunnableParallel(context=retriever, question=RunnablePassthrough())`

**반복 실행을 담당한다**: 틀렸습니다. 반복 실행 기능이 아닙니다.

**캐싱을 수행한다**: 틀렸습니다. 캐싱과 관련이 없습니다.

**로깅을 담당한다**: 틀렸습니다. 로깅 기능이 아닙니다.

---

## 문제
예시를 주지 않고 "단계별로 생각해보자(Let's think step by step)"와 같은 문구로 추론을 유도하는 기법은?
1. Few-shot Prompting
2. Zero-shot Chain-of-Thought (Zero-shot CoT)
3. In-context Learning
4. Prompt Chaining
5. Self-Consistency

## 정답
2

## 해설
**Few-shot Prompting**: 몇 가지 예시를 제공하는 기법으로, 예시 없이 사용하는 Zero-shot과 다릅니다.

**Zero-shot Chain-of-Thought (Zero-shot CoT)**: 정답입니다. 예시 없이(Zero-shot) "Let's think step by step"과 같은 문구만 추가하여 모델이 단계별 추론을 수행하도록 유도하는 기법입니다.

**In-context Learning**: 프롬프트 내의 예시를 통해 학습하는 일반적인 개념으로, 특정 기법이 아닙니다.

**Prompt Chaining**: 여러 프롬프트를 순차적으로 연결하는 기법입니다.

**Self-Consistency**: 여러 추론 경로를 생성하고 가장 일관된 답을 선택하는 기법입니다.

---

## 문제
다음 중 RAG 성능 고도화 방법이 아닌 것은?
1. Small-to-Big Chunking
2. Contextual Retrieval
3. Full Fine-Tuning
4. Query Reformulation
5. Reranking

## 정답
3

## 해설
**Small-to-Big Chunking**: RAG 고도화 기법입니다. 작은 청크로 검색하고 큰 청크(주변 컨텍스트 포함)를 반환하는 방식입니다.

**Contextual Retrieval**: RAG 고도화 기법입니다. 검색 시 문맥 정보를 함께 고려하는 방식입니다.

**Full Fine-Tuning**: RAG 고도화 방법이 아닙니다. Full Fine-Tuning은 모델 전체 파라미터를 학습시키는 기법으로, RAG는 추론 시 사용되는 기술이므로 성격이 다릅니다.

**Query Reformulation**: RAG 고도화 기법입니다. 사용자 질문을 검색에 더 적합한 형태로 재작성합니다.

**Reranking**: RAG 고도화 기법입니다. 초기 검색 결과를 재순위화하여 관련성을 높입니다.

---

## 문제
키워드 기반 검색(BM25)과 벡터 기반 검색을 결합해 사용하는 검색 방식은?
1. Semantic Search
2. Hybrid Search
3. Fuzzy Search
4. Recursive Search
5. Cascade Search

## 정답
2

## 해설
**Semantic Search**: 벡터 임베딩 기반의 의미 검색만을 의미합니다.

**Hybrid Search**: 정답입니다. 렉시컬 검색(BM25, TF-IDF)과 시맨틱 검색(벡터 기반)을 결합하여 두 방식의 장점을 모두 활용합니다.

**Fuzzy Search**: 유사한 철자의 단어를 허용하는 검색으로, 하이브리드와 다릅니다.

**Recursive Search**: 검색을 재귀적으로 수행하는 방식으로, 별개의 개념입니다.

**Cascade Search**: 단계적 필터링 검색으로, 하이브리드와 다릅니다.

---

## 문제
사용자의 원래 질문을 검색에 더 적합한 형태로 재작성하여 검색 성능을 높이는 기법은?
1. Query Expansion
2. Query Reformulation
3. Query Caching
4. Query Logging
5. Query Optimization

## 정답
2

## 해설
**Query Expansion**: 원래 쿼리에 관련 키워드를 추가하여 확장하는 기법으로, 재작성과는 약간 다릅니다.

**Query Reformulation**: 정답입니다. 사용자의 원래 질문을 검색에 더 적합한 형태로 재작성(reformulate)하는 기법입니다. 예를 들어 대화형 질문을 명확한 검색 쿼리로 변환합니다.

**Query Caching**: 쿼리 결과를 캐싱하는 기법으로, 재작성과 관련이 없습니다.

**Query Logging**: 쿼리를 기록하는 기법입니다.

**Query Optimization**: 데이터베이스 쿼리 최적화를 의미하며, 자연어 질문 재작성과 다릅니다.

---

## 문제
모델이 생성한 여러 응답 중 품질이 좋은 것만 선별하여 다시 SFT(Supervised Fine-Tuning)를 수행하는 학습 기법은?
1. DPO (Direct Preference Optimization)
2. Rejection Sampling + SFT
3. RLHF
4. PPO
5. GRPO

## 정답
2

## 해설
**DPO (Direct Preference Optimization)**: 선호/비선호 답변 쌍을 사용하여 직접 최적화하는 기법입니다.

**Rejection Sampling + SFT**: 정답입니다. 모델에게 같은 질문으로 여러 답변을 생성하게 한 후, 보상 모델이나 규칙으로 품질을 평가하여 기준 이상의 답변만 선별(나머지는 Rejection)하고, 이 고품질 답변으로 SFT를 수행합니다.

**RLHF**: 인간 피드백을 활용한 강화학습으로, 선별 후 SFT와는 다릅니다.

**PPO**: RLHF에서 사용되는 강화학습 알고리즘입니다.

**GRPO**: DeepSeek이 개발한 그룹 상대 정책 최적화 알고리즘입니다.

---

## 문제
모델이 논리적으로 추론하여 단계별로 사고하는 방식을 유도하는 프롬프팅 기법은?
1. Role Prompting
2. Chain-of-Thought (CoT)
3. Template Prompting
4. Negative Prompting
5. Conditional Prompting

## 정답
2

## 해설
**Role Prompting**: 모델에게 특정 역할(페르소나)을 부여하는 기법입니다.

**Chain-of-Thought (CoT)**: 정답입니다. "단계별로 생각해보자"와 같은 지시를 통해 모델이 중간 추론 과정을 명시적으로 출력하도록 유도하는 기법입니다. 복잡한 문제에서 정확도를 크게 향상시킵니다.

**Template Prompting**: 정해진 템플릿 형식을 사용하는 프롬프팅입니다.

**Negative Prompting**: 원하지 않는 결과를 명시하는 기법으로, 주로 이미지 생성에서 사용됩니다.

**Conditional Prompting**: 조건부 지시를 사용하는 프롬프팅입니다.

---
