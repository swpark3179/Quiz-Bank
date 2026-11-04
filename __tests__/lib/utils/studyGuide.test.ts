import { classifyGuideUrl, STUDY_GUIDE_URL } from '../../../lib/utils/studyGuide';

describe('classifyGuideUrl', () => {
  it('가이드 사이트 안의 주소는 internal', () => {
    expect(classifyGuideUrl(STUDY_GUIDE_URL)).toBe('internal');
    expect(classifyGuideUrl('https://swpark3179.github.io/Quiz-Bank/')).toBe('internal');
    expect(classifyGuideUrl('https://swpark3179.github.io/Quiz-Bank/index.dc.html#x')).toBe('internal');
    expect(classifyGuideUrl('https://swpark3179.github.io/Quiz-Bank?x=1')).toBe('internal');
    expect(classifyGuideUrl('https://swpark3179.github.io/Quiz-Bank#top')).toBe('internal');
    // 셸이 encodeURI 로 iframe 에 넣는 레슨 파일 (한글·공백 인코딩)
    expect(
      classifyGuideUrl(
        'https://swpark3179.github.io/Quiz-Bank/CCAR-F%20%EB%A0%88%EC%8A%A8%20-%2000%20%EB%A0%88%EC%8A%A8%20%EC%95%88%EB%82%B4.dc.html'
      )
    ).toBe('internal');
  });

  it('호스트 대소문자와 http 는 가리지 않는다', () => {
    expect(classifyGuideUrl('HTTPS://SWPARK3179.GITHUB.IO/Quiz-Bank/cca-f.dc.html')).toBe('internal');
    expect(classifyGuideUrl('http://swpark3179.github.io/Quiz-Bank/')).toBe('internal');
  });

  it('페이지가 스스로 만드는 about:/data:/blob: 문서는 internal', () => {
    expect(classifyGuideUrl('about:blank')).toBe('internal');
    expect(classifyGuideUrl('about:srcdoc')).toBe('internal');
    expect(classifyGuideUrl('data:text/html,hi')).toBe('internal');
    expect(classifyGuideUrl('blob:https://swpark3179.github.io/abc')).toBe('internal');
  });

  it('다른 사이트의 문서·PDF 는 external', () => {
    expect(classifyGuideUrl('https://platform.claude.com/docs/en/home')).toBe('external');
    expect(classifyGuideUrl('https://www.certsafari.com/anthropic')).toBe('external');
    expect(
      classifyGuideUrl(
        'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2Fx%2Fpublic%2F1%2FExam+Guide.pdf'
      )
    ).toBe('external');
  });

  it('비슷하게 생긴 다른 주소는 external', () => {
    expect(classifyGuideUrl('https://swpark3179.github.io/')).toBe('external');
    expect(classifyGuideUrl('https://swpark3179.github.io/other-repo/')).toBe('external');
    expect(classifyGuideUrl('https://swpark3179.github.io/Quiz-Bank-old/')).toBe('external');
    expect(classifyGuideUrl('https://swpark3179.github.io.evil.com/Quiz-Bank/')).toBe('external');
    expect(classifyGuideUrl('https://swpark3179.github.io@evil.com/Quiz-Bank/')).toBe('external');
    expect(classifyGuideUrl('https://evil.com/swpark3179.github.io/Quiz-Bank')).toBe('external');
  });

  it('다른 스킴은 external', () => {
    expect(classifyGuideUrl('mailto:someone@example.com')).toBe('external');
    expect(classifyGuideUrl('tel:010')).toBe('external');
    expect(classifyGuideUrl('intent://scan/#Intent;scheme=zxing;end')).toBe('external');
  });
});
