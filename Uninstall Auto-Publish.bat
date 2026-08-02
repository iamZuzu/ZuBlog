@echo off
setlocal
cd /d %~dp0
set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

if exist auto-publish.pid (
  set /p PID=<auto-publish.pid
  taskkill /PID %PID% /F >nul 2>&1
  del auto-publish.pid >nul 2>&1
)

del "%STARTUP_DIR%\Blog Auto-Publish.lnk" >nul 2>&1
echo Auto-publish has been stopped and removed from startup — it will no longer run automatically.
pause
