1. **보관소, 기록 모음** — 오래 쌓아 둔 문서·데이터 묶음입니다 (*a large archive* 대량의 보관 자료)
2. **보관 처리하다** — 지우지 않고 비활성 상태로 따로 옮겨 두는 것입니다. *archived* 는 '보관된(지금은 쓰지 않는)' 상태입니다

## 문제 속 쓰임
> A data team uses the Message Batches API to classify a large **archive**.
> 한 데이터 팀이 Message Batches API로 대량의 **보관 자료**를 분류한다.

> On Monday, a compliance team must re-classify 80,000 **archived** emails with Claude, with results due on Friday.
> 월요일에 한 컴플라이언스 팀이 **보관된** 이메일 80,000건을 Claude로 다시 분류해야 하고, 결과 마감은 금요일이다.

## 함께 쓰는 표현
- **archive a project** : 프로젝트를 보관 처리하다
- **archived key** : 삭제되어 보관 상태로 남은 API 키

## 시험 포인트
대량의 *archive* 를 며칠 여유를 두고 싸게 처리하는 문항은 **Message Batches API**(표준 가격의 50%, 대부분 1시간 안, 최대 24시간)가 정답입니다. 배치 결과는 순서가 보장되지 않으므로 `custom_id` 로 원래 요청과 맞춥니다.
