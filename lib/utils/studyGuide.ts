/**
 * 학습 가이드(GitHub Pages, `pages/` 폴더) 주소와 링크 분류
 *
 * 앱 안 WebView 화면(app/guide.tsx)이 어떤 이동을 WebView 안에서 열고
 * 어떤 이동을 밖(브라우저 탭)으로 보낼지 정한다.
 * react-native 를 import 하지 않는 순수 함수라 jest(node)에서 바로 테스트한다.
 */

/** GitHub Pages로 배포된 레슨·자습 가이드 모음 */
export const STUDY_GUIDE_URL = 'https://swpark3179.github.io/Quiz-Bank';

export type GuideLinkKind = 'internal' | 'external';

// 가이드 사이트 안의 주소: 호스트 뒤에 곧바로 '/Quiz-Bank' 가 오고, 그 뒤는 끝·'/'·'?'·'#' 이어야 한다.
// (RN 의 URL polyfill 은 hostname/pathname 을 지원하지 않아 정규식으로 판별한다)
const GUIDE_SITE = /^https?:\/\/swpark3179\.github\.io\/Quiz-Bank(?:[/?#]|$)/i;

// 페이지가 스스로 만드는 문서 — iframe 의 초기 about:blank 등
const LOCAL_SCHEME = /^(?:about|data|blob):/i;

/**
 * WebView 안에서 열 주소(internal)인지, 밖으로 보낼 주소(external)인지 분류한다.
 * 다른 사이트의 문서·PDF, mailto: 같은 다른 스킴은 모두 external.
 */
export function classifyGuideUrl(url: string): GuideLinkKind {
  if (LOCAL_SCHEME.test(url) || GUIDE_SITE.test(url)) return 'internal';
  return 'external';
}
