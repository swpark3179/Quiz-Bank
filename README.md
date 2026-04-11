# Quiz Bank

객관식 퀴즈 풀기 앱 — Expo (React Native) + Firebase + Nord Light 테마

## 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Expo (React Native) + expo-router |
| 문제 저장 | Firebase Storage (.md 파일) |
| 카테고리 인덱스 | Firebase Firestore |
| 오프라인 캐시 | expo-file-system |
| 풀이 이력/통계 | expo-sqlite |
| 마크다운 렌더러 | react-native-marked |
| 테마 | Nord Light |
| CI/CD | GitHub Actions + EAS Build/Update/Submit |

## 화면 구성

```
홈 (카테고리 목록)
 └─ 문제 목록 (카테고리별 파일 목록 + 요약 통계)
     ├─ 퀴즈 설정 모달 (문제 수, 확인 방식, 파일 선택)
     └─ 퀴즈 진행
         └─ 결과 화면
             └─ 이력 목록 → 차수 상세 → 오답 재시험
통계 (차수별 정답률 차트)
```

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. **Android 앱 추가** → `google-services.json` 다운로드 → 프로젝트 루트에 배치
3. **iOS 앱 추가** → `GoogleService-Info.plist` 다운로드 → 프로젝트 루트에 배치
4. **Firestore Database** 생성 (Native mode)
5. **Storage** 버킷 생성

> ⚠️ `google-services.json`, `GoogleService-Info.plist`는 `.gitignore`에 포함되어 있어 커밋되지 않습니다.

### 3. Firestore 데이터 구조 설정

```
categories/
  {categoryId}/
    name: "AI 기초"
    description: "AI 관련 기초 문제"
    icon: "brain-outline"       ← Ionicons 아이콘 이름
    order: 1
    quizFiles/
      {fileId}/
        name: "Chapter 1: 개요"
        storagePath: "quiz-data/ai-basics/chapter-01.md"
        questionCount: 10
        order: 1
```

### 4. Firebase Storage 구조

```
quiz-data/
  {categoryId}/
    chapter-01.md
    chapter-02.md
```

### 5. 앱 실행

```bash
# Expo Go (Firebase 네이티브 모듈 미지원 → 개발 빌드 필요)
npm run start:dev

# 개발 빌드 생성 (최초 1회)
eas build --profile development --platform android   # 또는 ios
```

---

## 문제 파일 형식

```markdown
## 문제 1
### **질문 텍스트 (마크다운 지원)**

| 보기 | 설명 |
|------|------|
| ① 보기1 | 설명1 |
| **② 보기2** | 설명2 |   ← 볼드 = 정답
| ③ 보기3 | 설명3 |
| ④ 보기4 | 설명4 |

**정답: ②**

**해설:**
해설 내용 (마크다운 지원, 표·코드블록 포함 가능)

---
```

---

## CI/CD 워크플로

| 워크플로 | 트리거 | 설명 |
|----------|--------|------|
| `release.yml` | `workflow_dispatch` | 버전 선택(major/minor/patch) → EAS 빌드 → GitHub Release |
| `store-release.yml` | `workflow_dispatch` | EAS Submit → App Store / Google Play |
| `ota-update.yml` | `push to main` | EAS Update → OTA 즉시 배포 |

### 필요한 GitHub Secrets

| 시크릿 | 필수 여부 | 용도 |
|--------|-----------|------|
| `EXPO_TOKEN` | 필수 | EAS 인증 |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | 스토어 배포 시 | Google Play 제출 |
| `ASC_KEY_ID` | 스토어 배포 시 | App Store Connect |
| `ASC_ISSUER_ID` | 스토어 배포 시 | App Store Connect |
| `ASC_API_KEY` | 스토어 배포 시 | App Store Connect |
| `EXPO_APPLE_TEAM_ID` | 스토어 배포 시 | Apple Team ID |

### 버전 범프 (로컬)

```bash
npm run bump:patch   # 1.0.0 → 1.0.1
npm run bump:minor   # 1.0.0 → 1.1.0
npm run bump:major   # 1.0.0 → 2.0.0
```

---

## 라이선스

MIT
