"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const filePath = 'd:\\portofolio\\JagoBisnis\\frontend\\src\\app\\dashboard\\business\\[id]\\website\\page.tsx';
const content = fs_1.default.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');
const start = 500;
const end = 650;
for (let i = start; i < end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}
//# sourceMappingURL=print-upload-handler-2.js.map