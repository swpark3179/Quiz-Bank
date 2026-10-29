문제가 생긴 뒤 **정상 상태로 되돌리는 일(복구)** 입니다. 동사 *recover* 는 "잃은 것을 되찾다, 오류에서 회복하다"입니다.

## 문제 속 쓰임
> The current **recovery** discards the result and re-runs the identical prompt from scratch; 40% of retries still fail the rule.
> 현재 **복구** 방식은 결과를 버리고 똑같은 프롬프트를 처음부터 다시 실행하는데, 재시도의 40%가 여전히 규칙을 통과하지 못한다.

## 함께 쓰는 표현
- **error recovery** : 오류 복구
- **recover from a failure** : 실패에서 회복하다
- **recoverable / unrecoverable error** : 복구 가능한 / 불가능한 오류

## 시험 포인트
검증에 실패한 추출을 복구할 때는 같은 프롬프트를 반복하지 말고 **실패한 출력 + 구체적인 오류 메시지를 되돌려 주며 해당 필드만 고치게** 하는 보기가 정답입니다. 단, 원문에 아예 없는 값은 재시도로 *recover* 할 수 없습니다.
