/**
 * App Store 미리보기(스크린샷) 생성 스크립트
 *
 * ./source 의 원본 캡처 위에 디바이스 프레임과 한국어 마케팅 문구를 얹어
 * App Store 6.9" iPhone 규격(1290 x 2796)의 PNG 를 만든다.
 *
 * 사전 준비:
 *   npm i sharp
 *   Pretendard 폰트가 시스템에 설치되어 있어야 한다. (https://github.com/orioncactus/pretendard)
 *   설치 예시:
 *     npm i pretendard
 *     mkdir -p ~/.fonts && cp node_modules/pretendard/dist/public/static/Pretendard-*.ttf ~/.fonts/ && fc-cache -f
 *
 * 실행:
 *   node generate.js          # 전체 생성
 *   node generate.js 01-home.png   # 특정 슬라이드만
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DIR = __dirname;
const SRC_DIR = path.join(DIR, "source");

// App Store 6.9" iPhone (iPhone 16 Pro Max 등)
const W = 1290, H = 2796;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slides = [
  {
    src: "01-home.jpeg",
    out: "01-home.png",
    bg: ["#EEF1F8", "#D7DEEE"],
    blob: "#C7D2EA",
    head: ["원하는 분야를", "골라서 시작하세요"],
    sub: "카테고리별로 정리된 실전 문제 은행",
  },
  {
    src: "02-quiz.jpeg",
    out: "02-quiz.png",
    bg: ["#EAF0FA", "#CFDDF2"],
    blob: "#BBD0EE",
    head: ["실전처럼 풀어보는", "객관식 문제"],
    sub: "한 문제씩 집중하는 10문항 세트",
  },
  {
    src: "03-answer.jpeg",
    out: "03-answer.png",
    bg: ["#ECF3EA", "#D2E2CB"],
    blob: "#C2D8B6",
    head: ["정답과 함께", "친절한 해설까지"],
    sub: "왜 정답인지 한국어 해설로 확실하게",
  },
  {
    src: "04-stats.jpeg",
    out: "04-stats.png",
    bg: ["#FAF3E6", "#EBDFC6"],
    blob: "#E2D2AE",
    head: ["내 실력 변화를", "한눈에 확인"],
    sub: "차수별 정답률과 추이를 그래프로",
  },
];

function bgSvg(s) {
  const headFont = 100, headLH = 122, headTop = 250;
  const heads = s.head
    .map((line, i) => `<text x="${W / 2}" y="${headTop + i * headLH}" text-anchor="middle" font-family="Pretendard ExtraBold" font-weight="800" font-size="${headFont}" fill="#1E2A44" letter-spacing="-2">${esc(line)}</text>`)
    .join("");
  const subY = headTop + s.head.length * headLH + 26;
  const sub = `<text x="${W / 2}" y="${subY}" text-anchor="middle" font-family="Pretendard Medium" font-weight="500" font-size="46" fill="#5A6679" letter-spacing="-1">${esc(s.sub)}</text>`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${s.bg[0]}"/>
      <stop offset="1" stop-color="${s.bg[1]}"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="120"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W * 0.85}" cy="${H * 0.22}" r="260" fill="${s.blob}" opacity="0.55" filter="url(#soft)"/>
  <circle cx="${W * 0.1}" cy="${H * 0.62}" r="300" fill="${s.blob}" opacity="0.4" filter="url(#soft)"/>
  ${heads}
  ${sub}
</svg>`);
}

async function framedPhone(srcPath, frameW) {
  const bezel = 22;
  const innerW = frameW - bezel * 2;
  const meta = await sharp(srcPath).metadata();
  const innerH = Math.round(meta.height * (innerW / meta.width));
  const frameH = innerH + bezel * 2;
  const innerR = Math.round(frameW * 0.115);
  const outerR = innerR + bezel;

  const shotMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${innerW}" height="${innerH}"><rect width="${innerW}" height="${innerH}" rx="${innerR}" ry="${innerR}"/></svg>`);
  const shot = await sharp(srcPath)
    .resize(innerW, innerH, { fit: "fill" })
    .composite([{ input: shotMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const frameSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}">
    <defs>
      <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2b2f37"/>
        <stop offset="0.5" stop-color="#15171c"/>
        <stop offset="1" stop-color="#2b2f37"/>
      </linearGradient>
    </defs>
    <rect width="${frameW}" height="${frameH}" rx="${outerR}" ry="${outerR}" fill="url(#b)"/>
  </svg>`);

  const buf = await sharp(frameSvg)
    .composite([{ input: shot, left: bezel, top: bezel }])
    .png()
    .toBuffer();

  return { buf, frameW, frameH };
}

async function shadowFor(frameW, frameH) {
  const r = Math.round(frameW * 0.13);
  const pad = 90;
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${frameW + pad * 2}" height="${frameH + pad * 2}"><rect x="${pad}" y="${pad}" width="${frameW}" height="${frameH}" rx="${r}" ry="${r}" fill="#1a2238" fill-opacity="0.32"/></svg>`);
  return { buf: await sharp(svg).blur(40).png().toBuffer(), pad };
}

async function makeSlide(s) {
  const frameW = 880;
  const phone = await framedPhone(path.join(SRC_DIR, s.src), frameW);
  const shadow = await shadowFor(phone.frameW, phone.frameH);
  const phoneLeft = Math.round((W - phone.frameW) / 2);
  const phoneTop = 660;

  const bg = await sharp(bgSvg(s)).png().toBuffer();
  await sharp(bg)
    .composite([
      { input: shadow.buf, left: phoneLeft - shadow.pad, top: phoneTop - shadow.pad + 28 },
      { input: phone.buf, left: phoneLeft, top: phoneTop },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(DIR, s.out));
  console.log("wrote", s.out);
}

(async () => {
  const only = process.argv[2];
  for (const s of slides) {
    if (only && s.out !== only) continue;
    await makeSlide(s);
  }
})();
