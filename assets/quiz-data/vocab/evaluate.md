기준에 비춰 **좋고 나쁨, 맞고 틀림을 따져 판정한다**는 말입니다. AI 개발에서 *eval* 은 모델 출력을 채점하는 평가(세트), *evaluator* 는 그 채점을 맡는 사람·모델·코드를 가리킵니다.

## 문제 속 쓰임
> Ask Claude to **evaluate** the test results and fix whichever failure appears more severe first...
> Claude에게 테스트 결과를 **평가하게** 하고 더 심각해 보이는 실패부터 고치게 한다.

## 함께 쓰는 표현
- **run an eval** : 평가 세트를 돌리다
- **evaluation criteria** : 평가 기준
- **evaluator** : 평가자, 평가기

## 시험 포인트
정확한 실패 내용을 빼고 Claude에게 알아서 *evaluate* 하라고 맡기는 보기는 오답입니다. 서로 **독립적인** 실패는 각각의 정확한 출력과 함께 하나씩 순서대로 고치고 확인합니다.
