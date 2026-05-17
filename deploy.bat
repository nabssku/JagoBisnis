@echo off
cd /d D:\portofolio\jagobisnis\backend

start cmd /k npm run start
start cmd /k cloudflared tunnel --config C:\Users\INTEL\.cloudflared\jagobisnis.yaml run