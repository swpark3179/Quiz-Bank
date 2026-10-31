어떤 것을 **쓰지 못하게 공식적으로 막는** 것입니다. 문제에서는 주로 과거분사 *banned* 로 나와 "금지된 ~"(*banned terms* 금지어, *banned symbols* 금지 기호)을 만듭니다.

## 문제 속 쓰임
> It writes a product description, code checks the length and **banned** terms, and then the description is translated into German and French.
> 제품 설명을 쓰고, 코드가 길이와 **금지어**를 검사한 뒤, 설명을 독일어와 프랑스어로 번역한다.

## 함께 쓰는 표현
- **banned terms** : 금지어
- **ban A from B** : A가 B하지 못하게 막다
- **lift a ban** : 금지를 풀다

## 비슷한 말 · 반대말
- **prohibit / forbid** — 금지하다 (더 격식 있는 말)

## 시험 포인트
금지어 검사처럼 정해진 규칙은 LLM이 아니라 단계 사이의 **코드 게이트**로 넣습니다(고정 프롬프트 체인). 또 *banned* 기호 목록만 늘리는 프롬프트 수정은 오답이고, 규칙의 이유를 설명해야 Claude가 목록에 없는 서식까지 피합니다.
