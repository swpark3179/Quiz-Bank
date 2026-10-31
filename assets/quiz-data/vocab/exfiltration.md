보안 용어로, 공격자나 조종당한 에이전트가 **내부 데이터를 몰래 외부로 빼내는 것**입니다. 비밀 키·고객 정보를 외부 서버로 보내는 네트워크 요청이 대표적인 경로입니다.

## 문제 속 쓰임
> To prevent data **exfiltration**, the team's only control is a `permissions.deny` list containing `Bash(curl *)` and `Bash(wget *)`.
> 데이터 **유출**을 막기 위한 팀의 유일한 통제는 `Bash(curl *)` 와 `Bash(wget *)` 가 들어 있는 `permissions.deny` 목록이다.

## 함께 쓰는 표현
- **data exfiltration** : 데이터 유출
- **exfiltrate credentials** : 자격 증명을 빼돌리다

## 비슷한 말 · 반대말
- **leak** — 새다, 유출 (의도 없이 새는 경우도 포함)

## 시험 포인트
Bash deny 규칙은 **명령 문자열**과 맞춰 볼 뿐이라 `/usr/bin/curl` 이나 스크립트로 우회될 수 있습니다. *exfiltration* 을 확실히 막으려면 샌드박스·컨테이너(`--network none`)·VM 같은 **OS 수준 격리**를 함께 씁니다.
