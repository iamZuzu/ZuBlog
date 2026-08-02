@echo off
setlocal
set SCRIPT_DIR=%~dp0
set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

echo Setting up automatic publishing to start whenever you log in...

> "%TEMP%\make-autopublish-shortcut.vbs" (
  echo Set oWS = WScript.CreateObject^("WScript.Shell"^)
  echo sLinkFile = "%STARTUP_DIR%\Blog Auto-Publish.lnk"
  echo Set oLink = oWS.CreateShortcut^(sLinkFile^)
  echo oLink.TargetPath = "%SCRIPT_DIR%Start Auto-Publish.vbs"
  echo oLink.WorkingDirectory = "%SCRIPT_DIR%"
  echo oLink.WindowStyle = 7
  echo oLink.Save
)
cscript //nologo "%TEMP%\make-autopublish-shortcut.vbs"
del "%TEMP%\make-autopublish-shortcut.vbs"

echo Done. From now on, auto-publish will start quietly in the background every time you log in.
echo.
echo Starting it now...
wscript "%SCRIPT_DIR%Start Auto-Publish.vbs"

echo.
echo You can check "auto-publish.log" in this folder any time to see what it's done.
echo To turn this off later, run "Uninstall Auto-Publish.bat".
pause
