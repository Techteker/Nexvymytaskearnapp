
import fs from 'fs';
import path from 'path';

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        findFiles(filePath, fileList);
      }
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = findFiles('./src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  let inTag = false;
  let tagContent = '';
  let startLine = 0;
  
  lines.forEach((line, index) => {
    if (line.includes('<input') || line.includes('<textarea') || line.includes('<select')) {
      inTag = true;
      tagContent = line;
      startLine = index + 1;
    } else if (inTag) {
      tagContent += ' ' + line;
    }
    
    if (inTag && line.includes('>')) {
      inTag = false;
      if (tagContent.includes('value={') && !tagContent.includes('onChange={') && !tagContent.includes('readOnly')) {
        console.log(`${file}:${startLine} - Potential missing onChange in tag: ${tagContent.trim()}`);
      }
      tagContent = '';
    }
  });
});
