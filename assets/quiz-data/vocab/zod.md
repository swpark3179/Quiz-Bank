**TypeScript 용 스키마 선언·검증 라이브러리**입니다. 객체의 모양을 스키마로 정의해 두면 실행 중에 값을 검사하고, 같은 스키마에서 타입도 얻을 수 있습니다.

## 문제 속 쓰임
> ...yields inconsistent output across runs: sometimes it adds **zod**, sometimes hand-written checks, sometimes nothing meaningful.
> 실행할 때마다 결과가 들쭉날쭉하다. 어떤 때는 **`zod`** 를 추가하고, 어떤 때는 손으로 쓴 검사 코드를 넣고, 어떤 때는 의미 있는 변화가 거의 없다.

## 함께 쓰는 표현
- **zod schema** : zod 로 정의한 스키마 (`z.object({...})`)
- **schema validation** : 스키마 검증

## 시험 포인트
특정 라이브러리(예: zod)로 일관되게 쓰게 하려면 "더 견고하게"라는 말 대신 **그 라이브러리를 쓴 구체적인 입력-출력 예시**를 보여 주는 것이 정답입니다.
