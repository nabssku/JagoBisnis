"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const filePath = 'd:\\portofolio\\JagoBisnis\\frontend\\src\\app\\dashboard\\business\\[id]\\website\\page.tsx';
const content = fs_1.default.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');
console.log('Searching for panel/tab related code in page.tsx:');
lines.forEach((line, idx) => {
    if (line.includes('activeTab') ||
        line.includes('tab') ||
        line.includes('Tab') ||
        line.includes('Right Sidebar') ||
        line.includes('RightPanel')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
//# sourceMappingURL=search-sidebar-state.js.map