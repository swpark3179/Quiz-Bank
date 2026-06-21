# App Store 미리보기 (iOS)

문제은행 앱의 App Store 등록용 미리보기 스크린샷입니다.

## 결과물

각 이미지는 App Store **6.9" iPhone** 규격(`1290 x 2796`)으로 생성되며,
6.9" 슬롯에 그대로 업로드할 수 있습니다. (작은 디스플레이 슬롯은 App Store Connect 가 자동 스케일링)

| 순서 | 파일 | 화면 | 문구 |
| --- | --- | --- | --- |
| 1 | `01-home.png` | 카테고리 선택 | 원하는 분야를 골라서 시작하세요 |
| 2 | `02-quiz.png` | 문제 풀이 | 실전처럼 풀어보는 객관식 문제 |
| 3 | `03-answer.png` | 정답 · 해설 | 정답과 함께 친절한 해설까지 |
| 4 | `04-stats.png` | 정답률 통계 | 내 실력 변화를 한눈에 확인 |

`source/` 에는 프레임/문구를 입히기 전의 원본 캡처가 들어 있습니다.

## 다시 생성하기

문구·색상 변경이나 원본 캡처 교체 후 재생성하려면:

```bash
# 1) 의존성
npm i sharp

# 2) Pretendard 폰트 설치 (한국어 문구 렌더링용)
npm i pretendard
mkdir -p ~/.fonts
cp node_modules/pretendard/dist/public/static/Pretendard-*.ttf ~/.fonts/
fc-cache -f

# 3) 생성
node store/ios/generate.js            # 전체
node store/ios/generate.js 02-quiz.png # 특정 슬라이드만
```

문구·배경색은 `generate.js` 상단의 `slides` 배열에서 수정합니다.
원본 캡처를 바꾸려면 `source/` 의 같은 이름 파일을 교체하세요.
