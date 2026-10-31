의사가 병의 원인을 찾듯, 장애·오류가 **왜 일어났는지 원인을 밝혀내는 일**입니다. 기술 문서에서는 증상(알림·로그·오류 메시지)에서 근본 원인을 찾아가는 과정을 말합니다.

## 문제 속 쓰임
> A fixed set of parallel subagents for the database, cache and load balancer that report to a merging step for **diagnosis**
> 데이터베이스·캐시·로드 밸런서를 맡은 고정된 병렬 서브에이전트들이 **진단**을 위한 병합 단계에 보고하는 구조

## 함께 쓰는 표현
- **diagnose the issue** : 문제의 원인을 진단하다
- **root-cause diagnosis** : 근본 원인 진단
- **diagnostic information** : 진단에 쓰는 정보 (로그·오류 세부 등)

## 시험 포인트
어느 서비스가 원인인지 모르는 장애 **진단**에서는 조사 대상을 미리 정해 둔 고정 병렬 구조가 오답입니다. 앞 단계의 발견에 따라 다음 작업을 정하는 **오케스트레이터(적응형 분해)** 가 정답입니다.
