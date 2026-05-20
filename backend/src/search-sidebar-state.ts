import fs from 'fs';

const filePath =
  'd:\\portofolio\\JagoBisnis\\frontend\\src\\app\\dashboard\\business\\[id]\\website\\page.tsx';
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

console.log('Searching for panel/tab related code in page.tsx:');
lines.forEach((line, idx) => {
  if (
    line.includes('activeTab') ||
    line.includes('tab') ||
    line.includes('Tab') ||
    line.includes('Right Sidebar') ||
    line.includes('RightPanel')
  ) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
