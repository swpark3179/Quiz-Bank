# Quiz Bank

객관식 퀴즈 풀기 앱 — Expo (React Native) + Local File Bundle + Nord Light 테마

## 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Expo (React Native) + expo-router |
| 문제 저장 | 로컬 에셋 번들 (assets/quiz-data/*.md) |
| 오프라인 캐시 | expo-asset, expo-file-system |
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

### 2. 앱 실행

Firebase 등 외부 서버 의존성이 없으므로, 로컬 환경에서 Expo Go를 통해 즉시 실행 가능합니다.

```bash
npx expo start
```

---

## 문제 추가 방법

Firebase 없이 로컬 번들로 문제를 앱 내부에 포함합니다. 새로운 문제를 추가하려면 다음 단계를 따릅니다.

### 1. 문제 마크다운 파일 작성

`assets/quiz-data/{카테고리ID}/` 폴더에 `.md` 파일을 생성하고 작성합니다.

```markdown
## 문제 1
### **다음 중 텍스트 외에 음성, 이미지, 비디오 등 다양한 형식의 데이터를 동시에 처리할 수 있는 모델은?**

| 보기 | 설명 |
|------|------|
| ① LLM (Large Language Model) | 대규모 언어 모델, 텍스트 데이터 처리에 특화 |
| **② LMM (Large Multimodal Model)** | 대형 멀티모달 모델 |
| ③ RNN (Recurrent Neural Network) | 순환 신경망, 순차 데이터 처리 |
| ④ CNN (Convolutional Neural Network) | 합성곱 신경망, 이미지 처리에 주로 사용 |

**정답: ②**

**해설:**
LMM(Large Multimodal Model)은 텍스트뿐만 아니라 이미지, 오디오, 비디오 등 다양한 유형의 데이터를 동시에 처리할 수 있는 AI 모델입니다.

---
```

**작성 규칙:**
- 각 문제는 `## 문제 N`으로 시작
- 질문은 `### **질문**`으로 작성
- 정답 보기는 `**볼드**` 처리
- 문제 간은 `---` 텍스트로 구분
- 보기는 ①②③④ 형태를 권장

### 2. config.ts 설정 업데이트

`assets/quiz-data/config.ts` 파일을 열어 다음 두 곳을 수정합니다.

1. **`FILE_MODULE_MAP`에 모듈 등록**:
```typescript
export const FILE_MODULE_MAP: Record<string, number> = {
  // 등록 예시
  'category-id/file-id': require('./category-id/file-id.md'),
};
```

2. **`QUIZ_CONFIG`에 항목 추가**:
```typescript
export const QUIZ_CONFIG: CategoryConfig[] = [
  {
    id: 'category-id',
    name: '카테고리 이름',
    // ...
    files: [
      { id: 'file-id', name: '파일 이름', questionCount: 1, order: 1 },
    ],
  }
];
```

저장 후 앱을 재시작하면 새로운 문제가 리스트에 노출됩니다.

---

## CI/CD 워크플로

| 워크플로 | 트리거 | 설명 |
|----------|--------|------|
| `release.yml` | `workflow_dispatch` | 버전 선택(major/minor/patch) → EAS 빌드 → GitHub Release |
| `store-release.yml` | `workflow_dispatch` | EAS Submit → App Store / Google Play |
| `ota-update.yml` | `push to main` | EAS Update → OTA 즉시 배포 (로컬 에셋 포함) |

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
