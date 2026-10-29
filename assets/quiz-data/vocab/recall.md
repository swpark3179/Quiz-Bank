1. **떠올리다, 기억해 내다** — 예전에 본 것을 다시 생각해 낸다
2. **재현율** — 평가 지표에서 "찾아야 할 것 중 실제로 찾아낸 비율" (*precision* 정밀도와 짝)
3. **(제품을) 회수하다** — 리콜

## 문제 속 쓰임
> Add a '**recall** the earlier research' instruction to the synthesis subagent's system prompt so it retrieves prior findings
> 합성 서브에이전트의 시스템 프롬프트에 'recall the earlier research'(앞선 조사를 **떠올려라**)라는 지시를 추가해 이전 발견 사항을 가져오게 한다.

## 함께 쓰는 표현
- **recall earlier findings** : 앞선 발견 사항을 떠올리다
- **precision and recall** : 정밀도와 재현율

## 시험 포인트
서브에이전트는 코디네이터의 대화를 **볼 수 없으므로** "떠올려라"는 지시는 효과가 없습니다. 필요한 발견 사항을 **위임 프롬프트에 직접 넣는** 보기가 정답입니다.
