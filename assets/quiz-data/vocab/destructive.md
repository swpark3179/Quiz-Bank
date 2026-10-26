데이터·파일을 **지우거나 덮어써서 되돌리기 어렵게 만드는** 작업을 가리킵니다. 삭제, 강제 푸시, DB 초기화 등이 대표적입니다.

## 문제 속 쓰임
> ...a developer accidentally triggered **destructive** test cleanup when the skill had broad tool access.
> 스킬에 광범위한 도구 접근 권한이 있어 한 개발자가 **파괴적인** 테스트 정리 작업을 실수로 실행했다.

## 함께 쓰는 표현
- **destructive operation / action** : 되돌릴 수 없는 작업
- **non-destructive** : 원본을 바꾸지 않는
- **destroy** (동) 파괴하다 · **destruction** (명) 파괴

## 시험 포인트
파괴적 작업은 **경고 문구나 금지 목록 같은 프롬프트 지시로는 확실히 막을 수 없습니다**. `allowed-tools` 처럼 도구 권한 자체를 좁히는 *구성 수준의 제한*이 정답입니다.
