정해진 기준이나 제한 없이 **아무것이나** 해당될 수 있다는 뜻입니다. 기술 문맥에서는 "어떤 값이든, 제약 없는"이라는 중립적인 뜻이고, 일상에서는 "제멋대로의"라는 부정적인 뜻으로도 씁니다.

## 문제 속 쓰임
> It has started pulling **arbitrary** web pages that are not documents, even though its prompt says to load only documents.
> 프롬프트에 문서만 불러오라고 했는데도, 문서가 아닌 **임의의** 웹 페이지를 가져오기 시작했다.

## 함께 쓰는 표현
- **arbitrary input** : 어떤 입력이든
- **arbitrary code execution** : 임의 코드 실행 (보안 위협)
- **arbitrarily** : 임의로, 제멋대로

## 비슷한 말 · 반대말
- **random** — 무작위의 (확률적으로 고른다는 뜻이 더 강함)

## 시험 포인트
범용 도구가 *arbitrary* 한 대상을 가져오는 문제는 프롬프트를 더 세게 쓰는 것이 아니라, **규칙을 도구 안에 넣은 좁은 도구**(URL이 문서인지 확인하는 `load_document`)로 바꾸는 것이 정답입니다.
