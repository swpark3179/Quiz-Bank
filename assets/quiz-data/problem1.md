> 기출문제
# 251212 오전 연습문제

---

## 문제
청킹(Chunking) 전략이 아닌 것은?
1. Fixed-size Chunking
2. Random Chunking
3. Semantic Chunking
4. Sliding Window
5. Recursive Chunking

## 정답
2

## 해설
**Fixed-size Chunking**: 문서를 일정한 크기(예: 500자)로 균등하게 분할하는 가장 기본적인 청킹 방식입니다.

**Random Chunking**: 실제 청킹 전략이 아닙니다. 청킹은 의미 있는 단위로 문서를 분할하는 것이 목적이므로, 무작위로 나누는 것은 RAG 성능을 저하시킵니다.

**Semantic Chunking**: 문장의 의미적 유사성을 기반으로 관련 내용끼리 묶어서 분할하는 방식입니다.

**Sliding Window**: 일정 크기의 창을 이동시키면서 겹치는 부분(overlap)을 포함하여 청킹하는 방식입니다.

**Recursive Chunking**: 계층적으로 문서를 분할하며, 큰 단위에서 작은 단위로 재귀적으로 나누는 방식입니다.

---

## 문제
다음 중 프롬프트 엔지니어링 기술에 대한 설명으로 올바른 것은?
1. 프롬프트는 항상 영어로만 작성해야 효과가 있다
2. 프롬프트의 길이가 길수록 무조건 좋은 결과를 얻는다
3. Chain-of-Thought(CoT)는 언어 모델의 논리적 추론 과정을 출력하도록 유도한다
4. Few-shot 프롬프팅은 예시 없이 직접 질문만 하는 기법이다
5. 프롬프트 엔지니어링은 모델의 파라미터를 직접 수정하는 기술이다

## 정답
3

## 해설
**프롬프트는 항상 영어로만 작성해야 효과가 있다**: 틀렸습니다. 한국어로도 프롬프트 작성이 가능하며, 한국어 특화 모델에서는 한국어가 더 효과적일 수 있습니다.

**프롬프트의 길이가 길수록 무조건 좋은 결과를 얻는다**: 틀렸습니다. 핵심적이고 명확한 프롬프트가 중요하며, 불필요하게 긴 프롬프트는 오히려 혼란을 줄 수 있습니다.

**Chain-of-Thought(CoT)는 언어 모델의 논리적 추론 과정을 출력하도록 유도한다**: 정답입니다. CoT는 "단계별로 생각해보자(Let's think step by step)"와 같이 모델이 추론 과정을 명시적으로 보여주도록 유도하는 기법입니다.

**Few-shot 프롬프팅은 예시 없이 직접 질문만 하는 기법이다**: 틀렸습니다. Few-shot은 몇 가지 예시를 제공하는 기법이며, 예시 없이 질문하는 것은 Zero-shot입니다.

**프롬프트 엔지니어링은 모델의 파라미터를 직접 수정하는 기술이다**: 틀렸습니다. 프롬프트 엔지니어링은 모델 파라미터를 수정하지 않고 입력 프롬프트만 조정하는 기술입니다.

---

## 문제
프롬프트 엔지니어링의 주된 목적으로 가장 적절한 것은?
1. LLM의 학습 데이터를 변경하기 위함이다
2. 모델의 파라미터 수를 줄이기 위함이다
3. 효율적으로 작성하여 언어 모델에서 원하는 결과를 얻기 위함이다
4. GPU 메모리 사용량을 최소화하기 위함이다
5. 모델의 추론 속도를 향상시키기 위함이다

## 정답
3

## 해설
**LLM의 학습 데이터를 변경하기 위함이다**: 틀렸습니다. 프롬프트 엔지니어링은 학습 데이터를 변경하지 않습니다.

**모델의 파라미터 수를 줄이기 위함이다**: 틀렸습니다. 이는 양자화나 프루닝과 같은 경량화 기술의 목적입니다.

**효율적으로 작성하여 언어 모델에서 원하는 결과를 얻기 위함이다**: 정답입니다. 프롬프트 엔지니어링은 "AI에게 질문 잘하는 기술"로, 효과적인 프롬프트 작성을 통해 원하는 품질의 결과물을 얻는 것이 목적입니다.

**GPU 메모리 사용량을 최소화하기 위함이다**: 틀렸습니다. 이는 양자화나 PEFT 기술의 목적입니다.

**모델의 추론 속도를 향상시키기 위함이다**: 틀렸습니다. 프롬프트 엔지니어링은 추론 속도보다 결과 품질에 초점을 맞춥니다.

---

## 문제
LangChain의 LCEL(LangChain Expression Language)에서 Chain 순서가 올바르지 않은 것은?
1. PromptTemplate | ChatOpenAI
2. PromptTemplate | ChatOpenAI | StrOutputParser
3. ChatOpenAI | StrOutputParser
4. LLM | PromptTemplate | StrOutputParser
5. PromptTemplate | ChatOpenAI | JsonOutputParser

## 정답
4

## 해설
**PromptTemplate | ChatOpenAI**: 올바른 순서입니다. 프롬프트 템플릿으로 입력을 포맷팅한 후 LLM에 전달합니다.

**PromptTemplate | ChatOpenAI | StrOutputParser**: 올바른 순서입니다. 프롬프트 → LLM → 문자열 파싱의 전형적인 체인입니다.

**ChatOpenAI | StrOutputParser**: 올바른 순서입니다. LLM 출력을 바로 문자열로 파싱하는 경우입니다.

**LLM | PromptTemplate | StrOutputParser**: 잘못된 순서입니다. PromptTemplate은 LLM 호출 전에 입력을 준비하는 단계이므로, LLM보다 앞에 와야 합니다. LCEL에서 데이터는 왼쪽에서 오른쪽으로 흐르므로, 프롬프트 템플릿 → LLM → 파서 순서가 맞습니다.

**PromptTemplate | ChatOpenAI | JsonOutputParser**: 올바른 순서입니다. JSON 형식으로 출력을 파싱하는 경우입니다.

---

## 문제
다음 중 RAG 성능 향상 기법이 아닌 것은?
1. MMR (Maximal Marginal Relevance)
2. Hypothetical Document Embedding (HyDE)
3. Gradient Descent
4. Reranking
5. Query Expansion

## 정답
3

## 해설
**MMR (Maximal Marginal Relevance)**: RAG 성능 향상 기법입니다. 검색 결과의 다양성을 확보하면서 관련성을 유지하는 기법으로, 중복된 문서를 줄입니다.

**Hypothetical Document Embedding (HyDE)**: RAG 성능 향상 기법입니다. 질문에 대한 가상의 답변 문서를 생성하고, 이를 임베딩하여 검색하는 기법입니다.

**Gradient Descent**: RAG 성능 향상 기법이 아닙니다. 이것은 딥러닝에서 모델의 파라미터를 최적화하는 학습 알고리즘으로, RAG 검색/생성과는 관련이 없습니다.

**Reranking**: RAG 성능 향상 기법입니다. 초기 검색 결과를 다시 순위를 매겨 더 관련성 높은 문서를 상위로 올리는 기법입니다.

**Query Expansion**: RAG 성능 향상 기법입니다. 원래 쿼리를 확장하거나 재작성하여 더 나은 검색 결과를 얻는 기법입니다.

---

## 문제
다음 중 제작사-AI 모델 매칭이 올바르지 않은 것은?
1. 구글 - Gemma
2. 마이크로소프트 - Phi
3. 알리바바 - Qwen
4. 앤트로픽 - Mistral AI
5. LG - EXAONE

## 정답
4

## 해설
**구글 - Gemma**: 올바른 매칭입니다. Gemma는 구글이 개발한 오픈소스 LLM입니다.

**마이크로소프트 - Phi**: 올바른 매칭입니다. Phi 시리즈는 마이크로소프트가 개발한 소형 언어 모델입니다.

**알리바바 - Qwen**: 올바른 매칭입니다. Qwen(통의천문)은 알리바바 클라우드에서 개발한 LLM입니다.

**앤트로픽 - Mistral AI**: 잘못된 매칭입니다. 앤트로픽(Anthropic)은 Claude를 개발한 회사이고, Mistral AI는 프랑스의 별도 회사로 Mistral 모델을 개발했습니다.

**LG - EXAONE**: 올바른 매칭입니다. EXAONE은 LG AI Research에서 개발한 LLM입니다.

---

## 문제
Hybrid Search에 대한 설명으로 올바른 것은?
1. 벡터 검색만을 2번 수행하는 방식이다
2. BM25(키워드 기반)와 Vector Search(의미 기반)를 결합한 검색 방식이다
3. 이미지와 텍스트를 동시에 검색하는 방식이다
4. GPU와 CPU를 함께 사용하는 검색 방식이다
5. 실시간 검색과 배치 검색을 결합한 방식이다

## 정답
2

## 해설
**벡터 검색만을 2번 수행하는 방식이다**: 틀렸습니다. Hybrid Search는 서로 다른 유형의 검색을 결합합니다.

**BM25(키워드 기반)와 Vector Search(의미 기반)를 결합한 검색 방식이다**: 정답입니다. Hybrid Search는 렉시컬 검색(BM25, TF-IDF)과 시맨틱 검색(벡터 임베딩 기반)을 결합하여 두 방식의 장점을 모두 활용합니다.

**이미지와 텍스트를 동시에 검색하는 방식이다**: 틀렸습니다. 이것은 멀티모달 검색에 대한 설명입니다.

**GPU와 CPU를 함께 사용하는 검색 방식이다**: 틀렸습니다. 하드웨어 활용 방식과는 관련이 없습니다.

**실시간 검색과 배치 검색을 결합한 방식이다**: 틀렸습니다. 검색 타이밍과는 관련이 없습니다.

---

## 문제
RAG(Retrieval-Augmented Generation) 단계에서 Searching(검색) 단계에 사용되는 기술이 아닌 것은?
1. 강화학습 (Reinforcement Learning)
2. 벡터 데이터베이스
3. 임베딩 모델
4. Semantic 검색
5. BM25 키워드 검색

## 정답
1

## 해설
**강화학습 (Reinforcement Learning)**: RAG의 검색 단계에서 사용되는 기술이 아닙니다. 강화학습은 RLHF와 같이 LLM의 Fine-tuning이나 모델 학습에 사용되는 기술입니다.

**벡터 데이터베이스**: RAG 검색 단계의 핵심 기술입니다. 문서를 벡터로 저장하고 유사도 검색을 수행합니다.

**임베딩 모델**: RAG 검색 단계의 핵심 기술입니다. 텍스트를 벡터로 변환하여 의미 기반 검색을 가능하게 합니다.

**Semantic 검색**: RAG 검색 단계의 핵심 기술입니다. 의미적 유사성을 기반으로 관련 문서를 검색합니다.

**BM25 키워드 검색**: RAG 검색 단계에서 사용되는 기술입니다. 키워드 빈도 기반의 렉시컬 검색 방식입니다.

---

## 문제
OpenAI가 제안한 인간 피드백을 보상으로 사용하고 정렬(Alignment)에 활용하는 강화학습 기법은?
1. DPO (Direct Preference Optimization)
2. RLHF (Reinforcement Learning from Human Feedback)
3. PPO (Proximal Policy Optimization)
4. GRPO (Group Relative Policy Optimization)
5. SFT (Supervised Fine-Tuning)

## 정답
2

## 해설
**DPO (Direct Preference Optimization)**: RLHF의 대안으로 보상 모델 없이 직접 선호도를 최적화하는 기법이지만, OpenAI가 제안한 것이 아니라 Stanford 연구팀이 2023년에 발표했습니다.

**RLHF (Reinforcement Learning from Human Feedback)**: 정답입니다. OpenAI가 ChatGPT를 만들 때 사용한 핵심 기술로, 인간의 선호도 피드백을 보상 신호로 사용하여 모델을 인간의 가치관에 맞게 정렬(Alignment)합니다.

**PPO (Proximal Policy Optimization)**: RLHF에서 실제 모델을 업데이트하는 알고리즘이지만, 인간 피드백 전체 프레임워크를 지칭하지는 않습니다.

**GRPO (Group Relative Policy Optimization)**: DeepSeek이 개발한 새로운 강화학습 알고리즘으로, OpenAI가 제안한 것이 아닙니다.

**SFT (Supervised Fine-Tuning)**: 정답이 있는 데이터를 사용해 학습시키는 지도 학습 방식으로, 강화학습이 아닙니다.

---

## 문제
자연어 처리에서 단어의 순서가 중요하다는 것을 보여주는 예시로 적절한 것은?
1. "사과"와 "Apple"은 같은 의미이다
2. "A는 B를 좋아한다"와 "B는 A를 좋아한다"는 다른 의미이다
3. "빨간 사과"와 "사과 빨간"은 같은 의미이다
4. 영어와 한국어는 문법이 다르다
5. 단어는 벡터로 표현할 수 있다

## 정답
2

## 해설
**"사과"와 "Apple"은 같은 의미이다**: 번역과 관련된 내용으로, 순서의 중요성과는 관련이 없습니다.

**"A는 B를 좋아한다"와 "B는 A를 좋아한다"는 다른 의미이다**: 정답입니다. 같은 단어들로 구성되어 있지만 순서가 다르면 완전히 다른 의미가 됩니다. 이는 Transformer에서 Positional Encoding이 필요한 이유이기도 합니다.

**"빨간 사과"와 "사과 빨간"은 같은 의미이다**: 틀렸습니다. 한국어에서도 어순에 따라 문법적 자연스러움이 달라집니다.

**영어와 한국어는 문법이 다르다**: 언어 간 차이에 대한 설명으로, 순서의 중요성에 대한 직접적인 예시가 아닙니다.

**단어는 벡터로 표현할 수 있다**: 임베딩에 대한 설명으로, 순서의 중요성과는 관련이 없습니다.

---

## 문제
DPO(Direct Preference Optimization)가 PPO(Proximal Policy Optimization)에 비해 가지는 장점으로 올바른 것은?
1. 더 많은 GPU 메모리가 필요하다
2. 보상 모델이 불필요하고 구현이 간단하며 안정적이다
3. 학습 속도가 더 느리다
4. 반드시 RLHF와 함께 사용해야 한다
5. 대규모 데이터셋에서만 작동한다

## 정답
2

## 해설
**더 많은 GPU 메모리가 필요하다**: 틀렸습니다. DPO는 PPO보다 더 적은 메모리를 사용합니다. PPO는 3~4개 모델이 필요하지만 DPO는 2개만 필요합니다.

**보상 모델이 불필요하고 구현이 간단하며 안정적이다**: 정답입니다. DPO의 핵심 장점은 별도의 보상 모델 학습이 불필요하고, 일반 Fine-tuning 수준의 구현 난이도로 안정적인 학습이 가능하다는 것입니다.

**학습 속도가 더 느리다**: 틀렸습니다. DPO는 보상 모델이 없어서 PPO보다 더 빠른 학습이 가능합니다.

**반드시 RLHF와 함께 사용해야 한다**: 틀렸습니다. DPO는 RLHF의 대안으로, 독립적으로 사용할 수 있습니다.

**대규모 데이터셋에서만 작동한다**: 틀렸습니다. DPO는 선호도 데이터만 있으면 다양한 규모에서 작동합니다.

---

## 문제
LangChain Agent에서 추론과 행동을 결합한 에이전트 패턴은?
1. Chain-of-Thought
2. ReAct
3. Few-shot
4. Zero-shot
5. Reflexion

## 정답
2

## 해설
**Chain-of-Thought**: 단계별 추론을 유도하는 프롬프팅 기법이지, 에이전트 패턴이 아닙니다.

**ReAct**: 정답입니다. ReAct는 Reasoning(추론) + Acting(행동)의 합성어로, LLM이 생각(Thinking) → 행동(Action) → 관찰(Observation) 사이클을 반복하면서 문제를 해결하는 에이전트 패턴입니다.

**Few-shot**: 몇 가지 예시를 제공하는 프롬프팅 기법으로, 에이전트 패턴이 아닙니다.

**Zero-shot**: 예시 없이 직접 질문하는 프롬프팅 기법으로, 에이전트 패턴이 아닙니다.

**Reflexion**: 실패에서 배우는 자기 반성 메커니즘을 가진 에이전트 패턴이지만, 추론과 행동의 결합을 직접 설명하는 것은 ReAct입니다.

---

## 문제
다음 중 Python의 텍스트(문자열) 관련 함수가 아닌 것은?
1. replace()
2. compile()
3. split()
4. strip()
5. lower()

## 정답
2

## 해설
**replace()**: 문자열 메서드입니다. 문자열 내의 특정 부분을 다른 문자열로 교체합니다.

**compile()**: 문자열 메서드가 아닙니다. 이것은 정규표현식(re 모듈)에서 패턴을 컴파일하거나, Python 코드를 컴파일하는 데 사용되는 함수입니다.

**split()**: 문자열 메서드입니다. 구분자를 기준으로 문자열을 분리하여 리스트로 반환합니다.

**strip()**: 문자열 메서드입니다. 문자열 양쪽 끝의 공백이나 지정된 문자를 제거합니다.

**lower()**: 문자열 메서드입니다. 문자열을 소문자로 변환합니다.

---

## 문제
pandas Series에서 각 값의 빈도수를 계산하는 함수는?
1. count()
2. value_counts()
3. sum()
4. mean()
5. unique()

## 정답
2

## 해설
**count()**: 결측값(NaN)을 제외한 요소의 개수를 반환합니다. 빈도수가 아닌 전체 개수를 셉니다.

**value_counts()**: 정답입니다. Series의 각 고유값이 몇 번 나타나는지 빈도수를 계산하여 반환합니다.

**sum()**: Series의 모든 값을 더한 합계를 반환합니다.

**mean()**: Series의 평균값을 계산합니다.

**unique()**: Series의 고유값들을 배열로 반환하지만, 빈도수는 제공하지 않습니다.

---

## 문제
NumPy에 대한 설명으로 올바른 것은?
1. 웹 크롤링을 위한 라이브러리이다
2. 데이터 시각화를 위한 라이브러리이다
3. 다차원 배열(행렬) 연산을 기반으로 한 고성능 과학계산 라이브러리이다
4. 자연어 처리 전용 라이브러리이다
5. 데이터베이스 연결을 위한 라이브러리이다

## 정답
3

## 해설
**웹 크롤링을 위한 라이브러리이다**: 틀렸습니다. 웹 크롤링은 BeautifulSoup, Scrapy 등을 사용합니다.

**데이터 시각화를 위한 라이브러리이다**: 틀렸습니다. 데이터 시각화는 Matplotlib, Seaborn 등을 사용합니다.

**다차원 배열(행렬) 연산을 기반으로 한 고성능 과학계산 라이브러리이다**: 정답입니다. NumPy는 Numerical Python의 약자로, 다차원 배열 객체와 이를 다루는 다양한 함수를 제공하는 과학계산용 핵심 라이브러리입니다.

**자연어 처리 전용 라이브러리이다**: 틀렸습니다. 자연어 처리는 NLTK, spaCy 등을 사용합니다.

**데이터베이스 연결을 위한 라이브러리이다**: 틀렸습니다. 데이터베이스 연결은 SQLAlchemy, psycopg2 등을 사용합니다.

---

## 문제
LLM 어플리케이션 개발 프레임워크는?
1. PyTorch
2. TensorFlow
3. LangChain
4. scikit-learn
5. Keras

## 정답
3

## 해설
**PyTorch**: 딥러닝 모델을 구축하고 학습시키는 프레임워크입니다. LLM 개발에 사용될 수 있지만, LLM 어플리케이션 개발용은 아닙니다.

**TensorFlow**: 구글의 딥러닝 프레임워크로, 모델 학습에 사용됩니다. LLM 어플리케이션 개발 전용은 아닙니다.

**LangChain**: 정답입니다. LangChain은 LLM을 활용한 어플리케이션 개발을 돕는 Python 프레임워크로, 프롬프트 관리, 체인 구성, RAG, Agent 등을 쉽게 구현할 수 있습니다.

**scikit-learn**: 전통적인 머신러닝 알고리즘을 위한 라이브러리입니다.

**Keras**: 딥러닝 모델을 쉽게 구축할 수 있는 고수준 API입니다.

---

## 문제
Transformer 아키텍처의 핵심 메커니즘은?
1. Recurrent Connection
2. Self-Attention
3. Convolutional Layer
4. Pooling Layer
5. Batch Normalization

## 정답
2

## 해설
**Recurrent Connection**: RNN(순환 신경망)의 핵심 구성요소입니다. Transformer는 RNN을 대체하기 위해 등장했습니다.

**Self-Attention**: 정답입니다. Self-Attention은 "이 문장에서 이 단어는 다른 단어들과 어떤 관계인가?"를 계산하는 Transformer의 핵심 메커니즘입니다. 2017년 "Attention is All You Need" 논문에서 소개되었습니다.

**Convolutional Layer**: CNN(합성곱 신경망)의 핵심 구성요소로, 주로 이미지 처리에 사용됩니다.

**Pooling Layer**: CNN에서 특성 맵의 크기를 줄이는 데 사용됩니다.

**Batch Normalization**: 학습 안정화 기법으로, Transformer의 핵심 메커니즘은 아닙니다.

---

## 문제
정확하게 키워드가 일치해야 할 때 사용하는 검색 방식은?
1. Lexical 검색 (렉시컬 검색)
2. Semantic 검색 (시맨틱 검색)
3. Hybrid 검색
4. Neural 검색
5. Fuzzy 검색

## 정답
1

## 해설
**Lexical 검색 (렉시컬 검색)**: 정답입니다. 키워드 매칭 기반 검색으로, BM25, TF-IDF 등이 대표적입니다. 정확한 키워드 일치를 기반으로 검색합니다.

**Semantic 검색 (시맨틱 검색)**: 의미 기반 검색으로, 벡터 임베딩을 활용하여 의미적으로 유사한 문서를 검색합니다. 정확한 키워드 일치가 아닌 의미 유사성을 찾습니다.

**Hybrid 검색**: Lexical과 Semantic 검색을 결합한 방식입니다.

**Neural 검색**: 신경망 기반 검색으로, 주로 Semantic 검색과 유사한 개념입니다.

**Fuzzy 검색**: 유사한 철자의 단어를 허용하는 검색으로, 정확한 일치가 아닙니다.

---

## 문제
RAG(Retrieval-Augmented Generation)를 사용했을 때의 장점은?
1. 모델 파라미터 수를 줄일 수 있다
2. GPU 메모리 사용량이 감소한다
3. 최신/내부 데이터를 활용하고 환각(Hallucination)을 완화한다
4. 모델 학습 시간이 단축된다
5. 추론 속도가 빨라진다

## 정답
3

## 해설
**모델 파라미터 수를 줄일 수 있다**: 틀렸습니다. RAG는 모델 파라미터와 관련이 없습니다.

**GPU 메모리 사용량이 감소한다**: 틀렸습니다. RAG는 검색 시스템을 추가로 사용하므로 전체 시스템 리소스가 증가할 수 있습니다.

**최신/내부 데이터를 활용하고 환각(Hallucination)을 완화한다**: 정답입니다. RAG의 핵심 장점은 LLM이 학습하지 않은 최신 정보나 내부 문서를 검색하여 활용할 수 있고, 검색된 사실에 기반하여 답변하므로 환각을 줄일 수 있다는 것입니다.

**모델 학습 시간이 단축된다**: 틀렸습니다. RAG는 추론 시 사용되는 기술로, 학습과는 관련이 없습니다.

**추론 속도가 빨라진다**: 틀렸습니다. 오히려 검색 단계가 추가되므로 추론 시간이 늘어날 수 있습니다.

---

## 문제
LangChain에서 Runnable을 실행시키기 위한 표준 메서드는?
1. run()
2. execute()
3. invoke()
4. call()
5. process()

## 정답
3

## 해설
**run()**: LangChain의 표준 실행 메서드가 아닙니다.

**execute()**: LangChain의 표준 실행 메서드가 아닙니다.

**invoke()**: 정답입니다. LangChain의 LCEL(LangChain Expression Language)에서 Runnable 객체를 실행하는 표준 메서드입니다. chain.invoke({"변수": "값"}) 형태로 사용합니다.

**call()**: LangChain의 표준 실행 메서드가 아닙니다.

**process()**: LangChain의 표준 실행 메서드가 아닙니다.

---
