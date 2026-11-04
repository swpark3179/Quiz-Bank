import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Redirect, useFocusEffect, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import type {
  ShouldStartLoadRequest,
  WebViewNativeEvent,
  WebViewOpenWindowEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { NordButton } from '@/components/ui/NordButton';
import { STUDY_GUIDE_URL, classifyGuideUrl } from '@/lib/utils/studyGuide';
import { openInBrowser, openInBrowserTab } from '@/lib/utils/openExternal';

const isWebUrl = (url: string) => /^https?:/i.test(url);

/**
 * 학습 가이드(GitHub Pages)를 앱 안에서 보는 화면.
 * 웹(데스크탑 Electron 포함)은 WebView 를 지원하지 않아 홈 카드가 브라우저로 바로 연다.
 */
export default function GuideScreen() {
  if (Platform.OS === 'web') return <Redirect href="/" />;
  return <GuideWebView />;
}

function GuideWebView() {
  const navigation = useNavigation();
  const webRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  // 헤더 '브라우저로 열기'가 지금 보고 있는 레슨(#해시 포함)을 그대로 열도록 기억한다
  const [currentUrl, setCurrentUrl] = useState(STUDY_GUIDE_URL);
  // 오류 화면의 '다시 시도'는 WebView 를 새로 마운트해 처음부터 불러온다
  const [mountKey, setMountKey] = useState(0);

  const syncNavState = useCallback((nav: WebViewNativeEvent) => {
    setCanGoBack(nav.canGoBack);
    if (isWebUrl(nav.url) && classifyGuideUrl(nav.url) === 'internal') setCurrentUrl(nav.url);
  }, []);

  // 헤더: 오른쪽 '브라우저로 열기'. iOS 는 웹 히스토리가 있으면 가장자리 스와이프를
  // WebView 뒤로 가기에 넘기고, 첫 페이지에서만 화면 닫기 제스처를 쓴다.
  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: !canGoBack,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => openInBrowser(currentUrl)}
          style={styles.headerButton}
          accessibilityRole="link"
          accessibilityLabel="브라우저로 열기"
        >
          <Ionicons name="open-outline" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, canGoBack, currentUrl]);

  // Android 뒤로 가기: 가이드 안에서 이동했으면 한 단계 뒤로, 첫 페이지면 화면을 닫는다
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!canGoBack) return false;
        webRef.current?.goBack();
        return true;
      });
      return () => sub.remove();
    }, [canGoBack])
  );

  // 같은 창(최상위·iframe) 이동: 가이드 사이트 안이면 허용, 다른 사이트(문서·PDF 등)는 브라우저 탭으로.
  // iOS 는 iframe 이 스스로 불러오는 문서에도 호출되므로, 사용자가 누른 이동만 밖으로 연다.
  const handleShouldStartLoad = useCallback((req: ShouldStartLoadRequest) => {
    if (classifyGuideUrl(req.url) === 'internal') return true;
    const userInitiated = Platform.OS !== 'ios' || req.isTopFrame || req.navigationType === 'click';
    if (userInitiated) openInBrowserTab(req.url);
    return false;
  }, []);

  // 새 창(target="_blank") 링크: 처리하지 않으면 Android 에서는 아무 일도 일어나지 않는다.
  // 가이드 안의 페이지('새 탭 ↗' 버튼)는 지금 화면에서, 외부 링크는 브라우저 탭으로 연다.
  const handleOpenWindow = useCallback((e: WebViewOpenWindowEvent) => {
    const { targetUrl } = e.nativeEvent;
    if (classifyGuideUrl(targetUrl) === 'external') {
      openInBrowserTab(targetUrl);
    } else if (isWebUrl(targetUrl)) {
      webRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(targetUrl)}; true;`);
    }
  }, []);

  const reload = useCallback(() => webRef.current?.reload(), []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <WebView
        key={mountKey}
        ref={webRef}
        source={{ uri: STUDY_GUIDE_URL }}
        style={styles.webView}
        // 허용 여부는 handleShouldStartLoad 가 정한다 (기본값이면 data: 등이 Linking 으로 새어 나간다)
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onOpenWindow={handleOpenWindow}
        onNavigationStateChange={syncNavState}
        onLoadProgress={(e) => syncNavState(e.nativeEvent)}
        allowsBackForwardNavigationGestures
        // 메모리 부족 등으로 웹 콘텐츠 프로세스가 끝나면 빈 화면 대신 다시 불러온다
        onContentProcessDidTerminate={reload}
        onRenderProcessGone={reload}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={Colors.accent.primary} />
          </View>
        )}
        renderError={() => (
          <View style={styles.overlay}>
            <Ionicons name="cloud-offline-outline" size={56} color={Colors.text.tertiary} />
            <Text style={styles.errorText}>
              학습 가이드를 불러오지 못했어요.{'\n'}인터넷 연결을 확인해주세요.
            </Text>
            <NordButton
              label="다시 시도"
              onPress={() => setMountKey((k) => k + 1)}
              style={styles.retryButton}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  webView: {
    backgroundColor: Colors.bg.primary,
  },
  headerButton: {
    padding: Spacing.xs,
  },
  // WebView 가 로딩·오류 화면을 자기 위에 겹쳐 그리므로 전체를 덮는다
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxxl,
    backgroundColor: Colors.bg.primary,
  },
  errorText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * 1.6,
  },
  retryButton: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
});
