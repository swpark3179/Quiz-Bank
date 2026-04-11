// .md 파일을 require()로 임포트할 때의 타입 선언
// Metro가 에셋으로 처리하므로 number(모듈 ID)를 반환
declare module '*.md' {
  const value: number;
  export default value;
}
