# Expo SDK 54 (expo-modules-core 3.0.x) 에서 R8 을 켤 때 필요한 보완 규칙.
# plugins/withAndroidR8.js 가 prebuild 때 android/app/proguard-rules.pro 에 덧붙인다.
#
# expo-modules-core 58.x 의 consumer 규칙(android/proguard-rules.pro)에 들어간 수정을
# SDK 54 에 맞춰 옮겨 온 것이다. SDK 58 이상으로 올리면 라이브러리에 포함되어 있으므로
# 이 파일의 규칙은 지워도 된다.

# v1.6.2~v1.6.5 에서 R8 을 켰을 때 DB 를 열지 못했다:
#   Call to function 'NativeDatabase.constructor' has been rejected.
#   → The 2nd argument cannot be cast to type expo.modules.sqlite.OpenDatabaseOptions
#   → Caused by: java.lang.NullPointerException
# RecordTypeConverter 는 JS 객체를 Record 로 바꿀 때 리플렉션으로 @Field 의 key 를 읽는다.
# R8 이 이 어노테이션 클래스를 변형하면 그 줄에서 NPE 가 난다. (expo/expo#51206)
# 빈 마커 인터페이스 Record 가 최적화로 지워지면 `implements Record` consumer 규칙도
# 맞지 않게 된다. (expo/expo#46852)
# records 패키지(Record, @Field, @Required, @BindUsing, 검증 어노테이션·바인더)는
# 모두 리플렉션으로 읽히고 크기가 작으므로 통째로 지킨다.
-keep class expo.modules.kotlin.records.** { *; }

# enum 인자 변환은 `-keep enum * implements Enumerable { *; }` consumer 규칙에 기댄다.
# Record 와 같은 이유로 빈 마커 인터페이스가 지워지지 않게 한다.
-keep interface expo.modules.kotlin.types.Enumerable
