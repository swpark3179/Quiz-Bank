테스트에서 **미리 정답으로 정해 둔 기준값**을 말합니다. *golden string/dataset* 은 출력과 비교할 모범 답안(세트)으로, 사람이 확인해 "이게 맞다"고 저장해 둔 것입니다.

## 문제 속 쓰임
> A team's regression suite sends the same 200 prompts to Claude every night and compares each reply with a stored **golden** string.
> 한 팀의 회귀 테스트 묶음은 매일 밤 같은 프롬프트 200개를 Claude에 보내고 각 응답을 저장해 둔 **기준** 문자열과 비교한다.

## 함께 쓰는 표현
- **golden answer** : 모범 정답
- **golden dataset** : 기준 정답 세트
- **golden file** : 기대 출력을 저장해 둔 파일

## 비슷한 말 · 반대말
- **ground truth** — 실측 정답 (사람이 확인한 실제 정답 데이터)

## 시험 포인트
LLM 출력은 호출마다 문구가 달라질 수 있어, *golden* 문자열과 **글자 그대로 비교하면** 맞는 답도 실패합니다. 형식·필수 필드처럼 요구사항을 검사하고 여러 번 돌린 통과율로 판단하는 것이 정답입니다.
