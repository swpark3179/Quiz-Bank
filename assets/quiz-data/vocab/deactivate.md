지우지 않고 **꺼 두어 당분간 쓰지 못하게** 하는 것입니다. 다시 켤 수 있다(*re-enable*)는 점이 영구적인 삭제(*delete*)와의 핵심 차이입니다.

## 문제 속 쓰임
> ...(c) requests return 401 and the key can only be deleted; (d) Anthropic **deactivates** the key automatically
> ...(c) 요청이 401을 받고 키는 삭제만 할 수 있다, (d) Anthropic이 키를 자동으로 **비활성화한다**

## 함께 쓰는 표현
- **deactivate a key** : 키를 비활성화하다
- **re-enable** : 다시 활성화하다
- **inactive** : 비활성 상태의

## 비슷한 말 · 반대말
- **disable** — 끄다 (거의 같은 뜻)
- **delete** — 삭제하다 (되돌릴 수 없음)

## 시험 포인트
API 키 문항에서 비활성화는 **되돌릴 수 있고**, 삭제는 영구적(목록에 `archived` 로 남음)이며, 만료된 키는 401을 받고 삭제만 가능합니다. 키가 공개 GitHub 저장소에 올라가면 Anthropic이 자동으로 *deactivate* 합니다.
