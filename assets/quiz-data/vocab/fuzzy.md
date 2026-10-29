경계가 또렷하지 않고 **흐릿한** 것입니다. 검색·매칭에서는 철자가 조금 달라도 **비슷하면 일치로 보는 방식**(*fuzzy matching*)을 말합니다.

## 문제 속 쓰임
> Pick the match with the highest **fuzzy** name-similarity score and proceed, logging the confidence value for audit.
> 이름 **퍼지** 유사도 점수가 가장 높은 계정을 골라 진행하고, 감사를 위해 신뢰도 값을 기록한다

## 함께 쓰는 표현
- **fuzzy matching / search** : 근사 일치 / 근사 검색
- **exact match** : 정확히 일치 (반대 개념)

## 시험 포인트
고객 조회 결과가 여러 건이면 **유사도·최근성으로 추측해 고르는** 보기는 오답입니다. 주문 번호·이메일 같은 **추가 식별자를 물어 확정**한 뒤 진행하는 것이 정답입니다.
