아직 동작하지만 **"앞으로 없앨 예정이니 새로 쓰지 말라"고 공식적으로 표시하는** 것입니다. Anthropic 모델 수명주기에서도 *deprecated* 는 '아직 동작하지만 권장하지 않음'이고, 퇴역일이 지나 *retired* 가 된 뒤에야 요청이 실패합니다.

## 문제 속 쓰임
> A developer wants Claude Code to update a **deprecated** log statement `logger.warn("legacy-path")` that appears twice in the same file...
> 개발자가 같은 파일에 두 번 나오는 **폐기 예정** 로그 문 `logger.warn("legacy-path")`를 Claude Code로 고치려 한다...

## 함께 쓰는 표현
- **deprecated API** : 사용 중단이 권고된 API
- **deprecation notice** : 폐기 예정 공지

## 비슷한 말 · 반대말
- **retired** — 퇴역한, 더 이상 동작하지 않는
- **legacy** — 오래된, 예전 방식의

## 시험 포인트
이 *deprecated* 로그 문처럼 같은 문자열이 파일에 두 번 나오면 Edit가 실패합니다. 대상 함수의 이웃 줄을 `old_string` 에 덧붙여 **고유하게 만든 뒤 다시 시도**하는 것이 정답이고, `replace_all` 은 두 곳을 모두 바꿉니다.
