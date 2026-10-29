1. **(규칙·기준을) 적용하다** — *apply the threshold* 기준을 적용하다
2. **(변경이) 반영되다, 적용되다** — 목적어 없이 "효력이 생기다" (*the edit applies*)

## 문제 속 쓰임
> ...so it learns the $500 threshold from past manager approvals and **applies** it.
> 과거 관리자 승인 사례에서 $500 기준을 학습해 **적용하게** 한다
> Retry the identical Edit call with tool_choice forced so it **applies** despite the ambiguity in the match.
> 일치가 모호해도 **적용되도록** `tool_choice` 를 강제한 채 똑같은 `Edit` 호출을 다시 시도한다

## 함께 쓰는 표현
- **apply to** ~ : ~에 적용되다, 해당되다
- **applicable** (형) 적용할 수 있는, 해당되는

## 시험 포인트
반드시 지켜야 하는 금액 기준을 **파인튜닝으로 학습시켜 적용**하는 보기는 보장이 안 돼 오답입니다. 정답은 **PreToolUse hook** 같은 프로그래밍적 강제입니다.
