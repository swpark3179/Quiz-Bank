여러 개를 **하나로 합치는** 것입니다. 문제에서는 여러 발견 사항을 모아 **종합하는** 뜻에 가깝습니다.

## 문제 속 쓰임
> ...it issues a fresh web_search or parse_pdf call instead of **combining** the findings the coordinator already passed in its prompt...
> ...이 서브에이전트가 코디네이터가 프롬프트로 이미 넘겨준 발견 사항을 **종합하는** 대신 `web_search` 나 `parse_pdf` 를 새로 호출해...

## 함께 쓰는 표현
- **combine A with B** : A와 B를 합치다
- **combined** (형) 합친 · **combination** (명) 조합

## 시험 포인트
종합 역할의 서브에이전트가 검색 도구를 계속 부르면, **역할에 필요한 도구만 남기도록 제한**하는 것이 정답입니다. 프롬프트로 금지하는 보기는 확률적이라 오답입니다.
