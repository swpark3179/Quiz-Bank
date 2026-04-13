# Quiz Bank

객관식 퀴즈 풀기 앱 — Expo (React Native) + GitHub Raw DB + Nord Light 테마

## 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Expo (React Native) + expo-router |
| 문제 실시간 로드 | **GitHub Raw Fetching (`assets/quiz-data/`)** |
| 풀이 이력/통계 | expo-sqlite |
| 마크다운 렌더러 | react-native-marked |
| 테마 | Nord Light |
| CI/CD | GitHub Actions + EAS Build/Update/Submit |

## 구조 및 장점

이 앱은 Firebase와 같은 백엔드 없이 **GitHub 저장소를 무료 데이터베이스**처럼 활용합니다.
GitHub의 `assets/quiz-data/config.json`과 마크다운 파일을 실시간(Fetch)으로 읽어오므로 다음과 같은 장점이 있습니다.

✅ **Firebase 설정 불필요**: 네이티브 모듈 및 키 파일 설정 없이 곧바로 실행
✅ **즉각적인 콘텐츠 업데이트**: 코드를 수정하거나 앱(EAS)을 빌드/배포하지 않아도 GitHub에 `config.json`과 `.md` 파일을 수정(커밋)하는 즉시 앱 화면에 새로운 문제 데이터가 반영됩니다.
✅ **데이터 요금 무료**: GitHub 서버 환경을 사용하여 트래픽 요금이 발생하지 않습니다.

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 앱 실행

Expo Go 환경에서 추가 설정 없이 곧바로 테스트가 가능합니다.

```bash
npx expo start
```

---

## 문제 관리 (GitHub을 DB로 사용하는 법)

새로운 카테고리와 문제를 추가(배포)하려면 `assets/quiz-data/` 내의 파일들을 변경하고 **GitHub에 Push**하면 됩니다.

1. **마크다운 파일 추가**: 
`assets/quiz-data/{카테고리ID}/` 폴더 안에 문제를 담은 `.md` 마크다운 파일을 생성합니다.

```markdown
## 문제 1
### **질문 제목**

| 보기 | 설명 |
|------|------|
| 1. 보기 1 | 오답 설명 |
| **2. 보기 2** | 정답은 볼드체로 작성해야 합니다. |

**정답: 2**

**해설:**
이곳에 해설과 링크 등을 자유롭게 적어줍니다.

---
```

2. **`config.json` 수정**:
`assets/quiz-data/config.json`에 새로 추가된 파일 정보를 기입합니다.
앱은 실행될 때 이 JSON 파일을 가장 먼저 확인합니다.

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

3. **변경사항을 GitHub의 main 브랜치에 커밋 및 Push**합니다.
   - 앱스토어나 EAS OTA 배포를 거치지 않고, 사용자가 앱을 여는 즉시 새로운 데이터가 표출됩니다!

---

## 라이선스

MIT
