1. **(모델의) 샘플링** — 모델이 다음 토큰 후보들의 확률에 따라 하나를 뽑는 과정. *temperature* 같은 설정이 이 무작위성의 정도를 조절합니다
2. **표본 추출** — 전체에서 일부를 뽑아 조사하는 것 (*random sampling* 무작위 표본 추출)

## 문제 속 쓰임
> Set the temperature to zero in the API call, making token **sampling** more repeatable from one run to the next
> API 호출의 temperature 를 0 으로 설정해 실행 간 토큰 **샘플링**을 더 재현 가능하게 만든다.

## 함께 쓰는 표현
- **sampling temperature** : 샘플링 온도(무작위성 정도)
- **token sampling** : 토큰 샘플링

## 비슷한 말 · 반대말
- **deterministic** — 결정적인, 매번 같은 결과가 나오는 (샘플링의 무작위성과 반대 성격)

## 시험 포인트
이 보기는 오답입니다. temperature 는 실행 간 변동을 줄일 수는 있어도 **어떤 필드 순서로 쓸지, 수정 제안이 필수인지**는 알려 주지 않습니다. 형식 일관성은 원하는 형식을 보여 주는 **퓨샷 예시**로 잡고, 프롬프트에 없는 지시는 샘플링 설정으로 생기지 않습니다.
