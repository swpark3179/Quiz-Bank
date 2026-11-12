/**
 * 화면이 한 번 그려질 때까지 기다린다.
 *
 * 버튼에 로딩 표시를 켜고 곧바로 무거운 동기 작업을 시작하면, 로딩 표시가 그려지기도 전에 JS 가 막혀
 * 화면이 멈춘 듯 보인다 (이미 받아 둔 데이터를 await 해도 마이크로태스크라 프레임을 넘기지 않는다).
 * 다음 프레임 뒤로 미뤄 로딩 상태가 화면에 붙고 애니메이션(UI 스레드)이 시작된 다음에 작업을 이어 간다.
 */
export function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
}
