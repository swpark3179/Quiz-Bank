모델이 출력을 **다 낸 뒤에** 코드로 그 결과를 고치거나 다듬는 것입니다. 출력 자체를 바로잡지 않고 **뒤에서 땜질한다**는 뉘앙스로 오답 보기에 자주 나옵니다.

## 문제 속 쓰임
> **Post-process** responses with regex to strip markdown fences
> 정규식 **후처리**로 마크다운 펜스를 제거한다.
> Add a citation **post-processor** that guesses the most likely source for each uncited sentence...
> 인용 없는 문장마다 가장 그럴듯한 출처를 추측해 붙이는 인용 **후처리기**를 추가한다.

## 함께 쓰는 표현
- **post-processing step** : 후처리 단계
- **post-processor** (명) 후처리기

## 반대말
- **preprocessing** — 전처리 (처리 전에 입력을 다듬기)

## 시험 포인트
정규식 후처리나 출처를 추측하는 후처리기는 원인을 고치지 못하는 오답입니다. 구조화 출력은 **스키마로 강제**하고, 출처는 **처음부터 매핑을 보존해** 넘기는 것이 정답입니다.
