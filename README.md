# 문제은행 (Quiz Bank)

> 마크다운으로 문제를 관리하고, GitHub 저장소를 데이터베이스처럼 활용하는 객관식 퀴즈 앱
>
> **Expo (React Native)** 기반 · **Android / iOS / Windows 데스크탑** 멀티 플랫폼 지원

별도의 백엔드 서버 없이, `assets/quiz-data/` 의 마크다운 파일과 `config.json` 만 수정·커밋하면 앱에 즉시 새 문제가 반영됩니다. 풀이 이력과 통계는 기기 내 SQLite 에 저장되어 오프라인에서도 학습 현황을 추적할 수 있습니다.

---

## ✨ 주요 기능

- **카테고리 기반 문제 풀이** — `config.json` 에 정의한 카테고리·파일 구조 그대로 메뉴가 구성됩니다.
- **유연한 출제 설정** — 출제할 파일·문제 수를 고르고, 채점 방식을 선택할 수 있습니다.
  - `즉시 채점(immediate)` : 한 문제를 풀 때마다 정답·해설을 바로 확인
  - `나중 채점(deferred)` : 전체를 푼 뒤 결과 화면에서 한 번에 채점
- **문제·보기 셔플** — Fisher–Yates 알고리즘으로 문제 순서와 보기 순서를 무작위로 섞고, 정답 인덱스를 자동으로 remapping 합니다.
- **마크다운 렌더링** — 문제 본문·보기·해설을 마크다운으로 작성하면 그대로 렌더링됩니다. (코드, 표, 링크 등)
- **풀이 이력 & 통계** — 차수(세션)별 풀이 기록을 저장하고, 카테고리별 정답률·추이를 차트로 시각화합니다.
- **오답 다시 풀기** — 틀린 문제만 모아 새로운 세트로 재시험할 수 있습니다.
- **Nord Light 테마** — 차분한 Nord 팔레트 기반의 일관된 UI.
- **오프라인 지원** — Windows 데스크탑 빌드는 문제 파일을 함께 패키징하여 네트워크 없이 동작합니다.

---

## 🧩 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Expo `~54` · React Native `0.81` · React `19` |
| 라우팅 | expo-router (typed routes) |
| 문제 데이터 | **GitHub Raw Fetching** (`assets/quiz-data/`) · 데스크탑은 로컬 번들 |
| 로컬 저장소 | expo-sqlite (풀이 이력·통계) |
| 마크다운 | react-native-marked |
| 차트 | react-native-gifted-charts |
| 테마 | Nord Light (`lib/theme/`) |
| 데스크탑 | Electron + electron-builder |
| 테스트 | Jest + ts-jest |
| CI/CD | GitHub Actions (네이티브 로컬 빌드) · EAS Update (OTA 채널) |

---

## 🏗 동작 방식

이 앱은 Firebase 같은 별도 백엔드 없이 **GitHub 저장소를 무료 콘텐츠 데이터베이스**처럼 사용합니다.

```
GitHub 저장소 (assets/quiz-data/)
        │  raw fetch
        ▼
   config.json ──▶ 카테고리/파일 목록 구성
        │
        ▼
   {category}/*.md ──▶ quizParser ──▶ shuffler ──▶ 출제
                                          │
                                          ▼
                                  expo-sqlite (sessions / answers)
                                          │
                                          ▼
                                   이력 · 통계 화면
```

- ✅ **백엔드 설정 불필요** — 네이티브 모듈·키 파일 없이 곧바로 실행됩니다.
- ✅ **즉각적인 콘텐츠 업데이트** — 앱을 다시 빌드/배포하지 않아도, GitHub 에 `.md` · `config.json` 을 커밋하는 즉시 새 문제가 반영됩니다.
- ✅ **트래픽 비용 무료** — GitHub 서버를 통해 콘텐츠를 제공하므로 별도 데이터 요금이 발생하지 않습니다.

---

## 📁 프로젝트 구조

```
app/                      # expo-router 화면 (파일 기반 라우팅)
  index.tsx               #   홈 — 카테고리 목록
  [category]/index.tsx    #   카테고리 상세 / 출제 설정
  [category]/quiz.tsx     #   퀴즈 풀이 화면
  result.tsx              #   결과 / 채점 화면
  history/                #   풀이 이력
  stats/[category].tsx    #   카테고리별 통계
components/
  quiz/                   # ChoiceItem · ProgressBar · ExplanationSheet
  ui/                     # NordButton · NordCard · NordBadge 등 디자인 컴포넌트
  MarkdownViewer.tsx      # 마크다운 렌더러
lib/
  parser/quizParser.ts    # 마크다운 → 문제 객체 파싱
  quiz/shuffler.ts        # 문제·보기 셔플 + 정답 remapping
  db/                     # expo-sqlite 스키마 · 세션 · 통계 쿼리
  theme/                  # Nord Light 컬러·스타일 토큰
  local/                  # 로컬(오프라인) 문제 로딩
assets/quiz-data/         # ⭐ 문제 콘텐츠 (config.json + 카테고리별 .md)
electron/                 # Windows 데스크탑 셸
.github/workflows/        # CI/CD (네이티브 빌드 · 데스크탑 릴리스)
```

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install      # 또는 npm install
```

### 2. 개발 서버 실행

```bash
pnpm start        # expo start — Expo Go 로 즉시 테스트 가능
```

| 명령 | 설명 |
|------|------|
| `pnpm start` | Expo 개발 서버 |
| `pnpm android` / `pnpm ios` | 네이티브 디바이스/시뮬레이터 실행 |
| `pnpm web` | 웹 브라우저 실행 |
| `pnpm desktop:dev` | Electron 데스크탑 셸 실행 |
| `pnpm test` | Jest 테스트 |
| `pnpm lint` | ESLint 검사 |

---

## 📝 문제 관리 (GitHub 을 DB 로 쓰는 법)

새 카테고리·문제를 추가하려면 `assets/quiz-data/` 의 파일을 수정하고 **GitHub 에 Push** 하면 됩니다. 앱 재배포 없이 즉시 반영됩니다.

### 1) 마크다운 문제 파일 작성

`assets/quiz-data/{카테고리ID}/` 폴더 안에 `.md` 파일을 만들고 아래 형식으로 작성합니다. **보기 중 정답은 볼드(`**…**`)로 표시**합니다.

```markdown
## 문제 1
### **다음 중 LLM 의 약자로 올바른 것은?**

| 보기 | 설명 |
|------|------|
| ① Large Logic Module | 오답입니다. |
| **② Large Language Model** | 정답입니다. |
| ③ Long Latency Memory | 오답입니다. |
| ④ Linear Learning Map | 오답입니다. |

**정답: ②**

**해설:**
LLM 은 Large Language Model 의 약자입니다. 해설과 링크를 자유롭게 적습니다.

---
```

- 보기 기호는 `①②③④…` 외에 `1. 2.` / `A. B.` 형식도 인식합니다.
- `---` (구분선) 또는 다음 `## 문제` 가 한 문제의 끝을 의미합니다.
- 문제 순서와 보기 순서는 출제 시 자동으로 섞입니다.

### 2) `config.json` 등록

앱은 실행 시 `assets/quiz-data/config.json` 을 가장 먼저 읽어 메뉴를 구성합니다. 추가한 파일 정보를 여기에 기입합니다.

```json
[
  {
    "id": "ai-basics",
    "name": "AI 기초",
    "description": "인공지능 개념 문제",
    "icon": "brain-outline",
    "order": 1,
    "files": [
      {
        "id": "chapter-01",
        "name": "Chapter 1: AI 개요",
        "questionCount": 5,
        "order": 1
      }
    ]
  }
]
```

### 3) 커밋 & Push

변경사항을 기본 브랜치(`master`)에 커밋/푸시하면, 앱스토어·OTA 배포를 거치지 않고 **사용자가 앱을 여는 즉시** 새 데이터가 표출됩니다.

---

## 📦 빌드 & 배포

배포는 **콘텐츠 배포**와 **앱(바이너리) 배포** 두 갈래로 나뉩니다.

### A. 콘텐츠 배포 (문제 업데이트)

위 [문제 관리](#-문제-관리-github-을-db-로-쓰는-법) 절차대로 `assets/quiz-data/` 를 커밋/Push 하면 끝입니다. 재빌드가 필요 없습니다.

### B. 앱 바이너리 배포 (GitHub Actions)

네이티브 빌드는 **Expo Cloud(EAS Build)를 사용하지 않고 GitHub Actions 러너에서 직접** 수행합니다. (`expo prebuild` 로 네이티브 프로젝트를 생성한 뒤 Gradle / xcodebuild 로 빌드)

#### `App Build & Release` 워크플로 (`native-build-testflight.yml`)

`Actions` 탭에서 수동 실행(`workflow_dispatch`)하며, 버전 증가 방식(`patch`/`minor`/`major`)과 TestFlight 업로드 여부를 선택합니다.

| 단계 | 내용 |
|------|------|
| **bump-version** | 버전 증가 → 커밋 → `vX.Y.Z` 태그 생성 & Push |
| **build-android** | `expo prebuild` → Gradle 로 **release APK** 빌드 |
| **build-ios** | macOS 러너 + Xcode 26 → `xcodebuild` 로 archive/export → **IPA** |
| **submit-testflight** | `altool` 로 App Store Connect(TestFlight) 업로드 |
| **create-release** | APK + IPA 를 첨부한 **GitHub Release** 생성 |

#### `Windows Desktop Release` 워크플로 (`windows-desktop-release.yml`)

위 워크플로가 성공하면 `workflow_run` 으로 자동 트리거됩니다. (수동 실행도 가능)

1. `expo export --platform web` 으로 정적 웹 산출물 생성
2. `electron-builder` 로 Windows 데스크탑 **zip** 패키징 (문제 파일을 `quiz-data/` 로 동봉 → 오프라인 동작)
3. 해당 릴리스에 `QuizBank-{version}-portable.zip` 첨부 + 사용 안내 추가

#### 버전 관리

```bash
pnpm bump:patch   # 1.4.2 → 1.4.3
pnpm bump:minor   # 1.4.2 → 1.5.0
pnpm bump:major   # 1.4.2 → 2.0.0
```

`package.json` 과 `app.json` 의 버전이 함께 갱신되며, CI 의 bump 단계에서 자동으로 호출됩니다.

> **필요한 GitHub Secrets** — Android 서명(`ANDROID_KEYSTORE_*`), iOS 코드 서명(`IOS_P12_*`, `IOS_PROVISIONING_*`, `IOS_TEAM_ID` 등), TestFlight 업로드(`ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`), 릴리스 봇 토큰(`RELEASE_APP_ID`, `RELEASE_APP_PRIVATE_KEY`). 자세한 항목은 워크플로 파일 상단 주석을 참고하세요.

### 설치 방법 (최종 사용자)

- **Android** — Release 의 `app-release.apk` 를 다운로드해 설치 (출처를 알 수 없는 앱 설치 허용 필요)
- **iOS** — TestFlight / App Store 를 통해 배포 (IPA 직접 설치 불가)
- **Windows** — `QuizBank-*-portable.zip` 압축 해제 후 `Quiz Bank.exe` 실행 · `Ctrl + +/-` 로 문제 텍스트 확대/축소

---

## 💾 데이터 & 통계

풀이 기록은 기기 내 SQLite(`quiz-bank.db`)에 저장됩니다.

- **`sessions`** — 풀이 차수 단위 기록 (카테고리, 출제 파일, 총 문항·정답 수, 채점 모드, 시각)
- **`answers`** — 차수 내 개별 응답 (선택/정답 인덱스, 정오답, 해설, 출제 순서)

이 데이터를 바탕으로 카테고리별 정답률·추이 차트와 차수별 상세 이력을 제공합니다.

---

## 🧪 테스트

```bash
pnpm test
```

`__tests__/` 의 Jest 테스트로 파서·셔플러 등 핵심 로직을 검증합니다.
