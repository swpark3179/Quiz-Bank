강제 규칙은 아니어도 팀·커뮤니티가 **"이렇게 하자"고 정해 따르는 방식**입니다. 코드에서는 이름 짓기·폴더 구조·에러 처리 패턴 같은 **코딩 관례(컨벤션)** 를 말합니다.

## 문제 속 쓰임
> What's the most maintainable way to ensure Claude automatically applies the correct **conventions**?
> Claude가 올바른 **컨벤션**을 자동으로 적용하게 하는 가장 유지보수하기 좋은 방법은?

## 함께 쓰는 표현
- **coding / naming conventions** : 코딩·이름 짓기 규칙
- **follow conventions** : 관례를 따르다
- **data conventions** : 데이터 표기 규약 (날짜 형식·상태 코드 등)
- **conventional** (형) 관례적인, 일반적인

## 시험 포인트
컨벤션을 어디에 둘지는 **언제 적용돼야 하는지**로 고릅니다. 항상 적용 → `CLAUDE.md`, 파일 경로에 따라 → `.claude/rules/` 의 glob 패턴, 특정 작업을 할 때만 → Skill.
