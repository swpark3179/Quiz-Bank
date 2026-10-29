1. **그냥, 아무것도 덧붙이지 않은** — *a plain empty result* 는 이유·상태 정보 없이 비어 있기만 한 결과
2. **(서식 없는) 일반의** — *plain text* 는 마크업·서식이 없는 일반 텍스트

## 문제 속 쓰임
> When the customer database is briefly unreachable, get_customer returns a **plain** empty result...
> 고객 데이터베이스에 잠시 접속할 수 없을 때 `get_customer` 가 **그냥** 빈 결과를 반환하면...
> ...and some are already **plain-text** snippets that need no tool at all.
> 일부는 이미 **일반 텍스트**라 도구가 전혀 필요 없는 조각이다.

## 함께 쓰는 표현
- **plain text** : 일반 텍스트
- **plain English** : 쉬운 말

## 시험 포인트
도구가 접근 실패를 **그냥 빈 결과**로 돌려주면 에이전트는 "결과 없음"으로 오해하므로, 구조화된 오류로 구분해야 합니다. 일반 텍스트처럼 도구가 필요 없는 입력이 섞여 있으면 `tool_choice` 는 `auto` 가 맞습니다.
