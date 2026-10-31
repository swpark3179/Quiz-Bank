어떤 일이 **끝난 다음에** 일어나는 일을 말합니다. 문제에서는 "검토·확인을 사후로 미룬다"는 뜻으로 자주 보이며, *afterwards* 와 같은 말입니다.

## 문제 속 쓰임
> Run Claude headless in CI with bypassPermissions so it extracts the services on a branch, with the resulting pull request reviewed **afterward**
> CI에서 bypassPermissions로 Claude를 헤드리스 실행해 브랜치에서 서비스를 추출하게 하고, 결과 PR을 **나중에** 검토한다

## 함께 쓰는 표현
- **shortly afterward** : 곧이어, 얼마 뒤
- **reviewed afterward** : 사후에 검토되는

## 비슷한 말 · 반대말
- **later** — 나중에 (거의 같은 뜻)
- **beforehand** — 미리, 사전에

## 시험 포인트
"작업은 먼저, 검토는 *afterward*" 구조의 보기는 사전 설계가 필요한 문항의 함정입니다. 여러 분리 방식이 가능한 대규모 변경은 편집 전에 plan mode로 계획을 승인받아야 하고, PR을 나중에 보면 잘못된 분리가 코드 전반에 퍼진 뒤에야 발견됩니다.
