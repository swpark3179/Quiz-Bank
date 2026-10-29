웹페이지에서 **내용을 자동으로 긁어 오는** 것입니다. 원래 "긁다, 긁어내다"라는 뜻에서 왔습니다.

## 문제 속 쓰임
> ...the web-search subagent's full **scraped** page bodies — roughly 38k tokens — flow straight into the synthesis subagent's prompt.
> 웹 검색 서브에이전트가 **긁어 온** 페이지 본문 전체, 약 38k 토큰이 그대로 종합 서브에이전트의 프롬프트로 들어갑니다.

## 함께 쓰는 표현
- **web scraping** : 웹 스크레이핑
- **scraper** (명) 스크레이퍼, 긁어 오는 프로그램

## 시험 포인트
긁어 온 원문을 통째로 넘기면 중간에 묻힌 정보를 놓칩니다(lost-in-the-middle). 넘기기 전에 **관련 발견 사항만 추리고**, 받는 쪽 프롬프트 맨 앞에 핵심 요약을 두는 보기가 정답입니다.
