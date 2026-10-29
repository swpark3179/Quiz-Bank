들어맞지 않는 것을 **억지로 기존 틀에 끼워 넣는** 것입니다.

## 문제 속 쓰임
> A new vendor begins sending "credit memo" documents, which are not in the enum, and the model **force-fits** them to "invoice", corrupting downstream routing.
> 새 공급업체가 enum에 없는 "credit memo" 문서를 보내기 시작했고, 모델은 이를 `"invoice"` 에 **억지로 끼워 맞춰** 다운스트림 라우팅을 오염시킨다.

## 함께 쓰는 표현
- **force-fit A into / to B** : A 를 B 에 억지로 끼워 맞추다
- **shoehorn into** ~ : ~에 억지로 밀어 넣다 (비슷한 말)

## 시험 포인트
목록 밖 값이 기존 enum 값으로 **억지 분류된다면**, enum 에 `"other"` 를 추가하고 상세 내용을 담을 선택적 문자열 필드를 두는 보기가 정답입니다. enum 을 없애거나 모든 유형을 나열하는 보기는 오답입니다.
