서비스 업체의 클라우드가 아니라 **내 서버·내 네트워크 안에서 직접 운영하는** 방식입니다. 무엇을 내 쪽으로 옮기고 무엇은 업체 쪽에 남는지가 시험에서 자주 묻는 부분입니다.

## 문제 속 쓰임
> ...(b) where sessions run, cloud or **self-hosted** sandbox; ...
> (b) 세션이 실행되는 곳(클라우드 또는 **자체 호스팅** 샌드박스)

## 함께 쓰는 표현
- **self-hosted sandbox** : 자체 호스팅 샌드박스
- **self-hosted environment** : 내 인프라에서 도는 실행 환경

## 비슷한 말 · 반대말
- **on-premises** — 사내 설비에 설치한 (비슷한 뜻)
- **managed / cloud-hosted** — 업체가 대신 운영하는

## 시험 포인트
Managed Agents 에서 클라우드냐 자체 호스팅이냐는 **environment**(어디서 도나)의 선택입니다. 자체 호스팅으로 옮겨 오는 것은 **도구 실행**뿐이고, Claude 와 에이전트 루프는 Anthropic 에 남아 도구 입출력이 Anthropic 제어 평면을 거칩니다.
