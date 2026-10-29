1. **설명(문)** — 무엇인지 글로 풀어 쓴 것
2. **(도구의) description** — 도구 정의 안의 설명 필드. 모델은 이 글을 읽고 **어떤 도구를 언제 쓸지** 판단합니다

## 문제 속 쓰임
> The tool **descriptions** are: 'Gets user information' and 'Fetches account details'.
> 도구 **설명**은 각각 "Gets user information", "Fetches account details" 입니다.

## 함께 쓰는 표현
- **tool description** : 도구 설명
- **enrich / expand a description** : 설명을 보강하다
- **descriptive** (형) 설명적인, 구체적으로 묘사하는

## 시험 포인트
모델이 도구를 헷갈려 잘못 고르면 **첫 처방은 도구 설명 보강**입니다. 무엇을 하는지, 언제 쓰고 언제 쓰지 않는지, 입력 형식·예시·반환 데이터를 적는 보기가 정답입니다.
