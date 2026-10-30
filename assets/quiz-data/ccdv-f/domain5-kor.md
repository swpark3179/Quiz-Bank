<!-- domain5.md 의 한글판. 문항·보기 순서·정답 번호는 영문판과 같다. 질문·보기는 영문판 해설의 '문제 번역'을 옮겼고, 해설은 영문판에서 '문제 번역' 블록만 뺐다. -->

## 문제 1
### **한 리걸테크 팀이 Claude Sonnet 4.6으로 API를 호출하기 전에 예산을 빠르게 어림하려고 합니다. 계약서 하나가 영문 약 14,000자(대략 2,300단어)입니다. 이 모델에 대한 Anthropic 안내에 가장 맞는 추정은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 약 14,000토큰. Claude는 글자 하나를 토큰 하나로 인코딩하기 때문이다 | |
| 2. 약 2,300토큰. Claude의 토크나이저는 영어 단어 하나를 정확히 토큰 하나로 대응시키기 때문이다 | |
| **3. 약 4,000토큰. 이 모델에서 토큰 하나는 영문 약 3.5자에 해당하며, 정확한 값은 토큰 카운팅으로 얻는다** | |
| 4. 약 56,000토큰. 글자 하나가 바이트 수준 토큰 약 4개로 늘어나기 때문이다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 모델은 글자나 단어가 아니라 **토큰** 단위로 읽고 씁니다. 공식 용어집은 Claude Opus 4.7 이전 모델(Sonnet 4.6 포함)에서 토큰 하나가 **영문 약 3.5자** 라고 설명합니다. 14,000 ÷ 3.5 ≈ 4,000토큰입니다. 다만 이 비율은 모델과 언어에 따라 달라지므로 어림값일 뿐이고, 정확한 값은 쓸 모델 ID로 토큰 카운팅 API를 호출해 얻습니다.

| 모델 | 같은 영문 14,000자 |
|---|---|
| Claude Sonnet 4.6 등 이전 토크나이저 | 약 4,000토큰 (3.5자/토큰) |
| Claude Opus 4.7 이후·Claude 5 계열 | 약 30% 더 많음 (약 5,200토큰 안팎) |

1. **오답** - 토큰은 단어·하위 단어·글자 등 다양한 단위가 될 수 있지만, 영문에서 평균적으로 글자 하나보다 큽니다. 글자 수를 그대로 쓰면 3배 넘게 과대 추정합니다.
2. **오답** - 단어와 토큰은 일대일이 아닙니다. 흔한 단어는 토큰 하나일 수 있지만 긴 단어나 드문 단어는 여러 토큰으로 쪼개지므로, 단어 수는 토큰 수를 과소 추정하기 쉽습니다.
3. **정답** - 이전 토크나이저 기준 3.5자/토큰이라는 공식 어림값을 적용한 추정입니다. 예산을 확정할 때는 같은 요청을 토큰 카운팅 엔드포인트로 세어 확인합니다.
4. **오답** - 바이트 수준 표현이 쓰이는 경우가 있다고 글자마다 토큰이 여러 개 생기지는 않습니다. 영문 텍스트에서는 토큰이 글자보다 커서 이런 팽창이 일어나지 않습니다.

> 💡 **시험 포인트:** "영문 약 3.5자 = 토큰 1개"는 빠른 어림용입니다. 언어와 모델에 따라 달라지므로, 비용·컨텍스트 적합성을 확정할 때는 반드시 대상 모델로 토큰을 세세요.

> 📎 참고: CertSafari는 3.5자 비율을 Claude 전반에 적용하지만, 공식 문서는 이를 Claude Opus 4.7 이전 모델의 수치로 한정하고, 4.7 이후 모델의 새 토크나이저는 같은 텍스트에서 약 30% 더 많은 토큰을 만든다고 설명합니다. 그래서 문항의 모델을 Sonnet 4.6으로 정했습니다.

> 📚 근거 문서: [Glossary](https://platform.claude.com/docs/en/about-claude/glossary) · [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)

---

## 문제 2
### **한 제약 연구팀이 Claude에게 임상 논문 30편을 브리핑 하나로 요약하게 했습니다. 결과물은 매끄럽고 자신감 있게 읽힙니다. 검토자에게는 브리핑이 나가기 전까지 20분밖에 없습니다. 검토자가 가장 먼저 확인해야 할 것은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 약물 이름, 용량 수치, 임상시험 표본 수, 인용된 URL. 정확히 확인할 수 있는 구체적 사항에 지어낸 내용이 몰리기 때문이다** | |
| 2. 전체 어조와 문단 흐름. 지나치게 매끄러운 문장이 모델이 내용을 지어냈다는 가장 분명한 신호이기 때문이다 | |
| 3. 절 제목. 다음 토큰 생성은 사실을 틀리기보다 절 제목을 잘못 붙이는 경우가 훨씬 많기 때문이다 | |
| 4. 큰 결론. 모델은 구체적 세부 사항은 쓰기 전에 내부에서 사실 확인을 하지만 일반적 주장은 확인하지 않기 때문이다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 생성형 모델은 그럴듯한 다음 토큰을 하나씩 이어 붙여 답을 만듭니다. 이 과정에는 **사실과 '그럴듯함'을 가르는 확인 단계가 없습니다.** 매끄러움과 환각(hallucination)이 같은 성질에서 나오므로, 문장이 유창하다고 내용이 맞다는 보장은 없습니다. Anthropic 교육 자료는 지어낸 내용이 **이름·날짜·통계·인용·URL·인용문** 같은 구체적 사항에 몰리며, 주장이 정밀할수록 검증이 필요하다고 설명합니다. 시간이 부족하면 검증할 수 있고 틀렸을 때 피해가 큰 수치와 출처부터 봅니다.

1. **정답** - 약물명, 용량, 표본 수, URL은 모두 정밀하고 확인 가능한 주장입니다. 틀리면 피해가 크고, 지어낸 값이 가장 자주 숨어드는 자리이므로 우선 확인 대상입니다.
2. **오답** - 유창함은 정확성의 신호가 아닙니다. 그렇다고 유창함 자체가 날조의 증거도 아닙니다. 문체 검토는 사실 오류를 거의 걸러 내지 못합니다.
3. **오답** - 제목 오류가 사실 오류보다 흔하다는 근거는 없습니다. 제목은 틀려도 피해가 작아 짧은 검토 시간의 우선순위가 아닙니다.
4. **오답** - 모델에는 쓰기 전에 세부 사항을 따로 사실 확인하는 단계가 없습니다. 오히려 구체적 세부 사항이 날조에 가장 취약합니다.

> 💡 **시험 포인트:** "유창한 출력에서 무엇부터 검증하나?"에는 '정밀하고 확인 가능한 구체적 사항(이름·수치·날짜·인용·URL)'이 정답입니다. 공식 문서도 인용과 근거 인용문으로 주장을 검증하고, 중요한 정보는 항상 확인하라고 권합니다.

> 📚 근거 문서: [Next-token prediction (Anthropic Academy)](https://academy.claude.com/courses/ai-capabilities-and-limitations/next-token-prediction) · [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)

---

## 문제 3
### **창립 연도, 임원 이름, 참고문헌 목록이 들어간 Claude 작성 회사 연혁을 검토하기 전에, 한 엔지니어가 오류가 가장 많을 곳을 예측해 보라는 요청을 받았습니다. 다음 토큰 생성의 작동 방식을 고려할 때 가장 정확한 예측은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 오류가 본문 전체에 고르게 퍼진다. 모든 토큰이 틀릴 확률이 같기 때문이다 | |
| 2. 오류가 접속 표현에 몰린다. 연결어에 대한 학습 데이터가 가장 적기 때문이다 | |
| 3. 참고문헌에는 오류가 없다. 모델이 학습 데이터에서 인용을 글자 그대로 복사하기 때문이다 | |
| **4. 정확한 날짜와 참고문헌 항목에서 오류가 가장 많이 나온다. 생성 과정은 그럴듯한 이어짐을 만들 뿐, 참과 '그럴듯함'을 가르는 단계가 없기 때문이다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 다음 토큰 예측은 "이 문맥 뒤에 무엇이 올 법한가"를 따릅니다. 흔한 표현과 일반적 설명은 패턴이 촘촘해 잘 맞지만, **특정 연도·특정 논문 제목·특정 저자** 처럼 정답이 하나뿐인 자리에서는 그럴듯한 후보가 여럿이고 모델은 그중 하나를 확신 있게 고릅니다. 그래서 날조는 고르게 퍼지지 않고 **인용과 정확한 날짜** 같은 정밀한 지점에 몰립니다.

1. **오답** - 토큰마다 오류 위험이 같지 않습니다. 형식적인 연결 문장은 거의 틀리지 않고, 하나의 정답만 있는 구체적 사실에서 오류가 집중됩니다.
2. **오답** - 연결어는 학습 데이터에 매우 흔한 패턴이라 오히려 가장 안정적인 부분입니다.
3. **오답** - 모델은 문서를 검색해 복사하는 것이 아니라 생성합니다. 참고문헌은 저자·연도·제목 조합을 그럴듯하게 만들어 내기 쉬운 대표적인 날조 지점입니다.
4. **정답** - 생성 메커니즘에 참·거짓 판정 단계가 없다는 점과, 날조가 정밀한 사항에 몰린다는 점을 함께 반영한 예측입니다.

> 💡 **시험 포인트:** 환각은 '무작위 잡음'이 아니라 '그럴듯한 빈칸 채우기'입니다. 정답이 하나뿐인 구체적 사실(날짜·인용·숫자)이 가장 위험한 자리라는 점을 기억하세요.

> 📚 근거 문서: [Next-token prediction (Anthropic Academy)](https://academy.claude.com/courses/ai-capabilities-and-limitations/next-token-prediction) · [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)

---

## 문제 4
### **Claude Opus 5.5를 쓰는 지원 앱이 캐시된 60,000토큰 시스템 프롬프트, 9,000토큰의 도구 정의, 20,000토큰의 대화 기록을 보내고, 출력은 최대 16,000토큰까지 허용합니다. 동료가 시스템 프롬프트를 캐시하면 그만큼 컨텍스트 윈도 공간이 비워진다고 말합니다. 옳은 설명은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 캐시된 토큰은 윈도에서 제외되므로 대화 기록, 도구, 출력만 윈도에 포함된다 | |
| **2. 캐시된 시스템 프롬프트, 도구 정의, 대화 기록, 생성된 출력이 모두 윈도를 차지한다. 캐싱은 캐시된 토큰의 비용만 바꾼다** | |
| 3. 도구 정의는 서버에 저장되므로 포함되지 않고, 캐시된 시스템 프롬프트와 대화 기록은 포함된다 | |
| 4. 입력만 윈도에 포함된다. 출력은 max_tokens로 따로 제한되어 윈도를 공유하지 않기 때문이다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 컨텍스트 윈도는 응답을 만들 때 모델이 참조하는 모든 텍스트이며 **응답 자체도 포함** 합니다. 공식 문서는 시스템 프롬프트, `messages`의 모든 메시지(도구 결과·이미지·문서 포함), 도구 정의, 그리고 그 턴의 출력(사고 포함)이 모두 윈도에 들어간다고 명시합니다. 캐싱을 쓰면 입력이 `input_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`로 나뉘어 보고되지만 **셋 다 윈도에 포함** 됩니다. 캐시된 접두사는 여전히 윈도를 차지하고, 캐싱은 그 토큰에 대해 내는 값만 바꿉니다.

| 구성 요소 | 토큰 | 윈도에 포함? |
|---|---|---|
| 캐시된 시스템 프롬프트 | 60,000 | 포함 (비용만 할인) |
| 도구 정의 | 9,000 | 포함 |
| 대화 기록 | 20,000 | 포함 |
| 출력(사고 포함) | 최대 16,000 | 포함 |

1. **오답** - 캐싱이 윈도 공간을 비운다는 것은 가장 흔한 오해입니다. 캐시 읽기 토큰도 윈도를 차지합니다.
2. **정답** - 요청의 모든 구성 요소와 출력이 윈도를 차지한다는 공식 설명과 일치합니다. 이 요청은 최대 약 105,000토큰을 쓰므로 1M 윈도에는 넉넉히 들어갑니다.
3. **오답** - 도구 정의는 매 요청에 함께 보내는 입력이며 윈도에 포함됩니다. 도구 정의가 차지하는 공간을 줄이려면 도구 검색(tool search) 같은 별도 기능을 씁니다.
4. **오답** - 출력은 다음 턴의 입력이 되기 전에도 이번 턴의 윈도를 차지합니다. `max_tokens`는 출력 상한일 뿐 출력을 윈도 밖에 두지 않습니다.

> 💡 **시험 포인트:** "캐싱이 컨텍스트 공간을 아껴 준다"는 보기는 오답입니다. 캐싱은 **비용과 지연** 을 줄이고, 공간을 줄이려면 컴팩션이나 컨텍스트 편집을 씁니다.

> 📚 근거 문서: [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) · [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

---

## 문제 5
### **한 플랫폼 팀이 Claude Opus 4.8로 자율 코딩 에이전트를 운영합니다. 보통 한 번 실행에 1시간 넘게 걸리고 수백만 토큰을 씁니다. 요청에는 effort 파라미터를 설정하지 않았습니다. Anthropic의 effort 안내는 이 구성에 대해 무엇이라고 말할까요?**

| 보기 | 설명 |
|------|------|
| 1. 요청은 이미 xhigh로 실행된다. Opus 모델에서 에이전트 작업의 기본값이 xhigh이므로 바꿀 필요가 없다 | |
| **2. 요청은 API 기본값인 high로 실행된다. 이 모델에서 코딩·에이전트 작업의 권장 시작점은 xhigh이며, 명시적으로 설정해야 한다** | |
| 3. 요청을 max로 바꿔야 한다. Anthropic은 오래 실행되는 모든 에이전트의 시작점으로 max를 권장하기 때문이다 | |
| 4. 요청을 low로 바꿔야 한다. 오래 실행되는 에이전트는 예산 안에 머물려면 간결한 도구 호출이 필요하기 때문이다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** effort는 `output_config.effort`로 정하며, 값을 주지 않으면 모델의 기본값이 적용됩니다. Claude Opus 4.8의 API 기본값은 **`high`** 입니다. 공식 effort 문서는 Opus 4.8(4.7과 같은 지침)에 대해 **코딩과 에이전트 용도는 `xhigh`로 시작** 하라고 권하고, `xhigh`를 쓰려면 직접 설정해야 한다고 명시합니다. effort 수준 표에서도 `xhigh`의 대표 용도는 "30분을 넘는 장기 에이전트·코딩 작업, 수백만 토큰 예산"입니다. `xhigh`·`max`에서는 `max_tokens`를 64k 정도로 크게 잡고 조정하라는 안내도 함께 있습니다.

1. **오답** - effort 기본값은 작업 유형에 따라 바뀌지 않습니다. Opus 4.8에서 effort를 생략하면 `high`로 실행됩니다.
2. **정답** - 현재 상태(기본값 `high`)와 권장 시작점(`xhigh`, 명시 설정)을 모두 정확히 짚었습니다.
3. **오답** - `max`는 최전선 문제를 위해 아껴 두는 수준입니다. 대부분의 작업에서 작은 품질 향상에 비해 비용이 크게 늘고, 과도한 사고로 이어질 수 있습니다.
4. **오답** - `low`는 짧고 범위가 좁은 작업이나 서브에이전트용입니다. 장시간 자율 코딩에서는 탐색과 검증을 건너뛰어 품질이 떨어질 수 있습니다.

> 💡 **시험 포인트:** effort 기본값(대부분 `high`, Opus 5.5·Haiku 5.5는 `medium`)과 권장 시작점은 다를 수 있습니다. 권장 수준은 모델마다 다르니, 문항에 나온 모델의 지침을 기준으로 판단하세요.

> 📎 참고: CertSafari 문항은 모델을 특정하지 않고 xhigh를 정답으로 둡니다. 공식 문서의 모델별 권장은 서로 다릅니다. Opus 4.7·4.8은 코딩·에이전트에 xhigh로 시작하고, Fable 5.1·Opus 5는 high로 시작해 평가에 따라 올리며, Opus 5.5는 자체 평가로 effort 스윕을 하라고 권합니다. 그래서 문항의 모델을 Opus 4.8로 정했습니다.

> 📚 근거 문서: [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

---

## 문제 6
### **여행 예약 어시스턴트는 팀이 시스템 프롬프트에 풀이 예시 4개를 넣은 뒤로 일관된 JSON 일정표를 만듭니다. 일정표는 서로 독립된 단일 턴 요청으로 하나씩 생성됩니다. 토큰을 아끼려고 한 엔지니어가 모델이 형식을 "학습했을 것"이라며, 예시를 매일 첫 요청에만 넣자고 제안합니다. 어떻게 될까요?**

| 보기 | 설명 |
|------|------|
| 1. 이후 요청도 형식을 유지한다. 예시가 그 API 키에 대한 모델 가중치에 저장되기 때문이다 | |
| 2. 이후 요청은 5분 동안 형식을 유지한다. 예시가 TTL이 끝날 때까지 프롬프트 캐시에 남기 때문이다 | |
| 3. 예시를 example 태그로 감쌌다면 이후 요청도 형식을 유지한다. 태그로 감싼 예시는 호출 사이에 유지되기 때문이다 | |
| **4. 이후 요청에서는 효과가 사라진다. 예시는 그 요청의 컨텍스트 안에 있을 때만 모델을 이끌며, API는 예시로 학습하지 않기 때문이다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 예시(퓨샷, few-shot)는 모델을 다시 학습시키는 것이 아니라 **그 요청의 컨텍스트 안에서** 출력을 이끕니다. 공식 용어집은 Claude API가 현재 파인튜닝을 제공하지 않는다고 밝히고, Messages API는 상태가 없어(stateless) 매 요청에 필요한 내용을 모두 보내야 합니다. 예시를 뺀 요청은 예시를 본 적이 없는 요청과 같습니다. 토큰이 아깝다면 예시를 계속 보내되 프롬프트 캐싱으로 그 접두사의 비용을 낮추는 것이 맞습니다.

1. **오답** - API 호출은 모델 가중치를 바꾸지 않습니다. 예시를 '학습'하는 단계는 없고, 파인튜닝도 API에서 제공하지 않습니다.
2. **오답** - 프롬프트 캐시는 요청이 **같은 접두사를 다시 보낼 때** 그 처리 비용을 줄여 줄 뿐입니다. 예시를 보내지 않은 요청에 캐시 내용이 끼워지지는 않습니다.
3. **오답** - example 태그는 예시를 지시와 구분해 주는 구조 장치입니다. 태그가 예시를 호출 사이에 보존해 주지는 않습니다.
4. **정답** - 예시는 요청마다 컨텍스트에 있어야 효과가 있습니다. 첫 요청 이후에 빼면 그 요청들은 예시 없는 프롬프트로 처리됩니다.

> 💡 **시험 포인트:** "예시로 모델이 학습했다", "한 번 보여 주면 기억한다"는 보기는 오답입니다. 예시의 효과는 컨텍스트에 들어 있는 동안만 유지됩니다.

> 📚 근거 문서: [Glossary](https://platform.claude.com/docs/en/about-claude/glossary) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)

---

## 문제 7
### **각 샘플링 개념을 그 효과와 짝지으세요. (a) 낮은 temperature, (b) 높은 temperature, (c) top_k, (d) temperature 0. 올바른 짝은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. (a) 확률 높은 표현을 고수하는 보수적인 출력, (b) 더 다양하고 창의적인 출력, (c) 가장 가능성 높은 다음 토큰 K개에서만 샘플링, (d) 호출 간에 여전히 완전히 결정적이지 않음** | |
| 2. (a) 더 다양하고 창의적인 출력, (b) 더 보수적인 출력, (c) 누적 확률이 K에 이르는 토큰들에서 샘플링, (d) 호출 간에 완전히 결정적 | |
| 3. (a) 확률 높은 표현을 고수하는 보수적인 출력, (b) 더 다양한 출력, (c) 응답 길이를 K토큰으로 제한, (d) 1st-party API에서만 완전히 결정적 | |
| 4. (a) 더 짧은 응답, (b) 더 긴 응답, (c) 가장 가능성 높은 다음 토큰 K개에서만 샘플링, (d) 호출 간에 여전히 완전히 결정적이지 않음 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** temperature는 다음 토큰 예측의 무작위성을 조절합니다. 공식 용어집에 따르면 **낮은 temperature는 가장 확률 높은 표현과 답을 고수하는 보수적인 출력**, **높은 temperature는 더 다양하고 창의적인 출력** 을 냅니다. top_k는 확률 상위 K개 후보로 샘플링 범위를 좁힙니다(누적 확률 기준으로 자르는 것은 top_p). 그리고 **temperature를 0으로 해도 완전히 결정적이지 않아** 같은 입력이 호출마다 다른 출력을 낼 수 있으며, 이는 Anthropic 1st-party 서비스와 서드파티 클라우드 모두에 해당합니다.

1. **정답** - 네 개념의 효과를 모두 정확히 짝지었습니다.
2. **오답** - temperature의 방향이 뒤바뀌었고, 누적 확률 기준 자르기는 top_p의 설명입니다. temperature 0도 결정성을 보장하지 않습니다.
3. **오답** - top_k는 응답 길이와 무관하며 길이 상한은 `max_tokens`입니다. 비결정성은 1st-party와 서드파티 모두에 있습니다.
4. **오답** - temperature는 길이가 아니라 토큰 선택의 무작위성을 조절합니다. 응답 길이는 프롬프트와 `max_tokens`가 좌우합니다.

> 💡 **시험 포인트:** "temperature 0 = 완전 결정적"은 단골 함정입니다. 출력이 호출마다 달라질 수 있다는 전제로 시스템을 설계해야 합니다.

> 📎 참고: 개념 자체는 시험 범위지만 실제 API에서는 제약이 큽니다. Claude Opus 4.7 이후 모델과 Claude 5 계열은 기본값이 아닌 `temperature`·`top_p`·`top_k`에 400 오류를 반환하고, API 버전 `2026-10-21`부터는 모든 모델에서 이 파라미터를 보내기만 해도 400 오류가 납니다. 출력 성향은 프롬프트로 조정합니다.

> 📚 근거 문서: [Glossary](https://platform.claude.com/docs/en/about-claude/glossary) · [Thinking: limits and feature compatibility](https://platform.claude.com/docs/en/build-with-claude/thinking) · [Versions](https://platform.claude.com/docs/en/api/versioning)

---

## 문제 8
### **한 팀의 회귀 테스트 묶음은 매일 밤 같은 프롬프트 200개를 Claude에 보내고 각 응답을 저장해 둔 기준 문자열과 비교합니다. 매일 밤 약 15%가 실패하는데 실패하는 프롬프트는 매번 다르고, 사람이 검토해 보면 실패한 응답도 맞는 내용입니다. 가장 좋은 해결책은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. temperature를 0으로 설정해 모든 응답이 기준 문자열과 바이트 단위로 같아지게 한다 | |
| 2. 실패한 프롬프트를 응답이 기준 문자열과 정확히 일치할 때까지 재시도한 뒤 통과로 표시한다 | |
| **3. 응답의 정확한 문구 대신 구조와 필수 필드를 검사하고, 테스트를 반복 실행해 통과율을 추적한다** | |
| 4. 날짜가 붙은 모델 스냅샷을 고정한다. 실행 간 차이는 조용한 모델 업데이트에서만 생기기 때문이다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 같은 입력이라도 호출마다 출력이 달라질 수 있습니다(temperature 0이어도 마찬가지). 사람이 보기에 맞는 응답이 문구 차이로 실패한다면 **테스트가 잘못된 것을 재고 있는 것** 입니다. 정확한 문자열 대신 JSON 구조, 필수 키, 값의 범위, 반드시 들어가야 할 사실처럼 **요구사항을 직접 확인하는 검사** 로 바꾸고, 결과가 확률적이므로 여러 번 돌려 통과율로 판단합니다. 감사가 필요한 응답은 재생성에 기대지 말고 저장해 둡니다.

1. **오답** - temperature 0도 완전한 결정성을 보장하지 않습니다. 게다가 Claude Opus 4.7 이후 모델과 Claude 5 계열에서는 기본값이 아닌 temperature가 400 오류를 냅니다.
2. **오답** - 일치할 때까지 재시도하면 테스트가 아무것도 검증하지 못합니다. 실제 회귀가 생겨도 재시도로 가려집니다.
3. **정답** - 비결정적 출력에 맞는 검증 방식입니다. 구조·필드 검사는 문구 변화에는 흔들리지 않으면서 진짜 회귀는 잡아냅니다.
4. **오답** - Claude 모델 ID는 고정 스냅샷이므로 모델이 몰래 바뀌는 것이 원인이 아닙니다. 같은 스냅샷에서도 출력은 호출마다 달라질 수 있습니다.

> 💡 **시험 포인트:** LLM 출력 테스트는 "정확한 문자열 일치"가 아니라 "요구사항 충족 여부"를 검사해야 합니다. 비결정성은 버그가 아니라 설계 전제입니다.

> 📚 근거 문서: [Glossary](https://platform.claude.com/docs/en/about-claude/glossary) · [Models overview](https://platform.claude.com/docs/en/models/overview)

---

## 문제 9
### **인사 규정 봇이 Claude Opus 5.5에서 high effort로 운영됩니다. 일부 질문이 여러 단계의 자격 규칙을 따져야 하기 때문입니다. 로그를 보니 근무 시간 같은 사소한 질문에도 답하기 전에 사고를 해서 지연과 과금되는 사고 토큰이 늘어납니다. 어려운 질문 때문에 high effort는 유지해야 합니다. 팀은 무엇을 해야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 모든 요청에 type이 enabled이고 budget_tokens가 1024인 thinking 설정을 넣어 사고를 제한한다 | |
| 2. thinking display를 omitted로 설정해 사고 토큰이 더는 생성·과금되지 않게 한다 | |
| 3. temperature를 0으로 설정해 단순한 질문에서 모델이 대안을 탐색하지 않게 한다 | |
| **4. 사고는 지연을 늘리므로 답변 품질을 의미 있게 높일 때만 쓰라는 안내를 시스템 프롬프트에 넣고, 효과를 측정한다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 적응형 사고(adaptive thinking)는 요청마다 사고할지와 얼마나 할지를 모델이 정하며, **그 판단은 프롬프트로 조정할 수 있습니다.** 공식 문서의 순서는 ① effort로 기본 균형을 잡고 ② 그 수준에서도 사고 빈도가 맞지 않으면 시스템 프롬프트 안내를 더하는 것입니다. 이 팀은 effort를 낮출 수 없는 상황이므로 두 번째 단계가 맞습니다. 문서가 예로 드는 안내는 "사고는 지연을 늘리므로 다단계 추론이 필요한 문제처럼 답변 품질을 의미 있게 높일 때만 쓰고, 애매하면 바로 답하라"는 내용입니다. 문구에 민감하므로 적용 전후를 측정합니다.

1. **오답** - Claude Opus 5.5는 `budget_tokens`를 쓰는 수동(확장) 사고를 받지 않아 400 오류를 냅니다. 적응형 사고에서는 effort와 `max_tokens`로 비용을 다룹니다.
2. **오답** - `display: "omitted"`는 사고 텍스트를 응답에서 뺄 뿐, 사고 토큰은 그대로 생성되고 출력 토큰으로 과금됩니다.
3. **오답** - Opus 5.5는 기본값이 아닌 temperature에 400 오류를 냅니다. 설령 받더라도 temperature는 사고 여부를 정하는 장치가 아닙니다.
4. **정답** - effort를 유지해야 할 때 사고 빈도를 줄이는 문서화된 방법입니다. 다만 사고를 줄이면 어려운 질문의 품질이 떨어질 수 있으므로 측정이 필수입니다.

> 💡 **시험 포인트:** 사고를 덜 하게 만드는 첫 레버는 effort, 그다음이 프롬프트 안내입니다. `budget_tokens`는 최신 모델에서 400이고, `display: "omitted"`는 지연만 줄이고 비용은 그대로입니다.

> 📎 참고: CertSafari 체크포인트는 시스템 프롬프트 안내를 바로 정답으로 둡니다. 공식 문서는 사고를 줄이려면 effort를 먼저 낮추라고 권하므로, 이 문항은 effort를 낮출 수 없는 조건을 넣어 두 문서가 어긋나지 않게 했습니다. 또한 Sonnet 5.5·Haiku 5.5에서는 프롬프트로 사고를 줄이는 방법이 잘 듣지 않는다고 문서에 적혀 있어 Opus 5.5로 설정했습니다.

> 📚 근거 문서: [Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)

---

## 문제 10
### **대량의 상품 태깅 서비스가 Claude Haiku 5.5를 기본 effort로 운영합니다. 팀은 이 짧은 조회 작업에서 사고가 품질을 높이지 않는다는 것을 측정했고, 가장 낮은 지연을 위해 사고를 완전히 끄려고 합니다. 이를 달성하는 변경은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. type이 disabled인 thinking 설정을 보낸다. Claude Haiku 5.5는 high 이하 effort에서 이를 받아들인다** | |
| 2. 요청에서 thinking 필드를 뺀다. 사고는 그 필드가 있을 때만 실행되기 때문이다 | |
| 3. output_config.effort를 low로 낮춘다. 그러면 모든 요청에서 사고가 완전히 꺼진다 | |
| 4. 시스템 프롬프트에 "사고하지 말고 바로 답하라"를 넣는다. 그러면 세션 동안 사고가 비활성화된다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** Claude Haiku 5.5는 **thinking 필드가 없으면 적응형 사고로 실행** 됩니다. 사고를 확실히 끄려면 `thinking: {"type": "disabled"}`를 명시해야 하며, Haiku 5.5는 이를 effort `low`·`medium`·`high`에서 받고 `xhigh`·`max`에서는 400 오류를 냅니다. 이 서비스는 기본 effort(`medium`)이므로 그대로 쓸 수 있습니다. effort를 낮추는 것은 사고를 **줄일** 뿐 끄지는 않습니다.

1. **정답** - 적응형 사고가 기본인 모델에서 사고를 끄는 명시적 설정입니다. effort 조건(high 이하)도 충족합니다.
2. **오답** - Claude 5 이후 모델에서는 필드를 빼면 적응형 사고가 켜진 상태로 실행됩니다. 필드가 없을 때 사고가 꺼지는 것은 Opus 4.8·Sonnet 4.6 같은 이전 모델의 동작입니다.
3. **오답** - effort는 사고의 빈도와 깊이를 조절하는 부드러운 신호입니다. `low`에서도 충분히 어려운 문제라고 판단하면 모델은 사고합니다.
4. **오답** - 공식 문서는 Haiku 5.5에 프롬프트로 바로 답하라고 해도 사고가 멈추지 않았다고 밝힙니다. 프롬프트 안내는 설정으로 끄는 것을 대신하지 못합니다.

> 💡 **시험 포인트:** "완전히 끈다"면 `disabled`, "줄인다"면 effort입니다. 단, `disabled`를 받는 모델인지 먼저 확인하세요. Opus 5.5·Fable 5.1은 거부하고, Sonnet 5.5는 대신 `between_tools`를 씁니다. Models API의 `capabilities.thinking.types.disabled.supported`로 미리 확인할 수 있습니다.

> 📎 참고: CertSafari 체크포인트는 Claude Sonnet 5를 예로 듭니다(Sonnet 5도 `disabled`를 받습니다). 현재 라인업에서 같은 개념이 적용되는 모델로 Haiku 5.5를 썼고, 공식 문서의 effort 조건을 함께 반영했습니다.

> 📚 근거 문서: [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) · [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)

---

## 문제 11
### **Claude Opus 5.5가 low effort로 실행되도록 다음 요청 본문을 완성하세요. `{"model": "claude-opus-5-5", "max_tokens": 4096, ____: {"effort": "low"}, "messages": [...]}`. 빈칸에 들어갈 최상위 필드는 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. "thinking" | |
| **2. "output_config"** | |
| 3. "speed" | |
| 4. "metadata" | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** effort는 **`output_config.effort`** 에 둡니다. 세 필드의 역할을 구분해 두면 헷갈리지 않습니다.

| 최상위 필드 | 정하는 것 | 예 |
|---|---|---|
| `thinking` | 사고 **모드** (adaptive, disabled 등) | `{"type": "adaptive"}` |
| `output_config` | 출력에 쓰는 노력 수준(effort), 출력 형식 | `{"effort": "low"}` |
| `speed` | fast mode 사용 여부 | `"fast"` |

공식 문서는 effort를 `thinking` 객체 안이 아니라 `output_config.effort`에 둔다고 명시하고, `adaptive`는 사고 모드이지 effort 값이 아니라고 덧붙입니다.

1. **오답** - `thinking`은 사고를 켜고 끄거나 모드를 고르는 객체입니다. effort를 그 안에 넣으면 올바른 위치가 아닙니다.
2. **정답** - effort의 정식 위치입니다. 베타 헤더 없이 effort를 지원하는 모든 모델에서 쓸 수 있습니다.
3. **오답** - `speed`는 `"fast"` 값으로 fast mode를 켜는 최상위 필드입니다. 객체를 받지 않으며 effort와 무관합니다.
4. **오답** - `metadata`는 요청에 사용자 식별자 같은 부가 정보를 붙이는 용도로, 모델 동작을 조절하지 않습니다.

> 💡 **시험 포인트:** `thinking` = 사고 모드, `output_config.effort` = 노력 수준, `speed` = fast mode. 세 레버의 위치를 짝으로 외워 두세요.

> 📚 근거 문서: [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost) · [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)

---

## 문제 12
### **한 팀이 긴 리포트를 스트리밍하는 코드 리뷰 봇에 Claude Opus 5.5의 fast mode를 켭니다. 측정에 앞서 효과를 예측해 적어 둡니다. 문서와 일치하는 예측은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 봇이 더 작은 증류 모델로 바뀌므로 지연은 줄지만 리뷰 품질이 조금 떨어진다 | |
| 2. 첫 토큰까지의 시간(TTFT)이 가장 크게 줄고, 첫 토큰 이후의 출력 속도는 거의 같다 | |
| **3. 같은 모델이 출력 토큰을 최대 약 2.5배 빠르게 생성한다. 능력은 그대로이며 토큰당 가격은 더 높다** | |
| 4. 출력이 더 빠르고 더 싸진다. 빠른 추론은 토큰당 연산 자원을 덜 쓰기 때문이다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** fast mode는 **같은 모델을 더 빠른 추론 구성으로** 돌립니다. 지능과 능력은 바뀌지 않습니다. 이득은 **초당 출력 토큰 수(OTPS)** 에 집중되며 최대 약 2.5배이고, **TTFT는 주된 개선 대상이 아닙니다.** 그래서 긴 출력을 스트리밍할 때 효과가 가장 잘 보입니다. 대신 프리미엄 가격이 붙어 Opus 5.5 기준 입력 $8, 출력 $40(MTok당)으로 표준($4/$20)의 두 배입니다.

1. **오답** - fast mode는 다른 모델로 바꾸지 않습니다. 같은 모델, 같은 능력에 추론 구성만 다릅니다.
2. **오답** - 반대입니다. 개선은 출력 속도(OTPS)에 집중되고 TTFT는 크게 달라지지 않습니다.
3. **정답** - 같은 모델·같은 능력, 최대 2.5배 OTPS, 프리미엄 가격이라는 세 요소를 모두 맞혔습니다.
4. **오답** - fast mode는 더 비쌉니다. 비용을 줄이는 레버는 effort, 캐싱, 배치, 더 작은 모델입니다.

> 💡 **시험 포인트:** fast mode = "같은 모델 + 더 빠른 출력 + 더 비싼 값". 속도 문제가 TTFT라면 fast mode가 답이 아닐 수 있다는 점까지 기억하세요.

> 📚 근거 문서: [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

## 문제 13
### **Claude Opus 4.8을 쓰는 팀이 fast mode 접근 권한을 받았습니다. 이 모델에서 fast mode는 연구 프리뷰입니다. 모델을 바꾸지 않고 길게 스트리밍되는 리팩터링 출력이 더 빨리 끝나게 하려고 합니다. 필요한 요청 변경은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 요청 본문에 speed를 "fast"로 설정하고 fast-mode-2026-02-01 베타 헤더를 보낸다** | |
| 2. output_config.effort를 "fast"로 설정하고 표준 요청 헤더는 그대로 둔다 | |
| 3. 작업을 Message Batches API로 옮긴다. 그곳에서는 Opus 요청에 fast mode가 자동 적용된다 | |
| 4. thinking type을 disabled로 설정한다. 그러면 Opus 4.8이 더 빠른 추론 경로로 실행된다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** fast mode는 요청 본문의 **`speed: "fast"`** 로 켭니다. 모델별로 조건이 다릅니다.

| 모델 | 상태 | 필요한 것 |
|---|---|---|
| Claude Opus 5.5 | 정식 제공 | `speed: "fast"` (베타 헤더 불필요) |
| Claude Opus 5, Claude Opus 4.8 | 연구 프리뷰 | `speed: "fast"` + `fast-mode-2026-02-01` 베타 헤더, 접근 권한 |
| 그 밖의 모델 | 미지원 | 요청하면 오류 |

모델을 바꾸지 않고 긴 출력을 빨리 받는다는 목표에 정확히 맞는 레버이며, 응답의 `usage.speed`로 실제 적용된 속도를 확인할 수 있습니다.

1. **정답** - Opus 4.8 같은 연구 프리뷰 모델에서 fast mode를 쓰는 데 필요한 두 가지(본문 필드와 베타 헤더)를 모두 갖췄습니다.
2. **오답** - `"fast"`는 effort 값이 아닙니다. effort는 `low`·`medium`·`high`·`xhigh`·`max` 중 하나입니다.
3. **오답** - fast mode는 Batch API에서 쓸 수 없습니다. 배치는 비동기 처리로 비용을 낮추는 기능이지 속도를 높이는 기능이 아닙니다.
4. **오답** - Opus 4.8은 thinking 필드가 없으면 이미 사고 없이 실행됩니다. 사고를 끄는 것과 fast mode의 추론 구성은 별개입니다.

> 💡 **시험 포인트:** fast mode = `speed: "fast"`. 연구 프리뷰 모델(Opus 5, Opus 4.8)은 베타 헤더가 추가로 필요하고, Opus 5.5는 필요 없습니다. Batch API와는 함께 쓸 수 없습니다.

> 📚 근거 문서: [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

## 문제 14
### **한 물류 회사가 자유 형식의 배송 메모를 날짜, 창고 코드, 상태가 담긴 엄격한 형식의 한 줄로 바꾸는 데 Claude를 쓰려고 합니다. 지시만으로는 여전히 가끔 형식이 흐트러집니다. 팀은 예시를 어떻게 써야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 길고 매우 자세한 예시 하나를 제공한다. 예시가 하나면 변형 때문에 모델이 헷갈리지 않기 때문이다 | |
| 2. 가장 흔한 메모 유형의 거의 똑같은 예시 20개를 제공해 패턴을 강하게 굳힌다 | |
| 3. 예시를 구분자 없이 입력 뒤에 두어 모델이 예시를 작업의 일부로 다루게 한다 | |
| **4. 실제 메모를 닮고, 표현이 다양하며, 창고 코드가 빠진 경우 같은 엣지 케이스를 포함한 예시 3~5개를 example 태그로 감싸 제공한다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.1 LLM Fundamentals

> **핵심 진단:** 공식 프롬프팅 가이드는 예시를 출력의 **형식·어조·구조를 이끄는 가장 믿을 만한 방법** 중 하나로 꼽고, 세 가지 조건을 제시합니다. **관련성**(실제 사용 사례를 닮을 것), **다양성**(엣지 케이스를 포함하고, 의도하지 않은 패턴을 배우지 않을 만큼 서로 다를 것), **구조**(`<example>` 태그로 감싸고 여러 개는 `<examples>`로 묶어 지시와 구분할 것)입니다. 개수는 **3~5개** 를 권합니다.

```text
<examples>
<example>
note: "Left at Busan hub 10/28, scanned twice"
output: 2026-10-28,PUS-01,DELIVERED_TO_HUB
</example>
<example>
note: "driver says no depot listed, customer refused"
output: UNKNOWN_DATE,NONE,REFUSED
</example>
</examples>
```

1. **오답** - 예시가 하나뿐이면 모델이 그 예시의 우연한 특징(길이, 단어 선택)까지 따라 하기 쉽고, 엣지 케이스를 보여 줄 수 없습니다.
2. **오답** - 거의 똑같은 예시를 많이 넣으면 다양성이 없어 의도하지 않은 패턴을 배웁니다. 드문 형태의 메모에서 오히려 무너집니다.
3. **오답** - 구분자 없이 섞으면 모델이 예시와 실제 입력, 지시를 구분하기 어렵습니다. 태그로 감싸는 것이 권장 방식입니다.
4. **정답** - 개수(3~5), 관련성, 다양성(엣지 케이스 포함), 구조(태그)라는 공식 권장을 모두 갖췄습니다.

> 💡 **시험 포인트:** 예시 문항의 정답 신호는 "3~5개 · 실제와 닮음 · 다양함(엣지 케이스) · `<example>` 태그"입니다.

> 📚 근거 문서: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

---

## 문제 15
### **300쪽짜리 계약서 묶음을 Claude에 보내기 전에, 앱은 출력을 생성하지 않고 요청이 모델의 컨텍스트 윈도에 들어가는지 확인하고 입력 비용을 추정해야 합니다. 어떤 엔드포인트를 호출해야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. `max_tokens`를 1로 설정한 `POST /v1/messages` | |
| **2. `POST /v1/messages/count_tokens`** | |
| 3. `GET /v1/models/{model_id}` | |
| 4. `POST /v1/messages/batches` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 토큰 카운팅 API(`POST /v1/messages/count_tokens`)는 메시지 생성과 **같은 구조의 입력**(시스템 프롬프트, 메시지, 도구, 이미지, PDF)을 받아 **입력 토큰 수만** 돌려줍니다. 추론을 실행하지 않고, 사용은 무료이며(분당 요청 수 제한만 있음), 메시지 생성과는 별도의 독립된 속도 제한을 씁니다. 결과는 추정치라 실제 생성 시 아주 조금 다를 수 있습니다.

1. **오답** - 이 호출은 실제 생성 요청이라 입력 토큰 전체가 과금되고, 1토큰이라도 출력이 생성됩니다. 큰 문서라면 확인 비용만 상당합니다.
2. **정답** - 생성 없이 입력 크기를 재는 전용 엔드포인트입니다. 컨텍스트 적합성과 비용 추정, 모델 라우팅 판단에 씁니다.
3. **오답** - Models API는 모델의 `max_input_tokens`·`max_tokens` 같은 한도를 알려 줄 뿐, 특정 요청의 토큰 수는 세지 않습니다.
4. **오답** - Message Batches API는 요청을 비동기로 50% 할인해 처리하는 생성 엔드포인트입니다. 토큰을 세는 기능이 아닙니다.

> 💡 **시험 포인트:** "생성 없이 입력 토큰 수를 알고 싶다" = `count_tokens`. 모델 한도 조회(Models API)와 혼동하지 마세요.

> 📚 근거 문서: [API overview](https://platform.claude.com/docs/en/api/overview) · [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)

---

## 문제 16
### **한 Go 서비스가 SDK 대신 net/http로 Messages API를 직접 호출합니다. API 키는 단일 워크스페이스에 한정되어 있고, 요청은 베타 기능을 쓰지 않습니다. 모든 요청에 반드시 실어야 할 헤더 조합은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. `x-api-key`와 `content-type: application/json`만 | |
| 2. `x-api-key`, `anthropic-version`, `anthropic-beta`, `anthropic-workspace-id` | |
| 3. 키를 담은 `Authorization: Bearer`, `anthropic-workspace-id`, `content-type` | |
| **4. 인증 헤더(`x-api-key` 또는 `Authorization: Bearer`), `anthropic-version`, `content-type: application/json`** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** API 개요 문서의 헤더 표는 세 가지를 필수로 둡니다. **인증 정보**(`Authorization: Bearer <token>`, 또는 여전히 지원되는 레거시 방식 `x-api-key`), **`anthropic-version`**(날짜 형식의 API 버전), **`content-type: application/json`** 입니다. `anthropic-workspace-id`는 워크스페이스에 한정되지 않은 키를 쓸 때만 필수이고, 단일 워크스페이스 키는 헤더를 생략하면 그 워크스페이스에서 실행됩니다. `anthropic-beta`는 베타 기능을 쓸 때만 붙입니다.

```text
POST https://api.anthropic.com/v1/messages
x-api-key: $ANTHROPIC_API_KEY        # 또는 Authorization: Bearer ...
anthropic-version: 2023-06-01        # 최신 버전은 2026-10-21
content-type: application/json
```

1. **오답** - 가장 흔한 함정입니다. `anthropic-version`은 항상 필수입니다. SDK를 쓰면 자동으로 붙기 때문에 원시 호출에서 빠뜨리기 쉽습니다.
2. **오답** - 베타 기능을 쓰지 않으므로 `anthropic-beta`는 필요 없고, 단일 워크스페이스 키라 `anthropic-workspace-id`도 필수가 아닙니다.
3. **오답** - `anthropic-version`이 빠졌고, 이 키에는 필요 없는 워크스페이스 헤더를 필수로 넣었습니다.
4. **정답** - 인증, 버전, 콘텐츠 유형이라는 세 필수 헤더를 정확히 짚었습니다.

> 💡 **시험 포인트:** 원시 HTTP 호출의 필수 헤더는 "인증 + `anthropic-version` + `content-type`"입니다. 워크스페이스 헤더와 베타 헤더는 조건부입니다.

> 📎 참고: CertSafari는 인증 헤더로 `x-api-key`만 제시합니다. 현재 공식 API 개요는 `Authorization: Bearer`를 기본 인증 헤더로, `x-api-key`를 계속 지원되는 레거시 대안으로 적고 있어 보기에서 둘 다 인정했습니다.

> 📚 근거 문서: [API overview](https://platform.claude.com/docs/en/api/overview) · [Versions](https://platform.claude.com/docs/en/api/versioning)

---

## 문제 17
### **한 스트리밍 클라이언트가 콘텐츠 블록마다 별도의 UI 패널을 그리고, Claude가 그 블록에 더는 델타를 보내지 않는 즉시 패널을 완료로 표시하려고 합니다. 어떤 SSE 이벤트를 신호로 삼아야 할까요?**

| 보기 | 설명 |
|------|------|
| **1. 그 블록의 index에 대한 `content_block_stop`** | |
| 2. `stop_reason`을 담은 `message_delta` | |
| 3. `message_stop` | |
| 4. 블록의 마지막 델타 뒤에 오는 첫 `ping` 이벤트 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 스트림 안의 콘텐츠 블록은 각각 **`content_block_start` → `content_block_delta`(1회 이상) → `content_block_stop`** 으로 이루어지고, 모든 이벤트가 최종 `content` 배열의 위치와 같은 `index`를 가집니다. 따라서 어떤 index의 `content_block_stop`을 받으면 그 블록에는 더 이상 델타가 오지 않습니다. 블록 단위로 '완료'를 판단하는 신호입니다.

1. **정답** - 블록별 종료 이벤트이므로, 다른 블록이 아직 스트리밍 중이어도 해당 패널만 정확히 완료 처리할 수 있습니다.
2. **오답** - `message_delta`는 `stop_reason`·usage 같은 **메시지 전체** 수준의 변경을 알립니다. 모든 블록이 끝난 뒤에 오므로 블록별 완료 신호로는 늦습니다.
3. **오답** - `message_stop`은 스트림 전체의 마지막 이벤트입니다. 블록이 여러 개라면 앞 블록의 완료를 한참 늦게 알게 됩니다.
4. **오답** - `ping` 이벤트는 스트림 어디에든 몇 번이든 올 수 있고 내용이 없습니다. 블록 상태와 아무 관련이 없습니다.

> 💡 **시험 포인트:** 블록 종료 = `content_block_stop`, 메시지 수준 변경 = `message_delta`, 스트림 종료 = `message_stop`. 세 '끝' 이벤트의 범위를 구분하세요.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)

---

## 문제 18
### **한 팀이 원시 HTTP 호출에서 Python SDK로 옮깁니다. 이들의 자격 증명은 어떤 워크스페이스에도 한정되지 않은 서비스 계정 API 키입니다. 전환 후에도 직접 설정해야 할 수 있는 요청 헤더는 무엇이라고 예측할까요?**

| 보기 | 설명 |
|------|------|
| 1. `anthropic-version`. SDK는 API 버전을 스스로 고르지 않기 때문이다 | |
| 2. `content-type`. SDK는 기본적으로 폼 인코딩 본문을 보내기 때문이다 | |
| **3. `anthropic-workspace-id`. SDK는 인증·버전·콘텐츠 유형 헤더를 보내지만, 범위가 정해지지 않은 키의 워크스페이스는 추론할 수 없기 때문이다** | |
| 4. `request-id`. 클라이언트가 호출마다 고유 식별자를 만들어야 하기 때문이다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** API 개요 문서는 "SDK를 쓰면 인증, 버전, content-type 헤더를 자동으로 보내지만, **키에 필요한 경우 `anthropic-workspace-id`는 직접 전달한다**"고 명시합니다. Python SDK 문서도 워크스페이스에 한정되지 않은 개인 키나 서비스 계정 키라면 이 헤더에 워크스페이스 ID를 넣으라고 안내합니다. 단일 워크스페이스용으로 만든 키라면 생략해도 그 워크스페이스에서 실행됩니다.

1. **오답** - SDK는 메이저 버전마다 정해진 `anthropic-version`을 기본으로 보냅니다(2.0.0부터 `2026-10-21`). 직접 덮어쓰면 오히려 타입 불일치 같은 문제가 생길 수 있습니다.
2. **오답** - SDK는 JSON 본문과 올바른 `content-type`을 자동으로 설정합니다.
3. **정답** - SDK가 대신하지 못하는 유일한 조건부 헤더입니다. 키 종류에 따라 필요 여부가 갈립니다.
4. **오답** - `request-id`는 API가 **응답에** 붙여 주는 헤더입니다. 클라이언트가 만들어 보내는 값이 아니며, SDK는 이를 `_request_id` 속성으로 노출합니다.

> 💡 **시험 포인트:** "SDK로 바꾸면 헤더는 신경 쓸 필요가 없다"는 보기는 함정입니다. 워크스페이스 헤더는 키의 범위에 따라 여전히 개발자 몫입니다.

> 📎 참고: CertSafari는 이 조건을 "키가 여러 워크스페이스에 걸쳐 있을 때"로 설명합니다. 공식 문서의 표현은 "워크스페이스에 한정되지 않은 키(개인 키·서비스 계정 키)"이므로 문항은 공식 표현을 따랐습니다.

> 📚 근거 문서: [API overview](https://platform.claude.com/docs/en/api/overview) · [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python)

---

## 문제 19
### **한 데이터 과학자가 인자 없이 `client = anthropic.Anthropic()`으로 클라이언트를 만듭니다. 이 클라이언트가 인증하려면 기본적으로 어떤 환경 변수에 API 키가 들어 있어야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. `CLAUDE_API_KEY` | |
| 2. `ANTHROPIC_KEY` | |
| **3. `ANTHROPIC_API_KEY`** | |
| 4. `ANTHROPIC_BASE_URL` | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** Python SDK 문서의 기본 사용 예는 `api_key=os.environ.get("ANTHROPIC_API_KEY")`에 "이것이 기본값이므로 생략할 수 있다"는 주석을 붙입니다. 즉 인자 없이 클라이언트를 만들면 SDK가 **`ANTHROPIC_API_KEY`** 를 읽습니다. 키를 소스 코드에 두지 말고 `.env` 파일 등으로 환경 변수에 넣으라는 권고도 함께 있습니다.

```python
import anthropic

client = anthropic.Anthropic()   # ANTHROPIC_API_KEY를 자동으로 읽는다
```

1. **오답** - SDK가 기본으로 읽는 이름이 아닙니다. 이 변수에 키를 넣어도 인자 없이 만든 클라이언트는 인증에 실패합니다.
2. **오답** - 비슷해 보이지만 기본 변수명이 아닙니다. 정확한 이름은 `ANTHROPIC_API_KEY`입니다.
3. **정답** - Python SDK(와 다른 공식 SDK)가 기본으로 읽는 API 키 환경 변수입니다.
4. **오답** - `ANTHROPIC_BASE_URL`은 요청을 보낼 기본 URL을 바꾸는 변수로, 인증 정보가 아닙니다.

> 💡 **시험 포인트:** 기본 API 키 환경 변수는 `ANTHROPIC_API_KEY`입니다. 키는 코드가 아니라 환경 변수나 비밀 관리 도구에 둡니다.

> 📚 근거 문서: [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python)

---

## 문제 20
### **한 워커가 Python SDK 호출을 모두 자체 루프로 감싸, 5xx 오류가 나면 최대 5번 재시도합니다. 과부하 장애 중 로그를 보니 작업당 시도 횟수가 예상보다 훨씬 많고 오래 멈춰 있습니다. 원인과 해결책은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. SDK가 이미 5xx 등 일시적 오류를 기본 2회, 백오프와 함께 재시도하므로 두 계층의 시도가 곱해진다. 바깥 루프를 없애거나 클라이언트의 max_retries를 조정한다** | |
| 2. SDK는 서버 오류를 스스로 재시도하지 않으므로 멈춤은 바깥 루프의 고정 대기 때문이다. 그 대기 시간을 줄인다 | |
| 3. SDK는 429 응답만 재시도하므로 5xx에는 바깥 루프가 필요하다. 루프에 무작위 지터를 더해 시도를 분산한다 | |
| 4. SDK에서 과부하 응답은 400 오류로 오므로 어느 계층도 재시도하면 안 된다. 해당 작업을 즉시 실패로 처리한다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 공식 SDK는 **연결 오류, 408, 409, 429, 5xx** 를 짧은 지수 백오프로 **기본 2회** 자동 재시도하고, `retry-after` 헤더가 있으면 따릅니다. 바깥에서 5회를 다시 감싸면 한 작업이 최대 (1+5) × (1+2) = 18번까지 시도되고 백오프 대기도 겹칩니다. 재시도는 한 계층에서만 관리합니다. 보통은 SDK의 `max_retries`를 전역(`Anthropic(max_retries=...)`)이나 요청별(`client.with_options(max_retries=...)`)로 조정하는 것이 가장 간단합니다.

1. **정답** - 재시도 중첩이라는 원인과, 한 계층으로 정리하는 해결책을 모두 맞혔습니다.
2. **오답** - SDK는 5xx를 기본으로 재시도합니다. 바깥 대기만 줄이면 시도 횟수 폭증은 그대로입니다.
3. **오답** - SDK의 자동 재시도 대상에는 429뿐 아니라 5xx와 연결 오류도 포함됩니다. 지터를 더해도 중첩 문제는 남습니다.
4. **오답** - 과부하는 529 `overloaded_error`(5xx 계열)로 오며 재시도할 가치가 있는 일시적 오류입니다. 400은 요청 자체의 문제입니다.

> 💡 **시험 포인트:** SDK를 쓰면서 직접 재시도 루프를 또 감싸는 것은 안티패턴입니다. 시도 횟수는 `max_retries` 하나로 관리하세요.

> 📚 근거 문서: [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 21
### **결제팀이 한 요청에서 500 api_error를 받았고, Anthropic 지원팀이 바로 그 요청을 찾을 수 있게 하려고 합니다. 지원 티켓에 무엇을 넣어야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 응답 본문의 `error.type` 값 | |
| 2. 호출 시각과 사용한 모델 ID | |
| 3. `anthropic-organization-id` 응답 헤더 | |
| **4. 오류 본문의 `request_id`. `request-id` 응답 헤더와 같은 값이다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 모든 API 응답에는 `req_018E...` 같은 **전역 고유 식별자** 가 `request-id` 헤더로 붙고, 같은 값이 오류 응답 본문의 **`request_id`** 필드에도 들어갑니다. 공식 문서는 특정 요청에 대해 지원팀에 문의할 때 이 ID를 넣으라고 안내합니다. 500 오류 설명에도 "지속되면 request ID와 함께 지원팀에 문의하라"고 적혀 있습니다. Python·TypeScript SDK에서는 응답 객체의 `_request_id` 속성으로 읽습니다.

```json
{
  "type": "error",
  "error": { "type": "api_error", "message": "Internal server error" },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

1. **오답** - `error.type`은 `api_error` 같은 **오류 범주** 입니다. 같은 범주의 오류는 수없이 많으므로 특정 요청을 가리키지 못합니다.
2. **오답** - 시각과 모델만으로는 같은 시점의 수많은 요청 가운데 하나를 특정하기 어렵습니다.
3. **오답** - 조직 ID는 어느 조직의 요청인지만 알려 줍니다. 요청 단위 식별자가 아닙니다.
4. **정답** - 요청마다 고유한 식별자이며, 헤더와 본문 어느 쪽에서 읽어도 같은 값입니다.

> 💡 **시험 포인트:** 지원 문의의 열쇠는 `request_id`(본문) = `request-id`(헤더)입니다. 실패한 요청은 이 ID를 로그에 남겨 두세요.

> 📚 근거 문서: [Claude API errors](https://platform.claude.com/docs/en/api/errors) · [API overview](https://platform.claude.com/docs/en/api/overview)

---

## 문제 22
### **한 튜터링 앱이 Claude의 답변을 스트리밍합니다. 개발자는 첫 턴 이후 서버가 대화를 기억한다고 가정하고, 후속 질문에서는 새 사용자 메시지만 보냅니다. 학생들은 Claude가 앞선 대화를 잊어버린다고 말합니다. 멀티턴 스트리밍에 대한 올바른 설명은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 스트림은 웹소켓 세션이다. 클라이언트가 같은 세션 ID로 다시 연결하면 기록이 복원된다 | |
| **2. API는 상태가 없다. 후속 질문마다 전체 기록을 담은 새 POST를 /v1/messages로 보내고, 그 답이 해당 요청의 응답으로 SSE를 통해 스트리밍된다** | |
| 3. 서버는 기록을 5분간 저장하므로, 학생이 캐시 수명보다 오래 쉬었을 때만 후속 질문이 실패한다 | |
| 4. 후속 메시지는 클라이언트가 아직 열려 있는 스트림에 content_block_delta 이벤트로 밀어 넣어야 한다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** Messages API는 **상태가 없습니다(stateless).** 공식 문서는 "항상 전체 대화 기록을 API에 보낸다"고 명시합니다. 스트리밍도 다르지 않습니다. 같은 `POST /v1/messages`에 `"stream": true`를 넣은 요청이고, 답이 그 HTTP 응답에 **서버 전송 이벤트(SSE)** 로 흘러나올 뿐입니다. 웹소켓 같은 양방향 세션이 아니라 요청 하나에 응답 스트림 하나입니다. 따라서 후속 턴마다 이전 user·assistant 메시지를 모두 담아 새 요청을 보내야 합니다.

1. **오답** - 스트리밍은 웹소켓이 아니라 단방향 SSE입니다. 복원할 서버 측 세션도 없습니다.
2. **정답** - 무상태 API와 요청별 SSE 응답이라는 두 사실을 정확히 설명합니다.
3. **오답** - 프롬프트 캐시는 같은 접두사를 다시 보낼 때 처리 비용을 줄일 뿐, 대화를 저장해 주지 않습니다. 기록을 안 보내면 쉬는 시간과 무관하게 맥락이 사라집니다.
4. **오답** - `content_block_delta`는 서버가 클라이언트로 보내는 이벤트입니다. SSE는 단방향이라 클라이언트가 열린 스트림으로 메시지를 보낼 수 없습니다.

> 💡 **시험 포인트:** "스트리밍 = 같은 POST + `stream: true` + SSE 응답"이며, 멀티턴은 매번 전체 기록을 보내는 새 요청입니다. 서버 쪽 세션 기억을 전제한 보기는 오답입니다.

> 📚 근거 문서: [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages) · [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)

---

## 문제 23
### **한 개발자가 텍스트 블록 하나로 된 스트리밍 응답의 SSE 이벤트를 기록합니다. ping 이벤트를 무시할 때, 문서화된 이벤트 흐름과 일치하는 순서는 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. message_start → content_block_start → content_block_delta(1회 이상) → content_block_stop → message_delta → message_stop** | |
| 2. message_start → content_block_delta → content_block_start → content_block_stop → message_stop → message_delta | |
| 3. content_block_start → message_start → content_block_delta → message_delta → content_block_stop → message_stop | |
| 4. message_start → message_delta → content_block_start → content_block_delta → content_block_stop → message_stop | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 공식 문서의 이벤트 흐름은 고정되어 있습니다.

- 시작: `message_start` (비어 있는 `content`를 가진 `Message` 객체)
- 콘텐츠 블록마다: `content_block_start` → `content_block_delta`(1회 이상) → `content_block_stop`
- 그다음: 최종 `Message`의 최상위 변경(`stop_reason`, usage)을 알리는 `message_delta`(1회 이상)
- 마지막: `message_stop`

`ping` 이벤트는 이 사이 어디에든 몇 번이든 끼어들 수 있습니다.

1. **정답** - 메시지 시작, 블록 시작·델타·종료, 메시지 수준 변경, 메시지 종료의 순서가 문서와 같습니다.
2. **오답** - 블록이 시작되기 전에 델타가 올 수 없고, `message_stop`은 언제나 마지막입니다.
3. **오답** - 모든 스트림은 `message_start`로 시작합니다. `message_delta`도 블록이 끝난 뒤에 옵니다.
4. **오답** - `message_delta`는 `stop_reason`과 누적 usage를 담으므로 콘텐츠 블록이 모두 끝난 뒤에 옵니다.

> 💡 **시험 포인트:** 순서는 "메시지 열기 → (블록 열기 → 델타 → 블록 닫기) × N → 메시지 변경 → 메시지 닫기"입니다. `message_delta`가 블록 뒤라는 점이 자주 나옵니다.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)

---

## 문제 24
### **각 스트리밍 델타 유형을 그것이 갱신하는 대상과 짝지으세요. (a) text_delta, (b) input_json_delta, (c) thinking_delta, (d) signature_delta. 올바른 짝은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. (a) 이벤트마다 파싱하는 tool_use 입력, (b) 텍스트 블록에 덧붙임, (c) 무결성 서명을 전달, (d) thinking 필드에 추가 | |
| 2. (a) 텍스트 블록에 덧붙임, (b) 이벤트마다 완전한 JSON 객체 하나를 전달, (c) thinking 필드에 추가, (d) 메시지 수준 stop_reason을 설정 | |
| **3. (a) 텍스트 블록에 덧붙임, (b) tool_use 입력에 부분 JSON 문자열을 추가, (c) thinking 필드에 추가, (d) 사고 블록이 끝나기 직전에 그 블록의 무결성 서명을 전달** | |
| 4. (a) 텍스트 블록에 덧붙임, (b) tool_use 입력에 부분 JSON 문자열을 추가, (c) thinking 필드에 추가, (d) 마지막 블록 뒤에 메시지 전체의 끝을 표시 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 각 `content_block_delta`는 주어진 `index`의 블록을 갱신하는 `delta`를 담고, 델타 유형이 어느 필드를 갱신할지 정합니다.

| 델타 유형 | 갱신 대상 | 주의할 점 |
|---|---|---|
| `text_delta` | `text` 블록의 텍스트 | 조각을 순서대로 이어 붙인다 |
| `input_json_delta` | `tool_use` 블록의 `input` | `partial_json`은 **부분 문자열**. 모아서 블록 종료 때 파싱 |
| `thinking_delta` | `thinking` 블록의 `thinking` 필드 | `display: "omitted"`면 빈 문자열 하나만 온다 |
| `signature_delta` | `thinking` 블록의 `signature` | `content_block_stop` 직전에 한 번, 무결성 검증용 |

1. **오답** - 네 항목이 서로 뒤섞였습니다. 특히 도구 입력은 이벤트마다 파싱하면 안 됩니다.
2. **오답** - `input_json_delta`는 완전한 객체가 아니라 부분 JSON 문자열입니다. `stop_reason`은 델타 유형이 아니라 `message_delta` 이벤트가 전합니다.
3. **정답** - 네 델타 유형의 역할과, 서명이 블록 종료 직전에 온다는 점까지 정확합니다.
4. **오답** - 메시지 전체의 끝은 `message_stop` 이벤트가 알립니다. `signature_delta`는 사고 블록 하나의 서명입니다.

> 💡 **시험 포인트:** `signature_delta`는 사고 블록의 마지막 델타(종료 직전)이며 무결성 검증용입니다. 멀티턴·도구 사용에서 사고 블록을 돌려보낼 때 이 서명이 그대로 있어야 합니다.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)

---

## 문제 25
### **한 스트리밍 에이전트가 도구를 일찍 시작하려고, 받는 input_json_delta의 partial_json 문자열마다 json.loads()를 호출합니다. 대부분의 도구 호출에서 JSONDecodeError로 죽습니다. 올바른 처리 방법은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 시스템 프롬프트에서 Claude에게 델타마다 도구 인자를 완전한 JSON 객체로 내보내라고 요청한다 | |
| **2. 그 블록 index의 partial_json 문자열을 이어 붙이고, 해당 블록의 content_block_stop이 오면 한 번에 파싱한다. 또는 SDK의 스트리밍 헬퍼를 쓴다** | |
| 3. tool_choice로 도구를 강제한다. 그러면 API가 도구 입력 전체를 델타 하나로 보낸다 | |
| 4. input_json_delta 이벤트는 무시하고, 완성된 도구 입력을 message_start 이벤트에서 읽는다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 공식 문서에 따르면 `tool_use` 블록의 델타는 **부분 JSON 문자열** 이고, 최종 `tool_use.input`만 객체입니다. 조각 하나는 대부분 유효한 JSON이 아니므로 바로 파싱하면 실패합니다. 문서가 권하는 방법은 **문자열 델타를 모아 두었다가 `content_block_stop`을 받으면 파싱** 하는 것이고, 필요하면 Pydantic 같은 부분 JSON 파서나 SDK 스트리밍 헬퍼(Python·TypeScript는 파싱된 입력을 점진적으로 제공)를 씁니다.

```python
buf = {}                                   # index -> 이어 붙인 문자열
for event in stream:
    if event.type == "content_block_delta" and \
       event.delta.type == "input_json_delta":
        buf[event.index] = buf.get(event.index, "") + \
            event.delta.partial_json
    elif event.type == "content_block_stop" and event.index in buf:
        tool_input = json.loads(buf.pop(event.index))  # 여기서 한 번만
```

1. **오답** - 델타의 형태는 API 프로토콜이 정합니다. 프롬프트로 바꿀 수 없습니다.
2. **정답** - 블록별로 조각을 모으고 블록 종료 시점에 파싱하는, 문서가 권장하는 방식입니다.
3. **오답** - 강제 도구 선택은 델타를 하나로 합쳐 주지 않습니다. 게다가 Opus 5.5·Sonnet 5.5 같은 모델은 강제 도구 선택 자체를 400으로 거부합니다.
4. **오답** - `message_start`의 `Message`는 `content`가 비어 있습니다. 도구 입력은 델타로만 전달됩니다.

> 💡 **시험 포인트:** `input_json_delta` = 부분 문자열. "모아서, 블록이 끝날 때, 한 번 파싱"이 정답 패턴입니다.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)

---

## 문제 26
### **모니터링 서비스의 원시 SSE 파서는 모르는 이벤트 유형을 볼 때마다 예외를 던지고 연결을 끊습니다. API가 업데이트된 뒤 새 이벤트 유형이 나타나기 시작했고 스트림이 실패합니다. 파서는 이벤트를 어떻게 다뤄야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 파서를 고정된 이벤트 유형 목록에 묶고, 새 유형은 치명적 프로토콜 오류로 처리한다 | |
| 2. 모르는 이벤트 유형이 나타나면 스트림이 손상된 것이므로 요청 전체를 재시도한다 | |
| 3. 새 이벤트 유형은 스트림에서만 나타나므로 연동을 비스트리밍 호출로 바꾼다 | |
| **4. 모르는 이벤트 유형은 조용히 건너뛰고 처리를 계속한다. 버전 정책상 새 이벤트 유형이 추가될 수 있기 때문이다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** API 버전 정책은 같은 버전 안에서도 **스트리밍 이벤트 유형 같은 열거형 출력에 새 값을 추가** 할 수 있다고 밝힙니다. 스트리밍 문서도 "새 이벤트 유형이 추가될 수 있으니 코드는 **모르는 이벤트 유형을 우아하게 처리** 해야 한다"고 명시합니다. 즉 아는 유형만 처리하고 나머지는 건너뛰는 '관대한 파서'가 맞습니다.

1. **오답** - 버전 정책이 허용하는 변경을 치명적 오류로 다루면, 하위 호환인 업데이트에도 서비스가 깨집니다.
2. **오답** - 새 이벤트는 손상 신호가 아닙니다. 재시도해도 같은 이벤트가 다시 오므로 무한 실패에 빠집니다.
3. **오답** - 스트리밍을 포기할 이유가 없고, 비스트리밍 응답에도 새 필드나 새 값이 추가될 수 있습니다. 긴 출력에서는 스트리밍이 오히려 권장됩니다.
4. **정답** - 버전 정책과 스트리밍 문서가 요구하는 처리 방식입니다.

> 💡 **시험 포인트:** 원시 SSE 파서는 "아는 것만 처리하고 모르는 것은 무시"가 원칙입니다. 오류 이벤트(`error`)는 따로 처리해야 한다는 점도 함께 기억하세요.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Versions](https://platform.claude.com/docs/en/api/versioning)

---

## 문제 27
### **한 스트리밍 응답이 usage.output_tokens 값이 차례로 55, 140, 362인 message_delta 이벤트 세 개로 끝납니다. 과금 서비스는 이 응답의 출력 토큰을 기록합니다. 어떤 값을 기록해야 한다고 예측할까요?**

| 보기 | 설명 |
|------|------|
| 1. 557. 세 message_delta 값의 합 | |
| 2. 55. 이후 message_delta 이벤트는 이미 보고한 값을 반복하기 때문이다 | |
| 3. message_start의 output_tokens 값. message_delta의 usage는 추정치일 뿐이기 때문이다 | |
| **4. 362, 마지막 값. message_delta의 usage는 누적값이기 때문이다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 공식 스트리밍 문서는 경고 상자로 "`message_delta` 이벤트의 `usage` 필드에 있는 토큰 수는 **누적값** 이다"라고 강조합니다. 각 이벤트는 그 시점까지의 합계를 알려 주므로 **마지막 값이 최종 합계** 입니다. 값을 더하면 이중·삼중으로 계산하게 됩니다. 사고 토큰 내역(`output_tokens_details.thinking_tokens`)도 스트리밍에서는 마지막 `message_delta`에만 나옵니다.

1. **오답** - 누적값을 다시 더하면 실제(362)보다 크게 과대 계상됩니다. 대표적인 시험 함정입니다.
2. **오답** - 이후 이벤트는 반복이 아니라 갱신된 합계입니다. 첫 값은 중간 시점의 수치일 뿐입니다.
3. **오답** - `message_start`는 생성 시작 시점의 객체라 최종 출력 토큰 수를 알 수 없습니다. 최종값은 마지막 `message_delta`에 있습니다.
4. **정답** - 누적값의 마지막이 이 응답의 출력 토큰 합계입니다.

> 💡 **시험 포인트:** 스트리밍 usage는 "더하지 말고 마지막 값을 쓴다". SDK의 `get_final_message()`를 쓰면 최종 usage가 담긴 `Message`를 그대로 받을 수 있습니다.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)

---

## 문제 28
### **한 요약 서비스는 HTTP 200 상태면 모두 성공으로 처리합니다. 사용자가 가끔 문장 중간에서 끊긴 요약을 받는데, 해당 요청은 로그에 상태 200으로 남아 있지만 최종 message_delta나 stop_reason은 기록된 적이 없습니다. 서비스의 가장 가능성 높은 허점은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 스트림 안으로 전달되는 오류 이벤트를 무시한다. overloaded_error 같은 오류는 200 상태가 전송된 뒤 SSE 이벤트로 올 수 있다** | |
| 2. anthropic-version 헤더를 빠뜨렸다. 그러면 API가 오류를 알리지 않고 긴 응답을 잘라 낸다 | |
| 3. ping 이벤트가 오기 전에 읽기를 멈춘다. ping 이벤트에 응답의 나머지 텍스트가 담겨 있다 | |
| 4. 모델이 max_tokens에 도달했다. API는 이를 응답의 HTTP 상태 코드로만 알린다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 스트리밍에서는 HTTP 상태가 **스트림이 시작될 때 이미 200으로 확정** 됩니다. 그 뒤 생성 도중 문제가 생기면 API는 `event: error`와 `{"type": "error", "error": {"type": "overloaded_error", ...}}` 같은 **SSE 오류 이벤트** 로 알립니다(비스트리밍이었다면 529에 해당). 오류 문서도 SSE 응답에서는 200 뒤에 오류가 날 수 있고 이때 일반 오류 처리 방식이 적용되지 않는다고 설명합니다. 상태 코드만 보면 이 실패를 놓칩니다. 정상 종료는 `stop_reason`이 담긴 `message_delta`와 `message_stop`으로 확인합니다.

1. **정답** - 200 뒤 스트림 내부 오류라는 원인을 정확히 짚었습니다. `error` 이벤트를 처리하고 `message_stop` 수신 여부로 완료를 판정해야 합니다.
2. **오답** - `anthropic-version`이 빠지면 요청이 처음부터 거부됩니다. 200으로 시작했다가 조용히 잘리는 증상과 맞지 않습니다.
3. **오답** - `ping` 이벤트에는 내용이 없습니다. 텍스트는 `content_block_delta`로만 옵니다.
4. **오답** - `max_tokens` 도달은 `message_delta`의 `stop_reason: "max_tokens"`로 알려집니다. 이 사례에서는 그 이벤트 자체가 기록되지 않았습니다.

> 💡 **시험 포인트:** 스트리밍의 성공 판정은 "200"이 아니라 "`message_stop`까지 받았고 `error` 이벤트가 없었는가"입니다.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 29
### **야간 컴플라이언스 리포트 작업이 큰 max_tokens 값으로 Python SDK를 쓰기 때문에 스트리밍을 해야 하지만, 마지막에 완성된 Message 객체만 있으면 됩니다. 코드를 완성하세요. `with client.messages.stream(...) as stream:` 다음에 `message = stream.____()`.**

| 보기 | 설명 |
|------|------|
| 1. `text_stream` | |
| **2. `get_final_message`** | |
| 3. `close` | |
| 4. `parse` | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** SDK의 `messages.stream()`은 HTTP 연결을 SSE로 유지하고, 누적 헬퍼 **`stream.get_final_message()`** 가 모든 이벤트를 모아 `client.messages.create()`가 돌려주는 것과 **같은 완전한 `Message` 객체** 를 만듭니다(TypeScript는 `finalMessage()`). SDK는 시간이 오래 걸릴 것으로 보이는 비스트리밍 요청(예: 매우 큰 `max_tokens`)을 거부하므로, 이벤트를 하나하나 다룰 필요가 없을 때 쓰는 표준 방법입니다.

```python
with client.messages.stream(
    model="claude-sonnet-5-5",
    max_tokens=64000,
    messages=[{"role": "user", "content": report_prompt}],
) as stream:
    message = stream.get_final_message()   # 완성된 Message
```

1. **오답** - `text_stream`은 텍스트 조각을 하나씩 내주는 반복자입니다. 호출하는 메서드가 아니며 `Message` 객체를 돌려주지 않습니다.
2. **정답** - 스트림을 끝까지 소비해 최종 `Message`(content, stop_reason, 최종 usage 포함)를 돌려줍니다.
3. **오답** - `close`는 스트림을 닫을 뿐 결과를 조립하지 않습니다.
4. **오답** - `parse`는 `with_raw_response`로 받은 원시 응답을 객체로 바꾸는 메서드입니다. 스트림 헬퍼가 아닙니다.

> 💡 **시험 포인트:** `create(stream=True)`는 원시 이벤트만 돌려주고 `Message`를 만들어 주지 않습니다. 조립된 결과가 필요하면 `messages.stream()` + `get_final_message()`입니다.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python) · [Claude API errors: long requests](https://platform.claude.com/docs/en/api/errors)

---

## 문제 30
### **원시 SSE 로그를 디버깅하던 엔지니어가 content_block_delta 이벤트 사이에 `event: ping`과 `data: {"type": "ping"}` 줄이 끼어 있는 것을 봅니다. 클라이언트는 이 이벤트를 어떻게 다뤄야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. 출력 토큰으로 센다. ping 하나가 생성되었지만 아직 전송되지 않은 토큰 하나를 뜻하기 때문이다 | |
| 2. 과부하 경고로 보고 다시 연결한다. 부하가 높을 때는 ping 이벤트가 오류 이벤트를 대신하기 때문이다 | |
| **3. 무시한다. ping 이벤트에는 내용이나 usage 데이터가 없고, 스트림 어디에든 몇 번이든 나타날 수 있다** | |
| 4. ping마다 pong 메시지로 답한다. 그렇지 않으면 서버가 짧은 시간 뒤 스트림을 닫는다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.2 Technical Fundamentals

> **핵심 진단:** 공식 스트리밍 문서는 이벤트 스트림에 **"몇 개든 `ping` 이벤트가 포함될 수 있다"** 고 설명하고, 전체 응답 예시에서도 ping이 스트림 곳곳에 흩어져 있을 수 있다고 적습니다. ping의 데이터는 `{"type": "ping"}`뿐이라 텍스트도 usage도 없습니다. 따라서 상태를 바꾸지 말고 건너뛰면 됩니다. 실제 문제는 `error` 이벤트로 따로 옵니다.

1. **오답** - ping에는 토큰이 없습니다. 출력 토큰 수는 `message_delta`의 누적 usage로 확인합니다.
2. **오답** - 과부하는 `overloaded_error`를 담은 `error` 이벤트로 알려집니다. ping은 오류 신호가 아닙니다.
3. **정답** - 내용 없는 이벤트이므로 무시하는 것이 맞습니다. 다른 모르는 이벤트처럼 파서를 멈추지 않게만 하면 됩니다.
4. **오답** - SSE는 서버에서 클라이언트로 가는 단방향 스트림입니다. 클라이언트가 응답할 통로도, 그런 요구도 없습니다.

> 💡 **시험 포인트:** `ping`은 "건너뛰기", `error`는 "처리하기", 모르는 유형은 "무시하되 멈추지 않기"입니다.

> 📎 참고: CertSafari는 ping을 '연결 유지(keep-alive)용'이라고 설명합니다. 공식 문서는 용도를 명시하지 않고 "몇 개든 올 수 있다"고만 적고 있어, 문항은 확인된 사실(내용 없음, 어디든 올 수 있음)만으로 구성했습니다.

> 📚 근거 문서: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)

---

## 문제 31
### **한 은행이 하루 약 200만 건의 짧은 카드 거래 설명을 실시간으로, 빠듯한 예산 안에서 12개 가맹점 범주로 분류해야 합니다. 각 라벨은 도구 호출로 원장에 기록됩니다. 가장 알맞은 시작 모델은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. Claude Fable 5.1. 이 규모에서 도구를 안정적으로 호출하는 것은 가장 강력한 모델뿐이기 때문이다 | |
| 2. Claude Opus 5.5. 도구 사용에는 에이전트 작업용으로 만든 모델이 필요하기 때문이다 | |
| 3. Claude Sonnet 5.5. Haiku 계열 모델은 도구 사용을 지원하지 않기 때문이다 | |
| **4. Claude Haiku 5.5. 지연과 가격이 가장 낮은 티어이며, 현재 모든 모델이 도구 사용을 지원한다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** 공식 모델 개요에 따르면 **현재 모든 모델이 텍스트·이미지 입력, 텍스트 출력, 다국어, 비전, 도구 사용을 지원** 합니다. 그래서 '도구 호출이 필요하다'는 조건은 모델을 가르는 기준이 되지 못합니다. 남는 기준은 품질·속도·가격이고, 이 작업은 단순하고 대량이며 실시간이고 예산이 빠듯합니다. 모델 선택 매트릭스는 **가장 낮은 지연과 가격** 이 필요할 때 Claude Haiku 5.5를 권하며, 실시간 애플리케이션과 대량 처리를 예로 듭니다. 효율 우선 접근도 Haiku 5.5에서 시작하라고 합니다.

| 모델 | 지연 | 가격(입력/출력, MTok당) |
|---|---|---|
| Claude Fable 5.1 | 느림 | $10 / $50 |
| Claude Opus 5.5 | 보통 | $4 / $20 |
| Claude Sonnet 5.5 | 빠름 | $2 / $10 |
| Claude Haiku 5.5 | 가장 빠름 | $0.10 / $0.50부터 |

1. **오답** - 가장 비싸고 느린 티어로, 장시간 에이전트나 깊은 추론용입니다. 단순 분류에 쓰면 비용과 지연이 요구사항을 크게 넘습니다.
2. **오답** - 도구 사용은 Opus 전용 기능이 아닙니다. 이 작업에는 과한 능력에 비용을 치르는 선택입니다.
3. **오답** - 전제가 틀렸습니다. Haiku 5.5를 포함한 현재 모든 모델이 도구 사용을 지원합니다.
4. **정답** - 도구 지원이 변별 요소가 아니라는 점을 짚고, 대량·실시간·저예산이라는 조건에 맞는 최저 지연·최저가 티어를 골랐습니다.

> 💡 **시험 포인트:** 모든 현재 모델이 도구 사용·비전을 지원하므로 그런 기능 요구는 모델 선택의 기준이 아닙니다. 대량·실시간·저예산·단순 작업이면 가장 작은 티어부터 시작합니다.

> 📎 참고: CertSafari는 가장 작은 티어로 Claude Haiku 4.5를 제시합니다. 현재 공식 라인업의 최소 티어는 Claude Haiku 5.5이고, Haiku 4.5는 레거시 모델로 분류되어 있어 문항은 Haiku 5.5로 썼습니다.

> 📚 근거 문서: [Models overview](https://platform.claude.com/docs/en/models/overview) · [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

---

## 문제 32
### **한 통신사가 웹사이트에 고객 지원 채팅 위젯을 붙이려고 합니다. 답은 약 1초 안에 시작되어야 하고, 트래픽이 많고, 예산이 빠듯하며, 질문은 대부분 단순한 계정 조회입니다. 가장 알맞은 구성은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. Claude Opus 5.5에 fast mode. fast mode는 주로 첫 토큰까지의 시간을 줄이기 때문이다 | |
| **2. low effort의 Claude Haiku 5.5. 가장 빠르고 싼 현재 티어를 가장 빠른 수준으로 쓴다** | |
| 3. low effort의 Claude Fable 5.1. 가장 강력한 모델이 가장 짧게 답하기 때문이다 | |
| 4. max effort의 Claude Sonnet 5.5. 더 깊은 추론으로 짧은 답을 보완한다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** 요구사항은 '빠른 응답 시작, 대량, 저예산, 단순 질문'입니다. 모델 선택 매트릭스에서 **가장 낮은 지연과 가격** 은 Claude Haiku 5.5이고, effort 문서는 Haiku 5.5에 대해 **채팅, 짧은 도구 작업, 단순한 대량 요청에는 가장 싸고 빠른 `low`** 를 쓰라고 권합니다. Haiku 5.5는 적응형 사고가 기본으로 켜져 있으므로, 낮은 effort가 사고를 줄여 응답 시작을 앞당깁니다.

1. **오답** - fast mode의 이득은 초당 출력 토큰(OTPS)에 집중되고 TTFT는 주된 개선 대상이 아닙니다. 게다가 Opus 가격에 프리미엄까지 붙어 저예산 조건과 맞지 않습니다.
2. **정답** - 가장 빠르고 싼 티어와 가장 빠른 effort 수준의 조합입니다. 평가로 품질을 확인한 뒤 필요하면 `medium`으로 올립니다.
3. **오답** - effort를 낮춰도 Fable 5.1은 가장 비싸고 느린 티어입니다. 단순 조회에 쓸 이유가 없습니다.
4. **오답** - `max`는 토큰 지출 제한이 없는 최고 수준입니다. 응답 시작이 늦어지고 비용이 커져 요구사항과 정반대입니다.

> 💡 **시험 포인트:** 실시간·대량·저예산·단순 질의 = 가장 작은 티어 + 낮은 effort. fast mode는 '긴 출력을 빨리 끝내는' 레버이지 저비용·저지연 시작용이 아닙니다.

> 📎 참고: CertSafari는 이 조건의 정답으로 Claude Haiku 4.5를 제시합니다. 현재 공식 라인업에서 같은 자리에 있는 모델은 Claude Haiku 5.5입니다.

> 📚 근거 문서: [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) · [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)

---

## 문제 33
### **한 스타트업이 비용에 민감한 FAQ 분류기의 프로토타입을 만들며, 모델 선택에 Anthropic의 효율 우선(efficiency-first) 접근을 따르려고 합니다. 올바른 순서는 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. Claude Haiku 5.5로 시작 → 사용 사례를 철저히 테스트 → 성능이 요구사항을 충족하는지 평가 → 특정 능력 격차가 있을 때만 업그레이드** | |
| 2. Claude Fable 5.1로 시작 → 품질 측정 → 매주 한 티어씩 다운그레이드 → 사용자 불만이 나오면 멈춤 | |
| 3. Claude Haiku 5.5로 시작 → 안전하게 바로 Claude Opus 5.5로 업그레이드 → 평가 작성 → 평가를 통과하면 다운그레이드 | |
| 4. Claude Opus 5.5용 프롬프트 작성 → 프로덕션 배포 → 실제 트래픽으로 테스트 → 비용이 너무 크면 Haiku로 전환 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** 공식 모델 선택 가이드는 시작 모델을 고르는 두 접근을 제시합니다. **효율 우선** 은 ① Claude Haiku 5.5로 구현을 시작하고 ② 사용 사례를 철저히 테스트하고 ③ 성능이 요구사항을 충족하는지 평가한 뒤 ④ **특정 능력 격차 때문에 필요할 때만** 업그레이드합니다. 프로토타이핑, 엄격한 지연 요구, 비용에 민감한 구현, 단순한 대량 작업에 맞습니다. 반대로 **성능 우선** 은 Opus 5.5로 시작해 프롬프트를 최적화하고, 평가한 뒤 effort를 낮추거나 모델을 내려 효율을 높입니다.

1. **정답** - 문서의 효율 우선 4단계와 순서까지 일치합니다. 업그레이드의 근거는 '측정된 능력 격차'입니다.
2. **오답** - 성능 우선 방식과도 다르고, 판단 기준이 평가가 아니라 사용자 불만입니다. 문서는 평가 세트를 가장 중요한 단계로 꼽습니다.
3. **오답** - 테스트도 하기 전에 업그레이드하면 효율 우선의 취지가 사라집니다. 평가는 업그레이드를 판단하기 전에 있어야 합니다.
4. **오답** - 평가 없이 프로덕션에 배포하고 실제 사용자로 테스트하는 순서는 어느 접근에도 없습니다.

> 💡 **시험 포인트:** 효율 우선 = "작게 시작 → 테스트 → 평가 → 격차가 있을 때만 업그레이드". 성능 우선 = "Opus 5.5로 시작 → 최적화 → 평가 → effort를 낮추거나 다운그레이드".

> 📎 참고: CertSafari는 시작 모델로 Claude Haiku 4.5를 제시하지만, 현재 공식 가이드의 효율 우선 단계는 Claude Haiku 5.5로 시작합니다. 또한 공식 문서는 "대부분의 워크로드는 Claude Opus 5.5에서 시작한다"고도 적고 있으므로, 효율 우선은 비용·지연 민감 작업에 쓰는 선택지라는 점을 함께 알아 두세요.

> 📚 근거 문서: [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

---

## 문제 34
### **사내 리서치 에이전트가 effort를 xhigh로 설정한 Claude Opus 5.5에서 돌아갑니다. 평가 결과 답변 품질은 목표를 넉넉히 넘지만 월 비용이 너무 큽니다. Anthropic의 안내가 가장 먼저 시도하라고 하는 변경은 무엇이라고 예측할까요?**

| 보기 | 설명 |
|------|------|
| 1. 에이전트를 Claude Haiku 5.5로 바꾼다. 티어 변경이 비용의 첫 번째 레버이기 때문이다 | |
| 2. fast mode를 켠다. 생성이 빨라지면 요청당 과금 토큰이 줄기 때문이다 | |
| **3. 같은 모델에서 effort 수준을 낮추고 평가를 다시 돌린다. effort 조정이 모델 교체보다 나은 레버인 경우가 많기 때문이다** | |
| 4. type이 disabled인 thinking 설정을 넣어 모든 요청에서 사고 토큰을 없앤다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** 공식 모델 선택 가이드는 effort가 **한 모델 안에서 지능과 지연·비용을 맞바꾸는 레버** 이며, **"effort 조정이 모델 교체보다 나은 레버인 경우가 많다"** 고 말합니다. 품질에 여유가 있으니 effort를 한두 단계 낮추고(예: xhigh → high 또는 Opus 5.5의 기본값인 medium) 평가로 품질 유지를 확인하는 것이 첫 단계입니다. effort는 사고뿐 아니라 텍스트와 도구 호출을 포함한 **모든 출력 토큰** 에 영향을 줍니다.

1. **오답** - 모델 교체는 품질 위험이 크고 프롬프트 재조정이 필요합니다. 같은 모델에서 effort를 먼저 조정해 보는 것이 문서의 순서입니다.
2. **오답** - fast mode는 같은 토큰을 더 빨리 낼 뿐이고 단가는 오히려 비쌉니다(Opus 5.5 기준 두 배). 비용 문제를 악화시킵니다.
3. **정답** - 품질 여유를 비용 절감으로 바꾸는 가장 직접적인 레버이며, 재평가로 안전하게 확인합니다.
4. **오답** - Claude Opus 5.5는 사고를 끌 수 없어 `disabled`에 400 오류를 냅니다. 사고 양은 effort로 조절합니다.

> 💡 **시험 포인트:** "품질은 충분, 비용이 문제" → 먼저 effort를 낮춘다. 모델 다운그레이드는 그다음이고, fast mode는 비용 절감 수단이 아닙니다.

> 📚 근거 문서: [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) · [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)

---

## 문제 35
### **한 팀이 Claude Opus 5.5 요청이 모델의 기본 effort일 때보다 토큰을 덜 쓰게 하려고 합니다. 요청 조각 `"output_config": {"effort": "____"}`을 완성하세요. 유효하면서 Opus 5.5의 기본값보다 낮은 값은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. "adaptive" | |
| **2. "low"** | |
| 3. "medium" | |
| 4. "minimal" | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** effort의 유효한 값은 **`low`·`medium`·`high`·`xhigh`·`max`** 다섯 가지입니다. 대부분의 모델은 기본값이 `high`지만 **Claude Opus 5.5와 Claude Haiku 5.5의 기본값은 `medium`** 입니다. 따라서 Opus 5.5에서 기본값보다 적게 쓰려면 `low`뿐입니다. Opus 5 이전 Opus 모델은 기본값이 `high`였으므로, effort를 생략한 요청이 Opus 5.5에서는 한 단계 낮게 실행된다는 점도 마이그레이션 때 주의할 부분입니다.

1. **오답** - `adaptive`는 사고 **모드** 값(`thinking: {"type": "adaptive"}`)이지 effort 값이 아닙니다. 공식 문서가 직접 "adaptive를 effort 값으로 넘기지 말라"고 경고합니다.
2. **정답** - 유효한 effort 값 가운데 Opus 5.5 기본값(`medium`)보다 낮은 유일한 값입니다.
3. **오답** - 유효한 값이지만 Opus 5.5의 기본값이라 생략한 것과 똑같이 동작합니다. 토큰이 줄지 않습니다.
4. **오답** - `minimal`은 effort 수준에 없습니다. 유효하지 않은 값입니다.

> 💡 **시험 포인트:** effort 기본값 예외 두 개(Opus 5.5·Haiku 5.5 = `medium`)를 기억하세요. effort를 기본값과 같은 값으로 명시하면 생략한 것과 동일하며 캐시도 깨지지 않습니다.

> 📚 근거 문서: [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Claude Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)

---

## 문제 36
### **한 회사가 여러 시간에 걸친 세션 동안 수백만 토큰 예산으로 대형 모노레포를 리팩터링하는 자율 에이전트를 만듭니다. Anthropic의 현재 안내를 따르는 구성은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. thinking type을 between_tools로 하고 effort를 xhigh로 둔 Claude Sonnet 5.5. 사고가 방해되지 않게 한다 | |
| 2. temperature를 0.2로 둔 max effort의 Claude Opus 5.5. 세션 간에 편집이 결정적으로 유지된다 | |
| 3. fast mode를 켠 Claude Haiku 5.5. 긴 세션이 낮은 가격으로 빨리 끝난다 | |
| **4. 평가 기반 effort 스윕으로 확인한 xhigh effort의 Claude Opus 5.5. max_tokens는 64k 이상, 샘플링 파라미터는 넣지 않는다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** 공식 모델 선택 매트릭스는 **여러 시간짜리 자율 코딩 에이전트와 대규모 리팩터링** 에 Claude Opus 5.5를 권합니다. effort 수준 표에서 `xhigh`는 "30분을 넘는 장기 에이전트·코딩 작업, 수백만 토큰 예산"용이고, Opus 5.5에는 이전 모델의 설정을 옮기지 말고 **자체 평가로 effort 스윕** 을 하라고 안내합니다. `xhigh`·`max`에서는 사고와 행동에 쓸 여유를 위해 **`max_tokens`를 64k부터** 잡으라는 지침도 있습니다. 또한 Opus 5.5를 비롯한 최신 모델은 `temperature`·`top_p`·`top_k`를 생략해야 합니다.

1. **오답** - Sonnet 5.5의 `between_tools`는 `high` 이하에서만 받으며, `xhigh`와 함께 보내면 400 오류가 납니다.
2. **오답** - Opus 5.5는 기본값이 아닌 temperature에 400 오류를 냅니다. 출력의 결정성은 샘플링 파라미터로 보장되지도 않습니다.
3. **오답** - fast mode는 Opus 5.5·Opus 5·Opus 4.8에서만 지원되므로 Haiku 5.5에 요청하면 오류가 납니다. 작업 난도에 비해 모델도 너무 작습니다.
4. **정답** - 권장 모델, 장기 작업용 effort 수준과 그 검증 방법, 충분한 `max_tokens`, 샘플링 파라미터 생략까지 모두 문서와 맞습니다.

> 💡 **시험 포인트:** 장기 자율 코딩 = 강한 모델 + `xhigh` + 큰 `max_tokens`. 여기에 temperature를 얹거나, 지원하지 않는 모델·effort 조합(between_tools + xhigh)을 고르는 보기가 함정입니다. 평가로도 부족하면 Claude Fable 5.1로 올리는 것이 다음 단계입니다.

> 📎 참고: CertSafari는 이 조건의 정답을 'Claude Opus 4.8 + xhigh'로 둡니다. Opus 4.8에서 코딩·에이전트 작업을 xhigh로 시작하라는 지침은 공식 문서에도 있지만, 현재 모델 선택 매트릭스는 이런 작업에 Claude Opus 5.5를 권하므로 문항은 Opus 5.5 기준으로 썼습니다.

> 📚 근거 문서: [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) · [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Claude Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)

---

## 문제 37
### **Claude API의 fast mode에 대한 설명으로 옳은 것은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 지원되는 Opus 모델에서 프리미엄 가격으로 초당 출력 토큰을 높인다. 첫 토큰까지의 시간을 주로 줄이는 것은 아니며, Claude Haiku 5.5에 요청하면 오류가 난다** | |
| 2. 같은 모델 ID 뒤에서 더 가벼운 모델로 바꿔 돌린다. 그래서 표준 속도보다 토큰당 가격이 싸다 | |
| 3. 현재 모든 모델에서 쓸 수 있고, Message Batches API와 함께 써서 추가로 절약할 수 있다 | |
| 4. 주로 첫 토큰까지의 시간을 줄이므로, 긴 스트리밍 출력보다 짧은 답에 더 잘 맞는다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** fast mode의 사실관계를 정리하면 다음과 같습니다.

| 항목 | 내용 |
|---|---|
| 무엇이 빨라지나 | 초당 출력 토큰(OTPS) 최대 약 2.5배. TTFT는 주된 개선 대상이 아님 |
| 모델 | 같은 모델, 더 빠른 추론 구성. 지능·능력 변화 없음 |
| 지원 모델 | Claude Opus 5.5(정식), Claude Opus 5·Opus 4.8(연구 프리뷰). 그 외 모델은 요청 시 오류 |
| 가격 | 프리미엄. Opus 5.5는 $8 / $40 (MTok당) |
| 함께 못 쓰는 것 | Batch API, Priority Tier |
| 확인 방법 | 응답의 `usage.speed` (`"fast"` 또는 `"standard"`) |

1. **정답** - 출력 속도 개선, 프리미엄 가격, TTFT는 주된 대상이 아님, 지원 모델 제한(Haiku 5.5 미지원)이 모두 맞습니다.
2. **오답** - 같은 모델을 쓰며 능력 변화가 없습니다. 가격은 더 비쌉니다.
3. **오답** - 지원 모델은 Opus 계열 일부뿐이고, Batch API와는 함께 쓸 수 없습니다.
4. **오답** - 반대입니다. 이득은 출력 속도에 있으므로 긴 스트리밍 출력에서 가장 잘 드러납니다.

> 💡 **시험 포인트:** fast mode 진술 문항은 "같은 모델 · OTPS↑(TTFT 아님) · 비쌈 · Opus 일부만 · 배치 불가" 다섯 가지로 판별합니다.

> 📚 근거 문서: [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

## 문제 38
### **Messages API에서 각 모델을 문서화된 사고 동작과 짝지으세요. (a) Claude Opus 5.5, (b) Claude Opus 4.8, (c) Claude Haiku 4.5, (d) Claude Sonnet 5.5. 올바른 짝은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. (a) 요청이 adaptive를 보낼 때까지 사고 꺼짐, (b) 적응형 항상 켜짐·disabled 거부, (c) 가장 낮은 설정이 between_tools, (d) budget_tokens를 쓰는 확장 사고만 지원 | |
| 2. (a) 적응형 항상 켜짐·disabled 거부, (b) budget_tokens를 쓰는 확장 사고만 지원, (c) 요청이 adaptive를 보낼 때까지 사고 꺼짐, (d) 가장 낮은 설정이 between_tools | |
| **3. (a) 적응형 항상 켜짐·budget_tokens와 disabled 거부, (b) 요청이 adaptive를 보낼 때까지 사고 꺼짐, (c) adaptive를 거부하고 budget_tokens를 쓰는 확장 사고만 지원, (d) 가장 낮은 설정이 between_tools** | |
| 4. (a) 적응형 항상 켜짐·budget_tokens와 disabled 거부, (b) 요청이 adaptive를 보낼 때까지 사고 꺼짐, (c) 가장 낮은 설정이 between_tools, (d) adaptive를 거부하고 확장 사고만 지원 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** 공식 사고 문서의 모델별 설정 표에서 네 모델만 뽑으면 다음과 같습니다(400 = 요청 거부).

| 모델 | `thinking` 없음 | `adaptive` | `enabled`+`budget_tokens` | `between_tools` | `disabled` |
|---|---|---|---|---|---|
| Claude Opus 5.5 | 적응형 | 적응형 | 400 | 400 | 400 |
| Claude Opus 4.8 | 사고 꺼짐 | 적응형 | 400 | 400 | 사고 꺼짐 |
| Claude Haiku 4.5 | 사고 꺼짐 | 400 | 확장 사고 | 400 | 사고 꺼짐 |
| Claude Sonnet 5.5 | 적응형 | 적응형 | 400 | high 이하에서 사전 사고 꺼짐 | 400 |

1. **오답** - 네 모델의 동작이 서로 뒤바뀌었습니다. 'adaptive를 보낼 때까지 꺼짐'은 Opus 4.8의 특징입니다.
2. **오답** - Opus 4.8은 확장 사고(`budget_tokens`)에 400을 내고 적응형을 씁니다. 'adaptive를 보낼 때까지 꺼짐'은 Haiku 4.5가 아니라 Opus 4.8입니다.
3. **정답** - 표의 동작과 모두 일치합니다.
4. **오답** - (c)와 (d)가 뒤바뀌었습니다. `between_tools`는 Sonnet 5.5 전용이고, adaptive를 거부하는 것은 Haiku 4.5입니다.

> 💡 **시험 포인트:** 세 갈래로 외우세요. ① Claude 5 이후: 필드가 없어도 적응형(Opus 5.5는 끌 수 없음, Sonnet 5.5는 `between_tools`). ② Opus 4.6~4.8·Sonnet 4.6: 꺼져 있다가 `adaptive`로 켬. ③ Claude 4.5 이전(Haiku 4.5 포함): `budget_tokens` 확장 사고만.

> 📚 근거 문서: [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 39
### **한 법률 리서치 앱이 Claude Opus 4.6에서 Claude Opus 5.5로 옮깁니다. 요청은 `thinking: {"type": "enabled", "budget_tokens": 12000}`을 보내는데, 이제 400 오류로 실패합니다. 올바른 해결책은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. budget_tokens를 Opus 5.5의 새 최대치인 4,096 아래로 낮춘다 | |
| 2. budget_tokens를 output_config로 옮겨 effort 설정 옆에 둔다 | |
| **3. thinking 블록을 적응형 사고로 바꾸거나 필드를 생략하고, 깊이는 output_config.effort로 조절한다** | |
| 4. interleaved-thinking 베타 헤더를 추가해 수동 예산을 다시 받게 한다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** 수동 사고 예산(`budget_tokens`)을 쓰는 확장 사고는 Opus 4.6·Sonnet 4.6에서 이미 deprecated였고, **Claude Opus 4.7 이후 모델에서는 제거되어 400 오류** 를 냅니다. 오류 메시지 자체가 "`thinking.type.adaptive`와 `output_config.effort`로 사고 동작을 조절하라"고 안내합니다. Opus 5.5 마이그레이션 가이드도 `{"type": "enabled", "budget_tokens": N}`을 `{"type": "adaptive"}`와 effort로 바꾸거나, 필드를 아예 빼라고 합니다(Opus 5.5는 적응형 사고가 항상 켜짐).

```python
# 이전 (Opus 4.6)
thinking={"type": "enabled", "budget_tokens": 12000}

# 이후 (Opus 5.5)
thinking={"type": "adaptive"},          # 생략해도 같다
output_config={"effort": "high"},       # 깊이는 effort로
max_tokens=32000,                       # 사고 + 답변을 담을 여유
```

1. **오답** - 예산 크기의 문제가 아닙니다. Opus 5.5는 `enabled` 유형 자체를 받지 않으며, '4,096 상한'이라는 규칙도 없습니다.
2. **오답** - `output_config`에는 `budget_tokens` 필드가 없습니다. 사고 깊이의 레버는 effort입니다.
3. **정답** - 문서와 오류 메시지가 안내하는 그대로의 수정입니다. `max_tokens`가 사고와 답변을 모두 담을 만큼 큰지도 함께 점검합니다.
4. **오답** - 적응형 사고에서는 인터리브드 사고가 자동이고, 그 베타 헤더는 오히려 제거 대상입니다. 수동 예산을 되살리는 헤더는 없습니다.

> 💡 **시험 포인트:** 최신 모델에서 `budget_tokens` 400 → "adaptive(또는 생략) + effort"로 교체. 비용 상한이 필요하면 `max_tokens`(엄격한 한도)를 씁니다.

> 📚 근거 문서: [Claude Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide) · [Claude API errors](https://platform.claude.com/docs/en/api/errors) · [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)

---

## 문제 40
### **Claude Sonnet 4.6을 쓰는 문서 QA 서비스가 적응형 사고를 쓰며 사용자에게는 최종 답만 보여 줍니다. 월 비용을 줄이려고 한 엔지니어가 thinking display를 "omitted"로 설정합니다. 무엇이 바뀔까요?**

| 보기 | 설명 |
|------|------|
| 1. 사고 토큰이 더 이상 생성되지 않으므로 출력 토큰 비용이 그만큼 줄어든다 | |
| **2. 스트리밍할 때 첫 텍스트 토큰이 더 빨리 오지만, 사고 토큰 전체는 여전히 출력으로 과금된다** | |
| 3. Sonnet 4.6에서 omitted는 disabled의 별칭이므로 사고가 완전히 꺼진다 | |
| 4. display 필드는 Claude 5 모델에서만 받으므로 요청이 400 오류로 실패한다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** `display`는 사고 내용을 **응답에 어떻게 돌려줄지** 만 정합니다. `"omitted"`면 사고 블록이 빈 `thinking` 필드와 `signature`만 담아 오고, 서버가 사고 토큰 스트리밍을 건너뛰므로 **스트리밍 시 첫 텍스트 토큰이 더 빨리** 옵니다. 하지만 공식 문서는 분명히 말합니다. **"사고 토큰 전체에 대해 여전히 과금된다. 생략은 비용이 아니라 지연을 줄인다."** 과금되는 출력 토큰은 summarized일 때와 같습니다. Sonnet 4.6의 기본값은 `"summarized"`이며 `display`는 adaptive·enabled 두 모드 모두에서 쓸 수 있습니다.

1. **오답** - 사고는 그대로 일어나고 과금됩니다. 응답에 보이지 않을 뿐입니다.
2. **정답** - 지연 개선(첫 텍스트 토큰)과 비용 불변이라는 두 효과를 정확히 짚었습니다. 비용을 줄이려면 effort를 낮춥니다.
3. **오답** - `omitted`와 `disabled`는 전혀 다른 설정입니다. 사고를 끄는 것은 `thinking.type`이고 `display`는 표시 방식입니다.
4. **오답** - `display`는 Sonnet 4.6에서도 쓸 수 있습니다. 모델마다 다른 것은 **기본값** 입니다(Sonnet 4.6은 summarized, Claude 5 계열은 omitted).

> 💡 **시험 포인트:** `display: "omitted"` = 지연↓, 비용 그대로. 비용 문제에 이 보기가 나오면 함정입니다.

> 📚 근거 문서: [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) · [Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)

---

## 문제 41
### **Claude Sonnet 5에서 Claude Sonnet 5.5로 옮기는 팀이 thinking type disabled와 xhigh로 설정한 output_config.effort를 함께 보냅니다. 이제 요청이 400 오류를 냅니다. Sonnet 5.5에서 사전 사고를 계속 끄려면 어떻게 바꿔야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. disabled는 두고 effort를 high로 낮춘다. Sonnet 5.5는 high 이하 effort에서 disabled를 받기 때문이다 | |
| 2. thinking 필드를 뺀다. Sonnet 5.5에서는 필드를 생략하면 사고가 꺼지기 때문이다 | |
| 3. between_tools를 보내고 effort는 xhigh로 유지한다. between_tools에는 effort 제한이 없기 때문이다 | |
| **4. thinking type을 between_tools로 보내고 effort를 high 이하로 낮춘다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** Claude Sonnet 5는 `disabled`를 effort 제한 없이 받았지만, **Claude Sonnet 5.5는 `disabled`를 400으로 거부** 합니다. Sonnet 5.5에서 사전(up-front) 사고를 끄는 가장 낮은 설정은 **`thinking: {"type": "between_tools"}`** 이고, 이 설정은 **effort `high` 이하에서만** 받습니다. `xhigh`·`max`와 함께 보내면 400입니다. `between_tools`는 다른 필드(`display`, `budget_tokens` 등)도 받지 않으며, 도구 호출 사이의 진행 상황 업데이트는 계속 돌아옵니다. 도구가 없으면 응답은 텍스트만 담습니다.

1. **오답** - effort와 무관하게 Sonnet 5.5는 `disabled`를 받지 않습니다. 오류 메시지도 `between_tools`를 쓰라고 안내합니다. 'high 이하에서 disabled 허용'은 Haiku 5.5·Opus 5의 규칙입니다.
2. **오답** - Sonnet 5.5는 thinking 필드가 없으면 적응형 사고로 실행됩니다. 필드를 빼면 오히려 사고가 켜집니다.
3. **오답** - `between_tools`는 `xhigh`·`max`에서 400 오류를 냅니다.
4. **정답** - 올바른 설정값과 effort 조건을 모두 맞혔습니다.

> 💡 **시험 포인트:** Sonnet 5.5의 사고 끄기 = `between_tools` + effort ≤ `high`. 같은 '끄기'라도 모델마다 값과 조건이 다르다는 점이 마이그레이션 함정입니다.

> 📚 근거 문서: [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) · [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Claude API errors](https://platform.claude.com/docs/en/api/errors)

---

## 문제 42
### **thinking 필드가 없는 요약 요청이 Claude Sonnet 4.6에서는 사고 없이 실행됩니다. 팀이 모델 ID만 Claude Sonnet 5.5로 바꿉니다. 같은 요청이 어떻게 동작할지 예측하세요.**

| 보기 | 설명 |
|------|------|
| **1. 적응형 사고로 실행된다. 그래서 응답이 thinking 블록으로 시작할 수 있고, 사고 토큰이 max_tokens에 포함된다** | |
| 2. 여전히 사고 없이 실행된다. 요청이 명시적으로 요구하지 않으면 사고는 꺼진 채로 있기 때문이다 | |
| 3. 요청에 thinking 필드를 명시적으로 넣을 때까지 400 오류로 실패한다 | |
| 4. 기본 budget_tokens 1,024로 확장 사고가 실행된다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** Sonnet 5.5 마이그레이션 가이드는 "Claude Sonnet 5.5에서 **`thinking` 필드가 없는 요청은 적응형 사고로 실행** 된다. Claude Sonnet 4.6 이전 모델에서는 같은 요청이 사고 없이 실행되었다"고 설명합니다. 오류 없이 동작이 바뀌는 **조용한 변경** 이라 더 위험합니다. 응답이 `thinking` 블록으로 시작할 수 있으므로 콘텐츠를 `type`으로 골라 읽어야 하고, `max_tokens`는 사고와 답변을 합친 상한이므로 다시 잡아야 하며, 사고 토큰만큼 출력 비용도 늘 수 있습니다.

1. **정답** - 기본 동작 변화와 그 결과(응답 구조, `max_tokens`)를 정확히 예측했습니다.
2. **오답** - 'adaptive를 보내야 켜진다'는 Sonnet 4.6·Opus 4.8까지의 동작입니다. Sonnet 5.5는 기본이 적응형입니다.
3. **오답** - 필드가 없는 요청은 정상 처리됩니다. 400이 나는 것은 `disabled`나 `budget_tokens` 같은 거부되는 값을 보낼 때입니다.
4. **오답** - Sonnet 5.5는 `budget_tokens` 확장 사고를 400으로 거부하며, 기본 예산이라는 개념도 없습니다.

> 💡 **시험 포인트:** 모델 ID만 바꿨는데 응답 구조·지연·비용이 달라졌다면 '기본 사고 동작 변화'를 의심하세요. 사전 사고를 끄려면 Sonnet 5.5는 `between_tools`입니다.

> 📚 근거 문서: [Claude Sonnet 5.5 migration guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide) · [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)

---

## 문제 43
### **챗봇을 Claude Opus 4.8에서 Claude Opus 5.5로 바꾼 뒤, 모든 요청이 stop_reason end_turn과 함께 200을 반환하지만 사용자에게는 빈 답이 보입니다. 요청에는 thinking 필드가 없고, Node.js 핸들러는 `response.content[0].text`를 표시합니다. 원인과 해결책은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. Opus 5.5는 텍스트를 마지막 message_delta 이벤트로만 돌려주므로 핸들러를 스트리밍으로 바꿔야 한다 | |
| **2. 첫 콘텐츠 블록이 이제 thinking 블록이며 기본 omitted 표시에서는 비어 있다. 블록을 type으로 골라 "text" 블록에서 텍스트를 읽는다** | |
| 3. Opus 5.5는 display를 "summarized"로 설정하지 않으면 텍스트를 돌려주지 않으므로 그 설정을 추가해야 한다 | |
| 4. 답이 max_tokens 때문에 잘렸으므로 max_tokens를 두 배로 늘리면 텍스트가 돌아온다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.3 Model Selection and Tradeoffs

> **핵심 진단:** Opus 4.8에서는 thinking 필드가 없으면 사고 없이 실행되어 `content[0]`이 곧 텍스트 블록이었습니다. **Opus 5.5는 모든 요청에서 적응형 사고가 실행** 되므로 응답이 하나 이상의 `thinking` 블록으로 시작할 수 있고, `display` 기본값이 `"omitted"`라 그 블록의 `thinking` 필드는 빈 문자열입니다. `thinking` 블록에는 `text` 속성이 없어 JavaScript에서 `content[0].text`는 `undefined`가 되고 화면에는 빈 답이 보입니다. 마이그레이션 가이드는 바로 이 경우를 들어 **위치가 아니라 `type` 필드로 블록을 고르라** 고 안내합니다.

```javascript
const text = response.content
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("");
```

1. **오답** - 비스트리밍 응답에도 텍스트 블록은 `content`에 들어 있습니다. 문제는 전송 방식이 아니라 읽는 위치입니다.
2. **정답** - 원인(첫 블록이 사고 블록)과 해결책(type으로 선택)을 정확히 짚었습니다. 스트림 핸들러도 첫 `content_block_start`를 텍스트로 가정하면 같은 문제가 생깁니다.
3. **오답** - `summarized`로 바꾸면 사고 요약이 보일 뿐, `content[0]`은 여전히 사고 블록입니다. 텍스트 블록은 설정과 무관하게 이미 응답에 있습니다.
4. **오답** - `stop_reason`이 `end_turn`이므로 잘림이 아닙니다. 잘렸다면 `max_tokens`로 표시됩니다.

> 💡 **시험 포인트:** "200인데 빈 답" + "모델 변경" + "`content[0]`" = 사고 블록이 앞에 온 것입니다. 콘텐츠는 항상 `type`으로 고르세요.

> 📚 근거 문서: [Claude Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide) · [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)

---

## 문제 44
### **입력 100만 토큰당 $2, 출력 100만 토큰당 $10인 Claude Sonnet 5.5에 보낸 요청이 캐싱이나 배치 할인 없이 입력 30,000토큰, 출력 6,000토큰을 썼습니다. 비용에 대한 올바른 설명은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 입력과 출력이 각각 $0.06이다. 출력 단가가 입력의 5배이고 토큰 수는 5분의 1이기 때문이다** | |
| 2. 입력은 $0.06, 출력은 $0.012이다. 출력 토큰도 입력과 같은 단가로 과금되기 때문이다 | |
| 3. 입력과 출력이 각각 $0.60이다. Claude 가격은 100만이 아니라 10만 토큰 기준이기 때문이다 | |
| 4. 입력은 $0.06, 출력은 $0.30이다. 출력은 입력의 25배 단가로 과금되기 때문이다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 가격은 **MTok(100만 토큰)당** 이고 입력과 출력의 단가가 다릅니다. 현재 모델은 모두 출력 단가가 입력의 5배입니다.

```text
입력: 30,000 ÷ 1,000,000 × $2  = $0.06
출력:  6,000 ÷ 1,000,000 × $10 = $0.06
합계: $0.12
```

출력 토큰이 입력의 5분의 1인데 단가가 5배라 두 쪽 비용이 같아졌습니다. 출력이 조금만 늘어도 비용이 빠르게 커지므로, 사고 토큰(출력으로 과금)과 긴 답변이 비용의 큰 몫을 차지하기 쉽다는 점을 기억해 두세요.

1. **정답** - MTok 기준 단가로 정확히 계산했고, 같은 금액이 나오는 이유도 맞습니다.
2. **오답** - 출력은 입력보다 비쌉니다. 출력에 입력 단가를 쓰면 출력 비용을 5분의 1로 과소 계산합니다.
3. **오답** - 가격 단위는 100만 토큰(MTok)입니다. 10만 토큰 기준으로 계산하면 10배로 부풀려집니다.
4. **오답** - Sonnet 5.5의 출력 단가는 $10/MTok로 입력의 5배입니다. 25배로 계산하면 출력 비용이 5배 과대 계산됩니다.

> 💡 **시험 포인트:** "입력 단가 × 5 = 출력 단가"(현재 라인업 공통). 비용 계산 문항은 MTok 단위와 입출력 단가 차이를 함께 확인하세요.

> 📚 근거 문서: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Models overview](https://platform.claude.com/docs/en/models/overview)

---

## 문제 45
### **야간 분석 작업이 Claude Opus 5.5에서 Message Batches API로, 미국 내 추론(inference_geo를 "us"로 설정)을 사용해 실행되고, 요청들이 캐시된 접두사를 읽습니다. 캐시 읽기 토큰이 어떻게 가격 매겨질지 예측하세요.**

| 보기 | 설명 |
|------|------|
| 1. 배치 안에서는 캐시 읽기가 무료이므로 캐시되지 않은 입력과 출력 토큰만 과금된다 | |
| 2. 배치 할인이 캐시 읽기 단가를 대체하므로 캐시 읽기는 기본 입력 가격의 50%로 과금된다 | |
| **3. 캐시 읽기 배수, 50% 배치 할인, 1.1배 데이터 레지던시 배수가 모두 기본 입력 가격 위에 겹쳐 적용된다** | |
| 4. 데이터 레지던시는 배치와 함께 쓸 수 없으므로 작업이 400 오류로 거부된다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 가격 문서는 프롬프트 캐싱 배수에 대해 **"이 배수들은 Batch API 할인과 데이터 레지던시를 포함한 다른 가격 수정자와 겹쳐 적용된다"** 고 명시합니다. 데이터 레지던시는 Claude 4.6 이후 모델에서 `inference_geo: "us"`일 때 입력·출력·캐시 쓰기·캐시 읽기 **모든 범주에 1.1배** 입니다. Opus 5.5의 캐시 읽기는 기본 입력가의 0.05배입니다. 차례로 적용해 보면 다음과 같습니다.

```text
기본 입력          $4.00 / MTok
캐시 읽기 ×0.05  → $0.20
배치 50% 할인    → $0.10
US 추론 ×1.1     → $0.11 / MTok
```

1. **오답** - 캐시 읽기는 어디서든 할인된 단가로 과금되며 무료가 아닙니다.
2. **오답** - 할인끼리 서로를 대체하지 않고 겹쳐 적용됩니다.
3. **정답** - 세 수정자가 함께 적용된다는 문서 내용과 일치합니다. 다만 배치 요청은 동시에·순서 없이 처리되므로 배치 안의 캐시 적중은 최선 노력(best-effort) 수준입니다.
4. **오답** - 데이터 레지던시와 배치를 함께 못 쓴다는 규칙은 없습니다. 배치와 함께 못 쓰는 것은 fast mode입니다.

> 💡 **시험 포인트:** 배치 할인·캐시 배수·데이터 레지던시는 겹쳐 적용됩니다. 예외(결합 불가)는 'fast mode + Batch API'입니다.

> 📚 근거 문서: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

---

## 문제 46
### **Claude API에서 함께 쓸 수 없는 가격 기능 조합은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 프롬프트 캐싱과 Message Batches API | |
| 2. fast mode와 프롬프트 캐싱 | |
| 3. fast mode와 미국 내 데이터 레지던시 | |
| **4. fast mode와 Message Batches API** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 가격 문서와 fast mode 문서 모두 **"fast mode는 Batch API와 함께 쓸 수 없다"** 고 명시합니다(Priority Tier와도 함께 쓸 수 없습니다). 나머지는 모두 결합됩니다.

| 조합 | 가능? | 근거 |
|---|---|---|
| 캐싱 + 배치 | 가능 | 캐시 배수가 배치 할인과 겹쳐 적용 (배치 내 적중은 최선 노력) |
| fast mode + 캐싱 | 가능 | 캐시 배수가 fast mode 가격 위에 적용 |
| fast mode + 데이터 레지던시 | 가능 | 레지던시 배수가 fast mode 가격 위에 적용 |
| fast mode + 배치 | **불가** | fast mode는 Batch API에서 제공되지 않음 |

1. **오답** - 캐싱은 배치와 함께 쓸 수 있고 할인도 겹칩니다.
2. **오답** - 캐싱 배수는 fast mode 가격 위에 그대로 적용됩니다. 다만 표준 속도와 fast 요청은 캐시 접두사를 공유하지 않습니다.
3. **오답** - 데이터 레지던시 배수도 fast mode 가격 위에 적용됩니다.
4. **정답** - 문서가 명시한 유일한 결합 불가 조합입니다. 둘의 목적(즉시 빠른 출력과 비동기 저가 처리)이 정반대라는 점으로도 이해할 수 있습니다.

> 💡 **시험 포인트:** "fast mode + Batch = 불가". 나머지 수정자(캐싱, 배치, 레지던시, fast mode)는 서로 겹쳐 적용된다고 기억하세요.

> 📚 근거 문서: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)

---

## 문제 47
### **모델 라우터가 모델을 고르기 전에 모든 프롬프트의 크기를 잽니다. `client.messages.count_tokens(...)`에 대한 올바른 설명은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 일반 텍스트 문자열만 받고, 입력과 출력 토큰의 추정치를 함께 돌려준다 | |
| **2. system, messages, tools, 이미지, PDF 등 메시지 생성과 같은 구조의 입력을 받고, 응답을 생성하지 않은 채 입력 토큰 수를 돌려준다** | |
| 3. 내부적으로 짧은 생성을 실행하고, 그 테스트 응답의 usage 블록을 돌려준다 | |
| 4. 프롬프트 캐싱 할인을 포함해 요청의 정확한 청구 금액을 USD로 돌려준다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 토큰 카운팅 엔드포인트는 **메시지 생성과 같은 구조의 입력 목록**(시스템 프롬프트, 도구, 이미지, PDF 포함)을 받고, 응답에는 **총 입력 토큰 수(`input_tokens`)** 만 담깁니다. 추론을 실행하지 않으므로 출력 토큰은 알 수 없습니다. 몇 가지 특성도 함께 기억해 두세요. 결과는 **추정치** 이고, 사용은 **무료** 이며 메시지 생성과 별개의 속도 제한을 쓰고, **캐싱 로직을 적용하지 않으며**, 넘긴 `model`의 토크나이저로 셉니다.

```python
count = client.messages.count_tokens(
    model="claude-sonnet-5-5",
    system=SYSTEM,
    tools=TOOLS,
    messages=[{"role": "user", "content": question}],
)
print(count.input_tokens)        # 입력 토큰 수만 돌려준다
```

1. **오답** - 텍스트만이 아니라 생성 요청과 같은 구조 전체를 받습니다. 출력은 생성하지 않으므로 출력 토큰 추정도 없습니다.
2. **정답** - 입력의 형태와 반환값을 모두 정확히 설명합니다.
3. **오답** - 생성은 전혀 실행하지 않습니다. 그래서 무료이고 빠릅니다.
4. **오답** - 금액이 아니라 토큰 수를 돌려주며, 캐싱도 반영하지 않습니다. 비용은 토큰 수에 단가를 곱해 따로 계산합니다.

> 💡 **시험 포인트:** `count_tokens` = "생성과 같은 입력 → 입력 토큰 수만". 모델을 바꿀 때는 새 모델 ID로 다시 세야 합니다(Claude 4.7 이후 토크나이저는 약 30% 더 많은 토큰).

> 📚 근거 문서: [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting) · [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python)

---

## 문제 48
### **Claude Sonnet 5.5를 쓰는 세금 신고 어시스턴트가 55,000토큰짜리 규정 묶음을 캐시합니다. 사용자는 대략 12~20분 간격으로 몰려오고, usage 필드를 보면 거의 매번 몰려올 때마다 처음에 캐시 쓰기가 새로 발생합니다. 팀은 무엇을 바꿔야 할까요?**

| 보기 | 설명 |
|------|------|
| **1. 브레이크포인트에 ttl을 "1h"로 설정해 몰림 사이의 공백에도 항목이 살아 있게 한다. 쓰기 가격 2배는 감수한다** | |
| 2. 같은 위치에 브레이크포인트를 하나 더 추가한다. 그러면 기본 수명이 10분으로 두 배가 된다 | |
| 3. 묶음을 프롬프트 끝으로 옮긴다. 끝에 가까운 블록이 더 오래 캐시되기 때문이다 | |
| 4. effort 수준을 낮춘다. effort가 높으면 캐시 수명이 짧아지기 때문이다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 기본 캐시 수명은 **5분** 이고 적중할 때마다 무료로 갱신됩니다. 요청 간격이 5분을 넘으면 매번 만료되어 다시 1.25배로 쓰게 됩니다. `cache_control`에 **`"ttl": "1h"`** 를 주면 1시간 동안 유지되며, 쓰기는 기본 입력가의 2배지만 읽기는 그대로 저렴합니다. 문서는 5분 캐시는 읽기 1번, 1시간 캐시는 읽기 2번이면 본전이라고 설명합니다. 한 시간에 몇 번씩 몰려오는 이 트래픽에서는 매번 1.25배로 다시 쓰는 것보다 한 번 2배로 써 두고 읽는 편이 쌉니다.

```json
"cache_control": { "type": "ephemeral", "ttl": "1h" }
```

1. **정답** - 요청 간격이 기본 수명보다 길다는 원인을 정확히 해결합니다.
2. **오답** - 브레이크포인트를 늘려도 수명은 바뀌지 않습니다. TTL 옵션은 5분과 1시간 두 가지입니다.
3. **오답** - 블록 위치는 수명과 무관합니다. 오히려 고정된 큰 묶음은 접두사 앞쪽에 두어야 다른 요청과 공유됩니다.
4. **오답** - effort를 바꾸면 캐시가 **무효화** 될 수는 있지만 수명이 달라지지는 않습니다.

> 💡 **시험 포인트:** "요청 간격 > 5분 → 매번 캐시 쓰기"가 보이면 1시간 TTL입니다. 반대로 몇 초 간격으로 이어지는 대화라면 5분 TTL이 더 쌉니다.

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

## 문제 49
### **한 팀이 30,000토큰짜리 접두사가 이미 캐시되어 있고 cache_control로 표시된 프롬프트에, 200토큰 질문을 덧붙여 count_tokens 요청을 보냅니다. 응답은 무엇을 보고할까요?**

| 보기 | 설명 |
|------|------|
| 1. 약 200 입력 토큰. 캐시된 토큰은 세지 않기 때문이다 | |
| 2. 약 30,000 입력 토큰. 캐시된 접두사만 세기 때문이다 | |
| **3. 약 30,200 입력 토큰. 토큰 카운팅은 캐싱 로직을 적용하지 않기 때문이다** | |
| 4. 오류. count_tokens 요청에는 cache_control 블록을 넣을 수 없기 때문이다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 토큰 카운팅 FAQ는 "토큰 카운팅은 **캐싱 로직을 쓰지 않고** 추정치를 준다. 요청에 `cache_control` 블록을 넣을 수는 있지만 프롬프트 캐싱은 실제 메시지 생성에서만 일어난다"고 답합니다. 따라서 응답은 캐시 여부와 상관없이 **전체 입력 크기** 를 보고합니다. 실제 생성 요청이었다면 usage가 `cache_read_input_tokens` 약 30,000과 `input_tokens` 약 200으로 나뉘어 보였을 것입니다.

1. **오답** - 이는 실제 생성 요청의 `input_tokens` 필드(마지막 브레이크포인트 이후 부분)와 혼동한 것입니다. 카운팅은 캐시를 구분하지 않습니다.
2. **오답** - 질문 토큰도 입력이므로 함께 셉니다.
3. **정답** - 캐싱과 무관하게 전체 입력을 셉니다. 컨텍스트 윈도 적합성을 판단할 때도 이 전체 값이 기준입니다.
4. **오답** - `cache_control` 블록은 카운팅 요청에 넣을 수 있습니다. 다만 캐싱 효과가 반영되지 않을 뿐입니다.

> 💡 **시험 포인트:** `count_tokens`는 "캐시를 모르는 전체 입력 크기", 생성 응답의 usage는 "캐시 읽기·쓰기·나머지로 나뉜 값"입니다.

> 📚 근거 문서: [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting) · [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

---

## 문제 50
### **각 usage 필드를 그 의미와 짝지으세요. (a) cache_read_input_tokens, (b) cache_creation_input_tokens, (c) input_tokens. 올바른 짝은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. (a) 이번 요청에서 캐시에 쓴 토큰, (b) 기존 항목에서 제공된 접두사 토큰, (c) 캐시 여부와 상관없는 요청 전체 입력 | |
| 2. (a) 기존 항목에서 제공된 접두사 토큰, (b) 캐시에 쓴 토큰, (c) 요청 전체 입력이므로 다른 두 값이 이미 포함됨 | |
| 3. (a) 기존 항목에서 제공된 접두사 토큰, (b) 캐시에 적중하지 못해 기본 단가로 과금된 토큰, (c) 첫 브레이크포인트 앞의 캐시되지 않은 토큰 | |
| **4. (a) 기존 항목에서 제공된 접두사 토큰, (b) 이번 요청에서 캐시에 쓴 토큰, (c) 마지막 브레이크포인트 뒤의 캐시되지 않은 토큰. 따라서 전체 입력은 세 값의 합** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 프롬프트 캐싱 문서의 정의는 다음과 같습니다.

```text
cache_read_input_tokens     캐시에서 읽은 토큰 (브레이크포인트 앞, 이미 캐시됨)
cache_creation_input_tokens 이번에 캐시에 새로 쓴 토큰 (브레이크포인트에서)
input_tokens                마지막 브레이크포인트 뒤의, 캐시되지 않는 토큰

total_input_tokens = cache_read_input_tokens
                   + cache_creation_input_tokens
                   + input_tokens
```

문서는 특히 "`input_tokens`는 전체 입력이 아니라 마지막 브레이크포인트 이후 부분만 나타낸다"고 강조합니다. 200k 문서를 캐시하고 50토큰 질문을 보내면 `input_tokens`는 50이지만 전체 입력은 200,050입니다.

1. **오답** - 읽기와 쓰기가 뒤바뀌었고, `input_tokens`를 전체 입력으로 오해했습니다.
2. **오답** - `input_tokens`는 다른 두 값을 포함하지 않습니다. 세 값은 서로 겹치지 않는 부분입니다.
3. **오답** - 캐시 쓰기 토큰은 기본 단가가 아니라 1.25배(5분) 또는 2배(1시간)로 과금됩니다. `input_tokens`는 첫 브레이크포인트 앞이 아니라 마지막 브레이크포인트 뒤입니다.
4. **정답** - 세 필드의 정의와 합계 공식이 모두 문서와 같습니다.

> 💡 **시험 포인트:** "`input_tokens` = 요청 전체 입력"은 대표적인 함정입니다. 전체 입력 = 읽기 + 쓰기 + `input_tokens`. 속도 제한(ITPM)에는 대부분의 모델에서 캐시 읽기가 포함되지 않습니다.

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Rate limits](https://platform.claude.com/docs/en/api/rate-limits)

---

## 문제 51
### **한 에이전트의 프롬프트에 캐시 브레이크포인트 4개가 도구 정의, 시스템 지시, 참고 문서, 지금까지의 대화 뒤에 각각 놓여 있습니다. 다음 요청에서 캐시된 모든 계층을 다시 쓰게 만드는 단일 변경은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. tool_choice를 auto에서 none으로 바꾼다 | |
| **2. 도구 하나의 설명을 수정한다** | |
| 3. 대화에 새 사용자 턴을 덧붙인다 | |
| 4. 최근 사용자 메시지에 이미지를 추가한다 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 캐시 접두사는 **`tools` → `system` → `messages`** 순서로 이어지고, 어느 단계가 바뀌면 **그 단계와 그 뒤의 모든 단계** 가 무효화됩니다. 도구 정의는 접두사의 맨 앞이므로, 이름·설명·파라미터 중 하나만 바꿔도 **캐시 전체** 가 무효화됩니다. 문서의 무효화 표를 요약하면 다음과 같습니다.

| 바뀌는 것 | 도구 캐시 | 시스템 캐시 | 메시지 캐시 |
|---|---|---|---|
| 도구 정의(이름·설명·파라미터) | 무효 | 무효 | 무효 |
| 웹 검색·인용 토글, speed 설정 | 유지 | 무효 | 무효 |
| `tool_choice`, 이미지 추가·제거 | 유지 | 유지 | 무효 |
| 새 턴 덧붙이기 | 유지 | 유지 | 기존 접두사 유지 |

1. **오답** - `tool_choice` 변경은 메시지 블록 캐시에만 영향을 줍니다.
2. **정답** - 접두사의 가장 앞부분이 바뀌므로 뒤의 시스템·문서·대화 캐시까지 모두 다시 써야 합니다.
3. **오답** - 뒤에 덧붙이는 것은 기존 접두사를 바꾸지 않으므로 이전 캐시를 그대로 읽습니다. 캐시가 잘 작동하는 정상 패턴입니다.
4. **오답** - 이미지 추가·제거는 메시지 캐시를 무효화하지만 도구·시스템 캐시는 유지됩니다.

> 💡 **시험 포인트:** 자주 바뀌는 것은 뒤로, 거의 안 바뀌는 것은 앞으로. 도구 정의를 요청마다 조금씩 바꾸는 코드는 캐시를 통째로 버리는 셈입니다.

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

---

## 문제 52
### **한 FinOps 분석가가 캐시를 쓰는 Claude 워크로드의 비용 모델을 만듭니다. 첫 버전은 usage.input_tokens에 기본 입력 가격을, output_tokens에 출력 가격을 곱하는데, 합계가 청구서보다 훨씬 작게 나옵니다. 비용 모델은 대신 무엇을 해야 할까요?**

| 보기 | 설명 |
|------|------|
| 1. input_tokens에 캐시 읽기 가격을 곱한다. 캐싱을 켜면 모든 입력이 캐시에서 제공되기 때문이다 | |
| 2. output_tokens를 두 번 더한다. 사고 토큰은 output_tokens와 별도로 추가 과금되기 때문이다 | |
| 3. 캐시 읽기는 무료로 보고, 캐시 쓰기만 기본 입력 가격으로 더한다 | |
| **4. 네 필드(캐시되지 않은 입력, 캐시 쓰기, 캐시 읽기, 출력)를 읽고 각각을 자기 단가로 계산한다** | |

**정답: 4.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 캐싱을 쓰면 `input_tokens`는 마지막 브레이크포인트 뒤의 일부일 뿐이라, 캐시 읽기·쓰기 토큰을 빼먹으면 비용이 크게 과소 계산됩니다. 각 범주의 단가가 다르므로 네 필드를 따로 곱해야 합니다. Claude Sonnet 5.5 기준(MTok당) 예시는 다음과 같습니다.

```text
cost = input_tokens                × $2.00   (기본 입력)
     + cache_creation_input_tokens × $2.50   (5분 쓰기 1.25배; 1시간이면 $4.00)
     + cache_read_input_tokens     × $0.10   (읽기 0.05배)
     + output_tokens               × $10.00  (사고 토큰 포함)
```

`usage.cache_creation` 객체를 보면 쓰기 토큰이 5분·1시간 TTL별로 나뉘어 있어 쓰기 단가를 정확히 적용할 수 있습니다. 배치·데이터 레지던시를 쓰면 그 배수도 곱합니다.

1. **오답** - `input_tokens`는 캐시되지 않은 부분이므로 기본 단가가 맞습니다. 캐시 읽기는 별도 필드에 있습니다.
2. **오답** - 사고 토큰은 이미 `output_tokens`에 포함되어 있습니다(`output_tokens_details.thinking_tokens`는 내역일 뿐). 두 번 더하면 과대 계산됩니다.
3. **오답** - 캐시 읽기는 할인될 뿐 무료가 아니고, 캐시 쓰기는 기본가보다 비쌉니다(1.25배 또는 2배).
4. **정답** - 네 범주를 각자의 단가로 계산하는 것이 청구와 맞는 비용 모델입니다.

> 💡 **시험 포인트:** 캐시 워크로드의 비용 = 네 필드 × 네 단가. "캐시 읽기는 무료", "`input_tokens`가 전체 입력"은 모두 함정입니다.

> 📎 참고: CertSafari 레슨의 캐시 가격표는 Claude Sonnet 5.5의 캐시 읽기를 기본 입력가의 0.1배($0.20/MTok)로 적지만, 현재 공식 가격표는 0.05배($0.10/MTok)입니다. 문항의 수치는 공식 가격표를 따랐습니다.

> 📚 근거 문서: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)

---

## 문제 53
### **Claude Sonnet 5.5에서 한 요청이 380토큰짜리 시스템 프롬프트에 cache_control을 표시합니다. 응답은 성공했고, cache_creation_input_tokens와 cache_read_input_tokens가 모두 0입니다. 이를 설명하는 것은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| **1. 접두사가 Sonnet 5.5의 최소 캐시 가능 길이인 512토큰보다 짧아 캐싱 없이 처리되었고, 오류는 나지 않았다** | |
| 2. 캐시 쓰기가 미뤄져 다음 요청의 usage 필드에 대신 나타난다 | |
| 3. Sonnet 5.5는 메시지 블록에서만 프롬프트 캐싱을 지원하고 시스템 프롬프트에서는 지원하지 않는다 | |
| 4. 요청이 조용히 거부되었고, 응답은 대체 모델이 만들었다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 캐시할 수 있는 접두사에는 **모델별 최소 길이** 가 있습니다. 이보다 짧으면 `cache_control`을 붙여도 **오류 없이 캐싱 없이 처리** 됩니다. 문서는 캐시 쓰기와 읽기가 모두 0이면 대부분 최소 길이 미달이라고 설명합니다.

| 최소 토큰 | 모델 |
|---|---|
| 512 | Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5, Opus 5, Fable 5 등 |
| 1,024 | Opus 4.8, Sonnet 5, Sonnet 4.6 등 |
| 2,048 | Opus 4.7 등 |
| 4,096 | Opus 4.6, Opus 4.5, Haiku 4.5 |

380토큰 접두사를 캐시하려면 512토큰 이상이 되도록 고정 내용(예: 도구 정의, 추가 지침)과 함께 묶어 브레이크포인트를 그 뒤에 둡니다.

1. **정답** - 최소 길이 미달 시 '오류 없이 캐시 없음'이라는 문서의 동작과 일치합니다.
2. **오답** - 캐시 쓰기가 다음 요청으로 미뤄지는 동작은 없습니다. 쓰기는 해당 요청의 `cache_creation_input_tokens`에 나타납니다.
3. **오답** - 시스템 프롬프트는 캐싱의 대표적인 대상입니다. 도구·시스템·메시지 모두에 브레이크포인트를 둘 수 있습니다.
4. **오답** - 응답이 성공했고 거부 신호가 없습니다. 최소 길이 미달은 거부가 아니라 캐시를 건너뛰는 것입니다.

> 💡 **시험 포인트:** 캐시 필드가 둘 다 0 → 먼저 최소 길이를 의심하세요. 모델을 바꾸면 최소 길이도 달라집니다(예: Opus 4.8의 1,024 → Opus 5.5의 512).

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Claude Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)

---

## 문제 54
### **Claude Opus 5.5 요청이 5분 캐시에서 접두사를 읽고, 끝나기까지 3분이 걸리는 긴 답변을 스트리밍합니다. 사용자의 후속 질문은 같은 캐시 항목에 적중해야 합니다. 답변이 끝난 뒤 재사용할 수 있는 시간은 얼마나 될지 예측하세요.**

| 보기 | 설명 |
|------|------|
| 1. 5분 전부. 캐시 수명은 응답이 끝날 때 다시 시작되기 때문이다 | |
| 2. 10분 전부. 캐시를 읽을 때마다 남은 수명이 두 배가 되기 때문이다 | |
| **3. 약 2분. 수명은 그 항목을 읽은 요청이 시작된 시점부터 재기 때문이다** | |
| 4. 0분. 스트리밍 요청은 캐시 항목을 갱신하지 않기 때문이다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 캐시 적중은 수명을 무료로 갱신하지만, 프롬프트 캐싱 FAQ에 따르면 **수명은 캐시를 쓰거나 읽은 요청의 시작 시점부터** 잽니다. 응답 생성에 걸린 시간도 수명에서 빠지므로, 후속 요청이 재사용할 수 있는 창은 '수명 − 생성 시간'입니다. 5분 − 3분 = **약 2분** 입니다. 문서는 긴 응답 때문에 다음 요청이 수명 안에 시작하지 못할 수 있다면 **1시간 TTL** 을 쓰라고 권합니다.

```text
t=0:00  요청 시작 (캐시 읽기 → 수명 5분 갱신, 만료 예정 5:00)
t=3:00  스트리밍 완료
t=5:00  만료 → 후속 요청은 3:00~5:00 사이에 시작해야 적중
```

1. **오답** - 가장 흔한 오해입니다. 기준점은 응답 종료가 아니라 요청 시작입니다.
2. **오답** - 읽기는 수명을 기본값으로 갱신할 뿐 늘려 쌓지 않습니다.
3. **정답** - 요청 시작 기준의 수명 계산을 정확히 적용했습니다.
4. **오답** - 스트리밍 여부와 무관하게 캐시 적중은 수명을 갱신합니다.

> 💡 **시험 포인트:** "TTL은 요청 시작부터". 사고가 길거나 출력이 긴 워크로드에서 5분 TTL이 예상보다 빨리 끝나는 이유입니다.

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)

---

## 문제 55
### **한 팀이 70,000토큰짜리 지시 접두사를 공유하는 배치 요청 20,000개를 제출하려 하며, 프롬프트 캐싱을 가장 비용 효율적으로 쓰려고 합니다. Anthropic 안내를 따르는 순서는 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 5분 브레이크포인트로 20,000개를 모두 제출 → 결과 대기 → 캐시를 놓친 요청을 1시간 브레이크포인트로 다시 제출 | |
| **2. 접두사를 공유하는 요청을 모음 → 그 접두사와 1시간 캐시 블록을 담은 요청 하나짜리 배치를 보냄 → 완료될 때까지 모니터링 → 나머지 요청을 제출** | |
| 3. 배치 안에 max_tokens 0 사전 워밍 요청을 넣음 → 같은 배치에 모든 요청을 제출 → 결과에서 캐시 필드를 읽음 | |
| 4. 나머지 요청을 먼저 제출 → 요청 하나짜리 배치를 나중에 보냄 → 이후 배치가 데워진 캐시에 적중하게 함 | |

**정답: 2.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 배치 요청은 동시에, 순서 없이 처리되므로 배치 안의 캐시 적중은 **최선 노력(best-effort)** 입니다. 프롬프트 캐싱 FAQ는 1시간 캐시를 쓰는 가장 비용 효율적인 방법을 이렇게 제시합니다. ① 접두사를 공유하는 요청들을 모은다 → ② 그 접두사와 1시간 캐시 블록을 가진 **요청 하나짜리 배치** 를 보내 1시간 캐시에 쓴다 → ③ 작업이 끝났는지 **모니터링** 한다 → ④ 끝나는 즉시 나머지 요청을 제출한다. 배치는 보통 5분에서 1시간 사이에 끝나므로 5분 캐시보다 1시간 캐시가 낫습니다.

1. **오답** - 5분 캐시는 배치 처리 시간 안에 만료되기 쉽고, 동시 처리 때문에 접두사가 아직 쓰이기 전에 많은 요청이 시작됩니다. 결과를 보고 다시 제출하면 비용과 시간이 두 배로 듭니다.
2. **정답** - 문서가 제시한 네 단계와 순서가 일치합니다.
3. **오답** - `max_tokens: 0`은 Message Batches 요청에서 `invalid_request_error`로 거부됩니다. 같은 배치에 넣으면 워밍 요청이 먼저 끝난다는 보장도 없습니다.
4. **오답** - 순서가 거꾸로입니다. 캐시를 먼저 써 두고 나머지를 보내야 나머지가 적중할 수 있습니다.

> 💡 **시험 포인트:** 배치 + 캐싱 = "1시간 TTL로 먼저 하나를 써 두고, 끝난 뒤에 나머지". 배치 내 캐시 적중은 보장되지 않는다는 점도 함께 기억하세요.

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

## 문제 56
### **Claude Opus 5.5를 쓰는 코딩 어시스턴트가 큰 시스템 프롬프트를 캐시합니다. 밤에는 트래픽이 거의 없어서, 매일 아침 첫 요청들이 캐시 쓰기 비용을 내고 첫 토큰도 느립니다. 실제 트래픽이 오기 전에 캐시를 데워 두려면 어떻게 해야 할까요?**

| 보기 | 설명 |
|------|------|
| **1. 같은 접두사를 담고, 공유되는 마지막 블록에 명시적 브레이크포인트를 두며, 실제 요청과 같은 thinking·effort 설정을 쓴 max_tokens 0 요청을 주기적으로 보낸다** | |
| 2. 스트리밍은 모든 캐시 항목을 한 번에 갱신하므로, max_tokens 0인 스트리밍 요청을 매시간 보낸다 | |
| 3. 시스템 프롬프트 브레이크포인트의 TTL을 24시간으로 설정해 밤새 항목이 살아 있게 한다 | |
| 4. 4분마다 접두사에 count_tokens를 호출한다. 그러면 캐시 항목이 무료로 갱신된다 | |

**정답: 1.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 프롬프트 캐싱 문서는 **`max_tokens: 0`** 으로 출력을 생성하지 않고 접두사만 캐시에 올리는 사전 워밍을 설명합니다. 응답은 `content: []`, `stop_reason: "max_tokens"`이고 출력 토큰은 과금되지 않습니다(항목을 새로 쓰면 캐시 쓰기 비용은 듭니다). 문서의 지침은 세 가지입니다. 브레이크포인트는 자리표시 메시지가 아니라 **후속 요청과 공유하는 마지막 블록** 에 두고(자동 캐싱이 아닌 명시적 브레이크포인트), **실제 요청과 같은 thinking 설정과 `output_config.effort`** 를 쓰며, 기본 TTL이면 5분마다처럼 수명 안에 일정에 따라 보냅니다.

```python
client.messages.create(
    model="claude-opus-5-5",
    max_tokens=0,                    # 출력 없이 접두사만 캐시
    system=SYSTEM_PROMPT,            # 마지막 공유 블록에 cache_control
    output_config={"effort": "high"},# 실제 요청과 같은 effort
    messages=[{"role": "user", "content": "warmup"}],
)
```

1. **정답** - 문서화된 사전 워밍 방식과 그 세부 조건을 모두 갖췄습니다. 비용과 이득을 비교해 워밍 주기(또는 1시간 TTL)를 정합니다.
2. **오답** - `max_tokens: 0`은 `stream: true`와 함께 쓰면 `invalid_request_error`로 거부됩니다. 매시간이면 5분 TTL도 지나 버립니다.
3. **오답** - TTL 옵션은 5분과 1시간 두 가지뿐입니다.
4. **오답** - 토큰 카운팅은 캐싱 로직을 쓰지 않으므로 캐시 항목을 만들거나 갱신하지 않습니다.

> 💡 **시험 포인트:** 캐시 사전 워밍 = `max_tokens: 0` + 같은 접두사 + 마지막 공유 블록의 명시적 브레이크포인트 + 같은 사고·effort 설정. 스트리밍·배치·강제 tool_choice와는 함께 쓸 수 없습니다.

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)

---

## 문제 57
### **한 에이전트 루프의 캐시 적중률이 35%에 그칩니다. 시스템 프롬프트가 "Current date and time: 2026-10-30 09:14"라는 줄로 시작하고, 그 뒤에 고정 지시 6,000토큰이 오며 그 끝에 브레이크포인트가 있습니다. 가장 효과적인 해결책은 무엇일까요?**

| 보기 | 설명 |
|------|------|
| 1. 자동 캐싱으로 바꿔 시스템이 요청마다 더 나은 브레이크포인트를 고르게 한다 | |
| 2. TTL을 1시간으로 올려 바뀌는 타임스탬프가 캐시에 더 오래 남게 한다 | |
| **3. 타임스탬프를 마지막 안정 블록 뒤(예: 최근 사용자 턴)로 옮겨 브레이크포인트까지의 접두사가 똑같이 유지되게 한다** | |
| 4. 고정 지시 안에 브레이크포인트 3개를 더 넣어 작은 조각으로 캐시되게 한다 | |

**정답: 3.**

**해설:**

> 🏷 출제 영역: D5 · Model Selection and Optimization · 5.4 Cost and Token Management

> **핵심 진단:** 캐시 적중에는 브레이크포인트까지의 접두사가 **100% 동일** 해야 합니다. 해시는 브레이크포인트까지의 모든 내용을 덮으므로, 접두사 **맨 앞** 에 분 단위 타임스탬프가 있으면 분이 바뀔 때마다 뒤의 6,000토큰 전체가 새 항목이 됩니다. 같은 1분 안에 들어온 요청만 적중하니 적중률이 낮을 수밖에 없습니다. 문서의 처방은 브레이크포인트를 **요청 간에 그대로 유지되는 마지막 블록** 에 두고, 요청마다 바뀌는 내용(타임스탬프, 사용자 입력)은 그 **뒤** 로 보내는 것입니다.

```text
[변경 전]  system: "Current date and time: 09:14" + 고정 지시 6,000 ◀ BP
           → 분이 바뀔 때마다 접두사 전체가 달라짐

[변경 후]  system: 고정 지시 6,000 ◀ BP
           user:   "Current date and time: 09:14 ..." + 질문
           → 접두사가 매번 동일, 바뀌는 부분은 input_tokens로만 과금
```

1. **오답** - 자동 캐싱은 브레이크포인트를 마지막 캐시 가능 블록에 두므로 같은 문제를 겪습니다. 문서는 이런 경우 안정 블록에 명시적 브레이크포인트를 두라고 합니다.
2. **오답** - 수명이 문제가 아니라 접두사 불일치가 문제입니다. 내용이 바뀌면 TTL이 길어도 적중하지 않습니다.
3. **정답** - 바뀌는 내용을 안정 접두사 뒤로 옮기는 것이 근본 해결책입니다.
4. **오답** - 모든 브레이크포인트가 맨 앞의 타임스탬프 뒤에 있으므로, 어느 것도 접두사 불일치를 피하지 못합니다.

> 💡 **시험 포인트:** 적중률이 낮으면 "접두사 앞쪽에 요청마다 바뀌는 것(타임스탬프, ID, 사용자 이름)이 있는가"부터 확인하세요. 적중률은 캐시 읽기 토큰 ÷ 전체 입력 토큰으로 측정합니다.

> 📚 근거 문서: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

---
