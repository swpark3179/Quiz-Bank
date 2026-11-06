#!/usr/bin/env bash
# R8 이 실제로 돌았는지 확인하고, Play Console 이 "DEX 코드 최적화"를 계산할 때 쓰는
# r8.json(AAB 의 BUNDLE-METADATA/com.android.tools/r8.json)을 Step Summary 에 보여 준다.
#   - mapping.txt 가 없으면 minify 가 꺼진 것이므로 실패한다.
#   - r8.json 이 없으면 경고만 낸다. 값은 형식이 AGP 버전마다 다를 수 있어 그대로 보여 주기만 하고,
#     세 비율이 25% 이상인지는 Summary 를 보고(또는 Play Console 에서) 확인한다.
#
# 사용법: bash scripts/report-android-r8.sh <aab> <mapping.txt>
set -euo pipefail

AAB=${1:?usage: report-android-r8.sh <aab> <mapping.txt>}
MAPPING=${2:?usage: report-android-r8.sh <aab> <mapping.txt>}
SUMMARY=${GITHUB_STEP_SUMMARY:-/dev/null}
R8_JSON_ENTRY=BUNDLE-METADATA/com.android.tools/r8.json

if [ ! -s "$MAPPING" ]; then
  echo "::error::R8 mapping file not found ($MAPPING) — minify did not run"
  exit 1
fi
echo "mapping.txt: $(wc -l < "$MAPPING") lines"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

if ! unzip -p "$AAB" "$R8_JSON_ENTRY" > "$TMP/r8.json" 2> /dev/null || [ ! -s "$TMP/r8.json" ]; then
  echo "::warning::$R8_JSON_ENTRY not found in $AAB. Play Console estimates the obfuscation ratio from mapping.txt instead."
  {
    echo "### R8"
    echo "- mapping.txt: $(wc -l < "$MAPPING") lines"
    echo "- r8.json: not found in the AAB"
  } >> "$SUMMARY"
  exit 0
fi

python3 -I - "$TMP/r8.json" "$SUMMARY" << 'PY'
import json
import re
import sys

path, summary_path = sys.argv[1], sys.argv[2]
with open(path, encoding="utf-8") as f:
    data = json.load(f)

KEY = re.compile(r"optimi|obfusc|shrink|percent", re.IGNORECASE)
found = []

def walk(node, prefix=""):
    if isinstance(node, dict):
        for k, v in node.items():
            p = f"{prefix}.{k}" if prefix else k
            if isinstance(v, (int, float, str, bool)) and KEY.search(p):
                found.append((p, v))
            walk(v, p)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{prefix}[{i}]")

walk(data)

for key, value in found:
    print(f"{key} = {value}")

pretty = json.dumps(data, indent=2, ensure_ascii=False)
with open(summary_path, "a", encoding="utf-8") as out:
    out.write("### R8 (r8.json)\n")
    if found:
        out.write("| key | value |\n|---|---|\n")
        for key, value in found:
            out.write(f"| `{key}` | {value} |\n")
    else:
        out.write("No optimization/obfuscation/shrinking keys found; see the full file below.\n")
    out.write("\n<details><summary>r8.json</summary>\n\n```json\n")
    out.write(pretty[:60000])
    out.write("\n```\n</details>\n")
PY
