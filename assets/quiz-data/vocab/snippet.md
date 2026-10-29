글·코드에서 떼어 낸 **짧은 조각**입니다. 검색 결과의 요약 문구나 코드 일부를 가리킬 때 씁니다.

## 문제 속 쓰임
> ...some are PDFs requiring parse_pdf, and some are already plain-text **snippets** that need no tool at all.
> 일부는 `parse_pdf` 가 필요한 PDF이고, 일부는 이미 일반 텍스트라 도구가 전혀 필요 없는 **조각**입니다.

## 함께 쓰는 표현
- **code snippet** : 코드 조각
- **text snippet** : 짧은 텍스트 발췌

## 시험 포인트
도구가 필요 없는 입력이 섞여 있는데 `tool_choice` 가 `"any"` 면 매번 도구를 억지로 부릅니다. **`"auto"`** 로 바꿔 필요할 때만 호출하게 하는 보기가 정답입니다.
