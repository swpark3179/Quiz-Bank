데이터·코드·시스템을 **다른 환경이나 새 형식·버전으로 옮겨 바꾸는** 것입니다. 명사 *migration* 은 그 작업(마이그레이션) 또는 DB 스키마 변경 스크립트를 가리킵니다.

## 문제 속 쓰임
> ...logs show Claude **re-migrating** files it already converted and skipping others as the conversation grows.
> 대화가 길어질수록 Claude가 이미 변환한 파일을 **다시 마이그레이션하고** 다른 파일은 건너뛰는 모습이 로그에 나타납니다.

## 함께 쓰는 표현
- **migrate A to B** : A를 B로 옮기다·전환하다
- **framework / database migration** : 프레임워크 / 데이터베이스 마이그레이션
- **migration plan** : 전환 계획

## 시험 포인트
대규모 마이그레이션에서 **이미 한 파일을 또 하고 일부를 빠뜨리면**, 완료·대기 파일을 적은 외부 매니페스트를 두고 파일마다 갱신하는 보기가 정답입니다.
