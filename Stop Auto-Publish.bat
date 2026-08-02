@echo off
cd /d %~dp0

if not exist auto-publish.pid (
  echo Auto-publish doesn't seem to be running right now ^(no auto-publish.pid file found^).
  echo If you think it should be, open Task Manager and look for a "Node.js" process.
  pause
  exit /b
)

set /p PID=<auto-publish.pid
taskkill /PID %PID% /F >nul 2>&1
del auto-publish.pid >nul 2>&1
echo Auto-publish stopped.
pause
