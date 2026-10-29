**standard output** 의 줄임말로, 프로그램이 **결과를 내보내는 기본 통로**입니다. 터미널에 찍히는 일반 출력이 여기로 나가고, 파이프로 다른 명령에 넘길 수 있습니다.

## 문제 속 쓰임
> ...a shell gate script greps **stdout** for the word "CRITICAL" to fail the build.
> 셸 게이트 스크립트가 **stdout**에서 "CRITICAL" 이라는 단어를 grep해 빌드를 실패시킨다.

## 함께 쓰는 표현
- **print to stdout** : 표준 출력으로 내보내다
- **stderr** : 표준 오류 — 오류 메시지가 따로 나가는 통로

## 시험 포인트
stdout 의 자연어를 grep 하는 방식은 표현이 조금만 달라져도 깨집니다. CI 에서 Claude 출력을 기계가 읽어야 하면 `--output-format json` + `--json-schema` 로 **구조를 강제**하는 보기가 정답입니다.
