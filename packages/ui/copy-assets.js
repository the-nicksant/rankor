const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/assets');
const destDir = path.join(__dirname, 'dist/assets');

function copyFolderSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source folder "${src}" does not exist.`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyFolderSync(srcDir, destDir);
console.log(`Assets copied from "${srcDir}" to "${destDir}".`);