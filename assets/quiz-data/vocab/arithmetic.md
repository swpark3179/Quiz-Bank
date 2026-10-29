더하기·빼기·곱하기 같은 **숫자 계산**입니다. 명사 앞에서 형용사처럼도 씁니다(*arithmetic check*: 산술 검사).

## 문제 속 쓰임
> Schema enforcement removes syntax and type errors but not semantic ones, so a downstream **arithmetic** check must flag or retry mismatches.
> 스키마 강제는 구문 오류와 타입 오류는 없애지만 의미 오류는 없애지 못하므로, 다운스트림 **산술** 검사로 불일치를 표시하거나 재시도해야 한다

## 함께 쓰는 표현
- **arithmetic check / validation** : 산술 검증 (합계가 맞는지 등)
- **arithmetic error** : 계산 오류

## 시험 포인트
JSON 스키마는 **형식·타입**만 보장하고 "품목 합계 = 총액" 같은 **의미**는 보장하지 못합니다. 값끼리 안 맞으면 별도 검증 단계가 정답입니다.
