**하나로 특정되지 않고 여러 개가 해당되는** 상태입니다. 편집·검색에서 *non-unique match* 는 찾는 문자열이 **여러 곳에서 일치해** 어느 것을 가리키는지 정할 수 없다는 뜻입니다.

## 문제 속 쓰임
> Its Edit call fails with a **non-unique-match** error because the target string appears on many lines ...
> 대상 문자열이 여러 줄에 나타나서, `Edit` 호출이 **고유하지 않은 일치(non-unique match)** 오류로 실패합니다.
> Escalate every **multiple-match** case straight to a human agent, ...
> **여러 계정이 일치하는** 경우는 모두 바로 사람 상담원에게 에스컬레이션한다

## 함께 쓰는 표현
- **unique** (형) 고유한, 하나뿐인
- **multiple matches** : 여러 건 일치

## 시험 포인트
`Edit` 은 **고유한 일치**가 필요하므로, 주변 문맥으로도 특정할 수 없으면 `Read` 후 `Write` 로 파일을 다시 쓰는 보기가 정답입니다. 고객 조회가 여러 건 일치하면 추측하거나 바로 넘기지 말고 **추가 식별자를 요청**합니다.
