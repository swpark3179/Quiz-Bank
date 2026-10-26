1. **거래에 관한** — 금액·날짜·주문번호처럼 주문·결제·환불 같은 거래 자체의 정보
2. **(DB) 트랜잭션 방식의** — 여러 작업을 전부 성공하거나 전부 취소되는 한 단위로 처리하는

## 문제 속 쓰임
> Extract **transactional** facts (amounts, dates, order numbers) into a persistent "case facts" block included in each prompt, outside the summarized history.
> **거래** 관련 사실(금액·날짜·주문번호)을 요약된 기록 밖의 영속적인 "case facts" 블록으로 뽑아 매 프롬프트에 넣는다.

## 함께 쓰는 표현
- **transactional data** : 거래 데이터
- **transactional email** : 주문 확인·비밀번호 재설정처럼 사용자 행동에 따라 자동 발송되는 메일
- **transaction** (명) 거래; (DB) 트랜잭션

## 시험 포인트
요약은 정확한 숫자를 잃기 쉬운 **손실 압축**입니다. 금액·날짜·주문번호처럼 틀리면 안 되는 거래 정보는 요약 대상에서 빼 별도 블록으로 매번 프롬프트에 넣는 것이 정답 방향입니다.
