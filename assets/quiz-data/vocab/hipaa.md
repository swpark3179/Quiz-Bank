**Health Insurance Portability and Accountability Act** 의 줄임말로, 미국에서 환자의 건강 정보(PHI)를 어떻게 보관·전송·공유해야 하는지 정한 법입니다. API 문맥에서 *HIPAA-enabled / eligible* 은 그 기준에 맞는 보호를 받는 조직·기능이라는 뜻입니다.

## 문제 속 쓰임
> A **HIPAA-enabled** organization builds a structured-outputs call that routes incoming clinic messages.
> **HIPAA가 활성화된** 조직이 들어오는 진료소 메시지를 분류하는 structured outputs 호출을 만든다.

## 함께 쓰는 표현
- **PHI** (*Protected Health Information*) : 보호 대상 건강 정보 (환자 이름·진료 기록 등)
- **HIPAA-eligible feature** : HIPAA 적용 대상 기능
- **HIPAA compliance** : HIPAA 준수

## 시험 포인트
HIPAA 조직에서 PHI는 **메시지 내용에만** 둡니다. JSON 스키마는 메시지와 따로 캐시되어 같은 PHI 보호를 받지 않으므로, 속성 이름·`enum`·`const`·`pattern` 에 환자 정보를 넣으면 안 됩니다.
