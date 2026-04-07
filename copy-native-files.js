// copy-native-files.js
// Ejecutar después de npx expo prebuild para restaurar módulos nativos
const fs = require('fs');
const path = require('path');

const nativeDir = path.join(__dirname, 'native-android');
const targetDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'java', 'com', 'wilmer2', 'TaskDashboard');

if (!fs.existsSync(nativeDir)) {
  console.log('No native-android folder found, skipping...');
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });
const files = fs.readdirSync(nativeDir);
files.forEach(file => {
  fs.copyFileSync(path.join(nativeDir, file), path.join(targetDir, file));
  console.log(`Copied: ${file}`);
});
console.log('Native files restored!');