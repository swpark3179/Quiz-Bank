*interleave* 는 '사이사이에 끼워 넣다'입니다. 응답 맨 앞에서 한 번만 생각하는 대신, **도구 결과를 받은 뒤에도 다시 사고 블록을 넣어** 그 결과를 보고 다음 행동을 추론합니다.

## 문제 속 쓰임
> Add the **interleaved-thinking** beta header, which lets the budget exceed `max_tokens` on this model.
> 이 모델에서 예산이 `max_tokens` 를 넘을 수 있게 해 주는 **interleaved-thinking** 베타 헤더를 추가한다

## 함께 쓰는 표현
- **interleave** (동) 사이사이에 끼워 넣다
- **beta header** : 베타 기능을 켜는 요청 헤더
- **adaptive thinking** : 적응형 사고 (인터리브드 사고가 자동으로 들어감)

## 시험 포인트
두 문항 모두 "interleaved-thinking 베타 헤더를 추가한다"가 **오답**입니다. Claude Haiku 4.5 는 인터리브드 사고를 지원하지 않아 헤더가 무시되고, 적응형 사고에서는 인터리브드 사고가 자동이라 수동 예산(`budget_tokens`)을 되살리는 헤더는 없습니다.
