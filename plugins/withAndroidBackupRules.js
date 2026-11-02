// Android 자동 백업 / 기기 간 이전(스마트스위치 등)에서 SQLite DB 폴더를 제외한다.
//
// expo-sqlite 는 DB 를 files/SQLite/ 에 둔다 (quiz-bank.db 와 WAL 부속 파일 -wal, -shm).
// 기본값(allowBackup=true, 규칙 없음)이면 이 파일들이 통째로 백업·복원되는데,
// 다른 기기·이전 설치의 DB 가 어긋난 상태로 복원되면 첫 실행부터 DB 를 열지 못한다.
// 풀이 이력은 기기를 옮기면 이어지지 않는 대신, 설정(files/preferences.json) 등
// 나머지 데이터는 계속 백업한다.
//
// - android:fullBackupContent  : Android 11 이하 (API 23~30)
// - android:dataExtractionRules: Android 12 이상 (API 31+), 클라우드 백업과 기기 간 이전 모두
//
// 주의: expo-secure-store 처럼 같은 속성을 설정하는 플러그인을 추가하면 충돌하므로 규칙을 합쳐야 한다.
const fs = require('fs');
const path = require('path');
const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('expo/config-plugins');

const EXCLUDE = '<exclude domain="file" path="SQLite/" />';

const FULL_BACKUP_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    ${EXCLUDE}
</full-backup-content>
`;

const DATA_EXTRACTION_RULES = `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        ${EXCLUDE}
    </cloud-backup>
    <device-transfer>
        ${EXCLUDE}
    </device-transfer>
</data-extraction-rules>
`;

const FILES = {
  'quiz_bank_backup_rules.xml': FULL_BACKUP_CONTENT,
  'quiz_bank_data_extraction_rules.xml': DATA_EXTRACTION_RULES,
};

function withBackupRuleFiles(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const xmlDir = path.join(cfg.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res', 'xml');
      fs.mkdirSync(xmlDir, { recursive: true });
      for (const [name, contents] of Object.entries(FILES)) {
        fs.writeFileSync(path.join(xmlDir, name), contents);
      }
      return cfg;
    },
  ]);
}

function withBackupRuleAttributes(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
    app.$['android:fullBackupContent'] = '@xml/quiz_bank_backup_rules';
    app.$['android:dataExtractionRules'] = '@xml/quiz_bank_data_extraction_rules';
    return cfg;
  });
}

module.exports = function withAndroidBackupRules(config) {
  return withBackupRuleAttributes(withBackupRuleFiles(config));
};
