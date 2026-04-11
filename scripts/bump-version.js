#!/usr/bin/env node
/**
 * 버전 범프 스크립트
 * 사용: node scripts/bump-version.js [major|minor|patch]
 *
 * package.json과 app.json의 version 필드를 동시에 업데이트합니다.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
const APP_JSON_PATH = path.join(ROOT_DIR, 'app.json');

function main() {
  const bumpType = process.argv[2];
  if (!['major', 'minor', 'patch'].includes(bumpType)) {
    console.error('❌ Usage: node bump-version.js [major|minor|patch]');
    process.exit(1);
  }

  // package.json 읽기
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const [major, minor, patch] = pkg.version.split('.').map(Number);

  let newVersion;
  switch (bumpType) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }

  console.log(`📦 Version bump: ${pkg.version} → ${newVersion} (${bumpType})`);

  // package.json 업데이트
  pkg.version = newVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✅ Updated package.json`);

  // app.json 업데이트
  const appJson = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf8'));
  appJson.expo.version = newVersion;
  fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJson, null, 2) + '\n');
  console.log(`✅ Updated app.json`);

  console.log(`\n🎉 Version bumped to ${newVersion}`);
  console.log(`   → Run: git add -A && git commit -m "chore: bump version to v${newVersion}" && git tag v${newVersion}`);
}

main();
