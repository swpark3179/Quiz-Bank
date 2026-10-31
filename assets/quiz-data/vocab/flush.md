버퍼에 모아 둔 데이터를 **기다리지 않고 바로 밖으로 내보내 비운다**는 말입니다. 프로그램은 출력을 잠시 모았다가 한꺼번에 내보내는데, *flush* 하면 쌓인 내용이 즉시 화면·파일·파이프로 나갑니다.

## 문제 속 쓰임
> Add --output-format stream-json so output is **flushed** continuously
> `--output-format stream-json` 을 붙여 출력이 계속 **흘러나오게** 한다.

## 함께 쓰는 표현
- **flush the buffer** : 버퍼를 비우다
- **flush to disk** : 디스크에 바로 기록하다
- **flush the cache** : 캐시를 비우다

## 시험 포인트
CI에서 `claude "query"` 가 멈추는 원인은 출력이 *flush* 되지 않아서가 아니라 **대화형 세션이 열려 입력을 기다리기** 때문입니다. 한 번 실행하고 끝내려면 `-p` 를 붙이며, `stream-json` 은 `-p` 실행의 출력 형식 옵션일 뿐입니다.
