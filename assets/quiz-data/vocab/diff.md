두 버전의 파일을 비교해 **무엇이 추가·삭제·변경됐는지 줄 단위로 보여 주는 결과**입니다. 코드 리뷰에서는 "이번 변경분" 그 자체를 가리키고, 동사로는 "비교하다(*diff two files*)"로 씁니다.

## 문제 속 쓰임
> The history is full of superseded intermediate **diffs**, but the current task and goal are unchanged...
> 기록은 이미 폐기된 중간 **diff**로 가득하지만, 현재 작업과 목표는 그대로이다.
> Instruct the generating session to "review critically and assume the code contains bugs" before it approves the **diff**
> 생성 세션이 **diff**를 승인하기 전에 "비판적으로 리뷰하고 코드에 버그가 있다고 가정하라"고 지시한다

## 함께 쓰는 표현
- **git diff** : 아직 커밋하지 않은 변경분을 보여 주는 명령
- **review the diff** : 변경분을 검토하다
- **diff against** ~ : ~와 비교한 차이 (*diff against main*)

## 시험 포인트
코드를 **만든 세션이 자기 diff를 리뷰**하면 생성할 때의 추론을 그대로 안고 있어 문제를 잘 못 잡습니다. "더 비판적으로 보라"는 지시보다 **별도의 독립된 세션(인스턴스)으로 리뷰**하는 보기가 정답 쪽입니다.
