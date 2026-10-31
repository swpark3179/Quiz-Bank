**잠깐 쓰이고 사라지는** 것을 말합니다. 인프라에서는 작업 하나를 위해 새로 띄웠다가 끝나면 지우는 서버(*ephemeral host*)를, 프롬프트 캐싱에서는 일정 시간 뒤 만료되는 캐시를 표시하는 `cache_control` 의 값을 가리킵니다.

## 문제 속 쓰임
> A CI job on a fresh **ephemeral** build host then runs `claude -r "auth-refactor" "Finish this PR"`.
> 이후 새로 뜬 **일회용** 빌드 호스트의 CI 작업이 `claude -r "auth-refactor" "Finish this PR"` 을 실행한다.

## 함께 쓰는 표현
- **ephemeral environment** : 작업마다 새로 만들고 버리는 환경
- **`"type": "ephemeral"`** : `cache_control` 에 넣어 프롬프트 캐시 지점을 표시하는 값

## 비슷한 말 · 반대말
- **temporary / short-lived** — 임시의, 수명이 짧은
- **persistent** — 계속 남아 있는, 영속적인

## 시험 포인트
세션 기록은 그 세션을 만든 머신의 로컬 디스크에 있으므로, 아무것도 설정하지 않은 *ephemeral* 호스트에서는 이름으로 재개(`-r`)해도 세션을 찾지 못합니다. 트랜스크립트 파일을 옮기거나 `SessionStore` 로 공유 저장소에 미러링해야 합니다.
