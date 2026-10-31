길이·범위·기능을 **늘리다, 확장하다** 라는 뜻입니다. 이미 있는 것에 **덧붙여 키우는** 느낌입니다. (*extended thinking* 은 별도 단어로 등록되어 있습니다.)

## 문제 속 쓰임
> **Extend** old_string with the neighbouring lines from the target function, then retry Edit, which finds a single match in the file
> 대상 함수의 이웃 줄을 `old_string`에 **덧붙여 늘린** 뒤 다시 Edit하면, 파일에서 한 곳만 일치한다.

## 함께 쓰는 표현
- **extend A with B** : A에 B를 더해 확장하다
- **extension** (명) 확장, 확장 기능 / (파일) 확장자
- **extended** (형) 늘어난, 확장된

## 시험 포인트
Edit 의 `old_string` 이 여러 곳과 일치하면, 주변 줄을 더해 **유일하게 일치하도록 늘리는** 것이 정답입니다. 파일 전체를 다시 쓰는 보기는 과한 대응입니다.
