import fs from 'fs';

const filePath = 'd:\\portofolio\\JagoBisnis\\frontend\\src\\app\\dashboard\\business\\[id]\\website\\page.tsx';
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const start = 1910;
const end = 1975;
for (let i = start; i < end; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
