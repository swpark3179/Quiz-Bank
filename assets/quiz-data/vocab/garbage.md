원래 "쓰레기"이고, 개발 문맥에서는 **의미 없는 엉터리 결과·데이터**를 말합니다. 맞지 않는 입력에 도구를 잘못 썼을 때 자주 나옵니다.

## 문제 속 쓰임
> Logs show it calling parse_pdf on plain-text inputs — returning **garbage** — in 18% of cases.
> 로그를 보면 18%의 경우에 일반 텍스트 입력에도 `parse_pdf` 를 호출해 **엉터리 결과**를 돌려준다.

## 함께 쓰는 표현
- **garbage in, garbage out (GIGO)** : 입력이 엉망이면 출력도 엉망
- **return garbage** : 엉터리 값을 돌려주다

## 시험 포인트
도구가 필요 없는 입력에도 도구를 부른다면 `tool_choice` 가 `"any"`(반드시 도구 하나 호출)로 묶여 있는 것이 원인입니다. 모델이 직접 답할 수도 있게 **`"auto"`** 로 바꾸는 보기가 정답입니다.
