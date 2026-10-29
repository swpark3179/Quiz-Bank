**겉으로 보이는 동작은 그대로 두고** 코드의 구조·이름·배치를 더 깔끔하게 고치는 일입니다. 명사로 *a refactor*, *refactoring* 모두 씁니다.

## 문제 속 쓰임
> Midway through a coherent multi-hour **refactor**, the session approaches its context limit.
> 일관된 흐름으로 몇 시간째 진행 중인 **리팩터링** 도중 세션이 컨텍스트 한도에 가까워졌다.

## 함께 쓰는 표현
- **large-scale refactor** : 대규모 리팩터링
- **refactor A into B** : A를 B 형태로 고쳐 나누다

## 비교
- **refactor** — 동작은 그대로, 구조만 개선
- **rewrite** — 처음부터 새로 작성

## 시험 포인트
긴 리팩터링 도중 컨텍스트가 차면, 작업과 파일 상태가 그대로 유효할 때는 **`/compact`**, 그사이 코드가 바뀌어 기록이 낡았다면 **새 세션 + 이전 결론 요약**이 정답입니다.
