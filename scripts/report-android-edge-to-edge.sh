#!/usr/bin/env bash
# Play Console 의 "앱에서 더 넓은 화면용으로 지원 중단된 API 또는 파라미터를 사용합니다" 경고 대상을
# 빌드한 APK 의 DEX 에서 직접 찾아 Step Summary 에 보여 준다.
#   - Android 15 에서 지원 중단된 Window.(get|set)StatusBarColor, (get|set)NavigationBarColor,
#     (get|set)NavigationBarDividerColor 호출과
#     layoutInDisplayCutoutMode 에 ALWAYS 가 아닌 값(DEFAULT, SHORT_EDGES 등)을 넣는 곳을 찾는다.
#   - Play Console 은 난독화된 이름(예: b3.b.runGuarded)으로 보여 주므로, 같은 DEX 이름과
#     mapping.txt 로 푼 원래 코드(예: StatusBarModule$setColor$1.runGuarded)를 나란히 적는다.
#   - Play 는 SDK 버전 분기와 상관없이 DEX 에 남은 호출을 모두 잡으므로, 여기서도 실행 여부는 따지지 않는다.
#   - 정보 표시용이다. 찾은 것이 있어도, dexdump 가 없어도 실패하지 않는다.
#     layoutInDisplayCutoutMode 값은 같은 메서드 안의 상수 대입으로 추정한다.
#
# 사용법: bash scripts/report-android-edge-to-edge.sh <apk> <mapping.txt>
set -euo pipefail

APK=${1:?usage: report-android-edge-to-edge.sh <apk> <mapping.txt>}
MAPPING=${2:?usage: report-android-edge-to-edge.sh <apk> <mapping.txt>}
SUMMARY=${GITHUB_STEP_SUMMARY:-/dev/null}

SDK=${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}
DEXDUMP=${DEXDUMP:-}
if [ -z "$DEXDUMP" ] && [ -n "$SDK" ]; then
  DEXDUMP=$(find "$SDK/build-tools" -maxdepth 2 -name dexdump -type f 2> /dev/null | sort -V | tail -n1 || true)
fi
if [ -z "$DEXDUMP" ] || [ ! -x "$DEXDUMP" ]; then
  echo "::warning::dexdump not found under \$ANDROID_HOME/build-tools; skipping the edge-to-edge API report"
  exit 0
fi
[ -s "$MAPPING" ] || MAPPING=/dev/null

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

unzip -q -o "$APK" 'classes*.dex' -d "$TMP/dex"

cat > "$TMP/scan.py" << 'PY'
import re
import sys

dexdump_path, mapping_path, summary_path = sys.argv[1:4]

WINDOW_API = re.compile(r"Landroid/view/Window;\.((?:set|get)(?:StatusBar|NavigationBar|NavigationBarDivider)Color):")
CUTOUT_FIELD = "Landroid/view/WindowManager$LayoutParams;.layoutInDisplayCutoutMode:I"
CUTOUT_MODES = {0: "DEFAULT", 1: "SHORT_EDGES", 2: "NEVER", 3: "ALWAYS"}

CLASS_LINE = re.compile(r"^\s+Class descriptor\s+: 'L(.+);'$")
NAME_LINE = re.compile(r"^\s+name\s+: '(.+)'$")
CODE_START = re.compile(r"\|\[[0-9a-f]+\] ")
INSN = re.compile(r"\|([0-9a-f]{4,}): (\S+) (.*)$")
CONST = re.compile(r"^v(\d+), #(?:int|long) (-?\d+)")
POSITION = re.compile(r"^\s+0x([0-9a-f]+) line=(\d+)$")

# --- mapping.txt ------------------------------------------------------------
MAP_CLASS = re.compile(r"^(\S+) -> (\S+):$")
MAP_METHOD = re.compile(r"^\s+(?:(\d+):(\d+):)?\S+ ([^\s(]+)\([^)]*\)(?::\d+(?::\d+)?)? -> (\S+)$")

classes = {}  # obfuscated class -> original class
methods = {}  # (obfuscated class, obfuscated method) -> [(start, end, original method)]
current = None
with open(mapping_path, encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.rstrip("\n")
        if not line or line.lstrip().startswith("#"):
            continue
        m = MAP_CLASS.match(line)
        if m:
            original, current = m.group(1), m.group(2)
            classes[current] = original
            continue
        m = MAP_METHOD.match(line)
        if m and current:
            start, end, name, obf = m.groups()
            if "." not in name:
                name = f"{classes[current]}.{name}"
            span = (int(start), int(end)) if start else None
            methods.setdefault((current, obf), []).append((span, name))


def short(name):
    """패키지를 줄인 이름: com.facebook.react.modules.statusbar.StatusBarModule.x -> StatusBarModule.x"""
    owner, _, method = name.rpartition(".")
    return f"{owner.rpartition('.')[2]}.{method}" if owner else name


def retrace(cls, method, line):
    """DEX 위치를 원래 호출 경로(바깥 -> 안쪽)와 호출이 실제로 들어 있는 메서드 이름으로 푼다.
    줄 정보로 찾지 못하면 그 메서드에 합쳐진(inline) 후보를 모두 보여 준다."""
    entries = methods.get((cls, method), [])
    if line is not None:
        # mapping.txt 는 같은 줄 범위의 프레임을 안쪽(인라인된 쪽)부터 적는다.
        frames = [name for span, name in entries if span and span[0] <= line <= span[1]]
        if frames:
            return " → ".join(short(name) for name in reversed(frames)), frames[0]
    names = list(dict.fromkeys(name for _, name in entries))
    if not names:
        original = f"{classes.get(cls, cls)}.{method}"
        return short(original), original
    if len(names) == 1:
        return short(names[0]), names[0]
    shown = ", ".join(short(name) for name in names[:6])
    more = f" 외 {len(names) - 6}개" if len(names) > 6 else ""
    return f"다음 중 하나: {shown}{more}", names[0]


# --- dexdump -d ---------------------------------------------------------------
results = {}  # (dex location, retraced path, original method) -> set(api)
state = {"cls": None, "name": None, "method": None, "hits": [], "consts": {}, "positions": []}


def flush():
    method = state["method"]
    if method and state["hits"]:
        cls, name = method
        positions = sorted(state["positions"])
        for pc, api in state["hits"]:
            line = None
            for addr, ln in positions:
                if addr > pc:
                    break
                line = ln
            path, original = retrace(cls, name, line)
            results.setdefault((f"{cls}.{name}", path, original), set()).add(api)
    state.update(method=None, hits=[], consts={}, positions=[])


with open(dexdump_path, encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.rstrip("\n")
        m = CLASS_LINE.match(line)
        if m:
            flush()
            state["cls"] = m.group(1).replace("/", ".")
            continue
        m = NAME_LINE.match(line)
        if m:
            flush()
            state["name"] = m.group(1)
            continue
        if CODE_START.search(line):
            flush()
            state["method"] = (state["cls"], state["name"])
            continue
        if state["method"] is None:
            continue
        m = POSITION.match(line)
        if m:
            state["positions"].append((int(m.group(1), 16), int(m.group(2))))
            continue
        m = INSN.search(line)
        if not m:
            continue
        pc, op, args = int(m.group(1), 16), m.group(2), m.group(3)
        if op.startswith("const"):
            c = CONST.match(args)
            if c:
                state["consts"].setdefault(int(c.group(1)), set()).add(int(c.group(2)))
        elif op.startswith("invoke"):
            w = WINDOW_API.search(args)
            if w:
                state["hits"].append((pc, f"Window.{w.group(1)}"))
        elif op.startswith("iput") and CUTOUT_FIELD in args:
            reg = int(re.match(r"v(\d+)", args).group(1))
            values = state["consts"].get(reg)
            if not values:
                state["hits"].append((pc, "layoutInDisplayCutoutMode (값 추정 불가)"))
            for value in sorted(values or ()):
                if value != 3:
                    mode = CUTOUT_MODES.get(value, str(value))
                    state["hits"].append((pc, f"LAYOUT_IN_DISPLAY_CUTOUT_MODE_{mode}"))
flush()

rows = sorted(results.items(), key=lambda item: (item[0][2], item[0][0]))
print(f"Deprecated edge-to-edge API call sites: {len(rows)}")
for (location, path, _), apis in rows:
    print(f"  {location}  [{path}]  {', '.join(sorted(apis))}")

with open(summary_path, "a", encoding="utf-8") as out:
    out.write("### Play Console: 더 넓은 화면용으로 지원 중단된 API (Android 15)\n\n")
    if not rows:
        out.write("DEX 에서 찾은 호출이 없습니다.\n")
    else:
        out.write(
            f"DEX 에 남은 호출 {len(rows)}곳. Play Console 의 \"시작 위치\"에는 왼쪽 이름이 보입니다. "
            "React Native·Material·AndroidX 안의 호출은 Android 14 이하에서 쓰이므로 그대로 둡니다. "
            "앱 코드나 새로 추가한 라이브러리가 보이면 확인하세요 (docs/android-deployment.md 4.7).\n\n"
        )
        out.write("| DEX 위치 (Play 표시) | 원래 코드 (mapping.txt) | API |\n|---|---|---|\n")
        for (location, path, original), apis in rows:
            out.write(f"| `{location}` | `{path}`<br><sub>{original}</sub> | {'<br>'.join(sorted(apis))} |\n")
    out.write("\n")
PY

set +o pipefail
for dex in "$TMP"/dex/classes*.dex; do
  "$DEXDUMP" -d "$dex" 2> /dev/null
done | grep -E "Class descriptor|^ +name +: '|\|\[[0-9a-f]+\] |\|[0-9a-f]{4,}: (const|invoke-[a-z/]+ .*Landroid/view/Window;\.|iput .*layoutInDisplayCutoutMode)|^ +0x[0-9a-f]+ line=" > "$TMP/dexdump.txt" || true
set -o pipefail

python3 -I "$TMP/scan.py" "$TMP/dexdump.txt" "$MAPPING" "$SUMMARY"
