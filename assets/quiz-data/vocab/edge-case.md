입력이 범위의 끝(0, 빈 값, 최댓값)에 걸렸거나 **드물게만 생기는 조건**이라 평소에는 잘 드러나지 않는 경우입니다. 버그가 숨기 쉬운 곳이라 테스트·리뷰에서 따로 챙깁니다.

## 문제 속 쓰임
> ...subtle issues—performance optimizations that break **edge cases**, cleanups that change behavior—only surface when a different team member reviews the PR.
> **엣지 케이스**를 깨는 성능 최적화, 동작을 바꾸는 정리 같은 미묘한 문제가 다른 팀원이 PR을 리뷰할 때에야 드러난다.

## 함께 쓰는 표현
- **handle edge cases** : 엣지 케이스를 처리하다
- **corner case** : 여러 조건이 한꺼번에 겹친 더 드문 경우

## 비교
- **edge case** — 드물거나 경계에 걸린 경우
- **happy path** — 아무 문제 없이 흘러가는 일반적인 경우

## 시험 포인트
"엣지 케이스**만**" 다루라는 보기는 일반 경우를 빠뜨려 오답이 되기 쉽습니다. 반면 도구 설명에 **입력 형식·예시·엣지 케이스·사용 경계**까지 담는 보기는 정답 쪽입니다.
