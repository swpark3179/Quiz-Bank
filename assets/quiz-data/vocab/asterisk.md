글자 `*` 입니다. 마크다운에서는 굵게·기울임·글머리표에, 정규식에서는 "앞 문자의 반복"에, 패턴에서는 "아무것이나"(와일드카드)에 쓰여 **문맥마다 역할이 다릅니다**.

## 문제 속 쓰임
> process_refund and issue_refund_note, because the dot and **asterisk** make it an unanchored regular expression that matches the substring
> 점과 **별표** 때문에 고정(anchor)되지 않은 정규식이 되어 부분 문자열에 매칭되므로, `process_refund`와 `issue_refund_note`

## 함께 쓰는 표현
- **wildcard** : 무엇이든 맞는 기호 (`*` 가 대표적)
- **regular expression (regex)** : 정규식
- **hash sign** : 샵 기호 (`#`)

## 시험 포인트
훅 matcher에 `.` 이나 `*` 가 들어가면 정확한 이름이 아니라 **고정되지 않은 정규식**으로 평가되어, `.*refund` 는 refund가 들어간 도구 이름 모두에 걸립니다. 하나만 겨누려면 `^process_refund$` 나 정확한 이름을 씁니다.
