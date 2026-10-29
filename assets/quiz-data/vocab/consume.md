자원·시간·토큰을 **써서 줄어들게 하는** 것입니다. 기술 문맥에서는 "(토큰·메모리를) 잡아먹다"라는 부정적인 느낌으로 자주 씁니다.

## 문제 속 쓰임
> ...some claims are stuck in infinite loops **consuming** thousands of tokens.
> 일부 청구 건이 무한 루프에 빠져 수천 토큰을 **소모하는** 것이 발견됐습니다.

## 함께 쓰는 표현
- **consume tokens / memory** : 토큰·메모리를 소모하다
- **time-consuming** : 시간이 많이 걸리는
- **consumption** (명) 소비, 사용량

## 시험 포인트
루프가 토큰을 끝없이 소모한다면 프롬프트로 종료를 부탁하는 대신 **코드에 최대 반복 횟수 상한**을 두는 것이 정답입니다.
