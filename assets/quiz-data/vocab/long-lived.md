한 번 발급하면 **오래(또는 만료 없이) 유효한** 것을 말합니다. 보안에서는 유출되면 오랫동안 악용될 수 있어 **피해야 할 대상**이라는 신호로 자주 나옵니다.

## 문제 속 쓰임
> Company security policy forbids **long-lived** static credentials for non-human workloads.
> 회사 보안 정책은 사람이 아닌 워크로드에 **장기** 정적 자격 증명을 금지합니다.

## 함께 쓰는 표현
- **long-lived credentials** : 장기 자격 증명
- **static credentials** : 고정된(바뀌지 않는) 자격 증명
- **long-lived access keys** : 오래 유효한 액세스 키

## 비슷한 말 · 반대말
- **short-lived** — 수명이 짧은 (*short-lived token* 단기 토큰, 반대말)
- **ephemeral** — 잠깐만 존재하는

## 시험 포인트
"사람이 아닌 워크로드 + 장기 키 금지"는 **서비스 계정 + 워크로드 ID 페더레이션(WIF)** 의 신호입니다. 플랫폼 ID 토큰을 단기 액세스 토큰으로 바꾸므로 정적 키가 없고, 개발자의 장기 키를 마운트하는 보기는 오답입니다.
