' Runs the auto-publish watcher completely hidden in the background
' (no console window). Double-click this file to start it.
'
' To check on it later, look at auto-publish.log in this same folder.
' To stop it, double-click "Stop Auto-Publish.bat".

Dim shell, fso, scriptDir
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = scriptDir

' 0 = hidden window, False = don't wait for it to finish
shell.Run "node scripts\watch-publish.js", 0, False
