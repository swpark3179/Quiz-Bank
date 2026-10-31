# Android 배포 가이드

문제은행 Android 앱을 배포하는 절차를 정리한 문서입니다. 서명에는 저장소에 이미 등록된 **GitHub Secrets 의 release keystore** 를 사용합니다.

배포 경로는 두 가지입니다.

| 경로 | 산출물 | 상태 | 설명 |
|------|--------|------|------|
| **A. GitHub Release** | `app-release.apk` | ✅ 자동화됨 | Actions 워크플로 실행 → 릴리스에 APK 첨부 → 사용자가 직접 설치 |
| **B. Google Play** | `app-release.aab` | ✅ 빌드 자동화 · 업로드는 수동 | 같은 워크플로가 release keystore(**업로드 키**)로 서명한 AAB 를 릴리스에 함께 첨부 → Play Console 에 업로드 |

> [!IMPORTANT]
> **v1.5.1 까지의 APK 는 공개된 debug 키로 서명되어 있었습니다.** 워크플로를 고쳐 **다음 릴리스부터는 APK·AAB 모두 `ANDROID_KEYSTORE_BASE64` 의 release keystore 로 서명**하고, 빌드 중에 서명을 검증합니다. 서명 키가 바뀌므로 v1.5.1 이하 사용자는 한 번 삭제 후 재설치해야 합니다. ([3. release 서명 전환](#3-release-서명-전환))

> 문제(콘텐츠)만 바뀐 경우에는 앱을 다시 배포할 필요가 없습니다. `assets/quiz-data/` 를 `master` 에 Push 하면 바로 반영됩니다. ([README — 문제 관리](../README.md#-문제-관리-github-을-db-로-쓰는-법))

---

## 목차

1. [기본 정보](#1-기본-정보)
2. [사용하는 GitHub Secrets](#2-사용하는-github-secrets)
3. [release 서명 전환](#3-release-서명-전환)
4. [A. GitHub Release 로 APK 배포](#4-a-github-release-로-apk-배포)
5. [버전 관리](#5-버전-관리)
6. [B. Google Play 배포](#6-b-google-play-배포)
7. [배포 전 체크리스트](#7-배포-전-체크리스트)
8. [문제 해결](#8-문제-해결)
9. [참고 자료](#9-참고-자료)

---

## 1. 기본 정보

| 항목 | 값 | 정의 위치 |
|------|----|-----------|
| 패키지명 (applicationId) | `com.swpark3179.quizbank` | `app.json` → `expo.android.package` |
| 앱 이름 | 문제은행 | `app.json` → `expo.name` |
| versionName | `expo.version` (예: `1.5.1`) | `app.json` |
| versionCode | `expo.android.versionCode` (정수) | `app.json` |
| minSdk / compileSdk / targetSdk | 24 / 36 / 36 | react-native `0.81.5` 버전 카탈로그 기본값 |
| 빌드 방식 | `expo prebuild` → Gradle (`assembleRelease` + `bundleRelease`) | EAS Build(Expo Cloud) 미사용 |
| 워크플로 | `.github/workflows/native-build-testflight.yml` 의 `build-android` 잡 | |

- `android/` 폴더는 CI 에서 `expo prebuild --clean` 으로 매번 새로 만들어지며 `.gitignore` 대상입니다. **네이티브 설정은 `android/` 가 아니라 `app.json` 에서 바꿉니다.**
- Gradle 메모리 옵션(`org.gradle.jvmargs`)은 `app.json` 의 `expo-build-properties` 플러그인 설정으로 넣고 있습니다.

---

## 2. 사용하는 GitHub Secrets

`Settings → Secrets and variables → Actions` 에 아래 값이 등록되어 있어야 합니다.

| Secret | 내용 | 사용 단계 |
|--------|------|-----------|
| `ANDROID_KEYSTORE_BASE64` | release keystore 파일을 base64 로 인코딩한 값 | `Decode keystore` → `android/app/release.keystore` 로 복원 |
| `ANDROID_KEYSTORE_PASSWORD` | keystore(store) 비밀번호 | `Configure gradle signing` → `MYAPP_RELEASE_STORE_PASSWORD`, `Verify release signing` |
| `ANDROID_KEY_ALIAS` | keystore 안의 key alias | `Configure gradle signing` → `MYAPP_RELEASE_KEY_ALIAS`, `Verify release signing` |
| `ANDROID_KEY_PASSWORD` | key 비밀번호 | `Configure gradle signing` → `MYAPP_RELEASE_KEY_PASSWORD` |
| `RELEASE_APP_ID` | 릴리스용 GitHub App ID | `bump-version` — 버전 커밋·태그 push |
| `RELEASE_APP_PRIVATE_KEY` | 위 GitHub App 의 private key | `bump-version` — 버전 커밋·태그 push |
| `GITHUB_TOKEN` | (자동 제공) | `create-release` — Release 생성 |

`RELEASE_APP_*` 는 `master` 브랜치 보호 룰셋(PR 필수)을 우회해 버전 bump 커밋을 직접 push 하기 위한 값입니다. 해당 GitHub App 이 저장소에 설치되어 있고 룰셋의 **Bypass list** 에 들어 있어야 합니다.

### ⚠️ keystore 보관 원칙

- **GitHub Secrets 는 등록 후 값을 다시 읽을 수 없습니다.** 원본 keystore 파일과 비밀번호·alias 는 비밀번호 관리자 등 저장소 밖 안전한 곳에 반드시 따로 보관하세요.
- v1.5.1 다음 릴리스부터는 이 keystore 로 서명된 APK·AAB 가 배포됩니다([3장](#3-release-서명-전환)). 그 뒤로 keystore 를 잃어버리거나 교체하면 **기존 사용자에게 덮어쓰기 업데이트를 할 수 없습니다.** (앱을 삭제 후 재설치해야 하고, 기기 안의 풀이 기록도 함께 지워집니다.)
- keystore 파일은 저장소 폴더 밖에 두세요. `.gitignore` 에는 `*.jks` 만 있고 `*.keystore` 는 없습니다.

### keystore 확인 · 시크릿 재등록

원본 keystore 의 alias 와 인증서 지문(SHA-1 / SHA-256)을 확인합니다. APK 서명이나 Play Console 의 업로드 키 인증서와 비교할 때 이 값을 씁니다.

```bash
keytool -list -v -keystore release.keystore -alias <ALIAS>
```

시크릿을 다시 넣어야 할 때는 **줄바꿈 없는 base64** 로 인코딩합니다.

```bash
# Linux
base64 -w 0 release.keystore | gh secret set ANDROID_KEYSTORE_BASE64

# macOS
base64 -i release.keystore | tr -d '\n' | gh secret set ANDROID_KEYSTORE_BASE64
```

```powershell
# Windows PowerShell (클립보드로 복사 후 웹 UI 에 붙여넣기)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Set-Clipboard
```

> keytool 기본 형식인 **PKCS12** keystore 는 key 비밀번호가 store 비밀번호와 같습니다. 이 경우 `ANDROID_KEY_PASSWORD` 에도 `ANDROID_KEYSTORE_PASSWORD` 와 같은 값을 넣습니다.

원본 keystore 가 없어 새로 만들어야 한다면 아래 명령을 씁니다. 만든 뒤에는 위 4개 `ANDROID_*` 시크릿을 모두 다시 등록합니다. release 서명 빌드를 **처음 배포하기 전**이라면 v1.5.1 이하가 어차피 debug 키로 서명되어 있으므로 추가 손해가 없지만, 그 뒤에 keystore 를 바꾸면 사용자가 또 한 번 재설치해야 합니다.

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore release.keystore -alias <ALIAS> \
  -keyalg RSA -keysize 2048 -validity 10000
```

---

## 3. release 서명 전환

> ✅ **적용 완료** — `ANDROID_KEYSTORE_BASE64` 를 release keystore 로 교체하고, 워크플로가 이 keystore 로 서명하도록 수정했습니다. v1.5.1 다음 릴리스가 첫 release 서명 빌드입니다.

### 3.1 v1.5.1 까지의 문제

v1.5.1 릴리스의 `app-release.apk` 는 React Native / Expo 템플릿에 기본으로 들어 있는 **debug.keystore** 로 서명되어 있습니다.

```
CN=Android Debug, OU=Android, O=Unknown, L=Unknown, ST=Unknown, C=US
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

**원인** — `Configure gradle signing` 단계의 Node 스크립트는 `signingConfigs` 에 `release` 설정을 추가했지만, `buildTypes.release` 를 바꾸는 부분이 동작하지 않았습니다. Expo 템플릿의 `buildTypes.release` 에는 처음부터 `signingConfig signingConfigs.debug` 줄이 있어서 `inner.includes('signingConfig')` 조건에 걸려 그대로 반환되었기 때문입니다. 그 결과 keystore 는 복원만 되고 서명에는 쓰이지 않았습니다.

**영향**

- debug.keystore 는 모든 React Native 프로젝트에 같은 파일로 들어 있는 **공개 키**입니다. 누구나 같은 패키지명과 같은 서명으로 "업데이트" APK 를 만들 수 있습니다.
- Google Play 는 debug 서명 빌드를 거부합니다.

### 3.2 워크플로 수정

`native-build-testflight.yml` 의 `build-android` 잡에 아래 두 가지를 반영했습니다.

**① `Configure gradle signing` — release 서명 주입 수정**

`buildTypes.release` 에 `signingConfig` 줄이 있으면 `signingConfigs.release` 로 **교체**하고, 없으면 추가합니다. 주입 후에는 결과를 다시 검사해, `signingConfigs.release` 블록이나 `buildTypes.release` 의 서명 설정이 빠졌으면 Gradle 빌드(약 20분)를 돌리기 전에 바로 실패합니다. 로그에는 `build.gradle` 의 `signingConfig` 줄이 출력됩니다.

```js
const SIGNING_LINE = /signingConfig\s+signingConfigs\.\w+/;
const RELEASE_BUILD_TYPE = /(buildTypes\s*\{[\s\S]*?release\s*\{)([\s\S]*?)(\})/;
g = g.replace(RELEASE_BUILD_TYPE, (m, head, inner, tail) => {
    const next = SIGNING_LINE.test(inner)
        ? inner.replace(SIGNING_LINE, 'signingConfig signingConfigs.release')
        : `${inner}    signingConfig signingConfigs.release\n        `;
    return head + next + tail;
});
```

정상이라면 `Configure gradle signing` 로그 끝에 아래처럼 나옵니다. (줄 번호는 다를 수 있고, debug 빌드 타입은 그대로 debug 키를 씁니다)

```
signingConfig lines in android/app/build.gradle:
119:            signingConfig signingConfigs.debug
124:            signingConfig signingConfigs.release
```

**② `Verify release signing` — 서명 검증 단계 추가**

APK·AAB 를 만든 뒤, 아래 세 SHA-256 인증서 지문이 모두 같은지 비교합니다. 다르거나 `CN=Android Debug` 가 보이면 잡이 실패하므로 debug 서명 빌드가 릴리스에 올라가지 않습니다.

| 대상 | 확인 방법 |
|------|-----------|
| release keystore | `keytool -list -v` (`ANDROID_KEYSTORE_PASSWORD` · `ANDROID_KEY_ALIAS` 사용) |
| `app-release.apk` | `apksigner verify --print-certs` (minSdk 24 라 v2/v3 서명만 있음) |
| `app-release.aab` | `jarsigner -verify` 로 무결성 확인 후 `keytool -printcert -jarfile` |

> Expo SDK 54 의 `expo-template-bare-minimum`(54.0.54) `build.gradle` 에 ① 을 적용해 `buildTypes.release` 가 `signingConfig signingConfigs.release` 로 바뀌는 것을 확인했습니다. Expo SDK 를 올린 뒤에는 첫 빌드에서 ① 의 로그와 ② 의 결과를 다시 확인하세요.

### 3.3 첫 release 서명 빌드 확인

등록된 `ANDROID_KEYSTORE_PASSWORD` · `ANDROID_KEY_ALIAS` · `ANDROID_KEY_PASSWORD` 는 v1.5.1 까지 실제 서명에 쓰인 적이 없으므로, 전환 후 첫 실행에서 다음을 확인합니다.

1. `Build release APK & AAB` 가 서명 오류 없이 끝나는지 — 오류가 나면 [8. 문제 해결](#8-문제-해결) 의 keystore 관련 항목을 봅니다.
2. `Verify release signing` 로그의 `release keystore SHA-256` 이 로컬 원본 keystore 의 `keytool -list -v` 결과(콜론·대소문자 무시)와 같은지 — 같으면 시크릿에 올바른 keystore 가 들어 있는 것입니다.
3. 릴리스에 `app-release.apk` · `app-release.aab` 가 함께 첨부되었는지.

### 3.4 기존 사용자에게 미치는 영향

전환 후 처음 배포하는 APK 는 서명이 바뀌므로, v1.5.1 이하가 설치된 기기에서는 **덮어쓰기 설치가 되지 않습니다.**

- 사용자는 기존 앱을 **한 번 삭제한 뒤** 새 APK 를 설치해야 하며, 이때 기기 안의 풀이 기록·통계가 지워집니다.
- 워크플로가 만드는 릴리스 본문에 **"v1.5.1 이하 버전에서 업데이트하는 경우 기존 앱 삭제 후 설치"** 안내가 자동으로 들어갑니다. 기존 사용자가 충분히 옮겨 간 뒤에는 `create-release` 단계의 release-notes 에서 이 문단을 빼도 됩니다.
- 한 번 바꾸고 나면 그 뒤 버전부터는 다시 덮어쓰기 업데이트가 됩니다.
- Google Play 배포도 계획 중이라면, 서명 전환과 Play 출시를 같은 시기에 묶어 사용자가 재설치를 한 번만 겪게 하는 편이 좋습니다. ([6.3](#63-앱-서명-키-결정-첫-업로드-전에))

---

## 4. A. GitHub Release 로 APK 배포

현재 자동화되어 있는 기본 배포 경로입니다.

### 4.1 실행

1. GitHub 저장소 → **Actions** → **App Build & Release — Android APK · iOS TestFlight (Main)**
2. **Run workflow** → Branch: `master`
3. 입력값 선택
   - `version_bump`: `patch` / `minor` / `major` ([버전 관리](#5-버전-관리) 참고)
   - `upload_testflight`: iOS TestFlight 업로드 여부 (Android 와는 무관)
4. **Run workflow** 클릭

CLI 로도 실행할 수 있습니다.

```bash
gh workflow run native-build-testflight.yml -f version_bump=patch -f upload_testflight=true
```

### 4.2 워크플로 흐름

```
bump-version ──┬─▶ build-android ─────────────────────┐
               │                                      ├─▶ create-release (APK + AAB + IPA 첨부)
               └─▶ build-ios ──┬──────────────────────┘
                               └─▶ submit-testflight (선택)

워크플로 전체 성공 후 ─▶ Windows Desktop Release (workflow_run 으로 자동 실행)
```

`build-android` 잡의 단계는 다음과 같습니다. (지난 실행 기준 약 20분, 대부분 Gradle 빌드 시간)

| 단계 | 내용 |
|------|------|
| Checkout tagged code | `bump-version` 이 만든 `vX.Y.Z` 태그를 체크아웃 |
| Setup Java / Android SDK | Temurin JDK 17, `platform-tools` 설치 |
| Install dependencies | `pnpm install --frozen-lockfile` |
| Expo prebuild (android) | `expo prebuild --platform android --no-install --clean` 으로 `android/` 생성 |
| Decode keystore | `ANDROID_KEYSTORE_BASE64` → `android/app/release.keystore` |
| Configure gradle signing | `MYAPP_RELEASE_*` 값을 `android/gradle.properties` 에 추가하고, `android/app/build.gradle` 에 release 서명 설정을 주입. 주입이 안 되면 즉시 실패 ([3.2](#32-워크플로-수정)) |
| Build release APK & AAB | `./gradlew assembleRelease bundleRelease --no-daemon` — 한 번의 Gradle 실행으로 둘 다 생성 |
| Locate APK & AAB | `app-release.apk` · `app-release.aab` 로 복사 |
| Verify release signing | release keystore · APK · AAB 의 SHA-256 인증서 지문 비교. 다르거나 debug 서명이면 실패 ([3.2](#32-워크플로-수정)) |
| Upload APK / AAB artifact | `app-release-apk` · `app-release-aab` 아티팩트로 업로드 → `create-release` 가 받아 릴리스에 첨부 |

### 4.3 결과 확인

- **Releases** 페이지의 최신 릴리스에 `app-release.apk`(직접 설치용)와 `app-release.aab`(Google Play 업로드용)가 함께 첨부됩니다.
- 항상 최신 파일을 가리키는 고정 링크를 쓸 수 있습니다. 사용자에게는 APK 링크만 공유하세요.
  - APK: `https://github.com/swpark3179/Quiz-Bank/releases/latest/download/app-release.apk`
  - AAB: `https://github.com/swpark3179/Quiz-Bank/releases/latest/download/app-release.aab`
- 릴리스 본문에는 설치 안내, AAB 는 직접 설치할 수 없다는 안내, v1.5.1 이하 사용자 재설치 안내([3.4](#34-기존-사용자에게-미치는-영향))가 자동으로 들어갑니다.

서명은 워크플로의 `Verify release signing` 단계가 매번 확인합니다. 내려받은 파일을 직접 확인하려면 아래 명령을 씁니다. minSdk 가 24 라서 APK 에는 v2/v3 서명만 들어 있으므로 APK 는 `keytool -printcert -jarfile` 이 아니라 Android SDK build-tools 의 `apksigner` 로 봐야 합니다.

```bash
apksigner verify --print-certs app-release.apk
```

```bash
keytool -printcert -jarfile app-release.aab
```

- 출력된 SHA-256 이 `keytool -list -v` 로 본 release keystore 의 SHA-256 과 같아야 합니다.
- `CN=Android Debug` 가 보이면 debug 키로 서명된 것입니다. (v1.5.1 이하, [3장](#3-release-서명-전환))

### 4.4 실패했을 때 주의할 점

- **`bump-version` 은 맨 먼저 버전 커밋과 태그를 `master` 에 push 합니다.** 이후 빌드가 실패해도 버전은 이미 올라가 있습니다.
- 그래서 실패한 경우 워크플로를 새로 실행하지 말고, 해당 실행 화면에서 **Re-run failed jobs** 를 누르세요. 새로 실행하면 버전이 한 번 더 올라갑니다.
- `create-release` 는 Android 와 iOS 빌드가 **모두** 성공해야 실행됩니다. iOS 만 실패한 경우에도 APK·AAB 는 실행 화면의 **Artifacts → `app-release-apk` / `app-release-aab`** 에서 받을 수 있습니다. (아티팩트 기본 보관 기간 90일)
- 워크플로가 끝나면 로컬에서 `git pull` 로 버전 bump 커밋을 받아 두세요.

### 4.5 사용자 설치 · 업데이트

1. Android 기기에서 `app-release.apk` 를 다운로드합니다.
2. 브라우저(또는 파일 앱)에 **출처를 알 수 없는 앱 설치**를 허용합니다.
3. APK 를 열어 설치합니다. Play 프로텍트 경고가 뜨면 설치를 계속 진행합니다.

새 버전도 같은 방법으로 설치하면 기존 앱 위에 덮어써지고 풀이 기록이 유지됩니다. 서명 키가 같고 versionCode 가 더 크기 때문입니다. 단, 서명 키가 바뀌는 버전([3.4](#34-기존-사용자에게-미치는-영향))은 예외입니다.

`app-release.aab` 는 Google Play 업로드용이라 기기에서 열어도 설치되지 않습니다.

---

## 5. 버전 관리

| 값 | 의미 | 규칙 |
|----|------|------|
| `expo.version` → versionName | 사용자에게 보이는 버전 | `major.minor.patch` |
| `expo.android.versionCode` | 내부 빌드 번호 | 정수, **배포할 때마다 반드시 증가** |

`scripts/bump-version.js` 가 워크플로의 `bump-version` 단계에서 호출되며 다음을 처리합니다.

- `package.json` 과 `app.json` 의 `version` 을 함께 올립니다.
- iOS `buildNumber` 와 Android `versionCode` 중 큰 값에 1을 더해 **두 플랫폼에 같은 값**으로 기록합니다.

```bash
pnpm bump:patch   # 1.5.1 → 1.5.2   (버그 수정)
pnpm bump:minor   # 1.5.1 → 1.6.0   (기능 추가)
pnpm bump:major   # 1.5.1 → 2.0.0   (큰 변경)
```

- versionCode 를 손으로 낮추지 마세요. Android 는 더 낮은 versionCode 로의 덮어쓰기 설치를 막고, Google Play 는 이미 업로드된 versionCode 를 다시 받지 않습니다.
- 평소에는 로컬에서 bump 할 필요가 없습니다. 워크플로가 대신 실행합니다.

---

## 6. B. Google Play 배포

> 업로드할 AAB 는 [4장](#4-a-github-release-로-apk-배포) 의 워크플로가 APK 와 함께 만들어 릴리스에 첨부합니다. v1.5.1 이하 릴리스에는 AAB 가 없고 debug 키로 서명되어 있으므로, 그 다음 릴리스부터 사용합니다. ([3장](#3-release-서명-전환))

### 6.1 GitHub APK 배포와의 차이

- Google Play 신규 앱은 **AAB(Android App Bundle)** 만 받습니다. 워크플로가 APK 와 함께 AAB 를 빌드해 릴리스에 첨부합니다. ([6.4](#64-aab-빌드-같은-시크릿으로-서명))
- Play 는 **Play 앱 서명(Play App Signing)** 을 사용합니다.
  - **업로드 키**: 개발자가 AAB 에 서명할 때 쓰는 키 → 등록된 `ANDROID_KEYSTORE_*` 시크릿의 keystore 를 그대로 사용합니다.
  - **앱 서명 키**: 사용자 기기에 설치되는 APK 를 Google 이 서명할 때 쓰는 키 → [6.3](#63-앱-서명-키-결정-첫-업로드-전에) 에서 정합니다.

### 6.2 사전 준비

- [ ] **Google Play Console 개발자 계정** (등록비 US$25, 1회)
- [ ] **개인 계정 테스트 요건**: 2023년 11월 13일 이후 만든 개인 계정은 **비공개 테스트에 12명 이상이 14일 연속 참여**해야 프로덕션 액세스를 신청할 수 있습니다. (조직 계정은 해당 없음)
- [ ] **개인정보처리방침 URL**: 저장소의 [`Privacy Policy.md`](../Privacy%20Policy.md) 공개 주소
  `https://github.com/swpark3179/Quiz-Bank/blob/master/Privacy%20Policy.md`
- [ ] **스토어 등록정보 자료**
  - 앱 아이콘 512×512 PNG
  - 그래픽 이미지 1024×500
  - 휴대전화 스크린샷 2장 이상
  - 간단한 설명(80자 이내), 자세한 설명(4,000자 이내)
- [ ] **앱 콘텐츠 설문** (Play Console → 정책 → 앱 콘텐츠). 개인정보처리방침과 같은 내용으로 답합니다.
  - 광고: 없음
  - 앱 액세스 권한: 로그인 없이 모든 기능 사용 가능
  - 데이터 보안: 수집·공유하는 사용자 데이터 없음 (문제 콘텐츠만 GitHub 에서 내려받고, 풀이 기록은 기기 안 SQLite 에만 저장)
  - 콘텐츠 등급(IARC 설문), 타겟층
- [ ] **targetSdk 요건**: 2026년 8월 31일부터 신규 앱과 업데이트는 **API 36(Android 16) 이상**을 타겟해야 합니다. 현재 빌드는 react-native 0.81.5 기본값인 targetSdk 36 이므로 충족합니다. Expo SDK 를 올릴 때 다시 확인하세요.

### 6.3 앱 서명 키 결정 (첫 업로드 전에)

첫 버전을 업로드할 때 앱 서명 키를 고르며, **나중에 바꾸기 어렵습니다.** 이 선택에 따라 GitHub APK(release keystore 서명)와 Play 설치본이 서로 호환되는지가 갈립니다.

| | ① Google 생성 키 사용 (기본값) | ② 기존 keystore 를 앱 서명 키로 업로드 |
|--|--|--|
| 업로드 키 | release keystore (시크릿) | release keystore (시크릿) |
| 앱 서명 키 | Google 이 새로 생성 | release keystore 와 동일 |
| GitHub APK ↔ Play 설치본 | **서명이 달라 서로 덮어쓰기 업데이트 불가** | 서명이 같아 서로 업데이트 가능 |
| GitHub APK 사용자가 Play 로 이동 | 삭제 후 재설치 → **풀이 기록 삭제** | 기록을 유지한 채 Play 버전으로 업데이트 |
| 필요한 것 | 없음 | **원본 keystore 파일** (시크릿에서 꺼낼 수 없음) |
| 키 분실 시 | 업로드 키만 Play Console 에서 재설정 요청 | 업로드 키는 재설정 가능, 앱 서명 키는 Google 이 보관 |

- GitHub APK 배포를 계속 병행하거나, 사용자가 두 채널 사이를 기록 손실 없이 오가게 하려면 **②** 를 권장합니다.
- Play 를 주 배포 채널로 삼고 GitHub APK 는 정리할 계획이라면 **①** 이 간단합니다.
- 어느 쪽이든 v1.5.1 이하(debug 서명) 사용자는 한 번은 재설치가 필요합니다. ([3.4](#34-기존-사용자에게-미치는-영향))

②의 절차:

1. 첫 버전 만들기 화면의 앱 서명 단계에서 **다른 키 사용 → Java 키 저장소에서 키 내보내기 및 업로드** 를 선택합니다. (메뉴 이름은 Play Console 버전에 따라 다를 수 있습니다.)
2. 화면에서 PEPK 도구(`pepk.jar`)와 암호화용 공개 키를 내려받습니다.
3. 원본 keystore 가 있는 PC 에서 Play Console 이 보여 주는 `java -jar pepk.jar ...` 명령을 그대로 실행해 암호화된 키(zip)를 만듭니다.
4. 생성된 파일을 업로드합니다.

### 6.4 AAB 빌드 (같은 시크릿으로 서명)

AAB 는 [4장](#4-a-github-release-로-apk-배포) 의 워크플로(`build-android` 잡)가 APK 와 함께 만듭니다. 별도 작업은 필요 없습니다.

- `Build release APK & AAB` 단계에서 `./gradlew assembleRelease bundleRelease` 로 한 번에 빌드합니다. 컴파일 결과를 공유하므로 빌드 시간이 크게 늘지 않습니다.
- APK 와 같은 `ANDROID_KEYSTORE_*` 시크릿(= Play 의 **업로드 키**)으로 서명되며, `Verify release signing` 단계가 AAB 의 서명 인증서가 release keystore 와 같은지 확인합니다. ([3.2](#32-워크플로-수정))
- 결과는 두 곳에 남습니다.
  - **GitHub Release Assets** 의 `app-release.aab` — Play Console 에 올릴 때는 이 파일을 받으면 됩니다.
    최신 릴리스 고정 링크: `https://github.com/swpark3179/Quiz-Bank/releases/latest/download/app-release.aab`
  - 워크플로 실행 화면의 **Artifacts → `app-release-aab`** (zip, 보관 90일) — [6.7](#67-선택-play-업로드-자동화) 의 자동 업로드 잡이 이 아티팩트를 씁니다. iOS 빌드 실패로 릴리스가 만들어지지 않았을 때도 여기서 받을 수 있습니다.
- AAB 는 기기에 직접 설치할 수 없습니다. 릴리스 본문에 "Google Play 업로드용이며 직접 설치는 APK 를 받으라"는 안내가 자동으로 들어갑니다.
- 로컬에서 직접 빌드하려면 원본 keystore 와 워크플로의 서명 주입 단계를 재현해야 하므로, CI 산출물을 쓰는 것을 권장합니다.

### 6.5 첫 업로드 (수동)

Google Play Developer API 는 앱이 Play Console 에 먼저 만들어지고 첫 버전이 올라가 있어야 쓸 수 있으므로, **첫 업로드는 Play Console 에서 직접** 합니다.

1. **앱 만들기**
   - 앱 이름: 문제은행 / 기본 언어: 한국어 / 앱 / 무료
   - 무료로 출시한 앱은 나중에 유료로 바꿀 수 없습니다.
2. 대시보드의 **앱 설정** 작업을 끝냅니다. ([6.2](#62-사전-준비) 의 개인정보처리방침·앱 콘텐츠·스토어 등록정보)
3. **테스트 및 출시 → 테스트 → 내부 테스트** (또는 비공개 테스트) → **새 버전 만들기**
4. 앱 서명 키를 선택합니다. ([6.3](#63-앱-서명-키-결정-첫-업로드-전에))
5. 릴리스 Assets 에서 받은 `app-release.aab` 를 업로드합니다. ([6.4](#64-aab-빌드-같은-시크릿으로-서명))
   - 첫 업로드로 패키지명 `com.swpark3179.quizbank` 이 이 앱에 고정되며 이후 바꿀 수 없습니다.
6. 출시 노트를 입력하고 **저장 → 검토 → 출시** 합니다.
7. **테스터** 탭에서 이메일 목록을 만들고, 참여 링크를 테스터에게 공유합니다.

업로드 후 **앱 무결성 → Play 앱 서명** 화면에서 **업로드 키 인증서**의 SHA-1 / SHA-256 이 `keytool -list -v` 결과와 같은지 확인합니다.

### 6.6 테스트 트랙 → 프로덕션

| 트랙 | 대상 | 비고 |
|------|------|------|
| 내부 테스트 | 최대 100명 | 검토가 빠름. 개인 계정의 12명·14일 요건에는 **포함되지 않음** |
| 비공개 테스트 | 이메일 목록·Google 그룹 | 개인 계정은 여기서 **12명 이상, 14일 연속** 참여 필요 |
| 프로덕션 | 전체 사용자 | 개인 계정은 대시보드에서 프로덕션 액세스 신청 → 승인 후 출시 |

- 테스트 도중 참여자가 12명 아래로 줄면 14일 기간이 다시 시작될 수 있으니 여유 있게 모집하세요.
- 프로덕션 출시 때는 **단계적 출시** 비율(예: 20% → 50% → 100%)을 정해 문제를 일찍 발견할 수 있습니다.
- 이후 업데이트는 새 versionCode 로 빌드한 AAB 를 같은 방법으로 업로드합니다. 버전 증가는 워크플로가 처리합니다.

### 6.7 (선택) Play 업로드 자동화

첫 업로드가 끝난 뒤에는 서비스 계정으로 업로드를 자동화할 수 있습니다. **새로 등록할 시크릿은 서비스 계정 키 하나뿐**이고, 서명은 기존 시크릿을 그대로 씁니다.

1. **Google Cloud Console**
   1. 프로젝트를 만들거나 고릅니다.
   2. **Google Play Android Developer API** 를 사용 설정합니다.
   3. **IAM 및 관리자 → 서비스 계정** 에서 서비스 계정을 만들고 **JSON 키**를 생성해 내려받습니다.
2. **Play Console → 사용자 및 권한 → 새 사용자 초대**
   - 이메일: 서비스 계정 이메일 (`...@<project>.iam.gserviceaccount.com`)
   - 앱 권한: 문제은행 앱만 추가하고, 출시 관련 권한(테스트 트랙 출시, 필요하면 프로덕션 출시)을 줍니다.
3. **GitHub Secret 추가**: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` ← JSON 파일 내용 전체
   ```bash
   gh secret set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON < service-account.json
   ```
   JSON 파일은 등록 후 저장소 밖에 보관하거나 삭제합니다. (`google-service-account.json` 이름은 `.gitignore` 대상입니다.)
4. **워크플로에 입력값과 잡 추가** (`build-android` 잡이 이미 올리는 `app-release-aab` 아티팩트를 사용합니다 — [6.4](#64-aab-빌드-같은-시크릿으로-서명))

```yaml
on:
  workflow_dispatch:
    inputs:
      # ... 기존 version_bump, upload_testflight ...
      upload_google_play:
        description: 'Upload Android build to Google Play (internal track)'
        required: true
        default: false
        type: boolean
```

```yaml
  submit-google-play:
    name: Upload Android to Google Play
    needs: build-android
    if: ${{ github.event.inputs.upload_google_play == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - name: Download AAB artifact
        uses: actions/download-artifact@v4
        with:
          name: app-release-aab

      - name: Upload to Google Play
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: com.swpark3179.quizbank
          releaseFiles: app-release.aab
          track: internal
          status: completed
```

- 앱이 아직 한 번도 검토·출시되지 않은 **초안** 상태라면 `status: draft` 로 올려야 합니다. (아니면 `Only releases with status draft may be created on draft app` 오류)
- `track` 은 `internal` / `alpha`(비공개 테스트) / `beta`(공개 테스트) / `production` 중에서 고릅니다. 처음에는 `internal` 로 두고 Play Console 에서 상위 트랙으로 승격하는 방식을 권장합니다.
- `eas.json` 의 `submit` 설정(`serviceAccountKeyPath`)은 EAS Submit 용이며, 이 저장소의 CI 는 EAS 를 쓰지 않으므로 사용되지 않습니다.

---

## 7. 배포 전 체크리스트

- [ ] 배포할 변경이 모두 `master` 에 머지되어 있다
- [ ] 로컬에서 `pnpm test` · `pnpm lint` 가 통과한다
- [ ] 변경 규모에 맞는 `version_bump` 를 골랐다 (patch / minor / major)
- [ ] `Verify release signing` 단계가 통과했다 (release keystore · APK · AAB 의 SHA-256 일치)
- [ ] 릴리스에 `app-release.apk` · `app-release.aab` 가 함께 첨부되었다
- [ ] 실기기에서 설치·업데이트를 확인했다 (release 서명 첫 버전은 v1.5.1 이하 삭제 후 설치 — [3.4](#34-기존-사용자에게-미치는-영향))
- [ ] (Play) 앱 서명 키 방식을 정했다 — [6.3](#63-앱-서명-키-결정-첫-업로드-전에)
- [ ] (Play) 앱 콘텐츠 설문과 스토어 등록정보를 끝냈다
- [ ] 로컬 저장소에서 `git pull` 로 버전 bump 커밋을 받았다

---

## 8. 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| `ANDROID_KEYSTORE_BASE64 secret is missing` | 시크릿 미등록 또는 이름 오타 | `Settings → Secrets and variables → Actions` 에서 이름 확인 |
| `Keystore was tampered with, or password was incorrect` | store 비밀번호 불일치, 또는 base64 값 손상 | `ANDROID_KEYSTORE_PASSWORD` 확인, 줄바꿈 없는 base64 로 다시 등록 |
| `No key with alias '…' found in keystore` | alias 불일치 | `keytool -list` 로 alias 확인 후 `ANDROID_KEY_ALIAS` 수정 |
| `Failed to read key … from store …: Cannot recover key` | key 비밀번호 불일치 | `ANDROID_KEY_PASSWORD` 확인 (PKCS12 는 store 비밀번호와 같음) |
| `Failed to set "signingConfig signingConfigs.release" in buildTypes.release` / `Failed to inject signingConfigs.release` | Expo SDK 업그레이드 등으로 템플릿 `build.gradle` 구조가 바뀌어 주입 스크립트가 블록을 찾지 못함 | 로컬에서 `expo prebuild --platform android` 후 `android/app/build.gradle` 의 `signingConfigs` · `buildTypes` 를 보고 [3.2](#32-워크플로-수정) 의 정규식 수정 |
| `Verify release signing`: `Could not read the certificate from release.keystore` | `ANDROID_KEYSTORE_PASSWORD` 또는 `ANDROID_KEY_ALIAS` 불일치 | 위 keystore 항목과 같이 시크릿 확인 (보통 그 전에 Gradle 서명 단계에서 먼저 실패함) |
| `Verify release signing`: `signed with the public debug keystore` / `does not match the release keystore` | release 서명 주입이 적용되지 않았거나 다른 keystore 로 서명됨 | `Configure gradle signing` 로그의 `signingConfig` 줄 확인 ([3.2](#32-워크플로-수정)) |
| 내려받은 APK 서명에 `CN=Android Debug` 가 보임 | v1.5.1 이하 릴리스의 APK | 최신 릴리스의 APK 사용 ([3장](#3-release-서명-전환)) |
| `Failed to find package 'tools'` | `setup-android` 기본 패키지에 옛 `tools` 포함 | 이미 `packages: platform-tools` 로 수정됨. 워크플로를 바꿀 때 유지 |
| Gradle `Java heap space` / `Metaspace` | 빌드 메모리 부족 | `app.json` 의 `expo-build-properties` → `org.gradle.jvmargs` 조정 |
| `bump-version` push 실패 (`GH013: Repository rule violations`) | GitHub App 토큰이 룰셋 우회 대상이 아님 | `RELEASE_APP_ID` / `RELEASE_APP_PRIVATE_KEY` 확인, App 설치 여부와 룰셋 Bypass list 확인 |
| Release 가 만들어지지 않음 | iOS 빌드 실패로 `create-release` 미실행 | **Re-run failed jobs** (새 실행은 버전이 또 올라감). APK·AAB 는 Artifacts 에서 받을 수 있음 |
| 기기에서 "앱이 설치되지 않았습니다" (업데이트 시) | 서명이 다른 APK 이거나 versionCode 가 더 낮음 | 서명·versionCode 확인. 서명 전환 버전이라면 기존 앱 삭제 후 설치 (기록 삭제됨) |
| Play: 디버그 모드로 서명된 APK 또는 App Bundle | v1.5.1 이하 산출물을 올렸거나 서명 주입이 적용되지 않음 | 최신 릴리스의 `app-release.aab` 사용, `Verify release signing` 통과 여부 확인 ([3.2](#32-워크플로-수정)) |
| Play: 잘못된 키로 서명된 App Bundle | 업로드 키 불일치 | 업로드 키 인증서 SHA-1 비교. 키를 잃어버렸다면 Play Console 에서 업로드 키 재설정 요청 |
| Play: 버전 코드가 이미 사용됨 | 같은 versionCode 로 재업로드 | 워크플로를 다시 실행해 새 versionCode 로 빌드 |
| Play: 난독화 파일·네이티브 디버그 기호 경고 | R8 난독화를 쓰지 않아 mapping 파일이 없고, 네이티브 기호를 함께 올리지 않음 | 경고일 뿐 출시에는 문제없음 |

---

## 9. 참고 자료

- [Google Play 타겟 API 수준 요건](https://developer.android.com/google/play/requirements/target-sdk)
- [신규 개인 개발자 계정의 앱 테스트 요건](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Play 앱 서명 사용](https://support.google.com/googleplay/android-developer/answer/9842756)
- [Google Play Android Developer API 시작하기](https://developers.google.com/android-publisher/getting_started)
- [apksigner](https://developer.android.com/tools/apksigner)
- [r0adkll/upload-google-play](https://github.com/r0adkll/upload-google-play)
- 워크플로 원본: [`.github/workflows/native-build-testflight.yml`](../.github/workflows/native-build-testflight.yml)
