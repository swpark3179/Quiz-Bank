# edge-to-edge 앱에서 실행되지 않는 React Native 코드를 R8 이 지우게 하는 규칙.
# plugins/withAndroidR8.js 가 edge-to-edge 가 켜져 있을 때(app.json 의
# android.edgeToEdgeEnabled 가 false 가 아닐 때)만 android/app/proguard-rules.pro 에 덧붙인다.
#
# Play Console 은 Android 15 에서 지원 중단된 창 API(Window.setStatusBarColor 등)를
# 쓰는 코드가 DEX 에 남아 있으면 "더 넓은 화면용으로 지원 중단된 API 또는 파라미터" 경고를 낸다.
# 그중 React Native 의 아래 코드는 edge-to-edge 가 꺼진 앱에서만 실행된다.
#   - StatusBarModule.setColor 의 GuardedRunnable (Play 표시: b3.b.runGuarded)
#       Window.getStatusBarColor / setStatusBarColor
#   - StatusBarModule.setTranslucent 의 GuardedRunnable
#   - WindowUtil.kt statusBarHide / statusBarShow 의 edge-to-edge 아닌 분기
#       LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES / LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT
# 모두 `if (isEdgeToEdgeFeatureFlagOn)` 으로 갈리는데, 이 값은 MainApplication.onCreate 의
# loadReactNative() 가 BuildConfig.IS_EDGE_TO_EDGE_ENABLED(= gradle.properties 의
# edgeToEdgeEnabled=true)를 보고 true 로 바꾼 뒤로 다시 false 가 되지 않는다.
# 그 값을 읽는 코드(React 모듈, ReactActivityDelegate, Modal)는 모두 그 뒤에 돈다.
# 그래서 R8 에 "항상 true" 라고 알려 주어도 실행 결과는 같고, 쓰이지 않는 분기만 DEX 에서 빠진다.
#
# 남는 것: WindowUtilKt.enableEdgeToEdge(Android 14 이하에서 시스템 바를 투명하게 만드는 코드),
# StatusBarModule.getTypedExportedConstants(현재 색을 읽기만 함), Material·AndroidX 내부 코드.
# 이 코드는 Android 14 이하에서 실제로 필요하거나 라이브러리 안에 있어 지우지 않는다.
# (docs/android-deployment.md 4.7)
#
# edgeToEdgeEnabled 를 끄면 이 가정이 틀리므로, 플러그인이 블록을 넣지 않고
# scripts/verify-android-r8.sh 도 두 설정이 어긋나면 빌드 전에 멈춘다.
-assumevalues class com.facebook.react.views.view.WindowUtilKt {
    boolean isEdgeToEdgeFeatureFlagOn return true;
    boolean isEdgeToEdgeFeatureFlagOn() return true;
}
