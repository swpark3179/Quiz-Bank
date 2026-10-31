한 사용자·계정·환경에 딸린 **설정과 정보의 묶음**입니다. 고객 기록의 "프로필"일 수도 있고, 이름을 붙여 골라 쓰는 **설정 파일**(named profile)일 수도 있습니다.

## 문제 속 쓰임
> A container sets ANTHROPIC_PROFILE=prod-batch, but no `prod-batch` **profile** file exists in the configuration directory.
> 한 컨테이너가 ANTHROPIC_PROFILE=prod-batch를 설정했지만, 설정 디렉터리에 `prod-batch` **프로필** 파일이 없다.

## 함께 쓰는 표현
- **named profile** : 이름 붙인 설정 묶음 (환경 변수로 골라 씀)
- **inference profile** : (Amazon Bedrock) 모델·지역을 묶어 부르는 추론 프로필 ID
- **shell profile** : 셸 시작 설정 파일 (`~/.bash_profile` 등)
- **user profile** : 사용자 프로필

## 시험 포인트
SDK 자격 증명 순서에서 **명시적으로 지정한 프로필이 없으면 다른 자격 증명으로 넘어가지 않고 오류**가 납니다. "경고만 남기고 다음 단계로 넘어간다"는 보기는 오답입니다.
