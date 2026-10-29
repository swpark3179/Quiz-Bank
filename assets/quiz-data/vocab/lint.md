코드를 실행하지 않고 **스타일 위반·잠재 오류를 자동으로 검사하는** 것입니다. 그런 검사 도구를 *linter*(예: ESLint)라 하고, *lint:fix* 처럼 고칠 수 있는 것은 자동으로 고치기도 합니다.

## 문제 속 쓰임
> Add 'After editing TypeScript files, always run npm run **lint**:fix' to `CLAUDE.md`
> `CLAUDE.md` 에 "TypeScript 파일을 편집한 뒤에는 항상 npm run **lint**:fix를 실행하라"를 추가한다

## 함께 쓰는 표현
- **run lint / linting** : 린트를 돌리다
- **lint error / warning** : 린트 오류 / 경고
- **linter** : 린트 도구

## 시험 포인트
"파일을 쓸 때마다 **자동으로** 린트"처럼 매번 보장해야 하는 동작은 CLAUDE.md 지시가 아니라, `Write` 에 매칭한 **`PostToolUse` 훅**으로 설정하는 것이 정답입니다.
