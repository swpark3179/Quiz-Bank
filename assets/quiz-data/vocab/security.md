시스템·데이터를 위협으로부터 **지키는 것, 보안**입니다.

## 문제 속 쓰임
> During a **security** review, the team finds that Claude can retrieve HR data when users embed instructions in uploaded PDF documents...
> **보안** 검토에서, 사용자가 업로드한 PDF에 지시를 심어 두면 Claude가 HR 데이터를 조회한다는 사실이 발견됐습니다.

## 함께 쓰는 표현
- **security review / scan** : 보안 검토 / 스캔
- **security-sensitive** : 보안상 민감한
- **secure** (형) 안전한 / (동) 안전하게 하다

## 시험 포인트
보안 요구는 프롬프트에 당부하는 것으로는 보장되지 않습니다. **훅, 권한(deny) 규칙, 환경 변수로 비밀값 분리**처럼 모델 판단과 무관하게 동작하는 구조가 정답 쪽입니다.
