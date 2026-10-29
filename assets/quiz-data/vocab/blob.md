구조를 따지지 않고 **한 덩어리로 다루는 데이터**입니다. 흔히 *Binary Large Object* 의 줄임말로 설명하며, 암호화된 결과나 파일 내용처럼 안을 들여다보지 않는 바이트 묶음을 가리킵니다.

## 문제 속 쓰임
> Encrypt the .mcp.json file and commit the encrypted **blob**, then decrypt it with a shared key at session start.
> `.mcp.json` 파일을 암호화해 암호화된 **덩어리**를 커밋하고, 세션 시작 시 공유 키로 복호화한다.

## 함께 쓰는 표현
- **blob storage** : 파일 같은 비정형 데이터를 담는 저장소
- **an opaque blob** : 내용을 해석하지 않고 통째로 다루는 데이터

## 시험 포인트
공유 `.mcp.json` 의 비밀값은 암호화한 blob 을 커밋할 것이 아니라 `${GITHUB_TOKEN}` 같은 **환경 변수 참조**로 두어, 머신·CI 마다 자기 값을 넣게 하는 것이 정답입니다.
