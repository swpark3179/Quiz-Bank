#!/usr/bin/env bash
# expo prebuild 결과(android/)에 R8 설정이 모두 들어갔는지 Gradle 빌드 전에 확인한다.
# 하나라도 빠지면 최적화·난독화되지 않은 빌드나, 보완 규칙 없이 Record 변환이 깨지는 빌드가
# 조용히 만들어지므로 여기서 멈춘다. (plugins/withAndroidR8.js, plugins/android-r8-rules.pro)
#
# 사용법: bash scripts/verify-android-r8.sh [android 디렉터리 (기본값: android)]
set -euo pipefail

ANDROID_DIR=${1:-android}
PROPS="$ANDROID_DIR/gradle.properties"
BUILD_GRADLE="$ANDROID_DIR/app/build.gradle"
RULES="$ANDROID_DIR/app/proguard-rules.pro"

fail() {
  echo "::error::$1"
  exit 1
}

for f in "$PROPS" "$BUILD_GRADLE" "$RULES"; do
  [ -f "$f" ] || fail "$f not found (run expo prebuild first)"
done

grep -qxF 'android.enableMinifyInReleaseBuilds=true' "$PROPS" \
  || fail "'android.enableMinifyInReleaseBuilds=true' is not a standalone line in $PROPS (expo-build-properties enableMinifyInReleaseBuilds)"

if grep -q 'getDefaultProguardFile("proguard-android.txt")' "$BUILD_GRADLE"; then
  fail "$BUILD_GRADLE still uses proguard-android.txt (-dontoptimize); withAndroidR8 plugin not applied"
fi
grep -q 'getDefaultProguardFile("proguard-android-optimize.txt")' "$BUILD_GRADLE" \
  || fail "$BUILD_GRADLE does not use proguard-android-optimize.txt (withAndroidR8 plugin not applied)"

grep -q '^# @generated begin quiz-bank-r8' "$RULES" \
  || fail "$RULES has no quiz-bank-r8 block (withAndroidR8 plugin not applied)"
grep -qxF -- '-keep class expo.modules.kotlin.records.** { *; }' "$RULES" \
  || fail "$RULES is missing the expo records keep rule"
grep -qxF -- '-keep interface expo.modules.kotlin.types.Enumerable' "$RULES" \
  || fail "$RULES is missing the Enumerable keep rule"

# plugins/android-r8-edge-to-edge.pro 는 "edge-to-edge 가 항상 켜져 있다"고 R8 에 알려 준다.
# gradle.properties 의 edgeToEdgeEnabled 와 어긋나면 상태 표시줄 코드가 잘못 지워지거나(꺼졌는데 블록이 있음)
# Play 경고 대상 코드가 그대로 남으므로(켜졌는데 블록이 없음) 빌드 전에 멈춘다.
EDGE_TO_EDGE_RULE='    boolean isEdgeToEdgeFeatureFlagOn() return true;'
if grep -qxF 'edgeToEdgeEnabled=true' "$PROPS"; then
  grep -q '^# @generated begin quiz-bank-edge-to-edge' "$RULES" \
    || fail "$RULES has no quiz-bank-edge-to-edge block although edgeToEdgeEnabled=true (withAndroidR8 plugin not applied)"
  grep -qxF -- "$EDGE_TO_EDGE_RULE" "$RULES" \
    || fail "$RULES is missing the WindowUtilKt.isEdgeToEdgeFeatureFlagOn assume rule"
elif grep -q '^# @generated begin quiz-bank-edge-to-edge' "$RULES"; then
  fail "$RULES has the quiz-bank-edge-to-edge block but $PROPS does not contain 'edgeToEdgeEnabled=true'"
fi

if grep -qx 'android.enableShrinkResourcesInReleaseBuilds=true' "$PROPS"; then
  echo "::warning::shrinkResources is enabled. React Native looks up drawable assets by name at runtime; check images in a release build."
fi

echo "R8 settings OK"
grep -n "minifyEnabled\|shrinkResources\|proguardFiles" "$BUILD_GRADLE" || true
