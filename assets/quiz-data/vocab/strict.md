규칙·기준을 **느슨하게 봐주지 않고 엄격히 적용하는** 것입니다. 코드 리뷰·검증에서는 기준을 얼마나 깐깐하게 잡는지(엄격도)를 말할 때 씁니다.

## 문제 속 쓰임
> Apply a uniform **strictness** reduction across all categories.
> 모든 카테고리에 똑같이 **엄격도**를 낮춘다.

## 함께 쓰는 표현
- **strict mode** : 엄격 모드 (예: TypeScript 의 `strict` 설정)
- **strictly enforce** : 엄격하게 강제하다
- **strictness** (명) 엄격함, 엄격도

## 반대말
- **lenient**, **loose**, **relaxed** — 관대한, 느슨한

## 시험 포인트
오탐이 **특정 카테고리에 몰려 있을 때** 전체 기준을 똑같이 완화하면, 잘 작동하던 카테고리까지 둔해져 중요한 이슈를 놓칩니다. 문제 카테고리만 골라 다루는 선택지가 낫습니다.
