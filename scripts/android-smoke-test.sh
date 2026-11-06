#!/usr/bin/env bash
# R8 로 빌드한 릴리스 APK 를 에뮬레이터(또는 연결된 기기)에서 실행해 보는 스모크 테스트.
#
# v1.6.2~v1.6.5 에서는 R8 을 켠 빌드가 실기기에서만 DB 를 열지 못했고(Record 인자 변환 NPE),
# 출시한 뒤에야 알게 되었다. 릴리스 빌드에서만 드러나는 문제를 Play 업로드·Release 생성 전에
# 잡기 위해 아래를 확인한다.
#   1. 앱을 실행해 홈 화면("카테고리를 선택해주세요")이 뜨는지 — DB 열기·카테고리·통계 조회
#      홈의 오류 화면("오류 정보")이 뜨면 화면의 오류 문구를 출력하고 실패한다.
#   2. 딥링크로 카테고리 · 통계 · 풀이 이력 · 학습 가이드 화면을 차례로 열어도 앱이 살아 있는지
#   3. logcat 에 앱 크래시, 네이티브 함수 호출 거부(expo 인자 변환 실패), DB 조회 오류가 없는지
#
# 사용법: bash scripts/android-smoke-test.sh <apk> [출력 디렉터리 (기본값: smoke-output)]
# CI 에서는 reactivecircus/android-emulator-runner 의 script 로 실행한다.
set -uo pipefail

APK=${1:?usage: android-smoke-test.sh <apk> [output dir]}
OUT=${2:-smoke-output}
PKG=com.swpark3179.quizbank
SCHEME=quizbank
HOME_TEXT='카테고리를 선택해주세요'
ERROR_TEXT='오류 정보'
HOME_TIMEOUT=${SMOKE_HOME_TIMEOUT:-120}
SCREEN_WAIT=${SMOKE_SCREEN_WAIT:-8}
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)

mkdir -p "$OUT"
FAILURES=()

log() { echo "[smoke] $*"; }
fail() {
  echo "::error::[smoke] $1"
  FAILURES+=("$1")
}

app_alive() { adb shell pidof "$PKG" > /dev/null 2>&1; }

# 시스템 대화상자(ANR 안내 등)가 화면을 가리면 UI dump 가 앱 화면을 못 읽으므로 먼저 닫는다.
close_system_dialogs() {
  adb shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS > /dev/null 2>&1 || true
}

dump_ui() {
  local name=$1 remote=/sdcard/smoke-ui.xml
  adb shell rm -f "$remote" > /dev/null 2>&1
  timeout 30 adb shell uiautomator dump "$remote" > /dev/null 2>&1 || return 1
  timeout 15 adb pull "$remote" "$OUT/ui-$name.xml" > /dev/null 2>&1 || return 1
}

ui_texts() {
  grep -o 'text="[^"]*"' "$1" 2> /dev/null | sed -e 's/^text="//' -e 's/"$//' | grep -v '^$'
}

screenshot() {
  timeout 30 adb exec-out screencap -p > "$OUT/$1.png" 2> /dev/null || rm -f "$OUT/$1.png"
}

save_logcat() {
  adb logcat -d -v threadtime > "$OUT/logcat.txt" 2> /dev/null || true
}

finish() {
  save_logcat
  if [ -f "$OUT/logcat.txt" ]; then
    check_logcat "$OUT/logcat.txt"
  fi

  local summary=${GITHUB_STEP_SUMMARY:-/dev/null}
  if [ ${#FAILURES[@]} -eq 0 ]; then
    log "PASSED"
    echo "### Android smoke test: passed" >> "$summary"
    exit 0
  fi

  log "FAILED (${#FAILURES[@]})"
  {
    echo "### Android smoke test: failed"
    for f in "${FAILURES[@]}"; do echo "- $f"; done
    echo
    echo "logcat · 스크린샷 · UI dump 는 smoke-output artifact 에 있습니다."
  } >> "$summary"
  exit 1
}

check_logcat() {
  local logcat=$1 matches

  # 앱 프로세스의 Java 크래시 / 네이티브 크래시
  if grep -A1 'FATAL EXCEPTION' "$logcat" | grep -q "Process: $PKG"; then
    fail "app crashed (FATAL EXCEPTION)"
    grep -A25 'FATAL EXCEPTION' "$logcat" | head -60
  fi
  if grep -qE "Fatal signal .*\($PKG\)|>>> $PKG <<<" "$logcat"; then
    fail "app crashed (native signal)"
    grep -E -A5 "Fatal signal .*\($PKG\)" "$logcat" | head -30
  fi

  # expo 네이티브 함수 호출 실패 (R8 때문에 인자 변환이 깨지면 이렇게 나온다)
  #   Call to function 'NativeDatabase.constructor' has been rejected.
  #   → Caused by: The 2nd argument cannot be cast to type ...
  matches=$(grep -E 'has been rejected|cannot be cast to type' "$logcat" | head -20)
  if [ -n "$matches" ]; then
    fail "native module call rejected (see logcat)"
    echo "$matches"
  fi

  # DB 를 쓰는 화면의 로드 오류 (app/index.tsx, app/[category]/index.tsx 의 console.error)
  matches=$(grep -E '카테고리 로드 오류|파일 목록 로드 오류|요약 통계 로드 오류' "$logcat" | head -20)
  if [ -n "$matches" ]; then
    fail "screen load error logged by the app (see logcat)"
    echo "$matches"
  fi

  # 그 밖의 JS 오류는 네트워크 상태(GitHub 의 config 다운로드 등)에 따라서도 나므로 실패로 보지 않고 보여만 준다.
  matches=$(grep -E ' E ReactNativeJS' "$logcat" | head -20)
  if [ -n "$matches" ]; then
    echo "::warning::[smoke] JS errors in logcat (not treated as failures):"
    echo "$matches"
  fi
}

[ -f "$APK" ] || { fail "APK not found: $APK"; exit 1; }

log "device: $(adb shell getprop ro.product.model | tr -d '\r') / API $(adb shell getprop ro.build.version.sdk | tr -d '\r') / $(adb shell getprop ro.product.cpu.abi | tr -d '\r')"
adb logcat -G 16M > /dev/null 2>&1 || true

log "install $APK"
if ! adb install -r -g "$APK"; then
  fail "adb install failed"
  finish
fi

adb logcat -c || true
log "launch $PKG"
adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1

# 1. 홈 화면
home_ok=false
deadline=$((SECONDS + HOME_TIMEOUT))
while [ $SECONDS -lt $deadline ]; do
  sleep 3
  if ! app_alive; then
    fail "app process died during launch"
    break
  fi
  close_system_dialogs
  dump_ui home || continue
  if grep -qF "$HOME_TEXT" "$OUT/ui-home.xml"; then
    home_ok=true
    break
  fi
  if grep -qF "$ERROR_TEXT" "$OUT/ui-home.xml"; then
    sleep 2
    dump_ui home || true
    fail "home screen shows the load error screen"
    echo "---- home screen text ----"
    ui_texts "$OUT/ui-home.xml"
    echo "--------------------------"
    break
  fi
done
screenshot 01-home
if [ "$home_ok" = true ]; then
  log "home screen OK"
elif [ ${#FAILURES[@]} -eq 0 ]; then
  fail "home screen did not appear within ${HOME_TIMEOUT}s"
  [ -f "$OUT/ui-home.xml" ] && ui_texts "$OUT/ui-home.xml"
fi

# 2. 딥링크로 다른 화면 열기 (홈이 떴을 때만)
if [ "$home_ok" = true ]; then
  CATEGORY=$(python3 - "$REPO_ROOT/assets/quiz-data/config.json" << 'PY'
import json, sys
cats = json.load(open(sys.argv[1], encoding="utf-8"))
cats.sort(key=lambda c: c.get("order", 0))
print(cats[0]["id"])
PY
  )
  step=2
  for route in "$CATEGORY" "stats/$CATEGORY" "history?from=main" "guide"; do
    name=$(printf '%02d-%s' "$step" "$(echo "$route" | tr '/?=&' '----')")
    step=$((step + 1))
    log "open $SCHEME:///$route"
    adb shell "am start -W -a android.intent.action.VIEW -d '$SCHEME:///$route' $PKG" > /dev/null 2>&1
    sleep "$SCREEN_WAIT"
    if ! app_alive; then
      fail "app process died after opening /$route"
      screenshot "$name"
      break
    fi
    close_system_dialogs
    screenshot "$name"
    dump_ui "$name" || true
  done
fi

finish
