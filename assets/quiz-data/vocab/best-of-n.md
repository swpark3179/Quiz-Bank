**같은 프롬프트를 N번 돌려 결과를 비교**하는 기법입니다. 가장 좋은 답을 고르는 데도 쓰고, 출력끼리 서로 다르면 환각의 신호로 보고 검증에 쓰기도 합니다.

## 문제 속 쓰임
> (a) citation verification, (b) direct-quote grounding, (c) **best-of-N** verification, (d) external knowledge restriction
> (a) 인용 검증, (b) 직접 인용 근거화, (c) **Best-of-N** 검증, (d) 외부 지식 제한

## 함께 쓰는 표현
- **best-of-N verification** : 여러 번 돌려 출력 간 불일치를 찾는 검증
- **direct-quote grounding** : 작업 전에 원문 인용을 먼저 뽑아 근거로 삼기
- **citation verification** : 작업 후 주장마다 인용을 찾고, 없으면 철회하기

## 시험 포인트
"같은 프롬프트를 세 번 돌려 출력 간 불일치를 표시한다"가 *best-of-N* 검증입니다. 이 문항은 작업 **전에** 인용을 뽑으면 직접 인용 근거화, 작업 **후에** 주장별 인용을 찾으면 인용 검증이라는 순서 구분으로 정답이 갈립니다.
