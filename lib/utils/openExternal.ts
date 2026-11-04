/**
 * 앱 밖으로 링크 열기
 *
 * - openInBrowser: 기기의 기본 브라우저 앱으로 연다 (홈 '학습 가이드' 카드의 ↗, 가이드 화면 헤더 버튼)
 * - openInBrowserTab: 앱 위에 뜨는 브라우저 탭(Android Custom Tabs / iOS SFSafariViewController)으로 연다.
 *   가이드 WebView 안의 외부 참고 링크·PDF 용 — 닫으면 읽던 가이드로 바로 돌아온다.
 */

import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Colors } from '@/lib/theme';

export function openInBrowser(url: string): void {
  Linking.openURL(url).catch((e) => {
    console.error('브라우저 열기 오류:', e);
  });
}

export async function openInBrowserTab(url: string): Promise<void> {
  // mailto: 등 브라우저 탭이 다루지 못하는 스킴은 OS 에 맡긴다
  if (!/^https?:/i.test(url)) {
    openInBrowser(url);
    return;
  }
  try {
    await WebBrowser.openBrowserAsync(url, {
      controlsColor: Colors.accent.primary,
      toolbarColor: Colors.bg.primary,
    });
  } catch {
    // Custom Tabs 를 지원하는 브라우저가 없거나, 이미 다른 탭이 떠 있는 경우
    openInBrowser(url);
  }
}
