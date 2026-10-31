시스템 **안에서 바깥으로 나가는** 것을 가리킵니다. 보안에서는 *outbound* 요청이 데이터를 밖으로 빼돌리는(유출) 통로가 될 수 있어 **통제 대상**으로 자주 나옵니다.

## 문제 속 쓰임
> The rules are sufficient as long as the job also runs in auto mode, where a classifier separately reviews every **outbound** network request.
> 작업을 auto 모드로도 돌린다면 충분하다. auto 모드에서는 분류기가 **나가는** 네트워크 요청을 모두 따로 검토하기 때문이다

## 함께 쓰는 표현
- **outbound request / traffic** : 외부로 나가는 요청·트래픽
- **data exfiltration** : 데이터 유출

## 비슷한 말 · 반대말
- **egress** — 송신 (네트워크 용어, 거의 같은 뜻)
- **inbound** — 안으로 들어오는 (반대말)

## 시험 포인트
`Bash(curl *)` deny 규칙은 명령 문자열만 맞춰 보므로 `/usr/bin/curl` 이나 스크립트로 우회될 수 있고, auto 모드 분류기도 확률적 판단이라 이 보기는 **오답**입니다. 유출을 막으려면 샌드박스·컨테이너 같은 **OS 수준 격리**가 함께 있어야 합니다.
