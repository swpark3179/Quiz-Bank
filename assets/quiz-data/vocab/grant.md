권한·허가·자원을 **공식적으로 내어 준다**는 말입니다. 명사로는 그렇게 내어 준 권한 자체(*a grant*)를 가리키며, 보안 문맥에서 "누가 무엇을 할 수 있게 허용됐는가"를 말할 때 씁니다.

## 문제 속 쓰임
> A session-level **grant** stays bound to the session that issued it, so a forked branch starts without it
> 세션 단위 **허용**은 그것을 발급한 세션에 묶여 있으므로, 포크된 갈래는 그 허용 없이 시작한다.

## 함께 쓰는 표현
- **grant access / permission** : 접근 권한을 주다
- **be granted access to** ~ : ~에 대한 접근 권한을 받다
- **take ~ for granted** : ~을 당연하게 여기다

## 비슷한 말 · 반대말
- **allow / permit** — 허용하다
- **revoke** — (권한을) 취소하다

## 시험 포인트
'allow for this session' 으로 받은 *grant* 는 그 세션 프로세스에 묶여, `--fork-session` 으로 만든 새 갈래에서는 **다시 승인**해야 합니다. 플래그 조합·작업 디렉터리·턴 수 만료 탓으로 돌리는 보기는 오답입니다.
