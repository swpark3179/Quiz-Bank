데이터를 키 없이는 읽을 수 없게 **암호화하는** 것입니다. 키로 원래대로 푸는 것은 *decrypt*(복호화하다)입니다.

## 문제 속 쓰임
> **Encrypt** the .mcp.json file and commit the **encrypted** blob, then **decrypt** it with a shared key at session start.
> `.mcp.json` 파일을 **암호화해** **암호화된** 덩어리를 커밋하고, 세션 시작 시 공유 키로 **복호화한다**

## 함께 쓰는 표현
- **encryption** (명) 암호화 · **decryption** (명) 복호화
- **encrypted at rest** : 저장된 상태에서 암호화된

## 시험 포인트
`.mcp.json` 의 비밀값은 파일을 암호화해 커밋하기보다 **환경 변수 확장(`${VAR}`)** 으로 넣는 것이 정답입니다. "Claude가 못 읽게 데이터를 암호화한다"는 보기도 필요한 기능까지 막아 오답이 되기 쉽습니다.
